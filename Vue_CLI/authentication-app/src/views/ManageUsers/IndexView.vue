<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormInstance } from 'ant-design-vue'

import DocHead from '@/components/DocHead.vue'
import DatePicker from '@/components/DatePicker.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import IconArrow from '@/components/icons/IconArrow.vue'
import IconSearch from '@/components/icons/IconSearch.vue'
import IconExport from '@/components/icons/IconExport.vue'
import IconActions from '@/components/icons/IconActions.vue'
import IconTrash from '@/components/icons/IconTrash.vue'
import IconUsers from '@/components/icons/IconUsers.vue'
import BaseTable from '@/components/BaseTable.vue'
import { useUserStore } from '@/stores/user'
import Loader from '@/components/Loader.vue'
import RolePermissions from '@/components/ManageUsers/RolePermissions.vue'
import CreateRole from '@/components/ManageUsers/CreateRole.vue'
import EditUserRole from '@/components/ManageUsers/EditUserRole.vue'
import { useRoute, useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global'

interface Filter {
  search: string
  date: string[]
  field: string
  order: string
  page: number
  size: number
  total: number
}

const { t } = useI18n()
const userStore = useUserStore()
const selectedUserId = ref<number | null>(null)
const isMoreInfo = ref<boolean>(false)
const dateHelper = ref()
const router = useRouter()
const route = useRoute()
const globalStore = useGlobalStore()

onMounted(() => {
  // filter.value.date = getDateRange(dateHelper.value)
  getTableData(filter.value)
})

const activeTabKey = ref(route.query.tab || 'users')

const filter = ref<Filter>({
  search: '',
  date: ['', ''],
  field: '',
  order: '',
  page: 1,
  size: 10,
  total: 0,
})

const dateHelpers = ref([
  {
    name: t('last7Days'),
    value: 7,
  },
  {
    name: t('last14Days'),
    value: 14,
  },
])

const getDateRange = (daysAgo) => {
  const formatDate = (date) => {
    const dd = String(date.getDate()).padStart(2, '0')
    const mm = String(date.getMonth() + 1).padStart(2, '0') // months are 0-based
    const yyyy = date.getFullYear()
    return `${dd}.${mm}.${yyyy}`
  }

  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - daysAgo)

  return [formatDate(startDate), formatDate(endDate)]
}

const dateHelperChange = (value) => {
  if (value) {
    filter.value.date = getDateRange(value)
  } else {
    filter.value.date = ['', '']
  }
}

const tableColumns = [
  {
    title: t('fio'),
    dataIndex: 'full_name',
    sorter: true,
  },
  {
    title: t('orgName'),
    dataIndex: 'organization_name',
    sorter: true,
  },
  {
    title: t('userDepartment'),
    dataIndex: 'department_name',
    sorter: true,
  },
  {
    title: t('userPosition'),
    dataIndex: 'position_name',
    sorter: true,
  },
  {
    title: t('employmentRate'),
    dataIndex: 'rate',
    sorter: true,
    width: 80,
  },
  {
    title: t('userRoles'),
    dataIndex: 'role',
    sorter: true,
  },
  {
    title: t('employmentTime'),
    dataIndex: 'begin_date',
    sorter: true,
  },
  {
    title: '',
    dataIndex: 'actions',
    width: 80,
  },
]

const tablePagination = ref({
  current: filter.value.page,
  pageSize: filter.value.size,
  total: filter.value.total,
})

const tableLoading = ref(true)

const tableChangeHandler = (pagination, _, sorter) => {
  filter.value.field = sorter.field
  filter.value.order = sorter.order
  filter.value.page = pagination.current
  filter.value.size = pagination.pageSize

  tablePagination.value.current = pagination.current
  tablePagination.value.pageSize = pagination.pageSize
}

const getTableData = async (filterData) => {
  const tableFilter = {
    search: filterData.search,
    start_date: filterData.date[0],
    end_date: filterData.date[1],
    page: filterData.page,
    size: filterData.size,
    field: filterData.field,
    order: filterData.order,
  }

  tableLoading.value = true
  await userStore.getUsers(tableFilter)
  tablePagination.value.total = userStore.usersList?.count
  tableLoading.value = false
}

