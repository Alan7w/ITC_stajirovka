<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import {
    CloudServerOutlined,
    DatabaseOutlined,
    PieChartOutlined,
    ArrowDownOutlined,
    ArrowUpOutlined
} from '@ant-design/icons-vue'

import DocHead from '@/components/DocHead.vue'
import IconArrow from '@/components/icons/IconArrow.vue'
import IconMonitoring from '@/components/icons/IconMonitoring.vue'

import TheMonitoringCard from '@/components/charts/TheMonitoringCard.vue'
import TheMonitoringPieChart from '@/components/charts/TheMonitoringPieChart.vue'
import TheBarChart from '@/components/charts/TheBarChart.vue'

import { useMonitoringStore } from '@/stores/monitoring'

const { t } = useI18n()

const monitoringStore = useMonitoringStore()
const { loading, monitoringData } = storeToRefs(monitoringStore)

// ─── Auto-refresh every 30s ────────────────────────────────────────────────
let pollInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
    monitoringStore.fetchMonitoring()
    pollInterval = setInterval(() => {
        monitoringStore.fetchMonitoring(false) // silent refresh
    }, 30_000)
})

onUnmounted(() => {
    if (pollInterval) clearInterval(pollInterval)
})

// ─── Formatters ────────────────────────────────────────────────────────────
const formatBytes = (bytes: number): string => {
    if (!bytes) return '0 B'
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

// ─── CPU ──────────────────────────────────────────────────────────────────
const cpuPercent = computed(() => monitoringData.value?.cpu?.usage_percent ?? 0)

// ─── RAM ──────────────────────────────────────────────────────────────────
const ramPercent = computed(() => monitoringData.value?.ram?.usage_percent ?? 0)

const ramPieData = computed(() => {
    const ram = monitoringData.value?.ram
    if (!ram) return []
    return [
        { name: t('systemMonitoring.used'), value: ram.used },
        { name: t('systemMonitoring.free'), value: ram.total - ram.used }
    ]
})

// ─── Network ──────────────────────────────────────────────────────────────
const rxBarData = computed(() =>
    (monitoringData.value?.network?.rx_bytes ?? []).map(b => ({
        label: b.labels.device,
        value: b.value
    }))
)

const txBarData = computed(() =>
    (monitoringData.value?.network?.tx_bytes ?? []).map(b => ({
        label: b.labels.device,
        value: b.value
    }))
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
                    <a-breadcrumb-item>
                        <IconMonitoring />
                        &nbsp;{{ t('monitoring') }}
                    </a-breadcrumb-item>
                </a-breadcrumb>
            </template>
        </DocHead>

        <div class="monitoring">
            <a-spin :spinning="loading">

                <!-- ── Stat Cards ─────────────────────────────────────── -->
                <div class="stats-grid">
                    <TheMonitoringCard :title="t('systemMonitoring.cpu')" :percent="cpuPercent" stroke-color="#1677ff">
                        <template #icon>
                            <CloudServerOutlined />
                        </template>
                    </TheMonitoringCard>

                    <TheMonitoringCard :title="t('systemMonitoring.ram')" :percent="ramPercent" stroke-color="#faad14">
                        <template #icon>
                            <DatabaseOutlined />
                        </template>
                        <template #footer>
                            <span>
                                {{ t('systemMonitoring.used') }}: {{ formatBytes(monitoringData?.ram.used ?? 0)
                                }}</span>
                            <span>
                                {{ t('systemMonitoring.total') }}: {{ formatBytes(monitoringData?.ram.total ??
                                    0) }}</span>
                        </template>
                    </TheMonitoringCard>
                </div>

                <!-- ── Charts ─────────────────────────────────────────── -->
                <div class="charts-grid">
                    <!-- RAM Pie -->
                    <TheMonitoringPieChart :title="t('systemMonitoring.ramDistribution')" :data="ramPieData"
                        :colors="['#ff4d4f', '#52c41a']">
                        <template #icon>
                            <PieChartOutlined />
                        </template>
                    </TheMonitoringPieChart>

                    <!-- Network RX -->
                    <TheBarChart :title="t('systemMonitoring.networkRx')" :data="rxBarData" color="#1677ff"
                        :y-axis-formatter="formatBytes">
                        <template #icon>
                            <ArrowDownOutlined style="color: #1677ff" />
                        </template>
                    </TheBarChart>

                    <!-- Network TX -->
                    <TheBarChart :title="t('systemMonitoring.networkTx')" :data="txBarData" color="#52c41a"
                        :y-axis-formatter="formatBytes">
                        <template #icon>
                            <ArrowUpOutlined style="color: #52c41a" />
                        </template>
                    </TheBarChart>
                </div>

            </a-spin>
        </div>
    </div>
</template>

<style scoped>
.monitoring {
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
}

.charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
    gap: 20px;
}
</style>