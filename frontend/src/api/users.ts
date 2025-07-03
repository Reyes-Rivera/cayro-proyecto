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

//Cliente - User Management
export const updateUser = async (id: number, data: object) =>
  axios.patch(`/users/${id}`, data);

export const updatePasswordUser = async (id: number, data: object) =>
  axios.patch(`/users/change-password/${id}`, data);

export const getUserByEmail = async (email: object) =>
  axios.post(`/users/verifyUserExist`, email);

export const updateAnswer = async (id: number, data: object) =>
  axios.patch(`/users/update-answer/${id}`, data);

// User Address Management - Rutas corregidas para coincidir con el controlador NestJS

/**
 * Crear o vincular una dirección a un usuario
 * Ruta: PUT /users/address/:userId
 */
export const addAddressUser = async (
  userId: number,
  data: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    colony: string;
    isDefault?: boolean;
  }
) => axios.put(`/users/address/${userId}`, data);

/**
 * Obtener todas las direcciones de un usuario
 * Ruta: GET /users/:userId/addresses
 */
export const getUserAddresses = async (userId: number) =>
  axios.get(`/users/${userId}/addresses`);

/**
 * Actualizar una dirección específica de un usuario
 * Ruta: PUT /users/user/:userId/address/:addressId
 */
export const updateAddressUser = async (
  userId: number,
  addressId: number,
  data: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    colony?: string;
    isDefault?: boolean;
  }
) => axios.put(`/users/user/${userId}/address/${addressId}`, data);

/**
 * Eliminar una dirección específica de un usuario
 * Ruta: DELETE /users/user/:userId/address/:addressId
 */
export const deleteAddressUser = async (userId: number, addressId: number) =>
  axios.delete(`/users/user/${userId}/address/${addressId}`);

/**
 * Establecer una dirección como predeterminada
 * Ruta: PATCH /users/user/:userId/address/:addressId/set-default
 */
export const setDefaultAddressUser = async (
  userId: number | null,
  addressId: number
) => axios.patch(`/users/user/${userId}/address/${addressId}/set-default`);

// User Authentication & Recovery
export const createUser = async (data: object) => axios.post(`/users`, data);

export const resendCode = async (email: string) =>
  axios.post(`/users/resend-code`, { email });

export const verifyCode = async (email: string, code: string) =>
  axios.post(`/users/verify-code`, { email, code });

export const recoverPassword = async (email: string) =>
  axios.post(`/users/recover-password`, { email });

export const resetPassword = async (token: string, password: string) =>
  axios.post(`/users/reset-password/${token}`, { password });

export const compareAnswer = async (data: object) =>
  axios.post(`/users/compare-answer`, data);

// Admin functions
export const lockUser = async (days: number, email: string) =>
  axios.post(`/users/lock`, { days, email });

export const generateSmartWatchCode = async (id: number) =>
  axios.post(`/users/generate-smartwatch-code/${id}`);

export const getSmartWatchCode = async (id: number) =>
  axios.post(`/users/get-smartwatch-code/${id}`);

// User Notifications
export const getNotifications = async (userId: number) =>
  axios.get(`/notifications/${userId}`);
