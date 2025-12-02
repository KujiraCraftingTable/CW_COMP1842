import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const baseURL = "http://localhost:3000/words/";

const handleError = (fn) => async (...params) => {
    try {
        return await fn(...params);
    } catch (error) {
        const status = error?.response?.status ?? "Error";
        const statusText = error?.response?.statusText ?? "Request failed";
        toast.error(`${status}: ${statusText}`);
        throw error;
    }
};

export const api = {
    getWord: handleError(async id => {
        const res = await axios.get(baseURL + id);
        return res.data;
    }),
    getWords: handleError(async () => {
        const res = await axios.get(baseURL);
        return res.data;
    }),
    deleteWord: handleError(async id => {
        const res = await axios.delete(baseURL + id);
        return res.data;
    }),
    createWord: handleError(async payload => {
        const res = await axios.post(baseURL, payload);
        return res.data;
    }),
    updateWord: handleError(async payload => {
        const res = await axios.put(baseURL + payload._id, payload);
        return res.data;
    })
};