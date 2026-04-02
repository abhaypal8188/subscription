import api from "./api.js";

export const uploadApi = {
  uploadLogo: async (file, token) => {
    const formData = new FormData();
    formData.append("logo", file);

    const { data } = await api.post("/uploads/logo", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },
};
