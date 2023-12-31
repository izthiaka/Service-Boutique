import { Request, Response } from "express"

import IController from "../../../core/interfaces/interface_controller"
import ApiResponse from "../../../core/utils/ApiResponse"
import OptionPagination from "../../../core/utils/option_pagination"

import ShopParamsVerify from "../helpers/params_verify/shop.params_verify"
import ShopRepository from "../repositories/shop.repository"
import UrlFileUtil from "../../../core/utils/url_file"
import VerifyField from "../../../core/utils/verify_field"

interface IShopController extends IController {
    status(req: Request, res: Response): any
    filter(req: Request, res: Response): any
    updatePicture(req: Request, res: Response): any
    resetPicture(req: Request, res: Response): any
}

const staticUrlImage = "images/shops"

export default class ShopController
    extends ApiResponse
    implements IShopController {
    private verifyParams = new ShopParamsVerify()
    private verifyField = new VerifyField()
    constructor(private repository: ShopRepository) {
        super("")
    }

    async index(req: Request, res: Response) {
        try {
            const pagination = new OptionPagination(req)
            const result = await this.repository.getAll(
                pagination.page,
                pagination.limit,
            )
            return this.success(res, 200, "La liste des boutiques", result)
        } catch (error: any) {
            return this.fail(res, error.message)
        }
    }

    async store(req: Request, res: Response) {
        const { body } = req
        try {
            const MESSAGE_ERROR: string[] =
                this.verifyParams.verifyAllParamsStore(body)

            if (MESSAGE_ERROR.length === 0) {
                const result = await this.repository.save(body)
                return this.created(
                    res,
                    201,
                    "Une nouvelle boutique a été ajouté",
                    result,
                )
            }

            return this.clientError(res, MESSAGE_ERROR.join(" - "))
        } catch (error: unknown) {
            return this.sendError(error, res)
        }
    }

    async show(req: Request, res: Response) {
        try {
            const { params } = req
            const { code } = params

            const result = await this.repository.getOneByCode(code)
            return this.success(res, 200, "Détail d'une boutique", result)
        } catch (error: any) {
            return this.sendError(error.message, res)
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { params } = req
            const { body } = req

            const MESSAGE_ERROR: string[] =
                this.verifyParams.verifyAllParamsUpdate(body)

            if (MESSAGE_ERROR.length === 0) {
                const result = await this.repository.update(params.code, body)
                return this.created(res, 200, "Les informations ont été mise à jour", result)
            }
            return this.clientError(res, MESSAGE_ERROR.join(" - "))
        } catch (error: any) {
            return this.sendError(error.message, res)
        }
    }

    async delete(req: Request, res: Response) {
        throw Error(`Controller delete not used [${req} ${res}]`)
    }

    async status(req: Request, res: Response) {
        try {
            const { params } = req
            const { body } = req

            const MESSAGE_ERROR =
                this.verifyParams.status(body)

            if (MESSAGE_ERROR === null) {
                const result = await this.repository.updateStatus(params.code, body)
                return this.created(res, 200, "Le status boutique a été mise à jour", result)
            }
            return this.clientError(res, MESSAGE_ERROR)
        } catch (error: any) {
            return this.sendError(error.message, res)
        }
    }

    async filter(req: Request, res: Response) {
        try {
            const pagination = new OptionPagination(req)
            const { query } = req
            const result = await this.repository.filterList(
                pagination.page,
                pagination.limit,
                query
            )
            return this.success(res, 200, "La liste des boutique | filtre", result)
            return true
        } catch (error: any) {
            return this.sendError(error.message, res)
        }
    }

    async updatePicture(req: Request, res: Response) {
        try {
            const { params } = req

            const MESSAGE_ERROR = this.verifyParams.code(params)
            if (MESSAGE_ERROR === null) {
                const urlImage = UrlFileUtil.getUrlFileIsExist(req, staticUrlImage)
                if(this.verifyField.isValid(urlImage)) {
                    const urlHost = UrlFileUtil.setUrlWithHosting(req, urlImage)
    
                    const body = { "photo": urlHost }
    
                    const result = await this.repository.updatePictureByCode(req, params.code, body)
                    return this.success(res, 200, "Mise à jour Photo Boutique avec succés", result)
                }
                return this.clientError(res, "Pas d'image")
            }
            return this.clientError(res, MESSAGE_ERROR)
        } catch (error: any) {
            return this.sendError(error.message, res)
        }
    }

    async resetPicture(req: Request, res: Response) {
        try {
            const { params } = req

            const MESSAGE_ERROR = this.verifyParams.code(params)
            if (MESSAGE_ERROR === null) {
                const result = await this.repository.resetPictureByCode(req, params.code)
                return this.success(res, 200, "Mise à jour Photo Boutique avec succés", result)
            }
            return this.clientError(res, MESSAGE_ERROR)
        } catch (error: any) {
            return this.sendError(error.message, res)
        }
    }
}
