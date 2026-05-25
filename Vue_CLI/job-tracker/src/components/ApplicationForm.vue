<template>
  <div class="form-container">
    <form @submit.prevent="handleSubmit">
      <label for="company-name-ipnut">Company name: </label>
      <input type="text" id="company-name-input" v-model="company" required />

      <label for="role-input">Role: </label>
      <input type="text" id="role-input" v-model="role" required />

      <label for="location-input">Location: </label>
      <input type="text" id="location-input" v-model="location" required />

      <label for="status-input">Status: </label>
      <select v-model="status" id="status-input" required>
        <option value="applied">Applied</option>
        <option value="interview">Interview</option>
        <option value="offer">Offer</option>
        <option value="rejected">Rejected</option>
      </select>

      <label for="applied-date-input">Applied date: </label>
      <input
        type="date"
        id="applied-date-input"
        v-model="appliedDate"
        required
      />

      <label for="notes-input">Notes: </label>
      <textarea id="notes-input" v-model="notes" required></textarea>

      <label for="url-input">URL: </label>
      <input type="text" v-model="url" required />

      <button type="submit">Submit</button>
      <button @click="router.push('/applications')">Cancel</button>
    </form>
  </div>
</template>

<script setup>
import router from "@/router";
import { ref } from "vue";

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
});

const emit = defineEmits(["submit"]);

const company = ref(props.initialData.company);
const role = ref(props.initialData.role);
const location = ref(props.initialData.location);
const status = ref(props.initialData.status);
const appliedDate = ref(props.initialData.appliedDate);
const notes = ref(props.initialData.notes);
const url = ref(props.initialData.url);

function handleSubmit() {
  emit("submit", {
    company: company.value,
    role: role.value,
    location: location.value,
    status: status.value,
    appliedDate: appliedDate.value,
    notes: notes.value,
    url: url.value,
  });
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
    gap: 10px;
    min-width: 450px;
    background-color: #eee;
    padding: 30px;
    border-radius: 20px;

    input {
      border-radius: 5px 5px 0 0;
      padding: 8px 10px;

      &:focus {
        outline: none;
      }
    }

    input[type="text"] {
      border: none;
      border-bottom: 1px solid black;
    }

    select {
      border: none;
      border-radius: 7px;
      padding: 10px;
      cursor: pointer;

      &:focus {
        outline: none;
      }
    }

    textarea {
      border-radius: 7px;
      border: none;
      padding: 10px;

      &:focus {
        outline: none;
      }
    }
  }
}
</style>