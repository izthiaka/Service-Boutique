import { readFile } from "fs/promises"
import ISeeder from "../../../core/interfaces/interface_seeder"
import ApiResponse from "../../../core/utils/ApiResponse"
import MatriculeGenerate from "../../../core/utils/matricule_generate"
import PaymentMethodDatasource from "../datasources/payment_method.datasource"
import PaymentMethodSpecificField from "../helpers/specific_field/payment_method.specific_field"

interface SeederDataPaymentMethod {
    title: string
    description: string
    pricing: number
    number_month: number
}

const URL_SEEDER_FILE =
    "src/features/subscription/seeders/data/payment_methods.json"

export default class PaymentMethodSeeder extends ApiResponse implements ISeeder {
    constructor(
        private datasource = new PaymentMethodDatasource(),
        private urlSeeder = URL_SEEDER_FILE,
        private matricule = new MatriculeGenerate(),
    ) {
        super("")
    }

    async getFileSeeder() {
        try {
            const fileContentBuffer = await readFile(this.urlSeeder)
            const fileContentString = fileContentBuffer.toString("utf-8")
            const parsedData: SeederDataPaymentMethod[] = JSON.parse(
                fileContentString,
                ) as SeederDataPaymentMethod[]
            return parsedData
        } catch (error) {
            return null
        }
    }

    async seed(): Promise<object> {
        try {
            const payment_methods = await this.getFileSeeder()
            if (payment_methods) {
                const { success, alreadyCreated, total } =
                    await this.insertSeederIsNotExist(payment_methods)

                const response = {
                    size: total,
                    success,
                    already_exist: alreadyCreated,
                }

                return {
                    statusCode: 200,
                    success: true,
                    message: "SEEDERS METHODE PAIEMENT",
                    data: response,
                }
            }
            return {
                statusCode: 500,
                success: false,
                message: "FICHIER SEEDERS METHODE PAIEMENT INTROUVABLE",
            }
        } catch (error) {
            return {
                statusCode: 500,
                success: false,
                message: "ERREURS SEEDERS METHODE PAIEMENT",
            }
        }
    }

    async insertSeederIsNotExist(payment_methods: SeederDataPaymentMethod[]) {
        const seederToInsert = payment_methods.length
        let Inserted = 0
        let alreadyCreated = 0

        for (const payment_method of payment_methods) {
            const insertInto = await this.saveData(payment_method)
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

    async saveData(payment_method: SeederDataPaymentMethod) {
        try {
            const body = PaymentMethodSpecificField.fromSeeder(payment_method)

            let isExistePaymentMethod
            if (body.name_payment) {
                const matchPaymentMethod = {
                    name_payment: body.name_payment,
                }
                isExistePaymentMethod = await this.datasource.isExiste(matchPaymentMethod)
            }
            
            if (!isExistePaymentMethod) {
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
