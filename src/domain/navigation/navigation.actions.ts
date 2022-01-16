import { Screens } from "./screens";
import {NavigationAction} from "./navigation.reducer"

export const navigateTo = (screen: Screens) : NavigationAction => {
    return {
        type: "NAVIGATE_TO",
        screen
    }
}