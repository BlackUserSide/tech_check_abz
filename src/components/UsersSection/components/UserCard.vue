<script lang="ts" setup>
import {ref, onMounted} from "vue";
import type {PropType} from "vue";
import type {User} from "../../../types/users.ts";
import NoImage from "../../NoImage/NoImage.vue";

const {user} = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true,
  },
});

const imageExists = ref(true);

function checkImageExists(url: string) {
  return new Promise<boolean>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

onMounted(async () => {
  if (user.photo) {
    imageExists.value = await checkImageExists(user.photo);
  } else {
    imageExists.value = false;
  }
});
</script>

<template>
  <div class="container-user-card">
    <div class="container-user-wrapper">
      <div class="image-container">
        <img v-if="imageExists" :src="user.photo" alt="User Image"/>
        <NoImage v-else/>
      </div>

      <div class="name-user">
        <p>{{ user.name.length > 20 ? user.name.slice(0, 20) + '...' : user.name }}</p>
        <div v-if="user.name.length > 20" class="hidden-content-wrapper">
          <p>{{ user.name }}</p>
        </div>
      </div>

      <div class="container-content-user">
        <div class="position-wrapper">
          <p>{{ user.position }}</p>
        </div>
        <div class="email-container">
          <p>{{ user.email.length > 20 ? user.email.slice(0, 20) + '...' : user.email }}</p>
          <div v-if="user.email.length > 20" class="hidden-content-wrapper">
            <p>{{ user.email }}</p>
          </div>
        </div>
        <div class="phone-container">
          <p>{{ user.phone }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
