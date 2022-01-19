import { MouseEventHandler } from "react"
import { Card, Image, Button } from "semantic-ui-react"
import { User } from "../../domain/users/User"
import { getUserPayload } from "../../domain/users/UserPayload"
import { UserTypeLabel } from "../userTypeLabel/UserTypeLabel"

const UserCard = ({ user, onEdit, onDelete, onInfo }: {
    user: User,
    onEdit: MouseEventHandler,
    onDelete: MouseEventHandler,
    onInfo: MouseEventHandler
}) => (
    <Card style={{ height: "auto" }} color="teal">
        <Card.Content>
            {<Image
                rounded
                floated='right'
                size='mini'
                src={user.profilePicture}
            />}
            <Card.Header textAlign="left">
                <UserTypeLabel user={getUserPayload(user)} />
            </Card.Header>
            <Card.Header textAlign="center">
                {user.lastname}, {user.name}
            </Card.Header>
            <Card.Meta>DNI: {user.dni} | {(new Date()).getFullYear() - user.birthDate.getFullYear()} años</Card.Meta>
            <Card.Description >
                <p style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{user.comment}</p>
            </Card.Description>
        </Card.Content>
        <Card.Content extra>
            <Button size="mini" color="red" floated="right" icon="trash" onClick={onDelete}></Button>
            <Button size="mini" active floated="right" icon="edit" onClick={onEdit}></Button>
            <Button primary size="mini" active floated="left" icon="info circle" onClick={onInfo}></Button>
        </Card.Content>
    </Card>
)

export { UserCard }