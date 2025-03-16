import React, { useContext, useState, useRef, useEffect } from "react";
import {
	FormContext,
	objFormContextValue,
	updateFieldType,
} from "../../Contexts/Context.tsx";
import "./Form.css";
import { handlerSubmit } from "@/Helpers/Helpers.tsx";

interface FormArgs {
	id: string;
	method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	action: string;
	className?: string;
	children: React.ReactNode;
	typeHandlerSubmit: "signup" | "login" | "reset";
}

interface InputProps {
	id: string;
	className?: string;
	label: string;
	type?:
		| "text"
		| "password"
		| "email"
		| "url"
		| "tel"
		| "search"
		| "number"
		| "range"
		| "date"
		| "month"
		| "week"
		| "time"
		| "datetime-local"
		| "datetime"
		| "color"
		| "file"
		| "checkbox"
		| "radio"
		| "submit"
		| "reset"
		| "button"
		| "hidden"
		| "image";
	name: string;
	errorMessage?: string;
	helperMessage?: string;
	required: boolean;
	regex?: RegExp;
	setIsDisabled: (arg: boolean) => void;
}

export default function Form({
	id,
	method,
	action,
	className = "",
	children,
	typeHandlerSubmit,
}: FormArgs) {
	const { formData } = useContext(FormContext!) as objFormContextValue;

	return (
		<form
			id={id}
			method={method}
			action={action}
			className={className}
			onSubmit={e => {
				e.preventDefault();
				handlerSubmit(typeHandlerSubmit, formData);
			}}
		>
			{children}
		</form>
	);
}

export const FormInput = ({
	id,
	className,
	label,
	type = "text",
	name,
	errorMessage,
	helperMessage,
	required,
	regex,
	setIsDisabled,
}: InputProps) => {
	const [inputType, setInputType] = useState("text");
	const [isValidField, setIsValidField] = useState(true);
	const [isEmptyField, setIsEmptyField] = useState(false);
	const fieldGroup = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (fieldGroup.current) {
			const form = fieldGroup.current.parentNode;
			const emptysMessages = form!.querySelectorAll(".emptyMessage");
			const errorMessages = form!.querySelectorAll(".errorMessage");
			if (emptysMessages.length > 0 || errorMessages.length > 0) {
				setIsDisabled(true);
			} else {
				setIsDisabled(false);
			}
		}
	}, [isValidField, isEmptyField, setIsDisabled]);

	const { updateField } = useContext(FormContext) as objFormContextValue;
	const handlerChange = (
		name: string,
		value: string,
		RegExp: RegExp | null = null,
		updateFunction: updateFieldType
	) => {
		if (!value.trim()) {
			setIsEmptyField(true);
			setIsValidField(true);

			return;
		}

		setIsEmptyField(false);

		if (!RegExp) {
			updateFunction(name, value);
			return;
		}

		if (!RegExp.test(value)) {
			setIsValidField(false);

			return;
		}

		setIsValidField(true);
		updateFunction(name, value);
	};

	const inputJsx =
		type === "date" ? (
			<input
				id={id}
				className={`${className} ${isEmptyField && "emptyInput"} ${
					!isValidField && "invalidInput"
				}`}
				type={inputType}
				name={name}
				required={required}
				onFocus={() => setInputType("date")}
				onBlur={e => {
					handlerChange(e.target.name, e.target.value, regex, updateField);
					setInputType("text");
				}}
			></input>
		) : (
			<input
				id={id}
				className={`${className} ${isEmptyField && "emptyInput"} ${
					!isValidField && "invalidInput"
				}`}
				type={type}
				name={name}
				required={required}
				onBlur={e =>
					handlerChange(e.target.name, e.target.value, regex, updateField)
				}
			></input>
		);

	return (
		<div className="fieldGroup" ref={fieldGroup}>
			{inputJsx}
			<label
				htmlFor={id}
				className={`${isEmptyField && "emptyLabel"} ${
					!isValidField && "invalidLabel"
				}`}
			>
				{label}
			</label>
			{!isValidField && errorMessage && (
				<p className="errorMessage">{errorMessage}</p>
			)}
			{isEmptyField && (
				<p className="emptyMessage">{`El campo ${label} es obligatorio.`}</p>
			)}
			<p className="helperMessage">{helperMessage}</p>
		</div>
	);
};

export const ButtonSubmit = ({
	children,
	idForm,
	isDisabled,
}: {
	children: React.ReactNode;
	idForm: string;
	isDisabled: boolean;
}) => {
	return (
		<button
			className="btn-submit"
			type="submit"
			form={idForm}
			disabled={isDisabled}
		>
			{children}
		</button>
	);
};