const handleSeeMoreMenu = (id, isOpen) => {
  selectedUserId.value = id
  isMoreInfo.value = isOpen
}

const addEmployeeDrawerOpen = async () => { }

watch(
  filter,
  async (newVal) => {
    getTableData(newVal)
  },
  { deep: true },
)

watch(
  selectedUserId,
  async () => {
    if (selectedUserId.value) {
      userInfoLoading.value = true
      await userStore.getUserInfoById(selectedUserId.value)
      userInfoLoading.value = false
    }
  },
  {
    deep: true,
  },
)

// const archiveHandler = async (id) => {
//   tableLoading.value = true
//   await criteriaStore.archiveCriterion({ pk: id })
//   await criteriaStore.getCriteriaList(filter.value)
//   tableLoading.value = false
// }

const customRow = () => {
  return {
    onDblclick: () => {
      console.log('dblClick')
    },
  }
}

const addUserDrawer = ref<boolean>(false)

const closeAddUserDrawer = () => {
  userStore.userInfo = {}
  addUserDrawer.value = false
  userStore.userRoles = []
  addUserForm.userPinfl = ''
}

interface AddUserForm {
  userPinfl: string
}

const addUserForm = reactive<AddUserForm>({
  userPinfl: '',
})

const userInfoLoading = ref(false)

const addUserDrawerOpen = async () => {
  // if (visible && userStore.userRoles.length === 0) {
  //   userInfoLoading.value = true
  //   await userStore.getUserRoles()
  //   userInfoLoading.value = false
  // }
}

const addUserFormRef = ref<FormInstance | null>(null)

const addUserHandler = async () => {
  const values: any = await addUserFormRef.value?.validateFields()
  const roles: any = []
  if (values) {
    for (const element in values) {
      if (values[element] && typeof values[element] === 'boolean') {
        roles.push(element)
      }
    }
  }

  const userData = {
    pinfl: values.userPinfl,
    roles,
  }

  try {
    userInfoLoading.value = true
    if (roles.length === 0) {
      return globalStore.notify({ msg: t('plsSetRole'), type: 'error' })
    }
    await userStore.createUser(userData, closeAddUserDrawer)
    await getTableData(filter.value)
  } catch (error) {
    console.log('error', error)
  } finally {
    userInfoLoading.value = false
  }
}

const getUserInfoByPinfl = async () => {
  userInfoLoading.value = true
  await userStore.getUserInfoByPinfl({ pinfl: addUserForm.userPinfl })
  await userStore.getUserRoles()
  userInfoLoading.value = false
}

const deleteUserHandler = async (userId) => {
  try {
    tableLoading.value = true
    await userStore.deleteUser(userId)
    await getTableData(filter.value)
  } catch (error) {
    console.log('error' + error)
  } finally {
    tableLoading.value = false
  }
}

const exportHandler = async () => {
  const exportFilter = {
    search: filter.value.search,
    start_date: filter.value.date[0],
    end_date: filter.value.date[1],
  }
  await userStore.exportUsers(exportFilter)
}

const onTabChangeHandler = (key) => {
  router.push({ query: { tab: key } })
}

const addRoleDrawer = ref(false)
</script>

