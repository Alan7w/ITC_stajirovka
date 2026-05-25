<template>
  <div class="application-details-card" v-if="application">
    {{ application }}
    <RouterLink :to="`/applications/${id}/edit`">Edit</RouterLink>
    <button @click="handleDelete">Delete</button>
    <!-- <RouterLink to="/applications">&leftarrow; Back</RouterLink> -->
    <button @click="() => router.go(-1)">Back</button>
  </div>
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