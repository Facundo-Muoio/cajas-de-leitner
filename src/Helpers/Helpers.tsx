import { FieldValues } from "react-hook-form";
import { supabase } from "../supabase/client";
import { DeckInterface } from "@/components/Decks/Decks";
import { Decks } from "@/components/PanelRevisions/PanelReviews";

export type Day =
	| "Domingo"
	| "Lunes"
	| "Martes"
	| "Miércoles"
	| "Jueves"
	| "Viernes"
	| "Sábado";

export type Month =
	| "Enero"
	| "Febrero"
	| "Marzo"
	| "Abril"
	| "Mayo"
	| "Junio"
	| "Julio"
	| "Agosto"
	| "Septiembre"
	| "Octubre"
	| "Noviembre"
	| "Diciembre";

type WeeksDays = readonly Day[];

export type AuthProvider = "google" | "facebook" | "github";

export function getDayName(date: Date): Day {
	const weekdays: WeeksDays = [
		"Domingo",
		"Lunes",
		"Martes",
		"Miércoles",
		"Jueves",
		"Viernes",
		"Sábado",
	];

	return weekdays[date.getDay()];
}

export function getDaysInMonth(month: number, year: number): number {
	return new Date(year, month, 0).getDate();
}

export function getMonthsAndDays() {
	const months: Month[] = [
		"Enero",
		"Febrero",
		"Marzo",
		"Abril",
		"Mayo",
		"Junio",
		"Julio",
		"Agosto",
		"Septiembre",
		"Octubre",
		"Noviembre",
		"Diciembre",
	];

	const year = new Date().getFullYear();
	const monthsAndDays: {
		nameMonth: Month;
		days: number;
		numberMonth: number;
	}[] = [];

	months.map((month, index) => {
		monthsAndDays.push({
			nameMonth: month,
			days: getDaysInMonth(index + 1, year),
			numberMonth: index,
		});
	});

	return monthsAndDays;
}

export async function signUpUser(formData: {
	email: string;
	password: string;
}) {
	const { email, password } = formData;
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
	});

	if (error) {
		console.error(error);
		return;
	}
	console.log(data);
}

export function handlerSubmit(type: string, formData: Record<string, unknown>) {
	switch (type) {
		case "signup":
			signUpUser(formData as { email: string; password: string });
			break;
	}
}

export const onInput = (e: React.MouseEvent<HTMLInputElement>) => {
	const input = e.target as HTMLInputElement;
	if (input.value.trim() !== "") {
		input.classList.add("filled");
	} else {
		input.classList.remove("filled");
	}
};

export const onClickLabel = (e: React.MouseEvent<HTMLLabelElement>) => {
	if (e.target) {
		const target = e.target as HTMLElement;
		const input = target.parentNode!.querySelector("input");
		input!.focus();
	}
};

export async function onAuthSignUp(provider: AuthProvider) {
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider,
		options: { redirectTo: "http://localhost:5173/dashboard" },
	});

	if (error) {
		console.error("Error", error.message);
	} else if (data) {
		console.log(data);
	}
}

export async function getUserID() {
	const user_id = await supabase.auth
		.getUser()
		.then(usuario => usuario.data.user?.id);
	return user_id;
}

export async function getOneRow(
	table: string,
	userID: string,
	nameOfColumn: string,
	valueOfColumn: string
) {
	const { data, error } = await supabase
		.from(table)
		.select("*")
		.eq("user_id", userID)
		.ilike(nameOfColumn, valueOfColumn)
		.single();
	if (error) {
		console.error(error);
		return false;
	}
	return data;
}

export async function getAllRows(table: string, deck_id?: string) {
	if (deck_id) {
		const { data, error } = await supabase
			.from(table)
			.select("*")
			.eq("deck_id", deck_id)
			.order("created_at");
		if (error) {
			console.error(error.name, error.message);
			throw error;
		}
		return data;
	}
	const { data, error } = await supabase
		.from(table)
		.select("*")
		.eq("user_id", await getUserID())
		.order("created_at");
	if (error) {
		console.error(error.name, error.message);
		throw error;
	}
	return data;
}

export async function getPaginatedRows(
	table: string,
	pageIndex: number,
	pageSize: number
) {
	const from = pageIndex * pageSize;
	const to = from + pageSize - 1;

	const { data, error } = await supabase
		.from(table)
		.select("*")
		.eq("user_id", await getUserID())
		.order("created_at")
		.range(0, to);

	if (error) throw error;
	return data;
}

