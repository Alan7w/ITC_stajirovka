<script setup lang="ts">
import IconActions from '@/components/icons/IconActions.vue'
import IconExport from '@/components/icons/IconExport.vue'
import IconEye from '@/components/icons/IconEye.vue'
import IconAddEmployee from '@/components/icons/IconAddEmployee.vue'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useInspectorStore, type IInspectorList } from '@/stores/inspector'
import { useUserStore } from '@/stores/user'
import InspectorMoreInfo from '@/components/Inspectors/InspectorMoreInfo.vue'
import AddEmployee from '@/components/Inspectors/AddEmployee.vue'
import { useRouter } from 'vue-router'
import IconPlus from '@/components/icons/IconPlus.vue'
import IconCheckCircle from '@/components/icons/IconCheckCircle.vue'
import { USER_PERMISSIONS } from '@/constants/enums'

export interface IUser {
  begin_date: string
  department_name: string
  full_name: string
  organization: string
  position_name: string
  rate: string
  tin: string
  user_id: string
}

const { t } = useI18n()
const dateHelper = ref()
const InspectorsStore = useInspectorStore()
const userStore = useUserStore()
const router = useRouter()
const isEmployeeDrawerOpen = ref<boolean>(false)
const isMoreInfo = ref<boolean>(false)
const selectedCompanyId = ref<number | null>(null)
const { tabKey } = defineProps(['tabKey'])

const handleAddEmployeeDrawer = (isOpen, record) => {
  isEmployeeDrawerOpen.value = isOpen
  InspectorsStore.setCompanyId(record ? record.company : null)
  InspectorsStore.setCompanyRiskId(record ? record.id : null)
}

const handleMoreInfoDrawer = (isOpen, id) => {
  isMoreInfo.value = isOpen
  selectedCompanyId.value = id
}

const addEmployeeDrawerOpen = async () => { }

const filter = ref({
  search: null,
  date: ['', ''],
  field: null,
  order: null,
  page: 1,
  size: 10,
  total: 0,
})

const tablePagination = ref({
  current: filter.value.page,
  pageSize: filter.value.size,
  total: filter.value.total,
})

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

const dateHelperChange = (value) => {
  if (value) {
    filter.value.date = getDateRange(value)
  } else {
    filter.value.date = ['', '']
  }
}

const tableChangeHandler = (pagination, _, sorter) => {
  filter.value.field = sorter.field
  filter.value.order = sorter.order
  filter.value.page = pagination.current
  filter.value.size = pagination.pageSize

  tablePagination.value.current = pagination.current
  tablePagination.value.pageSize = pagination.pageSize
}

const notCheckColumns = [
  {
    title: t('companyName'),
    dataIndex: 'name',
    width: 300,
  },
  {
    title: t('companyTin'),
    dataIndex: 'tin',
    align: 'center',
  },
  {
    title: t('documentNumber'),
    dataIndex: 'doc_number',
    align: 'center',
  },
  {
    title: t('givenTime'),
    dataIndex: 'given_time',
    align: 'center',
  },
  {
    title: t('companyRisk'),
    dataIndex: 'level',
  },
  {
    title: t('inspectors'),
    dataIndex: 'users',
    isShow: tabKey.value === 'active',
    align: 'center',
  },
  {
    title: t('inspectionPeriod'),
    dataIndex: 'date',
    align: 'center',
  },
  {
    title: '',
    dataIndex: 'result',
    align: 'center',
  },
  {
    title: '',
    dataIndex: 'actions',
    align: 'center',
    width: 50,
  },
]

