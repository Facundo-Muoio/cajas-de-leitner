import "./InputSearch.css";
import { IoIosSearch } from "react-icons/io";
import { IoMdClose } from "react-icons/io";

import { useForm, UseFormSetError } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Flashcard as TypeFlashcard } from "@/Contexts/FlashcardsContext";

interface InputSearchProps {
	placeholder: string;
	onSubmit: (
		valueOfSearch: string,
		setError: UseFormSetError<{
			search: string;
		}>
	) => void;
	setFilterDeck?: React.Dispatch<React.SetStateAction<string | undefined>>;
	setFilterFlashcard?: React.Dispatch<
		React.SetStateAction<TypeFlashcard[] | []>
	>;
	className?: string;
}

export default function InputSearch({
	placeholder,
	onSubmit,
	...props
}: InputSearchProps) {
	const schema = z.object({
		search: z.preprocess(
			val => (typeof val === "number" ? String(val) : val),
			z.string()
		),
	});

	const {
		register,
		formState: { errors },
		handleSubmit,
		watch,
		setValue,
		setError,
		clearErrors,
	} = useForm({ resolver: zodResolver(schema) });

	const handlerSubmit = (formSearchData: { search: string }) => {
		onSubmit(formSearchData.search, setError);
	};

	const onClickClose = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		clearErrors("root");
		setValue("search", "");
		if (props.setFilterDeck) {
			props.setFilterDeck(undefined);
		}
		if (props.setFilterFlashcard) {
			props.setFilterFlashcard([]);
		}
	};

	const onKeyClose = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Escape") {
			clearErrors("root");
			setValue("search", "");
		}
		if (props.setFilterDeck) {
			props.setFilterDeck(undefined);
		}
		if (props.setFilterFlashcard) {
			props.setFilterFlashcard([]);
		}
	};

	return (
		<form className="search-form">
			<input
				type="search"
				className={`search-input ${props.className ? props.className : ""}`}
				placeholder={placeholder}
				{...register("search")}
				onKeyDown={onKeyClose}
			/>
			{errors.search && (
				<p className="error-search-input">{errors.search.message}</p>
			)}
			<button
				type="submit"
				className="search-button"
				onClick={handleSubmit(handlerSubmit)}
			>
				<IoIosSearch className="search-icon" />
			</button>
			<button
				className={
					watch("search")
						? "search-close-button visible"
						: "search-close-button"
				}
				onClick={onClickClose}
			>
				<IoMdClose className="search-close-icon" />
			</button>
			{errors.root && (
				<p className="error-sarch-input">{errors.root.message}</p>
			)}
		</form>
	);
}
