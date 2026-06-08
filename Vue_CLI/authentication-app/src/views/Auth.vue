<template>
  <a-button type="primary" @click="signInHandler">
    {{ t("signIn") }}
  </a-button>
  <a-form
    :model="basicAuthForm"
    @finish="handleBasicLogin"
    layout="vertical"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 7 }"
  >
    <a-form-item>
      <a-input
        v-model:value="basicAuthForm.username"
        :rules="[{ required: true }]"
        :placeholder="t('username')"
      >
      </a-input>
      <a-input-password
        v-model:value="basicAuthForm.password"
        :rules="[{ required: true }]"
        :placeholder="t('password')"
      >
      </a-input-password>
    </a-form-item>

    <a-button type="primary" html-type="submit">{{
      t("enterSystem")
    }}</a-button>
  </a-form>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";

const basicAuthForm = reactive({ username: "", password: "" });
const basicAuthLoading = ref(false);
const authStore = useAuthStore();
const { t } = useI18n();

const IMVID_URL = "https://sso.imv.uz/oauth2/login?clientId=asllik-imv";
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
  createCodeChallenge(codeVerifier).then((codeChallenge) => {
    localStorage.setItem("codeVerifier", codeVerifier);
    window.location.href = `${IMVID_URL}&redirectURI=${
      import.meta.env.VITE_AUTH_REDIRECT_URI
    }&codeChallenge=${codeChallenge}`;
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
</script>

<style scoped lang="scss">
</style>