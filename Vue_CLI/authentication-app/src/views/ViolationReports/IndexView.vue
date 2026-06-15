<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import DocHead from '@/components/DocHead.vue'
import DatePicker from '@/components/DatePicker.vue'
import IconArrow from '@/components/icons/IconArrow.vue'
import IconSearch from '@/components/icons/IconSearch.vue'
import IconExport from '@/components/icons/IconExport.vue'
import IconActions from '@/components/icons/IconActions.vue'
import BaseTable from '@/components/BaseTable.vue'
import { useRouter } from 'vue-router'
import IconViolationReports from '@/components/icons/IconViolationReports.vue'
import { useViolationReportsStore } from '@/stores/violationReportsStore.ts'
import ViolationDetails from '@/components/ViolationReports/ViolationDetails.vue'
import { useUserStore } from '@/stores/user'
import { USER_PERMISSIONS } from '@/constants/enums'

interface Filter {
  search: string
  date: string[]
  field: string
  order: string
  page: number
  size: number
  total: number
  status?: string
}

const { t } = useI18n()
const isMoreInfo = ref<boolean>(false)
const dateHelper = ref()
const router = useRouter()
const violationReportsStore = useViolationReportsStore()
const violationReportsInfoLoading = ref(false)
const userStore = useUserStore()

const canViewReports = computed(() =>
  userStore.user.permissions?.includes(USER_PERMISSIONS.VIEW_USER_CONTROL) ?? false,
)

onMounted(() => {
  // filter.value.date = getDateRange(dateHelper.value)
  getTableData(filter.value)
})

const activeTabKey = ref('new')

const statusTabs = {
  new: "Kelib tushgan",
  // sent: "Yuborilgan",
  under_study: "Qabul qilingan",
  reward_paid: "To'langan",
  rejected: "Rad etilgan",

  // under_review: "Ko'rib chiqilmoqda",
  // no_violation_detected: "Huquqbuzarlik aniqlanmadi",
  in_the_process_of_collection_a_fine: "Sudga oshirilgan",
  // in_the_process_of_paying_the_prize: "Mukofot to'lash jarayonida",
}


const filter = ref<Filter>({
  search: '',
  date: ['', ''],
  field: '',
  order: '',
  page: 1,
  size: 10,
  total: 0,
  status: activeTabKey.value,
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
    title: t('No'),
    key: 'no',
    width: 80,
    customRender: ({ index }) => (filter.value.page - 1) * filter.value.size + index + 1,
  },
  {
    title: t('ID'),
    dataIndex: 'id',
    width: 80,
  },
  {
    title: t('createdDate'),
    dataIndex: 'created_at',
  },
  {
    title: t('applicant'),
    dataIndex: 'fio',
  },
  {
    title: t('PINFL'),
    dataIndex: 'pinfl',
  },
  {
    title: t('region-area'),
    dataIndex: 'seller_region_name',
  },
  {
    title: t('district-city'),
    dataIndex: 'seller_district_name',
  },
  {
    title: t('violationType'),
    key: 'offenceType',
    dataIndex: 'offenceType',
  },
  {
    title: t('status.default'),
    dataIndex: 'status',
  },
  {
    title: '',
    dataIndex: 'actions',
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
    status: filterData.status,
  }

  tableLoading.value = true
  await violationReportsStore.getViolationReports(tableFilter)
  tablePagination.value.total = violationReportsStore.violationReportsList?.count
  tableLoading.value = false
}

const selectedViolationId = ref<number>(0)

const handleSeeMoreMenu = (isOpen: boolean, id: number) => {
  isMoreInfo.value = isOpen
  selectedViolationId.value = id
}

watch(
  filter,
  async (newVal) => {
    getTableData(newVal)
  },
  { deep: true },
)

watch(activeTabKey, (newStatus) => {
  filter.value.status = newStatus;
  filter.value.page = 1; // yangi tab bosilganda paginationni reset qilamiz
  getTableData(filter.value);
});

const onTabChangeHandler = (key) => {
  router.push({ query: { tab: key } })
}

