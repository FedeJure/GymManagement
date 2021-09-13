import { getUserModel } from "../mongoClient"
import { UserPayload } from "../../../src/modules/users/UserPayload"
import { User } from "../../../src/modules/users/User"

export const getUsers = async ({ page, step, tagFilter, contentFilter }
    : { page: number, step: number, tagFilter?: string, contentFilter?: string }) => {
    const userModel = getUserModel()
    let queries: any[] = []
    if (tagFilter) {
        const filters = tagFilter.split(',')
        queries.push({ type: { $in: filters } })
    }

    if (contentFilter) {
        const filters = contentFilter.split(',')
        filters.forEach(f => {
            queries = [...queries, ...[{ name: { $regex: f, "$options": "i" } },
            { lastname: { $regex: f, "$options": "i" } },
            { dni: { $regex: f, "$options": "i" } },
            { contactEmail: { $regex: f, "$options": "i" } },
            { contactPhone: { $regex: f, "$options": "i" } }]]
        })
    }
    const withQueries = tagFilter != undefined || contentFilter != undefined
    return userModel.find(withQueries ? { $or: queries } : {}, null, { skip: step * page, limit: step })
}

export const saveUser = async (user: UserPayload) => {
    const userModel = getUserModel()
    const newUser = new userModel({ ...user })
    return userModel.create(newUser)
}

export const removeUser = async (userId: string) => {
    const userModel = getUserModel()
    return userModel.deleteOne({ _id: userId })
}

export const updateUser = async (user: User) => {
    const userModel = getUserModel()
    const newUser = new userModel({ ...user })
    return userModel.updateOne({ _id: user.id, ...user })
        .then(() => userModel.findOne({ _id: user.id }))
}