<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import IconDashboard from '@/components/icons/IconDashboard.vue'
import TheDonutChart from '@/components/charts/TheDonutChart.vue'
import TheHorizontalBarChart from '@/components/charts/TheHorizontalBarChart.vue'
import ThePieChart from '@/components/charts/ThePieChart.vue'
import TheActivityCard from '@/components/charts/TheActivityCard.vue'
import { computed, onMounted, ref, watch, type Component } from 'vue'
import TheInsightCard from '@/components/charts/TheInsightCard.vue'
import IconInfo from '@/components/icons/IconInfo.vue'
import BaseTable from '@/components/BaseTable.vue'
import { useDashboardStore } from '@/stores/dashboard'
import { storeToRefs } from 'pinia'
import IconExport from '@/components/icons/IconExport.vue'
import TheStatCard from '@/components/charts/TheStatCard.vue'
import DocHead from '@/components/DocHead.vue'
import IconArrow from '@/components/icons/IconArrow.vue'
import IconBuilding from '@/components/icons/IconBuilding.vue'
import IconDocument from '@/components/icons/IconDocument.vue'
import IconDiamond from '@/components/icons/IconDiamond.vue'
import IconCart from '@/components/icons/IconCart.vue'
import IconRefresh from '@/components/icons/IconRefresh.vue'
import IconLocation from '@/components/icons/IconLocation.vue'

interface Insight {
  text: string
  color?: string
  icon?: Component
  iconColor?: string
  iconSize?: number
}

const dashboardStore = useDashboardStore()
const { regions_only, statistics_by_region, statistics, loading } = storeToRefs(dashboardStore)

const { t } = useI18n()
const selectedRegionCode = ref(null)

const handleDownload = () => {
  dashboardStore.exportCompanyByRegion(selectedRegionCode.value)
}

const activities = [
  {
    title: 'Ishlab chiqarish faolligi',
    value: 30,
    color: '#16a34a',
    icon: () => '📈',
    description: 'Zargarlik ishlab chiqarish ruxsatnomalarining nisbati o‘rtacha darajada',
  },
  {
    title: 'Savdo faolligi',
    value: 60,
    color: '#2563eb',
    icon: () => '🏬',
    description: 'Savdo faoliyati barcha ruxsatnomalarning yarmidan ko‘pini tashkil etadi',
  },
  {
    title: 'Qayta ishlash darajasi',
    value: 10,
    color: '#ef4444',
    icon: () => '⚗️',
    description: 'Affin va qayta ishlash segmenti juda past darajada rivojlangan',
  },
  {
    title: 'Past qamrovli faoliyatlar',
    value: 15,
    color: '#f97316',
    icon: () => '⚠️',
    description: 'Uskunalar va ikkilamchi resurslar sohasi rivojlanishni talab qiladi',
  },
]

const insights: Insight[] = [
  {
    text: 'Faoliyat hududlar bo‘yicha notekis taqsimlangan. Toshkent shahri va bir nechta yirik viloyatlar bozorning 60% dan ko‘prog‘ini egallaydi.',
    color: '#eaf2ff',
    icon: IconInfo,
    iconColor: '#3b82f6',
    iconSize: 24,
  },
  {
    text: 'Savdo faoliyati ustunlik qiladi va barcha ruxsatnomalarning 54% ini tashkil etadi. Ishlab chiqarish segmenti kamroq rivojlangan.',
    color: '#fff1e6',
    icon: IconInfo,
    iconColor: '#3b82f6',
    iconSize: 24,
  },
  {
    text: 'Affin va qayta ishlash segmenti juda past darajada (0.5%). Bu yo‘nalishni rivojlantirish zarur.',
    color: '#fff1e6',
    icon: IconInfo,
    iconColor: '#f97316',
    iconSize: 24,
  },
]

const columns = [
  { title: 'T/R', dataIndex: 'index', key: 'index', align: 'center' },
  { title: 'HUDUD NOMI', dataIndex: 'region_name', key: 'region' },
  { title: 'SUBYEKTLAR', dataIndex: 'company_count' },
  { title: 'ZARGARLIK', dataIndex: 'jewelry_count' },
  { title: 'YTT', dataIndex: 'IE_company_count' },
  { title: 'YURIDIK', dataIndex: 'LLC_company_count' },
  { title: 'SAVDO', dataIndex: 'sales_count' },
  { title: 'LOMBARD', dataIndex: 'lombard_count' },
  { title: 'IKKILAMCHI', dataIndex: 'secondary_resources_count' },
  { title: 'USKUNA', dataIndex: 'tools_count' },
  { title: 'AFFIN', dataIndex: 'refining_count' },
  { title: 'RUXSATNOMALAR', dataIndex: 'company_license_count' },
]

