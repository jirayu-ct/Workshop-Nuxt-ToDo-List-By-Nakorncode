<script setup lang="ts">
if(import.meta.client) {
  await callOnce(() => {
    const { loadTodoListFromLocalStorage } = useTodo()
    loadTodoListFromLocalStorage()
  })
}
</script>

<template>
  <div>
    <u-app>
      <nuxt-layout>
        <nuxt-page></nuxt-page>
      </nuxt-layout>
    </u-app>
  </div>
</template>
