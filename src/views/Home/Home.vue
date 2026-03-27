<script setup>

</script>

<template>
  <div>
    <div class="header1">
      Make JAVA great again
    </div>
    <div class="header2">
      舌尖探险进行时，后厨秩序稳定中
    </div>

    <div class="home-container">
      <!-- 左侧 -->
      <div class="left">
        <!-- 引入图片 -->
        <div class="imgHome">
          <img src="../../assets/home.png" alt="aa"></img>
        </div>
      </div>

      <!-- 右侧 -->
      <div class="right">
        <div class="right-container">
          <div>
            <h1>科技赋能</h1>
            <p>使个体户起飞，让经营更省心</p>
          </div>
          <br>
          <div>
            <h1>数据驱动</h1>
            <p>营业数据可视化，决策有据可依</p>
          </div>
          <br></br>
          <div>
            <h1>高效运营</h1>
            <p>告别手忙脚乱，后厨秩序拉满</p>
          </div>
          <br></br>
          <div>
            <h1>智能管理</h1>
            <p>用代码守护人间烟火味</p>
          </div>
          <br></br>
          <div>
            <h1>极简操作</h1>
            <p>零基础也能快速上手</p>
          </div>
        </div>
        <!-- <h3>科技赋能</h3> -->
        <!-- <p>使个体户起飞，让经营更省心</p> -->
        <!-- </div> -->
        <!-- 换行 -->
        <!-- <div class="tech-item">
       <h3>数据驱动</h3>
       <p>营业数据可视化，决策有据可依</p>
     </div> -->
        <!-- <div class="tech-item">
       <h3>高效运营</h3>
       <p>告别手忙脚乱，后厨秩序拉满</p>
     </div> -->
        <!-- <div class="tech-item">
       <h3>智能管理</h3>
       <p>用代码守护人间烟火味</p>
     </div> -->
        <!-- <div class="tech-item">
       <h3>极简操作</h3>
       <p>零基础也能快速上手</p>
     </div> -->
      </div>


    </div>


    <div class="footer">
      <p>© 2025 餐饮管理系统 版权所有</p>
      <p>技术支持：Java + Vue + AI 智能辅助</p>
    </div>

  </div>
</template>

<style scoped>
.header2 {
  text-align: center;
  font-size: 25px;
  color: black;
  padding-top: 20px;
  /* 设置字体，草书 */
  font-family: "STKaiti";
  margin-bottom: 20px;
}

.header1 {
  text-align: center;
  font-size: 45px;
  color: #333333;
  padding-top: 10px;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", sans-serif;
  /* font-family: "Ma Shan Zheng", cursive; */
  /* 加粗 */
  font-weight: bold;
}

.home-container {
  display: flex;
  /* 核心：开启弹性布局 */
  width: 100%;
  flex-direction: row;
  /* height: 100%; */
  /* flex-direction: column; */
  /* 设置主轴方向为纵向 */
}

.left {
  flex: 1;
  /* 占 1 份宽度 */
}

.right {
  flex: 1;
  /* 占 1 份宽度（和左侧等分） */
}

.imgHome img {
  /* 控制图片宽度 */
  width: 50%;

  /* 靠右 */
  display: block;
  margin-left: auto;

  /* 上下位置：往上加负，往下加正 */
  margin-top: 40px;

  /* 圆角：0是直角，越大越圆 */
  border-radius: 12px;

  /* 下方距离容器50px */
  margin-top: 80px;
  margin-right: 100px;
}

.right-container {
  /* 距离上方50px */
  margin-top: 60px;
  margin-left: 20px;

}

.right-container h1 {
  font-family: "ZCOOL KuaiLe", sans-serif;
  font-size: 40px;
  font-weight: 450;
  letter-spacing: 2px;
}




.right-container p {
  margin-top: 4px;
  font-size: 20px;
  /* 正楷 */
  font-family: "STXingkai";
}

.footer {
  margin-top: 60px;
  /* 距离顶部 60px */
  text-align: center;
  /* 居中 */
  font-size: 50px;
  /* 字体大小 */
  font-weight: bold;
  /* 加粗 */
  font-family: "STXingkai";
  /* 字体 */

  /* 从顶部中央向四周渐变底色 */
  background: radial-gradient(circle at top center, #fff0f0, #ffffff);
  /* 文字颜色，你可以自己换 */
  color: #993333;
  /* 加一点内边距，不让文字贴边 */
}


</style>
