<template lang="pug">
VContainer
  VRow
    VCol(cols="12")
      h1 註冊
    VDivider
    VCol(cols="12")
      //- 送出的時候停止表單
      VForm(:disabled="isSubitting" @submit.prevent="submit")
        //- counter 計數器 預設type是text
        VTextField(label="帳號" maxlength="20" minlength="4" counter v-model="account.value.value" :error-messages="account.errorMessage.value")
        VTextField(label="信箱" type="email" v-model="email.value.value" :error-messages="email.errorMessage.value")
        VTextField(label="密碼" maxlength="20" minlength="4" counter type="password" v-model="password.value.value" :error-messages="password.errorMessage.value")
        VTextField(label="確認密碼" maxlength="20" minlength="4" counter type="password" v-model="passwordConfirm.value.value" :error-messages="passwordConfirm.errorMessage.value")
        VBtn(type="submit" color="green") 註冊
</template>

<script setup>
import validator from 'validator'
// vee-validate 表單驗證庫
// useForm 是一個用於創建表單驗證的函數
// useField 是一個用於創建表單欄位驗證的函數
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
// 這裡不用加js，因為 vite 引用的時候會自動去找相關的檔案
import { useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import { useApi } from '@/composables/axios'

const { api } = useApi()

const router = useRouter()
const createSnackbar = useSnackbar()

// 定義註冊表單的資料格式
const schema = yup.object({
  // const account = useField('account') 第二個 要跟 account: yup 要一樣
  //
  account: yup
    .string()
    .required('帳號為必填欄位')
    .min(4, '使用者帳號長度不符')
    .max(20, '使用者帳號長度不符'),
  email: yup
    .string()
    .required('信箱為必填欄位')
    // .test(自訂驗證名稱,錯誤訊息,驗證function)
    // 用自訂的驗證方式
    .test(
      'isEmail', '信箱格式錯誤',
      (value) => {
        return validator.isEmail(value)
      }
    ),
  password: yup
    .string()
    .required('密碼為必填欄位')
    .min(4, '密碼長度不符')
    .max(20, '密碼長度不符'),
  passwordConfirm: yup
    .string()
    .required('密碼為必填欄位')
    .min(4, '密碼長度不符')
    .max(20, '密碼長度不符')
    // .oneOf 只允許符合陣列內其中一個值
    // .oneOf(陣列,錯誤訊息)
    // .ref('password')代表這個 schema 的 password 欄位
    .oneOf([yup.ref('password')], '密碼不一致')
})

// useForm建立一個表單
const { handleSubmit, isSubitting } = useForm({
  // 驗證的格式：schema
  validationSchema: schema
})

// useField建立表單的欄位
const account = useField('account')
const email = useField('email')
const password = useField('password')
const passwordConfirm = useField('passwordConfirm')

// EMAIL:email.value.value

const submit = handleSubmit(async (values) => {
  try {
    // 因為有引入 axios 並有 baseURL 所以路由'/users'即可
    await api.post('/users', {
      account: values.account,
      email: values.email,
      password: values.password
    })
    // 類日 alter 的通知
    createSnackbar({
      text: '註冊成功',
      showCloseButton: false,
      // 傳到後端???
      snackbarProps: {
        timeout: 2000,
        color: 'green',
        // ???
        location: 'bottom'
      }
    })
    // 註冊完跳頁
    router.push('/login')
  } catch (error) {
    // ?. 如果任何一個為  null 或 undefined，整個表達式會立即返回 undefined，而不會拋出錯誤。
    // || 若左邊的值為 false，則回傳右邊的值
    // 嘗試從錯誤物件中獲取錯誤訊息，如果無法獲取，則使用預設的錯誤訊息
    const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
    // 如果有回復錯誤訊息
    createSnackbar({
      text,
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        console: 'red',
        location: 'bottom'
      }
    })
  }
})
</script>
