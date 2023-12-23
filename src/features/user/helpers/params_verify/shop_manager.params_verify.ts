import UserGender from "../../../../core/constant/sexe_user"
import UserStatusAccount from "../../../../core/constant/user_status_account"
import VerifyField from "../../../../core/utils/verify_field"

export default class ShopManagerParamsVerify extends VerifyField {

    matricule(req_body: any) {
        if (this.isValid(req_body.matricule)) {
            if (this.isString(req_body.matricule)) {
                return null
            }
            return "L'input [matricule] doit être une chaîne"
        }
        return "L'input [matricule] est requis"
    }

    sexe(req_body: any) {
        if (this.isValid(req_body.sexe)) {
            const value = UserGender.validation.indexOf(req_body.sexe)
            if (value >= 0) {
                return null
            }
            return `Les sexes valides: [${UserGender.validation}]`
        }
        return "L'input [sexe] est requis"
    }

    role(req_body: any) {
        if (this.isValid(req_body.role)) {
            if (this.isString(req_body.role)) {
                return null
            }
            return "L'input [role] doit être une chaîne"
        }
        return "L'input [role] est requis"
    }

    name(req_body: any) {
        if (this.isValid(req_body.name)) {
            if (this.isString(req_body.name)) {
                return null
            }
            return "L'input [name] doit être une chaîne"
        }
        return "L'input [name] est requis"
    }

    email(req_body: any) {
        if (this.isValid(req_body.email)) {
            if (this.isEmail(req_body.email)) {
                return null
            }
            return "L''input [adresse email] doit être un email"
        }
        return "L''input [adresse email] est requis"
    }

    phone(req_body: any) {
        if (this.isValid(req_body.telephone)) {
            if (this.isPhone(req_body.telephone)) {
                return null
            }
            return "L'input [telephone] doit être un numéro de Téléphone"
        }
        return "L'input [telephone] est requis"
    }

    status(req_body: any) {
        if (this.isValid(req_body.status)) {
            const value = UserStatusAccount.validation.indexOf(req_body.status)
            if (value >= 0) {
                return null
            }
            return `Les status valides: [${UserStatusAccount.validation}]`
        }
        return "L'input [status] est requis"
    }

    photo(req_body: any) {
        if (this.isValid(req_body.photo)) {
            if (this.isString(req_body.photo)) {
                return null
            }
            return "L'input [photo] doit être une chaîne"
        }
        return "L'input [photo] est requis"
    }

    verifyAllParamsStore(body: any) {
        const MESSAGE_ERROR = []
        let result = null

        result = this.name(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }

        result = this.sexe(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }

        result = this.email(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }

        result = this.phone(body)
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

        result = this.sexe(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }

        result = this.email(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }

        result = this.phone(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }
        return MESSAGE_ERROR
    }
}
