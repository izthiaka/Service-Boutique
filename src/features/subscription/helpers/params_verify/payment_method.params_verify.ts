import VerifyField from "../../../../core/utils/verify_field"

export default class PaymentMethodParamsVerify extends VerifyField {

    code_payment(req_body: any) {
        if (this.isValid(req_body.code_payment)) {
            if (this.isString(req_body.code_payment)) {
                return null
            }
            return "L'input [code_payment] doit être une chaîne"
        }
        return "L'input [code_payment] est requis"
    }

    name_payment(req_body: any) {
        if (this.isValid(req_body.name_payment)) {
            if (this.isNumber(req_body.name_payment)) {
                return null
            }
            return "L'input [name_payment] doit être un nombre"
        }
        return "L'input [name_payment] est requis"
    }

    status(req_body: any) {
        if (this.isValid(req_body.status)) {
            if (this.isNumber(req_body.status)) {
                return null
            }
            return "L'input [status] doit être un Boolean"
        }
        return "L'input [status] est requis"
    }

    verifyAllParamsStore(body: any) {
        const MESSAGE_ERROR = []
        let result = null

        result = this.name_payment(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }
        result = this.status(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }
        return MESSAGE_ERROR
    }

    verifyAllParamsUpdate(body: any) {
        const MESSAGE_ERROR = []
        let result = null

        result = this.name_payment(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }
        result = this.status(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }
        return MESSAGE_ERROR
    }
}
