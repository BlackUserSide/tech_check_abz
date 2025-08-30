<script setup lang="ts">
import Header from "./components/Header/Header.vue";
import HeroImageSection from "./components/HeroSection/HeroImageSection.vue";
import UsersSection from "./components/UsersSection/UsersSection.vue";
import PostFormSection from "./components/PostFormSection/PostFormSection.vue";
import {onBeforeMount} from "vue";
import {usePosition} from "./stores/positions.ts";

const positionStore = usePosition()

onBeforeMount(() => {
  positionStore.registerToken()
})
</script>
<template>
  <Header/>
  <HeroImageSection/>
  <UsersSection/>
  <PostFormSection/>
</template>
