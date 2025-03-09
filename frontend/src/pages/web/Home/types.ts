export interface BenefitCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export interface CategoryCardProps {
  image: string
  title: string
  isActive: boolean
  index: number
}

export interface ProductCardProps {
  image: string
  title: string
  price: string
  discount?: string
}

export interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
}

export interface Category {
  title: string
  image: string
}

