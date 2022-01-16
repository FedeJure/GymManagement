import { connect } from 'react-redux'
import { Menu, Segment, Icon, Sidebar } from 'semantic-ui-react'
import "./Home.css"
import { Screens } from "../../domain/navigation/screens"
import Users from "../users/Users"
import Products from "../products/Products"
import { Reports } from "../reports/Reports"
import { navigateTo } from "../../domain/navigation/navigation.actions"
import Subscriptions from '../subscriptions/Subscriptions'

const Home = ({ screen, navigateToScreen }) => {
    const getCurrentScreenElement = () => {
        switch (screen) {
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
                    onClick={() => navigateToScreen(Screens.Users)}
                    active={screen === Screens.Users}>
                    <Icon name='users' />
                    Personas
                </Menu.Item>
                <Menu.Item as='a'
                    onClick={() => navigateToScreen(Screens.Subscriptions)}
                    active={screen === Screens.Subscriptions}>
                    <Icon name='table' />
                    Suscripciones
                </Menu.Item>
                <Menu.Item as='a'
                    onClick={() => navigateToScreen(Screens.Products)}
                    active={screen === Screens.Products}>
                    <Icon name='shopping cart' />
                    Productos
                </Menu.Item>
                <Menu.Item as='a'
                    onClick={() => navigateToScreen(Screens.Reports)}
                    active={screen === Screens.Reports}>
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

const mapStateToProps = (state) => {
    return {
        screen: state.navigation.currentScreen
    }
}

const mapDispatchToProps = (dispatch) => {
    return { navigateToScreen: (screen) => dispatch(navigateTo(screen)) }
}
export default connect(mapStateToProps, mapDispatchToProps)(Home)