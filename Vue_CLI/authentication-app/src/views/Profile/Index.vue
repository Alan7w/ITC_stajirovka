<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import IconVerified from '@/components/icons/IconVerified.vue'
import IconPencil from '@/components/icons/IconPencil.vue'
import defaultUserImg from '@/assets/images/user-avatar.png'

const { t } = useI18n()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const editModal = ref(false)
const editLoading = ref(false)
const imageFile = ref<File | null>(null)
const imagePreview = ref<string>('')
const fileInputRef = ref<HTMLInputElement | null>(null)

const form = reactive({
  first_name: '',
  last_name: '',
  middle_name: '',
  phone_number: '',
  email: '',
  address: '',
})

const openEdit = () => {
  form.first_name = user.value.first_name ?? ''
  form.last_name = user.value.last_name ?? ''
  form.middle_name = user.value.middle_name ?? ''
  form.phone_number = user.value.phone_number ? String(user.value.phone_number) : ''
  form.email = user.value.email ?? ''
  form.address = user.value.address ?? ''
  imageFile.value = null
  imagePreview.value = user.value.user_image ?? ''
  editModal.value = true
}

const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

const handleSave = async () => {
  editLoading.value = true
  try {
    await userStore.updateUserMe({
      ...form,
      user_image: imageFile.value ?? null,
    })
    editModal.value = false
  } catch {
    // error already notified in store
  } finally {
    editLoading.value = false
  }
}

const handleCancel = () => {
  editModal.value = false
}
</script>

