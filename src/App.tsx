import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Signup from "./components/Signup.tsx/Signup";
import Dashboard from "./components/Dashboard/Dashboard";
import ConfirmEmail from "./components/ConfirmEmail/ConfirmEmail";
import Login from "./components/Login/Login";
import ResetPasswordForm from "./components/ResetPasswordForm/ResetPasswordForm";
import UpdatePassword from "./components/UpdatePassword/UpdatePassword";
import Boxes from "./components/Boxes/Boxes";
import Box from "./components/Boxes/Box/Box";

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/reset-password" element={<ResetPasswordForm />} />
					<Route path="/update-password" element={<UpdatePassword />} />
					<Route path="/confirm-user" element={<ConfirmEmail />} />
				</Routes>
				<Routes>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route
						path="/boxes"
						element={
							<Boxes>
								<Box nameOfBox="Matemáticas" numberOfCards={15} />
								<Box
									nameOfBox="Sistemas Tácticos"
									numberOfCards={23}
									description="posicionamientos tácticos en ataque y defensa"
								/>
								<Box
									nameOfBox="Cocina"
									numberOfCards={11}
									description="Recetas impresindibles para mi casa"
								/>
							</Boxes>
						}
					/>
				</Routes>
			</BrowserRouter>
			{/* <LayoutAccount
				src="./src/assets/images/tree-primary.webp"
				alt="arbol con hojas y notas"
			/> */}
			{/* <Dashboard /> */}
			{/* <Boxes>
				<Box
					nameOfBox="Matemática"
					numberOfCards={15}
					description="Un repaso sobre trigonometría fundamental"
				/>
				<Box
					nameOfBox="Química"
					numberOfCards={10}
					description="Formación de sales y ácidos"
				/>
				<Box
					nameOfBox="Física"
					numberOfCards={15}
					description="Estudo de la cinemática"
				/>
				<Box
					nameOfBox="Lengua"
					numberOfCards={15}
					description="Obras literarias modernas"
				/>
			</Boxes> */}
		</>
	);
}

export default App;
