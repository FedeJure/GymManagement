import { connect } from 'react-redux'
import { Icon, Menu, Segment, Sidebar } from 'semantic-ui-react'
import "./Home.css"
import { Screens } from "../../modules/navigation/screens"
import {Users} from "../users/Users"
import Products from "../products/Products"
import {Reports} from "../reports/Reports"
import { StoreState } from "../../store"
import { navigateTo } from "../../modules/navigation/navigation.actions"
import React from 'react'

const Home = ({ screen, navigateToScreen }: { screen: string, navigateToScreen: Function}) => {
    const getCurrentScreenElement = () => {
        switch (screen) {
            case Screens.Users:
                return <Users />
            case Screens.Products:
                return <Products />
            case Screens.Reports:
                return <Reports />
            default:
                return <></>
        }
    }
    return (
        <Sidebar.Pushable as={Segment} className="homeScreen">
            <Sidebar
                as={Menu}
                icon='labeled'
                inverted
                vertical
                visible
                width='thin'
            >
                <Menu.Item as='a' onClick={() => navigateToScreen(Screens.Users)}>
                    <Icon name='users' />
                    Usuarios
                </Menu.Item>
                <Menu.Item as='a' onClick={() => navigateToScreen(Screens.Products)}>
                    <Icon name='table' />
                    Productos
                </Menu.Item>
                <Menu.Item as='a' onClick={() => navigateToScreen(Screens.Reports)}>
                    <Icon name='dashboard' />
                    Reportes
                </Menu.Item>
            </Sidebar>

            <Sidebar.Pusher>
                <Segment basic>
                   {getCurrentScreenElement()}
                </Segment>
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    )
}

const mapStateToProps = (state: StoreState) => {
    return {
        screen: state.navigation.currentScreen
    }
}

const mapDispatchToProps = (dispatch: Function) => {
    return {navigateToScreen: (screen: Screens) => dispatch(navigateTo(screen))}
}
export default connect(mapStateToProps, mapDispatchToProps)(Home)