import ReactECharts from "echarts-for-react";
import "./Chart.css";

interface ChartProps {
	data: {
		day: string;
		correct: number;
		total: number;
		incorrect: number;
	}[];
}

export default function Chart({ data }: ChartProps) {
	const option = {
		// title: {
		// 	text: "Progreso de Respuestas",
		// 	textStyle: {
		// 		color: "#fff",
		// 	},
		// },
		tooltip: {
			trigger: "axis",
		},
		legend: {
			data: [
				"Respuestas Correctas",
				"Total de Preguntas",
				"Respuestas Incorrectas",
			],
			textStyle: {
				color: "#fff",
			},
			bottom: 5,
			// icon: "circle",
			itemGap: 32,
		},
		xAxis: {
			type: "category",
			data: data.map(item => item.day),
			axisLabel: {
				color: "#fff",
			},
		},
		yAxis: {
			type: "value",
			axisLabel: {
				color: "#fff",
			},
		},
		series: [
			{
				name: "Respuestas Correctas",
				type: "bar",
				data: data.map(item => item.correct),
				itemStyle: {
					color: "#4CAF50",
				},
			},
			{
				name: "Total de Preguntas",
				type: "bar",
				data: data.map(item => item.total),
				itemStyle: {
					color: "#2196F3",
				},
			},
			{
				name: "Respuestas Incorrectas",
				type: "bar",
				data: data.map(item => item.incorrect),
				itemStyle: { color: "#f44336" },
			},
		],
	};

	return (
		<div className="chart-container">
			<ReactECharts option={option} />
		</div>
	);
}
