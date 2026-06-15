<script setup lang="ts">
import { h, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import MessageList from '@/views/Message/MessageList.vue'
import CreateMessage from '@/components/Message/CreateMessage.vue'
import IconMessage from '@/components/icons/IconMessage.vue'
import IconCheckCircle from '@/components/icons/IconCheckCircle.vue'
import IconCancelCircle from '@/components/icons/IconCancelCircle.vue'
import IconBell from '@/components/icons/IconBell.vue'
import { useMessageStore } from '@/stores/message'
import { MESSAGE_STATUS } from '@/constants/enums'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const messageStore = useMessageStore()
const activeTabKey = ref((route.query.type || 'regular') as 'regular' | 'high_risk' | 'warning')
const windowWidth = ref(window.innerWidth)
const activeMenuKey = ref(
  (route.query.status || MESSAGE_STATUS.NEW) as
    | MESSAGE_STATUS.NEW
    | MESSAGE_STATUS.SENT_TO_SIGNER
    | MESSAGE_STATUS.SIGNED
    | MESSAGE_STATUS.REJECTED,
)

const statusess = [
  {
    label: t('new'),
    key: 'new',
    icon: () => h(IconMessage),
  },
  {
    label: t('status.sent_signed'),
    key: 'sent_to_signer',
    icon: () => h(IconBell),
  },
  {
    label: t('signed'),
    key: 'signed',
    icon: () => h(IconCheckCircle),
  },
  {
    label: t('status.rejected'),
    key: 'rejected',
    icon: () => h(IconCancelCircle),
  },
]

watch(
  () => activeMenuKey.value,
  () => {
    router.push({ query: { ...route.query, status: activeMenuKey.value } })
    messageStore.getMessageList({ type: activeTabKey.value, status: activeMenuKey.value })
  },
)
watch(
  () => activeTabKey.value,
  () => {
    router.push({ query: { ...route.query, type: activeTabKey.value } })
    messageStore.getMessageList({ type: activeTabKey.value, status: activeMenuKey.value })
  },
)
</script>
<template>
  <DocHead>
    <template #left>
      <a-breadcrumb class="breadcrumb">
        <template #separator>
          <IconArrow class="arrow" />
        </template>
        <a-breadcrumb-item><IconMessage />&nbsp;{{ t('message') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </template>
    <template #right>
      <CreateMessage />
    </template>
  </DocHead>
  <a-tabs
    v-model:activeKey="activeTabKey"
    size="large"
    class="tab"
    @change="(value) => (activeTabKey = value)"
  >
    <a-tab-pane key="regular" :tab="t('regularMessage')" />
    <a-tab-pane key="high_risk" :tab="t('hightDangerMessage')" />
    <a-tab-pane key="warning" :tab="t('warningLetter')" />
  </a-tabs>
  <div class="wrapper">
    <div class="list-status">
      <div class="actions-title">{{ t('statuses') }}</div>
      <a-menu
        :items="statusess"
        :mode="windowWidth > 1200 ? 'vertical' : 'horizontal'"
        :selectedKeys="[activeMenuKey]"
        @click="(a) => (activeMenuKey = a.key)"
      />
    </div>
    <MessageList />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins.scss' as *;

.list-status {
  width: 300px;
  border: 1px solid var(--color-border);
  padding: 1rem 0;
  border-radius: 10px;
  height: max-content;

  @include lg {
    width: 100%;
  }
  .actions-title {
    color: var(--color-text2);
    margin-left: 20px;
    text-transform: uppercase;
  }
}
.menu-item {
  display: flex;
  .icon-action {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
  }
  gap: 5px;
  p {
    margin-top: 4px;
  }
}

:deep(.ant-menu-item) {
  display: flex;
  align-items: center;
}

.wrapper {
  display: flex;
  gap: 15px;

  @include lg {
    flex-direction: column;
  }
}
</style>
