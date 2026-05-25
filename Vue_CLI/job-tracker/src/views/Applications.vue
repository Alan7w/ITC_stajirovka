<template>
  <div class="applications-container">
    <h1>My Applications</h1>
    <div class="filter-bar">
      <button
        @click="setFilter('All')"
        :class="{ active: currentFilter == 'All' }"
      >
        All
      </button>
      <button
        @click="setFilter('applied')"
        :class="{ active: currentFilter == 'applied' }"
      >
        Applied
      </button>
      <button
        @click="setFilter('interview')"
        :class="{ active: currentFilter == 'interview' }"
      >
        Interview
      </button>
      <button
        @click="setFilter('offer')"
        :class="{ active: currentFilter == 'offer' }"
      >
        Offer
      </button>
      <button
        @click="setFilter('rejected')"
        :class="{ active: currentFilter == 'rejected' }"
      >
        Rejected
      </button>
    </div>

    <button
      class="add-application-btn"
      @click="router.push('/applications/add')"
    >
      Add Application
    </button>

    <div class="cards-container">
      <ApplicationCard
        v-for="application in paginatedApplications"
        :key="application.id"
        :application="application"
      />
    </div>

    <div class="pagination">
      <button @click="setPage(currentPage - 1)" :disabled="currentPage == 1">
        &leftarrow; Prev
      </button>
      <input
        type="number"
        v-model="route.query.page"
        @input="(a) => setPage(parseInt(a.target.value))"
        :min="1"
        :max="totalPages"
      />Max: {{ totalPages }}
      <button
        @click="setPage(currentPage + 1)"
        :disabled="currentPage == totalPages"
      >
        Next &rightarrow;
      </button>
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

const cardsPerPage = 10;

const currentPage = computed(() => parseInt(route.query.page) || 1);
const totalPages = computed(() =>
  Math.ceil(locallyFilterApplications.value.length / cardsPerPage)
);

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  return locallyFilterApplications.value.slice(start, end);
});

function setFilter(filter) {
  router.replace({ query: { filter, page: 1 } });
}

function setPage(page) {
  console.log(page);
  router.replace({ query: { ...route.query, page } });
}
</script>

<style scoped lang="scss">
.applications-container {
  padding: 20px;
  text-align: center;

  .filter-bar {
    button {
      border: none;
      border-radius: 25px;
      margin: 2px 10px;
      padding: 10px;
      cursor: pointer;

      &.active {
        background-color: green;
      }
    }
  }

  .add-application-btn {
    padding: 20px;
    margin: 10px;
    border-radius: 10px;
    background-color: #02171f;
    cursor: pointer;
    color: white;
  }

  .cards-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
  }
}
</style>