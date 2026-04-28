<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Lock, Right } from '@element-plus/icons-vue';
import { updateShopStatus,queryShopStatus } from '@/api/Statue'

const username = ref('');
const router = useRouter();
// 退出登录
const logout = () => {
  ElMessageBox.confirm(
    '此操作将退出登录, 是否继续?',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', }
  ).then(async () => {
    // 提示信息
    ElMessage.success("退出登录成功");
    // 清空localStorage中的登录信息
    localStorage.removeItem('loginToken');
    // 跳转到登录页面
    router.push('/login');
  }).catch(() => {
    ElMessage.info('已取消退出登录')
  })
}

// 获取用户名
const getUsername = () => {
  // 从localStorage中获取用户名
  const tempdata = JSON.parse(localStorage.getItem('loginToken'));
  if (tempdata && tempdata.name) {
    username.value = tempdata.name;
  }
}
// 钩子函数
onMounted(() => {
  getUsername();
  queryShopStatus().then(res => {
    shopStatus.value = res.data;
  })
})
// 状态变量
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
    // 先提交修改接口
    await updateShopStatus(1)
    // 再重新拉取最新状态
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
        <!-- 左侧菜单 -->
        <el-aside width="200px" class="aside">
          <div class="side-menu">
            <el-menu default-active="/layout/home" router="true">
              <!-- rputer是路由跳转，按照index来访问 -->


              <!-- 路由组件 -->
              <!-- <router-link to="home"> -->
              <el-menu-item index="/layout/home" class="aka">
                <el-icon>
                  <House />
                </el-icon> 首页
              </el-menu-item>
              <!-- </router-link> -->
              <el-menu-item index="/layout/chuan" class="aka">
                <el-icon>
                  <KnifeFork />
                </el-icon> 川菜
              </el-menu-item>
              <el-menu-item index="/layout/xiang" class="aka">
                <el-icon>
                  <ForkSpoon />
                </el-icon> 湘菜
              </el-menu-item>
              <el-menu-item index="/layout/lu" class="aka">
                <el-icon>
                  <DishDot />
                </el-icon> 鲁菜
              </el-menu-item>
              <el-menu-item index="/layout/zhu" class="aka">
                <el-icon>
                  <Bowl />
                </el-icon> 主食
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
</template>

<style scoped>
/* .header { 
  background-image: linear-gradient(to right, #003399, #FF0000); 
} */
/* .header { 
  background-image: linear-gradient(to right, #003399, #FFFFFF, #FF0000); 
}  */
/* .header {
  background-image: linear-gradient(to right, #e9e9e9, #f5f5f5);
} */
.header {
  background-image: linear-gradient(to right, #ffffff, #ffffff, #DE2910);
  border: 1px solid #eee;
}

/* .header { 
  background-image: linear-gradient(to left, #ffffff, #DE2910); 
} */





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
  color: white;
  text-decoration: none;
}

.aside {
  width: 220px;
  border-right: 1px solid #eee;
  /* height: 100vh; */
  /* height: 730px; */
  height: calc(100vh - 62px);
  background: #ffd8d8;
  /* padding: 10px; */
  /* border-radius: 20px; */
}

.side-menu {
  height: 100%;
  border-right: none;
  border-radius: 6px;
  /* 背景色 */
  background-color: transparent;
  --el-menu-bg-color: #ffd8d8;
  --el-menu-text-color: #333333;
  --el-menu-active-text-color: #DE2910;
  --el-menu-hover-text-color: #DE2910;
  font-family: 楷体;
  /* background: #ffd8d8; */
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
  /* 可选，让内容不贴边 */
}
</style>
