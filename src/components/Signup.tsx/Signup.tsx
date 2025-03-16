import "./Signup.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { supabase } from "@/supabase/client";
import Loader from "../Loader/Loader";
import { GiArchiveRegister } from "react-icons/gi";
import { FaGoogle } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router";
import tree from "../../assets/images/tree-primary.webp";
import {
	onAuthSignUp,
	AuthProvider,
	onClickLabel,
	onInput,
} from "@/Helpers/Helpers";

const signupSchema = z
	.object({
		email: z.string().email("El email no es válido."),
		password: z
			.string()
			.min(8, "Son necesarios al menos 8 caracteres")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
				"Debe contener una mayúscula, un número y al menos una minúscula."
			),
		repeatPassword: z.string().min(8, "Son necesarios al menos 8 caracteres"),
	})
	.refine(({ password, repeatPassword }) => password === repeatPassword, {
		message: "Las contraseñas no coinciden",
		path: ["repeatPassword"],
	});

type SignUpForm = z.infer<typeof signupSchema>;

export default function Signup() {
	const {
		register,
		handleSubmit,
		formState: { isSubmitting, isSubmitSuccessful, errors },
		reset,
	} = useForm<SignUpForm>({
		resolver: zodResolver(signupSchema),
		mode: "onBlur",
	});

	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const onCLick = (provider: AuthProvider) => {
		setIsLoading(true);
		onAuthSignUp(provider);
	};

	const onSubmit = async ({
		email,
		password,
	}: {
		email: string;
		password: string;
	}) => {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) {
			setError(error.message);
		}

		reset();
		console.log("usuario resgistrado exitosamente", { data });
	};

	return (
		<div className="container-signup-form">
			<div className="container-leftSide">
				<img src={tree} alt="arbol con notas como hojas" />
			</div>
			<div className="container-rigthSide">
				{isSubmitSuccessful ? (
					<div className="container-success-signup">
						<h2>Registo Exitoso!</h2>
						<p>
							¡Registro exitoso! 📩 Te hemos enviado un correo de confirmación.
							Por favor, revisa tu bandeja de entrada (y la carpeta de spam)
							para verificar tu cuenta y completar el proceso de registro.
						</p>
					</div>
				) : (
					<form
						id="signUp"
						className="oAuth-form"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className="oAuth-logo-form">
							<GiArchiveRegister className="iconKey" />
						</div>

						<p className="oAuth-subTitle">
							Organiza tu aprendizaje y potencia tu memoria con el método de
							Leitner.¡Regístrate y empieza a aprender de manera más efectiva!
						</p>
						<div
							className={
								errors.email ? "input-group input-error" : "input-group"
							}
						>
							<input
								type="email"
								{...register("email")}
								required
								onInput={onInput}
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
							{isSubmitting ? <Loader /> : "Registrarse"}
						</button>
						{error && <p className="error-message">{error}</p>}
						<p>
							Ya tienes una cuenta?{" "}
							<Link to="/login" className="oAuth-anchor-form">
								Iniciar Sesión
							</Link>
						</p>
						<div className="oAuth-divider">
							<hr />
							<span>O registrarse con</span>
							<hr />
						</div>
						<div className="container-group-btns">
							<button onClick={() => onCLick("google")}>
								{!isLoading ? (
									<FaGoogle className="oAuth-icon-button" />
								) : (
									<Loader size="24" />
								)}
							</button>
							<button onClick={() => onCLick("facebook")}>
								{!isLoading ? (
									<FaFacebook className="oAuth-icon-button" />
								) : (
									<Loader size="24" />
								)}
							</button>
							<button onClick={() => onCLick("github")}>
								{!isLoading ? (
									<FaGithub className="oAuth-icon-button" />
								) : (
									<Loader size="24" />
								)}
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
