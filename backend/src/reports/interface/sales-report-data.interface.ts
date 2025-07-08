export interface SalesReportData {
  totals: {
    totalSales: number
    totalRevenue: number
    totalProducts: number
    averageOrderValue: number
  }
  monthlySales: Record<
    string,
    {
      salesCount: number
      revenue: number
      productsSold: number
    }
  >
  salesByCategory: Record<
    string,
    {
      salesCount: number
      revenue: number
      productsSold: number
    }
  >
  salesByCity: Record<
    string,
    {
      salesCount: number
      revenue: number
      productsSold: number
    }
  >
  salesByEmployee: Record<
    string,
    {
      salesCount: number
      revenue: number
      productsSold: number
    }
  >
  salesByBrand: Record<
    string,
    {
      salesCount: number
      revenue: number
      productsSold: number
    }
  >
  salesByGender: Record<
    string,
    {
      salesCount: number
      revenue: number
      productsSold: number
    }
  >
  topProducts: Array<{
    productName: string
    totalSold: number
    totalRevenue: number
  }>
  topVariants: Array<{
    id: number
    productName: string
    colorName: string
    colorHex: string
    sizeName: string
    totalSold: number
    totalRevenue: number
    categoryName: string
    brandName: string
  }>
  rawSales: any[]
}
