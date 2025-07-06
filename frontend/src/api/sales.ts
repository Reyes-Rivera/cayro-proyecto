import axios from "./axios";

export const getSales = (params:string) => axios.get(`/sales?${params}`);

export const getSaleById = (id: number) => axios.get(`/sales/${id}`);
export const getSaleByUser = (id: number) => axios.get(`/sales/user-purchases/${id}`);
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
