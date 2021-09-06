import { connect } from 'react-redux'
import { Menu, Segment, Icon, Sidebar } from 'semantic-ui-react'
import "./Home.css"
import { Screens } from "../../modules/navigation/screens"
import { Users } from "../users/Users"
import Products from "../products/Products"
import { Reports } from "../reports/Reports"
import { navigateTo } from "../../modules/navigation/navigation.actions"

const Home = ({ screen, navigateToScreen }) => {
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
                width="thin"
            >
                <Menu.Item as='a' onClick={() => navigateToScreen(Screens.Users)}>
                    <Icon name='users' />
                    Personas
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

            <Sidebar.Pusher >
                <div style={{ paddingRight: "150px", minHeight: "100%" }}>
                    {getCurrentScreenElement()}
                </div>
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