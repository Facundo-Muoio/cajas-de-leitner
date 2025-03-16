import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { GoKey } from "react-icons/go";
import { supabase } from "@/supabase/client";
import { User } from "@supabase/supabase-js";
import tree from "../../assets/images/tree-primary.webp";
import Loader from "../Loader/Loader";
import { onClickLabel } from "@/Helpers/Helpers";

const resetSchema = z
	.object({
		password: z
			.string()
			.min(8, "Debe tener al menos 8 caracters")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
				"Debe contener una mayúscula, un número y al menos una minúscula."
			),
		repeatPassword: z.string(),
	})
	.refine(({ password, repeatPassword }) => password === repeatPassword, {
		message: "Las contraseñas no coinciden",
		path: ["repeatPassword"],
	});

export default function UpdatePassword() {
	const [user, setUser] = useState<User | null>(null);
	const [error, setError] = useState("");

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(resetSchema),
		mode: "onBlur",
	});

	const onSubmit = async ({ password }: { password: string }) => {
		const {
			data: { user },
			error,
		} = await supabase.auth.updateUser({
			password,
		});
		if (error) {
			console.error(error.message);
			setError(error.message);
		}

		if (user) {
			setError("");
			setUser(user);
			reset();
		}
	};

	return (
		<div className="container-signup-form">
			<div className="container-leftSide">
				<img src={tree} alt="arbol con notas como hojas" />
			</div>
			<div className="container-rigthSide">
				{user ? (
					<div className="container-recovery-password">
						<div className="oAuth-logo-form">
							<GoKey className="iconKey" />
						</div>
						<h2>Reestablecimiento exitoso!</h2>
						<p>
							¡Tu contraseña ha sido restablecida con éxito! Ahora puedes
							iniciar sesión y seguir avanzando en tu aprendizaje.
						</p>
						<p>
							Regresar al
							<a href="/login" className="oAuth-anchor-form">
								{" "}
								inicio de sesión
							</a>
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

						<h2>Restablecer Contraseña</h2>
						<p className="oAuth-subTitle">
							"Ingresa tu nueva contraseña y confírmala para restablecer tu
							acceso. Asegúrate de elegir una segura y que puedas recordar."
						</p>
						<div
							className={
								errors.password ? "input-group input-error" : "input-group"
							}
						>
							<input type="password" {...register("password")} required />
							<label htmlFor="password" onClick={onClickLabel}>
								Contraseña
							</label>
							{errors.password && (
								<p className="error-message">{errors.password.message}</p>
							)}
						</div>
						<div
							className={
								errors.repeatPassword
									? "input-group input-error"
									: "input-group"
							}
						>
							<input type="password" {...register("repeatPassword")} required />
							<label htmlFor="repeatPassword" onClick={onClickLabel}>
								Repetir contraseña
							</label>
							{errors.repeatPassword && (
								<p className="error-message">{errors.repeatPassword.message}</p>
							)}
						</div>
						<button type="submit">
							{isSubmitting ? <Loader /> : "Recuperar Contraseña"}
						</button>
						{error && <p className="error-message">{error}</p>}
					</form>
				)}
			</div>
		</div>
	);
}
