<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Table } from 'ant-design-vue'

import { useEntrepreneursStore } from '@/stores/entrepreneurs'
import DocHead from '@/components/DocHead.vue'
import IconSuccess from '@/components/icons/IconSuccess.vue'
import IconArrow from '@/components/icons/IconArrow.vue'
import IconSearch from '@/components/icons/IconSearch.vue'
import IconExport from '@/components/icons/IconExport.vue'
import IconBriefcase from '@/components/icons/IconBriefcase.vue'
import BaseTable from '@/components/BaseTable.vue'
import IconComment from '@/components/icons/IconComment.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import { USER_PERMISSIONS } from '@/constants/enums'

interface Filter {
  search: string
  page: number
  size: number
  total: number
  risk_level: string
}
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const entrepreneursStore = useEntrepreneursStore()
const pageType = ref(route.query.type)
onMounted(() => {
  getTableData(filter.value)
})

const filter = ref<Filter>({
  search: '',
  page: 1,
  size: 10,
  total: 0,
  risk_level: '',
})

const tableColumns = [
  {
    title: '№',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: t('docNumber'),
    dataIndex: 'number',
    width: 120,
  },
  {
    title: t('registrationDate'),
    dataIndex: 'registration_date',
    width: 120,
  },
  {
    title: t('expiryDate'),
    dataIndex: 'expiry_date',
    width: 180,
  },
  {
    title: t('state'),
    dataIndex: 'status',
    width: 180,
  },
  {
    title: t('activityAddress'),
    dataIndex: 'activity_address',
    width: 300,
  },
  Table.EXPAND_COLUMN,
]

const filterOptions = [
  {
    label: t('all'),
    value: '',
  },
  {
    label: t('low'),
    value: 'low',
  },
  {
    label: t('medium'),
    value: 'medium',
  },
  {
    label: t('high'),
    value: 'high',
  },
]

// const filterValue = ref<string>('all')
const tablePagination = ref({
  current: filter.value.page,
  pageSize: filter.value.size,
  total: filter.value.total,
  risk_level: filter.value.risk_level,
})

const tableLoading = ref(true)

const tableChangeHandler = (pagination, _, sorter) => {
  filter.value.page = pagination.current
  filter.value.size = pagination.pageSize

  tablePagination.value.current = pagination.current
  tablePagination.value.pageSize = pagination.pageSize
  tablePagination.value.risk_level = pagination.risk_level
}

const getTableData = async (filterData) => {
  const tableFilter = {
    search: filterData.search,
    page: filterData.page,
    size: filterData.size,
    risk_level: filterData.risk_level,
  }

  tableLoading.value = true
  await entrepreneursStore.getCompanyDetails(route.params.id, tableFilter)
  tablePagination.value.total = entrepreneursStore.companyDetails?.count
  tableLoading.value = false
}

watch(
  filter,
  async (newVal) => {
    getTableData(newVal)
  },
  { deep: true },
)

const customRow = (record) => {
  return {
    onDblclick: () => {
      // router.push({ name: 'editCriterion', params: { id: record.id } })
    },
  }
}

// const handleChange = () => {
//   getTableData(filter)
// }

const expandedRowKeys = ref<number[]>([])

const tableExpandHandler = async (expanded, record) => {
  if (expanded) {
    // Open only this row
    // expandedRowKeys.value = [record.id]
    expandedRowKeys.value.push(record.id)
  } else {
    // Collapse all
    // expandedRowKeys.value = []
    const index = expandedRowKeys.value.indexOf(record.id)
    expandedRowKeys.value.splice(index, 1)
  }
}

const rowClass = (record) => {
  return expandedRowKeys.value.includes(record.id) ? 'expanded-row' : ''
}
</script>

