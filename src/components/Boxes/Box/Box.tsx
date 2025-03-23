import "./Box.css";
import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import Modal from "@/components/Modal/Modal";
import Form, { Field } from "@/components/Form/Form";
import { z } from "zod";
import { FieldValues } from "react-hook-form";
import { IoWarningOutline } from "react-icons/io5";
import { deleteRow, doesDeckExist, updateRow } from "@/Helpers/Helpers";
import useSWRMutation from "swr/mutation";
import { Deck } from "../Boxes";

export default function Box({
	id,
	nameOfDeck,
	numberOfCards,
	description,
	setEditAlertVisible,
	setDeleteAlertVisible,
	decks,
}: {
	id: string;
	nameOfDeck: string;
	numberOfCards: number;
	description?: string;
	setEditAlertVisible: (value: React.SetStateAction<boolean>) => void;
	setDeleteAlertVisible: (value: React.SetStateAction<boolean>) => void;
	decks: Deck[];
}) {
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const { trigger: deleteTrigger } = useSWRMutation(
		"decks",
		(_, { arg }: { arg: { table: string; id: string } }) =>
			deleteRow(arg.table, arg.id)
	);

	const { trigger: updateTrigger } = useSWRMutation(
		"decks",
		(_, { arg }: { arg: { table: string; id: string; fields: FieldValues } }) =>
			updateRow(arg.table, arg.fields, arg.id)
	);

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

	const onEditSubmit = async (fields: FieldValues) => {
		await updateTrigger(
			{ table: "decks", fields, id },
			{
				optimisticData: decks.map(deck =>
					deck.id === id ? { ...deck, ...fields } : deck
				),
				populateCache: (updatedDeck, currentDecks) =>
					currentDecks
						? currentDecks.map(deck =>
								deck.id === updatedDeck[0].id ? { ...updatedDeck[0] } : deck
						  )
						: [...updatedDeck],
				rollbackOnError: true,
				revalidate: false,
				onError: error => console.error("Error updating deck: ", error),
			}
		);
	};

	const onDeleteSubmit = async () => {
		await deleteTrigger(
			{ table: "decks", id },
			{
				optimisticData: decks?.filter(deck => deck.id !== id),
				populateCache: (deletedDeck, currentDecks) =>
					currentDecks
						? currentDecks?.filter(deck => deck.id !== deletedDeck[0].id)
						: [],
				rollbackOnError: true,
				revalidate: false,
				onError: error => {
					console.error("Error deleting deck: ", error);
				},
			}
		);
	};

	return (
		<>
			<div className="box" id={id}>
				<div className="box-header">
					<h2>{nameOfDeck}</h2>
					<div className="box-buttons">
						<button onClick={() => setIsEditModalOpen(true)}>
							<FaEdit className="box-icon-button" />
						</button>
						<button onClick={() => setIsDeleteModalOpen(true)}>
							<FaTrash className="box-icon-button" />
						</button>
					</div>
				</div>
				<div className="box-content">
					<p>{description && description}</p>
				</div>
				<div className="box-footer">
					<span>{numberOfCards} tarjetas</span>
					<button>Repasar</button>
				</div>
			</div>
			<Modal isOpen={isEditModalOpen} setIsModalOpen={setIsEditModalOpen}>
				<h2 className="edit-header">Editar Datos del Mazo</h2>
				<Form
					schema={editSchema(id)}
					labelButton="Editar Mazo"
					fields={editFields}
					onSubmit={onEditSubmit}
					defaultValuesProp={{ name: nameOfDeck, description }}
					isModalOpen={isEditModalOpen}
					setIsModalOpen={setIsEditModalOpen}
					setAlertVisible={setEditAlertVisible}
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
					onSubmit={onDeleteSubmit}
					isModalOpen={isDeleteModalOpen}
					setIsModalOpen={setIsDeleteModalOpen}
					setAlertVisible={setDeleteAlertVisible}
				/>
			</Modal>
		</>
	);
}
