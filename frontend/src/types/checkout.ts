

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




export interface Direction {
  id: number
  street: string
  city: string
  state: string
  country: string
  postalCode: string
  colony: string
  neighborhood: string // Alias para colony (para compatibilidad)
  references: string
  isDefault: boolean
  userAddressId?: number
}

export interface AddressFormData {
  street: string
  city: string
  state: string
  country: string
  postalCode: string
  colony: string
  references: string
  isDefault: boolean
}

export interface FormErrors {
  street?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  colony?: string
  references?: string
}



export type CheckoutStep = "shipping" | "shipping-details" | "payment"

export interface Direction {
  id: number
  street: string
  city: string
  state: string
  country: string
  postalCode: string
  colony: string
  neighborhood: string
  references: string
  isDefault: boolean
  userAddressId?: number
}

export interface AddressFormData {
  street: string
  city: string
  state: string
  country: string
  postalCode: string
  colony: string
  references: string
  isDefault: boolean
}

export interface ShippingDetailsFormData {
  references: string
  betweenStreetOne: string
  betweenStreetTwo: string
}

export interface FormErrors {
  street?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  colony?: string
  references?: string
  betweenStreetOne?: string
  betweenStreetTwo?: string
}
