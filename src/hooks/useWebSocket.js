import { ref } from 'vue'

/**
 * 创建WebSocket实例工具
 * @param {string} url ws连接地址
 * @returns ws操作对象
 */
export function createWebSocket(url) {
  let socket = null
  let reconnectTimer = null
  let heartBeatTimer = null

  // 向外暴露响应式数据
  const message = ref(null)      // 后端推送原始消息
  const isConnected = ref(false) // 连接状态

  const RECONNECT_DELAY = 3000    // 断线重连间隔ms
  const HEART_INTERVAL = 20000    // 心跳包间隔ms，防止服务器空闲切断连接

  // 建立连接
  function connect() {
    socket = new WebSocket(url)

    // 连接成功
    socket.onopen = () => {
      console.log('WebSocket 连接建立成功')
      isConnected.value = true
      clearTimeout(reconnectTimer)
      startHeartBeat()
    }

    // 接收后端消息
    socket.onmessage = (event) => {
      try {
        message.value = JSON.parse(event.data)
      } catch (err) {
        message.value = event.data
      }
    }

    // 连接关闭
    socket.onclose = () => {
      console.log('WebSocket 连接断开，准备重连')
      isConnected.value = false
      stopHeartBeat()
      reconnect()
    }

    // 连接异常
    socket.onerror = (err) => {
      console.error('WebSocket 异常：', err)
      socket.close()
    }
  }

  // 启动心跳 ping
  function startHeartBeat() {
    heartBeatTimer = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'ping' }))
      }
    }, HEART_INTERVAL)
  }

  // 停止心跳
  function stopHeartBeat() {
    clearInterval(heartBeatTimer)
  }

  // 断线自动重连
  function reconnect() {
    if (reconnectTimer) return
    reconnectTimer = setTimeout(() => {
      connect()
    }, RECONNECT_DELAY)
  }

  // 向前端发送消息给后端
  function sendMsg(data) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data))
    } else {
      console.warn('连接未就绪，消息发送失败')
    }
  }

// 彻底关闭连接
function closeSocket() {
  clearTimeout(reconnectTimer)
  stopHeartBeat()
  if (socket) {
    socket.onclose = null // 移除关闭回调，阻止触发reconnect
    socket.close()
  }
  socket = null
}


  // 执行连接
  connect()

  return {
    message,
    isConnected,
    sendMsg,
    closeSocket
  }
}
