<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { apiRequest } from '../utils/api';
import { session } from '../utils/auth';

const courses = ref([]);
const selectedCourseId = ref(null);
const courseForm = reactive({ title: '', description: '', cover: '' });
const editing = ref(null);
const videos = ref([]);
const upload = reactive({ title: '', file: null });

const mine = computed(() => courses.value.filter((item) => item.creator_id === session.user?.id || session.user?.role === 'admin'));

const loadCourses = async () => {
  const data = await apiRequest('/course/list?page=1&pageSize=1000');
  courses.value = data.list;
  if (!selectedCourseId.value && mine.value.length) {
    selectedCourseId.value = mine.value[0].id;
  }
  if (selectedCourseId.value) {
    await loadVideos(selectedCourseId.value);
  }
};

const loadVideos = async (courseId) => {
  selectedCourseId.value = Number(courseId);
  videos.value = await apiRequest(`/video/list/${selectedCourseId.value}`);
};

const submitCourse = async () => {
  if (!courseForm.title) {
    alert('课程标题必填');
    return;
  }

  if (editing.value) {
    await apiRequest(`/course/update/${editing.value}`, { method: 'PUT', body: courseForm });
  } else {
    await apiRequest('/course/create', { method: 'POST', body: courseForm });
  }

  courseForm.title = '';
  courseForm.description = '';
  courseForm.cover = '';
  editing.value = null;
  await loadCourses();
};

const editCourse = (course) => {
  editing.value = course.id;
  courseForm.title = course.title;
  courseForm.description = course.description;
  courseForm.cover = course.cover;
};

const removeCourse = async (id) => {
  await apiRequest(`/course/delete/${id}`, { method: 'DELETE' });
  if (selectedCourseId.value === id) {
    selectedCourseId.value = null;
    videos.value = [];
  }
  await loadCourses();
};

const uploadVideo = async () => {
  if (!selectedCourseId.value) {
    alert('请先选择课程');
    return;
  }
  const formData = new FormData();
  formData.append('course_id', String(selectedCourseId.value));
  formData.append('title', upload.title);
  formData.append('video', upload.file);
  await apiRequest('/video/upload', { method: 'POST', body: formData });
  upload.title = '';
  upload.file = null;
  await loadVideos(selectedCourseId.value);
};

const deleteVideo = async (id) => {
  await apiRequest(`/video/delete/${id}`, { method: 'DELETE' });
  await loadVideos(selectedCourseId.value);
};

onMounted(loadCourses);
</script>

<template>
  <section class="page-block">
    <h1>创作中心</h1>
    <div class="split-layout">
      <div>
        <div class="panel form-grid">
          <h3>{{ editing ? '编辑课程' : '新建课程' }}</h3>
          <input v-model="courseForm.title" placeholder="课程标题" />
          <textarea v-model="courseForm.description" placeholder="课程简介" />
          <input v-model="courseForm.cover" placeholder="封面URL（可选）" />
          <button @click="submitCourse">{{ editing ? '保存更新' : '创建课程' }}</button>
        </div>

        <ul class="list-box">
          <li v-for="course in mine" :key="course.id">
            <p class="course-title">{{ course.title }}</p>
            <div class="row-actions">
              <button class="ghost-btn" @click="loadVideos(course.id)">管理视频</button>
              <button class="ghost-btn" @click="editCourse(course)">编辑</button>
              <button class="ghost-btn" @click="removeCourse(course.id)">删除</button>
            </div>
          </li>
        </ul>
      </div>

      <div>
        <div class="panel form-grid">
          <h3>课程视频管理</h3>
          <select v-model="selectedCourseId" @change="loadVideos($event.target.value)">
            <option :value="null">请选择课程</option>
            <option v-for="course in mine" :key="course.id" :value="course.id">{{ course.title }}</option>
          </select>
          <input v-model="upload.title" placeholder="视频标题" />
          <input type="file" @change="upload.file = $event.target.files[0]" />
          <button @click="uploadVideo">上传视频</button>
        </div>

        <ul class="list-box">
          <li v-for="video in videos" :key="video.id">
            <span>{{ video.title }}</span>
            <button class="ghost-btn" @click="deleteVideo(video.id)">删除</button>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
