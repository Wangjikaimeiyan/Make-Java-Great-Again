<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue' // 1. 导入 onUnmounted
import { queryAllSales, queryAllNotPay, queryAllNotFinish, queryAllInProgress, queryAllFinished, 
    acceptOrder, rejectOrder, finishOrder,queryOrderById,queryTodayTurnover,queryAllTurnover,serviceOrder } from '@/api/Order'
import { ElMessage, ElMessageBox } from 'element-plus' // 2. 导入 ElMessage

const temp = ref('A')
// *****************************************分页**************************************************

const currentPage2 = ref(1) // 当前页数
const pageSize2 = ref(5) // 每页显示的条数
const background = ref(true) // 是否显示背景颜色
const disabled = ref(false) // 是否禁用
const total = ref(0) // 总数

const handleSizeChange = (val) => {//每页条数改变时触发
    console.log(`${val} items per page`)
    console.log("当前选项为：" + temp.value)
    if (temp.value == 'A') {
        OrderList.value = []
        getAllNotPay()
    } else if (temp.value == 'B') {
        // 清空表单
        OrderList.value = []
        // 获取未接单订单
        getAllNotFinish()
    } else if (temp.value == 'C') {
        OrderList.value = []
        getAllInProgress()
    } else if (temp.value == 'D') {
        OrderList.value = []
        getAllFinished()
    }
}
const handleCurrentChange = (val) => {//页码改变时触发
    console.log(`current page: ${val}`)
    console.log("当前选项为：" + temp.value)
    if (temp.value == 'A') {
        // 将当前页码赋值1
        OrderList.value = []
        getAllNotPay()
    } else if (temp.value == 'B') {
        // 清空表单
        OrderList.value = []
        // 获取未接单订单
        getAllNotFinish()
    } else if (temp.value == 'C') {
        OrderList.value = []
        getAllInProgress()
    } else if (temp.value == 'D') {
        OrderList.value = []
        getAllFinished()
    }
}
// *****************************************分页**************************************************
// 获取订单列表
const handlequery = () => {
    console.log("当前选项为：" + temp.value)
    if (temp.value == 'A') {
        // 将当前页码赋值1
        currentPage2.value = 1
        OrderList.value = []
        getAllNotPay()
    } else if (temp.value == 'B') {
        currentPage2.value = 1
        // 清空表单
        OrderList.value = []
        // 获取未接单订单
        getAllNotFinish()
    } else if (temp.value == 'C') {
        currentPage2.value = 1
        OrderList.value = []
        getAllInProgress()
    } else if (temp.value == 'D') {
        currentPage2.value = 1
        OrderList.value = []
        getAllFinished()
    }
}
// *****************************************菜品销量榜单**************************************************
//模拟菜品数据
const dishList = ref([])

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
let timer2 = null
let timer3 = null

onMounted(() => {
    // 1. 立即执行一次获取数据
    fetchSalesData()
    // 获取未支付订单
    getAllNotPay()

    // 2. 设置定时器，每60秒（1分钟）执行一次
    timer = setInterval(() => {
        fetchSalesData()
    }, 60000)  // 60秒 = 60000毫秒

    // 获取营业额
    getAllTurnover()
    getTodayTurnover()
    // 每日营业额10分钟获取一次，总的营业额12小时获取一次
    timer2 = setInterval(() => {
        getTodayTurnover()
    }, 600000)
    timer3 = setInterval(() => {
        getAllTurnover()
    }, 43200000)
})

