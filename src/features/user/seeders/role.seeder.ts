import { readFile } from "fs/promises"
import ISeeder from "../../../core/interfaces/interface_seeder"
import ApiResponse from "../../../core/utils/ApiResponse"
import MatriculeGenerate from "../../../core/utils/matricule_generate"
import RoleDatasource from "../datasources/role.datasource"
import RoleSpecificField from "../helpers/specific_field/role.specific_field"

interface SeederDataRole {
    name: string,
    sexe: string,
    email: string,
    telephone: string
}

const URL_SEEDER_FILE =
    "src/features/user/seeders/data/roles.json"

export default class RoleSeeder extends ApiResponse implements ISeeder {
    constructor(
        private datasource = new RoleDatasource(),
        private urlSeeder = URL_SEEDER_FILE,
        private matricule = new MatriculeGenerate(),
    ) {
        super("")
    }

    async getFileSeeder() {
        try {
            const fileContentBuffer = await readFile(this.urlSeeder)
            const fileContentString = fileContentBuffer.toString("utf-8")
            const parsedData: SeederDataRole[] = JSON.parse(
                fileContentString,
                ) as SeederDataRole[]
            return parsedData
        } catch (error) {
            return null
        }
    }

    async seed(): Promise<object> {
        try {
            const roles = await this.getFileSeeder()
            if (roles) {
                const { success, alreadyCreated, total } =
                    await this.insertSeederIsNotExist(roles)

                const response = {
                    size: total,
                    success,
                    already_exist: alreadyCreated,
                }

                return {
                    statusCode: 200,
                    success: true,
                    message: "SEEDERS ROLE",
                    data: response,
                }
            }
            return {
                statusCode: 500,
                success: false,
                message: "FICHIER SEEDERS ROLE INTROUVABLE",
            }
        } catch (error) {
            return {
                statusCode: 500,
                success: false,
                message: "ERREURS SEEDERS ROLE",
            }
        }
    }

    async insertSeederIsNotExist(roles: SeederDataRole[]) {
        const seederToInsert = roles.length
        let Inserted = 0
        let alreadyCreated = 0

        for (const role of roles) {
            const insertInto = await this.saveData(role)
            if (insertInto) {
                Inserted += 1
            } else {
                alreadyCreated += 1
            }
        }

        return {
            total: seederToInsert,
            success: Inserted,
            alreadyCreated,
        }
    }

    async saveData(role: SeederDataRole) {
        try {
            const body = RoleSpecificField.fromSeeder(role)

            let isExisteRole
            if (body.name) {
                const matchRole = {
                    name: body.name,
                }
                isExisteRole = await this.datasource.isExiste(matchRole)
            }
            
            if (!isExisteRole) {
                const code = this.matricule.generate()

                const bodyRequest = {
                    ...body,
                    code,
                }

                await this.datasource.store(bodyRequest)
                return true
            }
            return false
        } catch (error) {
            throw new Error(error as string)
        }
    }
}
