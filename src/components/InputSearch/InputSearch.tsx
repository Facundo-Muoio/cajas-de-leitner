import "./InputSearch.css";
import { IoIosSearch } from "react-icons/io";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface InputSearchProps {
	placeholder: string;
	onSubmit: (valueOfSearch: string | number | boolean | object | Date) => void;
}

const schema = z.object({
	search: z.string().min(3, "").trim(),
});

export default function InputSearch({
	placeholder,
	onSubmit,
}: InputSearchProps) {
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm({ resolver: zodResolver(schema) });

	const handlerSubmit = (formSearchData: { search: string }) => {
		onSubmit(formSearchData.search);
	};

	return (
		<form className="search-form">
			<input
				type="search"
				className="search-input"
				placeholder={placeholder}
				{...register("search")}
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
			{/* <button className="seach-close-button">
				<IoMdClose />
			</button> */}
		</form>
	);
}
