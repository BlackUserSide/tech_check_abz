import {defineStore} from "pinia";
import {ref, type Ref} from "vue";
import type {Position, PositionsReq} from "../types/positions.ts";
import {useApi} from "../composable/useApi.ts";
import type {AxiosInstance, AxiosResponse} from "axios";
import {Notyf} from "notyf";

export const usePosition = defineStore('position', () => {
    const positions: Ref<Position[]> = ref([])
    const api: AxiosInstance = useApi()
    const loader: Ref<boolean> = ref(true)
    const timeOut: null | ReturnType<typeof setTimeout> = null
    const token: Ref<null | string> = ref(null)

    const notyf: Notyf = new Notyf()

    async function getAllPositions() {
        if (timeOut) {
            clearTimeout(timeOut)
        }
        try {
            const result: AxiosResponse<PositionsReq> = await api.get("/positions");
            if (result.data && result.data.success) {
                setTimeout(() => {
                    positions.value = result.data.positions;
                    loader.value = false
                }, 1500)
            }
        } catch (e) {
            if (e instanceof Error) {
                notyf.error(e.message)
            } else {
                notyf.error('Unexpected error')
            }
        }
    }

    async function registerToken() {
        try {
            const result = await api.get('/token')
            if (result.data && result.data.success) {
                token.value = result.data.token
            }
        } catch (e) {
            if (e instanceof Error) {
                notyf.error(e.message)
            } else {
                notyf.error('Unexpected error')
            }
        }
    }

    async function registerUser(data: FormData) {
        try {
            const result = await api.post('/users', data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            return !!(result.data && result.data.success);


        } catch (e) {
            if (e instanceof Error) {
                notyf.error(e.message)
            } else {
                notyf.error('Unexpected error')
            }
        }
    }

    return {
        positions,
        getAllPositions,
        loader,
        registerToken,
        token,
        registerUser
    }
})