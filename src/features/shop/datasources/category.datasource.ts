import { CategoryEntity } from "../schemas/category"

import OptionPagination from "../../../core/utils/option_pagination"
import IDatasource from "../../../core/interfaces/interface_datasource"

export interface IDatasourceCategory extends IDatasource {
    isExiste(match: object): Promise<boolean>
}

export default class CategoryDatasource
    implements IDatasourceCategory {
    constructor(private schema = CategoryEntity) { }

    async findAll(page: string, limit: string) {
        try {
            const FACET = OptionPagination.facetForMongoose(page, limit)
            const result = await this.schema.aggregate([
                {
                    $sort: { name: 1 },
                },
                FACET]).exec()
            return result[0]
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    async findOne(match: object) {
        try {
            const result = await this.schema.aggregate([
                { $match: match },

            ]).exec()

            return result[0]
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    async findOneByName(name: string) {
        try {
            const result = await this.schema
                .aggregate([
                    { $match: { name: name } },
                ])
                .exec()

            return result[0]
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    async findOneByCode(code: string) {
        try {
            const result = await this.schema
                .aggregate([
                    { $match: { code: code } },
                ])
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

    async isExisteAndReturnData(match: object) {
        const result = await this.schema.findOne(match).exec()
        return result
    }

    async deleteOne(code: string) {
        try {
            return await this.schema.deleteOne({ code: code }).exec()
        } catch (error: any) {
            throw Error(error.message)
        }
    }
}
