import { SlLike } from "react-icons/sl";
import { FaRegEye } from "react-icons/fa";
import { SlDislike } from "react-icons/sl";
import { PiEyeClosedFill } from "react-icons/pi";

type FooterFlascardOpen = {
	viewReverse: boolean;
	setViewReverse: React.Dispatch<React.SetStateAction<boolean>>;
	currentFlashcard: number;
	setCurrentFlashcard: React.Dispatch<React.SetStateAction<number>>;
};

export default function FooterFlashcardOpen({
	viewReverse,
	setViewReverse,
	currentFlashcard,
	setCurrentFlashcard,
}: FooterFlascardOpen) {
	const togleView = () => setViewReverse(!viewReverse);
	const handleAnswer = () => setCurrentFlashcard(currentFlashcard + 1);

	return (
		<div className="footer-flashcard">
			<button className="btn-dislike" onClick={handleAnswer}>
				<SlDislike className="icon-flashcard dislike" />
			</button>
			<button className="btn-view" onClick={togleView}>
				{viewReverse ? (
					<PiEyeClosedFill className="icon-flashcard view" />
				) : (
					<FaRegEye className="icon-flashcard view" />
				)}
			</button>
			<button className="btn-like" onClick={handleAnswer}>
				<SlLike className="icon-flashcard like" />
			</button>
		</div>
	);
}
