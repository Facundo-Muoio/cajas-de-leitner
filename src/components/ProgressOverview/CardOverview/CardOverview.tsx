import React from "react";
import "./CardOverview.css";

interface CardOverviewProps {
	label: string;
	children: React.ReactNode;
}

export default function CardOverview({ label, children }: CardOverviewProps) {
	return (
		<div className="card-overview">
			<p className="card-label">{label}</p>
			{children}
		</div>
	);
}
