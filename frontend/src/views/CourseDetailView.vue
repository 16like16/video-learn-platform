<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { apiRequest, toFileUrl } from '../utils/api';
import { session } from '../utils/auth';

const route = useRoute();
const course = ref(null);
const videos = ref([]);
const comments = ref([]);
const selectedVideo = ref(null);
const newComment = ref('');
const progress = ref(0);
const upload = reactive({ title: '', file: null });
const loading = ref(false);

const canManage = computed(() => {
  if (!session.user || !course.value) {
    return false;
  }
  return session.user.role === 'admin' || session.user.id === course.value.creator_id;
});

const courseId = Number(route.params.id);

const loadData = async () => {
  loading.value = true;
  try {
    const [courseData, videoData, commentData] = await Promise.all([
      apiRequest(`/course/detail/${courseId}`),
      apiRequest(`/video/list/${courseId}`),
      apiRequest(`/comment/list/${courseId}`),
    ]);
    course.value = courseData;
    videos.value = videoData;
    comments.value = commentData;
    selectedVideo.value = videos.value[0] || null;
  } catch (e) {
    alert(e.message);
  } finally {
    loading.value = false;
  }
};

const addComment = async () => {
  if (!session.token) {
    alert('请先登录');
    return;
  }
  await apiRequest('/comment/add', { method: 'POST', body: { course_id: courseId, content: newComment.value } });
  newComment.value = '';
  await loadData();
};

const removeComment = async (id) => {
  await apiRequest(`/comment/delete/${id}`, { method: 'DELETE' });
  await loadData();
};

const saveProgress = async () => {
  if (!selectedVideo.value) {
    return;
  }
  await apiRequest('/learn/save', {
    method: 'POST',
    body: { video_id: selectedVideo.value.id, progress: Number(progress.value) },
  });
  alert('已保存学习进度');
};

const uploadVideo = async () => {
  if (!upload.title || !upload.file) {
    alert('请填写标题并选择文件');
    return;
  }
  const formData = new FormData();
  formData.append('course_id', String(courseId));
  formData.append('title', upload.title);
  formData.append('video', upload.file);
  await apiRequest('/video/upload', { method: 'POST', body: formData });
  upload.title = '';
  upload.file = null;
  await loadData();
};

const removeVideo = async (id) => {
  await apiRequest(`/video/delete/${id}`, { method: 'DELETE' });
  await loadData();
};

onMounted(loadData);
</script>

<template>
  <section class="page-block" v-if="!loading && course">
    <h1>{{ course.title }}</h1>
    <p>{{ course.description || '暂无描述' }}</p>

    <div class="split-layout">
      <div>
        <h3>课程视频</h3>
        <ul class="list-box">
          <li v-for="video in videos" :key="video.id">
            <button class="text-btn" @click="selectedVideo = video">{{ video.title }}</button>
            <button class="ghost-btn" v-if="canManage" @click="removeVideo(video.id)">删除</button>
          </li>
        </ul>

        <div v-if="selectedVideo" class="video-player">
          <video controls :src="toFileUrl(selectedVideo.video_url)"></video>
          <div class="row-actions">
            <label>学习进度</label>
            <input type="number" min="0" max="100" v-model="progress" />
            <button @click="saveProgress">保存</button>
          </div>
        </div>

        <div v-if="canManage" class="panel">
          <h4>上传视频</h4>
          <input v-model="upload.title" placeholder="视频标题" />
          <input type="file" @change="upload.file = $event.target.files[0]" />
          <button @click="uploadVideo">上传</button>
        </div>
      </div>

      <div>
        <h3>评论区</h3>
        <ul class="list-box">
          <li v-for="comment in comments" :key="comment.id">
            <p>{{ comment.user }}：{{ comment.content }}</p>
            <small>{{ comment.create_time }}</small>
            <button class="ghost-btn" v-if="session.token" @click="removeComment(comment.id)">删除</button>
          </li>
        </ul>
        <div class="panel">
          <textarea v-model="newComment" placeholder="写下你的学习收获..." />
          <button @click="addComment">发表评论</button>
        </div>
      </div>
    </div>
  </section>

  <p v-else>加载中...</p>
</template>
