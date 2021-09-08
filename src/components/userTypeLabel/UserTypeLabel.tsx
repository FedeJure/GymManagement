import { Label } from "semantic-ui-react"
import { UserPayload } from "../../modules/users/UserPayload"
import { UserType } from "../../modules/users/UserType";

export const UserTypeLabel = ({ user }: { user: UserPayload }) => (
    <Label size="tiny" color={(() => {
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
    })()} >{user.type}</Label>
)