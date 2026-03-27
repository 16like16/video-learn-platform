<script setup>
import { onMounted, ref } from 'vue';
import { apiRequest } from '../utils/api';

const tab = ref('users');
const users = ref([]);
const courses = ref([]);
const comments = ref([]);

const load = async () => {
  try {
    const [userData, courseData, commentData] = await Promise.all([
      apiRequest('/admin/users'),
      apiRequest('/admin/courses'),
      apiRequest('/admin/comments'),
    ]);
    users.value = userData;
    courses.value = courseData;
    comments.value = commentData;
  } catch (e) {
    alert(e.message);
  }
};

const removeUser = async (id) => {
  await apiRequest(`/admin/user/delete/${id}`, { method: 'DELETE' });
  await load();
};

const removeCourse = async (id) => {
  await apiRequest(`/admin/course/delete/${id}`, { method: 'DELETE' });
  await load();
};

const removeComment = async (id) => {
  await apiRequest(`/admin/comment/delete/${id}`, { method: 'DELETE' });
  await load();
};

onMounted(load);
</script>

<template>
  <section class="page-block">
    <h1>管理后台</h1>
    <div class="tabs">
      <button :class="{ active: tab === 'users' }" @click="tab = 'users'">用户管理</button>
      <button :class="{ active: tab === 'courses' }" @click="tab = 'courses'">课程管理</button>
      <button :class="{ active: tab === 'comments' }" @click="tab = 'comments'">评论管理</button>
    </div>

    <ul class="list-box" v-if="tab === 'users'">
      <li v-for="user in users" :key="user.id">
        <span>{{ user.username }} ({{ user.role }})</span>
        <button class="ghost-btn" @click="removeUser(user.id)">删除</button>
      </li>
    </ul>

    <ul class="list-box" v-if="tab === 'courses'">
      <li v-for="course in courses" :key="course.id">
        <span>{{ course.title }}</span>
        <button class="ghost-btn" @click="removeCourse(course.id)">删除</button>
      </li>
    </ul>

    <ul class="list-box" v-if="tab === 'comments'">
      <li v-for="comment in comments" :key="comment.id">
        <span>{{ comment.user }}: {{ comment.content }}</span>
        <button class="ghost-btn" @click="removeComment(comment.id)">删除</button>
      </li>
    </ul>
  </section>
</template>
