import { ShopOwnerEntity } from "../schemas/shop_ownership"

import OptionPagination from "../../../core/utils/option_pagination"

import IDatasource from "../../../core/interfaces/interface_datasource"

export interface IDatasourceShopOwner extends IDatasource {
    isExiste(match: object): Promise<boolean>
    filter(page: string, limit: string, query: string): Promise<any>
}

export default class ShopOwnerDatasource
    implements IDatasourceShopOwner {
    constructor(private schema = ShopOwnerEntity) { }

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

    async findOneByName(code: string) {
        try {
            const result = await this.schema
                .aggregate([
                    { $match: { matricule: code } },
                ])
                .exec()

            return result[0]
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    async findOneByScoutMatricule(matricule: string) {
        try {
            const result = await this.schema
                .aggregate([
                    { $match: { matricule: matricule } },
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
                    { $match: { matricule: code } },
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
        const filter = { matricule: code }
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

    async filter(page: string, limit: string, searchString: string) {
        try {
            const FACET = OptionPagination.facetForMongoose(page, limit)
            const result = await this.schema.aggregate([
                {   $match:  {
                        $or: [
                            { name: searchString },
                            { email: searchString },
                            { phone: searchString },
                            { matricule: searchString }
                        ]
                    }
                },
                {
                    $sort: { name: 1 }
                },
                FACET
            ]).exec()
            return result[0]
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    async deleteOne(code: string) {
        try {
            return await this.schema.deleteOne({ matricule: code }).exec()
        } catch (error: any) {
            throw Error(error.message)
        }
    }
}
