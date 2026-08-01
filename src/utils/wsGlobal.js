import { createWebSocket } from '@/hooks/useWebSocket'

// 全局唯一实例（模块作用域，全局共享）
let wsInstance = null

/**
 * 初始化全局长连接
 * @param {string} wsUrl 连接地址
 * @returns ws实例
 */
export function initGlobalWs(wsUrl) {
  // 已有连接，直接返回，禁止重复创建
  if (wsInstance) {
    console.log('全局WebSocket已存在，无需重复创建')
    return wsInstance
  }
  wsInstance = createWebSocket(wsUrl)
  return wsInstance
}

/**
 * 获取全局ws实例，所有业务页面调用
 */
export function getWsInstance() {
  return wsInstance
}

/**
 * 销毁关闭全局连接（退出登录调用）
 */
export function destroyGlobalWs() {
  if (wsInstance) {
    wsInstance.closeSocket()
    wsInstance = null
    console.log('全局WebSocket已关闭销毁')
  }
}
