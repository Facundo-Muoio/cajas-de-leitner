import "./Form.css";
import {
	useForm,
	SubmitHandler,
	FieldValues,
	FieldError,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema } from "zod";
import Loader from "../Loader/Loader";
import { useEffect } from "react";

interface defaultValue {
	name: string;
	description?: string;
	[key: string]: string | undefined;
}

export interface Field {
	name: string;
	label: string;
	type: "textarea" | "text" | "number" | "password" | "email";
}

interface FormProps {
	schema: ZodSchema;
	fields: Field[];
	defaultValuesProp?: defaultValue;
	onSubmit: SubmitHandler<Partial<FieldValues>>;
	labelButton: string;
	error?: string;
	isModalOpen?: boolean;
	setIsModalOpen?: (value: React.SetStateAction<boolean>) => void;
	setAlertVisible?: (value: React.SetStateAction<boolean>) => void;
}

export default function Form({
	schema,
	fields,
	onSubmit,
	labelButton,
	defaultValuesProp,
	setIsModalOpen,
	setAlertVisible,
	isModalOpen,
	error,
}: FormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm({
		resolver: zodResolver(schema),
		mode: "onBlur",
	});

	useEffect(() => {
		if (isModalOpen) {
			reset();
		}
	}, [isModalOpen, reset]);

	const handlerSubmit = async (fields: FieldValues) => {
		await onSubmit(fields);
		if (setIsModalOpen) {
			setIsModalOpen(false);
		}
		if (setAlertVisible) {
			setAlertVisible(true);
		}
		reset();
	};

	return (
		<form onSubmit={handleSubmit(handlerSubmit)} className="form-generic">
			{fields.map((field, id) => (
				<div
					className={
						errors[field.name] ? "fieldGroup fieldGroup-error" : "fieldGroup"
					}
					key={id}
				>
					<label htmlFor={field.name}>{field.label}</label>
					{field.type === "text" ? (
						<input
							type={field.type}
							{...register(field.name)}
							defaultValue={
								defaultValuesProp ? defaultValuesProp[field.name] : ""
							}
						/>
					) : (
						<textarea
							{...register(field.name)}
							defaultValue={
								defaultValuesProp ? defaultValuesProp[field.name] : ""
							}
							rows={6}
						/>
					)}
					{errors[field.name] && (
						<p className="error-message">
							{(errors[field.name] as FieldError).message}
						</p>
					)}
				</div>
			))}
			<button type="submit" disabled={Object.keys(errors).length > 0}>
				{isSubmitting ? <Loader /> : labelButton}
			</button>
			{error && <p className="error-message">{error}</p>}
		</form>
	);
}
