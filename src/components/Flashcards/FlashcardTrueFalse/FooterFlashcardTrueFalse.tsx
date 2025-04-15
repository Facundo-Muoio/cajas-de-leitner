interface FooterFlashcardTrueFalseProps {
	answer: string;
	setAnswerView: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FooterFlashcardTrueFalse({
	answer,
	setAnswerView,
}: FooterFlashcardTrueFalseProps) {
	const handleAnswer = (valueSelected: string) => {
		setAnswerView(true);
		if (answer === valueSelected) {
			return true;
		}
		return false;
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
