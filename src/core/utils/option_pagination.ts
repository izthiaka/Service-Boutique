import { Request } from "express"

export default class OptionPagination {
  page: any
  limit: any
  constructor(request: Request) {
    try {
      this.page = request.query.page != null ? request.query.page : 1
      this.limit = request.query.limit != null ? request.query.limit : 10
    } catch (error) {
      this.page = 1
      this.limit = 10
    }
  }

  static facetForMongoose(pageParams: string, limitParams: string) {
    const page = parseInt(pageParams, 10) || 1
    const limit = parseInt(limitParams, 10) || 10

    return {
      $facet: {
        metadata: [{ $count: "total" }, { $addFields: { page } }],
        data: [{ $skip: limit * (page - 1) }, { $limit: limit }],
      },
    }
  }
}
