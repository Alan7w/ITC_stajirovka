import { computed, h, ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

import api from '@/api.config'
import { useGlobalStore } from '@/stores/global'
import { useI18n } from 'vue-i18n'

import { USER_PERMISSIONS } from '@/constants/enums'

import IconDashboard from '@/components/icons/IconDashboard.vue'
import IconUsers from '@/components/icons/IconUsers.vue'
import IconBriefcase from '@/components/icons/IconBriefcase.vue'
import IconCriteria from '@/components/icons/IconCriteria.vue'
import IconInspector from '@/components/icons/IconInspector.vue'
import IconMessage from '@/components/icons/IconMessage.vue'
import IconReport from '@/components/icons/IconReport.vue'
import IconViolationReports from '@/components/icons/IconViolationReports.vue'
import IconSettings from '@/components/icons/IconSettings.vue'
import IconLogs from '@/components/icons/IconLogs.vue'
import IconMonitoring from '@/components/icons/IconMonitoring.vue'

export interface IUserMe {
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

export interface IUserById {
  begin_date: string
  department_name: string
  full_name: string
  organization_id: string
  organization_name: string
  organization_tin: string
  position_name: string
  rate: string
  roles: { role_id: number; key: string; name: string }[]
  user_id: string
}

interface IMenuItem {
  key: string
  icon: () => void
  label: string
  title: string
  path?: string
  permissions: string[]
}

export const useUserStore = defineStore('user', () => {
  const globalStore = useGlobalStore()
  const router = useRouter()
  const BASE_URL = 'user'
  const userMeLoading = ref(false)
  const user = ref(JSON.parse('{}') as IUserMe)
  const usersList: any = ref([])
  const userInfoById = ref({} as IUserById)
  const userInfo: any = ref({})
  const userRoles: any = ref([])

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
    return menuItems.value.filter((item) => {
      // Items marked as 'all' are visible to everyone
      if (item.permissions.includes('all')) {
        return true
      }

      // Check if user has at least one required permission
      return item.permissions.some((permission) => user.value.permissions?.includes(permission))
    })
  })

  const userMe = async () => {
    userMeLoading.value = true
    try {
      return await api.get(`${BASE_URL}/me/`).then((res) => {
        user.value = res.data
        localStorage.setItem('user', JSON.stringify(res.data))
      })
    } catch (err) {
      globalStore.notify({ msg: err })
    } finally {
      userMeLoading.value = false
    }
  }

  const logout = async () => {
    try {
      return await api
        .post(`${BASE_URL}/log-out/`, { organ_id: user.value.organization_id })
        .then(() => {
          router.replace({ name: 'auth' })
          localStorage.removeItem('user')
          localStorage.removeItem('token')
        })
    } catch (err) {
      globalStore.notify({ msg: err })
      throw err
    }
  }

  const deleteUser = async (userId) => {
    try {
      return await api.delete(`${BASE_URL}/${userId}/`)
    } catch (err) {
      globalStore.notify({ msg: err })
      throw err
    }
  }

  const getUsers = async (params = {}) => {
    return await api
      .get(`${BASE_URL}/`, { params })
      .then((res) => {
        usersList.value = res.data
      })
      .catch((err) => globalStore.notify({ msg: err }))
  }

  const exportUsers = async (params = {}) => {
    return await api
      .get(`${BASE_URL}/export/`, { params, responseType: 'blob' })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `users-export.xlsx`)
        document.body.appendChild(link)
        link.click()
        link.remove()
      })
      .catch((err) => globalStore.notify({ msg: err }))
  }

  const createUser = async (data, cb = () => { }) => {
    try {
      return await api.post(`${BASE_URL}/create/`, data).then((res) => {
        cb()
        return res.data
      })
    } catch (err) {
      globalStore.notify({ msg: err })
      throw err
    }
  }

  const getUserInfoByPinfl = async (params) => {
    return await api
      .get(`${BASE_URL}/pinfl/`, { params })
      .then((res) => {
        userInfo.value = {
          fio: res.data.full_name,
          orgName: res.data.organization_name,
          position: res.data.position,
          employmentRate: res.data.rate,
          employmentTime: res.data.begin_date,
        }
      })
      .catch((err) => globalStore.notify({ msg: err }))
  }

  const getUserInfoById = async (id) => {
    return await api
      .get(`${BASE_URL}/${id}/`)
      .then((res) => {
        userInfoById.value = res.data
      })
      .catch((err) => globalStore.notify({ msg: err }))
  }

  const getUserRoles = () => {
    return api
      .get(`role/list/?all=true`)
      .then((res) => {
        userRoles.value = res.data
      })
      .catch((err) => globalStore.notify({ msg: err }))
  }

  const changeUserRole = (data) => {
    return api.post(`${BASE_URL}/me/set-current-role/`, data).catch((err) => {
      globalStore.notify({ msg: err })
      throw err
    })
  }

  const updateUserMe = async (data: {
    first_name?: string
    last_name?: string
    middle_name?: string
    user_image?: File | null
    phone_number?: string
    email?: string
    address?: string
  }) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value as string | Blob)
      }
    })
    return api.patch(`${BASE_URL}/me/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((res) => {
      user.value = { ...user.value, ...res.data }
      localStorage.setItem('user', JSON.stringify(user.value))
    }).catch((err) => {
      globalStore.notify({ msg: err })
      throw err
    })
  }

  return {
    // actions
    userMe,
    updateUserMe,
    getUserInfoById,
    logout,
    deleteUser,
    getUsers,
    exportUsers,
    createUser,
    getUserInfoByPinfl,
    getUserRoles,
    changeUserRole,

    // states
    user,
    userInfoById,
    usersList,
    userInfo,
    userRoles,
    userMeLoading,
    filteredMenuItems,
  }
})
