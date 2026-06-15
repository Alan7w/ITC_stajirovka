<script setup lang="ts">
import IconActions from '@/components/icons/IconActions.vue'
import IconArrow from '@/components/icons/IconArrow.vue'
import IconEye from '@/components/icons/IconEye.vue'
import IconPdf from '@/components/icons/IconPdf.vue'
import IconSendClock from '@/components/icons/IconSendClock.vue'
import { useMessageStore, type IMessageData } from '@/stores/message'
import { h, onMounted, ref, watch } from 'vue'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { MESSAGE_STATUS, USER_PERMISSIONS } from '@/constants/enums'
import { useGlobalStore } from '@/stores/global'

const { t } = useI18n()
const messageStore = useMessageStore()
const { single_detail } = storeToRefs(messageStore)
const route = useRoute()
const dateHelper = ref()
const isShowDetail = ref(false)
const detailId = ref(null)
const baseUrl = import.meta.env.VITE_FILE_URL
const tableColumns = [
  {
    title: 'No',
    dataIndex: 'number',
    key: 'number',
    width: 50,
    align: 'center',
  },
  {
    title: t('companyName'),
    dataIndex: 'company_name',
    key: 'company_name',
    width: 350,
  },
  {
    title: t('createdTime'),
    dataIndex: 'created_at',
    key: 'created_at',
  },
  {
    title: t('state'),
    dataIndex: 'status',
    key: 'status',
    align: 'center',
  },
  {
    title: t('file'),
    dataIndex: 'file',
    key: 'file',
  },
  {
    title: '',
    dataIndex: 'actions',
    key: 'actions',
    width: 100,
    align: 'center',
  },
]

const filter = ref({
  search: null,
  date: ['', ''],
  field: null,
  order: null,
  page: 1,
  size: 10,
  total: 0,
})

const tablePagination = ref({
  current: filter.value.page,
  pageSize: filter.value.size,
  total: filter.value.total,
})

const tableChangeHandler = (pagination, _, sorter) => {
  filter.value.field = sorter.field
  filter.value.order = sorter.order
  filter.value.page = pagination.current
  filter.value.size = pagination.pageSize

  tablePagination.value.current = pagination.current
  tablePagination.value.pageSize = pagination.pageSize
}
const dateHelperChange = (value) => {
  if (value) {
    filter.value.date = getDateRange(value)
  } else {
    filter.value.date = ['', '']
  }
}

const getDateRange = (daysAgo) => {
  const formatDate = (date) => {
    const dd = String(date.getDate()).padStart(2, '0')
    const mm = String(date.getMonth() + 1).padStart(2, '0') // months are 0-based
    const yyyy = date.getFullYear()
    return `${dd}.${mm}.${yyyy}`
  }

  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - daysAgo)

  return [formatDate(startDate), formatDate(endDate)]
}

const dateHelpers = ref([
  {
    name: t('last7Days'),
    value: 7,
  },
  {
    name: t('last14Days'),
    value: 14,
  },
])

const getTableData = async (filterData) => {
  const tableFilter = {
    search: filterData.search,
    start_date: filterData.date[0],
    end_date: filterData.date[1],
    page: filterData.page,
    size: filterData.size,
    field: filterData.field,
    order: filterData.order,
  }

  await messageStore.getMessageList(
    {
      type: route.query.type || 'regular',
      status: route.query.status || MESSAGE_STATUS.NEW,
      ...tableFilter,
    },
    (res: IMessageData) => {
      tablePagination.value.total = res.count
    },
  )
}

watch(
  filter.value,
  async (newVal) => {
    getTableData(newVal)
  },
  { deep: true },
)

watch(
  () => route.query,
  () => {
    filter.value.page = 1
    tablePagination.value.current = 1
    tablePagination.value.total = messageStore.messageData.count
    filter.value.total = messageStore.messageData.count
  },
)

const onOpenDetail = (id) => {
  messageStore.getSingleDetail(id, () => {
    isShowDetail.value = true
    detailId.value = id
  })
}

const onSearch = () => {
  filter.value.page = 1
  tablePagination.value.current = 1
}

