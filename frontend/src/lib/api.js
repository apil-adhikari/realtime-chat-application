import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  // console.log(signupData);
  const response = await axiosInstance.post("/auth/signup", signupData);
  // console.log("RESPONSE");
  // console.log(response.data);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  // console.log(response.data);
  return response.data;
};

// LOGOUT API CALL
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  } catch (error) {
    if (error) return null;
  }
};

export const completeOnboarding = async (userData) => {
  // console.log(userData);
  const response = await axiosInstance.post("/auth/onboarding", userData);
  // console.log(response.data);
  return response.data;
};
