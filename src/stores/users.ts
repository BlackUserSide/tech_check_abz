import {defineStore} from "pinia";
import {useApi} from "../composable/useApi.ts";
import {type Ref, ref} from "vue";
import type {AxiosInstance, AxiosResponse} from "axios";
import type {User, UserReq} from "../types/users.ts";
import {Notyf} from "notyf";

export const useUsers = defineStore('users', () => {
    const api: AxiosInstance = useApi()
    const users: Ref<User[]> = ref([])
    const countPage: Ref<number> = ref(0)
    const currentPage: Ref<number> = ref(1)
    const loader: Ref<boolean> = ref(true)
    let timeOut: null | ReturnType<typeof setTimeout> = null
    const localeLoader: Ref<boolean> = ref(false)
    const notyf: Notyf = new Notyf()

    async function getAllUsers() {
        try {
            if (timeOut) {
                clearTimeout(timeOut)
            }
            const result = await getUsers()
            if (result) {
                users.value = result.data.users
                countPage.value = result.data.total_pages
                timeOut = setTimeout(() => {
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

    async function getUsers(): Promise<AxiosResponse<UserReq>> {
        return await api.get('/users',
            {params: {page: currentPage.value, count: 6}})
    }

    async function nextPage() {
        if (timeOut) {
            clearTimeout(timeOut)
        }
        currentPage.value += 1;
        localeLoader.value = true;
        try {
            const result = await getUsers()
            if (result) {
                setTimeout(() => {
                    localeLoader.value = false;
                    users.value = users.value.concat(result.data.users)
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

    return {
        getAllUsers,
        users,
        loader,
        currentPage,
        countPage,
        nextPage,
        localeLoader,

    }
})