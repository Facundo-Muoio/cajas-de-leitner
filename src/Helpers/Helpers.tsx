import { supabase } from "../supabase/client";

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
