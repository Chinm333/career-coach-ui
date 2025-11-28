import axios from 'axios';


const api = axios.create({
    baseURL: process.env.API_BASE_URL || 'http://localhost:4000/api'
})


let accessToken = null
let refreshToken = null


export const setTokens = (t) => { accessToken = t }
export const setRefresh = (t) => { refreshToken = t }


api.interceptors.request.use(cfg => {
    if (accessToken) cfg.headers.Authorization = `Bearer ${accessToken}`
    return cfg
})


let isRefreshing = false
let queue = []


const processQueue = (err, token = null) => {
    queue.forEach(p => err ? p.reject(err) : p.resolve(token))
    queue = []
}


api.interceptors.response.use(res => res, async err => {
    const original = err.config
    if (err.response && err.response.status === 401 && !original._retry) {
        original._retry = true
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                queue.push({ resolve, reject })
            }).then(tok => {
                original.headers.Authorization = `Bearer ${tok}`
                return api(original)
            })
        }


        isRefreshing = true
        try {
            const r = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken })
            const newAccess = r.data.accessToken
            const newRefresh = r.data.refreshToken
            setTokens(newAccess)
            setRefresh(newRefresh)
            processQueue(null, newAccess)
            isRefreshing = false
            original.headers.Authorization = `Bearer ${newAccess}`
            return api(original)
        } catch (e) {
            processQueue(e, null)
            isRefreshing = false
            throw e
        }
    }
    throw err
})


export default api;