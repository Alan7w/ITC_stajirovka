<script setup lang="ts">
import { onMounted, ref, watch, h } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global'

import { useEntrepreneursStore } from '@/stores/entrepreneurs'
import DocHead from '@/components/DocHead.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import IconArrow from '@/components/icons/IconArrow.vue'
import IconSearch from '@/components/icons/IconSearch.vue'
import IconExport from '@/components/icons/IconExport.vue'
import IconBriefcase from '@/components/icons/IconBriefcase.vue'
import BaseTable from '@/components/BaseTable.vue'
import RiskLevel from '@/components/RiskLevel.vue'
import Create from '@/components/entrepreneurs/Create.vue'
import IconEye from '@/components/icons/IconEye.vue'
import { USER_PERMISSIONS } from '@/constants/enums'

interface Filter {
  search: string
  page: number
  size: number
  total: number
  risk_level: string | null
  legal_form: 'IE' | 'LLC' | null
}

const router = useRouter()
const { t } = useI18n()
const entrepreneursStore = useEntrepreneursStore()
const globalStore = useGlobalStore()

onMounted(() => {
  getTableData(filter.value)
})

const activeTabKey = ref('1')

const filter = ref<Filter>({
  search: '',
  legal_form: null,
  page: 1,
  size: 10,
  total: 0,
  risk_level: null,
})

const filter2 = ref<Filter>({
  search: '',
  page: 1,
  size: 10,
  legal_form: null,
  total: 0,
  risk_level: null,
})

