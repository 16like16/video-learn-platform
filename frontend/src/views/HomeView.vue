<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiRequest } from '../utils/api';
import { session } from '../utils/auth';

const router = useRouter();
const query = reactive({ keyword: '', page: 1, pageSize: 12 });
const total = ref(0);
const list = ref([]);
const loading = ref(false);
const error = ref('');

const fetchCourses = async () => {
  loading.value = true;
  error.value = '';
  try {
    const data = await apiRequest(`/course/list?page=${query.page}&pageSize=${query.pageSize}&keyword=${encodeURIComponent(query.keyword)}`);
    list.value = data.list;
    total.value = data.total;
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};

const addFavorite = async (courseId) => {
  if (!session.token) {
    router.push('/login');
    return;
  }
  try {
    await apiRequest('/favorite/add', { method: 'POST', body: { course_id: courseId } });
    alert('收藏成功');
  } catch (e) {
    alert(e.message);
  }
};

const changePage = (step) => {
  const next = query.page + step;
  const maxPage = Math.max(1, Math.ceil(total.value / query.pageSize));
  query.page = Math.min(maxPage, Math.max(1, next));
  fetchCourses();
};

onMounted(fetchCourses);
</script>

<template>
  <section class="page-block">
    <div class="toolbar">
      <input v-model="query.keyword" placeholder="搜索课程关键词" @keyup.enter="query.page=1; fetchCourses()" />
      <button @click="query.page=1; fetchCourses()">搜索</button>
      <span class="tips">共 {{ total }} 门课程</span>
    </div>

    <p class="error" v-if="error">{{ error }}</p>
    <div class="course-grid" v-if="!loading">
      <article class="course-card" v-for="item in list" :key="item.id">
        <div class="cover" :style="{ backgroundImage: item.cover ? `url(${item.cover})` : '' }"></div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.description || '暂无描述' }}</p>
        <div class="row-actions">
          <button @click="router.push(`/course/${item.id}`)">查看详情</button>
          <button class="ghost-btn" @click="addFavorite(item.id)">收藏</button>
        </div>
      </article>
    </div>
    <p v-else>正在加载课程...</p>

    <div class="pager">
      <button @click="changePage(-1)" :disabled="query.page <= 1">上一页</button>
      <span>第 {{ query.page }} 页</span>
      <button @click="changePage(1)" :disabled="query.page >= Math.ceil(Math.max(1, total) / query.pageSize)">下一页</button>
    </div>
  </section>
</template>
