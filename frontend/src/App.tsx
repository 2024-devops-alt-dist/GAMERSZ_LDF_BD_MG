import { BrowserRouter } from "react-router-dom";
import { Header } from "./components/header";
import Router from "./routes/Routes";
import { AuthProvider } from "./components/authProvider";
import { SocketProvider } from "./context/socket-context";

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<SocketProvider>
					<Header />
					<Router />
				</SocketProvider>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
