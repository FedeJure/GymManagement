import { MouseEventHandler } from "react"
import { Card, Image, Button} from "semantic-ui-react"
import { User } from "../../modules/users/User"
import {UserTypeLabel} from "../userTypeLabel/UserTypeLabel"

const UserCard = ({ user, onEdit, onDelete, onInfo }: { user: User,
    onEdit: MouseEventHandler, 
    onDelete: MouseEventHandler,
    onInfo: MouseEventHandler }) => (
    <Card>
        <Card.Content>
            {<Image
                floated='right'
                size='mini'
                src={user.profilePicture}
            />}
            <Card.Header textAlign="left">
                <UserTypeLabel user={user}/>      
            </Card.Header>
            <Card.Header textAlign="center">
                {user.lastname}, {user.name}
            </Card.Header>
            <Card.Meta>DNI: {user.dni} | {(new Date()).getFullYear() - user.birthDate.getFullYear()} años</Card.Meta>
            <Card.Description>
                {user.comment}
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