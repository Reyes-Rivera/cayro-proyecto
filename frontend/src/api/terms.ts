import { getCsrfToken } from "./auth";
import axios from "./axios";

export const termsApi = async () => {
    const res = await axios.get("/regulatory-document/terms", {
        withCredentials: true,
    });
    return res;
}
export const termsHistoriApi = async () => {
    const res = await axios.get("/regulatory-document/terms-history", {
        withCredentials: true,
    });
    return res;
}

export const createTermsApi = async (data: object) => {
    const csrfToken = await getCsrfToken();
    const res = await axios.post("/regulatory-document/terms", data, {
        withCredentials: true,
        headers: {
            'CSRF-Token': csrfToken,
        }
    });
    return res;
}

export const updateTermsApi = async (data: object,id:any) => {
    const csrfToken = await getCsrfToken();
    const res = await axios.put(`/regulatory-document/update-terms/${id}`, data, {
        withCredentials: true,
        headers: {
            'CSRF-Token': csrfToken,
        }
    });
    return res;
}

export const deleteTermsApi = async (id:any) => {
    const csrfToken = await getCsrfToken();
    const res = await axios.delete(`/regulatory-document/remove-terms/${id}`, {
        withCredentials: true,
        headers: {
            'CSRF-Token': csrfToken,
        }
    });
    return res;
}

export const activeTermsApi = async (id:any) => {
    const csrfToken = await getCsrfToken();
    const res = await axios.patch(`/regulatory-document/active-terms/${id}`,{_csrf: csrfToken }, {
        withCredentials: true,
        headers: {
            'CSRF-Token': csrfToken,
        }
    });
    return res;
}