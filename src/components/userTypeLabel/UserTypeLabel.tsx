import { UserPayload } from "../../domain/users/UserPayload"
import { UserType } from "../../domain/users/UserType";
import {Tag} from "@chakra-ui/react"

export const UserTypeLabel = ({ user }: { user: UserPayload }) => (
    <Tag size="md" colorScheme={(() => {
        switch (user.type) {
            case UserType.ADMIN:
                return "green"
            case UserType.STUDENT:
                return "yellow"
            case UserType.TRAINER:
                return "orange"
            default:
                return "black"
        }
    })()} >{user.type}</Tag>
)