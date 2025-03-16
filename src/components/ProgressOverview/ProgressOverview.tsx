import React from "react";
import "./ProgressOverview.css";

export default function ProgressOverview({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="progressOverview">{children}</div>;
}
