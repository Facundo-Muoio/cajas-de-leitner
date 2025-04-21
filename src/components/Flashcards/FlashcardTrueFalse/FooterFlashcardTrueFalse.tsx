import { insertRevision } from "@/Helpers/Helpers";

interface FooterFlashcardTrueFalseProps {
	flashcard_id: string;
	answer: string;
	setAnswerView: React.Dispatch<React.SetStateAction<boolean>>;
	setAnswerIsCorrect: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export default function FooterFlashcardTrueFalse({
	answer,
	setAnswerView,
	setAnswerIsCorrect,
	flashcard_id,
}: FooterFlashcardTrueFalseProps) {
	const handleAnswer = (valueSelected: string) => {
		setAnswerView(true);
		if (answer === valueSelected) {
			setAnswerIsCorrect(true);
			insertRevision({ flashcard_id, status: "correct" });
			return;
		}
		setAnswerIsCorrect(false);
		insertRevision({ flashcard_id, status: "incorrect" });
		return;
	};

	return (
		<div className="footer-flashcard">
			<button className="btn-false" onClick={() => handleAnswer("falso")}>
				Falso
			</button>
			<button className="btn-true" onClick={() => handleAnswer("verdadero")}>
				Verdadero
			</button>
		</div>
	);
}
