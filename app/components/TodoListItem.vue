<script setup lang="ts">

const { getTodo } = useTodo()

const props = defineProps<{
    todo: TodoList
}>()

const currentTodo = getTodo(props.todo.id)

const onToggleItem = (id: string, value: boolean | 'indeterminate') => {
    if (value === 'indeterminate') return

    if (value) {
        currentTodo.markITemDone(id)
    } else {
        currentTodo.markItemUndone(id)
    }
}

const onItemTitleUpdated = (id: string, newTitle: string) => {
    currentTodo.updateItemTitle(id, newTitle)
}

const onDeleteConfirmed = (id: string) => {
    currentTodo.removeItem(id)
}

</script>

<template>
    <ul class="flex flex-col gap-1">
        <li v-for="item in currentTodo.todo.items" :key="item.id">
            <div class="flex items-center gap-1">
                <UCheckbox :v-model="item.done" @update:model-value="onToggleItem(item.id, $event)">
                    <template #label>
                        <span :class="{ 'line-through text-gray-400': item.done }">{{ item.title }}</span>
                    </template>
                </UCheckbox>
                
                <ModalUpdateTitle 
                    header-title="Update Todo List Item Title" 
                    :previos-title="todo.title"
                    placeholder="Enter a new title item" 
                    @update="onItemTitleUpdated(item.id, $event)"
                >
                    <Icon name="material-symbols:edit" class="text-blue-500 cursor-pointer" size="1.2rem" />
                </ModalUpdateTitle>

                <ModalConfirm
                    title="Ary you sure you want to delete this todo list?"
                    :description="`Item title: ${item.title}`"
                    confirm-color="error"
                    @confirmed="onDeleteConfirmed(item.id)"
                >
                    <Icon name="material-symbols:delete-forever" class="text-red-500 cursor-pointer" size="1.2rem" />
                </ModalConfirm>
            </div>
        </li>
    </ul>
</template>