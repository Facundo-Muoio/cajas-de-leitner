import React from "react";
import "./EmptyState.css";

interface EmptyStateProps {
	title: string;
	description: string;
	icon?: React.ReactNode;
	[key: string]: unknown;
}

export default function EmptyState({
	title,
	description,
	icon,
}: EmptyStateProps) {
	return (
		<div className="empty-state">
			{icon}
			<h2 className="empty-state-title">{title}</h2>
			<p className="empty-state-description">{description}</p>
		</div>
	);
}
