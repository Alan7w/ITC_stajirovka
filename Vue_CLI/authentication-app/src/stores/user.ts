import { defineStore } from "pinia";
import { ref, h, computed } from "vue";
import { useRouter } from "vue-router";
import api from "@/api.config"
import { useGlobalStore } from "./global";

import { USER_PERMISSIONS } from '@/constants/enums'

import IconDashboard from '@/components/icons/IconDashboard.vue'
import IconUsers from '@/components/icons/IconUsers.vue'
import IconBriefcase from '@/components/icons/IconBriefcase.vue'
import IconCriteria from '@/components/icons/IconCriteria.vue'
import IconInspector from '@/components/icons/IconInspector.vue'
import IconMessage from '@/components/icons/IconMessage.vue'
import IconReport from '@/components/icons/IconReport.vue'
import IconViolationReports from '@/components/icons/IconViolationReports.vue'
// import IconSettings from '@/components/icons/IconSettings.vue'
import IconLogs from '@/components/icons/IconLogs.vue'
import IconMonitoring from '@/components/icons/IconMonitoring.vue'

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

interface IMenuItem {
    key: string,
    icon: () => void,
    label: string,
    title: string,
    path?: string,
    permissions: string[]
}

export const useUserStore = defineStore('user', () => {
    const user = ref({} as IUserMe)
    const userMeLoading = ref(false)
    const globalStore = useGlobalStore()
    const router = useRouter()

    const menuItems = ref<IMenuItem[]>([
        {
            key: 'dashboard',
            icon: () => h(IconDashboard),
            label: 'dashboard',
            title: 'dashboard',
            path: '/dashboard',
            permissions: [USER_PERMISSIONS.VIEW_DASHBOARD],
        },
        {
            key: 'monitoring',
            icon: () => h(IconMonitoring),
            label: 'monitoring',
            title: 'monitoring',
            path: '/monitoring',
            permissions: [USER_PERMISSIONS.VIEW_SYSTEM_MONITORING],
        },
        {
            key: 'manageUsers',
            icon: () => h(IconUsers),
            label: 'manageUsers',
            title: 'manageUsers',
            path: '/manage-users',
            permissions: [USER_PERMISSIONS.VIEW_USER_CONTROL],
        },
        {
            key: 'entrepreneurs',
            icon: () => h(IconBriefcase),
            label: 'entrepreneursList',
            title: 'entrepreneursList',
            path: '/entrepreneurs',
            permissions: [USER_PERMISSIONS.VIEW_REGISTRY],
        },
        {
            key: 'criteria',
            icon: () => h(IconCriteria),
            label: 'criteria',
            title: 'criteria',
            path: '/criteria',
            permissions: [USER_PERMISSIONS.VIEW_CRITERIA],
        },
        {
            key: 'inspectors',
            icon: () => h(IconInspector),
            label: 'inspectors',
            title: 'inspectors',
            path: '/inspectors',
            permissions: [USER_PERMISSIONS.VIEW_INSPECTORS],
        },
        {
            key: 'message',
            icon: () => h(IconMessage),
            label: 'message',
            title: 'message',
            path: '/message',
            permissions: [USER_PERMISSIONS.VIEW_NOTIFICATION],
        },
        {
            key: 'violationReports',
            icon: () => h(IconViolationReports),
            label: 'violationReports',
            title: 'violationReports',
            path: '/violation-reports',
            permissions: [USER_PERMISSIONS.VIEW_USER_CONTROL],
        },
        {
            key: 'reports',
            icon: () => h(IconReport),
            label: 'reports',
            title: 'reports',
            path: '/reports',
            permissions: [USER_PERMISSIONS.VIEW_REPORTS],
        },
        {
            key: 'logs',
            icon: () => h(IconLogs),
            label: 'logs',
            title: 'logs',
            path: '/logs',
            permissions: [USER_PERMISSIONS.VIEW_LOGS],
        },
        // {
        //   key: 'settings',
        //   icon: () => h(IconSettings),
        //   label: 'settings',
        //   title: 'settings',
        //   permissions: ['all'],
        // },
    ])

    const filteredMenuItems = computed(() => {
        return menuItems.value.filter(item => {
            if (item.permissions.includes('all')) return true
            return item.permissions.some(permission => user.value.permissions?.includes(permission))
        })
    })

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

    return { userMe, logout, filteredMenuItems, user }
})