import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/api.config"
import { useGlobalStore } from "./global";
import router from "@/router";

// import { USER_PERMISSIONS } from '@/constants/enums'

interface IUserMe {
    user_id: string
    first_name: string
    last_name: string
    middle_name: string
    full_name: string
    user_image: string
    phone_number: string | number | null
    email: string | null
    address: string | null
    organization_id: string
    organ_name: string
    current_role: {
        role_id: number
        key: string
        name: string
    }
    roles: {
        role_id: number
        key: string
        name: string
    }[]
    permissions: string[]
}

export const useUserStore = defineStore('user', () => {
    const user = ref({} as IUserMe)
    const userMeLoading = ref(false)
    const globalStore = useGlobalStore()

    const userMe = async () => {
        userMeLoading.value = true
        try {
            return await api.get('user/me/').then((res) => {
                user.value = res.data
                localStorage.setItem('user', JSON.stringify(res.data))
            })
        } catch (error) {
            globalStore.notify({ msg: error })
        } finally {
            userMeLoading.value = false
        }
    }

    const logout = async () => {
        try {
            return await api
                .post('user/log-out/', { organ_id: user.value.organization_id })
                .then(() => {
                    localStorage.removeItem('user')
                    localStorage.removeItem('token')
                    router.replace({ name: 'auth' })
                })
        } catch (error) {
            globalStore.notify({ msg: error })
            throw error
        }
    }

    return { userMe, logout }
})