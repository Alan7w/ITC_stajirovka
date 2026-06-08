import { defineStore } from "pinia";
import api from "@/api.config";
import { useGlobalStore } from "./global";
import { useUserStore } from "./user";

export const useAuthStore = defineStore('auth', () => {
    const globalStore = useGlobalStore()
    const userStore = useUserStore()

    const loginByBasicAuth = async (username, password) => {
        try {
            const res = await api.post('basic-auth/', { username, password })
            localStorage.setItem('token', res.data.token)
            await userStore.userMe()
        } catch (error) {
            globalStore.notify({ msg: error })
            throw error
        }
    }

    const loginByImvID = async (code, codeVerifier) => {
        const data = {
            code: code,
            codeVerifier: codeVerifier,
            redirectURL: import.meta.env.VITE_AUTH_REDIRECT_URI
        }

        try {
            const res = await api.post('one-id/', data)
            localStorage.setItem('token', res.data.token)
            await userStore.userMe()
        } catch (error) {
            globalStore.notify({ msg: error })
            throw error
        }
    }

    return { loginByBasicAuth, loginByImvID }
})