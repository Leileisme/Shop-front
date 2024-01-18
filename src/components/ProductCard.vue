<template lang="pug">
VCard.product-card
  VImg(:src="image" cover height="200")
  VCardTitle
    RouterLink.text-primary.text-decoration-none(:to="'/products/' + _id") {{ name }}
  VCardSubtitle ${{ price }}
  //- 存資料庫的換行是 /r/n ，但前端不會辨認，所以要自己加cSS樣式(如下)
  VCardText(style="white-space: pre;") {{ description }}
  VCardActions
    VBtn(color="primary" prepend-icon="mdi-cart"  @click="addCart") 加入購物車
</template>

<script setup>
import { useApi } from '@/composables/axios'
import { useUserStore } from '@/store/user'
import { useSnackbar } from 'vuetify-use-dialog'
import { useRouter } from 'vue-router'

const { apiAuth } = useApi()
const user = useUserStore()
const createSnackbar = useSnackbar()
const router = useRouter()

const props = defineProps(['_id', 'category', 'description', 'image', 'name', 'price', 'sell'])

const addCart = async () => {
// 如果未登入，或跳去登入
  if (!user.isLogin) {
    router.push('/login')
    return
  }

  try {
    const { data } = await apiAuth.patch('/users/cart', {
      product: props._id,
      quantity: 1
    })
    user.cart = data.result
    createSnackbar({
      text: '新增成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'green',
        location: 'bottom'
      }
    })
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
}
</script>