const onCloseDrawer = () => {
  isShowDetail.value = false
  detailId.value = null
  single_detail.value = {
    id: 0,
    company_id: 0,
    company_name: '',
    type: '',
    file: {
      name: '',
      url: '',
      size: 0,
    },
    status: '',
    created_at: '',
    updated_at: '',
  }
}

const indicator = h(LoadingOutlined, {
  style: {
    fontSize: '32px',
  },
  spin: true,
})

function convertSize(size) {
  const kb = size / 1024
  const mb = kb / 1024

  // console.log(`${size} bytes = ${kb.toFixed(1)} KB = ${mb.toFixed(1)} MB`)

  if (mb > 1) {
    return `${mb.toFixed(1)} MB`
  }
  return `${kb.toFixed(1)} KB`
}

const confirmToSendSign = (id) => {
  messageStore.sendToSign(
    {
      id,
      status: 'sent_to_signer',
    },
    () => {
      getTableData(filter.value)
    },
  )
}

const globalStore = useGlobalStore()

onMounted(async () => {
  const signedDocId = route.query.doc_id
  const messageId = localStorage.getItem('messageId')
  if (signedDocId && messageId) {
    await globalStore.signDoc({ doc_id: signedDocId, id: messageId, type: 'notification' })
    localStorage.removeItem('messageId')
  }

  getTableData(filter.value)
})

const signHandler = () => {
  const redirectUri = encodeURIComponent(`${import.meta.env.VITE_SSO_REDIRECT_URI}/message`)
  window.location.href = `https://sso.mf.uz/e-imzo/sign?redirectUri=${redirectUri}&doc=${detailId.value}`
  localStorage.setItem('messageId', detailId.value || '')
}

