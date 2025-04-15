import { useParams } from "react-router";
import FlashcardForm from "../FlashcardForm";
import useFlashcards from "@/Hooks/useFlashcards";
import { PartialFlashcard } from "../TypesFlashcardForm";

export type EditFlashcard = (fields: PartialFlashcard, id: string) => void;

export default function EditFlashcardForm() {
	const { deck_id, id } = useParams();
	const { flashcards, updateFlashcard } = useFlashcards(deck_id);
	const flashcard = flashcards.find(flashcard => flashcard.id === id);

	const handle = updateFlashcard;

	return <FlashcardForm handler={handle} flashcard={flashcard} />;
}
