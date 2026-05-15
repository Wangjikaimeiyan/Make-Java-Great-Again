<script setup>

import { ref, onMounted, watch, nextTick } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { queryAllApi, queryApiFilter, queryinfoId, updateDish, addDish, deleteDish,aichat } from '@/api/Chuan'
import { ElCol, ElMessage, ElMessageBox } from 'element-plus'

const input1 = ref('')
const input2 = ref('')

// 定义菜品列表
const dishList = ref([])
// ding菜列表查询
const queryAlldishes = async () => {
  const res = await queryAllApi()
  if (res.code) {
    dishList.value = res.data
  } else {
    ElMessage.error(res.msg)
  }
}
// 钩子函数
onMounted(() => {
  queryAlldishes();
})
// 定义条件查询名字价格
const price = ref('')
const name = ref('')
// 使用侦听函数input1，input2
// 监听菜品名称
watch(() => input1.value, (newVal) => {
  name.value = newVal
})

// 监听价格
watch(() => input2.value, (newVal) => {
  price.value = newVal
})
// 条件查询
const queryApi = async () => {
  const res = await queryApiFilter(name.value, price.value)
  if (res.code) {
    dishList.value = res.data
  } else {
    ElMessage.error(res.msg)
  }
}
// 重置
const reset = () => {
  input1.value = ''
  input2.value = ''
  queryAlldishes()
}
// 编辑
const edit = async (id) => {
  uploadRef.value?.clearFiles()
  //  调用根据id查询
  const res = await queryinfoId(id)
  if (res.code) {// 获取成功
    dish.value = res.data
    imageUrl.value = res.data.image
  } else {// 获取失败
    ElMessage.error(res.msg)
  }
  isImageChanged.value = false
  dialogVisible.value = true
  dialogTitle.value = '编辑菜品'
}
// 新增
const add = () => {
  // 清空表单
  dish.value = {
    id: '',
    name: '',
    price: null,
    detail: '',
    image: '',
    category: '',
  }
  uploadRef.value?.clearFiles()
  isImageChanged.value = false
  dialogVisible.value = true
  dialogTitle.value = '新增菜品'
}
// 定义对话单个数据模型
const dish = ref({
  id: '',
  name: '',
  price: null,
  detail: '',
  image: '',
  category: '',
})
// 定义dialogVisible
const dialogVisible = ref(false)
// 定义对话框标题
let dialogTitle = ref('')
// 表单校验
//表单校验规则
const rules = ref({
  name: [
    { required: true, message: '请输入菜品名', trigger: 'blur' },
    { min: 1, max: 20, message: '用户名长度应在到20个字符之间', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'float', message: '价格是浮点数', trigger: 'blur' }
  ],
  detail: [
    { required: true, message: '请输入菜品描述', trigger: 'blur' },
    { min: 1, max: 300, message: '描述长度应在到300个字符之间', trigger: 'blur' }
  ],
});
// 定义表单校验
const formRef = ref();
// 保存
const save = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {// 校验通过
      let result = {};
      if (dish.value.id) {
        // 执行修改
        const formData = new FormData();
        formData.append('id', dish.value.id)
        formData.append('name', dish.value.name)
        formData.append('price', dish.value.price)
        formData.append('detail', dish.value.detail)
        formData.append('category', dish.value.category)
        console.log('图片', isImageChanged.value)
        console.log('图片', imageFile.value?.raw)
        if (isImageChanged.value) {// 图片改变了
          formData.append('image', imageFile.value)
        }
        result = await updateDish(formData);
        // 释放
        imageFile.value = null
        isImageChanged.value = false
      } else {
        // 执行新增
        // result = await addApi(employee.value);
        const formData = new FormData();
        formData.append('name', dish.value.name)
        formData.append('price', dish.value.price)
        formData.append('detail', dish.value.detail)
        formData.append('category', dish.value.category)
        if (imageFile.value) {// 图片选择了
          formData.append('image', imageFile.value)
        }
        result = await addDish(formData);
        imageFile.value = null
        dialogVisible.value = false;
      }

      if (result.code) {
        uploadRef.value?.clearFiles()
        ElMessage.success('保存成功');
        dialogVisible.value = false;
        queryAlldishes();
      } else {// 失败
        ElMessage.error(result.msg);
      }
    } else {// 失败
      ElMessage.error("你填错了信息,再看看吧");
    }
  });
}
// 点击取消形按钮
const cancel = () => {
  nextTick(() => {
    if (formRef.value) {
      formRef.value.resetFields()
    }
  })

  isImageChanged.value = false
  imageFile.value = null
  imageUrl.value = ''
  
  dialogVisible.value = false
}
// 菜品类别
const categoryList = ref([
  { id: 1, name: '川菜' },
  { id: 2, name: '湘菜' },
  { id: 3, name: '鲁菜' },
  { id: 4, name: '主食' }
])
// 引用隐藏的 el-upload 组件实例
const uploadRef = ref(null)
// 预览图片的临时 URL（用于 img 标签展示）
const imageUrl = ref('')
// 存储用户选择的原始文件对象（用于最终提交）
const imageFile = ref(null)

