import "./FooterFlashcardOption.css";
import { useState } from "react";

interface optionsObject {
	text: string;
	isCorrect: boolean;
}

type optionProps = {
	options: optionsObject[];
	setAnswerView: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function FooterFlashcardOption({
	options,
	setAnswerView,
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
		return arrayResult.includes("false") ? false : true;
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
