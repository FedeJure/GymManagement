import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Button, List, Header, Divider, Icon } from 'semantic-ui-react'
import { StoreState } from '../../store'
import { getUserSubscriptions } from "../../modules/subscription/subscription.selectors"
import { UserSubscription } from '../../modules/subscription/UserSubscription'

const Subscriptions = ({ userSubscriptions }: { userSubscriptions: UserSubscription[] }) => {

    return (<div>
        <Button color="blue" circular icon="plus" onClick={() => { }} />
        <Header as='h2' floated='left'>
            Suscripciones
        </Header>
        <Divider />

        <Divider />
        <List divided verticalAlign="middle">
            {userSubscriptions.map(s => (<List.Item style={{ padding: "0.5em" }}>
                <List.Content floated='right'>
                    <Button icon compact><Icon name="trash"></Icon>Borrar</Button>
                </List.Content>
                <List.Content floated='right'>
                    <Button icon compact><Icon name="file alternate outline"></Icon>Ver Detalle</Button>
                </List.Content>

                <List.Content floated="left">Adeuda pagos</List.Content>
                <List.Content floated="left">{s.product.name}</List.Content>
                <List.Content floated="left">{s.user.lastname}, {s.user.name}</List.Content>
                <List.Content floated="left">Desde {s.subscription.data.initialTime.toLocaleDateString()}</List.Content>
                {s.subscription.data.endTime ? <List.Content floated="left">Hasta 1/12/2021</List.Content>:
                <List.Content floated="left">Hasta indefinido</List.Content>}

            </List.Item>))}
        </List>
    </div>)
}


const mapStateToProps = (state: StoreState) => {
    return {
        userSubscriptions: getUserSubscriptions(state)
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        // createUser: (data: UserPayload) => dispatch(addUser(data)),
        // removeUser: (userId: number) => dispatch(removeUser(userId)),
        // editUser: (userId: number, data: UserPayload) => dispatch(editUser(userId, data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Subscriptions)