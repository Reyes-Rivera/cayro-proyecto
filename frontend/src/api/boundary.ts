import axios from "./axios";

export const boundaryApi = async () => {
    const res = await axios.get("/regulatory-document/boundary", {
        withCredentials: true,
    });
    return res;
}
export const boundaryHistoriApi = async () => {
    const res = await axios.get("/regulatory-document/boundary-history", {
        withCredentials: true,
    });
    return res;
}

export const createBoundaryApi = async (data: object) => {
   
    const res = await axios.post("/regulatory-document/boundary", data, {
        withCredentials: true,
    });
    return res;
}

export const updateBoundaryApi = async (data: object,id:any) => {
   
    const res = await axios.put(`/regulatory-document/update-boundary/${id}`, data, {
        withCredentials: true,
    });
    return res;
}

export const deleteBoundaryApi = async (id:any) => {
   
    const res = await axios.delete(`/regulatory-document/remove-boundary/${id}`, {
        withCredentials: true,
    });
    return res;
}

export const activeBoundaryApi = async (id:any) => {
   
    const res = await axios.patch(`/regulatory-document/active-boundary/${id}`,{
        withCredentials: true,
    });
    return res;
}