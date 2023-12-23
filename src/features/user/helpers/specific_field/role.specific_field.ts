
export default class RoleSpecificField {
    
    static fromBody(objet: any) {
        return {
            name: objet.name,
        }
    }
    
    static fromSeeder(objet: any) {
        return {
            name: objet.name,
        }
    }

    static fields(objet: any) {
        return {
            code: objet.code,
            name: objet.name,
        }
    }

    static search(objet: any) {
        return {
            data: objet.data
        }
    }

    static fieldsDetail(objet: any) {
        return {
            code: objet.code,
            name: objet.name,
        }
    }
}
