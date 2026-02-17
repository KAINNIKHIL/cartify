import api from "./axios";

export const loginUser = (data)=>
    api.post("/api/login", data).then(res => res.data);

export const registerUser = (data) => {
  return api.post("/auth/register", data);
};