import { UserState } from "./users.reducer"

export const getProducts = () => (state: UserState) => {
    return state.users
}