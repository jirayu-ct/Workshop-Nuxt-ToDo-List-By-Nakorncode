<script setup lang="ts">

const title = ref('')
const { getTodo } = useTodo()

const props = defineProps<{
    todoId: string
}>()

const currentTodo = getTodo(props.todoId)


const onSubmit = () => {
    currentTodo.addItem(title.value)
    title.value = ''
}

</script>

<template>
    <form @submit.prevent="onSubmit()">
        <div class="flex gap-1">
            <UInput v-model="title" class="w-full" placeholder="Enter a Title of the todo list item" />
            <UButton type="submit">Submit</UButton>
        </div>
    </form>
</template>