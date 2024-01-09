import { Request } from "express"

import IDatasourceShop from "../datasources/shop.datasource"
import IRepository from "../../../core/interfaces/interface_repository"

import VerifyField from "../../../core/utils/verify_field"
import ShopSpecificField from "../helpers/specific_field/shop.specific_field"
import MatriculeGenerate from "../../../core/utils/matricule_generate"
import CategoryDatasource from "../datasources/category.datasource"
import ShopOwnerDatasource from "../../user/datasources/shop_ownership.datasource"
import UrlFileUtil from "../../../core/utils/url_file"

interface IShopRepository extends IRepository {
    updateStatus(matricule: string, body: object): any
    filterList(page: string, limit: string, query: object): any
    updatePictureByCode(req: Request, matricule: string, body: object): any
    resetPictureByCode(req: Request, matricule: string,): any
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

            if (data.email) {
                const matchShop = {
                    email: data.email,
                }
                const isExisteShop = await this.datasource.isExiste(matchShop)
                if (isExisteShop) throw Error(`L'email de la Boutique [${data.email}] existe déjà dans la base`)
            }

            if (data.phone) {
                const matchShop = {
                    phone: data.phone,
                }
                const isExisteShop = await this.datasource.isExiste(matchShop)
                if (isExisteShop) throw Error(`Le numéro Téléphone de la Boutique [${data.phone}] existe déjà dans la base`)
            }

            let categories: string[] = []
            await Promise.all(data.category.map(async (categorie: string) => {
                const categoryDatasource = new CategoryDatasource()
                const cat = await categoryDatasource.findOneByCode(categorie)
                if (cat) {
                    categories.push(cat.code)
                }
            }))

            if(categories.length !== data.category.length) throw Error(`Catégorie Boutique [${data.category.filter((x: string) => !categories.includes(x))}] introuvable`)

            const ownerDatasource = new ShopOwnerDatasource()
            const owner = await ownerDatasource.findOneByCode(data.owner)
            if (!owner) throw Error(`Utilisateur [${data.owner}] introuvable`)
                
            const code = this.matricule.generate()
            const bodyRequest = {
                ...data,
                code,
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
    
                if (data.email) {
                    const matchShopEmail = {
                        email: data.email,
                    }
                    const isExisteShop = await this.datasource.isExisteAndReturnData(matchShopEmail)
                    if(isExisteShop){
                        if (isExisteShop.email !== result.email) throw Error(`L'email de la Boutique [${data.email}] existe déjà dans la base`)
                    }
                }
    
                if (data.phone) {
                    const matchShopPhone = {
                        phone: data.phone,
                    }
                    const isExisteShop = await this.datasource.isExisteAndReturnData(matchShopPhone)
                    if(isExisteShop){
                        if (isExisteShop.phone !== result.phone) throw Error(`Le numéro téléphone de la Boutique [${data.phone}] existe déjà dans la base`)
                    }
                }

                let categories: string[] = []
                await Promise.all(data.category.map(async (categorie: string) => {
                    const categoryDatasource = new CategoryDatasource()
                    const cat = await categoryDatasource.findOneByCode(categorie)
                    if (cat) {
                        categories.push(cat.code)
                    }
                }))

            if(categories.length !== data.category.length) throw Error(`Catégorie Boutique [${data.category.filter((x: string) => !categories.includes(x))}] introuvable`)

                const bodyRequest = {
                    ...data,
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
                    return ShopSpecificField.fields(data)
                }
            }
            throw Error("Boutique introuvable")
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
                    return ShopSpecificField.fields(data)
                }
            }
            throw Error("Boutique introuvable")
        } catch (error: any) {
            throw Error(error)
        }
    }
}
