<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiRequest } from '../utils/api';

const router = useRouter();
const form = reactive({ username: '', password: '' });
const loading = ref(false);
const error = ref('');
const done = ref('');

const submit = async () => {
  error.value = '';
  done.value = '';
  loading.value = true;
  try {
    await apiRequest('/user/register', { method: 'POST', body: form });
    done.value = '注册成功，正在跳转登录页...';
    setTimeout(() => router.push('/login'), 700);
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <section class="center-card auth-card">
    <h1>创建账号</h1>
    <p>开启你的课程创作与学习之旅。</p>
    <form @submit.prevent="submit" class="form-grid">
      <input v-model="form.username" placeholder="用户名" required />
      <input v-model="form.password" type="password" placeholder="密码" required />
      <button :disabled="loading">{{ loading ? '提交中...' : '注册' }}</button>
      <p class="error" v-if="error">{{ error }}</p>
      <p class="ok" v-if="done">{{ done }}</p>
      <RouterLink to="/login">已有账号？去登录</RouterLink>
    </form>
  </section>
</template>
