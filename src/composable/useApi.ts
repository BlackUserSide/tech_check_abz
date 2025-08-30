import axios from "axios";
import type {AxiosInstance} from 'axios'
import {usePosition} from "../stores/positions.ts";

let api: AxiosInstance;


export function createApi() {
    api = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers: {
            'Content-Type': 'application/json',
        }
    });
    api.interceptors.request.use(
        (config) => {
            const auth = usePosition()
            const token = auth.token

            if (token) {
                config.headers.Token = `${token}`
            }

            return config
        },
        (error) => Promise.reject(error)
    )
    api.interceptors.response.use(
        (res) => {
            return res;
        },
        async (err) => {
            if (err.response) {
                switch (err.response.status) {
                    case 404:
                        break;
                }
                return Promise.reject(err.response.data);
            }
        }
    );

    return api;
}

export function useApi() {
    if (!api) {
        createApi();
    }
    return api;
}
