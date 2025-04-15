import "./Deck.css";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import Modal from "@/components/Modal/Modal";
import Form, { Field } from "@/components/Form/Form";
import { z } from "zod";
import { FieldValues } from "react-hook-form";
import { IoWarningOutline } from "react-icons/io5";
import { doesDeckExist } from "@/Helpers/Helpers";
import { DeckInterface } from "../Decks";
import useDecks from "@/Hooks/useDecks";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Deck({
	id,
	nameOfDeck,
	numberOfCards,
	description,
	decks,
	setIsEditAlertOpen,
	setIsDeleteAlertOpen,
}: {
	id: string;
	nameOfDeck: string;
	numberOfCards: number;
	description?: string;
	decks: DeckInterface[];
	setIsEditAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsDeleteAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const navigate = useNavigate();
	const handleNavigate = () => navigate(`/deck/${id}/flashcards`);

	const { updateDeck, deleteDeck } = useDecks();

	const editSchema = (deck_id: string) =>
		z.object({
			name: z
				.string()
				.trim()
				.min(3, "El nombre debe tener al menos 3 caracteres")
				.max(50, "El nombre no puede tener más de 50 caracteres")
				.refine(
					async name => {
						const exists = doesDeckExist("name", decks, name, deck_id);
						return !exists;
					},
					{ message: "Este nombre ya está en uso" }
				),
			description: z.string().trim(),
		});

	const deleteSchema = z.object({
		name: z
			.string()
			.trim()
			.min(3, "El nombre debe tener al menos 3 caracteres")
			.max(50, "El nombre no puede tener más de 50 caracteres")
			.refine(
				async name => {
					return name === nameOfDeck ? true : false;
				},
				{ message: `Texto no válido, se esperaba: ${nameOfDeck}` }
			),
	});

	const editFields: Field[] = [
		{
			name: "name",
			label: "Nombre",
			type: "text",
		},
		{ name: "description", label: "Descripción", type: "textarea" },
	];

	const deleteField: Field[] = [
		{
			name: "name",
			label: `Escriba "${nameOfDeck}" para confirmar.`,
			type: "text",
		},
	];

	const handlerEdit = async (fields: FieldValues) => {
		updateDeck({ ...(fields as DeckInterface), id });
	};

	const handlerDelete = async () => {
		deleteDeck(id);
	};

	return (
		<>
			<div className="deck" id={id}>
				<div className="deck-header">
					<h2>{nameOfDeck}</h2>
					<div className="deck-buttons">
						<button onClick={() => setIsEditModalOpen(true)}>
							<FaEdit className="deck-icon-button" />
						</button>
						<button onClick={() => setIsDeleteModalOpen(true)}>
							<FaTrash className="deck-icon-button" />
						</button>
					</div>
				</div>
				<div className="deck-content">
					<p>{description && description}</p>
				</div>
				<div className="deck-footer">
					<span>{numberOfCards} tarjetas</span>
					<button onClick={handleNavigate}>Abrir mazo</button>
				</div>
			</div>
			<Modal isOpen={isEditModalOpen} setIsModalOpen={setIsEditModalOpen}>
				<h2 className="edit-header">Editar Datos del Mazo</h2>
				<Form
					schema={editSchema(id)}
					labelButton="Editar Mazo"
					fields={editFields}
					onSubmit={handlerEdit}
					defaultValuesProp={{ name: nameOfDeck, description }}
					isModalOpen={isEditModalOpen}
					setIsModalOpen={setIsEditModalOpen}
					setAlertVisible={setIsEditAlertOpen}
				/>
			</Modal>
			<Modal isOpen={isDeleteModalOpen} setIsModalOpen={setIsDeleteModalOpen}>
				<IoWarningOutline className="delete-icon" />
				<h2 className="delete-header">Esta acción no podra deshacerse</h2>
				<p className="delete-paragraphs">
					Esto eliminara permanentemente el mazo {nameOfDeck} y todos sus datos.{" "}
				</p>

				<Form
					schema={deleteSchema}
					fields={deleteField}
					labelButton="Entiendo, borra este mazo"
					onSubmit={handlerDelete}
					isModalOpen={isDeleteModalOpen}
					setIsModalOpen={setIsDeleteModalOpen}
					setAlertVisible={setIsDeleteAlertOpen}
				/>
			</Modal>
		</>
	);
}
