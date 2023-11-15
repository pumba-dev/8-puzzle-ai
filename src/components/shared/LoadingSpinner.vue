<template>
  <div class="loading-container">
    <div class="loading-spinner"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #0d4797;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