export async function getPages(table: string, user_id: string) {
	const { count, error } = await supabase
		.from(table)
		.select("*", { count: "exact", head: true })
		.eq("user_id", user_id);
	if (error) throw error;
	return count;
}

// export async function getSomeRows(table: string, columns: string[]) {
// 	const { data, error } = await supabase.from(table).select(columns.join(","));
// 	if (error) {
// 		console.error(error.name, error.message);
// 	}
// 	if (data) {
// 		return data;
// 	}
// }

export async function insertRow(table: string, fields: FieldValues) {
	const { data, error } = await supabase.from(table).insert(fields).select();
	if (error) {
		console.error(error);
		throw error;
	}
	return data;
}

export async function updateRow(
	table: string,
	updateFields: FieldValues,
	id: string
) {
	const { data, error } = await supabase
		.from(table)
		.update(updateFields)
		.eq("id", id)
		.select();
	if (error) {
		console.error(error);
		throw error;
	}

	return data;
}

export async function deleteRow(table: string, id: string) {
	const { data, error } = await supabase
		.from(table)
		.delete()
		.eq("id", id)
		.select();
	if (error) {
		console.error(error);
		throw error;
	}

	return data;
}

export function doesDeckExist(
	column: keyof DeckInterface,
	table: DeckInterface[],
	columnValue: string,
	id?: string
) {
	if (!table) return false;
	if (id) {
		return table.some(
			row =>
				row[column]!.toLowerCase() === columnValue.toLowerCase() &&
				row.id !== id
		);
	}
	return table.some(
		row => row[column]!.toLowerCase() === columnValue.toLowerCase()
	);
}

export async function getDecksWithCountsFlashcards(): Promise<Decks[]> {
	const { data, error } = await supabase
		.from("decks_flashcards_counts")
		.select("*")
		.order("deck_name");

	if (error || !data) {
		console.error("Error fetching view decks with counts flashcards", error);
		return [];
	}

	return data as Decks[];
}

export async function getDecksWithPendingFlashcards(): Promise<Decks[]> {
	const { data, error } = await supabase
		.from("decks_flashcards_counts")
		.select("*")
		.gt("pending_flashcards_count", 0)
		.order("deck_name");

	if (error || !data) {
		console.error("Error fetching view decks with counts flashcards", error);
		return [];
	}
	return data as Decks[];
}

export async function getAmountOfFlashcardsByBoxLevel(deckId: string) {
	const { data, error } = await supabase.rpc("contar_flashcards_por_nivel", {
		id_deck_buscado: deckId,
	});
	if (error) {
		console.error(error);
	}
	return data;
}

export async function getFlashcardsPendigs(deckId: string, boxLevel: number) {
	const { data, error } = await supabase
		.from("flashcards")
		.select("*")
		.eq("deck_id", deckId)
		.eq("box_level", boxLevel)
		.lte("next_review_at", new Date().toISOString());

	if (error) {
		console.error("Error fetching flashcards", error);
	}

	return data;
}

export function transformStringToArray(string: string): string[] {
	const newArray = string.split(",").map(word => word.trim().toLowerCase());
	return newArray;
}

export function transformArrayToString(arr: string[]): string {
	const newString = arr.join("<br />");
	console.log(newString);
	return newString;
}

// export function questionFillToAnswer(question: string, answer: string) {
// 	const textQuestion = question.split("").join()
// }

// export async function alreadyExists(
// 	someValue: string,
// 	table: string,
// 	column: string,
// 	id?: string
// ) {
// 	const query = supabase
// 		.from(table)
// 		.select(column)
// 		.eq("user_id", await getUserID())
// 		.ilike(column, someValue)
// 		.limit(1);

// 	if (id) {
// 		query.neq("id", id);
// 	}

// 	const { data, error } = await query;

// 	if (error) {
// 		console.log(error);
// 		return error;
// 	}

// 	return data.length > 0;
// }

// export async function updateSomeRows(table: string, newValues: object[]) {
// 		const { data, error } = await supabase
// 				.from("decks")
// 				.select("name, description")
// 				.eq("user_id", getUserID())
// 				.eq("name", nameOfBox);
// 			if (error) {
// 				console.error(error.message);
// 			}
// 			console.log(data);
// 		}
// }
