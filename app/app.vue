<script setup lang="ts">
const { user } = useUser()

if(import.meta.client) {
  await callOnce(async() => {
    const { loadTodoListFromLocalStorage, loadTodoListFromOnline } = useTodo()
    loadTodoListFromLocalStorage()
    if(!user.value) return
    
    await loadTodoListFromOnline()
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
      <nuxt-loading-indicator />
      <nuxt-layout>
        <nuxt-page></nuxt-page>
      </nuxt-layout>
    </u-app>
  </div>
</template>
