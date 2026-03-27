<script setup>
import { onMounted, reactive, ref } from 'vue';
import { apiRequest } from '../utils/api';
import { setSession, session } from '../utils/auth';

const form = reactive({ username: '', avatar: '' });
const info = ref(null);

const load = async () => {
  try {
    const data = await apiRequest('/user/info');
    info.value = data;
    form.username = data.username;
    form.avatar = data.avatar || '';
  } catch (e) {
    alert(e.message);
  }
};

const update = async () => {
  try {
    await apiRequest('/user/update', { method: 'PUT', body: form });
    setSession(session.token, { ...session.user, username: form.username });
    await load();
    alert('资料已更新');
  } catch (e) {
    alert(e.message);
  }
};

onMounted(load);
</script>

<template>
  <section class="page-block">
    <h1>个人中心</h1>
    <div class="panel" v-if="info">
      <p>用户ID：{{ info.id }}</p>
      <p>角色：{{ info.role }}</p>
    </div>
    <div class="panel form-grid">
      <input v-model="form.username" placeholder="用户名" />
      <input v-model="form.avatar" placeholder="头像URL（可选）" />
      <button @click="update">保存资料</button>
    </div>
  </section>
</template>
