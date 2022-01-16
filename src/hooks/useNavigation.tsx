import React, { useState } from "react";
import { Screens } from "../domain/navigation/screens";

interface INavigationContext {
  currentScreen: Screens;
  navigateTo: (screen: Screens) => void;
}

const NavigationContext = React.createContext<INavigationContext>({
  currentScreen: Screens.Users,
  navigateTo: () => {},
});

export const NavigationProvider: React.FC = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState(Screens.Users);

  const navigateTo = (screen: Screens) => {
    setCurrentScreen(screen);
  };
  return (
    <NavigationContext.Provider value={{ currentScreen, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = React.useContext(NavigationContext);

  return context;
};
