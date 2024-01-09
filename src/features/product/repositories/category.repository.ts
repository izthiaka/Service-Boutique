import { Request } from "express"

import IDatasourceProductCategory from "../datasources/category.datasource"
import IRepository from "../../../core/interfaces/interface_repository"

import VerifyField from "../../../core/utils/verify_field"
import ProductCategorySpecificField from "../helpers/specific_field/category.specific_field"
import MatriculeGenerate from "../../../core/utils/matricule_generate"
import UrlFileUtil from "../../../core/utils/url_file"


interface IProductCategoryRepository extends IRepository {
    updatePictureByCode(req: Request, matricule: string, body: object): any
    resetPictureByCode(req: Request, matricule: string,): any
}

export default class ProductCategoryRepository
    extends VerifyField
    implements IProductCategoryRepository {
    private matricule = new MatriculeGenerate()

    constructor(private datasource: IDatasourceProductCategory) {
        super()
    }

    async getAll(page: string, limit: string) {
        try {
            const result = await this.datasource.findAll(page, limit)

            if (result.data.length !== 0) {
                const list = result.data.map((value: object) =>
                    ProductCategorySpecificField.fields(value),
                )
                return {
                    pagination: {
                        total: result.metadata[0].total,
                        page: result.metadata[0].page,
                    },
                    list,
                }
            }

            return []
        } catch (error: any) {
            throw Error(error)
        }
    }

    async save(body: any) {
        try {
            const data = ProductCategorySpecificField.fromBody(body)

            if (data.name) {
                const matchProductCategory = {
                    name: data.name,
                }
                const isExisteProductCategory = await this.datasource.isExiste(matchProductCategory)
                if (isExisteProductCategory) throw Error(`La Categorie [${data.name}] existe déjà dans la base`)
            }
                
            const code = this.matricule.generate()
            const bodyRequest = {
                ...data,
                code,
            }

            await this.datasource.store(bodyRequest)

            const result = await this.datasource.findOneByCode(code)
            return ProductCategorySpecificField.fields(result)
        } catch (error: any) {
            throw Error(error)
        }
    }

    async getOneByCode(code: string) {
        try {
            const result = await this.datasource.findOneByCode(code)
            if (this.isValid(result)) {
                return ProductCategorySpecificField.fieldsDetail(result)
            }
            throw Error("Categorie introuvable")
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    async update(code: string, body: object) {
        try {
            const result = await this.datasource.findOneByCode(code)
            if (this.isValid(result)) {
                const data = ProductCategorySpecificField.fromBody(body)
    
                if (data.name) {
                    const matchProductCategory = {
                        name: data.name,
                    }
                    const isExisteProductCategory = await this.datasource.isExisteAndReturnData(matchProductCategory)
                    if(isExisteProductCategory){
                        if (isExisteProductCategory.name !== result.name) throw Error(`La Categorie [${data.name}] existe déjà dans la base`)
                    }
                }

                const collection = await this.datasource.update(code, data)
                if (this.isValid(collection)) {
                    const data = await this.datasource.findOneByCode(code)
                    return ProductCategorySpecificField.fields(data)
                }
            }
            throw Error("Categorie introuvable")
        } catch (error: any) {
            throw Error(error)
        }
    }

    async getOne(match: object) {
        throw Error(`Fonction getOne excepted [${match}]`)
    }

    async getOneByName(name: string) {
        throw Error(`Fonction getOneByName excepted [${name}]`)
    }

    async deleteOne(code: string) {
        throw Error(`Fonction deleteOne excepted [${code}]`)
    }

    async updatePictureByCode(req: Request, code: string, body: object) {
        try {
            const result = await this.datasource.findOneByCode(code)
            if (this.isValid(result)) {
                const collection = await this.datasource.update(code, body)
                if (this.isValid(collection)) {
                    if (result.photo) {
                        UrlFileUtil.deleteFileAsset(
                            req,
                            result.photo
                        )
                    }
                    const data = await this.datasource.findOneByCode(code)
                    return ProductCategorySpecificField.fields(data)
                }
            }
            throw Error("Catégorie introuvable")
        } catch (error: any) {
            throw Error(error)
        }
    }

    async resetPictureByCode(req: Request, code: string) {
        try {
            const result = await this.datasource.findOneByCode(code)
            if (this.isValid(result)) {
                const body = { photo: null }
                const collection = await this.datasource.update(code, body)
                if (this.isValid(collection)) {
                if (result.photo) {
                    UrlFileUtil.deleteFileAsset(
                        req,
                        result.photo
                    )
                }
                    const data = await this.datasource.findOneByCode(code)
                    return ProductCategorySpecificField.fields(data)
                }
            }
            throw Error("Catégorie introuvable")
        } catch (error: any) {
            throw Error(error)
        }
    }
}