/**
 * 触发文件选择器
 * 通过 el-upload 组件内部的 input 元素手动调用 click 方法
 */
const triggerUpload = () => {
  // 获取 el-upload 组件内部的原生 input 元素并触发点击
  uploadRef.value.$el.querySelector('input').click()
  // uploadRef.value?.click()无法使用
}

/**
 * 图片选择变更事件处理选中的文件对象，包含 raw 原始文件
 */
const isImageChanged = ref(false)   // 标记图片是否改变
const handleImageChange = (file) => {/*触发事件：图片选择成功时触发*/
  console.log(file, "触发")
  // 限制文件大小不超过 10MB
  const isLt10M = file.raw.size / 1024 / 1024 < 10
  if (!isLt10M) {
    ElMessage.error('图片大小不能超过 10MB!')
    return
  }

  // 保存原始文件，用于后续表单提交
  imageFile.value = file.raw

  // 清理之前的预览 URL，避免内存泄漏
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value)
  }

  // 生成新的预览 URL，并赋值给 imageUrl
  imageUrl.value = URL.createObjectURL(file.raw)
  // 给flag 为true，表示图片要改变
  isImageChanged.value = true
  console.log('生成的 imageUrl:', imageUrl.value)
}

/**
 * 超出上传数量限制时的处理（limit=1）
 */
const handleExceed = () => {
  ElMessage.warning('只能上传一张图片！')
}
// 删除
const deleteThisDish = async (id) => {
  ElMessageBox.confirm(
    '此操作将永久删除该员工, 是否继续?',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', }
  ).then(async () => {
    const result = await deleteDish(id);
    if (result.code) {  //js隐式类型转换
      // 提示信息
      ElMessage.success("删除成功");
      // 刷新
      queryAlldishes();
    }
  })
}
// AI
// 消息列表
const messageList = ref([
  { role: 'assistant', content: '你好！我是 AI 助手，有什麼可以幫你？' }
])

// 使用者輸入內容
const userInput = ref('')
// 聊天區域DOM，用於自動滾動
const chatBodyRef = ref(null)

// 發送消息核心邏輯
// 发送消息核心逻辑（流式版，不依赖 axios）
const sendMessage = async () => {
  const content = userInput.value.trim()
  if (!content) return

  // 加入用户消息
  messageList.value.push({ role: 'user', content })
  userInput.value = ''

  // 自动滚动到底部
  await nextTick(() => {
    const el = chatBodyRef.value
    el.scrollTop = el.scrollHeight
  })

  try {
    // 先插入空的AI消息，用于逐字拼接
    const aiMsg = { role: 'assistant', content: '' }
    messageList.value.push(aiMsg)

    // 调用你封装的 aichat 流式接口
    await aichat(content, (text) => {
      aiMsg.content = aiMsg.content + text
      // 强制刷新视图
      messageList.value = [...messageList.value]
      // 实时滚动到底部
      nextTick(() => {
        const el = chatBodyRef.value
        el.scrollTop = el.scrollHeight
      })
    })

  } catch (err) {
    messageList.value.push({
      role: 'assistant',
      content: '服务异常，请稍后重试'
    })
    console.error('AI对话失败:', err)
  }

  await nextTick(() => {
    const el = chatBodyRef.value
    el.scrollTop = el.scrollHeight
  })
}


</script>

