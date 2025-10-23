<script setup lang="ts">
if(import.meta.client) {
  await callOnce(() => {
    const { loadTodoListFromLocalStorage } = useTodo()
    loadTodoListFromLocalStorage()
  })
}

await callOnce( async() => {
  const { getCurrentUser } = useUser()
  await getCurrentUser()
})
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
