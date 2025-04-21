import "./ViewRevisionBox.css";
import { useParams } from "react-router";
import { useState } from "react";
import { FaRegLightbulb } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import { BsEmojiLaughing } from "react-icons/bs";
import { BsEmojiSmileUpsideDown } from "react-icons/bs";
import { TbBulbFilled } from "react-icons/tb";
import useFlashcardsPendings from "@/Hooks/useFlashcardsPendings";
import FooterFlashcardOpen from "../Flashcards/FlashcardOpen/FooterFlashcardOpen";
import parse from "html-react-parser";
import FooterFlashcardTrueFalse from "../Flashcards/FlashcardTrueFalse/FooterFlashcardTrueFalse";
import FooterFlashcardOption from "../Flashcards/FlashcardOption/FooterFlashcardOption";
import FooterFlashcardFill from "../Flashcards/FlashcardFill/FooterFlashcardFill";
import {
	convertHTMLtoPlainText,
	fillEmptysWhiteSpaces,
	transformArrayToString,
} from "@/Helpers/Helpers";
import { useNavigate } from "react-router";

export default function ViewRevisionBox() {
	const { deck_id, box_level } = useParams();

	const [hintOn, setHintOn] = useState(false);
	const [currentFlashcard, setCurrentFlashcard] = useState(0);
	const [viewReverse, setViewReverse] = useState(false);
	const [answerView, setAnswerView] = useState(false);
	const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean>();
	const { flashcards } = useFlashcardsPendings(deck_id!, Number(box_level));
	const navigate = useNavigate();

	const togleHint = () => {
		setHintOn(!hintOn);
	};
	const nextFlashcard = () => {
		if (flashcards && currentFlashcard + 1 < flashcards?.length) {
			setCurrentFlashcard(currentFlashcard + 1);
			setAnswerView(false);
		} else {
			navigate(-1);
		}
	};
	console.log(flashcards);

	return (
		<div className="container-revisions-flashcards">
			<div className="header-flashcard">
				<div className="count-flashcards">
					{currentFlashcard + 1}/{flashcards?.length}
				</div>
				{flashcards && flashcards[currentFlashcard].hint && (
					<button onClick={togleHint}>
						{hintOn ? (
							<FaLightbulb className="bulb-on" />
						) : (
							<FaRegLightbulb className="bulb-off" />
						)}
					</button>
				)}
			</div>
			<div className="content-flashcard">
				{hintOn && (
					<>
						<h2 className="header-hint">
							Pista
							<TbBulbFilled />
						</h2>
						<p className="p-hint">
							{flashcards && flashcards[currentFlashcard].hint}
						</p>
					</>
				)}
				<h2>
					{viewReverse
						? "Respuesta"
						: answerView
							? "Respuesta Correcta"
							: "Pregunta"}
				</h2>

				{!answerView && !viewReverse && flashcards
					? parse(flashcards[currentFlashcard].question)
					: flashcards && flashcards[currentFlashcard].type === "truefalse"
						? parse(flashcards[currentFlashcard].true_false_answer)
						: flashcards && flashcards[currentFlashcard].type === "multiple"
							? parse(
									transformArrayToString(
										flashcards[currentFlashcard].options
											.filter(
												(option: { isCorrect: boolean }) =>
													option.isCorrect === true
											)
											.map((option: { text: string }) => option.text)
									)
								)
							: flashcards && flashcards[currentFlashcard].type === "fill"
								? parse(
										fillEmptysWhiteSpaces(
											convertHTMLtoPlainText(
												flashcards[currentFlashcard].question
											),
											convertHTMLtoPlainText(
												flashcards[currentFlashcard].answer
											)
										)
									)
								: flashcards && parse(flashcards[currentFlashcard].answer)}
			</div>

			{flashcards && flashcards[currentFlashcard].type === "open" && (
				<FooterFlashcardOpen
					flashcard_id={flashcards[currentFlashcard].id}
					viewReverse={viewReverse}
					setViewReverse={setViewReverse}
					currentFlashcard={currentFlashcard}
					setCurrentFlashcard={setCurrentFlashcard}
				/>
			)}
			{answerView ? (
				<div className="footer-flashcard">
					<p
						className={
							answerIsCorrect ? "correct-message" : "incorrect-message"
						}
					>
						{answerIsCorrect ? (
							<>
								<BsEmojiLaughing className="correct-icon" />
								Acertaste, sigue así!
							</>
						) : (
							<>
								<BsEmojiSmileUpsideDown className="icorrect-icon" />
								Incorrecto, a repasar!
							</>
						)}
					</p>
					<button className="btn-next-flashcard" onClick={nextFlashcard}>
						Siguiente Tarjeta
						<FaArrowRight />
					</button>
				</div>
			) : flashcards && flashcards[currentFlashcard].type === "truefalse" ? (
				<FooterFlashcardTrueFalse
					flashcard_id={flashcards[currentFlashcard].id}
					answer={flashcards[currentFlashcard].true_false_answer}
					setAnswerView={setAnswerView}
					setAnswerIsCorrect={setAnswerIsCorrect}
				/>
			) : flashcards && flashcards[currentFlashcard].type === "multiple" ? (
				<FooterFlashcardOption
					flashcard_id={flashcards[currentFlashcard].id}
					options={flashcards[currentFlashcard].options}
					setAnswerView={setAnswerView}
					setAnswerIsCorrect={setAnswerIsCorrect}
				/>
			) : flashcards && flashcards[currentFlashcard].type === "fill" ? (
				<FooterFlashcardFill
					flashcard_id={flashcards[currentFlashcard].id}
					words={flashcards[currentFlashcard].answer}
					setAnswerView={setAnswerView}
					setAnswerIsCorrect={setAnswerIsCorrect}
				/>
			) : null}
		</div>
	);
}
