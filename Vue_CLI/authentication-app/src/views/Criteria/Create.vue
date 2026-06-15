<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Upload } from 'ant-design-vue'

import { useCriteriaStore } from '@/stores/criteria'
import Loader from '@/components/Loader.vue'
import DocHead from '@/components/DocHead.vue'
import IconArrow from '@/components/icons/IconArrow.vue'
import IconCriteria from '@/components/icons/IconCriteria.vue'
import IconMinus from '@/components/icons/IconMinus.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import IconTrash from '@/components/icons/IconTrash.vue'
import IconUpload from '@/components/icons/IconUpload.vue'
import IconCirclePlus from '@/components/icons/IconCirclePlus.vue'
import IconAlert from '@/components/icons/IconAlert.vue'

interface Indicators {
  name: string
  score: number | null
  comment: string
  link: string
  file: []
}

const router = useRouter()
const { t } = useI18n()
const criteriaStore = useCriteriaStore()

const DEFAULT_INDICATOR_VALUES: Indicators = {
  name: '',
  comment: '',
  score: 10,
  link: 'https://',
  file: [],
}

const loading = ref(false)

const createCriterionForm = reactive<{ name: string; indicators: Indicators[] }>({
  name: '',
  indicators: [
    {
      ...DEFAULT_INDICATOR_VALUES,
    },
  ],
})

// const createCriterionForm = reactive({
//   name: '',
//   indicators: [
//     {
//       name: '',
//       comment: '',
//       score: null,
//       link: '',
//       file: [],
//     },
//   ],
// })

const convertToFormData = (data) => {
  const formData = new FormData()

  formData.append('name', data.name)

  data.indicators.forEach((indicator, index) => {
    formData.append(`indicators[${index}].name`, indicator.name)
    formData.append(`indicators[${index}].score`, indicator.score)
    formData.append(`indicators[${index}].comment`, indicator.comment)
    formData.append(`indicators[${index}].link`, indicator.link)

    // If file is an array of File objects
    if (indicator.file && indicator.file.length > 0) {
      indicator.file.forEach((file, fileIndex) => {
        const realFile = file.originFileObj || file
        formData.append(`indicators[${index}].file`, realFile)
      })
    }
  })

  return formData
}

const onFinish = async (values: any) => {
  // console.log('Received values of form:', values)
  // for (const [key, value] of formData.entries()) {
  //   console.log(`${key}:`, value)
  // }
  const formData = convertToFormData(values)
  loading.value = true
  await criteriaStore.createCriterion(formData)
  loading.value = false
}

const addIndicator = () => {
  createCriterionForm.indicators.push({ ...DEFAULT_INDICATOR_VALUES })
}

const handleRemove = () => {
  // console.log('remove')
}

const dummyRequest = ({ onSuccess }: any) => {
  setTimeout(() => {
    onSuccess('ok')
  }, 1000)
}

// const customIconRender = ({ file, actions }) => {
//   return h(
//     'a',
//     {
//       style: 'margin-left: 8px;',
//       onClick: (e) => {
//         e.preventDefault()
//         actions.remove()
//       },
//       title: 'Delete this file' // ✅ Custom title/tooltip here
//     },
//     [h(IconTrash)]
//   )
// }

const UPLOAD_VALIDATION_MESSAGE = `${t('maxSize')}: 3MB. ${t('allowedFormats')}: .jpg, .pdf, .docx`

