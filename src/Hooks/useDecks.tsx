import { DecksContext } from "@/Contexts/DecksContext";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import {
	insertRow,
	updateRow,
	deleteRow,
	getAllRows,
} from "../Helpers/Helpers";
import { DeckInterface } from "@/components/Decks/Decks";
import { useState, useContext } from "react";

export default function useDecks() {
	const { state, dispatch } = useContext(DecksContext);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isAlertVisible, setIsAlertVisible] = useState(false);

	const {
		data: decks,
		error,
		isLoading,
	} = useSWR("decks", key => getAllRows(key), {
		revalidateOnFocus: true,
		revalidateOnReconnect: true,
		refreshInterval: 0,
		onSuccess: decks => {
			dispatch({ type: "SET_ITEMS", payload: [...decks] });
		},
	});

	const { trigger: triggerAddDeck } = useSWRMutation(
		"decks",
		(key, { arg }: { arg: DeckInterface }) => insertRow(key, [arg])
	);

	const { trigger: updateTrigger } = useSWRMutation(
		"decks",
		(key, { arg }: { arg: DeckInterface }) => updateRow(key, arg, arg.id)
	);

	const { trigger: deleteTrigger } = useSWRMutation(
		"decks",
		(key, { arg }: { arg: string }) => deleteRow(key, arg)
	);

	async function addDeck(newDeck: DeckInterface) {
		triggerAddDeck(newDeck, {
			optimisticData: () => {
				return [...state, newDeck];
			},
			populateCache: newDeck => {
				return [...state, ...newDeck];
			},
			rollbackOnError: true,
			revalidate: false,
			onSuccess: newItem => {
				dispatch({
					type: "ADD_DECK",
					payload: newItem[0],
				});
				setIsAddModalOpen(false);
				setIsAlertVisible(true);
			},
		});
	}

	async function updateDeck(updatedDeck: DeckInterface) {
		updateTrigger(updatedDeck, {
			optimisticData: () => {
				return decks!.map(deck =>
					deck.id === updatedDeck.id ? updatedDeck : deck
				);
			},
			populateCache: (updatedDeck, currentDecks) => {
				return (currentDecks ?? []).map(deck =>
					deck.id === updatedDeck[0].id ? updatedDeck[0] : deck
				);
			},
			rollbackOnError: true,
			revalidate: false,
			onSuccess: updatedDeck => {
				dispatch({
					type: "UPDATE_DECK",
					payload: updatedDeck[0],
				});
			},
			onError: error => console.error("Error updating deck: ", error),
		});
	}

	async function deleteDeck(id: string) {
		deleteTrigger(id, {
			optimisticData: () => decks!.filter(deck => deck.id !== id),
			populateCache: (deletedDeck, currentDecks) =>
				(currentDecks ?? []).filter(deck => deck.id !== deletedDeck[0].id),
			rollbackOnError: true,
			revalidate: false,
			onSuccess: deletedDeck => {
				dispatch({ type: "DELETE_DECK", payload: deletedDeck[0].id });
			},
			onError: error => console.error("Error deleting deck: ", error),
		});
	}

	// useEffect(() => {
	// 	getUserID().then(userID => {
	// 		if (userID) {
	// 			getPages("decks", userID).then(pages => {
	// 				if (pages !== null) {
	// 					setPages(pages);
	// 				}
	// 			});
	// 		}
	// 	});
	// }, []);

	// const loadMore = (boxContentRef: React.RefObject<HTMLDivElement | null>) => {
	// 	if (boxContentRef.current) {
	// 		const bottom =
	// 			boxContentRef.current.scrollHeight ===
	// 			boxContentRef.current.scrollTop + boxContentRef.current.clientHeight;
	// 		const totalPages = Math.ceil(pages / decksPerPage) - 1;
	// 		if (bottom && !isLoading && !isValidating && totalPages > pageIndex) {
	// 			setPageIndex(prevIndex => prevIndex + 1);
	// 			mutateDecks();
	// 		}
	// 	}
	// };

	return {
		decks: state ?? [],
		error,
		isLoading,
		addDeck,
		updateDeck,
		deleteDeck,
		isAddModalOpen,
		setIsAddModalOpen,
		isAlertVisible,
		setIsAlertVisible,
	};
}
