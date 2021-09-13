import { ErrorBoundary } from "react-error-boundary"
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import Home from "./screens/home/Home";
import { Provider } from 'react-redux';
import { store } from "./store"
import { Button, Header, Icon, Segment } from "semantic-ui-react";

const OurFallbackComponent = ({ error, componentStack, resetErrorBoundary }: any) => {
  return (
<Segment placeholder style={{minHeight: "100vh"}}>
    <Header icon>
      <Icon name="bug" />
      Ocurrio un error inesperado! Vuelva a intentar
    </Header>
    <Button primary onClick={resetErrorBoundary}>Recargar</Button>
  </Segment>
  );
};

function App() {
  return (
    <ErrorBoundary FallbackComponent={OurFallbackComponent}>
      <Provider store={store}>
        <div className="App">
          <Home />
        </div>
      </Provider>
    </ErrorBoundary>

  );
}

export default App;
