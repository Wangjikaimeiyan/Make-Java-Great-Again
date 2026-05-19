import request from '@/utils/request'


// 查询All菜品销量
export const queryAllSales = () => request.get('/Order/allSales')

// 查询未支付订单
export const queryAllNotPay = () => request.get('/Order/allNotPay')

// 查询接单订单
export const queryAllNotFinish = () => request.get('/Order/allNotFinish')