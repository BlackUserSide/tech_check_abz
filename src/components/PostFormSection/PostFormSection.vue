<script lang="ts" setup>
import {usePosition} from "../../stores/positions.ts";
import {computed, onBeforeMount, type Ref, ref} from "vue";
import {storeToRefs} from "pinia";
import type {Position} from "../../types/positions.ts";
import Loader from "../Loader/Loader.vue";
import {email, maxLength, minLength, required} from '@vuelidate/validators'
import useVuelidate from "@vuelidate/core";
import {Notyf} from "notyf";
import SuccessMessage from "../SuccessMessage/SuccessMessage.vue";

type ModelForm = {
  name: string,
  email: string,
  phone: string;
  position_id: Position | null;
}
const fileInput = ref<HTMLInputElement | null>(null)
const notyf: Notyf = new Notyf()
const successForm: Ref<boolean> = ref(false)

function triggerFileInput() {
  fileInput.value?.click()
}

const selectPosition: Ref<Position | null> = ref(null)
const photo: Ref<File | null> = ref(null)
const dataForm: Ref<ModelForm> = ref({
  name: "",
  email: "",
  phone: "",
  position_id: null,
})
const rules = computed(() => ({
  name: {required, minLength: minLength(2), maxLength: maxLength(60)},
  email: {required, email},
  phone: {required},
}))
const v$ = useVuelidate(rules, dataForm)
const positionStore = usePosition()
const {positions, loader} = storeToRefs(positionStore)
onBeforeMount(() => {
  positionStore.getAllPositions()
})

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const isImage = file.type.startsWith('image/')
  const maxSize = 5 * 1024 * 1024 // (5MB - size for normal img) // TODO mb change
  if (!isImage) {
    notyf.error("Only image files are allowed.")
    return
  }
  if (file.size > maxSize) {
    notyf.error("File size must be under 5MB.")
    return
  }

  photo.value = file
}


async function handleSubmit() {
  v$.value.$touch()
  const isValid = await v$.value.$validate()
  if (!isValid) return
  if (!selectPosition.value) {
    notyf.error('Need choice position')
    return;
  }
  if (!photo.value) {
    notyf.error('Need upload photo')
    return;
  }
  const data = new FormData()
  data.append('name', dataForm.value.name)
  data.append('email', dataForm.value.email)
  data.append('phone', dataForm.value.phone.replace(/[()\s-]/g, ''))
  data.append('position_id', selectPosition.value.id.toString())
  data.append('photo', photo.value)
  if (await positionStore.registerUser(data)) {
    successForm.value = true
    return;
  }
}

</script>
<template>
  <section class="form-add-user">
    <div class="top-line-title">
      <h3 class="h3">Working with POST request</h3>
    </div>
    <form v-if="!successForm" class="main-add-user-form" @submit.prevent="handleSubmit">
      <div class="container-input">
        <input id="name" v-model="dataForm.name"
               :class="`main-input ${v$ && v$.name?.$error ? 'is-danger': ''}`"
               name="name" placeholder="Your name"
               type="text"/>
        <div v-if="v$ && v$.name?.$error" class="error-inp">
          <span v-if="v$.name.required.$invalid">Name is required</span>
        </div>
      </div>
      <div class="container-input">
        <input id="email" v-model="dataForm.email" :class="`main-input ${v$ && v$.email?.$error ? 'is-danger': ''}`"
               name="email"
               placeholder="Email" type="text"/>
        <div v-if="v$ && v$.email?.$error" class="error-inp">
          <span v-if="v$.email.required.$invalid">Email is required</span>
          <span v-if="v$.email.email.$invalid">Invalid email</span>
        </div>
      </div>
      <div class="container-input">
        <input id="phone" v-model="dataForm.phone" v-mask="'+380 (##) ### - ## - ##'"
               :class="`main-input ${v$ && v$.phone?.$error ? 'is-danger': ''}`" name="phone"
               placeholder="Phone" type="text"/>

        <div v-if="v$ && v$.phone?.$error" class="error-inp">
          <span v-if="v$.phone.required.$invalid">Phone is required</span>
        </div>
        <div v-else class="tools-tip">
          <p>+38 (XXX) XXX - XX - XX</p>
        </div>
      </div>
      <div class="position-container">
        <div class="title-position">
          <p>Select your position</p>
        </div>
        <Loader v-if="loader"/>
        <div v-for="item in positions" v-if="!loader && positions.length > 0" :key="item.id"
             class="position-check-wrapper" @click="selectPosition = item">
          <div :class="`select-circle-container ${selectPosition && selectPosition.id === item.id ? `is-active`:''} `">
            <div v-if="selectPosition && selectPosition.id === item.id" class="active-circle"></div>
          </div>
          <span>
            {{ item.name }}
          </span>
        </div>
      </div>
      <div class="container-input">
        <div class="file-upload">
          <button class="btn-upload-inp" type="button" @click="triggerFileInput">
            Upload
          </button>
          <span class="file-upload-name">  {{ (photo && photo.name) || 'Upload your photo' }}</span>
          <input
              ref="fileInput"
              accept="image/*"
              class="file-upload-inp"
              type="file"
              @change="handleFileUpload"
          />
        </div>
      </div>
      <div class="container-btn-sign-up">
        <button class="main-btn" type="submit">
          Sign up
        </button>
      </div>
    </form>
    <div v-else class="container-success-message">
      <div class="top-line-container">
        
      </div>
      <SuccessMessage/>
    </div>
  </section>
</template>
