import { FieldValues } from "react-hook-form";
import { supabase } from "../supabase/client";
import { Deck } from "@/components/Boxes/Boxes";

// import { useContext } from "react";
// import { UserContext } from "@/Contexts/UserContext";

// const userContext = useContext(UserContext);

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
	if (error) throw error;
	return data;
}

export async function getAllRows(table: string) {
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
		.range(from, to);

	if (error) throw error;
	return data;
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

export async function insertRow<T>(table: string, fields: T[]): Promise<T[]> {
	const { data, error } = await supabase.from(table).insert(fields).select();
	if (error) {
		console.error(error);
		throw error;
	}
	// mutate(table);
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

export async function deleteRow(table: string, id: string): Promise<Deck[]> {
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
	column: keyof Deck,
	table: Deck[],
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

export async function alreadyExists(
	someValue: string,
	table: string,
	column: string,
	id?: string
) {
	const query = supabase
		.from(table)
		.select(column)
		.eq("user_id", await getUserID())
		.ilike(column, someValue)
		.limit(1);

	if (id) {
		query.neq("id", id);
	}

	const { data, error } = await query;

	if (error) {
		console.log(error);
		return error;
	}

	return data.length > 0;
}

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
