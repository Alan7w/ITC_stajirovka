<template>
  <a-card hoverable :title="application.company">
    <template #extra>
      <a-tag :color="setStatusColor(application.status)">{{
        application.status
      }}</a-tag>
    </template>

    <p class="location">
      <strong>Location: </strong>{{ application.location }}
    </p>

    <p class="applied-date">
      <strong>Date Applied: </strong>{{ application.appliedDate }}
    </p>

    <a-space size="middle">
      <a-button @click="router.push(`/applications/${application.id}/edit`)">
        Edit
      </a-button>
      <a-button
        type="primary"
        @click="router.push(`/applications/${application.id}`)"
      >
        Details
      </a-button>
      <a-button
        danger
        @click="applicationStore.deleteApplication(application.id)"
      >
        Delete
      </a-button>
    </a-space>
  </a-card>
</template>

<script setup>
import router from "@/router";
import { useApplicationStore } from "@/stores/applications";

const applicationStore = useApplicationStore();
const props = defineProps({
  application: Object,
});

function setStatusColor(status) {
  const colorMap = {
    applied: "blue",
    interview: "orange",
    offer: "green",
    rejected: "red",
  };
  return colorMap[status] || "default";
}
</script>

<style scoped lang="scss">
.application-card {
  background-color: #eee;
  // border-radius: 10px;
  // width: auto;
  // padding: 20px;
  // display: flex;
  // flex-direction: column;
  // gap: 10px;

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