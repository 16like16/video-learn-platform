<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiRequest } from '../utils/api';

const router = useRouter();
const courses = ref([]);
const loading = ref(false);

const loadFavorites = async () => {
  loading.value = true;
  try {
    const [favoriteData, courseData] = await Promise.all([
      apiRequest('/favorite/list'),
      apiRequest('/course/list?page=1&pageSize=1000'),
    ]);

    const ids = new Set(favoriteData.map((item) => Number(item.course_id)));
    courses.value = courseData.list.filter((course) => ids.has(course.id));
  } catch (e) {
    alert(e.message);
  } finally {
    loading.value = false;
  }
};

const remove = async (courseId) => {
  await apiRequest('/favorite/remove', { method: 'DELETE', body: { course_id: courseId } });
  await loadFavorites();
};

onMounted(loadFavorites);
</script>

<template>
  <section class="page-block">
    <h1>我的收藏</h1>
    <p v-if="loading">加载中...</p>
    <div class="course-grid" v-else>
      <article class="course-card" v-for="item in courses" :key="item.id">
        <h3>{{ item.title }}</h3>
        <p>{{ item.description || '暂无描述' }}</p>
        <div class="row-actions">
          <button @click="router.push(`/course/${item.id}`)">进入课程</button>
          <button class="ghost-btn" @click="remove(item.id)">取消收藏</button>
        </div>
      </article>
    </div>
  </section>
</template>