const checkTableColumns = [
  {
    title: t('companyName'),
    dataIndex: 'name',
    width: 300,
  },
  {
    title: t('companyTin'),
    dataIndex: 'tin',
    align: 'center',
  },
  {
    title: t('checkNumber'),
    dataIndex: 'doc_number',
    align: 'center',
  },
  {
    title: t('checkDate'),
    dataIndex: 'given_time',
    align: 'center',
  },
  {
    title: t('realCheckStartDate'),
    dataIndex: 'start_date',
    align: 'center',
  },
  {
    title: t('realCheckEndDate'),
    dataIndex: 'end_date',
    align: 'center',
  },
  {
    title: t('inspectionPeriod'),
    dataIndex: 'date',
    align: 'center',
  },
  {
    title: '',
    dataIndex: 'result',
    align: 'center',
  },
  {
    title: '',
    dataIndex: 'actions',
    align: 'center',
    width: 50,
  },
]

const getTableData = async (filterData) => {
  const tableFilter = {
    search: filterData.search,
    start_date: filterData.date[0],
    end_date: filterData.date[1],
    page: filterData.page,
    size: filterData.size,
    field: filterData.field,
    order: filterData.order,
    status: tabKey,
  }

  await InspectorsStore.getInspectorsList(tableFilter)
}

watch(
  filter.value,
  async (newVal) => {
    getTableData(newVal)
  },
  { deep: true },
)

watch(
  selectedCompanyId,
  () => selectedCompanyId.value && InspectorsStore.getInspector(selectedCompanyId.value),
  { deep: true },
)
onMounted(() => {
  getTableData(filter.value)
  userStore.getUsers({})
})

const customRow = (record: IInspectorList) => {
  return {
    onDblclick: () => {
      if (record.status == 'active') {
        router.push({
          name: 'detailsEntrepreneurs',
          params: { id: record.company },
          query: { type: 'inspection' },
        })
      }
    },
  }
}
watch(
  () => tabKey,
  () => {
    getTableData(filter.value)
  },
)