const exportHandler = async () => {
  const exportFilter = {
    search: filter.value.search,
    start_date: filter.value.date[0],
    end_date: filter.value.date[1],
    type: route.query.type || 'regular',
    status: route.query.status || MESSAGE_STATUS.NEW,
  }
  await messageStore.exportNotifications(exportFilter)
}
</script>
<template>
  <div class="table-wrapper">
    <div class="filter-wrapper">
      <div class="inputs-wrapper">
        <a-input
          v-model:value.lazy="filter.search"
          :placeholder="t('search')"
          size="large"
          class="search"
          @input="onSearch"
        >
          <template #prefix>
            <IconSearch />
          </template>
        </a-input>
        <div class="date-wrapper">
          <a-select
            class="date-helper"
            v-model:value="dateHelper"
            size="large"
            :placeholder="t('select')"
            :allowClear="true"
            @change="dateHelperChange"
          >
            <a-select-option :value="helper.value" v-for="(helper, idx) in dateHelpers" :key="idx">
              {{ helper.name }}
            </a-select-option>
          </a-select>
          <DatePicker
            class="datepicker"
            v-model:value="filter['date']"
            type="range"
            size="large"
            :allowClear="false"
          />
        </div>
      </div>
      <div class="buttons-wrapper">
        <a-button class="export-btn" size="large" @click="exportHandler"> <IconExport /> {{ t('export') }} </a-button>
      </div>
    </div>
    <BaseTable
      :columns="tableColumns"
      :row-key="(record) => record.number"
      :data-source="messageStore.messageData.results"
      :pagination="tablePagination"
      :showSorterTooltip="false"
      size="small"
      :tableLoading="messageStore.messageLoading"
      @change="tableChangeHandler"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'number'">
          <p>{{ tablePagination.current * 10 - 9 + index }}</p>
        </template>
        <template v-if="column.dataIndex === 'file'">
          <div v-if="record[column.key]" class="d-flex gap-2 align-items-center">
            <a
              target="_blank"
              download
              :href="record[column.key]?.url"
              class="d-flex gap-2 align-items-center"
            >
              <IconPdf /> {{ record[column.key]?.name || '-' }}
            </a>
            <!-- <p class="text-muted">({{ (record[column.key]?.size / 1024 || 0).toFixed(1) }}kb)</p> -->
            <p class="text-muted">({{ convertSize(record[column.key]?.size || 0) }})</p>
          </div>
          <p v-else>-</p>
        </template>
        <template v-if="column.dataIndex === 'created_at'">
          {{ record[column.key] }}
        </template>
        <template v-if="column.dataIndex === 'status'">
          <span class="message-status" :class="`status-${record.status}`">
            {{ t(`status.${record[column.key]}`) }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'actions'">
          <a-dropdown overlayClassName="table-actions-menu">
            <a class="table-actions" @click.prevent>
              <IconActions />
            </a>
            <template #overlay>
              <a-menu>
                <div class="actions-title">{{ t('actions') }}</div>
                <a-menu-item>
                  <div class="action" @click="onOpenDetail(record.id)">
                    <div class="menu-item">
                      <IconEye class="icon-action" />
                      <p>
                        {{ t('viewInDetail') }}
                      </p>
                    </div>
                    <div class="icon-arrow"><IconArrow /></div>
                  </div>
                </a-menu-item>
                <a-menu-item v-if="record.status == 'new'">
                  <a-popconfirm
                    :title="t('sureSendToSign')"
                    :ok-text="t('yes')"
                    :cancel-text="t('no')"
                    @confirm="confirmToSendSign(record.id)"
                  >
                    <div class="action">
                      <div class="menu-item">
                        <IconSendClock class="icon-action" />
                        {{ t('sendToSignature') }}
                      </div>
                      <div class="icon-arrow"><IconArrow /></div>
                    </div>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </template>
    </BaseTable>
    <a-drawer
      v-model:open="isShowDetail"
      root-class-name="drawer"
      size="large"
      :bodyStyle="{ padding: 0 }"
      :closable="false"
      @click="onCloseDrawer"
      width="784px"
    >
      <template #title>
        <div class="drawer-title">
          <h3>{{ single_detail.company_name }}</h3>
          <p class="text-muted">{{ t('checkBeforeSend') }}</p>
        </div>
      </template>
      <div class="drawer-body">
        <div class="loader">
          <a-spin :indicator="indicator" />
        </div>
        <div class="document">
          <iframe
            :src="
              `https://docs.google.com/gview?embedded=true&url=${baseUrl}` + single_detail.file.url
            "
            width="100%"
            height="100%"
            style="border: none"
            :key="single_detail.file.url"
          />
        </div>
      </div>
      <template #footer>
        <div class="d-flex gap-2 justify-content-end p-3">
          <a-button size="large" @click="onCloseDrawer">{{ t('cancel') }}</a-button>
          <a-button
            v-if="single_detail.file"
            v-can="USER_PERMISSIONS.SIGN_CRITERIA"
            size="large"
            type="primary"
            @click="signHandler"
          >
            {{ t('sign') }}
          </a-button>
        </div>
      </template>
    </a-drawer>
  </div>
</template>
<style scoped lang="scss">
@use '@/assets/styles/mixins.scss' as *;

.filter-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  @include xxl {
    flex-direction: column;
    gap: 1rem;
    align-items: end;
  }
  .inputs-wrapper {
    display: flex;
    gap: 12px;

    .date-helper {
      min-width: 150px;
      &:deep(.ant-select-selector) {
        border-right: unset;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }

    .datepicker {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      position: relative;
      bottom: 1px;
      width: 250px;
    }
  }

  .buttons-wrapper {
    display: flex;
    gap: 12px;
  }

  .search {
    color: var(--color-text2);
    width: 352px;
  }

  .export-btn,
  .filter-btn {
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
.table-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}
.drawer-body {
  background-color: var(--color-border);
  height: 100%;
  overflow: hidden;
  position: relative;
  .document {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
  .loader {
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
  }
}

.message-status {
  border: 1px solid;
  padding: 5px 10px;
  border-radius: 7px;
  text-wrap: nowrap;
  width: max-content;
}
.status {
  &-new {
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
  }
  &-sent_to_signer {
    color: var(--color-FA7319);
    border: 1px solid var(--color-FA7319);
  }
  &-signed {
    color: var(--color-green);
    border: 1px solid var(--color-green);
  }
  &-rejected {
    color: var(--color-red);
    border: 1px solid var(--color-red);
  }
}
</style>
