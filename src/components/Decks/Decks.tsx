import "./Decks.css";
import { useState, useContext, useRef } from "react";
import Modal from "../Modal/Modal";
import { z } from "zod";
import Form, { Field } from "../Form/Form";
import { FieldValues } from "react-hook-form";
import { doesDeckExist } from "@/Helpers/Helpers";
import Deck from "./Deck/Deck";
import { UserContext } from "@/Contexts/UserContext";
import Toast from "../Toast/Toast";
import useAuth from "../Auth/Auth";
import SkeletonCard from "../SkeletonCard/SkeletonCard";
import Navbar from "../Navbar/Navbar";
import InputSearch from "../InputSearch/InputSearch";
import { UseFormSetError } from "react-hook-form";
import EmptyState from "../EmptyState/EmptyState";
import { BsFillInboxesFill } from "react-icons/bs";
import useDecks from "@/Hooks/useDecks";

export interface DeckInterface {
	id: string;
	name: string;
	description?: string;
	user_id: string;
	created_at?: string;
}

export default function Decks() {
	const { session } = useAuth();
	const userContext = useContext(UserContext);
	const {
		decks,
		addDeck,
		isLoading,
		isAddModalOpen,
		setIsAddModalOpen,
		isAlertVisible,
		setIsAlertVisible,
	} = useDecks();

	const [isEditAlertOpen, setIsEditAlertOpen] = useState(false);
	const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
	const [deckNameSearched, setDeckNameSearched] = useState<string | undefined>(
		undefined
	);

	const boxContentRef = useRef<HTMLDivElement>(null);

	const schema = z.object({
		name: z
			.string()
			.trim()
			.min(3, "El nombre debe tener al menos 3 caracteres")
			.max(50, "El nombre no puede tener más de 50 caracteres")
			.refine(
				async name => {
					const exists = doesDeckExist("name", decks, name);
					return !exists;
				},
				{ message: "Ya existe un mazo con este nombre" }
			),
		description: z.string().trim(),
	});
	const fields: Field[] = [
		{ name: "name", label: "Nombre", type: "text" },
		{ name: "description", label: "Descripción", type: "textarea" },
	];

	const onClick = () => {
		setIsAddModalOpen(true);
	};

	const handleAddDeck = async ({ name, description }: FieldValues) => {
		await addDeck({
			id: crypto.randomUUID(),
			name: name,
			description: description,
			user_id: userContext!.user!.id,
		});
	};

	const onSearch = async (
		searchedName: string,
		setError: UseFormSetError<{
			search: string;
		}>
	) => {
		if (
			!decks.some(
				deck => deck.name.toLowerCase() === searchedName.toLowerCase()
			)
		) {
			setError("root", {
				type: "server",
				message: "Este mazo no existe.",
			});
			return;
		}
		setDeckNameSearched(
			decks.find(deck => deck.name.toLowerCase() === searchedName.toLowerCase())
				?.name
		);
	};

	if (!session) {
		return;
	}

	return (
		<div className="wraper-decks">
			<div className="container-navbar">
				<Navbar />
			</div>
			<div className="decks">
				<div className="decks-header">
					<h2>Cajas de Leitner</h2>
					<InputSearch
						placeholder="¿Qué mazo buscas?"
						onSubmit={onSearch}
						setFilterDeck={setDeckNameSearched}
					/>
					<button onClick={onClick}>Añadir Mazo</button>
				</div>
				<div className="decks-content" ref={boxContentRef}>
					{isLoading ? (
						<>
							<SkeletonCard />
							<SkeletonCard />
							<SkeletonCard />
							<SkeletonCard />
							<SkeletonCard />
							<SkeletonCard />
						</>
					) : deckNameSearched ? (
						decks
							.filter(
								deck =>
									deck.name.toLowerCase() === deckNameSearched.toLowerCase()
							)
							.map(deck => (
								<Deck
									id={deck.id ?? deck.user_id}
									key={deck.id}
									nameOfDeck={deck.name}
									description={deck.description && deck.description}
									numberOfCards={10}
									decks={decks as DeckInterface[]}
									setIsEditAlertOpen={setIsEditAlertOpen}
									setIsDeleteAlertOpen={setIsDeleteAlertOpen}
								/>
							))
					) : decks.length > 0 ? (
						decks.map(deck => (
							<Deck
								id={deck.id ?? deck.user_id}
								key={deck.id}
								nameOfDeck={deck.name}
								description={deck.description && deck.description}
								numberOfCards={10}
								decks={decks!}
								setIsEditAlertOpen={setIsEditAlertOpen}
								setIsDeleteAlertOpen={setIsDeleteAlertOpen}
							/>
						))
					) : (
						<EmptyState
							title="No tienes mazos aún"
							description="  Comienza creando tu primer mazo para empezar a estudiar"
							icon={<BsFillInboxesFill className="empty-state-icon" />}
						/>
					)}
				</div>
			</div>

			<Modal isOpen={isAddModalOpen} setIsModalOpen={setIsAddModalOpen}>
				<h2 className="add-header">Crear Nuevo Mazo</h2>
				<Form
					fields={fields}
					schema={schema}
					labelButton="Añadir Mazo"
					onSubmit={handleAddDeck}
					isModalOpen={isAddModalOpen}
				/>
			</Modal>

			<Toast
				message="Deck añadido correctamente,
							agregarle tarjetas y comenzar a estudiar. 📚🔥"
				duration={5000}
				type="success"
				onClose={() => setIsAlertVisible(false)}
				isVisible={isAlertVisible}
			/>
			<Toast
				message="Deck actualizado con éxito. 🎉"
				duration={5000}
				type="success"
				onClose={() => setIsEditAlertOpen(false)}
				isVisible={isEditAlertOpen}
			/>
			<Toast
				message="🗑️ Has eliminado el deck con éxito."
				duration={5000}
				type="success"
				onClose={() => setIsDeleteAlertOpen(false)}
				isVisible={isDeleteAlertOpen}
			/>
		</div>
	);
}
