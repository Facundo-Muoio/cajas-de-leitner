import { SlLike } from "react-icons/sl";
import { FaRegEye } from "react-icons/fa";
import { SlDislike } from "react-icons/sl";
import { PiEyeClosedFill } from "react-icons/pi";
import { insertRevision } from "@/Helpers/Helpers";

type FooterFlascardOpen = {
	flashcard_id: string;
	viewReverse: boolean;
	setViewReverse: React.Dispatch<React.SetStateAction<boolean>>;
	currentFlashcard: number;
	setCurrentFlashcard: React.Dispatch<React.SetStateAction<number>>;
};

export default function FooterFlashcardOpen({
	flashcard_id,
	viewReverse,
	setViewReverse,
	currentFlashcard,
	setCurrentFlashcard,
}: FooterFlascardOpen) {
	const togleView = () => setViewReverse(!viewReverse);
	const handleAnswer = (e: React.MouseEvent) => {
		setViewReverse(false);
		setCurrentFlashcard(currentFlashcard + 1);
		console.log(e.target);
		if (e.target.className === "btn-dislike") {
			insertRevision({ flashcard_id, status: "incorrect" });
		} else {
			insertRevision({ flashcard_id, status: "correct" });
		}
	};

	return (
		<div className="footer-flashcard">
			<button className="btn-dislike" onClick={e => handleAnswer(e)}>
				<SlDislike className="icon-flashcard dislike" />
			</button>
			<button className="btn-view" onClick={togleView}>
				{viewReverse ? (
					<PiEyeClosedFill className="icon-flashcard view" />
				) : (
					<FaRegEye className="icon-flashcard view" />
				)}
			</button>
			<button className="btn-like" onClick={e => handleAnswer(e)}>
				<SlLike className="icon-flashcard like" />
			</button>
		</div>
	);
}
