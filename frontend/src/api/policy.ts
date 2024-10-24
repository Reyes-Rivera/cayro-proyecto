import axios from "./axios";

export const policiesApi = async () => {
    const res = await axios.get("/regulatory-document/policy", {
        withCredentials: true,
    });
    return res;
}
export const policiesHistoriApi = async () => {
    const res = await axios.get("/regulatory-document/policy-history", {
        withCredentials: true,
    });
    return res;
}

export const createPolicysApi = async (data: object) => {
    
    const res = await axios.post("/regulatory-document/policy", data, {
        withCredentials: true,
        
    });
    return res;
}

export const updatePolicysApi = async (data: object,id:any) => {
    
    const res = await axios.put(`/regulatory-document/update-policy/${id}`, data, {
        withCredentials: true,
        
    });
    return res;
}

export const deletePolicysApi = async (id:any) => {
    
    const res = await axios.delete(`/regulatory-document/remove-policy/${id}`, {
        withCredentials: true,
        
    });
    return res;
}

export const activePolicyApi = async (id:any) => {
    
    const res = await axios.patch(`/regulatory-document/active-policy/${id}`, {
        withCredentials: true,
        
    });
    return res;
}