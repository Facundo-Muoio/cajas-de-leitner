import "./SkeletonFlashcards.css";
import Skeleton from "../SkeletonCard/Skeleton/Skeleton";

export default function SkeletonFlashcards() {
	return (
		<div className="skeleton-flashcard">
			<div className="header-skeleton-flashcard">
				<div className="skeleton-index-flashcard">
					<Skeleton width="100%" height="80%" borderRadius="2px" />
				</div>
				<div className="skeleton-flashcard-title">
					<Skeleton width="100%" height="80%" borderRadius="2px" />
				</div>
				<div className="skeleton-tags-flashcard">
					<Skeleton width="100px" height="1rem" borderRadius="24px" />
					<Skeleton width="100px" height="1rem" borderRadius="24px" />
					<Skeleton width="100px" height="1rem" borderRadius="24px" />
				</div>
				<div className="skeleton-control-flashcard">
					<Skeleton width="1rem" height="1rem" borderRadius="4px" />
					<Skeleton width="1rem" height="1rem" borderRadius="4px" />
					<Skeleton width="1rem" height="1rem" borderRadius="4px" />
				</div>
			</div>
			<div className="skeleton-question-flashcard">
				<Skeleton width="95%" height="0.75rem" borderRadius="2px" />
				<Skeleton width="25%" height="0.75rem" borderRadius="2px" />
			</div>
		</div>
	);
}