<template>
  <div>
    <div class="home-container">
      <!-- 左侧 -->
      <div class="left-container">
        <!-- 查询栏目，输入数据有 -->
        <div class="demo-input-with-icon">
          <div class="input-group">
            <div class="input-container">
              <span class="label">
                搜索菜品:
              </span>
              <el-input v-model="input1" class="responsive-input" placeholder="请输入菜品名字" :prefix-icon="Search" />
              <span class="label">
                价格筛选:
              </span>
              <el-input v-model="input2" class="responsive-input" placeholder="筛选最高价" :prefix-icon="Search" />
              <!-- 查询，重置按钮 -->
              <el-button type="primary" @click="queryApi" icon="Search">查询</el-button>
              <el-button type="info" @click="reset" icon="Refresh">重置</el-button>
              <el-button type="info" @click="add" icon="Plus">添加</el-button>
            </div>
          </div>
        </div>



        <!-- 主要菜单展示区域 -->
        <div class="demo-input-with-icon">
          <el-card v-for="item in dishList" :key="item.id">

            <div class="card-body-wrapper">
              <!-- <template #header>Yummy hamburger</template>头部，名字 -->
              <!-- 分为左中右三部分，左边图片，右边描述，最右边按钮 -->
              <!-- 左：正方形图片区 -->
              <div class="left-img">
                <img :src="item.image" alt="dish" class="img-square" />

              </div>

              <!-- 中：菜品介绍 -->
              <div class="center-info">
                <div class="dish-name">
                  {{ item.name }}
                </div>
                <div class="dish-description">
                  {{ item.detail }}
                </div>
              </div>

              <!-- 右：操作按钮 -->
              <div class="right-action">
                <!-- 价格 -->
                <div class="price">
                  ￥ {{ item.price }}
                  <!-- 换行 -->
                   <br />
                   <!-- 总销量： -->
                    <div class="sales">总销量:{{item.sales}}</div>
                </div>
                <!-- 编辑 按钮 -->
                <el-button type="primary" @click="edit(item.id)" icon="Edit" class="button">编辑</el-button>
                <!-- 删除 按钮 -->
                <el-button type="danger" @click="deleteThisDish(item.id)" icon="Delete" class="button">删除</el-button>
              </div>
            </div>
          </el-card>
        </div>


      </div>
      <!-- 右侧 -->
      <div class="right-container">
        <!-- AI 閒聊對話框 -->
        <div class="ai-chat-box">
          <div class="chat-header">AI 助手</div>

          <!-- 消息列表區域 -->
          <div class="chat-body" ref="chatBodyRef">
            <div v-for="(msg, index) in messageList" :key="index" class="msg-item" :class="msg.role">
              {{ msg.content }}
            </div>
          </div>

          <!-- 輸入區域 -->
          <div class="chat-footer">
            <el-input v-model="userInput" type="textarea" :rows="2" placeholder="請輸入消息..." @keyup.enter="sendMessage" />
            <el-button type="primary" @click="sendMessage">發送</el-button>
          </div>
        </div>
      </div>

    </div>
  </div>
  <!-- 定义菜品列表 -->
  <!-- 对话框 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle"
    destroy-on-close @close="cancel"><!--dialogVisible: 控制对话框的显示与隐藏, dialogTitle: 对话框的标题-->
    <el-form :model="dish" :rules="rules" ref="formRef" label-width="80px"><!-- employee: 员工数据模型 -->
      <!-- 基本信息 -->
      <!-- 第一行 -->
      <el-row :gutter="20"><!-- 一行的列数, 20是间隔, 20px是间隔的宽度-->
        <el-col :span="24"><!-- 一列的宽度,12是12/24的列,24份据均分的-->
          <!-- 使用prop指定校验规则 -->
          <el-form-item label="菜品名称" prop="name">
            <el-input v-model="dish.name" placeholder="菜品名称,1-20个字"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="菜品价格" prop="price">
            <el-input type="number" v-model.number="dish.price" placeholder="菜品价格,数字类型"></el-input>
          </el-form-item>
        </el-col>
        <!-- 菜品描述 -->
        <el-col :span="24">
          <el-form-item label="菜品描述" prop="detail">
            <el-input v-model="dish.detail" placeholder="菜品描述,1-100个字"></el-input>
          </el-form-item>
        </el-col>



        <el-col :span="24">
          <el-form-item label="图片">
            <!-- 隐藏的 el-upload，只用于管理文件选择逻辑 -->
            <el-upload ref="uploadRef" :auto-upload="false" :limit="1" :on-change="handleImageChange"
              :on-exceed="handleExceed" accept="image/jpeg,image/png,image/jpg" :show-file-list="false" />

            <!-- 自定义预览区域，点击触发上传 -->
            <div class="image-preview" @click="triggerUpload">
              <img v-if="imageUrl" :src="imageUrl" alt="预览" class="preview-img" />
              <el-icon v-else>
                <Plus />
              </el-icon>
              <div v-if="!imageUrl" class="upload-tip">点击上传图片</div>
            </div>
          </el-form-item>
        </el-col>





        <!-- 下拉表单 -->
        <el-col :span="24">
          <el-form-item label="所属类别" prop="category">
            <el-select v-model="dish.category" placeholder="请选择所属类别">
              <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>


      </el-row>


    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.preview-img {
  width: 150px;
  height: 150px;
  object-fit: fill;
}

.button {
  margin-top: 70%;
  text-align: center;
}

