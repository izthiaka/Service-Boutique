import IDatasourceShop from "../datasources/shop.datasource"
import IRepository from "../../../core/interfaces/interface_repository"

import VerifyField from "../../../core/utils/verify_field"
import ShopSpecificField from "../helpers/specific_field/shop.specific_field"
import MatriculeGenerate from "../../../core/utils/matricule_generate"
import ShopCategoryDatasource from "../datasources/category.datasource"
import ShopOwnerDatasource from "../../user/datasources/shop_ownership.datasource"

interface IShopRepository extends IRepository {
    updateStatus(matricule: string, body: object): any
    filterList(page: string, limit: string, query: object): any
}

export default class ShopRepository
    extends VerifyField
    implements IShopRepository {
    private matricule = new MatriculeGenerate()

    constructor(private datasource: IDatasourceShop) {
        super()
    }

    async getAll(page: string, limit: string) {
        try {
            const result = await this.datasource.findAll(page, limit)

            if (result.data.length !== 0) {
                const list = result.data.map((value: object) =>
                    ShopSpecificField.fields(value),
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
            const data = ShopSpecificField.fromBody(body)

            if (data.name) {
                const matchShop = {
                    name: data.name,
                }
                const isExisteShop = await this.datasource.isExiste(matchShop)
                if (isExisteShop) throw Error(`La Boutique [${data.name}] existe déjà dans la base`)
            }

            const categoryDatasource = new ShopCategoryDatasource()
            const category = await categoryDatasource.findOneByCode(data.category)
            if (!category) throw Error(`Categorie Boutique [${data.category}] introuvable`)

            const ownerDatasource = new ShopOwnerDatasource()
            const owner = await ownerDatasource.findOneByCode(data.owner)
            if (!owner) throw Error(`Utilisateur [${data.owner}] introuvable`)
                
            const code = this.matricule.generate()
            const bodyRequest = {
                ...data,
                code,
                category: category.code,
                owner: owner.matricule
            }

            await this.datasource.store(bodyRequest)

            const result = await this.datasource.findOneByCode(code)
            return ShopSpecificField.fields(result)
        } catch (error: any) {
            throw Error(error)
        }
    }

    async getOneByCode(code: string) {
        try {
            const result = await this.datasource.findOneByCode(code)
            if (this.isValid(result)) {
                return ShopSpecificField.fieldsDetail(result)
            }
            throw Error("Boutique introuvable")
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    async update(code: string, body: object) {
        try {
            const result = await this.datasource.findOneByCode(code)
            if (this.isValid(result)) {
                const data = ShopSpecificField.fromBody(body)
    
                if (data.name) {
                    const matchShop = {
                        name: data.name,
                    }
                    const isExisteShop = await this.datasource.isExisteAndReturnData(matchShop)
                    if(isExisteShop){
                        if (isExisteShop.name !== result.name) throw Error(`La Boutique [${data.name}] existe déjà dans la base`)
                    }
                }

                const categoryDatasource = new ShopCategoryDatasource()
                const category = await categoryDatasource.findOneByCode(data.category)
                if (!category) throw Error(`Categorie Boutique [${data.category}] introuvable`)

                const bodyRequest = {
                    ...data,
                    category: category.code,
                }
                const collection = await this.datasource.update(code, bodyRequest)
                if (this.isValid(collection)) {
                    const data = await this.datasource.findOneByCode(code)
                    return ShopSpecificField.fields(data)
                }
            }
            throw Error("Boutique introuvable")
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

    async filterList(page: string, limit: string, query: object) {
        try {
            const objet = ShopSpecificField.search(query)
            if (this.isValid(objet.data)) {
                const collection = await this.datasource.filter(page, limit, objet.data)

                if (collection.data.length !== 0) {
                    const list = collection.data.map((value: object) =>
                        ShopSpecificField.fields(value),
                    )
                    return {
                        pagination: {
                            total: collection.metadata[0].total,
                            page: collection.metadata[0].page,
                        },
                        list,
                    }
                }
                return []
            }
            return []
        } catch (error: any) {
            throw Error(error)
        }
    }

    async updateStatus(code: string, body: object) {
        try {
            const result = await this.datasource.findOneByCode(code)
            if (this.isValid(result)) {
                const collection = await this.datasource.update(code, body)
                if (this.isValid(collection)) {
                    const data = await this.datasource.findOneByCode(code)
                    return ShopSpecificField.fields(data)
                }
            }
            throw Error("Boutique introuvable")
        } catch (error: any) {
            throw Error(error)
        }
    }
}
