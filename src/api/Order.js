import request from '@/utils/request'


// 查询All菜品销量
export const queryAllSales = () => request.get('/Order/allSales')
