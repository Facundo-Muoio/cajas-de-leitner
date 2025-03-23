import "./Sekeleton.css";

interface SkeletonProps {
	width: string;
	height: string;
	borderRadius?: string;
}

export default function Sekeleton({
	width,
	height,
	borderRadius = "24px",
}: SkeletonProps) {
	return (
		<div className="skeleton" style={{ width, height, borderRadius }}></div>
	);
}
