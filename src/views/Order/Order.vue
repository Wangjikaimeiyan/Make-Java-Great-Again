<script setup>

</script>

<template>
    <div>
        <div class="home-container">
            <!-- 左侧 -->
            <div class="left-container">



                <!-- 主要菜单展示区域 -->
                <div class="demo-input-with-icon">

                </div>


            </div>
            <!-- 右侧 -->
            <div class="right-container">

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
    min-width: 0;
    overflow-y: auto;
    flex-shrink: 0;
}

/*
.right-container {
  /* 弹性布局中的元素，默认占满剩余空间 
  flex: 5;
  min-width: 0;
}*/

/* 输入框样式 */
.demo-input-with-icon {
    margin-top: 10px;
    /* margin-left: 15px; */
    width: 100%;
}


/* AI66666666666666666666666666666666666666666666666666666666666666 */
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
</style>
