import IDatasourceShopCategory from "../datasources/category.datasource"
import IRepository from "../../../core/interfaces/interface_repository"

import VerifyField from "../../../core/utils/verify_field"
import ShopCategorySpecificField from "../helpers/specific_field/category.specific_field"
import MatriculeGenerate from "../../../core/utils/matricule_generate"


export default class ShopCategoryRepository
    extends VerifyField
    implements IRepository {
    private matricule = new MatriculeGenerate()

    constructor(private datasource: IDatasourceShopCategory) {
        super()
    }

    async getAll(page: string, limit: string) {
        try {
            const result = await this.datasource.findAll(page, limit)

            if (result.data.length !== 0) {
                const list = result.data.map((value: object) =>
                    ShopCategorySpecificField.fields(value),
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
            const data = ShopCategorySpecificField.fromBody(body)

            if (data.name) {
                const matchShopCategory = {
                    name: data.name,
                }
                const isExisteShopCategory = await this.datasource.isExiste(matchShopCategory)
                if (isExisteShopCategory) throw Error(`La Categorie [${data.name}] existe déjà dans la base`)
            }
                
            const code = this.matricule.generate()
            const bodyRequest = {
                ...data,
                code,
            }

            await this.datasource.store(bodyRequest)

            const result = await this.datasource.findOneByCode(code)
            return ShopCategorySpecificField.fields(result)
        } catch (error: any) {
            throw Error(error)
        }
    }

    async getOneByCode(code: string) {
        try {
            const result = await this.datasource.findOneByCode(code)
            if (this.isValid(result)) {
                return ShopCategorySpecificField.fieldsDetail(result)
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
                const data = ShopCategorySpecificField.fromBody(body)
    
                if (data.name) {
                    const matchShopCategory = {
                        name: data.name,
                    }
                    const isExisteShopCategory = await this.datasource.isExisteAndReturnData(matchShopCategory)
                    if(isExisteShopCategory){
                        if (isExisteShopCategory.name !== result.name) throw Error(`La Categorie [${data.name}] existe déjà dans la base`)
                    }
                }

                const collection = await this.datasource.update(code, data)
                if (this.isValid(collection)) {
                    const data = await this.datasource.findOneByCode(code)
                    return ShopCategorySpecificField.fields(data)
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
}
