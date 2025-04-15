import "./Flashcards.css";
import Navbar from "../Navbar/Navbar";
import InputSearch from "../InputSearch/InputSearch";
import EmptyState from "../EmptyState/EmptyState";
import { TbCards } from "react-icons/tb";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import useFlashcards from "@/Hooks/useFlashcards";
import Flashcard from "./Flashcard.tsx/Flashcard";
import Toast from "../Toast/Toast";
import { useState, useContext } from "react";
import {
	AlertsFlashcardsContext,
	TypeAlertsFlashcardsContexts,
} from "@/Contexts/AlertsFlashcards";
import { Flashcard as TypeFlashcard } from "@/Contexts/FlashcardsContext";
import SkeletonFlashcards from "../SkeletonFlashcards/SkeletonFlashcards";

export default function Flashcards() {
	const navigate = useNavigate();
	const { deck_id } = useParams();
	const { flashcards, isLoading } = useFlashcards(deck_id!);
	const [isDeleteFlashcard, setIsDeleteFlashcard] = useState(false);
	const [flashcardsFiltered, setFlashcardsFiltered] = useState<
		TypeFlashcard[] | []
	>([]);
	const {
		isAddAlertFlashcard,
		setisAddAlertFlashcard,
		isEditAlertFlashcard,
		setisEditAlertFlashcard,
	} = useContext(AlertsFlashcardsContext) as TypeAlertsFlashcardsContexts;

	const handlerFilter = (textInput: string) => {
		const text = textInput.toLowerCase();
		const number = Number(textInput) ? Number(textInput) : null;

		const filteredFlashcards = flashcards.filter((flashcard, index) => {
			return (
				flashcard.question.toLowerCase().includes(text) ||
				flashcard.tags?.some(tag => tag.toLowerCase().includes(text)) ||
				(number ? index === number! - 1 : false)
			);
		});

		setFlashcardsFiltered(filteredFlashcards);
	};

	return (
		<>
			<div className="wrapper-flashcards">
				<Navbar />
				<div className="header-flashcards">
					<h2>Flashcards</h2>
					<InputSearch
						placeholder="Buscar por preguntas, etiquetas o número"
						onSubmit={handlerFilter}
						setFilterFlashcard={setFlashcardsFiltered}
					/>
					<button
						className="button-header-flashcards"
						onClick={() => navigate(`/deck/${deck_id}/flashcards/add`)}
					>
						Añadir Flashcard
					</button>
				</div>
				<div className="flashcards">
					{isLoading ? (
						<>
							<SkeletonFlashcards />
							<SkeletonFlashcards />
							<SkeletonFlashcards />
							<SkeletonFlashcards />
						</>
					) : flashcardsFiltered && flashcardsFiltered.length > 0 ? (
						flashcardsFiltered.map((flashcard, index) => (
							<Flashcard
								key={flashcard.id}
								index={index}
								flashcard={flashcard}
								setIsDeleteFlashcard={setIsDeleteFlashcard}
							/>
						))
					) : flashcards && flashcards.length > 0 ? (
						flashcards.map((flashcard, index) => (
							<Flashcard
								key={flashcard.id}
								index={index}
								flashcard={flashcard}
								setIsDeleteFlashcard={setIsDeleteFlashcard}
							/>
						))
					) : (
						<EmptyState
							title="Este mazo todavía no tiene flashcards"
							description="Crea tus flashcards para comenzar tus sesiones de repaso!"
							icon={<TbCards className="empty-state-icon" />}
						/>
					)}
				</div>
			</div>
			<Toast
				message="Flashcard añadida correctamente, ya puedes encontrarla en tus revisiones. 📚🔥"
				duration={5000}
				type="success"
				onClose={() => setisAddAlertFlashcard(false)}
				isVisible={isAddAlertFlashcard}
			/>
			<Toast
				message="Flashcard actualizada con éxito. 🎉"
				duration={5000}
				type="success"
				onClose={() => setisEditAlertFlashcard(false)}
				isVisible={isEditAlertFlashcard}
			/>
			<Toast
				isVisible={isDeleteFlashcard}
				message="🗑️ Has eliminado la flashcard con éxito."
				onClose={() => setIsDeleteFlashcard(false)}
				duration={5000}
				type="success"
			/>
		</>
	);
}