const stats = computed(() => [
  {
    value: statistics.value?.company_count || 0,
    title: 'Tadbirkorlik subyektlari',
    subtitle: 'Faol korxonalar',
    icon: IconBuilding,
    iconBg: '#eef2ff',
    iconColor: '#2563eb',
  },
  {
    value: statistics.value?.company_license_count || 0,
    title: 'Jami ruxsatnomalar',
    subtitle: 'Barcha tur bo`yicha',
    icon: IconDocument,
    iconBg: '#eef2ff',
    iconColor: '#2563eb',
  },
  {
    value: statistics.value?.jewelry_count || 0,
    title: 'Zargarlik ishlab chiqarish',
    subtitle: `${statistics.value?.jewelry_percent}% ulushi`,
    icon: IconDiamond,
    iconBg: '#ecfdf5',
    iconColor: '#16a34a',
  },
  {
    value: statistics.value?.sales_count || 0,
    title: 'Savdo faoliyati',
    subtitle: `${statistics.value?.sales_percent}% ulushi`,
    icon: IconCart,
    iconBg: '#ecfdf5',
    iconColor: '#16a34a',
  },
  {
    value: statistics.value?.refining_count || 0,
    title: 'Qayta ishlash / affin',
    subtitle: `${statistics.value?.refining_percent}% ulushi`,
    icon: IconRefresh,
    iconBg: '#fef2f2',
    iconColor: '#dc2626',
  },
  {
    value: statistics.value?.region_with_most_companies || '-',
    title: 'Eng katta ulush',
    subtitle: `${statistics.value?.region_companies_count} subyekt (${statistics.value?.region_companies_percent}%)`,
    icon: IconLocation,
    iconBg: '#fff7ed',
    iconColor: '#f97316',
  },
])

onMounted(() => {
  dashboardStore.getRegionOnly()
  dashboardStore.getStatistics()
  dashboardStore.getStatisticsByRegion()
})

watch(
  () => selectedRegionCode.value,
  () => {
    dashboardStore.getStatistics(selectedRegionCode.value)
    dashboardStore.getStatisticsByRegion(selectedRegionCode.value)
  },
)
</script>
<template>
  <div>
    <DocHead>
      <template #left>
        <a-breadcrumb class="breadcrumb">
          <template #separator>
            <IconArrow class="arrow" />
          </template>
          <a-breadcrumb-item> <IconDashboard />&nbsp;{{ t('dashboard') }} </a-breadcrumb-item>
        </a-breadcrumb>
      </template>
    </DocHead>
    <div class="dashboard">
      <div class="filters">
        <a-select
          v-model:value="selectedRegionCode"
          :style="{
            width: '300px',
          }"
          placeholder="Hududni tanlang"
          allow-clear
        >
          <a-select-option :value="null"> Barcha hudud </a-select-option>
          <a-select-option
            v-for="region in regions_only.list"
            :key="region.code"
            :value="region.code"
          >
            {{ region.name }}</a-select-option
          >
        </a-select>
        <a-button
          class="dowload-btn d-flex align-items-center"
          :loading="loading"
          @click="handleDownload"
        >
          <template #icon><IconExport /></template>
          Eksport
        </a-button>
      </div>
      <div class="stats-grid">
        <TheStatCard class="card" v-for="item in stats" :key="item.title" v-bind="item" />
      </div>
      <div class="charts-row">
        <div class="card">
          <TheDonutChart title="Faoliyat turlari bo‘yicha ruxsatnomalar" />
        </div>
        <div class="card">
          <TheHorizontalBarChart title="Hududlar bo‘yicha subyektlar taqsimoti" />
        </div>
      </div>
      <div class="second-row">
        <div class="card">
          <ThePieChart
            title="Tadbirkorlik shakli"
            description="Faoliyatning asosiy qismi yakka tartibdagi tadbirkorlar hissasiga to‘g‘ri keladi."
          />
        </div>
        <div class="activity-grid">
          <TheActivityCard v-for="item in activities" :key="item.title" v-bind="item" />
        </div>
      </div>
      <div class="insight-grid">
        <TheInsightCard v-for="item in insights" :key="item.text" v-bind="item" />
      </div>
      <BaseTable
        :columns="columns"
        :data-source="statistics_by_region?.data"
        :table-loading="false"
        :pagination="false"
        :show-summary="true"
      >
        <template #bodyCell="{ column, index }">
          <template v-if="column.dataIndex === 'index'">
            {{ index + 1 }}
          </template>
        </template>
      </BaseTable>
      <div class="dashboard-footer">
        <span>
          <strong>{{ t('footer.dataSource') }}:</strong> {{ t('footer.dataSourceValue') }}
        </span>
        <span>
          <strong>{{ t('footer.status') }}:</strong> {{ t('footer.statusValue') }}
        </span>
        <span>
          <strong>{{ t('footer.dashboardType') }}:</strong> {{ t('footer.dashboardTypeValue') }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filters {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.card {
  background-color: #fff;
  border: 1px solid #f3f4f6;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
}

/* stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

/* charts */
.charts-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

/* pie + activity */
.second-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

/* activity cards */
.activity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

/* insights */
.insight-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

/* footer */
.dashboard-footer {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 14px 24px;
  background-color: #fff;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  font-size: 13px;
  color: #374151;
}

.dashboard-footer strong {
  font-weight: 600;
  color: #111827;
}

/* ---------- tablet ---------- */
@media (max-width: 1024px) {
  .charts-row {
    grid-template-columns: 1fr;
  }

  .second-row {
    grid-template-columns: 1fr;
  }
}

/* ---------- mobile ---------- */
@media (max-width: 640px) {
  .dashboard {
    gap: 16px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .activity-grid {
    grid-template-columns: 1fr;
  }

  .insight-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
