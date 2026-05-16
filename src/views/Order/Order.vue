<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'


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

                <!-- 主要菜单展示区域 -->
                <div class="demo-input-with-icon">
                    


                </div>
                <!-- 分页 区域 -->
                <div class="fenye-container">
                    <div class="demo-pagination-block">
                        <el-pagination v-model:current-page="currentPage2" v-model:page-size="pageSize2"
                            :page-sizes="[5, 10, 15, 30,50,100]"
                            :disabled="disabled"
                            :background="background" layout="sizes, prev, pager, next" 
                            :total="1000"
                            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                    </div>
                </div>

            </div>
            <!-- 右侧 -->
            <div class="right-container">
                <!-- 右侧上方是今日营业额和总收入大约占用1/4 -->
                <div class="amount-container">

                </div>
                <!-- 右侧下方是渲染菜品销量排行区域，大约只渲染10个,每10秒轮询一次 -->
                <div class="dish-sales-container">

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
}

/* 包裹主要菜单展示区域的容器，使其占据剩余空间并可滚动 */
.demo-input-with-icon {
  flex: 1;                 /* 占据剩余高度 */
  overflow-y: auto;        /* 内容过多时滚动 */
  margin-top: 10px;
  width: 100%;
  /* 其他原有样式 */
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

/* 营业额和总收入 */
.amount-container {
    /* 占用1/4 */
    flex: 3;
    /* 分割线 */
    border-bottom: 1px solid #ff7b7b;
    /* 居中 */
    display: flex;
    justify-content: center;
}

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
  margin-bottom: 16px;     /* 保留底部间距 */
  /* 不再需要固定定位 */
}

/* 分页容器 - 自动贴在底部 */
.fenye-container {
  flex-shrink: 0;          /* 防止被压缩 */
  /* 可以加一点上边距 */
  margin-top: 10px;
}
/* **********************************分页条************************************** */
</style>
