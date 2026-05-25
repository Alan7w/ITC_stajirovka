<template>
  <div class="home-page-container">
    <h1>Job Application Tracker</h1>
    <p>
      This app helps you track your applications. Cannot remember how many and
      what jobs you applied? Job Tracker got your back
    </p>

    <div class="stats">
      <div class="card">
        <h3>Total Applied</h3>
        <span>{{ applicationStore.totalCount }}</span>
      </div>

      <div class="card">
        <h3>Total number of Interviews signed up for</h3>
        <span>{{ applicationStore.interviewCount }}</span>
      </div>

      <div class="card">
        <h3>Total Offers</h3>
        <span>{{ applicationStore.offerCount }}</span>
      </div>

      <div class="card">
        <h3>Total Rejected</h3>
        <span>{{ applicationStore.rejectCount }}</span>
      </div>
    </div>

    <RouterLink class="view-applications-btn" to="/applications">
      View My Applications
    </RouterLink>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useApplicationStore } from "@/stores/applications";
import { useRouter } from "vue-router";
const applicationStore = useApplicationStore();
const router = useRouter();

onMounted(() => {
  applicationStore.fetchApplications();
});
</script>

<style scoped lang="scss">
.home-page-container {
  text-align: center;
  h1 {
    padding: 10px;
  }

  p {
    padding: 8px;
  }

  .stats {
    display: flex;
    justify-content: space-around;
    align-content: center;
    flex-wrap: wrap;
    gap: 20px;

    .card {
      background-color: #eee;
      border-radius: 10px;
      padding: 20px;
      margin: 10px;
      width: 250px;
      height: 90px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  .view-applications-btn {
    text-align: center;
  }
}
</style>