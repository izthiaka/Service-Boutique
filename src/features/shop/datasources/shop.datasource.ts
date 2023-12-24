import { ShopEntity } from "../schemas/shop"

import OptionPagination from "../../../core/utils/option_pagination"

import IDatasource from "../../../core/interfaces/interface_datasource"
import { COLLECTION_SHOP_CATEGORY_NAME } from "../schemas/category"
import { COLLECTION_SHOP_USER_NAME } from "../../user/schemas/shop_user"
import { COLLECTION_ROLE_NAME } from "../../user/schemas/role"

const LookUpCategory = {
    $lookup: {
        from: COLLECTION_SHOP_CATEGORY_NAME,
        localField: "category",
        foreignField: "code",
        as: "category",
    },
}
const LookUpOwner = {
    $lookup: {
        from: COLLECTION_SHOP_USER_NAME,
        localField: "owner",
        foreignField: "matricule",
        as: "owner",
    },
}
const LookUpRole = {
    $lookup: {
        from: COLLECTION_ROLE_NAME,
        localField: "owner.role",
        foreignField: "code",
        as: "owner.role",
    },
}

export interface IDatasourceShop extends IDatasource {
    isExiste(match: object): Promise<boolean>
    filter(page: string, limit: string, query: string): Promise<any>
}

export default class ShopDatasource
    implements IDatasourceShop {
    constructor(private schema = ShopEntity) { }

    async findAll(page: string, limit: string) {
        try {
            const FACET = OptionPagination.facetForMongoose(page, limit)
            const result = await this.schema.aggregate([
                LookUpCategory,
                { $unwind: "$category" },
                LookUpOwner,
                { $unwind: "$owner" },
                LookUpRole,
                { $unwind: "$owner.role" },
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
                LookUpCategory,
                { $unwind: "$category" },
                LookUpOwner,
                { $unwind: "$owner" },
                LookUpRole,
                { $unwind: "$owner.role" },
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
                LookUpCategory,
                { $unwind: "$category" },
                LookUpOwner,
                { $unwind: "$owner" },
                LookUpRole,
                { $unwind: "$owner.role" },
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
                    LookUpCategory,
                    { $unwind: "$category" },
                    LookUpOwner,
                    { $unwind: "$owner" },
                    LookUpRole,
                    { $unwind: "$owner.role" },
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

    async filter(page: string, limit: string, searchString: string) {
        try {
            const FACET = OptionPagination.facetForMongoose(page, limit)
            const result = await this.schema.aggregate([
                LookUpCategory,
                { $unwind: "$category" },
                LookUpOwner,
                { $unwind: "$owner" },
                LookUpRole,
                { $unwind: "$owner.role" },
                {   $match:  {
                        $or: [
                            { name: searchString },
                            { email: searchString },
                            { phone: searchString },
                            { matricule: searchString },
                            { "category.name": searchString },
                            { "owner.name": searchString }
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
}
