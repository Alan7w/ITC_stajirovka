<template>
  <div class="form-container">
    <a-form
      @finish="handleSubmit"
      :model="formState"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 20 }"
    >
      <a-form-item
        label="Company"
        name="company"
        :rules="[
          { required: true, message: 'Please fill in the company name!' },
        ]"
      >
        <a-input
          v-model:value="formState.company"
          placeholder="e.g. Google"
        ></a-input>
      </a-form-item>

      <a-form-item
        label="Role"
        name="role"
        :rules="[{ required: true, message: 'Please fill in the role!' }]"
      >
        <a-input
          v-model:value="formState.role"
          placeholder="e.g. FrontEnd Developer"
        ></a-input>
      </a-form-item>

      <a-form-item
        label="Location"
        name="location"
        :rules="[{ required: true, message: 'Please fill in the location!' }]"
      >
        <a-input
          v-model:value="formState.location"
          placeholder="e.g. Las Vegas"
        ></a-input>
      </a-form-item>

      <a-form-item
        label="Status"
        name="status"
        :rules="[{ required: true, message: 'Please select a status' }]"
      >
        <a-select v-model:value="formState.status">
          <a-select-option value="applied">Applied</a-select-option>
          <a-select-option value="interview">Interview</a-select-option>
          <a-select-option value="offer">Offer</a-select-option>
          <a-select-option value="rejected">Rejected</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="Applied date"
        name="appliedDate"
        :rules="[{ required: true, message: 'Please select a date!' }]"
      >
        <a-date-picker
          v-model:value="formState.appliedDate"
          value-format="YYYY-MM-DD"
          format="DD-MM-YYYY"
        />
      </a-form-item>

      <a-form-item label="Notes" name="notes">
        <a-textarea
          v-model:value="formState.notes"
          placeholder="e.g. Bring paper version of the resume"
        />
      </a-form-item>

      <a-form-item
        label="URL"
        name="url"
        :rules="[
          { required: true, message: 'Please fill in the URL!', type: 'url' },
        ]"
      >
        <a-input
          v-model:value="formState.url"
          placeholder="e.g. www.google.com"
        ></a-input>
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8 }">
        <a-space size="large">
          <a-form-item>
            <a-button type="primary" html-type="submit">
              {{ submitBtnText }}
            </a-button>
          </a-form-item>

          <a-form-item>
            <a-button @click="emit('cancel')">Cancel</a-button>
          </a-form-item>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { message } from "ant-design-vue";
import { reactive } from "vue";

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({
      company: "",
      role: "",
      location: "",
      status: "",
      appliedDate: "",
      notes: "",
      url: "",
    }),
  },
  submitSuccessMessage: {
    type: String,
    default: "Form submitted",
  },
  submitBtnText: {
    type: String,
    default: "Submit",
  },
  cancelMessage: {
    type: String,
    default: "Submission cancelled",
  },
});

const formState = reactive({
  company: props.initialData.company,
  role: props.initialData.role,
  location: props.initialData.location,
  status: props.initialData.status,
  appliedDate: props.initialData.appliedDate,
  notes: props.initialData.notes,
  url: props.initialData.url,
});

const emit = defineEmits(["submit"]);

function handleSubmit() {
  message.success(props.submitSuccessMessage);
  emit("submit", { ...formState });
}
</script>

<style scoped lang="scss">
.form-container {
  display: flex;
  justify-content: center;
  padding: 40px 0;

  form {
    display: flex;
    flex-direction: column;
    // gap: 10px;
    min-width: 500px;
    background-color: #eee;
    padding: 30px;
    border-radius: 20px;

    // input {
    //   border-radius: 5px 5px 0 0;
    //   padding: 8px 10px;

    //   &:focus {
    //     outline: none;
    //   }
    // }

    // input[type="text"] {
    //   border: none;
    //   border-bottom: 1px solid black;
    // }

    // select {
    //   border: none;
    //   border-radius: 7px;
    //   padding: 10px;
    //   cursor: pointer;

    //   &:focus {
    //     outline: none;
    //   }
    // }

    // textarea {
    //   border-radius: 7px;
    //   border: none;
    //   padding: 10px;

    //   &:focus {
    //     outline: none;
    //   }
    // }
  }
}
</style>