import { BrowserRouter } from 'react-router-dom';
import { Header } from './components/header';
import { AuthProvider } from './context/auth-context';
import Router from './routes/Routes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Router />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
