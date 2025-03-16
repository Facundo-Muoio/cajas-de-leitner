import "./CardReview.css";
import { MdKeyboardArrowRight } from "react-icons/md";

interface CardReviwProps {
	dateTime: string;
	revisionName: string;
	numbersOfRevisionCards: number;
}

export default function CardReview({
	dateTime,
	revisionName,
	numbersOfRevisionCards,
}: CardReviwProps) {
	return (
		<div className="card-review">
			<div className="card-review-leftside">
				<p className="revision-dateTime">{dateTime}</p>
				<p className="revision-name">{revisionName}</p>
			</div>
			<div className="card-review-rightside">
				<p>{numbersOfRevisionCards} cards</p>
				<MdKeyboardArrowRight className="arrow-card-review" />
			</div>
		</div>
	);
}
