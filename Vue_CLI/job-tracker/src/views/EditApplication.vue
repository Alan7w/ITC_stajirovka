<template>
  <ApplicationForm
    v-if="application"
    :initialData="application"
    :submitSuccessMessage="'Changes saved successfully'"
    @submit="editApplication"
    :submitBtnText="'Save changes'"
    :cancelMessage="'Application not changed'"
  />
  <p v-else>Loading...</p>
</template>

<script setup>
import ApplicationForm from "@/components/ApplicationForm.vue";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApplicationStore } from "@/stores/applications";

const applicationStore = useApplicationStore();

const application = ref(null);
const route = useRoute();
const router = useRouter();
const id = route.params.id;

onMounted(() => {
  fetch(`http://localhost:3000/applications/${id}`)
    .then((res) => res.json())
    .then((data) => (application.value = data))
    .catch((err) => console.log(err));
});

async function editApplication(formData) {
  await applicationStore.updateApplication(id, formData);
  router.replace(`/applications/${id}`);
}
</script>

<style scoped lang="scss">
</style>