const beforeUpload = (file) => {
  const isLt3MB = file.size / 1024 / 1024 < 3 // 3MB

  if (!isLt3MB) {
    alert(UPLOAD_VALIDATION_MESSAGE)
    return Upload.LIST_IGNORE
  }

  return true
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
        <a-breadcrumb class="breadcrumb">
          <template #separator>
            <IconArrow class="arrow" />
          </template>
          <a-breadcrumb-item href="/criteria" @click="router.push({ name: 'criteria' })">
            <IconCriteria />&nbsp;{{ t('criteria') }}
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ t('createCriterion') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </template>
    </DocHead>
    <div class="container mt-4">
      <div>
        <h3 class="font-weight-500 mb-1">{{ t('createNewCriterion') }}</h3>
        <p style="color: var(--color-text2)">{{ t('createNewCriterionByFilling') }}</p>
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
            :maxlength="200"
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
            <a-col :xl="18" :lg="15" :md="12" :sm="24">
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
            <a-col :xl="6" :lg="9" :md="12" :sm="24">
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
                <a-button class="delete-btn" size="large" @click="deleteIndicator(index)"
                  ><IconTrash
                /></a-button>
              </div>
            </a-col>
            <a-col :xl="8" :lg="12" :md="12" :sm="24">
              <a-form-item
                class="upload-form-item"
                :name="['indicators', index, 'file']"
                :label="t('file')"
              >
                <a-upload
                  v-model:fileList="indicator.file"
                  :before-upload="beforeUpload"
                  :on-remove="handleRemove"
                  name="file"
                  :custom-request="dummyRequest"
                  list-type="picture"
                  accept=".pdf, .jpg, .jpeg, .docx"
                  :multiple="false"
                >
                  <div class="uploader" v-if="indicator.file.length === 0">
                    <h3 class="font-weight-500"><IconUpload />&nbsp;{{ t('uploadFile') }}</h3>
                    <p>{{ UPLOAD_VALIDATION_MESSAGE }}</p>
                  </div>
                  <template #removeIcon>
                    <IconTrash />
                  </template>
                </a-upload>
              </a-form-item>
            </a-col>
            <a-col :xl="16" :lg="12" :md="12" :sm="24">
              <a-form-item
                :name="['indicators', index, 'comment']"
                :label="t('comment')"
                :rules="{
                  required: true,
                  message: t('requiredInput'),
                }"
              >
                <a-textarea
                  v-model:value="indicator.comment"
                  :placeholder="`${t('writeComment')}...`"
                  :rows="3"
                  size="large"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item :name="['indicators', index, 'link']" :label="t('link')">
                <a-input v-model:value="indicator.link" :placeholder="t('link')" size="large" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-button size="large" class="add-indicator-btn" @click="addIndicator">
            <IconCirclePlus />
            <span class="font-weight-500">{{ t('addIndicator') }}</span>
          </a-button>
        </div>

        <a-form-item>
          <div class="footer">
            <div class="alert" :class="{ hidden: indicatorScoreValid }">
              <IconAlert />
              <span>{{ t('indicatorAlertMsg') }}</span>
            </div>
            <div class="d-flex gap-3">
              <a-button size="large" @click="router.push({ name: 'criteria' })">
                {{ t('cancel') }}
              </a-button>
              <a-button size="large" html-type="submit" :disabled="!indicatorScoreValid">{{
                t('save')
              }}</a-button>
            </div>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </Loader>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss';
@use '@/assets/styles/mixins.scss' as *;
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

  // .upload-form-item {
  //   :deep(.ant-upload-list-item-container) {
  //     transition: unset;
  //   }

  //   :deep(.ant-motion-collapse) {
  //     transition: unset !important;
  //   }

  //   .uploader {
  //     position: absolute;
  //     top: 0;
  //     width: 100%;
  //     height: 91px;
  //     border: 1px solid var(--color-border);
  //     border-radius: 8px;
  //     padding: 17px;
  //     display: flex;
  //     justify-content: center;
  //     flex-direction: column;
  //     align-items: center;
  //     cursor: pointer;
  //     transition: all 0.2s;

  //     &:hover {
  //       border-color: var(--color-primary);
  //     }

  //     p {
  //       color: var(--color-text2);
  //     }
  //   }
  // }

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

  @include lg {
    flex-direction: column;
    gap: 1rem;
  }

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
