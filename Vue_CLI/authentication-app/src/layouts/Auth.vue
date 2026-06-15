<template>
  <div>
    <a-button type="primary" :loading="ssoLoading" @click="signInHandler">
      {{ t("signIn") }}
    </a-button>
    <a-form
      :model="basicAuthForm"
      @finish="handleBasicLogin"
      layout="vertical"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 7 }"
    >
      <a-form-item
        name="username"
        :label="t('username')"
        :rules="[{ required: true }]"
      >
        <a-input
          v-model:value="basicAuthForm.username"
          :placeholder="t('username')"
        >
        </a-input>
      </a-form-item>
      <a-form-item
        name="password"
        :label="t('password')"
        :rules="[{ required: true }]"
      >
        <a-input-password
          v-model:value="basicAuthForm.password"
          :placeholder="t('password')"
        >
        </a-input-password>
      </a-form-item>

      <a-button type="primary" html-type="submit">
        {{ t("enterSystem") }}
      </a-button>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { onBeforeMount, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const basicAuthForm = reactive({ username: "", password: "" });
const basicAuthLoading = ref(false);
const ssoLoading = ref(false);
const authStore = useAuthStore();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const IMVID_URL = "https://sso.mf.uz/oauth2/login?clientId=asllik-imv";
const codeVerifier = generateRandomString(128);

function generateRandomString(length) {
  const charSet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    randomString += charSet.charAt(Math.floor(Math.random() * charSet.length));
  }
  return randomString;
}

async function createCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  return crypto.subtle.digest("SHA-256", data).then((buffer) => {
    const hashArray = Array.from(new Uint8Array(buffer));
    const hashBase64 = btoa(String.fromCharCode.apply(null, hashArray));
    const hashBase64Url = hashBase64
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    return hashBase64Url.slice(0, 43); // Trim to 43 characters
  });
}

const signInHandler = () => {
  ssoLoading.value = true;
  createCodeChallenge(codeVerifier)
    .then((codeChallenge) => {
      localStorage.setItem("codeVerifier", codeVerifier);

      window.location.href = `${IMVID_URL}&redirectUri=${
        import.meta.env.VITE_AUTH_REDIRECT_URI
      }&codeChallenge=${codeChallenge}`;
    })
    .catch(() => {
      ssoLoading.value = false;
    });
};

const handleBasicLogin = async () => {
  basicAuthLoading.value = true;
  try {
    await authStore.loginByBasicAuth(
      basicAuthForm.username,
      basicAuthForm.password
    );
  } catch (error) {
    console.log("Basic auth login failed:", error);
  } finally {
    basicAuthLoading.value = false;
  }
};

const loading = ref(false);

onMounted(async () => {
  const verifier = localStorage.getItem("codeVerifier");
  const code = route.query?.code;

  if (code && verifier) {
    loading.value = true;
    try {
      await authStore.loginByImvID(code, verifier);
      localStorage.removeItem("codeVerifier");
    } catch (error) {
      console.log("Login failed: " + error);
    } finally {
      loading.value = false;
    }
  }
});

onBeforeMount(() => {
  if (localStorage.getItem("token")) {
    router.push({ name: "dashboard" });
  }
});
</script>

<style scoped lang="scss">
</style>