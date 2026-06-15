<script setup lang="ts">
import IconComment from '@/components/icons/IconComment.vue'
import IconPdf from '@/components/icons/IconPdf.vue'
import Loader from '@/components/Loader.vue'
import { useEntrepreneursStore } from '@/stores/entrepreneurs'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const entrepreneursStore = useEntrepreneursStore()
const { companyRiskDetail, entrepreneursLoading } = storeToRefs(entrepreneursStore)
const router = useRouter()
const route = useRoute()
const FILE_URL = import.meta.env.VITE_FILE_URL
const { t } = useI18n()

onMounted(() => {
  entrepreneursStore.getCompanyRiskDetail(route.params.id)
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
          <a-breadcrumb-item href="/entrepreneurs" @click="router.push({ name: 'entrepreneurs' })">
            <IconBriefcase />&nbsp;{{ t('entrepreneursList') }}
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            {{ companyRiskDetail.company_name || '-' }}
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </template>
    <template #right>
      <div class="d-flex align-items-center gap-3">
        <div class="score-info">
          <p class="text-muted">
            {{ t('totalEarnedPoints') }}: <span>{{ companyRiskDetail.total_score || '-' }}</span>
          </p>
        </div>
        <!-- <a-button
          class="d-flex align-items-center finish-btn"
          type="primary"
          size="large"
          @click="() => console.log('finish')"
        >
          {{ t('finishEvaluate') }}
        </a-button> -->
      </div>
    </template>
  </DocHead>
  <Loader :loading="entrepreneursLoading">
    <div class="company-risk">
      <a-select disabled value="default" size="large" class="w-100">
        <a-select-option value="default">{{ companyRiskDetail.criteria_name }}</a-select-option>
      </a-select>

      <div class="indicators">
        <div class="indicators-head">
          <div class="no">No</div>
          <div class="mark">{{ t('markRiskIndicators') }}</div>
          <div class="score">{{ t('score') }}</div>
        </div>
        <div class="indicators-body">
          <div
            class="indicator"
            v-for="(indicator, idx) in companyRiskDetail.indicators"
            :key="indicator.id"
          >
            <div class="no">
              {{ idx + 1 }}
            </div>
            <div class="mark">
              <p>{{ indicator.name }}</p>
              <div class="detail">
                <a :href="`${FILE_URL}${indicator.file?.url}/`" download class="file" target="_blank">
                  <IconPdf />
                  <div>
                    {{ indicator.file?.name }}
                  </div>
                  <div class="icon">
                    <IconDownload />
                  </div>
                </a>
                <div class="comment">
                  <IconComment />
                  <p>{{ indicator.comment }}</p>
                </div>
              </div>
            </div>
            <div class="score">
              {{ indicator.score }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Loader>
</template>
<style scoped lang="scss">
.score-info {
  font-size: 15px;

  span {
    color: var(--color-text);
    font-weight: 500;
  }
}

.finish-btn {
  background-color: var(--color-green);

  &:hover {
    background-color: var(--color-green);
  }
}
.company-risk {
  padding: 2rem 1rem;
  width: 100%;

  .indicators {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border: 1px solid var(--color-border);
    margin-top: 2rem;
    &-head {
      display: flex;
      gap: 1rem;
      padding: 10px;
      border-radius: 10px;
      background-color: var(--color-F7F7F7);
      color: var(--color-A3A3A3);
      .no {
        width: 3%;
        text-align: center;
      }
      .mark {
        width: 90%;
      }
      .score {
        width: 3%;
        text-align: center;
      }
    }
    &-body {
      .indicator {
        display: flex;
        gap: 1rem;
        padding: 10px;
        border-bottom: 1px solid var(--color-border);
        .no {
          width: 3%;
          text-align: center;
        }
        .mark {
          width: 90%;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          .detail {
            display: flex;
            gap: 1rem;
            .file {
              display: flex;
              padding: 10px;
              gap: 10px;
              width: 30%;
              border-radius: 10px;
              background-color: var(--color-F7F7F7);
              align-items: center;
              cursor: pointer;
              color: var(--color-black);
              .icon {
                margin-left: auto;
                color: var(--color-A3A3A3);
              }
            }
            .comment {
              display: flex;
              padding: 10px;
              gap: 10px;
              width: 70%;
              border-radius: 10px;
              background-color: var(--color-F7F7F7);
              align-items: center;
            }
          }
        }
        .score {
          width: 3%;
          text-align: center;
          font-size: 16px;
          border: 1px solid;
          height: max-content;
          border-radius: 5px;
          background-color: var(--color-F7F7F7);
        }
      }
    }
  }
}

:deep(.ant-select-selector) {
  background-color: transparent !important;
}
</style>
