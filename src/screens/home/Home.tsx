import { Menu, Segment, Icon, Sidebar } from 'semantic-ui-react'
import "./Home.css"
import { Screens } from "../../domain/navigation/screens"
import Users from "../users/Users"
import Products from "../products/Products"
import { Reports } from "../reports/Reports"
import Subscriptions from '../subscriptions/Subscriptions'
import { useNavigation } from '../../hooks/useNavigation'

const Home = () => {
    const {currentScreen, navigateTo} = useNavigation()
    const getCurrentScreenElement = () => {
        switch (currentScreen) {
            case Screens.Users:
                return <Users />
            case Screens.Products:
                return <Products />
            case Screens.Reports:
                return <Reports />
            case Screens.Subscriptions:
                return <Subscriptions />
            default:
                return <></>
        }
    }
    return (
        <Sidebar.Pushable as={Segment}>
            <Sidebar
                as={Menu}
                icon='labeled'
                inverted
                vertical
                visible
                width="thin"
            >
                <Menu.Item as='a'
                    onClick={() => navigateTo(Screens.Users)}
                    active={currentScreen === Screens.Users}>
                    <Icon name='users' />
                    Personas
                </Menu.Item>
                <Menu.Item as='a'
                    onClick={() => navigateTo(Screens.Subscriptions)}
                    active={currentScreen === Screens.Subscriptions}>
                    <Icon name='table' />
                    Suscripciones
                </Menu.Item>
                <Menu.Item as='a'
                    onClick={() => navigateTo(Screens.Products)}
                    active={currentScreen === Screens.Products}>
                    <Icon name='shopping cart' />
                    Productos
                </Menu.Item>
                <Menu.Item as='a'
                    onClick={() => navigateTo(Screens.Reports)}
                    active={currentScreen === Screens.Reports}>
                    <Icon name='dashboard' />
                    Reportes
                </Menu.Item>
            </Sidebar>

            <Sidebar.Pusher className="homeScreen">
                <Segment style={{ paddingRight: "150px", minHeight: "100vh" }}>
                    {getCurrentScreenElement()}
                </Segment>
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    )
}

export default Home