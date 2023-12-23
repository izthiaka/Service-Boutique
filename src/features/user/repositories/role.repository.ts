import IDatasourceRole from "../datasources/role.datasource"
import IRepository from "../../../core/interfaces/interface_repository"

import VerifyField from "../../../core/utils/verify_field"
import RoleSpecificField from "../helpers/specific_field/role.specific_field"
import MatriculeGenerate from "../../../core/utils/matricule_generate"
import PrefixUser from "../../../core/constant/prefix_user"


export default class RoleRepository
    extends VerifyField
    implements IRepository {
    private matricule = new MatriculeGenerate()

    constructor(private datasource: IDatasourceRole) {
        super()
    }

    async getAll(page: string, limit: string) {
        try {
            const result = await this.datasource.findAll(page, limit)

            if (result.data.length !== 0) {
                const list = result.data.map((value: object) =>
                    RoleSpecificField.fields(value),
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
            const data = RoleSpecificField.fromBody(body)

            if (data.name) {
                const matchRole = {
                    name: data.name,
                }
                const isExisteRole = await this.datasource.isExiste(matchRole)
                if (isExisteRole) throw Error(`Le Role [${data.name}] existe déjà dans la base`)
            }
                
            const code = this.matricule.generate()
            const bodyRequest = {
                ...data,
                code,
            }

            await this.datasource.store(bodyRequest)

            const result = await this.datasource.findOneByCode(code)
            return RoleSpecificField.fields(result)
        } catch (error: any) {
            throw Error(error)
        }
    }

    async getOneByCode(code: string) {
        try {
            const result = await this.datasource.findOneByCode(code)
            if (this.isValid(result)) {
                return RoleSpecificField.fieldsDetail(result)
            }
            throw Error("Role introuvable")
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    async update(code: string, body: object) {
        try {
            const result = await this.datasource.findOneByCode(code)
            if (this.isValid(result)) {
                const data = RoleSpecificField.fromBody(body)
    
                if (data.name) {
                    const matchRole = {
                        name: data.name,
                    }
                    const isExisteRole = await this.datasource.isExisteAndReturnData(matchRole)
                    if(isExisteRole){
                        if (isExisteRole.name !== result.name) throw Error(`Le role [${data.name}] existe déjà dans la base`)
                    }
                }

                const collection = await this.datasource.update(code, data)
                if (this.isValid(collection)) {
                    const data = await this.datasource.findOneByCode(code)
                    return RoleSpecificField.fields(data)
                }
            }
            throw Error("Role introuvable")
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
