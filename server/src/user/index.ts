import { getUserModel } from "../mongoClient"
import { UserPayload } from "../../../src/modules/users/UserPayload"
import { User } from "../../../src/modules/users/User"

export const getUsers = async ({ page, step }: { page: number, step: number }) => {
    const userModel = getUserModel()
    return userModel.find({}, null, { skip: step * page, limit: step })
}

export const saveUser = async (user: UserPayload) => {
    const userModel = getUserModel()
    const newUser = new userModel({ ...user })
    return userModel.create(newUser)
}

export const removeUser = async (userId: number) => {
    const userModel = getUserModel()
    return userModel.deleteOne({ _id: userId })
        .then(() => userModel.find({ _id: userId }))
}

export const updateUser = async (user: User) => {
    const userModel = getUserModel()
    const newUser = new userModel({ ...user })
    return userModel.updateOne({ _id: user.id, ...user })
        .then(() => userModel.findOne({ _id: user.id }))
}