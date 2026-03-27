<script setup>
import { ref } from 'vue'
import { loginApi } from '@/api/login'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const loginForm = ref({ account: '', password: '' })
const router = useRouter()

// ========== 粒子配置：随机运动 + 动态连线 + 颜色动画 ==========
const particleOptions = {
  background: { color: { value: "transparent" } }, // 透明背景，让波浪背景透出
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "grab", // 鼠标悬浮时拉近连线
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 180,
        links: { opacity: 0.8, color: "#ffaa66" }, // 悬浮时连线高亮
      },
    },
  },
  particles: {
    color: {
      value: ["#ff6600", "#ff8844", "#ffaa66", "#ffcc88"], // 粒子颜色池，随机取色
      animation: {
        h: { enable: true, speed: 20, sync: false }, // 色相动画，让颜色缓慢变化
      },
    },
    links: {
      enable: true,          // 开启连线
      distance: 130,        // 连线最大距离
      color: "#ffaa66",     // 连线基础颜色
      opacity: 0.4,
      width: 1.2,
      triangles: { enable: false }, // 三角形网格（如果开启会形成三角面，也可尝试）
    },
    move: {
      enable: true,
      speed: 1.5,           // 运动速度
      direction: "none",    // 随机方向
      random: true,         // 随机移动
      straight: false,
      outModes: {
        default: "bounce",  // 边界反弹（也可用 "out" 循环）
      },
      attract: { enable: false },
    },
    number: {
      density: { enable: true, area: 800 },
      value: 80,            // 粒子数量（根据性能可调整）
    },
    opacity: {
      value: 0.6,
      animation: {
        enable: true,
        speed: 0.5,
        minimumValue: 0.2,
        sync: false,
      },
    },
    size: {
      value: { min: 1.5, max: 3 }, // 随机大小
      animation: {
        enable: true,
        speed: 2,
        minimumValue: 0.8,
        sync: false,
      },
    },
  },
  detectRetina: true,
}

// 登录方法（与之前相同）
const login = async () => {
  try {
    const result = await loginApi(loginForm.value)
    if (result.code === 200 || result.code) {
      ElMessage.success('登入成功')
      localStorage.setItem('loginToken', JSON.stringify(result.data))
      router.push('/layout')
    } else {
      ElMessage.error(result.msg || '登录失败')
    }
  } catch (err) {
    ElMessage.error('网络异常，请稍后重试')
    console.error(err)
  }
}

// 重置表单
const clear = () => {
  loginForm.value = { account: '', password: '' }
}
</script>

<template>
  <div id="container">
    <!-- 波浪呼吸背景层 -->
    <div class="wave-bg"></div>

    <!-- 粒子层（全局注册后直接使用） -->
    <Particles
      id="particle-bg"
      :options="particleOptions"
    />

    <!-- 登录表单 -->
    <div class="login-form">
      <el-form label-width="80px">
        <p class="title">智能餐飲登入</p>
        <el-form-item label="用戶名">
          <el-input v-model="loginForm.account" placeholder="請輸入用戶名"></el-input>
        </el-form-item>
        <el-form-item label="密碼">
          <el-input type="password" v-model="loginForm.password" placeholder="請輸入密碼"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" @click="login">登 入</el-button>
          <el-button class="button" type="info" @click="clear">重 置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
/* 容器全屏居中 */
#container {
  width: 100vw;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 波浪呼吸背景（保持之前的热烈氛围） */
.wave-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  background: radial-gradient(circle at 30% 40%, #ff8c42, #d93b1a, #b32d0e);
  background-size: 200% 200%;
  animation: gradientBreathing 5s ease-in-out infinite alternate;
}

.wave-bg::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 140, 0, 0.3) 0%, rgba(255, 60, 0, 0.2) 30%, transparent 70%);
  animation: waveExpand 6s ease-in-out infinite;
  pointer-events: none;
}

/* .wave-bg::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(90deg,
      rgba(255, 200, 100, 0.2) 0px,
      rgba(255, 200, 100, 0.2) 2px,
      transparent 2px,
      transparent 20px);
  animation: slideWave 8s linear infinite;
  pointer-events: none;
} */

@keyframes waveExpand {
  0% { transform: scale(0.8); opacity: 0.2; }
  50% { transform: scale(1.2); opacity: 0.5; }
  100% { transform: scale(0.8); opacity: 0.2; }
}

@keyframes slideWave {
  0% { background-position: 0 0; }
  100% { background-position: 100px 0; }
}

@keyframes gradientBreathing {
  0% { background-size: 100% 100%; filter: brightness(1); }
  100% { background-size: 150% 150%; filter: brightness(1.1); }
}

/* 粒子层置于波浪背景之上，表单之下 */
#particle-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: auto; /* 允许鼠标与粒子交互（如悬浮高亮） */
}

/* 登录表单样式 */
.login-form {
  position: relative;
  z-index: 2;
  max-width: 400px;
  width: 90%;
  padding: 30px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.title {
  font-size: 30px;
  font-family: '楷体', 'Microsoft YaHei', sans-serif;
  text-align: center;
  margin-bottom: 30px;
  font-weight: bold;
  color: #e67e22;
}

.button {
  width: 48%;
  margin-top: 10px;
}

.el-form-item {
  margin-bottom: 22px;
}
</style>