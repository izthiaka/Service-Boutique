import ShopOwnerSpecificField from "../../../user/helpers/specific_field/shop_ownership.specific_field"
import ShopCategorySpecificField from "./category.specific_field"

export default class ShopSpecificField {
    
    static fromBody(objet: any) {
        return {
            name: objet.name,
            email: objet.email,
            phone: objet.telephone,
            category: objet.category_boutique,
            adresse: objet.adresse,
            description: objet.description,
            owner: objet.proprio,
        }
    }
    
    static fromSeeder(objet: any) {
        return {
            name: objet.name,
            email: objet.email,
            phone: objet.phone,
            category: objet.category_boutique,
            adresse: objet.adresse,
            description: objet.description,
            owner: objet.proprio,
        }
    }

    static fields(objet: any) {
        return {
            code: objet.code,
            name: objet.name,
            photo: objet.photo,
            email: objet.email,
            phone: objet.phone,
            category: ShopCategorySpecificField.fields(objet.category),
            adresse: objet.adresse,
            description: objet.description,
            owner: ShopOwnerSpecificField.fields(objet.owner),
            status: objet.status
        }
    }

    static fieldsOnly(objet: any) {
        return {
            code: objet.code,
            name: objet.name,
            photo: objet.photo,
            email: objet.email,
            phone: objet.phone,
            category: ShopCategorySpecificField.fields(objet.category),
            adresse: objet.adresse,
            description: objet.description,
            status: objet.status
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
            photo: objet.photo,
            email: objet.email,
            phone: objet.phone,
            category: ShopCategorySpecificField.fields(objet.category),
            adresse: objet.adresse,
            description: objet.description,
            owner: ShopOwnerSpecificField.fields(objet.owner),
            status: objet.status
        }
    }
}
