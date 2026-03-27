<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { clearSession, session } from '../utils/auth';

const router = useRouter();
const isLogin = computed(() => !!session.token);
const isAdmin = computed(() => session.user?.role === 'admin');

const logout = () => {
  clearSession();
  router.push('/login');
};
</script>

<template>
  <header class="top-nav">
    <div class="brand" @click="router.push('/')">风帆学堂</div>
    <nav class="links">
      <RouterLink to="/">课程大厅</RouterLink>
      <RouterLink v-if="isLogin" to="/creator">创作中心</RouterLink>
      <RouterLink v-if="isLogin" to="/favorites">我的收藏</RouterLink>
      <RouterLink v-if="isLogin" to="/learning">学习记录</RouterLink>
      <RouterLink v-if="isLogin" to="/profile">个人中心</RouterLink>
      <RouterLink v-if="isAdmin" to="/admin">管理后台</RouterLink>
    </nav>
    <div class="auth-actions">
      <template v-if="isLogin">
        <span class="username">{{ session.user?.username }}</span>
        <button class="ghost-btn" @click="logout">退出</button>
      </template>
      <template v-else>
        <RouterLink to="/login">登录</RouterLink>
        <RouterLink to="/register">注册</RouterLink>
      </template>
    </div>
  </header>
</template>