<template>
  <DocHead>
    <template #left>
      <a-breadcrumb class="breadcrumb">
        <template #separator>
          <IconArrow class="arrow" />
        </template>
        <a-breadcrumb-item>
          <IconUsers />&nbsp;{{ t('manageUsers') }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </template>
    <template #right>
      <a-button v-if="activeTabKey === 'users'" class="linear-gradient-1 d-flex align-items-center" type="primary"
        size="large" @click="addUserDrawer = true">
        <IconPlus />&nbsp;{{ t('addUser') }}
      </a-button>
      <a-button v-else class="linear-gradient-1 d-flex align-items-center" type="primary" size="large"
        @click="addRoleDrawer = true">
        <IconPlus />&nbsp;{{ t('addRole') }}
      </a-button>
    </template>
  </DocHead>
  <a-tabs v-model:activeKey="activeTabKey" size="large" class="tab" @change="onTabChangeHandler">
    <a-tab-pane key="users" :tab="t('users')">
      <div class="filter-wrapper">
        <div class="inputs-wrapper">
          <a-input v-model:value.lazy="filter.search" :placeholder="t('search')" size="large" class="search">
            <template #prefix>
              <IconSearch />
            </template>
          </a-input>
          <div>
            <a-select class="date-helper" v-model:value="dateHelper" size="large" :placeholder="t('select')"
              :allowClear="true" @change="dateHelperChange">
              <a-select-option :value="helper.value" v-for="helper in dateHelpers" :key="helper.value">
                {{ helper.name }}
              </a-select-option>
            </a-select>
            <DatePicker class="datepicker" v-model:value="filter['date']" type="range" size="large"
              :allowClear="false" />
          </div>
        </div>
        <div>
          <a-button class="export-btn" size="large" @click="exportHandler">
            <IconExport /> {{ t('export') }}
          </a-button>
        </div>
      </div>
      <BaseTable :columns="tableColumns" :row-key="(record) => record.number" :data-source="userStore.usersList.results"
        :pagination="tablePagination" :scroll="{ y: '60vh', x: '1200px' }" :showSorterTooltip="false"
        :tableLoading="tableLoading" :custom-row="customRow" @change="tableChangeHandler">
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'actions'">
            <a-dropdown overlayClassName="table-actions-menu">
              <a class="table-actions" @click.prevent>
                <IconActions />
              </a>
              <template #overlay>
                <a-menu>
                  <div class="actions-title">{{ t('actions') }}</div>
                  <a-menu-item>
                    <a href="javascript:;" class="action" @click="handleSeeMoreMenu(record.user_id, true)">
                      <div>
                        <IconEye class="icon-action" />&nbsp;{{ t('viewInDetail') }}
                      </div>
                      <div class="icon-arrow">
                        <IconArrow />
                      </div>
                    </a>
                  </a-menu-item>
                  <a-menu-item>
                    <a-popconfirm :title="t('sureDelete')" :ok-text="t('yes')" :cancel-text="t('no')"
                      @confirm="deleteUserHandler(record.user_id)">
                      <a href="javascript:;" class="action">
                        <div>
                          <IconTrash class="icon-action" />&nbsp;{{ t('delete') }}
                        </div>
                        <div class="icon-arrow">
                          <IconArrow />
                        </div>
                      </a>
                    </a-popconfirm>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
          <template v-else-if="column.dataIndex === 'role'">
            <div class="roles">
              <a-tag size="large" class="role-tag" v-for="role in record.roles" :key="role.role_id">{{ role.name
                }}</a-tag>
            </div>
          </template>
        </template>
      </BaseTable>
      <a-drawer rootClassName="drawer" :closable="false" :width="502" :open="addUserDrawer" :destroyOnClose="true"
        @close="closeAddUserDrawer" @afterOpenChange="addUserDrawerOpen">
        <template #title>
          <div class="drawer-title">
            <h3>{{ t('addUser') }}</h3>
            <p>{{ t('fillEmptyArea') }}</p>
          </div>
        </template>

        <Loader :loading="userInfoLoading">
          <div class="drawer-body">
            <a-form ref="addUserFormRef" :model="addUserForm" layout="vertical">
              <a-form-item :label="t('pinfl')" name="userPinfl"
                :rules="[{ required: true, message: t('requiredInput') }]">
                <a-input size="large" v-model:value="addUserForm.userPinfl" :placeholder="t('pinfl')"
                  @pressEnter="getUserInfoByPinfl" />
              </a-form-item>
              <div v-if="JSON.stringify(userStore.userInfo) !== '{}'">
                <p class="section-title">{{ t('userInfo') }}</p>
                <div>
                  <div class="user-info">
                    <img class="user-avatar-img" src="@/assets/images/user-avatar.png" alt="user-avatar" />
                    <div>
                      <h3>{{ userStore.userInfo.fio }}</h3>
                      <p>{{ userStore.userInfo.orgName }}</p>
                    </div>
                  </div>
                  <div class="user-workplace-info">
                    <div>
                      <p>{{ t('orgName') }}</p>
                      <span>{{ userStore.userInfo.orgName }}</span>
                    </div>
                    <div>
                      <p>{{ t('userPosition') }}</p>
                      <span>{{ userStore.userInfo.position }}</span>
                    </div>
                    <div>
                      <p>{{ t('employmentRate') }}</p>
                      <span>{{ userStore.userInfo.employmentRate }}</span>
                    </div>
                    <div>
                      <p>{{ t('employmentTime') }}</p>
                      <span>{{ userStore.userInfo.employmentTime }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-3" v-if="JSON.stringify(userStore.userInfo) !== '{}'">
                <p class="section-title">{{ t('attachingRole') }}</p>
                <div>
                  <a-form-item v-for="role in userStore.userRoles" :key="role.id" :name="role.id" class="role-wrapper">
                    <div class="role">
                      <a-switch v-model:checked="addUserForm[role.id]" />
                      <div>
                        <h3 class="font-weight-500">{{ role.name }}</h3>
                        <p style="color: var(--color-text2)">{{ role.description }}</p>
                      </div>
                    </div>
                  </a-form-item>
                </div>
              </div>
            </a-form>
          </div>
        </Loader>

        <template #footer>
          <div class="drawer-footer">
            <a-button class="w-100" size="large" @click="closeAddUserDrawer">
              {{ t('back') }}
            </a-button>
            <a-button class="w-100" size="large" :disabled="!userStore.userInfo.fio" type="primary"
              @click="addUserHandler">
              {{ t('add') }}
            </a-button>
          </div>
        </template>
      </a-drawer>
    </a-tab-pane>
    <a-tab-pane key="userRoles" :tab="t('userRoles')">
      <RolePermissions />
      <CreateRole :open="addRoleDrawer" @close="addRoleDrawer = false" />
    </a-tab-pane>
  </a-tabs>

  <a-drawer rootClassName="drawer" :width="502" :open="isMoreInfo" :destroyOnClose="true"
    @close="handleSeeMoreMenu(false, null)" @afterOpenChange="addEmployeeDrawerOpen" :loading="userInfoLoading">
    <template #title>
      <div class="drawer-title">
        <h3>{{ t('userMoreInfo') }}</h3>
      </div>
    </template>
    <Loader :loading="userInfoLoading">
      <div class="drawer-body">
        <EditUserRole />
      </div>
    </Loader>
  </a-drawer>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss';
@use '@/assets/styles/mixins.scss' as *;

.tab {
  .tab-item {
    display: flex;
    align-items: center;
    gap: 4px;

    .badge {
      background-color: var(--color-red);
      border-radius: 50%;
      color: white;
      width: 20px;
      height: 20px;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.filter-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .inputs-wrapper {
    display: flex;
    gap: 12px;

    .date-helper {
      min-width: 150px;

      &:deep(.ant-select-selector) {
        border-right: unset;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }

    .datepicker {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      position: relative;
      bottom: 1px;
      width: 250px;
    }

    @include lg {
      flex-direction: column;
    }
  }

  .search {
    color: var(--color-text2);
    width: 352px;
  }

  .export-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--color-text2);

    &:hover {
      color: var(--color-primary);
    }

    :deep(.anticon) {
      position: relative;
      top: 2px;
    }
  }
}

.user-info {
  display: flex;
  gap: 18px;
  padding: 20px 0;
  border-bottom: 1px dashed var(--color-border);

  // img {
  //   width: 44px;
  //   height: 44px;
  //   object-fit: contain;
  //   border-radius: 7px;
  // }

  div {
    h3 {
      font-weight: 500;
    }

    p {
      color: var(--color-text2);
    }
  }
}

.user-workplace-info {
  div {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;

    p {
      color: var(--color-text2);
    }

    span {
      text-align: right;
    }
  }
}

.roles {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  row-gap: 10px;
}

.role-wrapper {
  margin-bottom: 0;
  padding: 16px 0;
  border-bottom: 1px dashed var(--color-border);

  &:last-child {
    border-bottom: unset;
  }

  .role {
    display: flex;
    gap: 20px;
    align-items: center;
  }
}
</style>
