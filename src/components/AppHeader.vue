<script lang="ts" setup>
import vortexsvg from "@/assets/vortexsvg.svg";
</script>

<template>
  <v-container class="d-flex justify-center flex-wrap">
    <v-container class="d-flex justify-center min-w-screen">
      <v-img
        :src="vortexsvg"
        :aspect-ratio="1 / 1"
        :max-width="80"
        class="justify-center items-center"
      />
    </v-container>
    <v-divider />
  </v-container>
</template>
