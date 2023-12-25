import VerifyField from "../../../../core/utils/verify_field"

export default class SubscriptionParamsVerify extends VerifyField {

    title(req_body: any) {
        if (this.isValid(req_body.title)) {
            if (this.isString(req_body.title)) {
                return null
            }
            return "L'input [title] doit être une chaîne"
        }
        return "L'input [title] est requis"
    }

    pricing(req_body: any) {
        if (this.isValid(req_body.pricing)) {
            if (this.isNumber(req_body.pricing)) {
                return null
            }
            return "L'input [prix] doit être un nombre"
        }
        return "L'input [prix] est requis"
    }

    numberMonth(req_body: any) {
        if (this.isValid(req_body.number_month)) {
            if (this.isNumber(req_body.number_month)) {
                return null
            }
            return "L'input [nombre de mois] doit être un nombre"
        }
        return "L'input [nombre de mois] est requis"
    }

    description(req_body: any) {
        if (this.isValid(req_body.description)) {
            if (this.isString(req_body.description)) {
                return null
            }
            return "L'input [description] doit être une chaîne"
        }
        return "L'input [description] est requis"
    }

    verifyAllParamsStore(body: any) {
        const MESSAGE_ERROR = []
        let result = null

        result = this.title(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }
        result = this.pricing(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }
        result = this.numberMonth(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }
        result = this.description(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }
        return MESSAGE_ERROR
    }

    verifyAllParamsUpdate(body: any) {
        const MESSAGE_ERROR = []
        let result = null

        result = this.title(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }
        result = this.pricing(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }
        result = this.numberMonth(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }
        result = this.description(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }
        return MESSAGE_ERROR
    }
}