<template>
  <DocHead>
    <template #left>
      <div class="d-flex align-items-center gap-4">
        <a-button size="large" @click="router.back()">
          <IconArrow class="back-btn-icon" />
          {{ t('back') }}
        </a-button>
        <a-breadcrumb class="breadcrumb">
          <template #separator>
            <IconArrow class="arrow" />
          </template>
          <a-breadcrumb-item v-if="pageType === 'inspection'" href="/inspectors"
            @click="router.push({ name: 'inspectors' })">
            <IconInspector />&nbsp;{{ t('inspectors') }}
          </a-breadcrumb-item>
          <a-breadcrumb-item v-else href="/entrepreneurs" @click="router.push({ name: 'entrepreneurs' })">
            <IconBriefcase />&nbsp;{{ t('entrepreneursList') }}
          </a-breadcrumb-item>
          <!-- <a-breadcrumb-item>
            {{ entrepreneursStore.companyDetails.company_name || '-' }}
          </a-breadcrumb-item> -->
          <a-breadcrumb-item>
            <a-tooltip placement="bottom" :title="entrepreneursStore.companyDetails.company_name || '-'"
              :mouseEnterDelay="0.3">
              <span class="line-clamp">
                {{ entrepreneursStore.companyDetails.company_name || '-' }}
              </span>
            </a-tooltip>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </template>
    <template #right>
      <a-button class="linear-gradient-1 d-flex align-items-center" type="primary" size="large"
        v-if="pageType === 'inspection'" @click="
          router.push({
            name: 'inspectionResult',
            params: { id: route.params.id },
          })
          ">
        <IconPlus />{{ t('enterResult') }}
      </a-button>
      <a-button v-can="USER_PERMISSIONS.VIEW_COMPANY_EVALUATION" v-else
        class="linear-gradient-1 d-flex align-items-center" type="primary" size="large" @click="
          router.push({
            name: 'ratingEntrepreneurs',
            params: { id: entrepreneursStore.companyDetails.company_id },
          })
          ">
        <IconSuccess class="icon" />&nbsp;{{ t('evaluate') }}
      </a-button>
    </template>
  </DocHead>

  <div class="filter-wrapper">
    <div class="inputs-wrapper">
      <a-input v-model:value.lazy="filter.search" :placeholder="t('search')" size="large" class="search">
        <template #prefix>
          <IconSearch />
        </template>
      </a-input>
    </div>
    <div class="d-flex align-items-center justify-content-end">
      <a-button class="export-btn" size="large">
        <IconExport /> {{ t('export') }}
      </a-button>
    </div>
  </div>
  <BaseTable :columns="tableColumns" :row-key="(record) => record.id"
    :data-source="entrepreneursStore.companyDetails.results" :expandedRowKeys="expandedRowKeys"
    :expand-column-width="100" :pagination="tablePagination" :scroll="{ y: '60vh' }" :showSorterTooltip="false"
    :tableLoading="tableLoading" :custom-row="customRow" :row-height="50" :rowClassName="rowClass"
    @change="tableChangeHandler" @expand="tableExpandHandler">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'id'">
        {{ record?.id }}
      </template>
      <template v-if="column.dataIndex === 'number'">
        {{ record?.number }}
      </template>
      <template v-if="column.dataIndex === 'registration_date'">
        {{ record?.registration_date }}
      </template>
      <template v-if="column.dataIndex === 'expiry_date'">
        <div class="expiry-data">
          {{ t('unlimited') }}
        </div>
        {{ record?.expiry_date }}
      </template>
      <template v-if="column.dataIndex === 'status'">
        <StatusBadge :status="record?.status" />
      </template>
      <template v-if="column.dataIndex === 'activity_address'">
        <span v-for="item in record.activity_addresses" :key="item.address">
          {{ item.address }}
        </span>
        <!-- Хорезмская область, Топраккалинский район, Нуробод МФЙ, Намуна кучаси, 28-уй -->
      </template>
    </template>
    <template #expandIcon="{ onExpand, expanded, record }" style="text-align: center">
      <div class="d-flex justify-content-center">
        <div @click="onExpand(record, $event)">
          <IconArrow :class="[!expanded ? 'rotate-90' : 'rotate-270']" style="cursor: pointer" />
        </div>
      </div>
      <!-- <IconArrow /> -->
    </template>
    <template #expandedRowRender="{ record }">
      <div class="expanded-row-info" v-for="item in record.specializations" :key="item.id">
        <IconComment class="icon-comment" />
        {{ item.name }}
      </div>
    </template>
  </BaseTable>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss';

.line-clamp {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


.filter-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;

  .inputs-wrapper {
    display: flex;
    gap: 12px;
  }

  .search {
    color: var(--color-text2);
    width: 352px;
  }

  :deep(.filter) {
    min-width: 100px;
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

  .expand-icon {
    cursor: pointer !important;
    color: var(--color-dark);
    text-align: center;
    width: 24px;
    height: 24px;
  }
}

.header-text {
  font-size: 18px;
  font-weight: 500;
}

.page-name {
  color: var(--color-text2);
}

.expiry-data {
  width: fit-content;
  padding: 4px 8px;
  border-radius: 6px;
  text-align: center;
  border: 1px solid lightgray;
}

.icon {
  color: var(--color-white);
  width: 20px;
  height: 20px;
}

.icon-comment {
  color: var(--color-dark);
  width: 20px;
  height: 20px;
}

.expanded-row-info {
  background: var(--color-white);
  padding: 12px;
  border-radius: 12px;
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
</style>
