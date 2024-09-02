import Nav from "./component/nav";
import Index from "./pages";
import Auth from "./pages/auth";
import Dashboard from "./pages/dashboard";
import { Route, Routes } from "react-router-dom";
import "primeicons/primeicons.css";

const App = () => {
	return (
		<>
			<Nav />
			<Routes>
				<Route path="/" element={<Index />} />
				<Route path="/auth" element={<Auth />} />
				<Route path="/dashboard" element={<Dashboard />} />
			</Routes>
		</>
	);
};

export default App;
