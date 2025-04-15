import { deleteRow, getAllRows, insertRow, updateRow } from "@/Helpers/Helpers";
import { useContext } from "react";
import { FlashcardsContext, Flashcard } from "@/Contexts/FlashcardsContext";

import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { PartialFlashcard } from "@/components/FlashcardForm/TypesFlashcardForm";

export default function useFlashcards(deck_id?: string) {
	const { flashcards, dispatch } = useContext(FlashcardsContext);
	const {
		error,
		isLoading,
		mutate: mutateFlashcards,
	} = useSWR(
		["flashcards", deck_id],
		([key, deck_id]) => getAllRows(key, deck_id),
		{
			revalidateOnFocus: true,
			refreshInterval: 0,
			revalidateOnReconnect: true,
			onSuccess: (allFlashcards: Flashcard[]) =>
				dispatch({ type: "SET_FLASHCARDS", payload: allFlashcards }),
		}
	);

	const { trigger: triggerAddFlashcard } = useSWRMutation(
		"flashcards",
		(key, { arg }: { arg: PartialFlashcard[] }) => insertRow(key, arg)
	);

	const { trigger: triggerUpdateFlashcard } = useSWRMutation(
		"flashcards",
		(key, { arg }: { arg: { fields: PartialFlashcard; id: string } }) =>
			updateRow(key, arg.fields, arg.id)
	);

	const { trigger: triggerDeleteFlashcard } = useSWRMutation(
		"flashcards",
		(key, { arg }: { arg: string }) => deleteRow(key, arg)
	);

	const addFlashcard = (fieldValues: PartialFlashcard[]) => {
		triggerAddFlashcard(fieldValues, {
			optimisticData: () => [
				...(flashcards || []),
				{ ...fieldValues[0] } as Flashcard,
			],
			populateCache: (
				[newFlashcard]: Flashcard[],
				currentFlashcards?: Flashcard[]
			) => [...(currentFlashcards || []), newFlashcard],
			rollbackOnError: true,
			revalidate: false,
			onSuccess: ([newFlashcard]: Flashcard[]) =>
				dispatch({
					type: "ADD_FLASHCARD",
					payload: newFlashcard,
				}),
		});
	};

	const updateFlashcard = (fields: PartialFlashcard, id: string) => {
		triggerUpdateFlashcard(
			{ fields, id },
			{
				optimisticData: () =>
					flashcards.map(flashcard =>
						flashcard.id === id ? { ...fields, id } : flashcard
					),
				populateCache: ([updatedFlashcard]: Flashcard[], currentFlashcards) => {
					if (!currentFlashcards) return [updatedFlashcard];
					return currentFlashcards.map(flashcard =>
						flashcard.id === updatedFlashcard.id ? updatedFlashcard : flashcard
					);
				},
				rollbackOnError: true,
				revalidate: false,
				onSuccess: ([updatedFlashcard]: Flashcard[]) => {
					dispatch({
						type: "UPDATE_FLASHCARD",
						payload: updatedFlashcard,
					});
				},
			}
		);
	};

	const deleteFlashcard = (id: string) => {
		triggerDeleteFlashcard(id, {
			optimisticData: flashcards.filter(flashcard => flashcard.id !== id),
			populateCache: ([deletedFlashcard]: Flashcard[], currentFlashcards) =>
				(currentFlashcards || []).filter(
					flashcard => flashcard.id !== deletedFlashcard.id
				),
			rollbackOnError: true,
			revalidate: false,
			onSuccess: ([deletedFlashcard]) => {
				dispatch({ type: "DELETE_FLASHCARD", payload: deletedFlashcard });
			},
		});
	};

	return {
		error,
		isLoading,
		mutateFlashcards,
		addFlashcard,
		updateFlashcard,
		deleteFlashcard,
		flashcards,
	};
}