.price {
  color: red;
  font-size: 30px;
  margin-top: 15%;
  /* 左右居中 */
  margin-left: 11%;
}

.sales {
  color: red;
  font-size: 15px;
  /* margin-top: 15%; */
  /* 左右居中 */
  margin-left: 11%;
}

.home-container {
  display: flex;
  /* 核心：开启弹性布局 */
  width: 100%;
  flex-direction: row;
  height: 90.5vh;
  /* overflow: hidden; */
  /* height: 100%; */
  /* flex-direction: column; */
  /* 设置主轴方向为纵向 */
}

.left-container {
  /* 弹性布局中的元素，默认占满剩余空间 */
  flex: 25;
  min-width: 0;
  overflow-y: auto;
  flex-shrink: 0;
}


.right-container {
  /* 弹性布局中的元素，默认占满剩余空间 */
  flex: 5;
  min-width: 0;
}

/* 输入框样式 */
.demo-input-with-icon {
  margin-top: 10px;
  /* margin-left: 15px; */
  width: 100%;
}

.input-group {
  margin-bottom: 1.5rem;
}

.label {
  /* margin-top: 5px; */
  white-space: nowrap;
  color: var(--el-text-color-regular);
}

.input-container {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.responsive-input {
  width: 240px;
}

@media (max-width: 768px) {
  .input-container {
    flex-direction: column;
    gap: 1rem;
  }

  .responsive-input {
    width: 100%;
  }
}

/* 菜单样式 */
/* 只加这一句 */
:deep(.el-card) {
  border-radius: 12px;
  margin-bottom: 15px;
}

.card-body-wrapper {
  display: flex;
  width: 100%;
  height: 250px;


  /* 垂直居中 */
  /* align-items: center; */
  gap: 20px;
  padding: 0;
  /* 圆角 */
  border-radius: 10px;
}

/* 左：动态正方形 */
.left-img {
  width: 22%;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.img-square {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
}

/* 中：自适应占满 */
.center-info {
  flex: 10;
  margin-left: 20px;
  margin-top: 0;
  align-self: flex-start;
}



.dish-name {
  margin-top: 0.05%;
  font-size: 40px;
  color: rgb(255, 94, 0);
  font-family: "楷体", "KaiTi", serif;
}

.dish-description {
  font-size: 20px;
  color: rgb(0, 0, 0);
  font-family: "楷体", "KaiTi", serif;
  /* 靠底部 */

}
/* AI */
.right-container {
  /* 保留你原有的彈性屬性 */
  flex: 9;
  min-width: 0;
  /* 新增：自身作為彈性容器，讓對話框自動撐滿 */
  min-height: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  padding: 0.5em;
  /* 相對單位，不寫死px */
}

/* 對話框外框：完全撐滿父容器，無固定寬高 */
.ai-chat-box {
  margin-left: 20px;
  flex: 1;
  min-height: 0;
  width: 97%;
  display: flex;
  flex-direction: column;
  border: 0.0625em solid #eee;
  /* 相對單位，對應1px */
  border-radius: 0.5em;
  overflow: hidden;
  background: #fff;
  position: relative;
}

/* 對話框頭部：不隨容器收縮 */
.chat-header {
  padding: 0.75em;
  background: #409eff;
  color: #fff;
  font-weight: bold;
  text-align: center;
  flex-shrink: 0;
}

/* 消息列表：自動佔滿剩餘空間 */
.chat-body {
  flex: 1;
  padding: 0.625em;
  overflow-y: auto;
  min-height: 0%;
  background: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 0.625em;
  /* 消息間距，相對單位 */
}

/* 消息項：無固定margin，靠flex對齊 */
.msg-item {
  padding: 0.5em 0.75em;
  border-radius: 0.375em;
  max-width: 75%;
  /* 相對寬度，不寫死px */
  word-break: break-all;
  flex-shrink: 0;
}

/* 用戶消息靠右 */
.msg-item.user {
  background: #409eff;
  color: white;
  align-self: flex-end;
}

/* AI消息靠左 */
.msg-item.assistant {
  background: white;
  border: 0.0625em solid #eee;
  align-self: flex-start;
}

/* 底部輸入區：不隨容器收縮 */
.chat-footer {
  display: flex;
  gap: 0.5em;
  padding: 0.625em;
  border-top: 0.0625em solid #eee;
  flex-shrink: 0;
  /* 固定在下方 */

}

/* 輸入框自動佔滿剩餘寬度 */
.chat-footer :deep(.el-textarea) {
  flex: 1;
  min-width: 0;
  /* 防止輸入框撐破彈性容器 */
}
</style>