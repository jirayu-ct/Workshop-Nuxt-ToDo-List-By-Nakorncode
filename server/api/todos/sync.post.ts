import { prisma } from "~~/server/utils/prisma"
import { z } from "zod"

const schema = z.object({
    id: z.uuid(),
    // onlineMode: z.boolean(),
    title: z.string(),
    items: z.array(
        z.object({
            id: z.string(),
            title: z.string(),
            done: z.boolean(),
        }),
    ),
})
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    console.log('Received sync request with body:', body)

    const parsed = await schema.safeParseAsync(body)
    if (parsed.error) {
        console.warn(parsed.error)
        throw createError({
            status: 400,
            message: 'Invalid request body'
        })
    }
    const { title, items, id } = parsed.data
    await prisma.todoList.create({
        data: {
            id,
            title,
            items: {
                createMany: {
                    data: items,
                },
            },
        },
    })
    return {
        message: `Todo list synced (${title}) successfully`
    }
})