import mongoose, { Schema, model } from "mongoose"
import ShopOwnerStatusAccount from "../../../core/constant/user_status_account"

export const COLLECTION_SHOP_OWNERSHIP_NAME = "shop_owners"

export interface IShopOwner {
    _id: mongoose.Types.ObjectId
    matricule: string
    name: string
    gender: string
    email: string
    phone: string
    status: string
    photo: string
}

export type ShopOwnerSchema = object & IShopOwner & Document

const schema: Schema<ShopOwnerSchema> = new Schema<ShopOwnerSchema>(
    {
        matricule: {
          type: String,
          unique: true,
          required: true,
        },
        name: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            default: null,
        },
        phone: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: ShopOwnerStatusAccount.getPendingStatusLibelle(),
        },
        photo: {
            type: String,
            default: null,
        },
    },
    { timestamps: true },
)

export const ShopOwnerEntity = model(COLLECTION_SHOP_OWNERSHIP_NAME, schema)
