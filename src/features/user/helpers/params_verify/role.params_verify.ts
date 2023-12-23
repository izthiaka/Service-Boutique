import UserGender from "../../../../core/constant/sexe_user"
import UserStatusAccount from "../../../../core/constant/user_status_account"
import VerifyField from "../../../../core/utils/verify_field"

export default class RoleParamsVerify extends VerifyField {

    name(req_body: any) {
        if (this.isValid(req_body.name)) {
            if (this.isString(req_body.name)) {
                return null
            }
            return "L'input [name] doit être une chaîne"
        }
        return "L'input [name] est requis"
    }

    code(req_body: any) {
        if (this.isValid(req_body.code)) {
            if (this.isString(req_body.code)) {
                return null
            }
            return "L'input [code] doit être une chaîne"
        }
        return "L'input [code] est requis"
    }

    verifyAllParamsStore(body: any) {
        const MESSAGE_ERROR = []
        let result = null

        result = this.name(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }
        return MESSAGE_ERROR
    }

    verifyAllParamsUpdate(body: any) {
        const MESSAGE_ERROR = []
        let result = null

        result = this.name(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }
        return MESSAGE_ERROR
    }
}
