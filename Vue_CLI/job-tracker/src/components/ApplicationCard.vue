<template>
  <div class="application-card">
    <h2 class="company-title">{{ application.company }}</h2>
    <p class="role"><strong>Role: </strong>{{ application.role }}</p>
    <p class="location">
      <strong>Location: </strong>{{ application.location }}
    </p>
    <span class="status">
      <strong>Status: </strong>{{ application.status }}
    </span>
    <p class="applied-date">
      <strong>Data Applied: </strong>{{ application.appliedDate }}
    </p>

    <RouterLink :to="`applications/${application.id}/edit`">Edit</RouterLink>
    <RouterLink :to="{ name: 'Details', params: { id: application.id } }"
      >Details</RouterLink
    >
    <button
      class="delete-btn"
      @click="applicationStore.deleteApplication(application.id)"
    >
      Delete
    </button>
  </div>
</template>

<script setup>
import { useApplicationStore } from "@/stores/applications";

const applicationStore = useApplicationStore();
const props = defineProps({
  application: Object,
});
</script>

<style scoped lang="scss">
.application-card {
  background-color: #eee;
  border-radius: 10px;
  width: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  a,
  .delete-btn {
    background-color: #02171f;
    color: white;
    border-radius: 8px;
    margin: 0 5px;
    padding: 7px;
    cursor: pointer;
  }
}
</style>