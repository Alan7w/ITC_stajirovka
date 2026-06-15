<script setup lang="ts">
import IconReport from '@/components/icons/IconReport.vue'
import ReestrList from '@/components/Reports/ReestrList.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const activeTabKey = ref('reestr')
</script>
<template>
  <DocHead>
    <template #left>
      <a-breadcrumb class="breadcrumb">
        <template #separator>
          <IconArrow class="arrow" />
        </template>
        <a-breadcrumb-item><IconReport />&nbsp;{{ t('reports') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </template>
  </DocHead>
  <a-tabs v-model:activeKey="activeTabKey" size="large" class="tab">
    <a-tab-pane key="reestr" tab="Reestr">
      <ReestrList />
    </a-tab-pane>
    <a-tab-pane disabled key="svod-1" tab="svod-1" />
    <a-tab-pane disabled key="svod-2" tab="svod-2" />
    <a-tab-pane disabled key="svod-3" tab="svod-3" />
  </a-tabs>
</template>
<style scoped lang="scss"></style>
