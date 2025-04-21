import { insertRevision } from "@/Helpers/Helpers";
import "./FooterFlashcardOption.css";
import { useState } from "react";

interface optionsObject {
	text: string;
	isCorrect: boolean;
}

type optionProps = {
	flashcard_id: string;
	options: optionsObject[];
	setAnswerView: React.Dispatch<React.SetStateAction<boolean>>;
	setAnswerIsCorrect: React.Dispatch<React.SetStateAction<boolean | undefined>>;
};

export default function FooterFlashcardOption({
	flashcard_id,
	options,
	setAnswerView,
	setAnswerIsCorrect,
}: optionProps) {
	const [optionsChecked, setOptionsChecked] = useState<string[]>([]);

	const handleCheckAnswer = () => {
		const arrayCorrectOptions = options
			.map(option => (option.isCorrect === true ? option.text : ""))
			.filter(option => option);
		setAnswerView(true);
		const arrayResult = arrayCorrectOptions
			.sort()
			.map((item, i) => (item === optionsChecked[i] ? "true" : "false"));
		if (arrayResult.includes("false")) {
			setAnswerIsCorrect(false);
			insertRevision({ flashcard_id, status: "incorrect" });
		} else {
			setAnswerIsCorrect(true);
			insertRevision({ flashcard_id, status: "correct" });
		}
	};

	const handleCheckOption = (optionText: string) => {
		if (optionsChecked.includes(optionText)) {
			setOptionsChecked([
				...optionsChecked.filter(option => option !== optionText),
			]);
			return;
		}
		setOptionsChecked([...optionsChecked, optionText].sort());
	};

	return (
		<div className="footer-flashcard footer-options">
			{options.map(option => (
				<label key={option.text}>
					{option.text}
					<input
						type="checkbox"
						value={option.text}
						checked={optionsChecked.some(op => op === option.text)}
						onChange={() => handleCheckOption(option.text)}
					/>
				</label>
			))}
			<button className="btn-flashcard-option" onClick={handleCheckAnswer}>
				Comprobar
			</button>
		</div>
	);
}
