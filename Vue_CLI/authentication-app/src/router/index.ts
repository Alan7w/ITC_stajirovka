import { createRouter, createWebHistory, type RouteRecord, type RouteRecordRaw } from 'vue-router'
import NotFoundView from '@/views/NotFound.vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { USER_PERMISSIONS } from '@/constants/enums'

declare module 'vue-router' {
  interface RouteMeta {
    permissions?: string[]
    activeMenu?: string
  }
}

const authLayout = () => import('@/layouts/Auth.vue')
const AdminLayout = () => import('@/layouts/Admin.vue')

const DashboardView = () => import('@/views/Dashboard.vue')

const CriteriaView = () => import('@/views/Criteria/Index.vue')
const CreateCriterionView = () => import('@/views/Criteria/Create.vue')
const DetailsCriterionView = () => import('@/views/Criteria/Details.vue')
const EditCriterionView = () => import('@/views/Criteria/Edit.vue')

const EntrepreneursView = () => import('@/views/Entrepreneurs/Index.vue')
const DetailsEntrepreneursView = () => import('@/views/Entrepreneurs/Details.vue')
const RatingEntrepreneursView = () => import('@/views/Entrepreneurs/Rating.vue')
const CompanyHighRiskView = () => import('@/views/Entrepreneurs/HighRisk.vue')

const ManageUsersView = () => import('@/views/ManageUsers/IndexView.vue')
const MonitoringView = () => import('@/views/Monitoring/MonitoringView.vue')
const InspectorsView = () => import('@/views/Inspectors/IndexView.vue')
const InspectionResult = () => import('@/views/Inspectors/InspectionResult.vue')
const MessageView = () => import('@/views/Message/IndexView.vue')
const ViolationReportsView = () => import('@/views/ViolationReports/IndexView.vue')
const ReportsView = () => import('@/views/Reports/IndexVIew.vue')
const ProfileView = () => import('@/views/Profile/Index.vue')
const LogsView = () => import('@/views/MonitoringLogs/IndexView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'admin',
      redirect: '/auth',
      component: AdminLayout,
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: DashboardView,
          meta: { activeMenu: 'dashboard', permissions: [USER_PERMISSIONS.ALL] },
        },
        {
          path: '/monitoring',
          name: 'monitoring',
          component: MonitoringView,
          meta: { activeMenu: 'monitoring', permissions: [USER_PERMISSIONS.ALL] },
        },
        {
          path: '/criteria',
          name: 'criteria',
          component: CriteriaView,
          meta: { activeMenu: 'criteria', permissions: [USER_PERMISSIONS.VIEW_CRITERIA] },
        },
        {
          path: '/criteria/create',
          name: 'createCriterion',
          component: CreateCriterionView,
          meta: { activeMenu: 'criteria', permissions: [USER_PERMISSIONS.VIEW_CRITERIA] },
        },
        {
          path: '/criteria/details/:id',
          name: 'detailsCriterion',
          component: DetailsCriterionView,
          meta: { activeMenu: 'criteria', permissions: [USER_PERMISSIONS.VIEW_CRITERIA] },
        },
        {
          path: '/criteria/edit/:id',
          name: 'editCriterion',
          component: EditCriterionView,
          meta: { activeMenu: 'criteria', permissions: [USER_PERMISSIONS.VIEW_CRITERIA] },
        },
        {
          path: '/entrepreneurs',
          name: 'entrepreneurs',
          component: EntrepreneursView,
          meta: { activeMenu: 'entrepreneurs', permissions: [USER_PERMISSIONS.VIEW_REGISTRY] },
        },
        {
          path: '/entrepreneurs/details/:id',
          name: 'detailsEntrepreneurs',
          component: DetailsEntrepreneursView,
          meta: { activeMenu: 'entrepreneurs', permissions: [USER_PERMISSIONS.VIEW_REGISTRY] },
        },
        {
          path: '/entrepreneurs/high-risk/:id',
          name: 'companyHighRisk',
          component: CompanyHighRiskView,
          meta: { activeMenu: 'entrepreneurs', permissions: [USER_PERMISSIONS.VIEW_REGISTRY] },
        },
        {
          path: '/entrepreneurs/rating/:id',
          name: 'ratingEntrepreneurs',
          component: RatingEntrepreneursView,
          meta: { activeMenu: 'entrepreneurs', permissions: [USER_PERMISSIONS.VIEW_REGISTRY] },
        },
        {
          path: '/manage-users',
          name: 'manageUsers',
          component: ManageUsersView,
          meta: { activeMenu: 'manageUsers', permissions: [USER_PERMISSIONS.VIEW_USER_CONTROL] },
        },
        {
          path: '/inspectors',
          name: 'inspectors',
          component: InspectorsView,
          meta: { activeMenu: 'inspectors', permissions: [USER_PERMISSIONS.VIEW_INSPECTORS] },
        },
        {
          path: '/inspectors/result/:id',
          name: 'inspectionResult',
          component: InspectionResult,
          meta: { activeMenu: 'inspectors', permissions: [USER_PERMISSIONS.VIEW_INSPECTORS] },
        },
        {
          path: '/message',
          name: 'message',
          component: MessageView,
          meta: { activeMenu: 'message', permissions: [USER_PERMISSIONS.VIEW_NOTIFICATION] },
        },
        {
          path: '/violation-reports',
          name: 'violationReports',
          component: ViolationReportsView,
          meta: {
            activeMenu: 'violationReports',
            permissions: [USER_PERMISSIONS.VIEW_USER_CONTROL],
          },
        },
        {
          path: '/reports',
          name: 'reports',
          component: ReportsView,
          meta: { activeMenu: 'reports', permissions: [USER_PERMISSIONS.VIEW_REPORTS] },
        },
        {
          path: '/logs',
          name: 'logs',
          component: LogsView,
          meta: { activeMenu: 'logs', permissions: [USER_PERMISSIONS.VIEW_LOGS] },
        },
        {
          path: '/profile',
          name: 'profile',
          component: ProfileView,
          meta: { activeMenu: 'profile', permissions: [USER_PERMISSIONS.ALL] },
        },
      ],
    },
    {
      path: '/auth',
      name: 'auth',
      component: authLayout
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView
    }
  ] as RouteRecordRaw[],
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)
  if (!user.value.permissions && to.name !== 'auth') {
    await userStore.userMe()
  }
  if (to.meta.permissions) {
    console.log(to.meta.permissions)

    if (to.meta.permissions.includes(USER_PERMISSIONS.ALL)) {
      return next()
    }

    if (!to.meta.permissions.some((perm) => user.value?.permissions?.includes(perm))) {
      console.log('threw from pageName => ', to.name)
      return next({ name: 'not-found' })
    }
  }

  next()
})

export default router
