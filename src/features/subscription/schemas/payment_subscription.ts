import mongoose, { Schema, model } from "mongoose"

import { COLLECTION_SHOP_USER_NAME } from "../../user/schemas/shop_user"
import { COLLECTION_SUBSCRIPTION_NAME } from "./subscription"
import { COLLECTION_PAYMENT_METHOD_NAME } from "./payment_methods"

export const COLLECTION_PAYMENT_SUBSCRIPTION_NAME = "subscription_payments"

export interface IPaymentSubscription {
    _id: mongoose.Types.ObjectId
    transaction_id: string
    amount: number
    start_at: Date
    expires_at: Date
    is_validated: boolean
    user: string
    subscription: string
    payment_method: string
}

export type PaymentSubscriptionSchema = object & IPaymentSubscription & Document

const schema: Schema<PaymentSubscriptionSchema> =
    new Schema<PaymentSubscriptionSchema>(
        {
            transaction_id: {
                type: String,
                required: true,
            },
            amount: {
                type: Number,
                default: 0,
            },
            start_at: {
                type: Date,
                required: true,
            },
            expires_at: {
                type: Date,
                required: true,
            },
            is_validated: {
                type: Boolean,
                default: true,
            },
            user: {
                type: String,
                ref: COLLECTION_SHOP_USER_NAME,
                required: true,
            },
            subscription: {
                type: String,
                ref: COLLECTION_SUBSCRIPTION_NAME,
                required: true,
            },
            payment_method: {
                type: String,
                ref: COLLECTION_PAYMENT_METHOD_NAME,
                required: true,
            },
        },
        { timestamps: true },
    )

export const PaymentSubscriptionEntity = model(
    COLLECTION_PAYMENT_SUBSCRIPTION_NAME,
    schema,
)
