import { createContext, useReducer } from "react";

import { DeckInterface } from "@/components/Decks/Decks";

type DecksProviderProps = {
	children: React.ReactNode;
};

type State = DeckInterface[] | [];
type Action =
	| { type: "SET_ITEMS"; payload: DeckInterface[] }
	| { type: "ADD_DECK"; payload: DeckInterface }
	| { type: "UPDATE_DECK"; payload: DeckInterface }
	| { type: "DELETE_DECK"; payload: string };

type DecksContextType = {
	state: State;
	dispatch: React.Dispatch<Action>;
};

const initialState: State = [];

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "SET_ITEMS":
			return action.payload;

		case "ADD_DECK":
			return [...state, action.payload];

		case "UPDATE_DECK":
			return state.map(deck =>
				deck.id === action.payload.id ? action.payload : deck
			);
		case "DELETE_DECK":
			return state.filter(deck => deck.id !== action.payload);
	}
}

const DecksContext = createContext<DecksContextType>({
	state: initialState,
	dispatch: () => {},
});

export default function DecksProvider({ children }: DecksProviderProps) {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<DecksContext.Provider value={{ state, dispatch }}>
			{children}
		</DecksContext.Provider>
	);
}

export { DecksContext };
