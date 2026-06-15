import { defineStore } from "pinia";
import api from "@/api.config";
import { useGlobalStore } from "./global";
import { useUserStore } from "./user";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore('auth', () => {
    const globalStore = useGlobalStore()
    const userStore = useUserStore()
    const router = useRouter()

    const loginByBasicAuth = async (username, password) => {
        try {
            const res = await api.post('basic-auth/', { username, password })
            localStorage.setItem('token', res.data.token)
            await userStore.userMe()

            const firstMenuItem = userStore.filteredMenuItems.find(item => item.path)
            if (firstMenuItem?.path) {
                return await router.replace(firstMenuItem.path)
            } else {
                return await router.replace({ name: 'dashboard' })
            }
        } catch (error) {
            globalStore.notify({ msg: error })
            throw error
        }
    }

    const loginByImvID = async (code, codeVerifier) => {
        const data = {
            code: code,
            code_verify: codeVerifier,
            redirect_uri: import.meta.env.VITE_AUTH_REDIRECT_URI
        }

        try {
            const res = await api.post('one-id/', data)
            localStorage.setItem('token', res.data.token)
            await userStore.userMe()

            const firstMenuItem = userStore.filteredMenuItems.find(item => item.path)

            if (firstMenuItem?.path) {
                return await router.replace(firstMenuItem.path)
            } else {
                return await router.replace({ name: 'dashboard' })
            }
        } catch (error) {
            globalStore.notify({ msg: error })
            throw error
        }
    }

    return { loginByBasicAuth, loginByImvID }
})