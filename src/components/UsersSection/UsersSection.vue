<script setup lang="ts">
import UserCard from "./components/UserCard.vue";
import Loader from '../Loader/Loader.vue'
import {onMounted} from "vue";
import {useUsers} from "../../stores/users.ts";
import {storeToRefs} from "pinia";

const usersStore = useUsers()
const {users, loader, localeLoader, currentPage, countPage} = storeToRefs(usersStore)

onMounted(() => {
  usersStore.getAllUsers()
})

function nextPageHandler() {
  usersStore.nextPage()
}
</script>
<template>
  <section class="users-section">
    <div class="top-line-title">
      <h3 class="h3">
        Working with GET request
      </h3>
    </div>
    <div class="container-users-cards">
      <Loader v-if="loader"/>
      <UserCard v-if="!loader && users.length > 0" v-for="item in users" :user="item" :key="item.id"/>

    </div>
    <div class="container-btn">
      <Loader v-if="localeLoader"/>
      <button v-if="!localeLoader && currentPage < countPage && !loader" class="main-btn show-more-btn"
              @click="nextPageHandler">
        Show more
      </button>
    </div>
  </section>
</template>
