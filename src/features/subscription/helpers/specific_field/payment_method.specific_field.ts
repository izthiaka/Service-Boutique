export default class PaymentMethodSpecificField {
    static fromBody(objet: any) {
        return {
            name_payment: objet.name_payment,
            status: objet.status
        }
    }
    static fromSeeder(objet: any) {
        return {
            name_payment: objet.name_payment,
            status: objet.status
        }
    }

    static fields(objet: any) {
        return {
            code_payment: objet.code_payment,
            name_payment: objet.name_payment,
            status: objet.status
        }
    }

    static fieldsByGuest(objet: any) {
        return {
            code_payment: objet.code_payment,
            name_payment: objet.name_payment
        }
    }
}
