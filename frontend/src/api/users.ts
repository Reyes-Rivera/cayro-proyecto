import axios from "./axios";

// EMPLOYEE

export const updateProfileEmployee = async (id: number, data: object) =>
  axios.patch(`/employees/${id}`, data);

export const getUserAddress = async (id: number) =>
  axios.get(`/employees/${id}/admin-address`);
