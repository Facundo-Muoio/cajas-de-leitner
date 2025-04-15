import useFlashcards from "@/Hooks/useFlashcards";
import FlashcardForm from "../FlashcardForm";
import { PartialFlashcard } from "../TypesFlashcardForm";
import { useParams } from "react-router";

export type AddFlashcard = (fieldValues: PartialFlashcard[]) => void;

export default function AddFlashcardform() {
	const { deck_id } = useParams();
	const { addFlashcard }: { addFlashcard: AddFlashcard } =
		useFlashcards(deck_id);
	return <FlashcardForm handler={addFlashcard} />;
}
