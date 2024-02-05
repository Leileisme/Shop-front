import axios from 'axios'
import { useUserStore } from '@/store/user'

export const api = axios.create({
  // 測試網址是'http://localhost:4000'，但之後是vue的網址
  // 所以會用.env去使用，比較好換
  baseURL: import.meta.env.VITE_API
})

// 所有帶有 JWT 的相關的請求，用這個呼叫
// 下面就寫他的攔截器，就不用再每一個 post... 等 再寫一次
const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API
})

// 1. 呼叫 axios.get / axios.post 時
// 2. interceptors.request 請求攔截器
// 3. 送出請求
// 4. interceptors.response 回應攔截器
// 5. 呼叫的地方的 .then() .catch()

// config 這次請求的設定
apiAuth.interceptors.request.use(config => {
  const user = useUserStore()
  config.headers.Authorization = 'Bearer ' + user.token
  return config
})

// apiAuth.interceptors.response.use(成功時執行, 失敗時執行)
apiAuth.interceptors.response.use((res) => {
  return res
}, (error) => {
  // 如果失敗有收到回應
  if (error.response) {
    // 如果是 jwt 過期，且不是舊換新請求
    if (error.response.data.message === 'JWT 過期' && error.config.url !== '/users/extend') {
      const user = useUserStore()
      // 傳送舊換新請求
      return apiAuth.patch('/users/extend')
        .then(({ data }) => {
          // 更新 pinia 保存的 token
          user.token = data.result
          // 修改發生錯誤的原請求設定的 jwt
          error.config.headers.Authorization = 'Bearer ' + user.token
          // 重新傳送原請求
          // 會回傳一個包含錯誤資訊的 error 物件。這個 error 物件中的 config 屬性包含了原始請求的配置資訊。
          // 這種重試機制應該要有一個限制，以避免無限循環。(可研界2/5)
          return axios(error.config)
        })
        .catch(() => {
          // 如果舊換新失敗，登出
          user.logout()
          // 回傳原錯誤到呼叫的地方
          // 拒絕一個 Promise，並且帶上一個給定的原因 error，會給catch
          return Promise.reject(error)
        })
    }
  }
  // 如果請求沒回應，或不是過期的錯誤，回傳原錯誤到呼叫的地方
  return Promise.reject(error)
})

export const useApi = () => {
  return { api, apiAuth }
}
