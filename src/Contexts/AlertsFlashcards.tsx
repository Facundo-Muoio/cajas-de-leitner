import { createContext } from "react";
import { useState } from "react";

interface AlertsFlashcardsProviderProps {
	children: React.ReactNode;
}

export interface TypeAlertsFlashcardsContexts {
	isAddAlertFlashcard: boolean;
	setisAddAlertFlashcard: React.Dispatch<React.SetStateAction<boolean>>;
	isEditAlertFlashcard: boolean;
	setisEditAlertFlashcard: React.Dispatch<React.SetStateAction<boolean>>;
}

const AlertsFlashcardsContext = createContext<
	TypeAlertsFlashcardsContexts | object
>({});

export default function AlertsFlashcardsProvider({
	children,
}: AlertsFlashcardsProviderProps) {
	const [isAddAlertFlashcard, setisAddAlertFlashcard] = useState(false);
	const [isEditAlertFlashcard, setisEditAlertFlashcard] = useState(false);

	return (
		<AlertsFlashcardsContext.Provider
			value={{
				isAddAlertFlashcard,
				setisAddAlertFlashcard,
				isEditAlertFlashcard,
				setisEditAlertFlashcard,
			}}
		>
			{children}
		</AlertsFlashcardsContext.Provider>
	);
}

export { AlertsFlashcardsContext };
