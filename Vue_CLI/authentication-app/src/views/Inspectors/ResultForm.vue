<script setup lang="ts">
import IconCloudDownload from '@/components/icons/IconCloudDownload.vue'
import { useCriteriaStore } from '@/stores/criteria'
import { useEntrepreneursStore } from '@/stores/entrepreneurs'
import { useInspectorStore } from '@/stores/inspector'
import { useUserStore } from '@/stores/user'
import { Upload } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const companyStore = useEntrepreneursStore()
const indicatorStore = useCriteriaStore()
const inspectorStore = useInspectorStore()
const userStore = useUserStore()
const { companyDetails } = storeToRefs(companyStore)
const { indicatorsList } = storeToRefs(indicatorStore)
const { regularDocumentsData, singleInspector, inpectorLoading } = storeToRefs(inspectorStore)
const { usersList } = storeToRefs(userStore)
const resultForm = ref({
  company_license: [],
  indicators: null,
  check_start_date: null,
  check_end_date: null,
  inspector_users: [],
  regular_documents: [],
  description: null,
  check_document: [],
  impact_measures: null,
  impact_measures_document: [],
  impact_measure_result: null,
  impact_measure_result_doc: [],
  reject_measures: null,
  reject_measures_document: [],
  inspection_message: [],
})

const rules = {
  company_license: [
    {
      required: true,
      message: t('requiredInput'),
    },
  ],
  indicators: [
    {
      required: true,
      message: t('requiredInput'),
    },
  ],
  check_start_date: [
    {
      required: true,
      message: t('requiredInput'),
    },
  ],
  check_end_date: [
    {
      required: true,
      message: t('requiredInput'),
    },
  ],
  inspector_users: [
    {
      required: true,
      message: t('requiredInput'),
    },
  ],
  regular_documents: [
    {
      required: false,
      message: t('requiredInput'),
    },
  ],
  description: [
    {
      required: true,
      message: t('requiredInput'),
    },
  ],
  check_document: [
    {
      required: true,
      message: t('requiredInput'),
    },
  ],
  impact_measures_document: [
    {
      required: true,
      message: t('requiredInput'),
    },
  ],
  impact_measures: [
    {
      required: true,
      message: t('requiredInput'),
    },
  ],
  impact_measure_result_doc: [
    {
      required: true,
      message: t('requiredInput'),
    },
  ],
  impact_measure_result: [
    {
      required: true,
      message: t('requiredInput'),
    },
  ],
  reject_measures: [
    {
      required: true,
      message: t('requiredInput'),
    },
  ],
  reject_measures_document: [
    {
      required: true,
      message: t('requiredInput'),
    },
  ],
  inspection_message: [
    {
      required: true,
      message: t('requiredInput'),
    },
  ],
}
// upload file
const UPLOAD_VALIDATION_MESSAGE = `${t('maxSize')}: 3MB. ${t('allowedFormats')}: .jpg, .pdf, .docx`

const beforeUpload = (file) => {
  const isLt3MB = file.size / 1024 / 1024 < 3 // 3MB

  if (!isLt3MB) {
    alert(UPLOAD_VALIDATION_MESSAGE)
    return Upload.LIST_IGNORE
  }

  return true
}

const dummyRequest = ({ onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok')
  }, 1000)
}

const handleRemove = () => {
  // console.log('remove')
}

const handleCancelSubmit = () => {
  router.go(-1)
}

const convertToFormData = (data) => {
  const formData = new FormData()
  console.log(data)
  for (const key in data) {
    const value = data[key]

    if (Array.isArray(value)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      data[key][0].originFileObj
        ? formData.append(`${key}`, data[key][0].originFileObj)
        : formData.append(`${key}`, JSON.stringify(data[key]))
    } else if (value !== null && value !== undefined) {
      formData.append(key, value)
    }
  }

  formData.append('inspector', singleInspector.value.id.toString())

  return formData
}

const handleFinishSubmit = async () => {
  const data = convertToFormData(resultForm.value)

  inspectorStore.createInspectionResult(data, () => {
    inspectorStore.getInspector(route.params.id)
  })
}

