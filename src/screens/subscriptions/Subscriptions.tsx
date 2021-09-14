import { connect } from 'react-redux'
import { useEffect, useState } from 'react'
import { Dispatch } from 'redux'
import { Button, List, Header, Divider, Icon } from 'semantic-ui-react'
import { StoreState } from '../../store'
import { CreateSubscriptionModal } from "../../components/createSubscriptionModal/CreateSubscriptionModal"
import { SubscriptionPayload } from '../../modules/subscription/SubscriptionPayload'
import { createSubscriptionAction, fetchSubscriptionsAction } from '../../modules/subscription/subscription.actions'
import { Subscription } from '../../modules/subscription/Subscription'

const Subscriptions = ({ subscriptions, createSubscription, fetchSubscriptions }:
    { subscriptions: Subscription[], createSubscription: Function,fetchSubscriptions: Function }) => {
    const [creationModalOpen, setCreationModalOpen] = useState(false);

    const handleSubmit = (data: SubscriptionPayload) => {
        createSubscription(data)
        setCreationModalOpen(false)
    }

    useEffect(() => {
        fetchSubscriptions(0)
    }, [])


    return (<div>
        {creationModalOpen && <CreateSubscriptionModal onClose={() => setCreationModalOpen(false)}
            onSubmit={handleSubmit} />}
        <Button color="blue" circular icon="plus" onClick={() => setCreationModalOpen(true)} />
        <Header as='h2' floated='left'>
            Suscripciones
        </Header>
        <Divider />

        <Divider />
        <List divided verticalAlign="middle">
            {subscriptions.map(s => (<List.Item style={{ padding: "0.5em" }}>
                <List.Content floated='right'>
                    <Button icon compact><Icon name="trash"></Icon>Borrar</Button>
                </List.Content>
                <List.Content floated='right'>
                    <Button icon compact><Icon name="file alternate outline"></Icon>Ver Detalle</Button>
                </List.Content>

                <List.Content floated="left">Adeuda pagos</List.Content>
                <List.Content floated="left">{s.product.name}</List.Content>
                <List.Content floated="left">{s.user.lastname}, {s.user.name}</List.Content>
                <List.Content floated="left">Desde {s.initialTime.toLocaleDateString()}</List.Content>
                {s.endTime ? <List.Content floated="left">Hasta {s.endTime.toLocaleDateString()}</List.Content> :
                    <List.Content floated="left">Hasta indefinido</List.Content>}

            </List.Item>))}
        </List>
    </div>)
}


const mapStateToProps = (state: StoreState) => {
    return {
        subscriptions: state.subscription.subscriptions
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        createSubscription: (data: SubscriptionPayload) => createSubscriptionAction(data)(dispatch),
        fetchSubscriptions: (page: number, filterByContent: string[]) => fetchSubscriptionsAction({ page, filterByContent })(dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Subscriptions)