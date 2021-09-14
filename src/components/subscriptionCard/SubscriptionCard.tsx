import { Button, Icon, List } from "semantic-ui-react"
import { Subscription } from "../../modules/subscription/Subscription"

export const SubscriptionCard = ({ subscription }: { subscription: Subscription }) => (
    <List.Item style={{ padding: "0.5em" }}>
        <List.Content floated='right'>
            <Button icon compact><Icon name="trash"></Icon>Borrar</Button>
        </List.Content>
        <List.Content floated='right'>
            <Button icon compact><Icon name="file alternate outline"></Icon>Ver Detalle</Button>
        </List.Content>

        <List.Content floated="left">Adeuda pagos</List.Content>
        <List.Content floated="left">{subscription.product.name}</List.Content>
        <List.Content floated="left">{subscription.user.lastname}, {subscription.user.name}</List.Content>
        <List.Content floated="left">Desde {subscription.initialTime.toLocaleDateString()}</List.Content>
        {subscription.endTime ? <List.Content floated="left">Hasta {subscription.endTime.toLocaleDateString()}</List.Content> :
            <List.Content floated="left">Hasta indefinido</List.Content>}

    </List.Item>
)