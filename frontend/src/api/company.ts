import axios from "./axios";

export const getCsrfToken = async () => {
    const response = await axios.get('/auth/csrf-token', {
       withCredentials: true,
    });
    return response.data.csrfToken;
 };

export const getCompanyInfoApi = async () => {
    const res = await axios.get(`/company-profile`, {
        withCredentials: true
    });
    return res;
};

export const getCompanyConfig = async () => {
    const res = await axios.get(`/configuration`, {
        withCredentials: true
    });
    return res;
};
export const updateCompanyConfig = async (data:any,id:any) => {
   const csrfToken = await getCsrfToken();
    const res = await axios.patch(`/configuration/${id}`, data,{
        withCredentials: true,
        headers: {
            'CSRF-Token': csrfToken,
         }
    });
    return res;
};

export const companyInfoUpdateApi = async (data:object,id:any,adminId:any) => {
   const csrfToken = await getCsrfToken();
    const res = await axios.patch(`/company-profile/${id}/${adminId}`,data, {
        withCredentials: true,
        headers: {
            'CSRF-Token': csrfToken,
         }
    });
    return res;
};

