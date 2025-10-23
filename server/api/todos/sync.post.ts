import { prisma } from "~~/server/utils/prisma"
import { z } from "zod"
import { getCurrentUser } from "~~/server/utils/session"

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
    const user = await getCurrentUser(event)
    const parsed = await schema.safeParseAsync(body)

    if(!user) {
        throw createError({
            status: 401
        })
    }

    if (parsed.error) {
        console.warn(parsed.error)
        throw createError({
            status: 400,
            message: 'Invalid request body'
        })
    }
    const data = parsed.data

    const count = await prisma.todoList.count({
        where: {
            id: data.id,
        }
    })

    if(count > 0) {
        throw createError({
            status: 409,
            message: 'Todo list with this ID already exists'
        })
    }

    await prisma.todoList.create({
        data: {
            id: data.id,
            title: data.title,
            userId: user.id,
            items: {
                createMany: {
                    data: data.items,
                },
            },
        },
    })
    return {
        message: `Todo list synced (${data.title}) successfully`
    }
})