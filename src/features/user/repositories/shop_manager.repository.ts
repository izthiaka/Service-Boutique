import IDatasourceShopManager from "../datasources/shop_manager.datasource"
import IRepository from "../../../core/interfaces/interface_repository"

import VerifyField from "../../../core/utils/verify_field"
import ShopManagerSpecificField from "../helpers/specific_field/shop_manager.specific_field"
import MatriculeGenerate from "../../../core/utils/matricule_generate"
import PrefixUser from "../../../core/constant/prefix_user"
import RoleDatasource from "../datasources/role.datasource"


interface IShopManagerRepository extends IRepository {
    updateStatusAccount(matricule: string, body: object): any
    filterList(page: string, limit: string, query: object): any
}

export default class ShopManagerRepository
    extends VerifyField
    implements IShopManagerRepository {
    private matricule = new MatriculeGenerate()

    constructor(private datasource: IDatasourceShopManager) {
        super()
    }

    async getAll(page: string, limit: string) {
        try {
            const result = await this.datasource.findAll(page, limit)

            if (result.data.length !== 0) {
                const list = result.data.map((value: object) =>
                    ShopManagerSpecificField.fields(value),
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
            const data = ShopManagerSpecificField.fromBody(body)

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
            const role = await roleDatasource.findOneByName("Gérant")
            if (!role) throw Error(`Role d'utilisateur [Gérant] introuvable`)
                
            const matricule = this.matricule.generate(PrefixUser.gerant)
            const bodyRequest = {
                ...data,
                role : role.code,
                matricule,
            }

            await this.datasource.store(bodyRequest)

            const result = await this.datasource.findOneByCode(matricule)
            return ShopManagerSpecificField.fields(result)
            
        } catch (error: any) {
            throw Error(error)
        }
    }

    async getOneByCode(code: string) {
        try {
            const result = await this.datasource.findOneByCode(code)
            if (this.isValid(result)) {
                return ShopManagerSpecificField.fieldsDetail(result)
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
                const data = ShopManagerSpecificField.fromBody(body)
    
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
                    return ShopManagerSpecificField.fields(data)
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
                    return ShopManagerSpecificField.fields(data)
                }
            }
            throw Error("Utilisateur introuvable")
        } catch (error: any) {
            throw Error(error)
        }
    }

    async filterList(page: string, limit: string, query: object) {
        try {
            const objet = ShopManagerSpecificField.search(query)
            if (this.isValid(objet.data)) {
                const collection = await this.datasource.filter(page, limit, objet.data)

                if (collection.data.length !== 0) {
                    const list = collection.data.map((value: object) =>
                        ShopManagerSpecificField.fields(value),
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
