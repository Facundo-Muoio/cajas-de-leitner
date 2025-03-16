import { IconType } from "react-icons";
import "./StaticsPanel.css";
import React from "react";

interface StaticsPanelProps {
	iconPanel: IconType;
	labelPanel: string;
	stat: string;
	bgcolor: React.CSSProperties["color"];
}

export default function StaticsPanel({
	labelPanel,
	stat,
	iconPanel: Icon,
	bgcolor,
}: StaticsPanelProps) {
	return (
		<div className="statics-panel" style={{ backgroundColor: bgcolor }}>
			<Icon className="static-icon" />
			<div>
				<p className="static-label">{labelPanel}</p>
				<p className="static-stat">{stat}</p>
			</div>
		</div>
	);
}
