<script setup lang="ts">
import IconInspector from '@/components/icons/IconInspector.vue'
import { useInspectorStore } from '@/stores/inspector'
import { storeToRefs } from 'pinia'

import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import ResultForm from '@/views/Inspectors/ResultForm.vue'
import ResultView from '@/views/Inspectors/ResultView.vue'

const router = useRouter()
const route = useRoute()
const inspectorStore = useInspectorStore()
const { singleInspector } = storeToRefs(inspectorStore)
const { t } = useI18n()

onMounted(() => {
  inspectorStore.getInspector(route.params.id)
})
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
          <a-breadcrumb-item href="/inspectors" @click="router.push({ name: 'inspectors' })">
            <IconInspector />&nbsp;{{ t('inspectors') }}
          </a-breadcrumb-item>
          <a-breadcrumb-item
            v-if="singleInspector.inspection_status == 'active'"
            :href="`/entrepreneurs/details/${route.params.id}`"
            @click="
              router.push({
                name: 'detailsEntrepreneurs',
                params: { id: route.params.id },
                query: { type: 'inspection' },
              })
            "
          >
            {{ singleInspector.company_name || '-' }}
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ t('inspectionResult') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </template>
  </DocHead>

  <a-descriptions
    class="mt-4"
    :title="t('inspectionInfos')"
    bordered
    :column="1"
    :labelStyle="{ background: 'transparent', width: '30%', fontSize: '16px', fontWight: '400' }"
    :contentStyle="{ width: '70%', fontSize: '16px', fontWight: '400' }"
  >
    <a-descriptions-item :label="t('companyTin') + '/' + t('pinfl')">{{
      singleInspector.tin || '-'
    }}</a-descriptions-item>
    <a-descriptions-item :label="t('companyName')">{{
      singleInspector.company_name || '-'
    }}</a-descriptions-item>
    <a-descriptions-item :label="t('region')">{{
      singleInspector.region || '-'
    }}</a-descriptions-item>
    <a-descriptions-item :label="t('district')">{{
      singleInspector.district || '-'
    }}</a-descriptions-item>
    <a-descriptions-item :label="t('inscpectionOrgan')">
      <div class="d-flex gap-2">
        <a-tag size="large" v-for="item in singleInspector.users" :key="item.id">{{
          item.full_name
        }}</a-tag>
      </div>
    </a-descriptions-item>
    <a-descriptions-item :label="t('orderingOrgan')">
      Asillik inspeksiyasi
      <p class="text-muted">(statik)</p>
    </a-descriptions-item>
    <a-descriptions-item :label="t('competentOrgan')">
      O‘zbekiston Resp. Prezidenti huz. Tadbirkorlarning huquqlarini himoya qilish bo‘yicha vakil
      devoni
      <p class="text-muted">(statik)</p>
    </a-descriptions-item>
  </a-descriptions>
  <div v-if="singleInspector.status" class="mt-4">
    <ResultForm v-if="singleInspector.inspection_status == 'active'" />
    <ResultView v-else-if="singleInspector.inspection_status == 'result_entered'" />
  </div>
  <a-card v-else class="mt-4">
    <a-empty :description="t('noData')" />
  </a-card>
</template>
