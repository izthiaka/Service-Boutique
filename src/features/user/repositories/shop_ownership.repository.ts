import { Request } from "express"

import IDatasourceShopOwner from "../datasources/shop_ownership.datasource"
import IRepository from "../../../core/interfaces/interface_repository"

import VerifyField from "../../../core/utils/verify_field"
import ShopOwnerSpecificField from "../helpers/specific_field/shop_ownership.specific_field"
import MatriculeGenerate from "../../../core/utils/matricule_generate"
import PrefixUser from "../../../core/constant/prefix_user"
import RoleDatasource from "../datasources/role.datasource"
import UrlFileUtil from "../../../core/utils/url_file"


interface IShopOwnerRepository extends IRepository {
    updateStatusAccount(matricule: string, body: object): any
    filterList(page: string, limit: string, query: object): any
    updatePictureByCode(req: Request, matricule: string, body: object): any
    resetPictureByCode(req: Request, matricule: string): any
}

export default class ShopOwnerRepository
    extends VerifyField
    implements IShopOwnerRepository {
    private matricule = new MatriculeGenerate()

    constructor(private datasource: IDatasourceShopOwner) {
        super()
    }

    async getAll(page: string, limit: string) {
        try {
            const result = await this.datasource.findAll(page, limit)

            if (result.data.length !== 0) {
                const list = result.data.map((value: object) =>
                    ShopOwnerSpecificField.fields(value),
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
            const data = ShopOwnerSpecificField.fromBody(body)

            if (data.email) {
                const matchEmail = {
                    email: data.email,
                }
                const isExisteEmail = await this.datasource.isExiste(matchEmail)
                if (isExisteEmail) throw Error(`L'Email [${data.email}] existe déjà dans la base`)
            }

            if (data.phone) {
                const matchPhone = {
                    phone: data.phone,
                }
                const isExistePhone = await this.datasource.isExiste(matchPhone)
                if (isExistePhone) throw Error(`Le numéro Téléphone [${data.phone}] existe déjà dans la base`)
            }

            const roleDatasource = new RoleDatasource()
            const role = await roleDatasource.findOneByName("Propriétaire")
            if (!role) throw Error(`Role d'utilisateur [Propriétaire] introuvable`)
                
            const matricule = this.matricule.generate(PrefixUser.proprio)
            const bodyRequest = {
                ...data,
                role : role.code,
                matricule,
            }

            await this.datasource.store(bodyRequest)

            const result = await this.datasource.findOneByCode(matricule)
            return ShopOwnerSpecificField.fields(result)
            
        } catch (error: any) {
            throw Error(error)
        }
    }

    async getOneByCode(code: string) {
        try {
            const result = await this.datasource.findOneByCode(code)
            if (this.isValid(result)) {
                return ShopOwnerSpecificField.fieldsDetail(result)
            }
            throw Error("Utilisateur introuvable")
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    async update(code: string, body: object) {
        try {
            const result = await this.datasource.findOneByCode(code)
            if (this.isValid(result)) {
                const data = ShopOwnerSpecificField.fromBody(body)
    
                if (data.email) {
                    const matchEmail = {
                        email: data.email,
                    }
                    const isExisteEmail = await this.datasource.isExisteAndReturnData(matchEmail)
                    if(isExisteEmail){
                        if (isExisteEmail.email !== result.email) throw Error(`L'Email [${data.email}] existe déjà dans la base`)
                    }
                }
    
                if (data.phone) {
                    const matchPhone = {
                        phone: data.phone,
                    }
                    const isExistePhone = await this.datasource.isExisteAndReturnData(matchPhone)
                    if(isExistePhone){
                        if (isExistePhone.phone !== result.phone) throw Error(`Le numéro de Téléphone [${data.phone}] existe déjà dans la base`)
                    }
                }

                const collection = await this.datasource.update(code, data)
                if (this.isValid(collection)) {
                    const data = await this.datasource.findOneByCode(code)
                    return ShopOwnerSpecificField.fields(data)
                }
            }
            throw Error("Utilisateur introuvable")
        } catch (error: any) {
            throw Error(error)
        }
    }

    async updateStatusAccount(code: string, body: object) {
        try {
            const result = await this.datasource.findOneByCode(code)
            if (this.isValid(result)) {

                const collection = await this.datasource.update(code, body)
                if (this.isValid(collection)) {
                    const data = await this.datasource.findOneByCode(code)
                    return ShopOwnerSpecificField.fields(data)
                }
            }
            throw Error("Utilisateur introuvable")
        } catch (error: any) {
            throw Error(error)
        }
    }

    async filterList(page: string, limit: string, query: object) {
        try {
            const objet = ShopOwnerSpecificField.search(query)
            if (this.isValid(objet.data)) {
                const collection = await this.datasource.filter(page, limit, objet.data)

                if (collection.data.length !== 0) {
                    const list = collection.data.map((value: object) =>
                        ShopOwnerSpecificField.fields(value),
                    )
                    return {
                        pagination: {
                            total: collection.metadata[0].total,
                            page: collection.metadata[0].page,
                        },
                        list,
                    }
                }
                return true
            }
            return []
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
                    return ShopOwnerSpecificField.fields(data)
                }
            }
            throw Error("Utilisateur introuvable")
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
                    return ShopOwnerSpecificField.fields(data)
                }
            }
            throw Error("Utilisateur introuvable")
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
