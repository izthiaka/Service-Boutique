import mongoose, { Schema, model } from "mongoose"

export const COLLECTION_SHOP_CATEGORY_NAME = "shop_categories"

export interface IShopCategory {
    _id: mongoose.Types.ObjectId
    code: string
    name: string
    photo: string
}

export type ShopCategorySchema = object & IShopCategory & Document

const schema: Schema<ShopCategorySchema> = new Schema<ShopCategorySchema>(
    {
        code: {
          type: String,
          unique: true,
          required: true,
        },
        name: {
            type: String,
            unique: true,
            required: true,
        },
        photo: {
            type: String,
            default: null,
        }
    },
    { timestamps: true },
)

export const ShopCategoryEntity = model(COLLECTION_SHOP_CATEGORY_NAME, schema)
