import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { transformStringToArray } from "@/Helpers/Helpers";
import parse from "html-react-parser";

interface FooterFlashcardFillProps {
	words: string;
	setAnswerView: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FooterFlashcardFill({
	words,
	setAnswerView,
}: FooterFlashcardFillProps) {
	const schemaInput = z.object({
		words: z.string().trim().toLowerCase(),
	});

	const parsedWords = parse(words);
	const answerWords =
		typeof parsedWords === "object" && "props" in parsedWords
			? parsedWords.props.children
			: parsedWords;

	const {
		register,
		getValues,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(schemaInput),
	});

	const checkFilledWords = () => {
		const correctsWordsArray = transformStringToArray(answerWords);
		const inputWords = getValues("words");
		const inputWordsArray = transformStringToArray(inputWords);
		console.log(correctsWordsArray, inputWordsArray);
		const resultArray = correctsWordsArray.map((word, i) =>
			word === inputWordsArray[i] ? true : false
		);
		setAnswerView(true);
		console.log(resultArray.some(item => item === false) ? false : true);
		return resultArray.some(item => item === false) ? false : true;
	};

	return (
		<div className="footer-flashcard">
			<input {...register("words")} />
			<p className="error-inputWords">{errors.words && errors.words.message}</p>
			<button
				type="submit"
				onClick={checkFilledWords}
				disabled={errors.words ? true : false}
			>
				Comprobar
			</button>
		</div>
	);
}
