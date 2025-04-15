interface FooterFlashcardTrueFalseProps {
	answer: string;
	setAnswerView: React.Dispatch<React.SetStateAction<boolean>>;
	setAnswerIsCorrect: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export default function FooterFlashcardTrueFalse({
	answer,
	setAnswerView,
	setAnswerIsCorrect,
}: FooterFlashcardTrueFalseProps) {
	const handleAnswer = (valueSelected: string) => {
		setAnswerView(true);
		if (answer === valueSelected) {
			setAnswerIsCorrect(true);
			return;
		}
		setAnswerIsCorrect(false);
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
