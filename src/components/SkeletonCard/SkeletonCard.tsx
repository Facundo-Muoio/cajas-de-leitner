import Skeleton from "./Skeleton/Skeleton";
import "./SkeletonCard.css";

export default function SkeletonCard() {
	return (
		<div className="skeleton-card">
			<div className="skeleton-header">
				<Skeleton width="25%" height="30px" borderRadius="2px" />
				<div className="container-button-icons">
					<Skeleton width="1rem" height="1rem" borderRadius="2px" />
					<Skeleton width="1rem" height="1rem" borderRadius="2px" />
				</div>
			</div>
			<div className="skeleton-content">
				<Skeleton width="100%" height="0.85rem" borderRadius="2px" />
				<Skeleton width="75%" height="0.85rem" borderRadius="2px" />
			</div>
			<div className="skeleton-footer">
				<Skeleton width="20%" height="1.375rem" borderRadius="2px" />
				<Skeleton width="27%" height="2.25rem" />
			</div>
		</div>
	);
}
