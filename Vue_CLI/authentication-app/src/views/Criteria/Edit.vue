<script setup lang="ts">
import { reactive, onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'

import { useCriteriaStore } from '@/stores/criteria'
import Loader from '@/components/Loader.vue'
import DocHead from '@/components/DocHead.vue'
import IconArrow from '@/components/icons/IconArrow.vue'
import IconCriteria from '@/components/icons/IconCriteria.vue'
import IconMinus from '@/components/icons/IconMinus.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import IconTrash from '@/components/icons/IconTrash.vue'
import IconCirclePlus from '@/components/icons/IconCirclePlus.vue'

interface Indicators {
  name: string
  score: number | null
  id?: number
}

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const criteriaStore = useCriteriaStore()

const DEFAULT_INDICATOR_VALUES: Indicators = {
  name: '',
  score: 10,
}

const initialMount = ref(true)

onMounted(async () => {
  loading.value = true
  await criteriaStore.getCriterionDetails(route.params.id as string)
  Object.assign(createCriterionForm, criteriaStore.criterionDetails)
  initialMount.value = false
  loading.value = false
  // console.log(route.params.id)
})

const loading = ref(false)

const createCriterionForm = reactive<{ name: string; indicators: Indicators[] }>({
  name: '',
  indicators: [
    {
      ...DEFAULT_INDICATOR_VALUES,
    },
  ],
})

const onFinish = async (values: any) => {
  loading.value = true
  await criteriaStore.editCriterion(values, route.params?.id)
  loading.value = false
}

const addIndicator = () => {
  createCriterionForm.indicators.push({ ...DEFAULT_INDICATOR_VALUES })
}

const deleteIndicator = (index) => {
  if (index === 0 && createCriterionForm.indicators.length === 1) {
    createCriterionForm.indicators = [
      {
        ...DEFAULT_INDICATOR_VALUES,
      },
    ]
  } else {
    createCriterionForm.indicators.splice(index)
  }
}

const indicatorScoreValid = computed(() => {
  let score = 0
  createCriterionForm.indicators.forEach((indicator) => {
    if (indicator.score) {
      score += indicator.score
    }
  })

  if (score === 100) {
    return true
  }
  return false
})
</script>

<template>
  <Loader :loading="loading">
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
            <a-breadcrumb-item href="/criteria" @click="router.push({ name: 'criteria' })">
              <IconCriteria />&nbsp;{{ t('criteria') }}
            </a-breadcrumb-item>
            <a-breadcrumb-item>{{ t('editCriterion') }}</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
      </template>
    </DocHead>
    <div class="container mt-4">
      <div>
        <h3 class="font-weight-500 mb-1">{{ t('editCriterion') }}</h3>
        <p style="color: var(--color-text2)">{{ t('editCriterionByFilling') }}</p>
        <hr />
      </div>

      <a-form
        layout="vertical"
        name="createCriterion"
        :model="createCriterionForm"
        @finish="onFinish"
      >
        <a-form-item
          name="name"
          :label="t('criterionName')"
          :rules="[{ required: true, message: t('requiredInput') }]"
        >
          <a-textarea
            v-model:value="createCriterionForm.name"
            show-count
            :placeholder="`${t('writeCriterionName')}...`"
            :rows="3"
            size="large"
          />
        </a-form-item>
        <h3 class="font-weight-500 mb-4">{{ t('riskAssessmentIndicator') }}</h3>

        <div class="indicators-wrapper">
          <a-row
            :gutter="4"
            v-for="(indicator, index) in createCriterionForm.indicators"
            :key="index"
          >
            <a-col :xl="18" :xxl="20" :lg="15" :md="12" :sm="24">
              <a-form-item
                class="d-none"
                label="id"
                :name="['indicators', index, 'id']"
                :rules="{
                  required: true,
                  message: t('requiredInput'),
                }"
              >
                <a-input-number v-model:value="indicator.id" size="large" />
              </a-form-item>

              <a-form-item
                :name="['indicators', index, 'name']"
                :label="t('indicatorName')"
                :rules="{
                  required: true,
                  message: t('requiredInput'),
                }"
              >
                <a-input
                  v-model:value="indicator.name"
                  size="large"
                  :placeholder="t('indicatorName')"
                />
              </a-form-item>
            </a-col>
            <a-col :xl="6" :xxl="4" :lg="9" :md="12" :sm="24">
              <div class="d-flex align-items-end gap-1">
                <a-form-item
                  :label="t('score')"
                  :name="['indicators', index, 'score']"
                  :rules="{
                    required: true,
                    message: t('requiredInput'),
                  }"
                >
                  <a-input-number
                    v-model:value="indicator.score"
                    :controls="false"
                    :min="0"
                    :max="100"
                    class="input-number"
                    size="large"
                  >
                    <template #addonBefore>
                      <div
                        class="input-number-step-button minus"
                        @click="
                          () => {
                            if (indicator.score !== null && indicator.score > 0) {
                              indicator.score = +indicator.score - 10
                            }
                          }
                        "
                      >
                        <IconMinus />
                      </div>
                    </template>
                    <template #addonAfter>
                      <div
                        class="input-number-step-button"
                        @click="
                          () => {
                            if (indicator.score !== null && indicator.score < 100) {
                              indicator.score = +indicator.score + 10
                            }
                          }
                        "
                      >
                        <IconPlus />
                      </div>
                    </template>
                  </a-input-number>
                </a-form-item>
                <a-button class="delete-btn" size="large" @click="deleteIndicator(index)">
                  <IconTrash />
                </a-button>
              </div>
            </a-col>
          </a-row>
          <a-button size="large" class="add-indicator-btn" @click="addIndicator">
            <IconCirclePlus />
            <span class="font-weight-500">{{ t('addIndicator') }}</span>
          </a-button>
        </div>

        <a-form-item>
          <div class="footer">
            <div class="alert" :class="{ hidden: indicatorScoreValid || initialMount }">
              <IconAlert />
              <span>{{ t('indicatorAlertMsg') }}</span>
            </div>
            <div class="d-flex gap-3">
              <a-button size="large" @click="router.push({ name: 'criteria' })">
                {{ t('cancel') }}
              </a-button>
              <a-button
                size="large"
                html-type="submit"
                type="primary"
                :disabled="!indicatorScoreValid"
              >
                {{ t('save') }}
              </a-button>
            </div>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </Loader>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss';

