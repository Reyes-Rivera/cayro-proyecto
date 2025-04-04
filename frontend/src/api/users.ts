import axios from "./axios";

// EMPLOYEE ADMIN

export const updateProfileEmployee = async (id: number, data: object) =>
  axios.patch(`/employees/${id}`, data);

export const getUserAddress = async (id: number) =>
  axios.get(`/employees/address/${id}`);

export const updateAddress = async (id: number, data: object) =>
  axios.put(`/employees/${id}`, data);

export const updatePasswordEmployee = async (id: number, data: object) =>
  axios.patch(`/employees/change-password/${id}`, data);

export const newPasswordEmployee = async (id: number, data: object) =>
  axios.patch(`/employees/update-password/${id}`, data);

export const addEmployee = async (data: object) =>
  axios.post(`/employees`, data);

export const deleteEmployee = async (id: number) =>
  axios.delete(`/employees/${id}`);

export const getEmployees = async () => axios.get(`/employees`);

export const updateEmployee = async (id: number, data: object) =>
  axios.patch(`/employees/${id}`, data);

//Cliente
export const updateUser = async (id: number, data: object) =>
  axios.patch(`/users/${id}`, data);

export const updatePasswordUser = async (id: number, data: object) =>
  axios.patch(`/users/change-password/${id}`, data);

export const addAddressUser = async (id: number, data: object) =>
  axios.put(`/users/address/${id}`, data);

export const getUserAddresses = async (id: number) =>
  axios.get(`/users/addresses/${id}`);

export const updateAddressUser = async (id: number,addressId:number, data: object) =>
  axios.put(`/users/address/${id}/${addressId}`, data);

export const deleteAddressUser = async (id: number,addressId:number) =>
  axios.delete(`/users/address/${id}/${addressId}`);

export const getUserByEmail = async (email: object) =>
  axios.post(`/users/verifyUserExist`,email);

export const updateAnswer = async (id: number, data: object) =>
  axios.patch(`/users/update-answer/${id}`, data);
