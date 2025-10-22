<script setup lang="ts">
const props = defineProps<{
    title: string,
    description?: string,
    confirmColor?: "primary" | "secondary" | "error" | "success" | "warning" | "info" | "neutral"
}>()
const { removeTodo } = useTodo()
const open = ref(false)

const emit = defineEmits<{
    'confirmed': []
}>()

const onConfirmed = () => {
    emit('confirmed')
    open.value = false
}

</script>

<template>
    <UModal
        v-model:open="open"
        title="Delete Todo List"
        :ui="{
            content: 'max-w-sm'
        }"
    >
    <slot />
        <template #content>
            <div class="p-4">
                <h2 class="font-bold mb-1">{{ props.title }}</h2>
                <p v-if="props.description">{{ props.description }}</p>
                <div class="flex justify-end gap-1 mt-3">
                    <UButton :color="props.confirmColor" @click="onConfirmed">Confirm</UButton>
                    <UButton color="secondary" @click="open = false">Cancel</UButton>
                </div>
            </div>
        </template>
    </UModal>
</template>