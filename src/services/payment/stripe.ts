import { Stripe } from "stripe"

export interface PaymentIntent {
  amount: number
  currency: string
  customer_stripe_id?: string
  metadata: MetadataPaymentIntent
}

export interface Customer {
  name: string
  email: string
}

export interface MetadataPaymentIntent {
  subscription_code: string
  subscription_title: string
  number_of_times: number
}

export default class StripePayment {
  private stripe: Stripe

  constructor(private privateKey: string) {
    this.stripe = new Stripe(this.privateKey, {
      apiVersion: "2023-10-16",
    })
  }

  async createCustomer(
    customerInfo: Customer,
  ): Promise<Stripe.Response<Stripe.Customer>> {
    try {
      const customer = await this.stripe.customers.create({
        name: customerInfo.name,
        email: customerInfo.email,
      })
      return customer
    } catch (error) {
      throw Error("An error occurred during create customer.")
    }
  }

  async customerPayment(customer_id: any): Promise<Array<any>> {
    try {
      const payments = await this.stripe.paymentIntents.search({
        query: `customer:'${customer_id}'`,
      })
      return payments.data
    } catch (error) {
      return []
    }
  }

  async clientSecret(intent: PaymentIntent): Promise<string | null> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: intent.amount,
        currency: "GBP",
        customer: intent.customer_stripe_id,
        metadata: {
          subscription_code: intent.metadata.subscription_code,
          subscription_title: intent.metadata.subscription_title,

          number_of_times: `${intent.metadata.number_of_times}`,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      })
      return paymentIntent.client_secret
    } catch (error) {
      throw Error("An error occurred during payment.")
    }
  }
}
