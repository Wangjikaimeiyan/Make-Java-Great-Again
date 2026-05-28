import request from '@/utils/request'


// 查询All菜品销量
export const queryAllSales = () => request.get('/Order/allSales')

// 查询未支付订单
export const queryAllNotPay = ((pageNum,pageSize) => request.get(`/Order/allNotPay?pageNum=${pageNum}&pageSize=${pageSize}`))

// 查询未接单订单
export const queryAllNotFinish = ((pageNum,pageSize) => request.get(`/Order/allNotFinish?pageNum=${pageNum}&pageSize=${pageSize}`))

// 查询进行中订单
export const queryAllInProgress = ((pageNum,pageSize) => request.get(`/Order/allInProgress?pageNum=${pageNum}&pageSize=${pageSize}`))

// 已完成
export const queryAllFinished = ((pageNum,pageSize) => request.get(`/Order/allFinished?pageNum=${pageNum}&pageSize=${pageSize}`))

// 接单acceptOrder
export const acceptOrder = (orderId) => request.post(`/Order/acceptOrder?orderId=${orderId}`)

// rejectOrder拒绝接单
export const rejectOrder = (orderId) => request.post(`/Order/rejectOrder?orderId=${orderId}`)

// 完成进行中的订单
export const finishOrder = (orderId) => request.post(`/Order/finishOrder?orderId=${orderId}`)

// 根据订单id查询订单
export const queryOrderById = (orderId) => request.get(`/Order/queryOrderById?orderId=${orderId}`)

// 查询今日营业额
export const queryTodayTurnover = () => request.get(`/Order/TodayTurnover`)

// 查询总营业额
export const queryAllTurnover = () => request.get(`/Order/AllTurnover`)

// 退款serviceOrder
export const serviceOrder = (orderId) => request.post(`/Order/serviceOrder?orderId=${orderId}`)
