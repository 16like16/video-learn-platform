<script setup>
import { onMounted, ref } from 'vue';
import { apiRequest } from '../utils/api';

const records = ref([]);
const videoMap = ref({});

const buildVideoMap = async () => {
  const allCourses = await apiRequest('/course/list?page=1&pageSize=1000');
  const map = {};
  for (const course of allCourses.list) {
    const videos = await apiRequest(`/video/list/${course.id}`);
    videos.forEach((video) => {
      map[video.id] = { title: video.title, courseId: course.id, courseTitle: course.title };
    });
  }
  videoMap.value = map;
};

const load = async () => {
  try {
    const data = await apiRequest('/learn/list');
    records.value = data;
    await buildVideoMap();
  } catch (e) {
    alert(e.message);
  }
};

onMounted(load);
</script>

<template>
  <section class="page-block">
    <h1>学习记录</h1>
    <ul class="list-box">
      <li v-for="item in records" :key="item.id">
        <p>
          视频：{{ videoMap[item.video_id]?.title || '未知视频' }}
          <span class="tag">{{ videoMap[item.video_id]?.courseTitle || '未知课程' }}</span>
        </p>
        <small>进度：{{ item.progress }}%</small>
      </li>
    </ul>
  </section>
</template>
