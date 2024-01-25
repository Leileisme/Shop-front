<template lang="pug">
VContainer.h-100
  VRow.h-100(align="center")
    VCol(cols="12")
      h1.text-center.text 請選擇管理項目
      VBtn(@click="color='red'").text-center 紅色
      VBtn(@click="color='blue'").text-center 藍色

</template>

<script setup>
import { ref } from 'vue'
const color = ref('red')
</script>

<style lang="sass">
.text
  color: v-bind(color)
</style>
