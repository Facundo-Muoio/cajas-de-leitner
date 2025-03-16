import "./Reviews.css";
import { CiCalendarDate } from "react-icons/ci";

interface ReviewsProps {
	children: React.ReactNode;
}

export default function Reviews({ children }: ReviewsProps) {
	return (
		<div className="reviews">
			<div className="container-reviews">
				<div className="header-review">
					<p> Próximas Revisiones </p>
					<CiCalendarDate className="icon-review" />
				</div>
				{children}
			</div>
		</div>
	);
}
