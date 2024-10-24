import axios from "./axios";

export const getCompanyInfoApi = async () => {
    const res = await axios.get(`/company-profile`, {
        withCredentials: true
    });
    return res;
};

export const getBlockedUsers = async (data:any) => {
    const res = await axios.get(`/user-activity/blocked?period=${data}`, {
        withCredentials: true
    });
    return res;
};

export const blockedUsersApi = async (data:any) => {
    const res = await axios.post(`/users/lock`,data, {
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
   
    const res = await axios.patch(`/configuration/${id}`, data,{
        withCredentials: true,
       
    });
    return res;
};

export const companyInfoUpdateApi = async (data:object,id:any,adminId:any) => {
   
    const res = await axios.patch(`/company-profile/${id}/${adminId}`,data, {
        withCredentials: true,
       
    });
    return res;
};

