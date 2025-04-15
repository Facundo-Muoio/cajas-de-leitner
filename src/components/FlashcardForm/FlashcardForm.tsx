import "./FlashcardForm.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { FlashcardType, PartialFlashcard } from "./TypesFlashcardForm";
import { useNavigate, useParams } from "react-router";
import Editor from "../Editor/Editor";
import { AddFlashcard } from "./AddFlashcardForm/AddFlashcardForm";
import { EditFlashcard } from "./EditFlashcardForm/EditFlashcardForm";
import { Flashcard } from "@/Contexts/FlashcardsContext";
import { useState, useContext } from "react";
import { IoCloseOutline } from "react-icons/io5";
import {
	AlertsFlashcardsContext,
	TypeAlertsFlashcardsContexts,
} from "@/Contexts/AlertsFlashcards";

interface FlashcardFormProps {
	handler: AddFlashcard | EditFlashcard;
	flashcard?: Flashcard;
}

export default function FlashcardForm({
	handler,
	flashcard,
}: FlashcardFormProps) {
	const navigate = useNavigate();
	const { setisAddAlertFlashcard, setisEditAlertFlashcard } = useContext(
		AlertsFlashcardsContext
	) as TypeAlertsFlashcardsContexts;
	const initialTagsInput = flashcard?.tags ? flashcard.tags.join(", ") : "";
	const [tagsInput, setTagsInput] = useState(initialTagsInput);

	const FlashcardFormSchema = z
		.object({
			id: z.string().uuid().optional(), // Add the 'id' field as optional
			deck_id: z.string().uuid({ message: "ID Inválido" }),
			type: z.enum(["open", "multiple", "truefalse", "fill"]).default("open"),
			question: z
				.string()
				.trim()
				.min(1, "La pregunta al menos debe tener un caracter"),
			answer: z.string().nullish(),
			options: z
				.array(
					z.object({
						text: z
							.string()
							.trim()
							.min(1, "Al menos debes escribir un caracter"),
						isCorrect: z.boolean(),
					})
				)
				.nullish(),
			true_false_answer: z.enum(["verdadero", "falso"]).nullish(),
			tags: z.string().array().nullish(),
			hint: z.string().nullish(),
		})
		.refine(
			data =>
				data.type === "open" || data.type === "fill"
					? !!data.answer && data.answer.length > 0
					: true,
			{ message: "La respuesta es obligatoria", path: ["answer"] }
		)
		.refine(
			data =>
				data.type === "multiple"
					? !!data.options && data.options.length > 0
					: true,
			{ message: "Debes agregar al menos una opción", path: ["options"] }
		)
		.refine(
			data =>
				data.type === "multiple" && data.options && data.options.length > 0
					? data.options.some(option => option.isCorrect)
					: true,
			{
				message: "Debes seleccionar al menos una opción como correcta",
				path: ["options"],
			}
		)
		.refine(
			data => (data.type === "truefalse" ? !!data.true_false_answer : true),
			{
				message: "Debes seleccionar verdadero o falso",
				path: ["true_false_answer"],
			}
		);

	const defaultValues = flashcard && {
		...flashcard,
	};

	const {
		register,
		formState: { errors, isSubmitting },
		control,
		watch,
		setValue,
		handleSubmit,
		reset,
	} = useForm({
		resolver: zodResolver(FlashcardFormSchema),
		defaultValues: defaultValues ?? { type: "open" },
		shouldFocusError: true,
		mode: "onTouched",
	});

	const [typeQuestion, setTypeQuestion] = useState(watch("type"));
	const { deck_id } = useParams();
	setValue("deck_id", deck_id!);
	const [type, true_false_answer, tags] = watch([
		"type",
		"true_false_answer",
		"tags",
	]);
	const { fields, append, remove } = useFieldArray({
		control,
		name: "options",
	});

	const handlerSubmit = async (formValues: PartialFlashcard) => {
		if (flashcard) {
			(handler as EditFlashcard)(formValues, flashcard.id);
			setisEditAlertFlashcard(true);
		} else {
			(handler as AddFlashcard)([formValues]);
			setisAddAlertFlashcard(true);
		}
		console.log(formValues);
		setValue("options", []);
		reset();
		navigate(-1);
	};

	const handleSelectChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	): void => {
		const type = event.target.value;
		setTypeQuestion(type as FlashcardType);

		if (type === "open" || type === "fill") {
			setValue("options", []);
			setValue("true_false_answer", null);
		} else if (type === "multiple") {
			setValue("answer", null);
			setValue("true_false_answer", null);
		} else if (type === "truefalse") {
			setValue("answer", null);
			setValue("options", []);
		}
	};

	const handleTagsInputChange = (
		event: React.ChangeEvent<HTMLInputElement>
	): void => {
		const inputValue: string = event.target.value;
		setTagsInput(inputValue);

		const tagArray: string[] = inputValue
			.split(",")
			.map((tag: string) => tag.trim())
			.filter((tag: string) => tag !== "");

		setValue("tags", tagArray);
	};

	return (
		<div className="container-form-flashcard">
			<form
				action=""
				id="form-flashcard"
				onSubmit={handleSubmit(handlerSubmit)}
			>
				<input type="hidden" {...register("deck_id")} />
				<div className="form-group">
					<label htmlFor="type" className="label-form-flashcard">
						Tipo de Pregunta
					</label>
					<select
						id="type"
						{...register("type", { onChange: handleSelectChange })}
					>
						{errors.type && (
							<p className="error-form-flashcard">{errors.type.message}</p>
						)}
						<option value="open">Preguntas y Respuestas Abiertas</option>
						<option value="multiple">Múltiple Opción</option>
						<option value="truefalse">Verdadero o Falso</option>
						<option value="fill">Completar Espacios</option>
					</select>
				</div>

				<div
					className={`form-group ${errors.question ? "question-error" : ""}`}
				>
					<label
						htmlFor="question"
						className={
							errors.question ? "label-error" : " label-form-flashcard"
						}
					>
						Pregunta
					</label>
					<Controller
						name="question"
						control={control}
						render={({ field }) => (
							<Editor
								model={field.value || ""}
								onModelChange={newValue => field.onChange(newValue || "")}
								placeholder={"Escriba su pregunta"}
							/>
						)}
					></Controller>
				</div>

				{(typeQuestion === "open" || typeQuestion === "fill") && (
					<div className={`form-group ${errors.answer ? "answer-error" : ""}`}>
						<label
							htmlFor="answer"
							className={
								errors.answer ? "label-error" : " label-form-flashcard"
							}
						>
							Respuesta
							{typeQuestion === "open"
								? ""
								: " (Escriba las palabras en orden y separadas por coma. Ejemplo: primera, segunda, tercera)"}
						</label>
						<Controller
							name="answer"
							control={control}
							render={({ field }) => (
								<Editor
									model={field.value || ""}
									onModelChange={newValue => field.onChange(newValue || "")}
									placeholder={
										type === "fill"
											? "Escriba las palabras en orden y separadas por coma. Ejemplo: primera, segunda, tercera"
											: "Escriba su respuesta"
									}
								/>
							)}
						></Controller>
					</div>
				)}

				{typeQuestion === "multiple" && (
					<div className="form-group">
						<label htmlFor="opciones" className="label-form-flashcard">
							Opciones
						</label>
						{fields &&
							fields?.map((field, index) => (
								<div key={field.id}>
									<input
										type="checkbox"
										{...register(`options.${index}.isCorrect` as const)}
									/>
									<input
										id="input-option"
										type="text"
										className={
											errors.options &&
											errors.options[index]?.text?.message &&
											"has-error"
										}
										{...register(`options.${index}.text` as const)}
										placeholder={`${
											errors.options && errors.options[index]?.text?.message
												? errors.options[index].text.message
												: "Escribe una opción..."
										} `}
										defaultValue={field.text}
									/>
									<button type="button" onClick={() => remove(index)}>
										Eliminar
									</button>
								</div>
							))}

						<button
							type="button"
							onClick={() => append({ text: "", isCorrect: false })}
						>
							Añadir Opción
						</button>
					</div>
				)}

				{typeQuestion === "truefalse" && (
					<fieldset className={errors.true_false_answer && "fieldset-error"}>
						<legend> Marque cuál es la opción correcta</legend>
						<div>
							<label htmlFor="true">Verdadero</label>
							<input
								type="radio"
								id="true"
								{...register("true_false_answer")}
								checked={true_false_answer === "verdadero"}
								value="verdadero"
								onChange={() => setValue("true_false_answer", "verdadero")}
							/>
						</div>
						<div>
							<label htmlFor="false">Falso</label>
							<input
								type="radio"
								id="false"
								{...register("true_false_answer")}
								checked={true_false_answer === "falso"}
								value="falso"
								onChange={() => setValue("true_false_answer", "falso")}
							/>
						</div>
					</fieldset>
				)}

				<div className="from-group">
					<label htmlFor="tags" className="label-form-flashcard">
						Etiquetas (opcional)
					</label>
					<>
						<input
							type="text"
							id="tags"
							placeholder="Añade etiquetas separadas por coma"
							value={tagsInput}
							onChange={handleTagsInputChange}
						/>
						<div className="current-tags">
							{Array.isArray(tags) &&
								tags.length > 0 &&
								tags.map((tag, index) => (
									<span key={index} className="tag">
										{tag}
										<button
											className="button-tags"
											type="button"
											onClick={() => {
												const filteredTags = tags.filter(t => t !== tag);
												setValue("tags", filteredTags);
												setTagsInput(filteredTags.join(", "));
											}}
										>
											<IoCloseOutline />
										</button>
									</span>
								))}
						</div>
					</>
				</div>

				<div className="from-group">
					<label htmlFor="hint" className="label-form-flashcard">
						Pista (opcional)
					</label>
					<input
						type="text"
						id="hint"
						placeholder="Añade una pista"
						{...register("hint")}
					/>
				</div>

				<button type="submit" form="form-flashcard">
					{isSubmitting
						? "Enviando..."
						: flashcard
						? "Editar Pregunta"
						: "Crear Pregunta"}
				</button>
				{type === "open" && errors.question && (
					<p className="error-form-flashcard">{errors.question.message}</p>
				)}
				{type === "open" && errors.answer && (
					<p className="error-form-flashcard fill">{errors.answer.message}</p>
				)}
				{type === "multiple" && errors.options && (
					<p className="error-form-flashcard">
						{errors.options?.message || errors.options?.root?.message}
					</p>
				)}
				{type === "truefalse" && errors.true_false_answer && (
					<p className="error-form-flashcard">
						{errors.true_false_answer.message}
					</p>
				)}
				{type === "fill" && errors.answer && (
					<p className="error-form-flashcard">{errors.answer.message}</p>
				)}
			</form>
		</div>
	);
}
