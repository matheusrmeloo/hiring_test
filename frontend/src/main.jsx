import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import PropTypes from "prop-types";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Play from "./components/Play/Play";
import MemoryGame from "./components/MemoryCardGame/MemoryCardGame";
import CongratulationsScreen from "./components/Congratulations/CongratulationScreen";
import GameHistory from "./components/History/GameHistory";

const theme = createTheme({
	components: {
		MuiCssBaseline: {
			styleOverrides: `
        html, body, #root {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          position: relative;
        }
        
        * {
          box-sizing: border-box;
        }
      `,
		},
	},
});

const ViewportContainer = ({ children }) => (
	<Box
		sx={{
			height: "100vh",
			width: "100vw",
			overflow: "hidden",
			position: "relative",
			display: "flex",
			flexDirection: "column",
		}}
	>
		{children}
	</Box>
);

ViewportContainer.propTypes = {
	children: PropTypes.node.isRequired,
};

const App = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(
		!!localStorage.getItem("token"),
	);

	const handleLogin = () => {
		setIsAuthenticated(true);
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("userID");
		setIsAuthenticated(false);
		console.log("User logged out.");
	};

	return (
		<Router>
			<ViewportContainer>
				<Routes>
					<Route
						path="/login"
						element={
							isAuthenticated ? (
								<Navigate to="/play" />
							) : (
								<Login onLogin={handleLogin} />
							)
						}
					/>
					<Route
						path="/register"
						element={isAuthenticated ? <Navigate to="/play" /> : <Register />}
					/>

					<Route
						path="/play"
						element={
							isAuthenticated ? (
								<Play onLogout={handleLogout} />
							) : (
								<Navigate to="/login" />
							)
						}
					/>

					<Route
						path="/game/:difficultyKey"
						element={
							isAuthenticated ? <MemoryGame /> : <Navigate to="/login" />
						}
					/>

					<Route
						path="/congrats/:difficultyKey"
						element={
							isAuthenticated ? (
								<CongratulationsScreen />
							) : (
								<Navigate to="/login" />
							)
						}
					/>

					<Route
						path="/history"
						element={
							isAuthenticated ? <GameHistory /> : <Navigate to="/login" />
						}
					/>

					<Route
						path="/"
						element={<Navigate to={isAuthenticated ? "/play" : "/login"} />}
					/>
					<Route
						path="*"
						element={<Navigate to={isAuthenticated ? "/play" : "/login"} />}
					/>
				</Routes>
			</ViewportContainer>
		</Router>
	);
};

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<App />
		</ThemeProvider>
	</StrictMode>,
);
