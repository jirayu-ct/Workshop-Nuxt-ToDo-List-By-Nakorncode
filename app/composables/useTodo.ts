import { v4 as uuid } from "uuid"; 'uuid'

export interface TodoListItem {
    id: string;
    title: string;
    done: boolean;
}

export interface TodoList {
    id: string;
    title: string;
    items: TodoListItem[];
}

export const useTodo = () => {
    const todos = useState<TodoList[]>('todos', () => [])

    const addTodo = (title: string) => {
        todos.value.push({
            id: uuid(),
            title,
            items: []
        })
    }

    const removeTodo = (id: string) => {
        todos.value = todos.value.filter(todo => todo.id !== id)
    }

    const updateTodoTitle = (id: string, newTitle: string) => {
        const todo = todos.value.find(todo => todo.id === id)
        if (todo) {
            todo.title = newTitle
        }
    }

    return {
        todos,
        addTodo,
        updateTodoTitle,
        removeTodo,
    }
}
