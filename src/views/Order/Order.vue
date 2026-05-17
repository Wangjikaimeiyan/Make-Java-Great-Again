<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue' // 1. 导入 onUnmounted
import { queryAllSales } from '@/api/Order'
import { ElMessage } from 'element-plus' // 2. 导入 ElMessage

const temp = ref('A')
// *****************************************分页**************************************************

const currentPage2 = ref(5)
const pageSize2 = ref(100)
const background = ref(true)
const disabled = ref(false)

const handleSizeChange = (val) => {
    console.log(`${val} items per page`)
}
const handleCurrentChange = (val) => {
    console.log(`current page: ${val}`)
}
// *****************************************分页**************************************************
// 获取订单列表
const handlequery = () => {
    console.log("当前选项为：" + temp.value)
    if (temp.value == 'A') {
        console.log("未支付")
    } else if (temp.value == 'B') {
        console.log("未接单")
    } else if (temp.value == 'C') {
        console.log("进行中")
    } else if (temp.value == 'D') {
        console.log("已完成")
    }
}
// *****************************************菜品销量榜单**************************************************
//模拟菜品数据
const dishList = ref([
    // { name: '宫保鸡丁', sales: 23 },数据结构
])

// 计算最大销量，用于计算进度条百分比
const maxSales = computed(() => {
    if (dishList.value.length === 0) return 1
    return Math.max(...dishList.value.map(item => item.sales))
})

// 获取进度条宽度百分比
const getProgressWidth = (sales) => {
    return `${(sales / maxSales.value) * 100}%`
}

// 定义获取数据的函数，方便复用
const fetchSalesData = async () => {
    try {
        const res = await queryAllSales()
        if (res.code) {// 获取成功
            dishList.value = res.data
        } else {// 获取失败
            ElMessage.error(res.msg || '获取销量数据失败')
        }
    } catch (error) {
        console.error('请求出错:', error)
        ElMessage.error('网络请求异常')
    }
}

let timer = null // 用于存储定时器ID

onMounted(() => {
    // 1. 立即执行一次获取数据
    fetchSalesData()
    
    // 2. 设置定时器，每60秒（1分钟）执行一次
    timer = setInterval(() => {
        fetchSalesData()
    }, 60000)  // 60秒 = 60000毫秒
})

// 3. 组件卸载时清除定时器，防止内存泄漏
onUnmounted(() => {
    if (timer) {
        clearInterval(timer)
        timer = null
    }
})
// **********************************************订单列表************************************************
const OrderList = ref([
    { 
        id: 1,
        image: 'https://thirdwx.qlogo.cn/mmopen/vi_32/BZIqUk8zn3qlteK3PZTic7mvmsV6JweX2ue2Xn5WPeib6WTLUV9ghZOGpicDkORiawibsDS32TjT3atBsibNHEMYhULKe2WCCxCdtiaxluzLbGwXDQ/132',
    }
])
// 单个订单
const Order = ref({
    id: 1,
})
// **********************************************订单列表************************************************

// *****************************************菜品销量榜单**************************************************
</script>

