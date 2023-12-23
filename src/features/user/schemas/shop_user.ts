import mongoose, { Schema, model } from "mongoose"
import ShopOwnerStatusAccount from "../../../core/constant/user_status_account"
import { COLLECTION_ROLE_NAME } from "./role"

export const COLLECTION_SHOP_USER_NAME = "shop_users"

export interface IShopUser {
    _id: mongoose.Types.ObjectId
    matricule: string
    name: string
    gender: string
    email: string
    phone: string
    status: string
    photo: string
    role: string
}

export type ShopUserSchema = object & IShopUser & Document

const schema: Schema<ShopUserSchema> = new Schema<ShopUserSchema>(
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
        role: {
            type: String,
            ref: COLLECTION_ROLE_NAME,
            required: true,
        },
    },
    { timestamps: true },
)

export const ShopUserEntity = model(COLLECTION_SHOP_USER_NAME, schema)
