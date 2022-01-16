import { NavigationState } from "./navigation.reducer"

export const getCurrentScreen = ({navigation}: {navigation: NavigationState}) => {
    return navigation.currentScreen
}