const tableColumns = [
  {
    title: '№',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: t('orgName'),
    key: 'name',
    dataIndex: ['company', 'name'],
  },
  {
    title: t('shortName'),
    dataIndex: ['company', 'short_name'],
    key: 'shortName',
  },
  {
    title: `${t('director')} ${t('fio')}`,
    dataIndex: ['company', 'director_full_name'],
    key: 'directorFio',
  },
  {
    title: t('legalForm'),
    dataIndex: ['company', 'legal_form'],
    key: 'legalForm',
    customRender: ({ text }) =>
      text === 'IE' ? t('individualEntrepreneur') : t('limitedLiabilityCompany'),
  },
  {
    title: t('companyTin'),
    dataIndex: ['company', 'tin'],
    key: 'companyTin',
    width: 120,
  },
  {
    title: t('address'),
    dataIndex: ['company', 'address'],
    key: 'address',
    width: 250,
  },
  {
    title: t('oked'),
    dataIndex: ['company', 'oked'],
    key: 'oked',
    width: 120,
  },
  {
    title: t('riskLevel'),
    dataIndex: 'risk_level',
    width: 120,
  },
  {
    title: t('actions'),
    dataIndex: 'actions',
    width: 100,
  },
]
const table2Columns = [
  {
    title: '№',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: t('orgName'),
    dataIndex: 'company_name',
  },
  {
    title: t('criterionName'),
    dataIndex: 'criteria_name',
  },
  {
    title: t('score'),
    dataIndex: 'total_score',
    width: 100,
  },
  {
    title: t('actions'),
    dataIndex: 'actions',
    width: 100,
    align: 'center',
  },
]
const filterOptions = [
  {
    label: t('all'),
    value: null,
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

const table2Pagination = ref({
  current: filter2.value.page,
  pageSize: filter2.value.size,
  total: filter2.value.total,
  risk_level: filter2.value.risk_level,
})

const tableLoading = ref(false)

const tableChangeHandler = (pagination, _, sorter) => {
  filter.value.page = pagination.current
  filter.value.size = pagination.pageSize

  tablePagination.value.current = pagination.current
  tablePagination.value.pageSize = pagination.pageSize
  tablePagination.value.risk_level = pagination.risk_level
}
const table2ChangeHandler = (pagination, _, sorter) => {
  filter2.value.page = pagination.current
  filter2.value.size = pagination.pageSize

  table2Pagination.value.current = pagination.current
  table2Pagination.value.pageSize = pagination.pageSize
  table2Pagination.value.risk_level = pagination.risk_level
}

const getTableData = async (filterData) => {
  const tableFilter = {
    search: filterData.search,
    page: filterData.page,
    size: filterData.size,
    risk_level: filterData.risk_level,
    legal_form: filterData.legal_form,
  }

  tableLoading.value = true
  await entrepreneursStore.getEntrepreneurs(tableFilter)
  tablePagination.value.total = entrepreneursStore.entrepreneurs?.count
  tableLoading.value = false
}

const table2Loading = ref<boolean>(false)
const getTable2Data = async (filterData) => {
  const tableFilter = {
    search: filterData.search,
    page: filterData.page,
    size: filterData.size,
    risk_level: filterData.risk_level,
  }

  table2Loading.value = true
  await entrepreneursStore.getCompanyRiskList(tableFilter)
  table2Pagination.value.total = entrepreneursStore.companyRiskList?.count
  table2Loading.value = false
}

const visibleAddBtn = ref<boolean>(true)
const tabChangeHandler = (key) => {
  if (key == 2) {
    getTable2Data(filter2.value)
    visibleAddBtn.value = false
  } else {
    visibleAddBtn.value = true
  }
}
watch(
  filter,
  async (newVal, oldVal) => {
    getTableData(newVal)
  },
  { deep: true },
)

watch(
  filter2,
  async (newVal) => {
    getTable2Data(newVal)
  },
  { deep: true },
)

const handleChange = () => {
  filter.value.page = 1
  tablePagination.value.current = 1
}

const visibleAddModal = ref<boolean>(false)
const addEntrepreneur = () => {
  visibleAddModal.value = true
}

const saveLoading = ref<boolean>(false)
const CreateEntrepreneur = async (organization: any) => {
  if (!organization?.id) {
    globalStore.notify({ msg: t('emptyInnArea') })
    return
  } else {
    saveLoading.value = true
    await entrepreneursStore.createCompany({
      company_id: organization?.id,
    })
    saveLoading.value = false
    visibleAddModal.value = false
    getTableData(filter.value)
  }
}

const exportHandler = async () => {
  const exportFilter = {
    search: filter.value.search,
    risk_level: filter.value.risk_level,
    legal_form: filter.value.legal_form,
  }
  await entrepreneursStore.exportEntrepreneurs(exportFilter)
}
</script>

<template>
  <DocHead>
    <template #left>
      <a-breadcrumb class="breadcrumb">
        <template #separator>
          <IconArrow class="arrow" />
        </template>
        <a-breadcrumb-item>
          <IconBriefcase />&nbsp;{{ t('entrepreneursList') }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </template>
    <template #right>
      <a-button v-can="USER_PERMISSIONS.ADD_REGISTRY" v-if="visibleAddBtn" class="linear-gradient-1 d-flex align-items-center" type="primary" size="large"
        @click="addEntrepreneur">
        <IconPlus />&nbsp;{{ t('addEntrepreneur') }}
        
      </a-button>
    </template>
  </DocHead>
  <a-tabs v-model:activeKey="activeTabKey" size="large" class="tab" @change="tabChangeHandler">
    <a-tab-pane key="1" :tab="t('entrepreneurs')">
      <div class="filter-wrapper">
        <div class="inputs-wrapper">
          <a-input v-model:value.lazy="filter.search" :placeholder="t('search')" size="large" class="search">
            <template #prefix>
              <IconSearch />
            </template>
          </a-input>
        </div>
        <div class="d-flex align-items-center justify-content-end">
          <a-radio-group v-model:value="filter.legal_form" class="mr-2 filter d-flex gap-2" size="large"
            @change="handleChange">
            <a-radio class="legal-form-radio" :value="null">{{ t('all') }}</a-radio>
            <a-radio class="legal-form-radio" value="IE">{{ t('individualEntrepreneur') }}</a-radio>
            <a-radio class="legal-form-radio" value="LLC">{{
              t('limitedLiabilityCompany')
              }}</a-radio>
          </a-radio-group>
          <a-select @change="handleChange" v-model:value="filter.risk_level" class="mr-2 filter" size="large">
            <a-select-option v-for="item in filterOptions" :key="item.value" :value="item.value">{{
              item.label
              }}</a-select-option>
          </a-select>
          <a-button class="export-btn" size="large" @click="exportHandler">
            <IconExport /> {{ t('export') }}
          </a-button>
        </div>
      </div>
      <BaseTable :columns="tableColumns" :row-key="(record) => record.number"
        :data-source="entrepreneursStore.entrepreneurs?.results" :pagination="tablePagination"
        :scroll="{ y: '60vh', x: '1200px' }" :showSorterTooltip="false" :tableLoading="tableLoading" :row-height="50"
        @change="tableChangeHandler" size="small">
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'risk_level'">
            <RiskLevel :status="record?.risk_level" />
          </template>
          <template v-if="column.dataIndex === 'actions'">
            <a-button type="text" @click="
              () => router.push({ name: 'detailsEntrepreneurs', params: { id: record.company?.id } })
            ">
              <IconEye />
            </a-button>
          </template>
        </template>
      </BaseTable>
    </a-tab-pane>
    <a-tab-pane key="2" :tab="t('entrepreneursInDanger')">
      <div class="filter-wrapper">
        <div class="inputs-wrapper">
          <a-input v-model:value.lazy="filter2.search" :placeholder="t('search')" size="large" class="search">
            <template #prefix>
              <IconSearch />
            </template>
          </a-input>
        </div>
        <div class="d-flex align-items-center justify-content-end">
          <!-- @change="handleChange" -->
          <!-- <a-select v-model:value="filter2.risk_level" class="mr-2 filter" size="large">
            <a-select-option v-for="item in filterOptions" :key="item.value" :value="item.value">{{
              item.label
            }}</a-select-option>
          </a-select> -->
          <a-button class="export-btn" size="large">
            <IconExport /> {{ t('export') }}
          </a-button>
        </div>
      </div>

      <div class="table-header d-flex justify-content-center">
        <p class="text-center text-center">
          Qimmatbaxo metallar va qimmatbaxo toshlar soxasida tadbirkorlik subyektlari tomonidan o’z
          faoliyatida xuquqbuzarlik sodir etish xavfi mavjud bulgan tadbirkorlik subyektlari
          ro’yxatini shakllantirish jadvali
        </p>
      </div>
      <BaseTable :columns="table2Columns" :row-key="(record) => record.id"
        :data-source="entrepreneursStore.companyRiskList.results" :pagination="table2Pagination" :scroll="{ y: '60vh' }"
        :showSorterTooltip="false" :tableLoading="table2Loading" :row-height="50" @change="table2ChangeHandler"
        size="small">
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'id'">
            {{ record.id }}
          </template>
          <template v-if="column.dataIndex === 'company_name'">
            {{ record.company_name }}
          </template>
          <template v-if="column.dataIndex === 'criteria_name'">
            {{ record.criteria_name }}
          </template>
          <template v-if="column.dataIndex === 'given_by'">
            {{ record.given_by }}
          </template>
          <template v-if="column.dataIndex === 'given_time'">
            {{ record.given_time }}
          </template>
          <template v-if="column.dataIndex === 'total_score'">
            {{ record.total_score }}
          </template>
          <template v-if="column.dataIndex === 'level'">
            {{ record.level }}
          </template>
          <template v-if="column.dataIndex === 'actions'">
            <a-button type="text" @click="() => router.push({ name: 'companyHighRisk', params: { id: record.id } })">
              <IconEye />
            </a-button>
          </template>
        </template>
      </BaseTable>
    </a-tab-pane>
  </a-tabs>

  <!-- create -->
  <Create :modal="visibleAddModal" @cancel="visibleAddModal = false" @save="CreateEntrepreneur"
    :saveLoading="saveLoading" />
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss';

.filter-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .inputs-wrapper {
    display: flex;
    gap: 12px;
  }

  .search {
    color: var(--color-text2);
    width: 352px;
  }

  // .filter {
  //   min-width: 100px;
  //   height: 40px;
  // }
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
}

.table-header {
  background-color: #ebf1ff;
  padding: 8px 0;
  width: 100%;
  margin-top: 24px;
  border-radius: 8px;

  p {
    font-weight: 500;
    font-size: 16px;
    width: 60%;
  }
}

.legal-form-radio {
  display: flex;
  gap: 10px;
  align-items: center;
  border: 1px solid var(--color-border);
  padding: 7px;
  border-radius: 10px;

  &:hover {
    cursor: pointer;
    border: 1px solid var(--color-primary);
    transition: all 0.2s ease-in-out;
  }

  &:active {
    transform: scale(0.95);
  }
}
</style>
