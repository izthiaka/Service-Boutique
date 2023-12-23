import { readFile } from "fs/promises"
import ISeeder from "../../../core/interfaces/interface_seeder"
import ApiResponse from "../../../core/utils/ApiResponse"
import MatriculeGenerate from "../../../core/utils/matricule_generate"
import ShopManagerDatasource from "../datasources/shop_manager.datasource"
import ShopManagerSpecificField from "../helpers/specific_field/shop_manager.specific_field"
import PrefixUser from "../../../core/constant/prefix_user"
import RoleDatasource from "../datasources/role.datasource"

interface SeederDataShopManagership {
    name: string,
    sexe: string,
    email: string,
    telephone: string
}

const URL_SEEDER_FILE =
    "src/features/user/seeders/data/shop_managers.json"

export default class ShopManagershipSeeder extends ApiResponse implements ISeeder {
    constructor(
        private datasource = new ShopManagerDatasource(),
        private urlSeeder = URL_SEEDER_FILE,
        private matricule = new MatriculeGenerate(),
    ) {
        super("")
    }

    async getFileSeeder() {
        try {
            const fileContentBuffer = await readFile(this.urlSeeder)
            const fileContentString = fileContentBuffer.toString("utf-8")
            const parsedData: SeederDataShopManagership[] = JSON.parse(
                fileContentString,
                ) as SeederDataShopManagership[]
            return parsedData
        } catch (error) {
            return null
        }
    }

    async seed(): Promise<object> {
        try {
            const shop_managers = await this.getFileSeeder()
            if (shop_managers) {
                const { success, alreadyCreated, total } =
                    await this.insertSeederIsNotExist(shop_managers)

                const response = {
                    size: total,
                    success,
                    already_exist: alreadyCreated,
                }

                return {
                    statusCode: 200,
                    success: true,
                    message: "SEEDERS GERANT BOUTIQUE",
                    data: response,
                }
            }
            return {
                statusCode: 500,
                success: false,
                message: "FICHIER SEEDERS GERANT BOUTIQUE INTROUVABLE",
            }
        } catch (error) {
            return {
                statusCode: 500,
                success: false,
                message: "ERREURS SEEDERS GERANT BOUTIQUE",
            }
        }
    }

    async insertSeederIsNotExist(shop_managers: SeederDataShopManagership[]) {
        const seederToInsert = shop_managers.length
        let Inserted = 0
        let alreadyCreated = 0

        for (const shop_manager of shop_managers) {
            const insertInto = await this.saveData(shop_manager)
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

    async saveData(shop_manager: SeederDataShopManagership) {
        try {
            const body = ShopManagerSpecificField.fromSeeder(shop_manager)

            let isExisteEmail
            if (body.email) {
                const matchEmail = {
                    email: body.email,
                }
                isExisteEmail = await this.datasource.isExiste(matchEmail)
            }

            let isExistePhone
            if (body.phone) {
                const matchPhone = {
                    phone: body.phone,
                }
                isExistePhone = await this.datasource.isExiste(matchPhone)
            }

            const roleDatasource = new RoleDatasource()
            const role = await roleDatasource.findOneByName("Gérant")
            
            if (!isExisteEmail && !isExistePhone && role) {
                const matricule = this.matricule.generate(PrefixUser.gerant)

                const bodyRequest = {
                    ...body,
                    role: role.code,
                    matricule,
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
