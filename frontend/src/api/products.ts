import { CreateProductDto } from "@/pages/private/dashboard-employee/profucts/data/sampleData";
import axios from "./axios";
// Categories
export const addCategory = (data: { name: string }) =>
  axios.post("/category", data);

export const updateCategory = (id: number, data: { name: string }) =>
  axios.patch(`/category/${id}`, data);

export const deleteCategory = (id: number) => axios.delete(`/category/${id}`);

export const getCategories = () => axios.get("/category");

// sizes

export const addSize = (data: { name: string }) => axios.post("/size", data);

export const updateSize = (id: number, data: { name: string }) =>
  axios.patch(`/size/${id}`, data);

export const deleteSize = (id: number) => axios.delete(`/size/${id}`);

export const getSizes = () => axios.get("/size");

// sleeves

export const addSleeve = (data: { name: string }) =>
  axios.post("/sleeve", data);

export const updateSleeve = (id: number, data: { name: string }) =>
  axios.patch(`/sleeve/${id}`, data);

export const deleteSleeve = (id: number) => axios.delete(`/sleeve/${id}`);

export const getSleeve = () => axios.get("/sleeve");

// Gender

export const addGender = (data: { name: string }) =>
  axios.post("/gender", data);

export const updateGender = (id: number, data: { name: string }) =>
  axios.patch(`/gender/${id}`, data);

export const deleteGender = (id: number) => axios.delete(`/gender/${id}`);

export const getGenders = () => axios.get("/gender");

// Brand

export const addBrand = (data: { name: string }) => axios.post("/brand", data);

export const updateBrand = (id: number, data: { name: string }) =>
  axios.patch(`/brand/${id}`, data);

export const deleteBrand = (id: number) => axios.delete(`/brand/${id}`);

export const getBrands = () => axios.get("/brand");

// color

export const addColor = (data: { name: string; hexValue: string }) =>
  axios.post("/colors", data);

export const updateColor = (
  id: number,
  data: { name: string; hexValue: string }
) => axios.patch(`/colors/${id}`, data);

export const deleteColor = (id: number) => axios.delete(`/colors/${id}`);

export const getColors = () => axios.get("/colors");

// product

export const getProducts = (params: string) => axios.get(`/product?${params}`);

export const createProduct = (data: CreateProductDto) =>
  axios.post("/product", data);

export const updateProduct = (data: CreateProductDto, id: number) =>
  axios.patch(`/product/${id}`, data);

export const deactivateProduct = (id: number) => axios.delete(`/product/${id}`);
export const activateProduct = (id: number) =>
  axios.patch(`/product/active/${id}`);

export const getProductByName = (name: string) =>
  axios.get(`/product/get-by-name/${name}`);

export const getProductById = (id: number) => axios.get(`/product/${id}`);

export const deleteImg = (url: string) =>
  axios.delete(`/cloudinary?url=${url}`);
export const recomendation = (data:any) =>
  axios.post(`/recommendation`,data);

export const recomendationCart = (data:any) =>
  axios.post(`/recommendation/carrito`,data);
export const updatePricesBulk = async (filters: any, updateData: any) => {
  try {
    const response = await axios.put("/product/bulk-price-update", {
      filters,
      updateData,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating prices in bulk:", error);
    throw error;
  }
};