// 3. 组件卸载时清除定时器，防止内存泄漏
onUnmounted(() => {
    if (timer) {
        clearInterval(timer)
        timer = null
    }
    if (timer2) {
        clearInterval(timer2)
        timer2 = null
    }
    if (timer3) {
        clearInterval(timer3)
        timer3 = null
    }
})
// **********************************************订单列表************************************************
const OrderList = ref([])
// 获取未支付订单
const getAllNotPay = async () => {
    const result = await queryAllNotPay(currentPage2.value, pageSize2.value)
    if (result.code) {// 获取成功
        total.value = result.data.total
        OrderList.value = result.data.rows
    } else {// 获取失败
        ElMessage.error(result.msg || '获取订单数据失败')
    }
}
// 获取接单订单
const getAllNotFinish = async () => {
    const result = await queryAllNotFinish(currentPage2.value, pageSize2.value)
    if (result.code) {// 获取成功
        total.value = result.data.total
        OrderList.value = result.data.rows
    } else {// 获取失败
        ElMessage.error(result.msg || '获取订单数据失败')
    }
}
// 获取处理中订单
const getAllInProgress = async () => {
    const result = await queryAllInProgress(currentPage2.value, pageSize2.value)
    if (result.code) {// 获取成功
        total.value = result.data.total
        OrderList.value = result.data.rows
    } else {// 获取失败
        ElMessage.error(result.msg || '获取订单数据失败')
    }
}
// 获取处理完成订单
const getAllFinished = async () => {
    const result = await queryAllFinished(currentPage2.value, pageSize2.value)
    if (result.code) {// 获取成功
        total.value = result.data.total
        OrderList.value = result.data.rows
    } else {// 获取失败
        ElMessage.error(result.msg || '获取订单数据失败')
    }
}
// **********************************************订单列表************************************************
// **********************************************展示订单详情************************************************
// 打开订单详情
const handleShowDetail = async (orderId) => {
    // 如果你后面要调接口，就在这里 queryOrderById(item.orderId)
    getOrderById(orderId)
    // 这里先直接用示例数据演示
    detailDialogVisible.value = true
}

