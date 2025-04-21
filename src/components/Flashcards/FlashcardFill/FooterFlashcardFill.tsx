import "./FooterFlashcardFill.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertRevision, transformStringToArray } from "@/Helpers/Helpers";
import parse from "html-react-parser";

interface FooterFlashcardFillProps {
	flashcard_id: string;
	words: string;
	setAnswerView: React.Dispatch<React.SetStateAction<boolean>>;
	setAnswerIsCorrect: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export default function FooterFlashcardFill({
	flashcard_id,
	words,
	setAnswerView,
	setAnswerIsCorrect,
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
		if (resultArray.some(item => item === false)) {
			setAnswerIsCorrect(false);
			const revision = {
				status: "incorrect" as "incorrect",
				flashcard_id,
			};
			insertRevision(revision);
		} else {
			setAnswerIsCorrect(true);
			const revision = {
				status: "correct" as "correct",
				flashcard_id,
			};
			insertRevision(revision);
		}
		return resultArray.some(item => item === false)
			? setAnswerIsCorrect(false)
			: setAnswerIsCorrect(true);
	};

	return (
		<div className="footer-flashcard-fill-answer">
			<input {...register("words")} />
			<p className="error-inputWords">{errors.words && errors.words.message}</p>
			<button
				type="submit"
				onClick={checkFilledWords}
				disabled={errors.words ? true : false}
				className="btn-check-fill"
			>
				Comprobar
			</button>
		</div>
	);
}
