import request from '@/utils/request'


export const queryAllApi = () => { //查询所有菜品
  return request.get('/Xiang/dishes')
}
// 条件查询
export const queryApiFilter = (name,price) => { //条件查询
  return request.get('/Xiang/dishes/filter',{params:{name,price}})
}
// 根据id查询
export const queryinfoId = (id) => request.get(`/Xiang/dish/${id}`)
// 修改菜品
export const updateDish = (formData) => {
  return request.post('/Xiang/Updatadish', formData)
}
// 添加菜品
export const addDish = (formData) => {
  return request.post('/Xiang/dish', formData)
}
// 删除菜品
export const deleteDish = (id) => {
  return request.delete(`/Xiang/dish/${id}`)
}
// ai对话
// ai对话 流式SSE
export const aichat = async (question, onMessage) => {
  // 1. 拼接和你其他接口一样的地址
  const url = `/api/Xiang/ai/chat?question=${encodeURIComponent(question)}`

  // 2. 拿到 token（和你的 request 逻辑一样）
  const loginData = JSON.parse(localStorage.getItem('loginToken') || '{}')
  const token = loginData?.token

  // 3. 原生 fetch 处理流，不经过 axios 拦截器
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'text/event-stream',
      token: token, // 带上token，后端才认
    },
  })

  // 4. 一段一段读
  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n')

    for (const line of lines) {
      if (line.startsWith('data:')) {
        const data = line.replace(/^data:\s*/, '').trim()
        if (data) onMessage(data)
      }
    }
  }
}
