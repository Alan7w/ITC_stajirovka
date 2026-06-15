<script setup lang="ts">
import { onMounted, ref, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { Table } from 'ant-design-vue'

import { useCriteriaStore } from '@/stores/criteria'
import { useGlobalStore } from '@/stores/global'
import BaseTable from '@/components/BaseTable.vue'
import IconArrow from '@/components/icons/IconArrow.vue'
import IconComment from '@/components/icons/IconComment.vue'
import IconLink from '@/components/icons/IconLink.vue'
import IconDownload from '@/components/icons/IconDownload.vue'
import IconSendToSign from '@/components/icons/IconSendToSign.vue'
import IconCirclePlus from '@/components/icons/IconCirclePlus.vue'
import IconRejected from '@/components/icons/IconRejected.vue'
import IconPencil from '@/components/icons/IconPencil.vue'
import IconDone from '@/components/icons/IconDone.vue'
import IconArchive from '@/components/icons/IconArchive.vue'
import { USER_PERMISSIONS } from '@/constants/enums'

const loading = ref(false)
const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const criteriaStore = useCriteriaStore()
const isRejectModal = ref(false)

const rejectDescription = ref('')
const globalStore = useGlobalStore()

onMounted(async () => {
  try {
    loading.value = true
    const signedDocId = route.query.doc_id
    if (signedDocId) {
      await globalStore.signDoc({ doc_id: signedDocId, id: route.params.id, type: 'criteria' })
    }
    await criteriaStore.getCriterionDetails(route.params.id as string)
    await criteriaStore.getCriterionHistory({ criteria_id: route.params.id })
  } catch (error) {
  } finally {
    loading.value = false
  }
})

const tableLoading = ref(false)
const tableColumns = [
  {
    title: '№',
    dataIndex: 'order',
    width: 50,
  },
  {
    title: t('riskAssessmentIndicator'),
    dataIndex: 'name',
    // sorter: true,
  },
  {
    title: t('score'),
    dataIndex: 'score',
    // sorter: true,
    width: 80,
    align: 'center',
  },
  Table.EXPAND_COLUMN,
]

interface TableFilter {
  field: string
  order: string
}

const tableFilter = ref<TableFilter>({
  field: '',
  order: '',
})

const tableChangeHandler = (pagination, _, sorter) => {
  tableFilter.value.field = sorter.field
  tableFilter.value.order = sorter.order
}

const expandedRowKeys = ref<number[]>([])

const tableExpandHandler = async (expanded, record) => {
  // console.log(expanded, record)
  tableLoading.value = true
  await criteriaStore.getCriterionIndicatorInfo(record.id)
  tableLoading.value = false
  if (expanded) {
    // Open only this row
    expandedRowKeys.value = [record.id]
  } else {
    // Collapse all
    expandedRowKeys.value = []
  }
}

const rowClass = (record) => {
  return expandedRowKeys.value.includes(record.id) ? 'expanded-row' : ''
}

const actionIconHandler = (status: string) => {
  switch (status) {
    case 'created':
      return h(IconCirclePlus, {
        style: { color: 'var(--color-primary)' },
      })
    case 'sent_signed':
      return h(IconSendToSign, {
        style: { color: 'var(--color-F6B51E)' },
      })
    case 'returned_signed':
      return h(IconRejected, {
        style: { color: 'var(--color-red)' },
      })
    case 'edited':
      return h(IconPencil, {
        style: { color: 'var(--color-text2)' },
      })
    case 'signed':
      return h(IconDone, {
        style: { color: 'var(--color-green)' },
      })
    case 'archived':
      return h(IconArchive, {
        style: { color: 'var(--color-text2)' },
      })
    default:
      return h(IconDone, {
        style: { color: 'var(--color-green)' },
      })
  }
}

const FILE_URL = import.meta.env.VITE_FILE_URL

const confirmHandler = () => {
  const redirectUri = encodeURIComponent(
    `${import.meta.env.VITE_SSO_REDIRECT_URI}/criteria/details/${route.params.id}`,
  )
  const doc = route.params.id
  window.location.href = `https://sso.mf.uz/e-imzo/sign?redirectUri=${redirectUri}&doc=${doc}`
}

const onOkReject = () => {
  criteriaStore.criteriaReject(
    { id: route.params.id, comment: rejectDescription.value },
    () => (isRejectModal.value = false),
  )
}
</script>

<template>
  <Loader :loading="loading">
    <DocHead>
      <template #left>
        <a-breadcrumb class="breadcrumb">
          <template #separator>
            <IconArrow class="arrow" />
          </template>
          <a-breadcrumb-item href="/criteria" @click="router.push({ name: 'criteria' })">
            <IconCriteria />&nbsp;{{ t('criteria') }}
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            {{ `${route.params?.id} - ${t('creterionDetils')}` }}
          </a-breadcrumb-item>
        </a-breadcrumb>
      </template>
      <template #right>
        <a-button
          class="d-flex align-items-center outlined"
          size="large"
          @click="router.push({ name: 'editCriterion', params: { id: route.params?.id } })"
        >
          <IconPencil />&nbsp;{{ t('editCriterion') }}
        </a-button>
      </template>
    </DocHead>

    <a-row class="row">
      <a-col :xl="18" class="left pr-4">
        <div class="info">
          <IconAlert class="icon" />
          <p>
            {{ criteriaStore.criterionDetails?.name }}
          </p>
        </div>
        <BaseTable
          class="main-table"
          :columns="tableColumns"
          :row-key="(record) => record.id"
          :data-source="criteriaStore.criterionDetails?.indicators"
          :scroll="{ y: '70vh' }"
          :showSorterTooltip="false"
          :tableLoading="tableLoading"
          :expand-column-width="100"
          :expandedRowKeys="expandedRowKeys"
          :rowClassName="rowClass"
          @change="tableChangeHandler"
          @expand="tableExpandHandler"
        >
          <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'score'">
              <div class="score-wrapper">
                {{ record.score }}
              </div>
            </template>
          </template>
          <template #expandIcon="{ onExpand, expanded, record }" style="text-align: center">
            <div class="d-flex justify-content-center">
              <div class="expand-icon" @click="onExpand(record, $event)">
                <IconArrow class="close" v-if="!expanded" />
                <IconArrow class="open" v-else />
              </div>
            </div>
          </template>
          <template #expandedRowRender="{ record }">
            <div class="expanded-row-info">
              <div class="comment">
                <IconComment class="icon" />
                <p>{{ criteriaStore.criterionIndicatorInfo?.comment }}</p>
              </div>
              <div class="link-file">
                <div class="link">
                  <a target="_blank" :href="criteriaStore.criterionIndicatorInfo?.link">
                    <IconLink class="icon" />
                    <div>{{ criteriaStore.criterionIndicatorInfo?.link }}</div>
                  </a>
                </div>
                <div class="file" v-if="criteriaStore.criterionIndicatorInfo?.file">
                  <!-- <IconComment class="icon" /> -->
                  <a :href="`${FILE_URL}${criteriaStore.criterionIndicatorInfo?.file}/`">
                    <p>{{ criteriaStore.criterionIndicatorInfo?.file?.split('/').pop() }}</p>
                    <IconDownload />
                  </a>
                </div>
              </div>
            </div>
          </template>
        </BaseTable>
        <div class="total">
          <p>{{ t('totalScores') }}: <span>100</span></p>
        </div>
      </a-col>
      <a-col :xl="6" class="right pl-4">
        <h3>{{ t('actionsHistory') }}</h3>
        <p>{{ t('commitedActions', { count: criteriaStore.criterionHistory.length }) }}</p>
        <div class="history">
          <!-- <div class="status">
            <div class="d-flex">
              <div class="icon-wrapper">
                <IconCirclePlus />
              </div>
              <div class="history-info">
                <h3>Yaratilgan</h3>
                <p>Dilmurod Ismoilov</p>
              </div>
            </div>
            <p>20.05.2025, 11:30</p>
          </div> -->
          <div class="action" v-for="action in criteriaStore.criterionHistory" :key="action.id">
            <div class="d-flex">
              <div class="icon-wrapper">
                <component :is="actionIconHandler(action.status)" />
              </div>
              <div class="action-info">
                <h3>{{ t(`status.${action.status}`) }}</h3>
                <p>{{ action.confirmer }}</p>
              </div>
            </div>
            <p>{{ action.date }}, {{ action.time }}</p>
          </div>
        </div>
      </a-col>
    </a-row>
    <a-modal v-model:open="isRejectModal" :closable="false" :maskClosable="false">
      <div class="reject-criteria">
        <div class="icon-reject">
          <IconWarning />
        </div>
        <div class="content">
          <h3>{{ t('rejectCriteria') }}</h3>
          <p class="text-muted">{{ t('rejectCriteriaMsg') }}</p>

          <label class="label" htmlFor="reasonReject">
            {{ t('reasonReject') }}
            <a-textarea
              v-model:value="rejectDescription"
              show-count
              id="reasonReject"
              :placeholder="`${t('writeHere')}...`"
              :maxlength="200"
              :rows="4"
              size="large"
            />
          </label>
        </div>
      </div>
      <template #footer>
        <a-button size="large" key="back" @click="isRejectModal = false">{{
          t('cancel')
        }}</a-button>
        <a-button
          @click="onOkReject"
          size="large"
          key="submit"
          type="primary"
          danger
          :loading="criteriaStore.criteriaLoading"
        >
          {{ t('decline') }}
        </a-button>
      </template>
    </a-modal>
    <div class="footer" v-can="USER_PERMISSIONS.SIGN_CRITERIA">
      <a-button @click="isRejectModal = true" danger size="large">{{ t('decline') }}</a-button>
      <a-button type="primary" size="large" @click="confirmHandler">{{ t('confirm') }}</a-button>
    </div>
  </Loader>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss';
@use '@/assets/styles/mixins.scss' as *;

.outlined {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.row {
  margin-top: 26px;
  margin-bottom: 100px;

  .left {
    .info {
      padding: 16px;
      background-color: var(--color-primary-bg);
      border-radius: 16px;
      margin-bottom: 26px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 16px;

      .icon {
        color: var(--color-primary);
        transform: scale(1.4);
        position: relative;
        top: 6px;
      }

      p {
        font-weight: 500;
      }
    }

    .score-wrapper {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--color-F7F7F7);
      color: var(--color-primary);
      font-weight: 500;
    }

    .expand-icon {
      cursor: pointer;
      color: var(--color-text2);
      text-align: center;
      width: 24px;
      height: 24px;

      .open {
        transform: rotate(-90deg);
      }

      .close {
        transform: rotate(90deg);
      }
    }

    .expanded-row-info {
      margin-left: 50px;
      margin-right: 180px;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;

      .comment,
      .link-file {
        width: 100%;
        .icon {
          position: relative;
          top: 5px;
        }
      }

      @mixin expand-row-item {
        display: flex;
        align-items: flex-start;
        background-color: var(--color-white);
        padding: 12px;
        border-radius: 12px;
        gap: 12px;
      }

      .comment {
        @include expand-row-item();
      }

      .link-file {
        display: flex;
        gap: 12px;

        .link {
          color: var(--color-primary);
          width: 50%;
          height: 100%;
          @include expand-row-item();

          a {
            color: var(--color-primary);
            display: flex;
            align-items: flex-start;
            gap: 6px;
            overflow: hidden;

            div {
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              display: -webkit-box;
              text-overflow: ellipsis;
            }
          }
        }

        .file {
          @include expand-row-item();
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          width: 50%;
          height: 100%;

          a {
            color: var(--color-text);
            display: flex;
            gap: 10px;
            width: 100%;
          }

          p {
            font-weight: 500;
            font-size: 16px;
            width: 100%;
            border-right: 1px solid var(--color-border);
          }
        }
      }
    }

    .total {
      margin: 24px 0;
      padding: 8px;
      text-align: center;
      background-color: var(--color-FFF3EB);
      border-radius: 8px;

      span {
        color: var(--color-FA7319);
      }
    }
  }

  .right {
    border-left: 1px solid var(--color-border);

    h3 {
      font-weight: 500;
    }

    p {
      color: var(--color-text2);
    }

    .history {
      margin-top: 32px;

      .action {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-bottom: 32px;
        position: relative;

        &:last-child {
          &::before {
            display: none;
          }
        }

        &::before {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 18px;
          height: 28px;
          width: 1px;
          background-color: var(--color-border);
        }

        .icon-wrapper {
          height: 36px;
          width: 36px;
          border: 1px solid var(--color-border);
          display: flex;
          justify-content: center;
          align-items: center;
          color: var(--color-primary);
          border-radius: 50%;
          margin-top: 5px;
          margin-right: 15px;
        }

        &-info {
          p {
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            display: -webkit-box;
            text-overflow: ellipsis;
          }
        }
        @include lg {
          flex-direction: row;
        }

        @include xxl {
          flex-direction: column;
        }
      }
    }
  }
}
.reject-criteria {
  display: flex;
  gap: 1rem;
  width: 100%;
  .icon-reject {
    height: max-content;
    width: max-content;
    padding: 7px 10px;
    border-radius: 10px;
    color: var(--color-red);
    background-color: var(--color-red-bg);
  }
  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    padding-bottom: 2rem;
    h3 {
      font-weight: 500;
      font-size: 16px;
    }
    p {
      font-weight: 400;
      font-size: 14px;
    }
    .label {
      width: 100%;
      font-size: 14px;
      font-weight: 500;
    }
    #reasonReject {
      width: 100%;
    }
  }
}

.footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 24px 0 24px 16px;
  border-top: 1px solid var(--color-border);
  position: fixed;
  bottom: 0;
  width: calc(100% - 298px);
  background-color: var(--color-white);

  button {
    width: 170px;
  }
}
</style>
