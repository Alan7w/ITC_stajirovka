<script setup lang="ts">
import { onMounted, ref, watch, h } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Empty } from 'ant-design-vue'
import { LoadingOutlined } from '@ant-design/icons-vue'

import { useCriteriaStore } from '@/stores/criteria'
import DocHead from '@/components/DocHead.vue'
import DatePicker from '@/components/DatePicker.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import IconArrow from '@/components/icons/IconArrow.vue'
import IconCriteria from '@/components/icons/IconCriteria.vue'
import IconSearch from '@/components/icons/IconSearch.vue'
import IconExport from '@/components/icons/IconExport.vue'
import IconActions from '@/components/icons/IconActions.vue'
import IconEye from '@/components/icons/IconEye.vue'
import IconPencil from '@/components/icons/IconPencil.vue'
import IconSendToSign from '@/components/icons/IconSendToSign.vue'
import IconTrash from '@/components/icons/IconTrash.vue'

interface Filter {
  search: string
  date: string[]
  status: string
  field: string
  order: string
  page: number
  size: number
  total: number
}

const EMPTY_IMAGE = Empty.PRESENTED_IMAGE_SIMPLE

const router = useRouter()
const { t } = useI18n()
const criteriaStore = useCriteriaStore()

const dateHelper = ref()

const BADGE_STATUSES = ['Confirmed', 'Rejected']

const fetchTabCounts = async () => {
  const counts = await Promise.all(BADGE_STATUSES.map((s) => criteriaStore.getCriteriaCount(s)))
  BADGE_STATUSES.forEach((status, i) => {
    const tab = tabItems.value.find((t) => t.value === status)
    if (tab) tab.badge = counts[i]
  })
}

onMounted(() => {
  getTableData(filter.value)
  fetchTabCounts()
})

const activeTabKey = ref('Active')

const tabItems = ref([
  {
    name: t('created'),
    value: 'Active',
    badge: 0,
  },
  {
    name: t('signed'),
    value: 'Confirmed',
    badge: 0,
  },
  {
    name: t('returnedToEdit'),
    value: 'Rejected',
    badge: 0,
  },
  {
    name: t('archived'),
    value: 'Archive',
    badge: 0,
  },
])

const tabChangeHandler = (key) => {
  filter.value.status = key
}

const filter = ref<Filter>({
  search: '',
  date: ['', ''],
  status: activeTabKey.value,
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
    title: '№',
    dataIndex: 'id',
    sorter: true,
    width: 80,
  },
  {
    title: t('criterionName'),
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: t('createdTime'),
    dataIndex: 'created_at',
    sorter: true,
    width: 150,
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
    status: filterData.status,
    field: filterData.field,
    order: filterData.order,
  }

  tableLoading.value = true
  await criteriaStore.getCriteriaList(tableFilter)
  tablePagination.value.total = criteriaStore.criteriaList?.count
  tableLoading.value = false
}

watch(
  filter,
  async (newVal) => {
    // const tableFilter = {
    //   search: newVal.search,
    //   start_date: newVal.date[0],
    //   end_date: newVal.date[1],
    //   page: newVal.page,
    //   size: newVal.size,
    //   status: newVal.status,
    //   field: newVal.field,
    //   order: newVal.order,
    // }

    // tableLoading.value = true
    // await criteriaStore.getCriteriaList(tableFilter)
    // tablePagination.value.total = criteriaStore.criteriaList?.count
    // tableLoading.value = false

    getTableData(newVal)
  },
  { deep: true },
)

const customIcon = h(LoadingOutlined, {
  style: {
    fontSize: '30px',
  },
})

// const archiveHandler = async (id) => {
//   tableLoading.value = true
//   await criteriaStore.archiveCriterion({ pk: id })
//   await criteriaStore.getCriteriaList(filter.value)
//   tableLoading.value = false
// }

const deleteHandler = async (id) => {
  try {
    tableLoading.value = true
    await criteriaStore.deleteCriterion(id)
    await criteriaStore.getCriteriaList(filter.value)
    fetchTabCounts()
  } catch (error) {
  } finally {
    tableLoading.value = false
  }
}

const sendToSignHandler = async (id) => {
  tableLoading.value = true
  await criteriaStore.sendToSignCriterion({ criteria_id: id })
  await criteriaStore.getCriteriaList(filter.value)
  tableLoading.value = false
  fetchTabCounts()
}

