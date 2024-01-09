import { Request, Response } from "express"

import IController from "../../../core/interfaces/interface_controller"
import ApiResponse from "../../../core/utils/ApiResponse"
import OptionPagination from "../../../core/utils/option_pagination"

import PaymentMethodParamsVerify from "../helpers/params_verify/payment_method.params_verify"
import PaymentMethodRepository from "../repositories/payment_method.repository"


interface IPaymentMethodController extends IController {
    indexGuest(req: Request, res: Response): any
    changeStatus(req: Request, res: Response): any
}

export default class PaymentMethodController
    extends ApiResponse
    implements IPaymentMethodController {
    private verifyParams = new PaymentMethodParamsVerify()
    constructor(private repository: PaymentMethodRepository) {
        super("")
    }

    async index(req: Request, res: Response) {
        try {
            const pagination = new OptionPagination(req)
            const result = await this.repository.getAll(
                pagination.page,
                pagination.limit,
            )
            return this.success(res, 200, "La liste des méthodes de paiement", result)
        } catch (error: any) {
            return this.fail(res, error.message)
        }
    }

    async indexGuest(req: Request, res: Response) {
        try {
            const result = await this.repository.getAllByGuest()
            return this.success(res, 200, "La liste des méthodes de paiement | Public", result)
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
                    "Une nouvelle méthode de paiement a été ajoutée",
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
            return this.success(res, 200, "Détail d'une méthode de paiement", result)
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

    async changeStatus(req: Request, res: Response) {
        try {
            const { params } = req
            const result = await this.repository.changeStatus(params.code)
            return this.created(
                res,
                200,
                "Le status méthode de paiement a été mis à jour",
                result,
            )
        } catch (error: any) {
            return this.sendError(error.message, res)
        }
    }

    async delete(req: Request, res: Response) {
        throw Error(`Controller delete not used [${req} ${res}]`)
    }
}
