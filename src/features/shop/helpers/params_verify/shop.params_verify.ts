import VerifyField from "../../../../core/utils/verify_field"

export default class ShopParamsVerify extends VerifyField {

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

    photo(req_body: any) {
        if (this.isValid(req_body.photo)) {
            if (this.isString(req_body.photo)) {
                return null
            }
            return "L'input [photo] doit être une chaîne"
        }
        return "L'input [photo] est requis"
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

    category(req_body: any) {
        if (this.isValid(req_body.category_boutique)) {
            if (this.isString(req_body.category_boutique)) {
                return null
            }
            return "L'input [category_boutique] doit être une chaîne"
        }
        return "L'input [category_boutique] est requis"
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

    status(req_body: any) {
        if (this.isValid(req_body.status)) {
            if (this.isString(req_body.status)) {
                return null
            }
            return "L'input [status] doit être une chaine de caractére"
        }
        return "L'input [status] est requis"
    }

    owner(req_body: any) {
        if (this.isValid(req_body.proprio)) {
            if (this.isString(req_body.proprio)) {
                return null
            }
            return "L'input [proprio] doit être une chaîne"
        }
        return "L'input [proprio] est requis"
    }

    adresse(req_body: any) {
        if (this.isValid(req_body.adresse)) {
            if (!this.isString(req_body.adresse.libelle) ||
            !this.isNumber(req_body.adresse.lat) ||
            !this.isNumber(req_body.adresse.long)
            ) {
                const { libelle } = req_body.adresse
                if (!this.isString(libelle)) {
                    return "L'adresse est requise"
                }
                const { lat } = req_body.adresse
                if (!this.isNumber(lat)) {
                    return "L'attitude invalide ou non renseigné"
                }
                const { long } = req_body.adresse
                if (!this.isNumber(long)) {
                    return "Longitude invalide ou non renseigné"
                }
            }
            return null
        }
        return "L'adresse est requise"
    }

    verifyAllParamsStore(body: any) {
        const MESSAGE_ERROR = []
        let result = null

        result = this.name(body)
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
        result = this.category(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }
        result = this.description(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }
        result = this.owner(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }
        result = this.adresse(body)
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
        result = this.email(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }
        result = this.phone(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }
        result = this.category(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }
        result = this.description(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }
        result = this.adresse(body)
        if (result) {
            MESSAGE_ERROR.push(result)
        }
        return MESSAGE_ERROR
    }
}
