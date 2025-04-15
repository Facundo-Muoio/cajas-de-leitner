import useSWR from "swr";
import { getFlashcardsPendigs } from "@/Helpers/Helpers";

export default function useFlashcardsPendings(
	deck_id: string,
	box_level: number
) {
	const { data: flashcards, isLoading } = useSWR(
		`flashcards-pendings-${deck_id}-${box_level}`,
		() => getFlashcardsPendigs(deck_id!, box_level!)
	);

	return { flashcards, isLoading };
}
