import request from '@/utils/request'

// 修改店铺营业状态
export const updateShopStatus = (statue) => {
    return request.get('/Statue/update', { params: { statue } })
  }
//   查询营业状态
export const queryShopStatus = () => request.get('/Statue/query')