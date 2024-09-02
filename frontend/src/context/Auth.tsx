import { createContext, useState, useEffect, ReactNode } from "react";

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<IUser | null>(null);
	const [loading, setLoading] = useState(true);

	// Simulate fetching user from an API or localStorage
	useEffect(() => {
		const storedUser = localStorage.getItem("access_token");
		if (storedUser) {
			setUser(() => ({ token: storedUser }));
		}
		setLoading(false);
	}, []);

	const login = (userData: IUser) => {
		setUser(userData);
		localStorage.setItem("access_token", userData.token);
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("access_token");
	};

	return (
		<AuthContext.Provider value={{ user, login, logout, loading }}>
			{loading ? <h1>Loading </h1> : children}
		</AuthContext.Provider>
	);
};

// Export the context to be used by other components
export default AuthContext;

interface IUser {
	token: string;
}

interface AuthProviderProps {
	children: ReactNode;
}

interface AuthContextType {
	user: IUser | null;
	login: (userData: IUser) => void;
	logout: () => void;
	loading: boolean;
}
