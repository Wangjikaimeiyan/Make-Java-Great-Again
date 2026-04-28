import request from '@/utils/request'

export const queryAllApi = () => { //查询所有主食
  return request.get('/Zhu/dishes')
}
// 条件查询
export const queryApiFilter = (name,price) => { //条件查询
  return request.get('/Zhu/dishes/filter',{params:{name,price}})
}
// 根据id查询
export const queryinfoId = (id) => request.get(`/Zhu/dish/${id}`)
// 修改菜品
export const updateDish = (formData) => {
  return request.post('/Zhu/Updatadish', formData)
}
// 添加菜品
export const addDish = (formData) => {
  return request.post('/Zhu/dish', formData)
}
// 删除菜品
export const deleteDish = (id) => {
  return request.delete(`/Zhu/dish/${id}`)
}
// ai对话 流式SSE
export const aichat = async (question, onMessage) => {
  const url = `/api/Zhu/ai/chat?question=${encodeURIComponent(question)}`

  const loginData = JSON.parse(localStorage.getItem('loginToken') || '{}')
  const token = loginData?.token

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'text/event-stream',
      token: token,
    },
  })

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
