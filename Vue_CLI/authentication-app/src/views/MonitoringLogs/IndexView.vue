<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DocHead from '@/components/DocHead.vue'
import IconLogs from '@/components/icons/IconLogs.vue'
import LoginLogout from '@/components/MonitoringLogs/LoginLogout.vue'
import ApiRequests from '@/components/MonitoringLogs/ApiRequests.vue'

const { t } = useI18n()
const activeTabKey = ref('login-logout')
</script>

<template>
  <DocHead>
    <template #left>
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>
          <IconLogs />&nbsp;{{ t('monitoring') }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </template>
  </DocHead>

  <a-tabs v-model:activeKey="activeTabKey" size="large" class="tab">
    <a-tab-pane key="login-logout" :tab="t('loginLogout')">
      <LoginLogout />
    </a-tab-pane>
    <a-tab-pane key="api-requests" :tab="t('apiRequests')">
      <ApiRequests />
    </a-tab-pane>
  </a-tabs>
</template>

<style scoped lang="scss"></style>
  