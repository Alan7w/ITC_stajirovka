<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import router from "./router";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  AppstoreOutlined,
  FilterOutlined,
} from "@ant-design/icons-vue";
import { userDrawer } from "./composables/useDrawer";
import ApplicationForm from "./components/ApplicationForm.vue";
import { useApplicationStore } from "./stores/applications";

const applicationStore = useApplicationStore();

const {
  closeDrawer,
  openAddDrawer,
  openEditDrawer,
  drawerOpen,
  drawerMode,
  currentEditingApplication,
} = userDrawer();

const route = useRoute();

const collapsed = ref(false);
const selectedKeys = computed(() => {
  if (route.query.status) {
    return [`/applications?status=${route.query.status}`];
  }
  return [route.path];
});

function toggleCollapsed() {
  collapsed.value = !collapsed.value;
}

function handleMenuClick({ key }) {
  router.push(key);
}

async function handleDrawerSubmit(formData) {
  if (drawerMode.value == "add") {
    await applicationStore.addApplication(formData);
  } else {
    await applicationStore.updateApplication(
      currentEditingApplication.value.id,
      formData
    );
  }
  closeDrawer();
}
</script>

<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <a-menu
        mode="inline"
        theme="dark"
        v-model:selectedKeys="selectedKeys"
        @click="handleMenuClick"
      >
        <a-menu-item key="/">
          <HomeOutlined />
          <span>Home</span>
        </a-menu-item>

        <a-menu-item key="/applications">
          <AppstoreOutlined />
          <span>Applications</span>
        </a-menu-item>

        <a-sub-menu key="filter" title="Filter by Status">
          <template #icon><FilterOutlined /></template>
          <a-menu-item key="/applications?status=applied">
            <span>Applied</span>
          </a-menu-item>
          <a-menu-item key="/applications?status=interview">
            <span>Interview</span>
          </a-menu-item>
          <a-menu-item key="/applications?status=offer">
            <span>Offer</span>
          </a-menu-item>
          <a-menu-item key="/applications?status=rejected">
            <span>Rejected</span>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-button type="primary" style="margin: 16px" @click="toggleCollapsed">
          <MenuUnfoldOutlined v-if="collapsed" />
          <MenuFoldOutlined v-else />
        </a-button>
      </a-layout-header>
      <a-layout-content style="padding: 30px">
        <RouterView />
      </a-layout-content>

      <a-drawer
        :title="
          drawerMode.value == 'add' ? 'Add Application' : 'Edit Application'
        "
        :width="600"
        v-model:open="drawerOpen"
        placement="left"
        destroy-on-close
      >
        <ApplicationForm
          :initial-data="currentEditingApplication"
          @submit="handleDrawerSubmit"
          @cancel="closeDrawer"
        />
      </a-drawer>
    </a-layout>
  </a-layout>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  transform: 0.3s all ease;
}

a {
  text-decoration: none;
}
</style>