<template>
    <div>
        <div class="home-container">
            <!-- 左侧 -->
            <div class="left-container">
                <!-- 此处用来显示订单选项,未完成、正处理、已完成 -->

                <el-radio-group class="top-tap" v-model="temp" @change="handlequery">
                    <el-radio-button label="A">未支付</el-radio-button>
                    <el-radio-button label="B">未接单</el-radio-button>
                    <el-radio-button label="C">进行中</el-radio-button>
                    <el-radio-button label="D">已完成</el-radio-button>
                </el-radio-group>

                <!-- ***************************************主要订单展示区域*********************************** -->
                <div class="demo-input-with-icon">
                    <el-card v-for="item in OrderList" :key="item.id">
                        
                        <div class="card-body-wrapper">
                            <!-- <template #header>Yummy hamburger</template>头部，名字 -->
                            <!-- 分为左中右三部分，左边图片，右边描述，最右边按钮 -->
                            <!-- 左：正方形图片区 -->
                            <div class="left-img">
                                <img :src="item.image" alt="dish" class="img-square" />
                            </div>
                            
                            <!-- 中：菜品介绍 -->
                            <div class="center-info">
                                <div class="dish-name1">
                                    <!-- {{ item.name }} -->
                                      66
                                </div>
                                <div class="dish-description">
                                    <!-- {{ item.detail }} -->
                                      66
                                </div>
                            </div>
                            
                            <!-- 右：操作按钮 -->
                            <div class="right-action">
                                <!-- 编辑 按钮 -->
                                <el-button type="primary" @click="" icon="Edit" class="button1">接单</el-button>
                                <!-- 删除 按钮 -->
                                <el-button type="danger" @click="" icon="Delete" class="button1">拒单</el-button>
                            </div>
                        </div>
                    </el-card>
                </div>
                <!-- ***************************************主要订单展示区域*********************************** -->
                <!-- 分页 区域 -->
                <div class="fenye-container">
                    <div class="demo-pagination-block">
                        <el-pagination v-model:current-page="currentPage2" v-model:page-size="pageSize2"
                            :page-sizes="[5, 10, 15, 30, 50, 100]" :disabled="disabled" :background="background"
                            layout="sizes, prev, pager, next" :total="1000" @size-change="handleSizeChange"
                            @current-change="handleCurrentChange" />
                    </div>
                </div>

            </div>
            <!-- 右侧 -->
            <div class="right-container">
                <!-- 右侧上方是今日营业额和总收入大约占用1/4 -->
                <div class="amount-container">
                    <!-- 标题:数据监测 -->
                    <div class="amount-item">
                        <div class="amount-item-title1">数据监测</div>
                    </div>
                    <div class="amount-item">
                        <div class="amount-item-title">&nbsp;&nbsp;&nbsp;&nbsp;今日营业额:￥{{ }}</div>
                    </div>
                    <div class="amount-item">
                        <div class="amount-item-title">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总营业额:￥{{ }}</div>
                    </div>
                </div>
                <!-- 右侧下方是渲染菜品销量排行区域 -->
                <div class="dish-sales-container">
                    <div class="ranking-header">
                        <div class="amount-item-title1">⭐销量榜单⭐</div>
                    </div>

                    <div class="ranking-list">
                        <div v-for="(item, index) in dishList" :key="index" class="ranking-item">
                            <!-- 排名序号 -->
                            <div class="rank-index" :class="'rank-' + (index + 1)">
                                {{ index + 1 }}
                            </div>

                            <!-- 菜品名称 -->
                            <div class="dish-name">{{ item.name }}</div>

                            <!-- 进度条背景 -->
                            <div class="progress-bg">
                                <!-- 进度条前景 -->
                                <div class="progress-bar" :style="{ width: getProgressWidth(item.sales) }"></div>
                            </div>

                            <!-- 销量数值 -->
                            <div class="dish-sales-num">{{ item.sales }}</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

</template>

<style scoped>
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

/*****************************************  */

.left-container {
    /* 弹性布局中的元素，默认占满剩余空间 */
    flex: 25;
    display: flex;
    /* 垂直 */
    flex-direction: column;
    /* 内部滚动 */
    overflow-y: hidden;
    min-width: 0;
    overflow-y: auto;
    flex-shrink: 0;
    margin-right: 20px;
    margin-left: 10px;
}

/* 包裹主要菜单展示区域的容器，使其占据剩余空间并可滚动 */
.demo-input-with-icon {
    flex: 1;
    /* 占据剩余高度 */
    overflow-y: auto;
    /* 内容过多时滚动 */
    margin-top: 10px;
    width: 100%;
    /* 距离右侧组件 10px */
}


/* 右侧数据分析布局 */
.right-container {
    /* 开启彈性布局,竖列排布 */
    display: flex;
    flex-direction: column;
    /* 保留你原有的彈性屬性 */
    flex: 8;
    min-width: 0;
    /* 新增：自身作為彈性容器，讓對話框自動撐滿 */
    min-height: 0;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    padding: 0.5em;
    /* 相對單位，不寫死px */
    /* 分割线 */
    border-left: 1px solid #ff7b7b;
}

/*------------------------------ 营业额和总收入 --------------------------------------*/
.amount-container {
    /* 占用1/4 */
    flex: 3;
    /* 分割线 */
    border-bottom: 1px solid #ff7b7b;
    /* 居中 */
    display: flex;
    justify-content: center;
    /* 竖直布局 */
    flex-direction: column;
}