onMounted(() => {
  companyStore.getCompanyDetails(route.params.id)
  indicatorStore.getIndicatorsList()
  inspectorStore.getInspectorsList()
  inspectorStore.getRegularDocuments()
  userStore.getUsers()
})
</script>
<template>
  <a-form
    :model="resultForm"
    layout="vertical"
    name="resultForm"
    :rules="rules"
    @finish="handleFinishSubmit"
  >
    <a-card>
      <a-row :gutter="[16, 16]">
        <a-col :span="12">
          <a-form-item name="company_license" :label="t('selectBranch')">
            <a-select
              v-model:value="resultForm.company_license"
              mode="multiple"
              :field-names="{ label: 'register_number', value: 'id' }"
              :options="companyDetails.results"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="indicators" :label="t('selectIndicator')">
            <a-select
              v-model:value="resultForm.indicators"
              :options="indicatorsList.results"
              :field-names="{ label: 'name', value: 'id' }"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item name="check_start_date" :label="t('realCheckStartDate')">
            <a-date-picker
              v-model:value="resultForm.check_start_date"
              placeholder="DD / MM / YYYY"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item name="check_end_date" :label="t('realCheckEndDate')">
            <a-date-picker
              v-model:value="resultForm.check_end_date"
              placeholder="DD / MM / YYYY"
              type="date"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12"></a-col>
        <a-col :span="12">
          <a-form-item name="inspector_users" :label="t('realInspectorUsers')">
            <a-select
              v-model:value="resultForm.inspector_users"
              mode="multiple"
              :field-names="{ label: 'full_name', value: 'user_id' }"
              :options="usersList.results"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="regular_documents" :label="t('regularDocuments')">
            <a-select
              v-model:value="resultForm.regular_documents"
              mode="multiple"
              :field-names="{ label: 'name_uz', value: 'id' }"
              :options="regularDocumentsData"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="description" :label="t('comment')">
            <a-textarea
              v-model:value="resultForm.description"
              show-count
              :placeholder="`${t('writeHere')}...`"
              :maxlength="200"
              :rows="3"
              size="large"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            class="upload-form-item"
            name="check_document"
            :label="t('inspectionReport')"
          >
            <a-upload
              v-model:fileList="resultForm.check_document"
              :before-upload="beforeUpload"
              :on-remove="handleRemove"
              name="file"
              :custom-request="dummyRequest"
              list-type="picture"
              accept=".pdf, .jpg, .jpeg, .docx"
              :multiple="false"
            >
              <div class="uploader-body" v-if="resultForm.check_document.length === 0">
                <div class="text-muted placeholder">
                  {{ t('uploadTheFile') }}
                </div>
                <div class="suffix text-muted">
                  <IconCloudDownload />
                  {{ t('uploadTheFile') }}
                </div>
              </div>
              <template #removeIcon>
                <IconTrash />
              </template>
            </a-upload>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="impact_measures" :label="t('impactMeasures')">
            <a-textarea
              v-model:value="resultForm.impact_measures"
              show-count
              :placeholder="`${t('writeHere')}...`"
              :maxlength="200"
              :rows="3"
              size="large"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            class="upload-form-item"
            name="impact_measures_document"
            :label="t('impactMeasures') + ' (' + t('file').toLowerCase() + ')'"
          >
            <a-upload
              v-model:fileList="resultForm.impact_measures_document"
              :before-upload="beforeUpload"
              :on-remove="handleRemove"
              name="file"
              :custom-request="dummyRequest"
              list-type="picture"
              accept=".pdf, .jpg, .jpeg, .docx"
              :multiple="false"
            >
              <div class="uploader-body" v-if="resultForm.impact_measures_document.length === 0">
                <div class="text-muted placeholder">
                  {{ t('uploadTheFile') }}
                </div>
                <div class="suffix text-muted">
                  <IconCloudDownload />
                  {{ t('uploadTheFile') }}
                </div>
              </div>
              <template #removeIcon>
                <IconTrash />
              </template>
            </a-upload>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="impact_measure_result" :label="t('impactMeasuresResult')">
            <a-textarea
              v-model:value="resultForm.impact_measure_result"
              show-count
              :placeholder="`${t('writeHere')}...`"
              :maxlength="200"
              :rows="3"
              size="large"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            class="upload-form-item"
            name="impact_measure_result_doc"
            :label="t('impactMeasuresResult') + ' (' + t('file').toLowerCase() + ')'"
          >
            <a-upload
              v-model:fileList="resultForm.impact_measure_result_doc"
              :before-upload="beforeUpload"
              :on-remove="handleRemove"
              name="file"
              :custom-request="dummyRequest"
              list-type="picture"
              accept=".pdf, .jpg, .jpeg, .docx"
              :multiple="false"
            >
              <div class="uploader-body" v-if="resultForm.impact_measure_result_doc.length === 0">
                <div class="text-muted placeholder">
                  {{ t('uploadTheFile') }}
                </div>
                <div class="suffix text-muted">
                  <IconCloudDownload />
                  {{ t('uploadTheFile') }}
                </div>
              </div>
              <template #removeIcon>
                <IconTrash />
              </template>
            </a-upload>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="reject_measures" :label="t('rejectMeasures')">
            <a-textarea
              v-model:value="resultForm.reject_measures"
              show-count
              :placeholder="`${t('writeHere')}...`"
              :maxlength="200"
              :rows="3"
              size="large"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            class="upload-form-item"
            name="reject_measures_document"
            :label="t('rejectMeasures') + ' (' + t('file').toLowerCase() + ')'"
          >
            <a-upload
              v-model:fileList="resultForm.reject_measures_document"
              :before-upload="beforeUpload"
              :on-remove="handleRemove"
              name="file"
              :custom-request="dummyRequest"
              list-type="picture"
              accept=".pdf, .jpg, .jpeg, .docx"
              :multiple="false"
            >
              <div class="uploader-body" v-if="resultForm.reject_measures_document.length === 0">
                <div class="text-muted placeholder">
                  {{ t('uploadTheFile') }}
                </div>
                <div class="suffix text-muted">
                  <IconCloudDownload />
                  {{ t('uploadTheFile') }}
                </div>
              </div>
              <template #removeIcon>
                <IconTrash />
              </template>
            </a-upload>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            class="upload-form-item"
            name="inspection_message"
            :label="t('inspectionMessage')"
          >
            <a-upload
              v-model:fileList="resultForm.inspection_message"
              :before-upload="beforeUpload"
              :on-remove="handleRemove"
              name="file"
              :custom-request="dummyRequest"
              list-type="picture"
              accept=".pdf, .jpg, .jpeg, .docx"
              :multiple="false"
            >
              <div class="uploader-body" v-if="resultForm.inspection_message.length === 0">
                <div class="text-muted placeholder">
                  {{ t('uploadTheFile') }}
                </div>
                <div class="suffix text-muted">
                  <IconCloudDownload />
                  {{ t('uploadTheFile') }}
                </div>
              </div>
              <template #removeIcon>
                <IconTrash />
              </template>
            </a-upload>
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
    <a-divider />
    <a-form-item>
      <div class="d-flex justify-content-end btns gap-3">
        <a-button size="large" style="width: 128px" @click="handleCancelSubmit">
          {{ t('cancel') }}
        </a-button>
        <a-button
          size="large"
          style="width: 128px"
          :loading="inpectorLoading"
          type="primary"
          html-type="submit"
        >
          {{ t('save') }}
        </a-button>
      </div>
    </a-form-item>
  </a-form>
</template>
<style scoped lang="scss">
.uploader-body {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 384px;
  height: 50px;
  padding: 1px;
  gap: 1px;
  background-color: var(--color-border);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  .placeholder {
    background-color: var(--color-white);
    width: 60%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: start;
    padding-left: 1rem;
    border-radius: 9px 0 0 9px;
  }
  .suffix {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 40%;
    height: 100%;
    background-color: var(--color-F7F7F7);
    border-radius: 0 9px 9px 0;
    font-weight: 500;
  }
}
</style>
