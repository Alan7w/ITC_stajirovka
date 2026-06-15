<script setup lang="ts">
import { onMounted, ref, reactive, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { Upload } from 'ant-design-vue'

import { useEntrepreneursStore } from '@/stores/entrepreneurs'
import { useCriteriaStore } from '@/stores/criteria'
import Loader from '@/components/Loader.vue'
import { storeToRefs } from 'pinia'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const entrepreneursStore = useEntrepreneursStore()
const criteriaStore = useCriteriaStore()
const { singleCompanyInfos } = storeToRefs(entrepreneursStore)

onMounted(async () => {
  await entrepreneursStore.getCompanyInfos(route.params.id)
  await criteriaStore.getCriteriaList({ size: 100 })
})

const loading = ref(false)
interface Indicators {
  indicator: number
  indicatorName: string
  score: number | null
  newScore?: number | null
  comment: string
  file: []
  checked?: boolean
}

const DEFAULT_INDICATOR_VALUES: Indicators = {
  indicator: 1,
  indicatorName:
    "Ommaviy axborot vositalaridan yoki boshqa tashqi manbalardan (ijtimoiy tarmoqlar, veb-saytlar) olingan ma'lumotlar.",
  score: 10,
  comment: '',
  file: [],
  checked: false,
}

const ratingEntrepreneursForm = reactive<{ criteria: number | null; indicators: Indicators[] }>({
  criteria: null,
  indicators: [
    // {
    //   ...DEFAULT_INDICATOR_VALUES,
    // },
  ],
})

const criterionChangeHandler = async (value) => {
  try {
    loading.value = true
    await criteriaStore.getCriterionDetails(value)
    ratingEntrepreneursForm.indicators = criteriaStore.criterionDetails.indicators.map(
      (indicator) => ({
        indicator: indicator.id,
        indicatorName: indicator.name,
        file: [],
        comment: '',
        score: indicator.score,
        newScore: indicator.score,
        checked: false,
      }),
    )
    // Reset total score when criteria changes
    totalEarnedScore.value = 0
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

const convertToFormData = (data) => {
  const formData = new FormData()

  formData.append('criteria', data.criteria)
  formData.append('company', route.params.id.toString())

  // Only include checked indicators
  const checkedIndicators = data.indicators.filter((indicator) => indicator.checked)
  console.log({
    criteria: data.criteria,
    indicators: checkedIndicators,
  })

  checkedIndicators.forEach((indicator, index) => {
    formData.append(`indicators[${index}]indicator`, indicator.indicator)
    formData.append(`indicators[${index}]score`, indicator.newScore)
    formData.append(`indicators[${index}]comment`, indicator.comment)

    // If file is an array of File objects
    if (indicator.file && indicator.file.length > 0) {
      indicator.file.forEach((file) => {
        const realFile = file.originFileObj || file
        formData.append(`indicators[${index}]file`, realFile)
      })
    }
  })

  return formData
}

const rateHandler = async () => {
  await ratingEntrepreneursRef.value?.validateFields()

  const formData = convertToFormData(toRaw(ratingEntrepreneursForm))
  try {
    loading.value = true
    await entrepreneursStore.rateEntrepreneur(formData)
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

const totalEarnedScore = ref(0)

const toggleIndicatorHandler = (index) => {
  const indicator = ratingEntrepreneursForm.indicators[index]

  // Recalculate totalEarnedScore based on all checked indicators
  totalEarnedScore.value = ratingEntrepreneursForm.indicators
    .filter((ind) => ind.checked)
    .reduce((sum, ind) => sum + (ind.score || 0), 0)

  // If unchecked, clear file and comment
  if (!indicator.checked) {
    ratingEntrepreneursRef.value?.clearValidate()
    indicator.file = []
    indicator.comment = ''
    indicator.newScore = 0
  } else {
    indicator.newScore = indicator.score
  }
}

const criteriaFilterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

const ratingEntrepreneursRef = ref()

const UPLOAD_VALIDATION_MESSAGE = `${t('maxSize')}: 3MB. ${t('allowedFormats')}: .jpg, .pdf, .docx`

const beforeUpload = (file) => {
  const isLt3MB = file.size / 1024 / 1024 < 3 // 3MB

  if (!isLt3MB) {
    alert(UPLOAD_VALIDATION_MESSAGE)
    return Upload.LIST_IGNORE
  }

  return true
}

const dummyRequest = ({ onSuccess }: any) => {
  setTimeout(() => {
    onSuccess('ok')
  }, 1000)
}
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
            <a-breadcrumb-item href="/entrepreneurs" @click="router.push({ name: 'entrepreneurs' })">
              <IconBriefcase />&nbsp;{{ t('entrepreneursList') }}
            </a-breadcrumb-item>
            <!-- <a-breadcrumb-item class="company-name">
              {{ singleCompanyInfos.name || '-' }}
            </a-breadcrumb-item> -->
            <a-breadcrumb-item class="company-name">
              <a-tooltip placement="bottom" :title="entrepreneursStore.companyDetails.company_name || '-'"
                :mouseEnterDelay="0.3">
                <span class="line-clamp">
                  {{ entrepreneursStore.companyDetails.company_name || '-' }}
                </span>
              </a-tooltip>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>
      </template>
      <template #right>
        <div class="d-flex align-items-center gap-3">
          <a-button class="d-flex align-items-center finish-btn" type="primary" size="large" @click="rateHandler">
            {{ t('finishEvaluate') }}
          </a-button>
        </div>
      </template>
    </DocHead>

    <a-form layout="vertical" ref="ratingEntrepreneursRef" name="ratingEntrepreneurs" :model="ratingEntrepreneursForm">
      <a-form-item name="criteria">
        <a-select v-model:value="ratingEntrepreneursForm.criteria" show-search class="mt-4" size="large"
          style="width: 100%" :placeholder="t('criteria')" :filter-option="criteriaFilterOption"
          @change="criterionChangeHandler">
          <a-select-option v-for="criterion in criteriaStore.criteriaList.results" :key="criterion.id"
            :value="criterion.id" :label="criterion.name">
            {{ criterion.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <div v-if="ratingEntrepreneursForm.indicators.length > 0">
        <div class="indicators-head">
          <div>
            <span>№</span>
            <span>{{ t('riskAssessmentIndicator') }}</span>
          </div>
          <div class="score-info">
            <p class="text-muted">
              {{ t('totalEarnedPoints') }}: <span>{{ totalEarnedScore }}</span>
            </p>
          </div>
        </div>
        <div class="indicators-wrapper">
          <div class="indicator" v-for="(indicator, index) in ratingEntrepreneursForm.indicators" :key="index">
            <a-row class="w-100" :gutter="14">
              <a-col :xl="24" class="mb-4">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="indicator-title">
                    <div class="order">{{ index + 1 }}</div>
                    <div class="title">
                      {{ indicator.indicatorName || '-' }}
                    </div>
                  </div>
                  <div class="indicator-actions">
                    <a-button class="p-0" size="large" :type="!indicator.checked ? 'dashed' : 'default'"
                      :class="{ 'checked-btn': indicator.checked }">
                      <a-checkbox v-model:checked="indicator.checked" @change="toggleIndicatorHandler(index)"
                        class="checkbox">
                        {{ t('evaluate') }}
                      </a-checkbox>
                    </a-button>
                  </div>
                </div>
              </a-col>
              <a-col :xl="8">
                <a-form-item class="upload-form-item" :name="['indicators', index, 'file']" :label="t('file')" :rules="{
                  required: indicator.checked,
                  message: t('requiredInput'),
                }">
                  <a-upload v-model:fileList="indicator.file" :before-upload="beforeUpload" :on-remove="() => { }"
                    name="file" :custom-request="dummyRequest" list-type="picture" accept=".pdf, .jpg, .jpeg, .docx"
                    :multiple="false" :disabled="!indicator.checked">
                    <div class="uploader" v-if="indicator.file.length === 0"
                      :class="{ 'upload-disabled': !indicator.checked }">
                      <h3 class="font-weight-500">
                        <IconUpload />&nbsp;{{ t('uploadFile') }}
                      </h3>
                      <p>{{ UPLOAD_VALIDATION_MESSAGE }}</p>
                    </div>
                    <template #removeIcon>
                      <IconTrash />
                    </template>
                  </a-upload>
                </a-form-item>
              </a-col>
              <a-col :xl="16">
                <a-form-item :name="['indicators', index, 'comment']" :label="t('comment')" :rules="{
                  required: indicator.checked,
                  message: t('requiredInput'),
                }">
                  <a-textarea v-model:value="indicator.comment" :placeholder="`${t('writeComment')}...`" :rows="3"
                    size="large" :disabled="!indicator.checked" />
                </a-form-item>
              </a-col>
              <!-- hidden inputs -->
              <a-col :xl="20">
                <a-form-item class="d-none" label="indicator" :name="['indicators', index, 'indicator']" :rules="{
                  required: true,
                  message: t('requiredInput'),
                }">
                  <a-input-number v-model:value="indicator.indicator" size="large" />
                </a-form-item>
              </a-col>
              <a-col :xl="20">
                <a-form-item class="d-none" label="score" :name="['indicators', index, 'newScore']" :rules="{
                  required: true,
                  message: t('requiredInput'),
                }">
                  <a-input-number v-model:value="indicator.newScore" size="large" />
                </a-form-item>
              </a-col>
              <!-- end hidden inputs -->
            </a-row>
          </div>
        </div>
      </div>
    </a-form>
  </Loader>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss';

.line-clamp {
  max-width: 300px; // Define width
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.finish-btn {
  background-color: var(--color-green);

  &:hover {
    background-color: var(--color-green);
  }
}

.score-info {
  font-size: 15px;

  span {
    color: var(--color-text);
    font-weight: 500;
  }
}

.indicators-head {
  padding: 8px 12px;
  margin-bottom: 16px;
  border-radius: 10px;
  background-color: var(--color-F7F7F7);
  color: var(--color-text2);
  display: flex;
  justify-content: space-between;

  div {
    &:first-child {
      display: flex;
      gap: 24px;
    }
  }
}

.upload-disabled {
  background: var(--color-F7F7F7);
  cursor: not-allowed;
  border: 1px solid var(--color-border);

  &:hover {
    border: 1px solid var(--color-border);
  }
}

.indicators-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 3rem;

  .indicator {
    display: flex;
    gap: 34px;
    border: 1px solid var(--color-border);
    padding: 16px 12px 8px 1rem;
    border-radius: 7px;

    .indicator-title {
      display: flex;
      align-items: center;
      gap: 1rem;

      .order {
        width: 30px !important;
        height: 30px !important;
        border-radius: 100%;
        background-color: var(--color-primary-bg);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .title {
        width: 85%;
      }
    }

    .indicator-actions {
      display: flex;
      gap: 12px;

      .checked-btn {
        background-color: var(--color-primary-bg);
      }

      .checkbox {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px 10px;
      }

      .done-btn {
        background-color: var(--color-green);
        border-color: var(--color-green);
        color: white;

        &:disabled {
          color: var(--color-green);
          background-color: var(--color-green-bg);
          border-color: var(--color-green-bg);
        }

        // &:hover {
        //   background-color: var(--color-green);
        //   border-color: var(--color-green);
        //   color: white;
        // }
      }
    }
  }
}
</style>
