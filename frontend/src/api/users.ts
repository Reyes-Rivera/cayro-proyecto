import axios from "./axios";

// EMPLOYEE

export const updateProfileEmployee = async (id: number, data: object) =>
  axios.patch(`/employees/${id}`, data);
