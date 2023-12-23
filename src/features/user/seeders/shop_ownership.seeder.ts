import { readFile } from "fs/promises"
import ISeeder from "../../../core/interfaces/interface_seeder"
import ApiResponse from "../../../core/utils/ApiResponse"
import MatriculeGenerate from "../../../core/utils/matricule_generate"
import ShopOwnerDatasource from "../datasources/shop_ownership.datasource"
import ShopOwnerSpecificField from "../helpers/specific_field/shop_ownership.specific_field"
import PrefixUser from "../../../core/constant/prefix_user"

interface SeederDataShopOwnership {
    name: string,
    sexe: string,
    email: string,
    telephone: string
}

const URL_SEEDER_FILE =
    "src/features/user/seeders/data/shop_ownerships.json"

export default class ShopOwnershipSeeder extends ApiResponse implements ISeeder {
    constructor(
        private datasource = new ShopOwnerDatasource(),
        private urlSeeder = URL_SEEDER_FILE,
        private matricule = new MatriculeGenerate(),
    ) {
        super("")
    }

    async getFileSeeder() {
        try {
            const fileContentBuffer = await readFile(this.urlSeeder)
            const fileContentString = fileContentBuffer.toString("utf-8")
            const parsedData: SeederDataShopOwnership[] = JSON.parse(
                fileContentString,
                ) as SeederDataShopOwnership[]
            return parsedData
        } catch (error) {
            return null
        }
    }

    async seed(): Promise<object> {
        try {
            const shop_ownerships = await this.getFileSeeder()
            if (shop_ownerships) {
                const { success, alreadyCreated, total } =
                    await this.insertSeederIsNotExist(shop_ownerships)

                const response = {
                    size: total,
                    success,
                    already_exist: alreadyCreated,
                }

                return {
                    statusCode: 200,
                    success: true,
                    message: "SEEDERS PROPRIETAIRE BOUTIQUE",
                    data: response,
                }
            }
            return {
                statusCode: 500,
                success: false,
                message: "FICHIER SEEDERS PROPRIETAIRE BOUTIQUE INTROUVABLE",
            }
        } catch (error) {
            return {
                statusCode: 500,
                success: false,
                message: "ERREURS SEEDERS PROPRIETAIRE BOUTIQUE",
            }
        }
    }

    async insertSeederIsNotExist(shop_ownerships: SeederDataShopOwnership[]) {
        const seederToInsert = shop_ownerships.length
        let Inserted = 0
        let alreadyCreated = 0

        for (const shop_ownership of shop_ownerships) {
            const insertInto = await this.saveData(shop_ownership)
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

    async saveData(shop_ownership: SeederDataShopOwnership) {
        try {
            const body = ShopOwnerSpecificField.fromSeeder(shop_ownership)

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
            
            if (!isExisteEmail && !isExistePhone) {
                const matricule = this.matricule.generate(PrefixUser.proprio)

                const bodyRequest = {
                    ...body,
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
