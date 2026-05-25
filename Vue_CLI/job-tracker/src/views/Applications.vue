<template>
  <div class="applications-container">
    <a-flex vertical align="center">
      <h1>My Applications</h1>
      <a-button
        type="primary"
        @click="router.push('/applications/add')"
        class="add-application-btn"
      >
        + Add Application
      </a-button>
    </a-flex>

    <div class="filter-bar">
      <a-radio-group
        v-model:value="currentFilter"
        @change="(e) => setFilter(e.target.value)"
      >
        <a-radio-button value="All">All</a-radio-button>
        <a-radio-button value="applied">Applied</a-radio-button>
        <a-radio-button value="interview">Interview</a-radio-button>
        <a-radio-button value="offer">Offer</a-radio-button>
        <a-radio-button value="rejected">Rejected</a-radio-button>
      </a-radio-group>
    </div>

    <a-pagination
      class="pagination"
      :current="currentPage"
      :page-size="cardsPerPage"
      :total="locallyFilterApplications.length"
      :show-total="(total) => `Total ${total} items`"
      show-quick-jumper
      show-size-changer
      @change="handlePaginationChange"
      @showSizeChange="handlePaginationChange"
    >
      <template #itemRender="{ type, originalElement }">
        <a v-if="type == 'prev'">Previous</a>
        <a v-else-if="type == 'next'">Next</a>
        <component :is="originalElement" v-else></component>
      </template>
    </a-pagination>

    <div class="cards-container">
      <ApplicationCard
        v-for="application in paginatedApplications"
        :key="application.id"
        :application="application"
      />
    </div>
  </div>
</template>

<script setup>
import { useApplicationStore } from "@/stores/applications";
import { computed, onMounted } from "vue";
import ApplicationCard from "@/components/ApplicationCard.vue";
import { useRoute, useRouter } from "vue-router";

const applicationStore = useApplicationStore();
const route = useRoute();
const router = useRouter();
const currentFilter = computed(() => route.query.filter || "All");

onMounted(() => {
  applicationStore.fetchApplications();
});

const locallyFilterApplications = computed(() => {
  return currentFilter.value == "All"
    ? applicationStore.applications
    : applicationStore.applications.filter(
        (application) => application.status == currentFilter.value
      );
});

const cardsPerPage = computed(() => parseInt(route.query.perPage) || 10);

const currentPage = computed(() => parseInt(route.query.page) || 1);
const totalPages = computed(() =>
  Math.ceil(locallyFilterApplications.value.length / cardsPerPage.value)
);

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * cardsPerPage.value;
  const end = start + cardsPerPage.value;
  return locallyFilterApplications.value.slice(start, end);
});

function setFilter(filter) {
  router.replace({ query: { filter, page: 1 } });
}

function handlePaginationChange(page, pageSize) {
  router.replace({
    query: {
      ...route.query,
      page,
      perPage: pageSize,
    },
  });
}
</script>

<style scoped lang="scss">
.applications-container {
  padding: 20px;
  text-align: center;

  .filter-bar {
    margin: 20px;
  }

  .add-application-btn {
    margin: 10px;
    width: auto;
  }

  .cards-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
  }

  .pagination {
    margin: 20px;
  }
}
</style>