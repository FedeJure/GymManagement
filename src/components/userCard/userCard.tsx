import { MouseEventHandler } from "react"
import { Card, Image, Button, Rail} from "semantic-ui-react"
import { User } from "../../modules/users/User"
import {UserTypeLabel} from "../userTypeLabel/UserTypeLabel"

const UserCard = ({ user, onEdit, onDelete, onInfo }: { user: User,
    onEdit: MouseEventHandler, 
    onDelete: MouseEventHandler,
    onInfo: MouseEventHandler }) => (
    <Card>
        <Card.Content>
            <Image
                floated='right'
                size='mini'
                src={user.data.profilePicture}
            />
            <Card.Header textAlign="left">
                <UserTypeLabel user={user.data}/>      
            </Card.Header>
            <Card.Header textAlign="center">
                {user.data.lastname}, {user.data.name}
            </Card.Header>
            <Card.Meta>{(new Date()).getFullYear() - user.data.birthDate.getFullYear()} años</Card.Meta>
            <Card.Description>
                {user.data.comment}
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