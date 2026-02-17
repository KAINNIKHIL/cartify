import api from "./axios.js";

export const fetchProducts = async() =>{
    const res = await api.get("http://localhost:5000/api/products");
    return res.data;
}