// **********************************************展示订单详情************************************************
// **********************************************订单交互功能************************************************
// 接单
const handleAcceptOrder = async (id) => {
    try {
        // 弹出确认框，只有点确定才往下走
        await ElMessageBox.confirm('确定要接单吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })

        // 走到这里 = 用户点了确定
        const res = await acceptOrder(id)
        if (res.code) {
            ElMessage.success(res.data)
            getAllNotFinish() // 刷新列表
        } else {
            ElMessage.error(res.msg)
        }
    } catch {
        // 用户点取消、关闭弹窗，直接进这里，什么都不执行
        ElMessage.info('已取消接单')
    }
}
// 拒绝接单
const handleRejectOrder = async (id) => {
    try {
        // 弹出确认框，只有点确定才往下走
        await ElMessageBox.confirm('确定要拒绝接单吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })

        // 走到这里 = 用户点了确定
        const res = await rejectOrder(id)
        if (res.code) {
            ElMessage.success(res.data)
            getAllNotFinish() // 刷新列表
        } else {
            ElMessage.error(res.msg)
        }
    } catch {
        // 用户点取消、关闭弹窗，直接进这里，什么都不执行
        ElMessage.info('已取消拒单')
    }
}
// 完成订单
const handleFinishOrder = async (id) => {
    try {
        // 弹出确认框，只有点确定才往下走
        await ElMessageBox.confirm('确定要完成订单吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })

        // 走到这里 = 用户点了确定
        const res = await finishOrder(id)
        if (res.code) {
            ElMessage.success(res.data)
            // 刷新进行中
            getAllInProgress()
        } else {
            ElMessage.error(res.msg)
        }
    } catch {
        // 用户点取消、关闭弹窗，直接进这里，什么都不执行
        ElMessage.info('已取消完成订单')
    }
}
// **********************************************订单交互功能************************************************
// **********************************************订单详情对话弹窗************************************************
// 对话框显示控制
const detailDialogVisible = ref(false)

// 当前订单详情数据（示例）
const currentOrderDetail = ref({})


// 点击确定
const handleDetailConfirm = () => {
    detailDialogVisible.value = false
    // 清空订单详情数据
    currentOrderDetail.value = {}
    ElMessage.success('已确认')
}

// **********************************************订单详情对话弹窗************************************************
// **********************************************根据orderid查询订单详情************************************************
const getOrderById = async (orderId) => { 
    const result = await queryOrderById(orderId)
    if (result.code) { 
        currentOrderDetail.value = result.data
    } else {// 获取失败
        ElMessage.error(result.msg || '获取订单数据失败')
    }
}
// **********************************************根据orderid查询订单详情************************************************
// **********************************************根据inputOrderId查询订单详情************************************************
const inputOrderId = ref('')
// **********************************************根据inputOrderId查询订单详情************************************************
// **********************************************今日营业额和总营业额************************************************
const todayTurnover = ref(0)
const allTurnover = ref(0)
// 获取今日营业额
const getTodayTurnover = async () => { 
    const result = await queryTodayTurnover()
    if (result.code) { 
        todayTurnover.value = result.data
    } else if (result.data === null){// 获取失败
        ElMessage.error(result.msg || '获取今日营业额数据失败')
    }
}
// 获取总营业额
const getAllTurnover = async () => { 
    const result = await queryAllTurnover()
    if (result.code) { 
        allTurnover.value = result.data
    } else if (result.data === null) {// 获取失败
        ElMessage.error(result.msg || '获取总营业额数据失败')
    }
}
// **********************************************今日营业额和总营业额************************************************
// **********************************************售后服务************************************************
const handleServiceOrder = async (id) => { 
    try {
        // 弹出确认框，只有点确定才往下走
        await ElMessageBox.confirm('确定要处理退款吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })

        // 走到这里 = 用户点了确定
        const res = await serviceOrder(id)
        if (res.code) {
            ElMessage.success(res.data)
            // 重新获取已完成订单
            getAllFinished()
        } else {
            ElMessage.error(res.msg)
        }
    } catch {
        // 用户点取消、关闭弹窗，直接进这里，什么都不执行
        ElMessage.info('已取消售后处理')
    }
}
// **********************************************售后服务************************************************

</script>

<template>
    <div>
        <div class="home-container">
            <!-- 左侧 -->
            <div class="left-container">
                <!-- 此处用来显示订单选项,未完成、正处理、已完成 -->
                <div class="top-container">
                    <el-radio-group class="top-tap" v-model="temp" @change="handlequery">
                        <!-- A绑定未支付订单调查函数 -->
                        <el-radio-button label="A">未支付</el-radio-button>
                        <el-radio-button label="B">未接单</el-radio-button>
                        <el-radio-button label="C">进行中</el-radio-button>
                        <el-radio-button label="D">已完成</el-radio-button>
                    </el-radio-group>
                    <span class="label">
                        搜索订单:
                        <el-input v-model="inputOrderId" class="responsive-input" placeholder="请输入订单id"
                            :prefix-icon="Search" />
                            <el-button type="primary" @click="handleShowDetail(inputOrderId)">查询</el-button>

                    </span>
                </div>
                <!-- ***************************************主要订单展示区域*********************************** -->
                <div class="demo-input-with-icon">
                    <el-card v-for="item in OrderList" :key="item.orderId">

                        <div class="card-body-wrapper" @click.self="handleShowDetail(item.orderId)">
                            <!-- <template #header>Yummy hamburger</template>头部，名字 -->
                            <!-- 分为左中右三部分，左边图片，右边描述，最右边按钮 -->
                            <!-- 左：正方形图片区 -->
                            <div class="left-img">
                                <img :src="item.userUrl" alt="user" class="img-square" />
                            </div>

                            <!-- 中：（左侧用户名称，订单编号，下单时间，用户备注。中间：菜品名称······*数量），右侧小计，操作按钮 -->
                            <div class="center-info">
                                <div class="Order-info" @click.self="handleShowDetail(item.orderId)">
                                    <!-- 用户名称 -->
                                    <div>用户名称：{{ item.nickName }}</div>
                                    <div>订单编号：{{ item.orderId }}</div>
                                    <div>下单时间：{{ item.orderTime }}</div>
                                    <div class="remark">用户备注：{{ item.remark }}</div>
                                </div>
                                <div class="order-detail" @click.self="handleShowDetail(item.orderId)">
                                    <!-- 单个菜品行 -->
                                    <div class="dish-row" v-for="dish in item.dishesDtos" :key="dish.dishNum">
                                        <!-- <div class="dish-row"> -->
                                        <span class="dish-name1">{{ dish.dishName }}</span>
                                        <span class="dish-dots"></span>
                                        <span class="dish-count1">×{{ dish.dishNum }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- 右：操作按钮 -->
                            <div class="right-action" @click.self="handleShowDetail(item.orderId)">
                                <!-- 小计 -->
                                <div class="total">小计：{{ item.totalPrice }}</div>
                                <div v-if="temp === 'A'">
                                    <div class="A-st">等待用户付款······</div>
                                </div>
                                <div v-else-if="temp === 'B'">
                                    <el-button type="primary" @click="handleAcceptOrder(item.orderId)" icon="Edit"
                                        class="button1">接单</el-button>
                                    <el-button type="danger" @click="handleRejectOrder(item.orderId)" icon="Delete"
                                        class="button1">拒单</el-button>
                                </div>
                                <div v-else-if="temp === 'C'">
                                    <!-- 编辑 按钮 -->
                                    <el-button type="primary" @click="handleFinishOrder(item.orderId)" icon="Edit" class="C-st">完成</el-button>
                                </div>
                                <div v-else-if="temp === 'D'">
                                    <div v-if="item.status === '4'" class="A-st">取消已订单</div>
                                    <!-- 编辑 按钮 -->
                                    <!-- <el-button type="danger" @click="" icon="Edit" class="D-st">售后服务</el-button> -->
                                    <el-button v-else-if="item.status === '3'" type="danger" @click="handleServiceOrder(item.orderId)" icon="Edit"
                                        class="D-st">售后服务</el-button>
                                </div>
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
                            layout="sizes, prev, pager, next" :total="total" @size-change="handleSizeChange"
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
                        <div class="amount-item-title">&nbsp;&nbsp;&nbsp;&nbsp;今日营业额:￥{{ todayTurnover }}</div>
                    </div>
                    <div class="amount-item">
                        <div class="amount-item-title">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总营业额:￥{{ allTurnover }}</div>
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

<!-- 订单详情对话框 -->
<!-- 订单详情对话框 -->
<el-dialog
    v-model="detailDialogVisible"
    title="订单详情"
    width="70%"
    class="order-detail-dialog"
    destroy-on-close
>
    <div class="detail-dialog-body">
        <!-- 左侧 -->
        <div class="detail-left">
            <div class="detail-left-title">用户信息</div>

            <div class="detail-info-item">
                <span class="detail-label">用户名称：</span>
                <span class="detail-value">{{ currentOrderDetail.nickName }}</span>
            </div>

            <div class="detail-info-item">
                <span class="detail-label">订单编号：</span>
                <span class="detail-value order-id-text">{{ currentOrderDetail.orderId }}</span>
            </div>

            <div class="detail-info-item">
                <span class="detail-label">下单时间：</span>
                <span class="detail-value">{{ currentOrderDetail.orderTime }}</span>
            </div>
            
            <div class="detail-info-item">
                <span class="detail-label">总价格：</span>
                <span class="detail-value">￥{{ currentOrderDetail.totalPrice }}</span>
            </div>

            <div class="detail-remark-block">
                <div class="detail-label remark-label">用户备注：</div>
                <div class="detail-remark-content">
                    {{ currentOrderDetail.remark || '无备注' }}
                </div>
            </div>
        </div>

        <!-- 右侧 -->
        <div class="detail-right">
            <div class="detail-right-title">菜品信息</div>

            <div class="detail-dish-list">
                <div
                    class="detail-dish-card"
                    v-for="dish in currentOrderDetail.dishesDtos"
                    :key="dish.DishId"
                >
                    <!-- 左：图片 -->
                    <div class="detail-dish-img-box">
                        <img :src="dish.url" alt="dish" class="detail-dish-img" />
                    </div>

                    <!-- 中右：文字 -->
                    <div class="detail-dish-info">
                        <span class="detail-dish-name">{{ dish.dishName }}</span>
                        <div class="detail-dish-top">
                            <span class="detail-dish-price">￥{{ dish.price }}</span>
                            <div class="detail-dish-bottom">
                                数量：×{{ dish.dishNum }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <template #footer>
        <div class="detail-dialog-footer">
            <el-button type="primary" @click="handleDetailConfirm">确定</el-button>
        </div>
    </template>
</el-dialog>

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
.top-container {
    /* 弹性布局 */
    display: flex;
    /* 横向布局 */
    flex-direction: row;
}

.top-tap {
    flex: 4;
    /*顶部标签 */
    display: flex;
    /* justify-content: center; */
    margin-left: 40px;
    margin-top: 10px;
}

.label {
    /* flex: 5; */
    /* margin-top: 5px; */
    white-space: nowrap;
    color: var(--el-text-color-regular);
    margin-top: 10px;
    margin-right: 30px;
}

.responsive-input {
    width: 240px;
    margin-right: 15px;
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
    overflow-y: auto;
    /* 如果榜单很长，允许内部滚动 */
}

.ranking-header {
    margin-bottom: 15px;
    text-align: center;
}

.ranking-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    /* 列表项之间的间距 */
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
    width: 80px;
    /* 固定名称宽度，保持对齐 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 10px;
    font-weight: bold;
}

/* 进度条容器 */
.progress-bg {
    flex: 1;
    /* 占据剩余空间 */
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
    background: linear-gradient(90deg, #385e6e 0%, #5a8a9e 100%);
    /* 使用主题色系渐变 */
    border-radius: 4px;
    transition: width 0.5s ease-in-out;
    /* 增加动画效果 */
}

.dish-sales-num {
    width: 40px;
    text-align: right;
    font-weight: bold;
    color: #ff7b7b;
    /* 使用强调色显示数字 */
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
    display: flex;
    flex: 10;
    margin-left: 20px;
    margin-top: 0;
    align-self: flex-start;
    /* 横向布局 */
    flex-direction: row;
    /* 左侧边界线灰色1px */
    /* border-left: 1px solid #eee; */
    /* 高度限制 */
    height: 100%;
}

.Order-info {
    flex: 5;
    width: 100%;
    margin-right: 60px;
    /* 新增：防止子元素撑开父容器 */
    min-width: 0;
    overflow: hidden;
    /* 确保父容器也隐藏溢出 */
    /* 黑体 */
    font-family: "黑体";
    /* 字体大小 */
    font-size: 15px;
}

.remark {
    /* 1. 强制文本在一行内显示，不换行 */
    white-space: nowrap;

    /* 2. 隐藏超出容器宽度的内容 */
    overflow: hidden;

    /* 3. 当文本溢出时，显示省略号 (...) */
    text-overflow: ellipsis;

    /* 4. (重要) 必须设置一个最大宽度或宽度，否则它会无限撑开父容器 */
    width: 100%;
    /* 或者使用 max-width: 200px; 根据你的布局需求调整 */
}

/* *****************Order-detail******************* */
/* 订单详情容器 */
.order-detail {
    flex: 6;
    overflow-y: auto;
}

.order-detail::-webkit-scrollbar {
    width: 6px;
    /* 设置滚动条宽度 */
}

.order-detail::-webkit-scrollbar-thumb {
    background-color: #ccc;
    /* 滚动条滑块颜色 */
    border-radius: 3px;
    /* 圆角 */
}

.order-detail::-webkit-scrollbar-thumb {
    background-color: #ccc;
    /* 滚动条滑块颜色 */
    border-radius: 3px;
    /* 圆角 */
}

/* 每一行菜品的容器 */
.dish-row {
    display: flex;
    align-items: baseline;
    /* 基线对齐，让文字底部对齐 */
    width: 100%;
    margin-bottom: 4px;
    /* 行间距 */
    font-size: 14px;
    color: #333;
}

/* 左侧：菜品名称 */
.dish-name1 {
    white-space: nowrap;
    /* 防止名字换行 */
    overflow: hidden;
    text-overflow: ellipsis;
    /* 如果名字太长，显示省略号 */
    max-width: 60%;
    /* 限制最大宽度，防止挤压右边 */
}

/* 中间：点状填充 */
.dish-dots {
    flex: 1;
    /* 占据剩余所有空间 */
    border-bottom: 3px dotted #ccc;
    /* 使用虚线模拟点状填充 */
    margin: 0 8px;
    /* 左右留一点空隙 */
    position: relative;
    top: -4px;
    /* 微调虚线位置，使其视觉上居中于文字之间 */
}

/* 右侧：数量 */
.dish-count1 {
    white-space: nowrap;
    font-weight: bold;
    color: #ff7b7b;
    /* 强调色 */
    margin-right: 20px;
}

/* *****************Order-detail******************* */


.right-action {
    flex: 3;
}

.total {
    color: red;
    font-size: 20px;
    /* 居中 */
    margin-left: 15%;
    margin-top: 10%;
}

.A-st {
    margin-top: 25%;
    /* 灰色 */
    color: gray;
    text-align: center;
}

.button1 {
    margin-top: 25%;
    text-align: center;
}

.C-st {
    margin-top: 25%;
    margin-left: 30%;
}

.D-st {
    margin-top: 25%;
    margin-left: 20%;
}

/*------------------------------ 订单列表 --------------------------------------*/
/*------------------------------ 订单详情 --------------------------------------*/
/* **********************************************订单详情对话框************************************************ */

.order-detail-dialog :deep(.el-dialog__body) {
    padding-top: 10px;
    padding-bottom: 10px;
}

.detail-dialog-body {
    display: flex;
    gap: 20px;
    height: 520px;
    min-height: 520px;
}

/* 左侧 1份 */
.detail-left {
    flex: 1;
    border: 1px solid #ebeef5;
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background-color: #fafafa;
}

/* 右侧 2份 */
.detail-right {
    flex: 2;
    border: 1px solid #ebeef5;
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    min-height: 0;
    background-color: #ffffff;
}

.detail-left-title,
.detail-right-title {
    font-size: 20px;
    font-weight: bold;
    color: #385e6e;
    margin-bottom: 20px;
    text-align: center;
}

.detail-info-item {
    margin-bottom: 18px;
    font-size: 15px;
    line-height: 24px;
    color: #333;
    word-break: break-all;
}

.detail-label {
    font-weight: bold;
    color: #385e6e;
}

.detail-value {
    color: #333;
}

.order-id-text {
    word-break: break-all;
}

/* 备注区域：固定占较大空间，接近底部 */
.detail-remark-block {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}

.remark-label {
    margin-bottom: 10px;
}

.detail-remark-content {
    flex: 1;
    border: 1px solid #dcdfe6;
    border-radius: 8px;
    background-color: #fff;
    padding: 12px;
    box-sizing: border-box;
    color: #606266;
    line-height: 22px;
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-word;
    min-height: 200px;
}

/* 右侧菜品列表 */
.detail-dish-list {
    flex: 1;
    overflow-y: auto;
    padding-right: 6px;
}

.detail-dish-list::-webkit-scrollbar {
    width: 6px;
}

.detail-dish-list::-webkit-scrollbar-thumb {
    background-color: #c0c4cc;
    border-radius: 4px;
}

.detail-dish-card {
    display: flex;
    align-items: center;
    border: 1px solid #ebeef5;
    border-radius: 10px;
    padding: 12px;
    margin-bottom: 12px;
    background-color: #fafafa;
}

.detail-dish-img-box {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    margin-right: 15px;
}

.detail-dish-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    display: block;
}

.detail-dish-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
}

.detail-dish-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 10px;
}

.detail-dish-name {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.detail-dish-price {
    color: #f56c6c;
    font-size: 16px;
    font-weight: bold;
    white-space: nowrap;
}

.detail-dish-bottom {
    font-size: 14px;
    color: #606266;
}

.detail-dialog-footer {
    display: flex;
    justify-content: center;
    width: 100%;
}

/* **********************************************订单详情对话框************************************************ */
/*------------------------------ 订单详情 --------------------------------------*/
</style>