const customRow = (record) => {
  return {
    onDblclick: () => {
      router.push({ name: 'editCriterion', params: { id: record.id } })
    },
  }
}

const exportHandler = async () => {
  const exportFilter = {
    search: filter.value.search,
    start_date: filter.value.date[0],
    end_date: filter.value.date[1],
    status: filter.value.status,
  }
  await criteriaStore.exportCriteria(exportFilter)
}
</script>

<template>
  <DocHead>
    <template #left>
      <!-- <h1 class="font-weight-500">{{ t('criteria') }}</h1> -->
      <a-breadcrumb class="breadcrumb">
        <template #separator>
          <IconArrow class="arrow" />
        </template>
        <a-breadcrumb-item><IconCriteria />&nbsp;{{ t('criteria') }}</a-breadcrumb-item>
        <!-- <a-breadcrumb-item href="">Application Center</a-breadcrumb-item>
        <a-breadcrumb-item href="">Application List</a-breadcrumb-item>
        <a-breadcrumb-item>An Application</a-breadcrumb-item> -->
      </a-breadcrumb>
    </template>
    <template #right>
      <a-button
        class="linear-gradient-1 d-flex align-items-center"
        type="primary"
        size="large"
        @click="router.push({ name: 'createCriterion' })"
      >
        <IconPlus />&nbsp;{{ t('createCriterion') }}
      </a-button>
    </template>
  </DocHead>
  <a-tabs v-model:activeKey="activeTabKey" size="large" class="tab" @change="tabChangeHandler">
    <!-- <a-tab-pane key="1" :tab="t('created')"></a-tab-pane> -->
    <a-tab-pane :key="tab.value" v-for="tab in tabItems">
      <template #tab>
        <div class="tab-item">
          {{ tab.name }}
          <div class="badge" v-if="tab.badge">{{ tab.badge }}</div>
        </div>
      </template>
    </a-tab-pane>
    <!-- <a-tab-pane key="3">
      <template #tab>
        <div class="tab-item">
          {{ t('returnedToEdit') }}
          <div class="badge">1</div>
        </div>
      </template>
    </a-tab-pane>
    <a-tab-pane key="4" :tab="t('archived')"></a-tab-pane> -->
  </a-tabs>
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
          <a-select-option :value="helper.value" v-for="helper in dateHelpers">
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
      <a-button class="export-btn" size="large" @click="exportHandler"> <IconExport /> {{ t('export') }} </a-button>
    </div>
  </div>
  <a-table
    class="main-table"
    :columns="tableColumns"
    :row-key="(record) => record.number"
    :data-source="criteriaStore.criteriaList.results"
    :pagination="tablePagination"
    :scroll="{ y: '60vh' }"
    :showSorterTooltip="false"
    :loading="{
      spinning: tableLoading,
      indicator: customIcon,
    }"
    :custom-row="customRow"
    @change="tableChangeHandler"
  >
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
                <a
                  href="javascript:;"
                  class="action"
                  @click="router.push({ name: 'detailsCriterion', params: { id: record.id } })"
                >
                  <div><IconEye class="icon-action" />&nbsp;{{ t('viewInDetail') }}</div>
                  <div class="icon-arrow"><IconArrow /></div>
                </a>
              </a-menu-item>
              <a-menu-item v-if="filter.status !== 'Archive'">
                <a
                  href="javascript:;"
                  class="action"
                  @click="router.push({ name: 'editCriterion', params: { id: record.id } })"
                >
                  <div><IconPencil class="icon-action" />&nbsp;{{ t('edit') }}</div>
                  <div class="icon-arrow"><IconArrow /></div>
                </a>
              </a-menu-item>
              <a-menu-item v-if="filter.status !== 'Archive'">
                <a href="javascript:;" class="action" @click="sendToSignHandler(record.id)">
                  <div><IconSendToSign class="icon-action" />&nbsp;{{ t('sendToSign') }}</div>
                  <div class="icon-arrow"><IconArrow /></div>
                </a>
              </a-menu-item>
              <a-menu-item class="danger">
                <a href="javascript:;" class="action" @click="deleteHandler(record.id)">
                  <div><IconTrash class="icon-action" />&nbsp;{{ t('delete') }}</div>
                  <div class="icon-arrow"><IconArrow /></div>
                </a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </template>
    <template #emptyText>
      <a-empty :image="EMPTY_IMAGE" :description="t('noData')" />
    </template>
  </a-table>
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
    @include lg{
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
</style>
