
export default class ShopOwnerSpecificField {
    
    static fromBody(objet: any) {
        return {
            name: objet.name,
            gender: objet.sexe,
            email: objet.email,
            phone: objet.telephone
        }
    }
    
    static fromSeeder(objet: any) {
        return {
            name: objet.name,
            gender: objet.sexe,
            email: objet.email,
            phone: objet.telephone
        }
    }

    static fields(objet: any) {
        return {
            matricule: objet.matricule,
            name: objet.name,
            sexe: objet.gender,
            email: objet.email,
            phone: objet.phone,
            status: objet.status,
            photo: objet.photo,
        }
    }

    static search(objet: any) {
        return {
            data: objet.data
        }
    }

    static fieldsDetail(objet: any) {
        return {
            matricule: objet.matricule,
            name: objet.name,
            sexe: objet.gender,
            email: objet.email,
            phone: objet.phone,
            status: objet.status,
            photo: objet.photo,
        }
    }
}
