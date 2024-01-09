import mongoose, { Schema, model } from "mongoose"

export const COLLECTION_PRODUCT_CATEGORY_NAME = "product_categories"

export interface IProductCategory {
    _id: mongoose.Types.ObjectId
    code: string
    name: string
    photo: string
}

export type ProductCategorySchema = object & IProductCategory & Document

const schema: Schema<ProductCategorySchema> = new Schema<ProductCategorySchema>(
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

export const ProductCategoryEntity = model(COLLECTION_PRODUCT_CATEGORY_NAME, schema)