const exportHandler = async () => {
  const exportFilter = {
    search: filter.value.search,
    start_date: filter.value.date[0],
    end_date: filter.value.date[1],
    status: tabKey,
  }
  await InspectorsStore.exportInspectors(exportFilter)
}
</script>
<template>
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
          <a-select-option :value="helper.value" v-for="(helper, idx) in dateHelpers" :key="idx">
            {{ helper.name }}
          </a-select-option>
        </a-select>
        <DatePicker class="datepicker" v-model:value="filter['date']" type="range" size="large" :allowClear="false" />
      </div>
    </div>
    <div class="buttons-wrapper">
      <a-button class="export-btn" size="large" @click="exportHandler">
        <IconExport /> {{ t('export') }}
      </a-button>
    </div>
  </div>
  <BaseTable :columns="tabKey === 'active' ? notCheckColumns : checkTableColumns" :row-key="(record) => record.number"
    :data-source="InspectorsStore.InspectorsData.results" :pagination="tablePagination"
    :scroll="{ y: '70vh', x: '1200px' }" :maxWidth="500" :showSorterTooltip="false"
    :tableLoading="InspectorsStore.inpectorLoading" size="small" :customRow="customRow" @change="tableChangeHandler">
    <template #headerCell="{ column }">
      <p class="column-title">{{ column.title }}</p>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'given_time'">
        {{ record.given_time }}
      </template>
      <template v-if="column.dataIndex === 'level'">
        <a-tag size="large" v-if="record[column.dataIndex] == 'high'" class="level-tag">
          <template #icon>
            <IconWarning class="icon-level" />
          </template>
          <p>{{ t('high') }}</p>
        </a-tag>
      </template>
      <template v-if="column.dataIndex === 'users'">
        <a-popover>
          <template #title> {{ t('addedEmployees') }} </template>
          <template #content>
            <div class="users">
              <div v-for="user in record.users" :key="user.id" class="user-item">
                {{ user.full_name }}
              </div>
            </div>
          </template>
          <p>
            {{ t('addedEmployees') }}
          </p>
        </a-popover>
      </template>
      <template v-if="column.dataIndex === 'result'">
        <a-button v-if="record.inspection_status == 'active'" size="large" type="link" @click="
          () =>
            router.push({
              name: 'inspectionResult',
              params: { id: record.company },
            })
        ">
          <IconPlus />
          {{ t('enterResult') }}
        </a-button>
        <button @click="
          () =>
            router.push({
              name: 'inspectionResult',
              params: { id: record.company },
            })
        " v-else-if="record.inspection_status == 'result_entered'" class="btn-checked" size="large">
          <IconCheckCircle /> {{ t('checked') }}
        </button>
      </template>
      <template v-if="column.dataIndex === 'actions'">
        <a-dropdown overlayClassName="table-actions-menu">
          <a class="table-actions" @click.prevent>
            <IconActions />
          </a>
          <template #overlay>
            <a-menu>
              <div class="actions-title">{{ t('actions') }}</div>
              <a-menu-item>
                <div @click="() => handleMoreInfoDrawer(true, record.company)" class="action">
                  <div>
                    <IconEye class="icon-action" />&nbsp;{{ t('viewInDetail') }}
                  </div>
                  <div class="icon-arrow">
                    <IconArrow />
                  </div>
                </div>
              </a-menu-item>
              <a-menu-item v-if="userStore.user.permissions?.includes(USER_PERMISSIONS.ADD_INSPECTORS)">
                <div @click="() => handleAddEmployeeDrawer(true, record)" class="action">
                  <div>
                    <IconAddEmployee class="icon-action" />&nbsp;{{ t('addEmployee') }}
                  </div>
                  <div class="icon-arrow">
                    <IconArrow />
                  </div>
                </div>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </template>
  </BaseTable>
  <a-drawer rootClassName="drawer" :closable="false" :width="550" :open="isEmployeeDrawerOpen" :destroyOnClose="true"
    @close="handleAddEmployeeDrawer(false, null)" @afterOpenChange="addEmployeeDrawerOpen" :loading="true">
    <template #title>
      <div class="drawer-title">
        <h3>{{ t('addEmployee') }}</h3>
        <p>{{ t('fillEmptyArea') }}</p>
      </div>
    </template>
    <AddEmployee @close="handleAddEmployeeDrawer(false, null)" />
  </a-drawer>
  <a-drawer rootClassName="drawer" :closable="false" :width="502" :open="isMoreInfo" :destroyOnClose="true"
    @close="handleMoreInfoDrawer(false, null)" @afterOpenChange="addEmployeeDrawerOpen" :loading="true">
    <template #title>
      <div class="drawer-title">
        <h3>{{ InspectorsStore.singleInspector?.company_name }}</h3>
        <div class="d-flex align-items-center gap-2">
          <p class="text-muted document-number">{{ t('documentNumber') }} -</p>
          <p class="document-number">
            {{ InspectorsStore.singleInspector?.document_number }}
          </p>
          <a-tag class="status" :color="InspectorsStore.singleInspector?.status == 'active' ? 'green' : 'red'">{{
            InspectorsStore.singleInspector?.status == 'active' ? t('active') : t('inactive')
          }}</a-tag>
        </div>
      </div>
    </template>
    <InspectorMoreInfo @close="handleMoreInfoDrawer(false, null)" />
  </a-drawer>
</template>
<style scoped lang="scss">
@use '@/assets/styles/mixins.scss' as *;

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

  .buttons-wrapper {
    display: flex;
    gap: 12px;
  }

  .search {
    color: var(--color-text2);
    width: 352px;
  }

  .export-btn,
  .filter-btn {
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

.column-title {
  text-wrap: nowrap;
}

.divider-title {
  width: 100%;
  background: var(--color-border);
}

.users {
  display: flex;
  flex-direction: column;
  gap: 5px;

  .user-item {
    text-wrap: nowrap;
  }
}

.text-muted {
  font-size: 12px;
}

.document-number {
  font-size: 16px;
}

.status {
  margin-left: auto;
}

.level-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  width: max-content;
  font-size: 15px;
  padding: 3px 8px;
}

.icon-level {
  color: var(--color-red);
}

.drawer {
  position: relative;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .table-actions {
    margin-top: 5px;
  }
}

.btn-checked {
  color: var(--color-green);
  border: none;
  width: 100%;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
</style>
