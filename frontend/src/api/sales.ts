import axios from "./axios";

export const getSales = (params: string) => axios.get(`/sales?${params}`);

export const getSaleById = (id: number) => axios.get(`/sales/${id}`);
export const getSaleByUser = (id: number) =>
  axios.get(`/sales/user-purchases/${id}`);
export const getOrders = () => axios.get("/sales/orders");

export const changeStatus = (data: object) =>
  axios.patch(`/sales/change-status`, data);

export const sendTrackingEmail = (data: {
  orderId: number;
  customerEmail: string;
  customerName: string;
  trackingNumber: string;
  shippingCompany: string;
}) => axios.post(`/sales/notify`, data);
export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: number;
  city?: string;
  state?: string;
  employeeId?: number;
  brandId?: number;
}
export const generateSalesReportPDF = async (
  filters: ReportFilters
): Promise<Blob> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.append(key, value.toString());
    }
  });

  const response = await axios.get(`/sales-report/pdf?${params.toString()}`, {
    responseType: "blob", // Importante para recibir el archivo como blob
  });

  return response.data;
};

// Función para previsualizar el PDF
export const previewSalesReportPDF = async (
  filters: ReportFilters
): Promise<Blob> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.append(key, value.toString());
    }
  });

  const response = await axios.get(
    `/sales-report/preview?${params.toString()}`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};