const exportHandler = async () => {
  const exportFilter = {
    status: filter.value.status,
    start_date: filter.value.date[0],
    end_date: filter.value.date[1],
    search: filter.value.search,
  }
  await violationReportsStore.exportViolationReports(exportFilter)
}
</script>
<template>
  <DocHead>
    <template #left>
      <a-breadcrumb class="breadcrumb">
        <template #separator>
          <IconArrow class="arrow" />
        </template>
        <a-breadcrumb-item
          ><IconViolationReports />&nbsp;{{ t('violationReports') }}</a-breadcrumb-item
        >
      </a-breadcrumb>
    </template>
  </DocHead>
  <a-tabs v-model:activeKey="activeTabKey" size="large" class="tab" @change="onTabChangeHandler">
    <a-tab-pane v-for="(label, status) in statusTabs" :key="status" :tab="label">
      <div class="filter-wrapper">
        <div class="inputs-wrapper">
          <a-input
            v-model:value.lazy="filter.search"
            :placeholder="t('search')"
            size="large"
            class="search"
          >
            <template #prefix>
              <IconSearch />
            </template>
          </a-input>
          <div>
            <a-select
              class="date-helper"
              v-model:value="dateHelper"
              size="large"
              :placeholder="t('select')"
              :allowClear="true"
              @change="dateHelperChange"
            >
              <a-select-option
                :value="helper.value"
                v-for="helper in dateHelpers"
                :key="helper.value"
              >
                {{ helper.name }}
              </a-select-option>
            </a-select>
            <DatePicker
              class="datepicker"
              v-model:value="filter['date']"
              type="range"
              size="large"
              :allowClear="false"
            />
          </div>
        </div>
        <div>
          <a-button v-if="canViewReports" class="export-btn" size="large" @click="exportHandler">
            <IconExport /> {{ t('export') }}
          </a-button>
        </div>
      </div>
      <BaseTable
        :columns="tableColumns"
        :row-key="(record) => record.number"
        :data-source="violationReportsStore.violationReportsList.results"
        :pagination="tablePagination"
        :scroll="{ y: '60vh', x: '1200px' }"
        :showSorterTooltip="false"
        :tableLoading="tableLoading"
        @change="tableChangeHandler"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'offenceType'">
            <a-tooltip :title="record[column.key]?.name_uz">
              <span class="offence_type">
                {{ record[column.dataIndex]?.name_uz }}
              </span>
            </a-tooltip>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <div class="message-status" :class="`status-${record.status}`">
              <span class="dot" :class="`dot-${record.status}`"></span>
              {{ t(`status.${record[column.dataIndex]}`) }}
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'actions'">
            <a-dropdown overlayClassName="table-actions-menu">
              <a class="table-actions" @click.prevent>
                <IconActions />
              </a>
              <template #overlay>
                <a-menu>
                  <div class="actions-title">{{ t('actions') }}</div>
                  <a-menu-item v-if="canViewReports">
                    <a
                      href="javascript:;"
                      class="action"
                      @click="handleSeeMoreMenu(true, record.id)"
                    >
                      <div><IconEye class="icon-action" />&nbsp;{{ t('viewInDetail') }}</div>
                      <div class="icon-arrow"><IconArrow /></div>
                    </a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
          <template v-else-if="column.dataIndex === 'role'">
            <div class="roles">
              <a-tag
                size="large"
                class="role-tag"
                v-for="role in record.roles"
                :key="role.role_id"
                >{{ role.name }}</a-tag
              >
            </div>
          </template>
        </template>
      </BaseTable>
    </a-tab-pane>
  </a-tabs>

  <a-drawer
    rootClassName="drawer"
    :closable="false"
    :width="502"
    :open="isMoreInfo"
    :destroyOnClose="true"
    :bodyStyle="{ padding: 0 }"
    @close="handleSeeMoreMenu(false, 0)"
    :loading="violationReportsInfoLoading"
  >
    <Loader :loading="violationReportsInfoLoading">
      <ViolationDetails v-if="selectedViolationId" :violation-id="selectedViolationId" />
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

.roles {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  row-gap: 10px;
}

.offence_type {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px; /* Adjust the width as needed */
}

.message-status {
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 14px;
  line-height: 20px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.dot-new, .dot_no_violation_detected, .dot_reward_paid {
  background: var(--color-green);
}

.dot-sent, .dot_under_study, .dot_under_review, .dot_in_the_process_of_collection_a_fine, .dot_in_the_process_of_paying_the_prize {
  background: var(--color-FA7319);
}

.dot_rejected {
  background: var(--color-red);
}

.status-new,
.status_no_violation_detected,
.status_reward_paid {
  background: var(--color-green-bg);
  color: var(--color-green);
}

.status-sent,
.status_under_study,
.status_under_review,
.status_in_the_process_of_collection_a_fine,
.status_in_the_process_of_paying_the_prize {
  background: var(--color-FFF3EB);
  color: var(--color-FA7319);
}

.status_rejected {
  background: var(--color-red-bg);
  color: var(--color-red);
}
</style>
