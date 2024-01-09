import PaymentMethodSpecificField from "../helpers/specific_field/payment_method.specific_field"
import IDatabasePaymentMethod from "../datasources/payment_method.datasource"
import IRepository from "../../../core/interfaces/interface_repository"

import VerifyField from "../../../core/utils/verify_field"
import MatriculeGenerate from "../../../core/utils/matricule_generate"

export interface IPaymentMethodRepository extends IRepository {
    getAllByGuest(): any
    changeStatus(code: string): Promise<any>
}

export default class PaymentMethodRepository
    extends VerifyField
    implements IPaymentMethodRepository {
    private matricule = new MatriculeGenerate()

    constructor(private datasource: IDatabasePaymentMethod) {
        super()
    }

    async getAllByGuest(): Promise<unknown> {
        try {
            const match = [
                {
                    $sort: {
                        pricing: 1
                    }
                }, { $match: { status: true } }]
            const result = await this.datasource.filter(match)

            if (result.length !== 0) {
                const list = result.map((value: object) =>
                    PaymentMethodSpecificField.fieldsByGuest(value),
                )
                return list
            }

            return []
        } catch (error: any) {
            throw Error(error)
        }
    }

    async changeStatus(code: string) {
        try {
            const data = await this.datasource.findOneByCode(code)
            if (this.isValid(data)) {
                const bodyRequest = { status: !data.status }
                await this.datasource.update(code, bodyRequest)
                data.status = !data.status
                return PaymentMethodSpecificField.fields(data)
            }

            throw Error("Méthode Paiement introuvable")
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    async getAll(page: string, limit: string) {
        try {
            const result = await this.datasource.findAll(page, limit)

            if (result.data.length !== 0) {
                const list = result.data.map((value: object) =>
                    PaymentMethodSpecificField.fields(value),
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

    async getOne(match: object) {
        try {
            const result = await this.datasource.findOne(match)
            if (this.isValid(result)) {
                return PaymentMethodSpecificField.fields(result)
            }
            throw Error("Méthode Paiement introuvable")
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    getOneByName(name: string) {
        throw new Error(`Method not implemented.${name}`)
    }

    async getOneByCode(code: string) {
        try {
            const result = await this.datasource.findOneByCode(code)
            if (this.isValid(result)) {
                return PaymentMethodSpecificField.fields(result)
            }
            throw Error("Abonnement introuvable")
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    async save(body: any) {
        try {
            const data = PaymentMethodSpecificField.fromBody(body)

            const match = {
                name_payment: body.name_payment,
            }

            const isExiste = await this.datasource.isExiste(match)
            if (isExiste) throw Error(`Le nom du méthode de paiement [${data.name_payment}] existe déjà dans la base`)

            const code = this.matricule.generate()
            const bodyRequest = {
                ...data,
                code,
            }

            await this.datasource.store(bodyRequest)
            const result = await this.datasource.findOneByCode(code)

            return PaymentMethodSpecificField.fields(result)
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    async update(code: string, body: object) {
        try {
            const result = await this.datasource.findOneByCode(code)
            if (this.isValid(result)) {
                const data = PaymentMethodSpecificField.fromBody(body)

                if (data.name_payment) {
                    const matchPaymentMethod = {
                        name_payment: data.name_payment,
                    }
                    const isExistePaymentMethod = await this.datasource.isExisteAndReturnData(matchPaymentMethod)
                    if (isExistePaymentMethod) {
                        if (isExistePaymentMethod.name_payment !== result.name_payment) throw Error(`Le nom du méthode de paiement [${data.name_payment}] existe déjà dans la base`)
                    }
                }

                const collection = await this.datasource.update(code, data)
                if (this.isValid(collection)) {
                    const data = await this.datasource.findOneByCode(code)
                    return PaymentMethodSpecificField.fields(data)
                }
            }
            throw Error("Méthode Paiement introuvable")
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    async deleteOne(code: string) {
        try {
            const result = await this.datasource.findOneByCode(code)

            if (this.isValid(result)) {
                await this.datasource.deleteOne(code)
                return PaymentMethodSpecificField.fields(result)
            }

            throw Error("Méthode Paiement introuvable")
        } catch (error: any) {
            throw Error(error.message)
        }
    }
}
