<template>
  <!-- <div class="applications-container">
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
      :page-size-options="[
        '5',
        '10',
        '15',
        '20',
        '25',
        '30',
        '35',
        '40',
        '45',
        '50',
      ]"
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
  </div> -->

  <div class="applications-table-container">
    <a-table
      :dataSource="applicationStore.applications"
      :columns="columns"
      :scroll="{ x: 1500, y: 600 }"
      :row-key="(record) => record.id"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template #title>
        <a-flex align="center" justify="space-around">
          <h1>My Applications</h1>
          <a-button type="primary" @click="openAddDrawer">
            + Add Application
          </a-button>
        </a-flex>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key == 'status'">
          <a-tag :color="getStatusColor(record.status)">
            {{ record.status }}
          </a-tag>
        </template>

        <template v-if="column.key == 'actions'">
          <a-space size="middle">
            <a-button @click="openEditDrawer(record)" size="small">
              Edit
            </a-button>

            <a-button
              type="primary"
              size="small"
              @click="router.push(`/applications/${record.id}`)"
            >
              Details
            </a-button>

            <a-popconfirm
              title="Proceed to delete this application?"
              @confirm="handleDeleteConfirm(record.id)"
            >
              <a-button danger size="small">Delete</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>

      <!-- <template #footer>Footer</template> -->
    </a-table>
  </div>
</template>

<script setup>
import { useApplicationStore } from "@/stores/applications";
import { computed, onMounted, reactive, ref } from "vue";
// import ApplicationCard from "@/components/ApplicationCard.vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { userDrawer } from "../composables/useDrawer";

const { openAddDrawer, openEditDrawer } = userDrawer();

const applicationStore = useApplicationStore();
const route = useRoute();
const router = useRouter();
const currentFilter = computed(() => route.query.filter || "All");
const statusFilter = computed(() =>
  route.query.status ? [route.query.status] : null
);

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

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * cardsPerPage.value;
  const end = start + cardsPerPage.value;
  return locallyFilterApplications.value.slice(start, end);
});

const columns = computed(() => [
  {
    title: "Company",
    dataIndex: "company",
    key: "company",
    fixed: "left",
    sorter: {
      compare: (a, b) => a.company.localeCompare(b.company),
      multiple: 3,
    },
    sortDirections: ["ascend", "descend"],
  },

  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    sorter: {
      compare: (a, b) => a.role.localeCompare(b.role),
      multiple: 2,
    },
    sortDirections: ["ascend", "descend"],
  },

  {
    title: "Location",
    dataIndex: "location",
    key: "location",
  },

  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    filters: [
      { text: "Applied", value: "applied" },
      { text: "Interview", value: "interview" },
      { text: "Offer", value: "offer" },
      { text: "Rejected", value: "rejected" },
    ],
    onFilter: (value, record) => record.status == value,
    filteredValue: statusFilter.value,
  },

  {
    title: "Date Applied",
    dataIndex: "appliedDate",
    key: "appliedDate",
    sorter: {
      compare: (a, b) => a.appliedDate.localeCompare(b.appliedDate),
      multiple: 1,
    },
    sortDirections: ["ascend", "descend"],
  },

  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    fixed: "right",
  },
]);

const pagination = reactive({
  pageSize: 5,
  pageSizeOptions: ["5", "10", "15", "20", "25", "30", "35", "40", "45", "50"],
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `Total ${total} items`,
  position: ["bottomCenter"],
});

const handleDeleteConfirm = (id) => {
  applicationStore.deleteApplication(id);
  message.success("Application deleted successfully");
};

function getStatusColor(status) {
  const colorMap = {
    applied: "blue",
    interview: "orange",
    offer: "green",
    rejected: "red",
  };
  return colorMap[status] || "default";
}

function handleTableChange(page) {
  pagination.pageSize = page.pageSize;
}

const open = ref(false);
const showDrawer = () => {
  open.value = true;
};
const onClose = () => {
  open.value = false;
};

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

.applications-table-container {
  padding: 0 40px;
  margin: 30px;
  border-radius: 20px;
  background-color: #eee;
}
</style>