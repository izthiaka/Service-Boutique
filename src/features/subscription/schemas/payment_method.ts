import mongoose, { Schema, model } from "mongoose"

export const COLLECTION_PAYMENT_METHOD_NAME = "payment_methods"

export interface IPaymentMethod {
    _id: mongoose.Types.ObjectId
    code_payment: string
    name_payment: string
    status: boolean
}

export type PaymentMethodSchema = object & IPaymentMethod & Document

const schema: Schema<PaymentMethodSchema> =
    new Schema<PaymentMethodSchema>(
        {
            code_payment: {
                type: String,
                unique: true,
                required: true,
            },
            name_payment: {
                type: String,
                unique: true,
                required: true,
            },
            status: {
                type: Boolean,
                default: true,
            },
        },
        { timestamps: true },
    )

export const PaymentMethodEntity = model(
    COLLECTION_PAYMENT_METHOD_NAME,
    schema,
)
