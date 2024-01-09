import { Request } from "express"

import IDatasourceCategory from "../datasources/category.datasource"
import IRepository from "../../../core/interfaces/interface_repository"

import VerifyField from "../../../core/utils/verify_field"
import CategorySpecificField from "../helpers/specific_field/category.specific_field"
import MatriculeGenerate from "../../../core/utils/matricule_generate"
import UrlFileUtil from "../../../core/utils/url_file"


interface ICategoryRepository extends IRepository {
    updatePictureByCode(req: Request, matricule: string, body: object): any
    resetPictureByCode(req: Request, matricule: string,): any
}

export default class CategoryRepository
    extends VerifyField
    implements ICategoryRepository {
    private matricule = new MatriculeGenerate()

    constructor(private datasource: IDatasourceCategory) {
        super()
    }

    async getAll(page: string, limit: string) {
        try {
            const result = await this.datasource.findAll(page, limit)

            if (result.data.length !== 0) {
                const list = result.data.map((value: object) =>
                    CategorySpecificField.fields(value),
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
            const data = CategorySpecificField.fromBody(body)

            if (data.name) {
                const matchCategory = {
                    name: data.name,
                }
                const isExisteCategory = await this.datasource.isExiste(matchCategory)
                if (isExisteCategory) throw Error(`La Categorie [${data.name}] existe déjà dans la base`)
            }
                
            const code = this.matricule.generate()
            const bodyRequest = {
                ...data,
                code,
            }

            await this.datasource.store(bodyRequest)

            const result = await this.datasource.findOneByCode(code)
            return CategorySpecificField.fields(result)
        } catch (error: any) {
            throw Error(error)
        }
    }

    async getOneByCode(code: string) {
        try {
            const result = await this.datasource.findOneByCode(code)
            if (this.isValid(result)) {
                return CategorySpecificField.fieldsDetail(result)
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
                const data = CategorySpecificField.fromBody(body)
    
                if (data.name) {
                    const matchCategory = {
                        name: data.name,
                    }
                    const isExisteCategory = await this.datasource.isExisteAndReturnData(matchCategory)
                    if(isExisteCategory){
                        if (isExisteCategory.name !== result.name) throw Error(`La Categorie [${data.name}] existe déjà dans la base`)
                    }
                }

                const collection = await this.datasource.update(code, data)
                if (this.isValid(collection)) {
                    const data = await this.datasource.findOneByCode(code)
                    return CategorySpecificField.fields(data)
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
                    return CategorySpecificField.fields(data)
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
                    return CategorySpecificField.fields(data)
                }
            }
            throw Error("Catégorie introuvable")
        } catch (error: any) {
            throw Error(error)
        }
    }
}
