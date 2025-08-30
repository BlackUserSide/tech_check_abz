import {useApi} from "../composable/useApi";
import type {AxiosError} from 'axios'
const api = useApi();

export default {
    async get(endpoint: string): Promise<any> {
        try {
            return await api.get(endpoint)
        } catch (error) {
            throw (error as AxiosError).response?.data ?? new Error('API Error')
        }
    },

    async post(endpoint: string, payload: any): Promise<any> {
        try {
            return await api.post(endpoint, payload)
        } catch (error) {
            throw (error as AxiosError).response?.data ?? new Error('API Error')
        }
    }
}
