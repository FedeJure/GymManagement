import {Card, Image, Button} from "semantic-ui-react"
import {User} from "../../modules/users/users.reducer"
const UserCard = ({user}: {user: User}) => (
    <Card>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src={user.data.profilePicture}
        />
        <Card.Header>{user.data.lastname}, {user.data.name}</Card.Header>
        <Card.Meta>{(new Date()).getFullYear() - user.data.birthDate.getFullYear()} años</Card.Meta>
        <Card.Description>
          {user.data.comment}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>

      </Card.Content>
    </Card>
)

export { UserCard }