import { useReducer, createContext } from "react";
import { PartialFlashcard } from "@/components/FlashcardForm/TypesFlashcardForm";

interface FlashcardsProrps {
	children: React.ReactNode;
}

export interface Flashcard extends PartialFlashcard {
	id: string;
}

type State = [] | Flashcard[];

type ActionType =
	| "SET_FLASHCARDS"
	| "ADD_FLASHCARD"
	| "UPDATE_FLASHCARD"
	| "DELETE_FLASHCARD";

type Action = { type: ActionType; payload: Flashcard[] | Flashcard };

type TypeFlashcardsContext = {
	flashcards: State;
	dispatch: React.Dispatch<Action>;
};
const FlashcardsContext = createContext<TypeFlashcardsContext>({
	flashcards: [],
	dispatch: () => {},
});

function reducer(flashcards: State, action: Action) {
	switch (action.type) {
		case "SET_FLASHCARDS":
			return action.payload as Flashcard[];

		case "ADD_FLASHCARD":
			return [...flashcards, action.payload as Flashcard];

		case "UPDATE_FLASHCARD":
			return flashcards.map(flashcard =>
				flashcard.id === (action.payload as Flashcard).id
					? (action.payload as Flashcard)
					: flashcard
			);

		case "DELETE_FLASHCARD":
			return flashcards.filter(
				flashcard => flashcard.id !== (action.payload as Flashcard).id
			);
		default:
			return flashcards;
	}
}

export default function FlashcardsProvider({ children }: FlashcardsProrps) {
	const [flashcards, dispatch] = useReducer(reducer, []);

	return (
		<FlashcardsContext.Provider value={{ flashcards, dispatch }}>
			{children}
		</FlashcardsContext.Provider>
	);
}

export { FlashcardsContext };
