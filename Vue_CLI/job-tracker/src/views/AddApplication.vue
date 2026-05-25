<template>
  <h1 class="add-new-app-header">App a New Application</h1>
  <ApplicationForm @submit="submitNewApplication" />
</template>

<script setup>
import router from "@/router";
import { useApplicationStore } from "@/stores/applications";
import ApplicationForm from "@/components/ApplicationForm.vue";

const applicationStore = useApplicationStore();

function submitNewApplication(formData) {
  applicationStore.addApplication(formData);
  router.push("/applications");
}
</script>

<style scoped lang="scss">
.add-new-app-header {
  text-align: center;
}
</style>