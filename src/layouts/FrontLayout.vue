<template lang="pug">
//- 手機板側欄
VNavigationDrawer(v-model="drawer" temporary location="left" v-if="isMobile")
  //- props 不會是整行 會在list裡面 有圓角
  VList(nav)
    template(v-for="item in navItems" :key="item.to")
      VListItem(:to="item.to" v-if="item.show")
        template(#prepend)
          VIcon(:icon="item.icon")
        template(#append)
          VBadge(color="error" :content="user.cart" v-if="item.to === '/cart'" inline)
        VListItemTitle {{ item.text }}
    VListItem(v-if="user.isLogin" @click="logout")
      template(#prepend)
        VIcon(icon="mdi-logout")
      VListItemTitle 登出

VAppBar(color="primary")
  VContainer.d-flex.align-center
    VBtn(to='/')
      VAppBarTitle 購物網
    VSpacer
    //- 手機版導覽列
    //- 判斷是不是手機板 isMobile
    template(v-if="isMobile")
      VAppBarNavIcon(@click="drawer=true")
    //- 電腦版導覽列
    template(v-else)
      template(v-for="item in navItems" :key="item.to")
        VBtn(:to='item.to' :prepend-icon="item.icon" v-if="item.show") {{ item.text }}
          //- 如果是去購物車頁面的icon 就會顯示 v-if="item.to === '/cart'"
          VBadge(color="error" :content="user.cart" v-if="item.to === '/cart'" floating)
      VBtn(prepend-icon="mdi-logout" v-if="user.isLogin") 登出

//- 頁面內容
//- 原本商品不會換頁 因為都是products頁面
//- RouterView 綁定 route.path 位置讓它跳頁(but why??>)
//- 下面沒解構route 所以用$route 吃'vue-router'的
VMain
  RouterView(:key="$route.path")
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { computed, ref } from 'vue'
import { useUserStore } from '@/store/user'
import { useApi } from '@/composables/axios'
// 跳通知的套件?
import { useSnackbar } from 'vuetify-use-dialog'
import { useRouter } from 'vue-router'

const { apiAuth } = useApi()
const router = useRouter()
const createSnackbar = useSnackbar()
const user = useUserStore()

// 手機版判斷
const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)

// 手機版側欄開關
const drawer = ref(false)

const navItems = computed(() => {
  return [
    { to: '/register', text: '註冊', icon: 'mdi-account-plus', show: !user.isLogin },
    { to: '/login', text: '登入', icon: 'mdi-login', show: !user.isLogin },
    { to: '/cart', text: '購物車', icon: 'mdi-cart', show: user.isLogin },
    { to: '/orders', text: '訂單', icon: 'mdi-list-box', show: user.isLogin },
    { to: '/admin', text: '管理', icon: 'mdi-cog', show: user.isLogin && user.isAdmin }
  ]
})

const logout = async () => {
  try {
    await apiAuth.delete('/users/logout')
    user.logout()
    createSnackbar({
      text: '登出成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'green',
        location: 'bottom'
      }
    })
    // 導回首頁
    router.push('/')
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
