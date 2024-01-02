import mongoose, { Schema, model } from "mongoose"

export const COLLECTION_SUBSCRIPTION_NAME = "subscriptions"

export interface ISubscription {
    _id: mongoose.Types.ObjectId
    code: string
    title: string
    description: string
    status: boolean
    pricing: number
    number_month: number
}

export type SubscriptionSchema = object & ISubscription & Document

const schema: Schema<SubscriptionSchema> = new Schema<SubscriptionSchema>(
    {
        code: {
            type: String,
            unique: true,
            required: true,
        },
        title: {
            type: String,
            unique: true,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
        pricing: {
            type: Number,
            required: true,
        },
        number_month: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true },
)

export const SubscriptionEntity = model(COLLECTION_SUBSCRIPTION_NAME, schema)
