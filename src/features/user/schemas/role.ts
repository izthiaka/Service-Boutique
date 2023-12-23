import mongoose, { Schema, model } from "mongoose"

export const COLLECTION_ROLE_NAME = "roles"

export interface IRole {
    _id: mongoose.Types.ObjectId
    code: string
    name: string
}

export type RoleSchema = object & IRole & Document

const schema: Schema<RoleSchema> = new Schema<RoleSchema>(
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
        }
    },
    { timestamps: true },
)

export const RoleEntity = model(COLLECTION_ROLE_NAME, schema)
