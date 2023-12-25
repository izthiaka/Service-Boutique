import SubscriptionSpecificField from "../helpers/specific_field/subscription.specific_field"
import IDatabaseSubscription from "../datasources/subscription.datasource"
import IRepository from "../../../core/interfaces/interface_repository"

import VerifyField from "../../../core/utils/verify_field"
import MatriculeGenerate from "../../../core/utils/matricule_generate"

export interface ISubscriptionRepository extends IRepository {
    getAllByGuest(): any
    changeStatus(code: string): Promise<any>
}

export default class SubscriptionRepository
    extends VerifyField
    implements ISubscriptionRepository {
    private matricule = new MatriculeGenerate()

    constructor(private datasource: IDatabaseSubscription) {
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
                    SubscriptionSpecificField.fieldsByGuest(value),
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
                return SubscriptionSpecificField.fields(data)
            }

            throw Error("Abonnement introuvable")
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    async getAll(page: string, limit: string) {
        try {
            const result = await this.datasource.findAll(page, limit)

            if (result.data.length !== 0) {
                const list = result.data.map((value: object) =>
                    SubscriptionSpecificField.fields(value),
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
                return SubscriptionSpecificField.fields(result)
            }
            throw Error("Abonnement introuvable")
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
                return SubscriptionSpecificField.fields(result)
            }
            throw Error("Abonnement introuvable")
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    async save(body: any) {
        try {
            const data = SubscriptionSpecificField.fromBody(body)

            const match = {
                title: body.title,
            }

            const isExiste = await this.datasource.isExiste(match)
            if (isExiste) throw Error(`Le nom d'abonnement [${data.title}] existe déjà dans la base`)

            const code = this.matricule.generate()
            const bodyRequest = {
                ...data,
                code,
            }

            await this.datasource.store(bodyRequest)
            const result = await this.datasource.findOneByCode(code)

            return SubscriptionSpecificField.fields(result)
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    async update(code: string, body: object) {
        try {
            const result = await this.datasource.findOneByCode(code)
            if (this.isValid(result)) {
                const data = SubscriptionSpecificField.fromBody(body)

                if (data.title) {
                    const matchSubscription = {
                        title: data.title,
                    }
                    const isExisteSubscription = await this.datasource.isExisteAndReturnData(matchSubscription)
                    if (isExisteSubscription) {
                        if (isExisteSubscription.title !== result.title) throw Error(`Le nom d'abonnement [${data.title}] existe déjà dans la base`)
                    }
                }

                const collection = await this.datasource.update(code, data)
                if (this.isValid(collection)) {
                    const data = await this.datasource.findOneByCode(code)
                    return SubscriptionSpecificField.fields(data)
                }
            }
            throw Error("Abonnement introuvable")
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    async deleteOne(code: string) {
        try {
            const result = await this.datasource.findOneByCode(code)

            if (this.isValid(result)) {
                await this.datasource.deleteOne(code)
                return SubscriptionSpecificField.fields(result)
            }

            throw Error("Abonnement introuvable")
        } catch (error: any) {
            throw Error(error.message)
        }
    }
}
