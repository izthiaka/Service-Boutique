import { readFile } from "fs/promises"
import ISeeder from "../../../core/interfaces/interface_seeder"
import ApiResponse from "../../../core/utils/ApiResponse"
import MatriculeGenerate from "../../../core/utils/matricule_generate"
import SubscriptionDatasource from "../datasources/subscription.datasource"
import SubscriptionSpecificField from "../helpers/specific_field/subscription.specific_field"

interface SeederDataSubscription {
    title: string
    description: string
    pricing: string
    number_month: number
}

const URL_SEEDER_FILE =
    "src/features/subscription/seeders/data/subscriptions.json"

export default class SubscriptionSeeder extends ApiResponse implements ISeeder {
    constructor(
        private datasource = new SubscriptionDatasource(),
        private urlSeeder = URL_SEEDER_FILE,
        private matricule = new MatriculeGenerate(),
    ) {
        super("")
    }

    async getFileSeeder() {
        try {
            const fileContentBuffer = await readFile(this.urlSeeder)
            const fileContentString = fileContentBuffer.toString("utf-8")
            const parsedData: SeederDataSubscription[] = JSON.parse(
                fileContentString,
                ) as SeederDataSubscription[]
            return parsedData
        } catch (error) {
            return null
        }
    }

    async seed(): Promise<object> {
        try {
            const subscriptions = await this.getFileSeeder()
            if (subscriptions) {
                const { success, alreadyCreated, total } =
                    await this.insertSeederIsNotExist(subscriptions)

                const response = {
                    size: total,
                    success,
                    already_exist: alreadyCreated,
                }

                return {
                    statusCode: 200,
                    success: true,
                    message: "SEEDERS ABONNEMENT",
                    data: response,
                }
            }
            return {
                statusCode: 500,
                success: false,
                message: "FICHIER SEEDERS ABONNEMENT INTROUVABLE",
            }
        } catch (error) {
            return {
                statusCode: 500,
                success: false,
                message: "ERREURS SEEDERS ABONNEMENT",
            }
        }
    }

    async insertSeederIsNotExist(subscriptions: SeederDataSubscription[]) {
        const seederToInsert = subscriptions.length
        let Inserted = 0
        let alreadyCreated = 0

        for (const subscription of subscriptions) {
            const insertInto = await this.saveData(subscription)
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

    async saveData(subscription: SeederDataSubscription) {
        try {
            const body = SubscriptionSpecificField.fromSeeder(subscription)

            let isExisteSubscription
            if (body.title) {
                const matchSubscription = {
                    title: body.title,
                }
                isExisteSubscription = await this.datasource.isExiste(matchSubscription)
            }
            
            if (!isExisteSubscription) {
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
