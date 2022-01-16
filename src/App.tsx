import { ErrorBoundary } from "react-error-boundary";
import AlertTemplate from "react-alert-template-basic";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import Home from "./screens/home/Home";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
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
    <Segment placeholder style={{ minHeight: "100vh" }}>
      <Header icon>
        <Icon name="bug" />
        Ocurrio un error inesperado! Vuelva a intentar
      </Header>
      <Button primary onClick={resetErrorBoundary}>
        Recargar
      </Button>
    </Segment>
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
  );
}

export default App;
