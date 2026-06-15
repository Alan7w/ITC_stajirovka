<script setup lang="ts">
import IconPdf from '@/components/icons/IconPdf.vue'
import { useInspectorStore } from '@/stores/inspector'
import { storeToRefs } from 'pinia'
import { onMounted, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { LoadingOutlined } from '@ant-design/icons-vue'

const { t } = useI18n()
const route = useRoute()
const inspectorStore = useInspectorStore()
const baseUrl = import.meta.env.VITE_FILE_URL
const { inspectionResult, inpectorLoading } = storeToRefs(inspectorStore)

function convertSize(size) {
  const kb = size / 1024
  const mb = kb / 1024

  if (mb > 1) {
    return `${mb.toFixed(1)} MB`
  }
  return `${kb.toFixed(1)} KB`
}

const indicator = h(LoadingOutlined, {
  style: {
    fontSize: '40px',
  },
})

onMounted(() => {
  inspectorStore.getInspectionResult(route.params.id)
})
</script>
<template>
  <a-descriptions
    v-if="!inpectorLoading"
    :title="t('resultEnteredOnInspection')"
    bordered
    :column="1"
    :labelStyle="{ background: 'transparent', width: '30%', fontSize: '16px', fontWight: '400' }"
    :contentStyle="{ width: '70%', fontSize: '16px', fontWight: '400' }"
    class="pb-4"
  >
    <a-descriptions-item :label="t('branch')">{{
      inspectionResult.company_license
    }}</a-descriptions-item>
    <a-descriptions-item :label="t('selectIndicator')">{{
      inspectionResult.indicators
    }}</a-descriptions-item>
    <a-descriptions-item :label="t('realCheckStartDate')">{{
      inspectionResult.check_start_date
    }}</a-descriptions-item>
    <a-descriptions-item :label="t('realCheckEndDate')">{{
      inspectionResult.check_end_date
    }}</a-descriptions-item>
    <a-descriptions-item :label="t('realInspectorUsers')">{{
      inspectionResult.inspector_users
    }}</a-descriptions-item>
    <a-descriptions-item :label="t('regularDocuments')">
      <!-- <a
        :href="
          `${baseUrl}` +
          inspectionResult.regular_document?.url
        "
        target="_blank"
        download
      >
    </a> -->
      {{ inspectionResult.regular_document }}
    </a-descriptions-item>
    <a-descriptions-item :label="t('comment')">{{
      inspectionResult.description
    }}</a-descriptions-item>
    <a-descriptions-item :label="t('inspectionReport')">
      <a
        :href="`${baseUrl}` + inspectionResult.check_document?.url"
        target="_blank"
        download
        class="d-flex align-items-center gap-2"
      >
        <IconPdf />
        {{ inspectionResult.check_document?.name }}
        <p class="text-muted">({{ convertSize(inspectionResult.check_document?.size || 0) }})</p>
      </a>
    </a-descriptions-item>
    <a-descriptions-item :label="t('impactMeasures')">
      {{ inspectionResult.impact_measures }}</a-descriptions-item
    >
    <a-descriptions-item :label="t('impactMeasures') + ' (' + t('file').toLowerCase() + ')'">
      <a
        :href="`${baseUrl}` + inspectionResult.impact_measures_document?.url"
        target="_blank"
        download
        class="d-flex align-items-center gap-2"
      >
        <IconPdf />
        {{ inspectionResult.impact_measures_document?.name }}
        <p class="text-muted">
          ({{ convertSize(inspectionResult.impact_measures_document?.size || 0) }})
        </p>
      </a>
    </a-descriptions-item>
    <a-descriptions-item :label="t('impactMeasuresResult')">{{
      inspectionResult.impact_measure_result
    }}</a-descriptions-item>
    <a-descriptions-item :label="t('impactMeasuresResult') + ' (' + t('file').toLowerCase() + ')'">
      <a
        :href="`${baseUrl}` + inspectionResult.impact_measure_result_doc?.url"
        target="_blank"
        download
        class="d-flex align-items-center gap-2"
      >
        <IconPdf />
        {{ inspectionResult.impact_measure_result_doc?.name }}
        <p class="text-muted">
          ({{ convertSize(inspectionResult.impact_measure_result_doc?.size || 0) }})
        </p>
      </a>
    </a-descriptions-item>
    <a-descriptions-item :label="t('rejectMeasures')">{{
      inspectionResult.reject_measures
    }}</a-descriptions-item>
    <a-descriptions-item :label="t('rejectMeasures') + ' (' + t('file').toLowerCase() + ')'">
      <a
        :href="`${baseUrl}` + inspectionResult.reject_measures_document?.url"
        target="_blank"
        download
        class="d-flex align-items-center gap-2"
      >
        <IconPdf />
        {{ inspectionResult.reject_measures_document?.name }}
        <p class="text-muted">
          ({{ convertSize(inspectionResult.reject_measures_document?.size || 0) }})
        </p>
      </a>
    </a-descriptions-item>
    <a-descriptions-item :label="t('inspectionMessage')">
      <a
        :href="`${baseUrl}` + inspectionResult.inspection_message?.url"
        target="_blank"
        download
        class="d-flex align-items-center gap-2"
      >
        <IconPdf />
        {{ inspectionResult.inspection_message?.name }}
        <p class="text-muted">
          ({{ convertSize(inspectionResult.inspection_message?.size || 0) }})
        </p>
      </a>
    </a-descriptions-item>
  </a-descriptions>
  <a-card class="loader" v-else-if="!!inspectionResult.status">
    <a-empty />
  </a-card>
  <a-card class="loader" v-else>
    <a-spin size="large" :spinning="inpectorLoading" :indicator="indicator" />
  </a-card>
</template>
<style scoped lang="scss">
.loader {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
