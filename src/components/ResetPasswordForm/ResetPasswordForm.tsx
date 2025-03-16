import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { GoKey } from "react-icons/go";
import { supabase } from "@/supabase/client";
import tree from "../../assets/images/tree-primary.webp";
import Loader from "../Loader/Loader";
import { Link } from "react-router";
import "./ResetPasswordForm.css";
import { onClickLabel, onInput } from "@/Helpers/Helpers";

const resetSchema = z.object({
	email: z.string().email("El email es invalido"),
});

export default function ResetPasswordForm() {
	const [error, setError] = useState("");

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting, isSubmitSuccessful },
	} = useForm({
		resolver: zodResolver(resetSchema),
		mode: "onBlur",
	});

	const onSubmit = async ({ email }: { email: string }) => {
		const { error } = await supabase.auth.resetPasswordForEmail(email);
		if (error) {
			console.error(error.message);
			setError(error.message);
		}
		setError("");
		reset();
	};

	return (
		<div className="container-signup-form">
			<div className="container-leftSide">
				<img src={tree} alt="arbol con notas como hojas" />
			</div>
			<div className="container-rigthSide">
				{isSubmitSuccessful ? (
					<div className="container-recovery-password">
						<div className="oAuth-logo-form">
							<GoKey className="iconKey" />
						</div>
						<h2>Resetea tu contraseña</h2>
						<p>
							Hemos enviado un enlace de recuperación a tu correo. Revisa tu
							bandeja de entrada (y también la de spam, por si acaso) para
							restablecer tu contraseña.
						</p>
					</div>
				) : (
					<form
						id="reset-password-form"
						className="oAuth-form"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className="oAuth-logo-form">
							<GoKey className="iconKey" />
						</div>

						<h2>¿Olvidaste tu contraseña?</h2>
						<p className="oAuth-subTitle">
							No te preocupes. Ingresa tu correo y te ayudaremos a recuperarla
							para que sigas aprendiendo sin interrupciones
						</p>
						<div
							className={
								errors.email ? "input-group input-error" : "input-group"
							}
						>
							<input
								type="email"
								{...register("email")}
								onInput={onInput}
								required
							/>
							<label htmlFor="email" onClick={onClickLabel}>
								Email
							</label>
							{errors.email && (
								<p className="error-message">{errors.email.message}</p>
							)}
						</div>
						<button type="submit">
							{isSubmitting ? <Loader /> : "Recuperar Contraseña"}
						</button>
						{error && <p className="error-message">{error}</p>}
						<p>
							Volver al{" "}
							<Link to="/login" className="oAuth-anchor-form">
								incio de sesión
							</Link>
						</p>
					</form>
				)}
			</div>
		</div>
	);
}
