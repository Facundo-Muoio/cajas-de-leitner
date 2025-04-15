export type FlashcardType = "open" | "multiple" | "truefalse" | "fill";

export interface Option {
	text: string;
	isCorrect: boolean;
}

export interface PartialFlashcard {
	deck_id: string;
	type: FlashcardType;
	question: string;
	answer?: string | null;
	options?: Option[] | null;
	true_false_answer?: "verdadero" | "falso" | null;
	tags?: string[] | null;
	hint?: string | null;
}
