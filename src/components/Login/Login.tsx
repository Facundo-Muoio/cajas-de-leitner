import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Loader from "../Loader/Loader";
import { supabase } from "@/supabase/client";
import { useNavigate } from "react-router";
import tree from "../../assets/images/tree-primary.webp";
import { FaUserGraduate } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router";
import {
	AuthProvider,
	onAuthSignUp,
	onInput,
	onClickLabel,
} from "@/Helpers/Helpers";

const loginSchema = z.object({
	email: z.string().email("Email inválido"),
	password: z
		.string()
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
			"Debe contener una mayúscula, un número y al menos una minúscula."
		),
});

export default function Login() {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm({ resolver: zodResolver(loginSchema), mode: "onBlur" });
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const onSubmit = async ({
		email,
		password,
	}: {
		email: string;
		password: string;
	}) => {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			console.error(error.message);
			setError(error.message);
		} else {
			setError("");
			reset();
			navigate("/dashboard");
		}
	};

	const onClick = (provider: AuthProvider) => {
		setIsLoading(true);
		onAuthSignUp(provider);
	};

	return (
		<div className="container-signup-form">
			<div className="container-leftSide">
				<img src={tree} alt="arbol con notas como hojas" />
			</div>
			<div className="container-rigthSide">
				<form
					id="login"
					className="oAuth-form"
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className="oAuth-logo-form">
						<FaUserGraduate className="iconKey" />
					</div>

					<h2>Inicio de Sesión</h2>
					<p className="oAuth-subTitle">
						Bienvenido nuevamente! Tu conocimiento te espera. Con nuestro
						sistema, ¡olvídate de olvidar, tu estudio, tu ritmo!{" "}
					</p>
					<div
						className={errors.email ? "input-group input-error" : "input-group"}
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
					<button type="submit">
						{isSubmitting ? <Loader /> : "Iniciar Sesión"}
					</button>
					{error && (
						<p className="error-message">
							El email o la contraseña son incorrectos
						</p>
					)}
					<p>
						Olvidaste tu contraseña?{" "}
						<Link className="oAuth-anchor-form" to="/reset-password">
							recuperarla
						</Link>
					</p>
					<div className="oAuth-divider">
						<hr />
						<span>O inciar sesión con</span>
						<hr />
					</div>
					<div className="container-group-btns">
						<button onClick={() => onClick("google")}>
							{!isLoading ? (
								<FaGoogle className="oAuth-icon-button" />
							) : (
								<Loader size="24" />
							)}
						</button>
						<button onClick={() => onClick("facebook")}>
							{!isLoading ? (
								<FaFacebook className="oAuth-icon-button" />
							) : (
								<Loader size="24" />
							)}
						</button>
						<button onClick={() => onClick("github")}>
							{!isLoading ? (
								<FaGithub className="oAuth-icon-button" />
							) : (
								<Loader size="24" />
							)}
						</button>
					</div>
					<p>
						Todavía no tines cuenta?{" "}
						<Link className="oAuth-anchor-form" to="/signup">
							registrarse
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
