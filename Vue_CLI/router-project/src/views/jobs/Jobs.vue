<template>
  <h1>Jobs</h1>
  <div v-if="jobs">
    <div v-for="job in jobs" :key="job.id">
      <h2>
        <router-link :to="{ name: 'JobDetails', params: { id: job.id } }">{{
          job.title
        }}</router-link>
      </h2>
    </div>
  </div>

  <div v-else>
    <h3>Loading jobs...</h3>
  </div>
</template>

<script>
export default {
  data() {
    return {
      jobs: [],
    };
  },

  mounted() {
    fetch("http://localhost:3000/jobs")
      .then((res) => res.json())
      .then((data) => (this.jobs = data))
      .catch((err) => console.log(err.message));
  },
};
</script>

<style>
</style>