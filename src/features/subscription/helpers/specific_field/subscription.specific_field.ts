export default class SubscriptionSpecificField {
    static fromBody(objet: any) {
        return {
            title: objet.title,
            description: objet.description,
            status: objet.status,
            pricing: objet.pricing,
            number_month: objet.number_month,
        }
    }
    static fromSeeder(objet: any) {
        return {
            title: objet.title,
            description: objet.description,
            status: objet.status,
            pricing: objet.pricing,
            number_month: objet.number_month,
        }
    }

    static fields(objet: any) {
        return {
            code: objet.code,
            title: objet.title,
            description: objet.description,
            status: objet.status,
            pricing: objet.pricing,
            number_month: objet.number_month,
        }
    }

    static fieldsByGuest(objet: any) {
        return {
            code: objet.code,
            title: objet.title,
            description: objet.description,
            pricing: objet.pricing,
        }
    }
}
