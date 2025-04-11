import { BrowserRouter } from 'react-router-dom';
import { Header } from './components/header';
import Router from './routes/Routes';
import { AuthProvider } from './components/authProvider';

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
