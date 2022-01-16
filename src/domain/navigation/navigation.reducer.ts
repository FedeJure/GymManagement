import { Screens } from "./screens";

export interface NavigationState {
    currentScreen: string
}

export interface NavigationAction {
    type: string,
    screen: Screens
}

const initialState: NavigationState = {
    currentScreen: Screens.Users
}

export const navigation = (state: NavigationState, action: NavigationAction) : NavigationState => {
    if (!state) return initialState
    switch (action.type) {
        case "NAVIGATE_TO":
            return {
                ...state,
                currentScreen: action.screen
            }    
        default:
            return state
    }
}