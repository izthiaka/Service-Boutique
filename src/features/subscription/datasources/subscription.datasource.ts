import { SubscriptionEntity } from "../schemas/subscription"
import OptionPagination from "../../../core/utils/option_pagination"

import IDatasource from "../../../core/interfaces/interface_datasource"

export interface IDatabaSubscriptionCourse extends IDatasource {
    isExiste(match: object): Promise<boolean>
    filter(match: any[]): Promise<any>
    isExisteAndReturnData(match: object): any
}

export default class SubscriptionDatasource
    implements IDatabaSubscriptionCourse {
    constructor(private schema = SubscriptionEntity) { }

    async filter(match: any[]) {
        try {
            const result = await this.schema.aggregate(match).exec()
            return result
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    async findAll(page: string, limit: string) {
        try {
            const FACET = OptionPagination.facetForMongoose(page, limit)
            const result = await this.schema.aggregate([
                {
                    $sort: {
                        pricing: 1
                    }
                },
                FACET
            ]).exec()
            return result[0]
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    async findOne(match: object) {
        try {
            const result = await this.schema.findOne(match).exec()
            return result
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    findOneByName(name: string) {
        throw new Error(`Method not implemented. ${name}`)
    }

    async findOneByCode(code: string) {
        try {
            const result = await this.schema
                .aggregate([{ $match: { code: code } }])
                .exec()

            return result[0]
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    async store(body: object) {
        try {
            return await this.schema.create(body)
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    async update(code: string, body: object) {
        const filter = { code: code }
        const option = { new: true }
        try {
            return await this.schema.findOneAndUpdate(filter, body, option).exec()
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async isExiste(match: object): Promise<boolean> {
        const result = await this.schema.findOne(match).exec()
        return result !== null
    }

    async deleteOne(code: string) {
        try {
            return await this.schema.deleteOne({ code: code }).exec()
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    async isExisteAndReturnData(match: object) {
        const result = await this.schema.findOne(match).exec()
        return result
    }
}