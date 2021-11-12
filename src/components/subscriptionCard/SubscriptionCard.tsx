import { Button, Card, Icon, Label, List } from "semantic-ui-react"
import { Subscription } from "../../modules/subscription/Subscription"

interface ISubscriptionCard {
    subscription: Subscription
    handleDelete: Function
    handleCreateOrder: Function
    handleDetails: () => void
}

export const SubscriptionCard: React.FC<ISubscriptionCard> = ({ subscription, handleDelete, handleCreateOrder, handleDetails }) => (
    <List.Item style={{ padding: "0.5em", width: "100%" }}>
        <Card fluid color="teal">
            <Card.Content>
                <List.Content floated='right'>
                    <Button primary icon compact onClick={() => handleCreateOrder(subscription.id)}><Icon name="dollar"></Icon>Crear orden de cobro</Button>
                    <Button inverted secondary icon compact onClick={() => handleDelete()}><Icon name="trash"></Icon>Borrar</Button>
                </List.Content>
                <List.Content floated='right'>
                    <Button onClick={() => handleDetails()} primary icon compact><Icon name="file alternate outline"></Icon>Ver Detalle</Button>
                </List.Content>

                {subscription.pendingPay && <List.Content floated="left"><Label>Adeuda</Label></List.Content>}
                <List.Content floated="left">{subscription.product.name}</List.Content>
                <List.Content floated="left">{subscription.user.lastname}, {subscription.user.name}</List.Content>
                <List.Content floated="left">Desde {subscription.initialTime.toLocaleDateString()}</List.Content>
                {subscription.endTime ? <List.Content floated="left">Hasta {subscription.endTime.toLocaleDateString()}</List.Content> :
                    <List.Content floated="left">Hasta indefinido</List.Content>}
            </Card.Content>
        </Card>


    </List.Item>
)