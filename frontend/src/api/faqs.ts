import axios from "./axios";

export const getCategoriesFaqs = async () => {
  const res = await axios.get(`/faq-category`, {
    withCredentials: true,
  });
  return res;
};
export const createCategoryFaqs = async (data: object) => {
  const res = await axios.post(`/faq-category`, data, {
    withCredentials: true,
  });
  return res;
};

export const updateCategoryFaqs = async (id: number, data: object) => {
  const res = await axios.patch(`/faq-category/${id}`, data, {
    withCredentials: true,
  });
  return res;
};

export const deleteCategoryFaqs = async (id: number) => {
  const res = await axios.delete(`/faq-category/${id}`, {
    withCredentials: true,
  });
  return res;
};


export const getFaqs = async () => {
  const res = await axios.get(`/questions`, {
    withCredentials: true,
  });
  return res;
};
export const createFaqs = async (data: object) => {
  const res = await axios.post(`/questions`, data, {
    withCredentials: true,
  });
  return res;
};

export const updateFaqs = async (id: number, data: object) => {
  const res = await axios.patch(`/questions/${id}`, data, {
    withCredentials: true,
  });
  return res;
};

export const deleteFaqs = async (id: number) => {
  const res = await axios.delete(`/questions/${id}`, {
    withCredentials: true,
  });
  return res;
};

export const getFaqsByCategory = async (id: number) => {
  const res = await axios.delete(`/questions/${id}`, {
    withCredentials: true,
  });
  return res;
};