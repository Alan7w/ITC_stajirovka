<script setup lang="ts">
import IconArrow from '@/components/icons/IconArrow.vue'
import IconInspector from '@/components/icons/IconInspector.vue'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import InspectorList from '@/views/Inspectors/InspectorList.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const activeTabKey = ref(route.query.key || ('active' as unknown))

onMounted(() => {
  router.push({ query: { key: 'active' } })
})

const onHandleTabChange = (key) => {
  activeTabKey.value = key
  router.push({ query: { key } })
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
          <IconInspector />&nbsp;{{ t('inspectors') }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </template>
  </DocHead>

  <a-tabs v-model:activeKey="activeTabKey" size="large" class="tab" @change="onHandleTabChange">
    <a-tab-pane key="active" :tab="t('notChecked')" />
    <a-tab-pane key="result_entered" :tab="t('checked')" />
  </a-tabs>
  <InspectorList :tabKey="activeTabKey" />
</template>

<style scoped></style>
