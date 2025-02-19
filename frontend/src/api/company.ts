import axios from "./axios";

export const getCompanyInfoApi = async () => {
  const res = await axios.get(`/company-profile`, {
    withCredentials: true,
  });
  return res;
};

export const getAuditsApi = async () => {
  const res = await axios.get(
    `/company-profile/audit-log/6716a25e3d494e62ce117768`,
    {
      withCredentials: true,
    }
  );
  return res;
};

export const getBlockedUsers = async (data: object) => {
  const res = await axios.get(`/user-activity/blocked?period=${data}`, {
    withCredentials: true,
  });
  return res;
};

export const blockedUsersApi = async (data: object) => {
  const res = await axios.post(`/users/lock`, data, {
    withCredentials: true,
  });
  return res;
};

export const getCompanyConfig = async () => {
  const res = await axios.get(`/configuration`, {
    withCredentials: true,
  });
  return res;
};
export const updateCompanyConfig = async (data: object, id: number) => {
  const res = await axios.patch(`/configuration/${id}`, data, {
    withCredentials: true,
  });
  return res;
};

export const companyInfoUpdateApi = async (
  data: object,
  id: number,
  adminId: number
) => {
  const res = await axios.patch(`/company-profile/${id}/${adminId}`, data, {
    withCredentials: true,
  });
  return res;
};