.indicators-wrapper {
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: 16px;

  .input-number {
    :deep(.ant-input-number-wrapper) {
      .ant-input-number-input {
        text-align: center;
      }

      .ant-input-number-group-addon {
        background-color: inherit;
        padding: 0;
        line-height: unset;
      }

      // .ant-input-number {
      //   border-right: unset;
      //   border-left: unset;
      // }
    }

    &-step-button {
      color: var(--color-text2);
      cursor: pointer;
      width: 100%;
      height: 100%;
      padding: 0 11px;

      &.minus {
        :deep(.anticon) {
          position: relative;
          top: 3px;
        }
      }
    }
  }

  .delete-btn {
    margin-bottom: 24px;
    background-color: var(--color-FFEBEC);
    color: var(--color-red);
    border: unset;
    display: flex;
    align-items: center;
  }

  .add-indicator-btn {
    border-radius: 20px;
    color: var(--color-primary);
    background-color: var(--color-primary-bg);
    border: unset;
    display: flex;
    align-items: center;
    font-weight: 500;
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;

  .alert {
    color: var(--color-red);
    background-color: var(--color-red-bg);
    padding: 6px 8px;
    border-radius: 8px;
    display: flex;
    gap: 4px;

    &.hidden {
      visibility: hidden;
    }
  }

  button {
    padding: 10px 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 170px;
  }
}
</style>
