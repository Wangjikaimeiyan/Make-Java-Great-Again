import request from '@/utils/request'

// 登录
export const loginApi = (account) => request.post(`/login`, account)