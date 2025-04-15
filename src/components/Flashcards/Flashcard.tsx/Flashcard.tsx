import "./Flashcard.css";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import parse from "html-react-parser";
import { IoWarningOutline } from "react-icons/io5";
import { PartialFlashcard } from "@/components/FlashcardForm/TypesFlashcardForm";
import { MdVisibility } from "react-icons/md";
import { MdVisibilityOff } from "react-icons/md";
import { useNavigate } from "react-router";
import Modal from "@/components/Modal/Modal";
import Form from "@/components/Form/Form";
import { z } from "zod";
import { useState } from "react";
import { Field } from "@/components/Form/Form";
import useFlashcards from "@/Hooks/useFlashcards";

interface CompleteFlashcard extends PartialFlashcard {
	id: string;
}

interface PropFlashcard {
	index: number;
	flashcard: CompleteFlashcard;
	setIsDeleteFlashcard: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Flashcard({
	index,
	flashcard,
	setIsDeleteFlashcard,
}: PropFlashcard) {
	const { id, question, answer, options, deck_id, true_false_answer, tags } =
		flashcard;
	const navigation = useNavigate();
	const { deleteFlashcard } = useFlashcards(deck_id!);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isAnswerVisible, setIsAnswerVisible] = useState(false);

	const deleteField: Field = {
		name: "input",
		label: "Escribe 'Comprendo' para confirmar",
		type: "text",
	};

	const deleteSchema = z.object({
		input: z.string().refine(text => text === "Comprendo", {
			message: "Texto inválido, debes escribir 'Comprendo' .",
		}),
	});

	const handleVisibility = () => {
		setIsAnswerVisible(!isAnswerVisible);
	};

	const handleEdit = () => navigation(`/deck/${deck_id}/flashcard/${id}/edit`);

	const handlerDelete = async () => {
		deleteFlashcard(id);
	};

	return (
		<>
			<div className="flashcard">
				<div className="header-flascard">
					<span className="index-flashcard">{index + 1}</span>
					<h3 className="flashcard-title">Pregunta</h3>
					<div
						className={`tags-flashcard ${isAnswerVisible && "hidden-tags"} `}
					>
						{tags?.map(tag => (
							<span className="tag" key={crypto.randomUUID()}>
								{tag}
							</span>
						))}
					</div>
					<div className="controls-flashcard">
						<button className="btn-show-answer" onClick={handleVisibility}>
							{isAnswerVisible ? <MdVisibility /> : <MdVisibilityOff />}
						</button>
						<button className="edit-flashcard" onClick={handleEdit}>
							<FaEdit />
						</button>
						<button
							className="delete-flashcard"
							onClick={() => setIsDeleteModalOpen(true)}
						>
							<FaTrash />
						</button>
					</div>
				</div>
				<div className="question-flashcard">
					<div className="pregunta">{parse(question)}</div>
				</div>

				<div className={`answer-flashcard ${isAnswerVisible && "show-answer"}`}>
					<h3 className="flashcard-title">Respuesta</h3>
					{answer && <div className="respuesta">{parse(answer)}</div>}
					{true_false_answer && (
						<div className="respuesta">{true_false_answer}</div>
					)}
					{options && (
						<div className="respuesta">
							{options.map(option => (
								<div className="option" key={crypto.randomUUID()}>
									{option.text}
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			<Modal isOpen={isDeleteModalOpen} setIsModalOpen={setIsDeleteModalOpen}>
				<IoWarningOutline className="delete-icon" />
				<h2 className="delete-header">Esta acción no podra deshacerse</h2>
				<p className="delete-paragraphs">
					Esto eliminara permanentemente la flascard y todos sus datos.
				</p>
				<Form
					schema={deleteSchema}
					fields={[deleteField]}
					labelButton="Entiendo, borra esta Flashcard"
					onSubmit={handlerDelete}
					isModalOpen={isDeleteModalOpen}
					setIsModalOpen={setIsDeleteModalOpen}
					setAlertVisible={setIsDeleteFlashcard}
				/>
			</Modal>
		</>
	);
}
