export interface Direction {
  street: string
  city: string
  country: string
  neighborhood: string
  references: string
  id: number
  isDefault?: boolean
}

export interface UserInterface {
  name: string
  surname: string
  email: string
  phone: string
  birthdate: Date
  password: string
  gender: string
  direction?: Direction[]
  active?: boolean
  role?: string
  confirmPassword?: string
  id?: string
}

export type FormErrors = {
  street?: string
  city?: string
  country?: string
  neighborhood?: string
  references?: string
}

export type CheckoutStep = "shipping" | "payment" | "confirmation"

export interface BillingDetails {
  name: string
  email: string
  phone: string
  address: {
    line1: string
    city: string
    state: string
    postal_code: string
    country: string
  }
}

export interface CheckoutFormProps {
  clientSecret: string
  onPaymentSuccess: (paymentIntent: any) => void
  onPaymentError: (errorMessage: string) => void
  isProcessing: boolean
  setIsProcessing: (isProcessing: boolean) => void
  total: number
}
