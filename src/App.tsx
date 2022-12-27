import { ErrorBoundary } from "react-error-boundary";
import { ChakraProvider } from "@chakra-ui/react";
import AlertTemplate from "react-alert-template-basic";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import "./App.css";
import Home from "./screens/home/Home";
import {Button, Icon, Container} from "@chakra-ui/react"
import { UserProvider } from "./hooks/useUsers";
import { OrderProvider } from "./hooks/useOrders";
import { SubscriptionProvider } from "./hooks/useSubscriptions";
import { ProductProvider } from "./hooks/useProducts";
import { NavigationProvider } from "./hooks/useNavigation";

const OurFallbackComponent = ({
  error,
  componentStack,
  resetErrorBoundary,
}: any) => {
  return (
    <Container style={{ minHeight: "100vh" }}>
      <Container>
        <Icon name="bug" />
        Ocurrio un error inesperado! Vuelva a intentar
      </Container>
      <Button onClick={resetErrorBoundary}>
        Recargar
      </Button>
    </Container>
  );
};

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_RIGHT,
  timeout: 3000,
  offset: "30px",
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

function App() {
  return (
    <ChakraProvider>
      <ErrorBoundary FallbackComponent={OurFallbackComponent}>
        <AlertProvider template={AlertTemplate} {...options}>
          <NavigationProvider>
            <UserProvider>
              <OrderProvider>
                <SubscriptionProvider>
                  <ProductProvider>
                    <div className="App">
                      <Home />
                    </div>
                  </ProductProvider>
                </SubscriptionProvider>
              </OrderProvider>
            </UserProvider>
          </NavigationProvider>
        </AlertProvider>
      </ErrorBoundary>
    </ChakraProvider>
  );
}

export default App;
