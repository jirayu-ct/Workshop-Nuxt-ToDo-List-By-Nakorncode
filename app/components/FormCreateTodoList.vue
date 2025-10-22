<script setup lang="ts">

const title = ref('')
const { addTodo } = useTodo()


const onSubmit = () => {
    addTodo(title.value)
    title.value = ''
}

</script>

<template>
    <form @submit.prevent="onSubmit()">
        <div class="flex gap-1">
            <UInput v-model="title" class="w-full" placeholder="Enter a Title of the todo list"></UInput>
            <UButton type="submit">Submit</UButton>
        </div>
    </form>
</template>