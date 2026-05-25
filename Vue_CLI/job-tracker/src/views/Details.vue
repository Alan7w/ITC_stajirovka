<template>
  <a-card v-if="application">
    {{ application }}
    <a-space size="middle">
      <a-button @click="router.push(`/applications/${application.id}/edit`)">
        Edit
      </a-button>
      <a-button danger @click="handleDelete"> Delete </a-button>
      <a-button type="primary" @click="router.push('/applications')">
        Back
      </a-button>
    </a-space>
  </a-card>
  <div v-else>Loading Application Details...</div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApplicationStore } from "@/stores/applications";

const applicationStore = useApplicationStore();

const route = useRoute();
const router = useRouter();

const id = route.params.id;
const application = ref(null);

onMounted(() => {
  fetch(`http://localhost:3000/applications/${id}`)
    .then((res) => res.json())
    .then((data) => (application.value = data))
    .catch((err) => console.log(err));
});

function handleDelete() {
  applicationStore.deleteApplication(id);
  router.push("/applications");
}
</script>

<style scoped lang="scss">
</style>