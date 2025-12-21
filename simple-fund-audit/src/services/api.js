import axios from "axios";

const API = axios.create({
    baseURL: 'http://localhost:9090/api',
    headers: {
        'Content-Type': 'application/json', 
        'Accept': 'application/json'
    }
});

export const transfer = (data) => API.post("/transfer", data);

export const getTransactions = (userId, order) => API.get(`/transactions/${userId}?order=${order}`);

export const getBalance = (userId) => API.get(`/balance/${userId}`);
