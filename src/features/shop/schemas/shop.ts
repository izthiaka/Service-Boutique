import mongoose, { Schema, model } from "mongoose"
import { COLLECTION_SHOP_CATEGORY_NAME } from "./category"
import ShopStatus from "../../../core/constant/shop_status"
import { COLLECTION_SHOP_USER_NAME } from "../../user/schemas/shop_user"

export const COLLECTION_SHOP_NAME = "shops"

export interface IShop {
    _id: mongoose.Types.ObjectId
    code: string
    name: string
    email: string
    phone: string
    photo: string
    category: string
    adresse: object
    description: string
    status: string
    owner: string
}

export type ShopSchema = object & IShop & Document

const schema: Schema<ShopSchema> = new Schema<ShopSchema>(
    {
        code: {
          type: String,
          unique: true,
          required: true,
        },
        name: {
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
        photo: {
            type: String,
            default: null,
        },
        category: {
            type: String,
            ref: COLLECTION_SHOP_CATEGORY_NAME,
            required: true,
        },
        adresse: {
            type: Map,
            required: true,
        },
        description: {
            type: String,
            default: null,
        },
        status: {
            type: String,
            default: ShopStatus.getPendingStatusLibelle(),
        },
        owner: {
            type: String,
            ref: COLLECTION_SHOP_USER_NAME,
            required: true,
        },
    },
    { timestamps: true },
)

export const ShopEntity = model(COLLECTION_SHOP_NAME, schema)
