<script setup>

</script>

<template>
    <div class="login">
        <div class="login-container">
            <div class="login-box">
                <div class="login-title">
                    <img src="../assets/logo.png" alt="">
                    <span>登录</span>
                </div>
                <div class="login-form">
                    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-width="80px">
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>