import mongoose, { Schema, model } from "mongoose"

export const COLLECTION_CATEGORY_NAME = "shop_categories"

export interface ICategory {
    _id: mongoose.Types.ObjectId
    code: string
    name: string
    photo: string
}

export type CategorySchema = object & ICategory & Document

const schema: Schema<CategorySchema> = new Schema<CategorySchema>(
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

export const CategoryEntity = model(COLLECTION_CATEGORY_NAME, schema)
