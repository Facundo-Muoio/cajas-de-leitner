import "./ConfirmEmail.css";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function ConfirmEmail() {
	const navigate = useNavigate();

	useEffect(() => {
		const timer = setTimeout(() => {
			navigate("/dashboard");
		}, 3000);

		return () => clearTimeout(timer);
	}, [navigate]);

	return (
		<div className="container-confirm-email">
			<h2>¡Correo confirmado!</h2>
			<p>Tu cuenta ha sido verificada con éxito.</p>
			<p>Te estamos redirigiendo...</p>
		</div>
	);
}
