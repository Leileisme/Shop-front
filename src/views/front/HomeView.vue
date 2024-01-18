<template lang="pug">
VContainer
  VRow
    VCol(cols="12")
      h1 購物網
    VDivider
    VCol(cols="12" sm="6" lg="3" v-for="product in products" :key="product._id")
      ProductCard(v-bind="product")
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import ProductCard from '@/components/ProductCard.vue'
import gsap from 'gsap'

const { api } = useApi()
const createSnackbar = useSnackbar()

const products = ref([])

// 打元件掛到DOM上才抓資料(使用GSAP的關係)
onMounted(async () => {
  try {
    const { data } = await api.get('/products', {
      // 沒有要做分頁
      params: {
        itemsPerPage: -1
      }
    })
    products.value.push(...data.result.data)
    // 等網頁重新渲染
    await nextTick()
    gsap
      .to('.product-card', { opacity: 1, duration: 0.5 })
  } catch (error) {
    const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
    createSnackbar({
      text,
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'red',
        location: 'bottom'
      }
    })
  }
})
</script>

<style scoped lang="sass">
.product-card
  opacity: 0.5
</style>