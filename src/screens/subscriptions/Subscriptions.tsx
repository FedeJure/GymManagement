import { Button, List, Header, Divider, Icon } from 'semantic-ui-react'

const Subscriptions = () => {

    return (<div>
        <Button color="blue" circular icon="plus" onClick={() => { }} />
        <Header as='h2' floated='left'>
            Suscripciones
        </Header>
        <Divider />

        <Divider />
        <List divided verticalAlign="middle">
            <List.Item style={{ padding: "0.5em" }}>
                <List.Content floated='right'>
                    <Button icon compact><Icon name="trash"></Icon>Borrar</Button>
                </List.Content>
                <List.Content floated='right'>
                    <Button icon compact><Icon name="file alternate outline"></Icon>Ver Detalle</Button>
                </List.Content>

                <List.Content floated="left">Adeuda pagos</List.Content>
                <List.Content floated="left">Ritmica</List.Content>
                <List.Content floated="left">Federico Jure</List.Content>
                <List.Content floated="left">Desde 1/09/2021</List.Content>
                <List.Content floated="left">Hasta 1/12/2021</List.Content>

            </List.Item>
        </List>
    </div>)
}

export default Subscriptions