.amount-item-title {
    flex: 1;
    font-size: 1.5em;
    color: #00000000;
    margin-bottom: 0px;
    font-weight: bold;
    /* 黑体 */
    font-family: "黑体";
    color: #385e6e;
}

.amount-item-title1 {
    flex: 1;
    font-size: 1.5em;
    color: #00000000;
    margin-bottom: 0px;
    font-weight: bold;
    text-align: center;
    /* 黑体 */
    font-family: "黑体";
    color: #385e6e;
}

.amount-item {
    /* 占用1/2 */
    flex: 1;
    /* 居中 */
    display: flex;
    justify-content: center;
    /* 竖直布局 */
    flex-direction: column;
    margin-top: 0px;
}

/*------------------------------ 营业额和总收入 --------------------------------------*/

/* 菜品销量排行 */
.dish-sales-container {
    /* 占用3/4 */
    flex: 8;
}

/* **********************************订单状态区域************************************** */
.top-tap {
    /*顶部标签 */
    display: flex;
    justify-content: center;
    margin-top: 10px;
}


/* **********************************订单状态区域************************************** */
/* **********************************分页条************************************** */
.demo-pagination-block {
    /* 移除 position: fixed; bottom: 0; left: 0; width: 100%; */
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 16px;
    /* 保留底部间距 */
    /* 不再需要固定定位 */
}

/* 分页容器 - 自动贴在底部 */
.fenye-container {
    flex-shrink: 0;
    /* 防止被压缩 */
    /* 可以加一点上边距 */
    margin-top: 10px;
}

/* **********************************分页条************************************** */
/*------------------------------ 菜品销量榜单 --------------------------------------*/
.dish-sales-container {
    /* 占用3/4 */
    flex: 8;
    display: flex;
    flex-direction: column;
    padding: 10px;
    overflow-y: auto; /* 如果榜单很长，允许内部滚动 */
}

.ranking-header {
    margin-bottom: 15px;
    text-align: center;
}

.ranking-list {
    display: flex;
    flex-direction: column;
    gap: 12px; /* 列表项之间的间距 */
}

.ranking-item {
    display: flex;
    align-items: center;
    height: 30px;
    font-size: 14px;
    color: #385e6e;
}

/* 排名序号样式 */
.rank-index {
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 50%;
    background-color: #eee;
    color: #666;
    font-weight: bold;
    margin-right: 10px;
    font-size: 12px;
}

/* 前三名高亮显示 */
.rank-1 {
    background-color: #ff4d4f;
    color: white;
}
.rank-2 {
    background-color: #ff7a45;
    color: white;
}
.rank-3 {
    background-color: #ffa940;
    color: white;
}

.dish-name {
    width: 80px; /* 固定名称宽度，保持对齐 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 10px;
    font-weight: bold;
}

/* 进度条容器 */
.progress-bg {
    flex: 1; /* 占据剩余空间 */
    height: 8px;
    background-color: #f0f0f0;
    border-radius: 4px;
    margin-right: 10px;
    overflow: hidden;
    position: relative;
}

/* 进度条填充 */
.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #385e6e 0%, #5a8a9e 100%); /* 使用主题色系渐变 */
    border-radius: 4px;
    transition: width 0.5s ease-in-out; /* 增加动画效果 */
}

.dish-sales-num {
    width: 40px;
    text-align: right;
    font-weight: bold;
    color: #ff7b7b; /* 使用强调色显示数字 */
}
/*------------------------------ 菜品销量榜单 --------------------------------------*/
/*------------------------------ 订单列表 --------------------------------------*/
.card-body-wrapper {
    display: flex;
    width: 100%;
    height: 135px;
    /* 垂直居中 */
    /* align-items: center; */
    gap: 20px;
    padding: 0;
    /* 圆角 */
    border-radius: 10px;
    /* margin-right: 10px; */
}
.left-img {
  /* width: 22%; */
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 中：自适应占满 */
.center-info {
  flex: 10;
  margin-left: 20px;
  margin-top: 0;
  align-self: flex-start;
}
.dish-name1 {
  margin-top: 0.05%;
  font-size: 40px;
  color: rgb(255, 94, 0);
  font-family: "楷体", "KaiTi", serif;
}
.right-action{
    flex: 3;
}
.button1 {
  margin-top: 50%;
  text-align: center;
}
/*------------------------------ 订单列表 --------------------------------------*/
</style>