<template>
  <div class="profile-page">
    <h2 class="page-title">{{ t('profile') }}</h2>
    <div class="wrapper">
      <div class="profile-card">
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <img
              :src="user.user_image || defaultUserImg"
              width="80"
              height="80"
              alt="avatar"
              class="avatar"
              @error="(e) => ((e.target as HTMLImageElement).src = defaultUserImg)"
            />
          </div>
          <div class="user-info w-100">
            <div class="d-flex align-items-center gap-2">
              <h2 class="full-name">
                {{ user.first_name }} {{ user.last_name }} {{ user.middle_name }}
              </h2>
              <IconVerified />
              <button class="edit-btn" @click="openEdit">
                <IconPencil />
              </button>
            </div>
            <span class="role-badge">{{ user.current_role?.name }}</span>
          </div>
        </div>

        <a-divider />

        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">{{ t('firstName') }}</span>
            <span class="info-value">{{ user.first_name || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ t('lastName') }}</span>
            <span class="info-value">{{ user.last_name || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ t('middleName') }}</span>
            <span class="info-value">{{ user.middle_name || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ t('phone') }}</span>
            <span class="info-value">{{ user.phone_number || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ t('email') }}</span>
            <span class="info-value">{{ user.email || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ t('address') }}</span>
            <span class="info-value">{{ user.address || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ t('organization') }}</span>
            <span class="info-value">{{ user.organ_name || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ t('currentRole') }}</span>
            <span class="info-value">{{ user.current_role?.name || '-' }}</span>
          </div>
        </div>
      </div>

      <div class="roles-section">
        <h3 class="section-title">{{ t('myRoles') }}</h3>
        <div class="roles-list">
          <div
            v-for="role in user.roles"
            :key="role.role_id"
            class="role-item"
            :class="{ active: role.role_id === user.current_role?.role_id }"
          >
            <div class="role-avatar">
              <img src="@/assets/images/user-avatar.png" width="40" height="40" alt="avatar" />
            </div>
            <div>
              <p class="role-name">{{ role.name }}</p>
              <span v-if="role.role_id === user.current_role?.role_id" class="active-badge">
                {{ t('active') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <a-modal
    centered
    v-model:open="editModal"
    :title="t('editProfile')"
    :closable="false"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-form layout="vertical" class="edit-form">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="t('firstName')">
            <a-input v-model:value="form.first_name" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="t('lastName')">
            <a-input v-model:value="form.last_name" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="t('middleName')">
            <a-input v-model:value="form.middle_name" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="t('phone')">
            <a-input v-model:value="form.phone_number" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="t('email')">
            <a-input v-model:value="form.email" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="t('address')">
            <a-input v-model:value="form.address" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item :label="t('userImage')">
            <div class="image-upload-row">
              <div v-if="imagePreview" class="avatar-circle-preview">
                <img :src="imagePreview" alt="avatar" />
              </div>
              <div class="image-upload" @click="fileInputRef?.click()">
                <div v-if="imagePreview" class="image-preview-wrap">
                  <img :src="imagePreview" class="image-preview" alt="preview" />
                  <div class="image-overlay">
                    <IconPencil />
                    <span>{{ t('chooseImage') }}</span>
                  </div>
                </div>
                <div v-else class="image-dropzone">
                  <div class="dropzone-icon">
                    <IconPencil />
                  </div>
                  <p class="dropzone-text">{{ t('chooseImage') }}</p>
                  <span class="dropzone-hint">PNG, JPG, JPEG</span>
                </div>
                <input
                  ref="fileInputRef"
                  type="file"
                  accept="image/*"
                  style="display: none"
                  @change="onFileChange"
                />
              </div>
            </div>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <template #footer>
      <div class="modal-footer">
        <a-button size="large" @click="handleCancel">{{ t('cancel') }}</a-button>
        <a-button size="large" type="primary" :loading="editLoading" @click="handleSave">
          {{ t('save') }}
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<style lang="scss" scoped>
.profile-page {
  padding: 24px;

  .page-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 24px;
  }

  .wrapper {
    display: flex;
    gap: 2rem;
    width: 100%;
    align-items: flex-start;
  }
}

.profile-card {
  background: var(--color-white, #fff);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 24px;
  flex: 1;

  .avatar-section {
    display: flex;
    align-items: center;
    gap: 20px;

    .avatar-wrapper {
      .avatar {
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--color-primary, #1677ff);
      }
    }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .full-name {
        font-size: 18px;
        font-weight: 600;
        margin: 0;
      }

      .role-badge {
        color: var(--color-text2);
        font-size: 14px;
      }
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .info-label {
        font-size: 12px;
        color: var(--color-text2);
        font-weight: 500;
      }

      .info-value {
        font-size: 14px;
        font-weight: 500;
        color: var(--color-text, #1a1a1a);
      }
    }
  }
}

.edit-btn {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 4px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: var(--color-text2);
  margin-left: auto;
  transition: all 0.2s;

  &:hover {
    color: var(--color-primary, #1677ff);
    border-color: var(--color-primary, #1677ff);
  }
  &:active {
    transform: scale(0.98);
  }
}

.roles-section {
  background: var(--color-white, #fff);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 24px;
  width: 320px;
  flex-shrink: 0;

  .section-title {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .roles-list {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .role-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border: 1px solid var(--color-border);
      border-radius: 12px;

      &.active {
        border-color: var(--color-primary, #1677ff);
        background-color: rgba(22, 119, 255, 0.04);
      }

      .role-avatar img {
        border-radius: 50%;
      }

      .role-name {
        font-weight: 500;
        margin: 0;
      }

      .active-badge {
        font-size: 12px;
        color: var(--color-primary, #1677ff);
      }
    }
  }
}

.modal-footer {
  padding-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 1px;
    width: 110%;
    background-color: var(--color-border);
  }
}

.edit-form {
  padding-top: 8px;

  .image-upload-row {
    display: flex;
    align-items: center;
    gap: 16px;

    .avatar-circle-preview {
      flex-shrink: 0;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid var(--color-primary, #1677ff);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
    }
  }

  .image-upload {
    cursor: pointer;
    flex: 1;

    .image-preview-wrap {
      position: relative;
      width: 100%;
      height: 160px;
      border-radius: 12px;
      overflow: hidden;

      .image-preview {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .image-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        color: #fff;
        opacity: 0;
        transition: opacity 0.2s;

        span {
          font-size: 13px;
          font-weight: 500;
        }
      }

      &:hover .image-overlay {
        opacity: 1;
      }
    }

    .image-dropzone {
      width: 100%;
      height: 160px;
      border: 2px dashed var(--color-border);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition:
        border-color 0.2s,
        background 0.2s;

      &:hover {
        border-color: var(--color-primary, #1677ff);
        background: rgba(22, 119, 255, 0.03);
      }

      .dropzone-icon {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: var(--color-F7F7F7, #f7f7f7);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text2);
        font-size: 20px;
      }

      .dropzone-text {
        font-size: 14px;
        font-weight: 500;
        color: var(--color-primary, #1677ff);
        margin: 0;
      }

      .dropzone-hint {
        font-size: 12px;
        color: var(--color-text2);
      }
    }
  }
}
</style>
