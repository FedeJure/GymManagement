import { ErrorBoundary } from "react-error-boundary";
import AlertTemplate from "react-alert-template-basic";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import Home from "./screens/home/Home";
import { Provider } from "react-redux";
import { store } from "./store";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import { UserProvider } from "./hooks/useUsers";

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
        <Provider store={store}>
          <UserProvider>
            <div className="App">
              <Home />
            </div>
          </UserProvider>
        </Provider>
      </AlertProvider>
    </ErrorBoundary>
  );
}

export default App;
