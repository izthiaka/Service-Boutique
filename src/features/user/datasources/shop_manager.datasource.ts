import { ShopUserEntity } from "../schemas/shop_user"

import OptionPagination from "../../../core/utils/option_pagination"

import IDatasource from "../../../core/interfaces/interface_datasource"
import { COLLECTION_ROLE_NAME } from "../schemas/role"

const LookUpRole = {
    $lookup: {
        from: COLLECTION_ROLE_NAME,
        localField: "role",
        foreignField: "code",
        as: "role",
    },
}

export interface IDatasourceShopManager extends IDatasource {
    isExiste(match: object): Promise<boolean>
    filter(page: string, limit: string, query: string): Promise<any>
}

export default class ShopManagerDatasource
    implements IDatasourceShopManager {
    constructor(private schema = ShopUserEntity) { }

    async findAll(page: string, limit: string) {
        try {
            const FACET = OptionPagination.facetForMongoose(page, limit)
            const result = await this.schema.aggregate([
                LookUpRole,
                { $unwind: "$role"},
                { 
                    $match: {
                        "role.name": "Gérant"
                    }
                },
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
                LookUpRole,
                { $unwind: "$role"},
                { $match: {
                    $and : [
                        {
                            "role.name": "Gérant"
                        },
                        match,
                    ],
                }}
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
                    LookUpRole,
                    { $unwind: "$role"},
                    { $match: {
                        $and : [
                            {
                                "role.name": "Gérant"
                            },
                            { name: code },
                        ],
                    }}
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
                    LookUpRole,
                    { $unwind: "$role"},
                    { $match: {
                        $and : [
                            {
                                "role.name": "Gérant"
                            },
                            { matricule: matricule },
                        ],
                    }}
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
                    LookUpRole,
                    { $unwind: "$role"},
                    { $match: {
                        $and : [
                            {
                                "role.name": "Gérant"
                            },
                            { matricule: code },
                        ],
                    }}
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
                LookUpRole,
                { $unwind: "$role"},
                {   $match:  {
                        $and : [
                            { "role.name": "Gérant" }
                        ],
                        $or: [
                            { name: searchString },
                            { email: searchString },
                            { phone: searchString },
                            { matricule: searchString },
                            { "role.name": searchString }
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
