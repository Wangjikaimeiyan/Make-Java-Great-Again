<script setup>
import { onMounted, ref, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { updateShopStatus, queryShopStatus } from '@/api/Statue'
import previewAudio from '@/assets/preview.mp3'
// 引入websocket全局方法
import { initGlobalWs, getWsInstance, destroyGlobalWs } from '@/utils/wsGlobal'

const username = ref('');
const router = useRouter();

// 退出登录
const logout = () => {
  ElMessageBox.confirm(
    '此操作将退出登录, 是否继续?',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', }
  ).then(async () => {
    ElMessage.success("退出登录成功");
    // 关闭WebSocket连接
    destroyGlobalWs()
    localStorage.removeItem('loginToken');
    router.push('/login');
  }).catch(() => {
    ElMessage.info('已取消退出登录')
  })
}

// 获取用户名 + 初始化WebSocket
const getUsername = () => {
  const tempdata = JSON.parse(localStorage.getItem('loginToken'));
  if (tempdata && tempdata.name) {
    username.value = tempdata.name;
    const token = tempdata.token;
    // 初始化ws连接
    const wsUrl = `ws://127.0.0.1:8080/ws/${token}`
    initGlobalWs(wsUrl)
  }
}

const shopStatus = ref();
// 修改营业状态
const change_Statue = async () => {
  await ElMessageBox.confirm(
    '请选择店铺营业状态',
    '状态修改',
    {
      type: 'info',
      confirmButtonText: '开始营业',
      cancelButtonText: '停业',
      distinguishCancelAndClose: true
    }
  ).then(async () => {
    await updateShopStatus(1)
    const res = await queryShopStatus()
    shopStatus.value = res.data
    ElMessage.success('已开启营业')
  }).catch(async (action) => {
    if (action === 'cancel') {
      await updateShopStatus(0)
      const res = await queryShopStatus()
      shopStatus.value = res.data
      ElMessage.success('已停业')
    }
  })
}
// ==================== mp3播放函数 ===================
// 用户下单播放
// 创建音频实例，全局只创建一次
const audio = new Audio(previewAudio)
audio.volume = 0.7 // 音量0~1
// TODO: 用户退菜播放
// 播放铃声
const playRing = () => {
  audio.currentTime = 0 // 重头播放，多条消息连续响铃
  audio.play().catch(e => {
    console.log("浏览器限制：需要点击页面后才能播放声音")
  })
}
// ==================== mp3播放函数 ===================
// ======================弹窗相关======================
const dialogVisible = ref(false)
const orderMsg = ref({
  orderId: "",
  content: ""
})

const handleClose = (done) => {
  done()
}

// 弹窗跳转订单
const goOrderPage = () => {
  dialogVisible.value = false
  router.push({
    path: "/layout/order",
    query: { orderId: orderMsg.value.orderId }
  })
}

let stopWatch = null
//—————————————— ws消息监听函数 ——————————————
function listenWsMessage() {
  const ws = getWsInstance()
  if (!ws) return

  stopWatch = watch(ws.message, (msg) => {
    if (!msg) return

    if (msg.type === "1") {
      orderMsg.value.orderId = msg.orderId
      orderMsg.value.content = msg.content
      dialogVisible.value = true
      playRing()
    } else if (msg.type === "2") { //TODO： 删除
      orderMsg.value.orderId = msg.orderId
      orderMsg.value.content = "⚠️客户催单"
      dialogVisible.value = true
    } else if (msg.type === "3") {
      orderMsg.value.orderId = msg.orderId
      orderMsg.value.content = "📢订单已取消"
      dialogVisible.value = true
    }
  }, { immediate: true })
}

// 组件销毁，清除watch监听，防止重复绑定
onUnmounted(() => {
  if (stopWatch) stopWatch()
})

// 钩子函数
onMounted(() => {
  getUsername();
  queryShopStatus().then(res => {
    shopStatus.value = res.data;
  })
  // 调用监听函数！消除TS警告
  listenWsMessage()
})

</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- Header 区域 -->
      <el-header class="header">
        <span class="title">餐厅智能管理系统</span>
        <span class="right_tool">
          <a href="javascript:void(0)" @click="change_Statue" style="margin-right: 10px;">
            <el-icon>
              <Check v-if="shopStatus === 1" />
              <Close v-else />
            </el-icon>
            <span class="status-text">
              {{ shopStatus === 1 ? '营业中' : '停业中' }}
            </span>
          </a>
          <a href="javascript:void(0)" @click="logout">
            <el-icon>
              <SwitchButton />
            </el-icon> 退出登录
          </a>
        </span>
      </el-header>

      <el-container>
        <el-aside width="200px" class="aside">
          <div class="side-menu">
            <el-menu default-active="/layout/home" router>
              <el-menu-item index="/layout/home" class="aka">
                <el-icon><House /></el-icon> 首页
              </el-menu-item>
              <el-menu-item index="/layout/chuan" class="aka">
                <el-icon><KnifeFork /></el-icon> 川菜
              </el-menu-item>
              <el-menu-item index="/layout/xiang" class="aka">
                <el-icon><ForkSpoon /></el-icon> 湘菜
              </el-menu-item>
              <el-menu-item index="/layout/lu" class="aka">
                <el-icon><DishDot /></el-icon> 鲁菜
              </el-menu-item>
              <el-menu-item index="/layout/zhu" class="aka">
                <el-icon><Bowl /></el-icon> 主食
              </el-menu-item>
              <el-menu-item index="/layout/order" class="aka">
                <el-icon><ShoppingCart /></el-icon> 订单管理
              </el-menu-item>
            </el-menu>
          </div>
        </el-aside>

        <el-main class="el-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>

  <!-- 新订单弹窗通知 -->
  <el-dialog
    v-model="dialogVisible"
    title="🔔订单通知"
    width="500"
    :before-close="handleClose"
    close-on-click-modal="false"
  >
    <span>{{ orderMsg.content }}</span>
    <p style="margin-top:10px;color:#666">订单编号：{{ orderMsg.orderId }}</p>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">稍后查看</el-button>
        <el-button type="primary" @click="goOrderPage">前往查看订单</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.header {
  background-image: linear-gradient(to right, #ffffff, #ffffff, #DE2910);
  border: 1px solid #eee;
}
.title {
  color: #b91f1f;
  font-size: 40px;
  font-family: 楷体;
  line-height: 60px;
  font-weight: bolder;
}
.right_tool {
  float: right;
  line-height: 60px;
}
a {
  color: #333;
  text-decoration: none;
}
.aside {
  width: 220px;
  border-right: 1px solid #eee;
  height: calc(100vh - 62px);
  background: #ffd8d8;
}
.side-menu {
  height: 100%;
  --el-menu-bg-color: #ffd8d8;
  --el-menu-text-color: #333333;
  --el-menu-active-text-color: #DE2910;
  --el-menu-hover-text-color: #DE2910;
  font-family: 楷体;
}
.aka {
  border-radius: 20px;
  background: #ffb8b8;
  margin-bottom: 5px;
}
:deep(.el-menu-item) {
  font-size: 18px !important;
}
.el-main {
  height: calc(100vh - 60px);
  overflow: auto;
  padding: 10px;
}
</style>
