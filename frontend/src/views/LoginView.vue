<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiRequest } from '../utils/api';
import { setSession } from '../utils/auth';

const router = useRouter();
const form = reactive({ username: '', password: '' });
const loading = ref(false);
const error = ref('');

const submit = async () => {
  error.value = '';
  loading.value = true;
  try {
    const data = await apiRequest('/user/login', { method: 'POST', body: form });
    setSession(data.token, data.userInfo);
    router.push('/');
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <section class="center-card auth-card">
    <h1>欢迎回来</h1>
    <p>输入账号信息，继续你的学习和创作。</p>
    <form @submit.prevent="submit" class="form-grid">
      <input v-model="form.username" placeholder="用户名" required />
      <input v-model="form.password" type="password" placeholder="密码" required />
      <button :disabled="loading">{{ loading ? '登录中...' : '登录' }}</button>
      <p class="error" v-if="error">{{ error }}</p>
      <RouterLink to="/register">没有账号？去注册</RouterLink>
    </form>
  </section>
</template>
