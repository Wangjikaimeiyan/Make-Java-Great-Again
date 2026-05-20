import request from '@/utils/request'


// 查询All菜品销量
export const queryAllSales = () => request.get('/Order/allSales')

// 查询未支付订单
export const queryAllNotPay = ((pageNum,pageSize) => request.get(`/Order/allNotPay?pageNum=${pageNum}&pageSize=${pageSize}`))

// 查询未接单订单
export const queryAllNotFinish = ((pageNum,pageSize) => request.get(`/Order/allNotFinish?pageNum=${pageNum}&pageSize=${pageSize}`))

