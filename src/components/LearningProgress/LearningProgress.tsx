import { FaRegCircleCheck } from "react-icons/fa6";
import { FaChartLine } from "react-icons/fa6";
import { FaRegCircleXmark } from "react-icons/fa6";
import StaticsPanel from "./StaticsPanel/StaticsPanel";
import Chart from "./Chart/Chart";
import "./LearningProgress.css";

export default function LearningProgress() {
	const sampleData = [
		{ day: "Lun", correct: 10, total: 15, incorrect: 5 },
		{ day: "Mar", correct: 12, total: 20, incorrect: 8 },
		{ day: "Mie", correct: 8, total: 12, incorrect: 4 },
		{ day: "Jue", correct: 14, total: 18, incorrect: 4 },
		{ day: "Vie", correct: 9, total: 14, incorrect: 5 },
		{ day: "Sab", correct: 11, total: 16, incorrect: 5 },
		{ day: "Dom", correct: 13, total: 17, incorrect: 4 },
	];

	return (
		<div className="learning-progress">
			<div className="container-learning-progress">
				<div className="first-row">
					<div>
						<h2>Progreso del Aprendizaje</h2>
						<p>Últimos 7 días</p>
					</div>
					<div className="container-frequency-buttons">
						<button className="frequency-button">Semana</button>
						<button className="frequency-button">Mes</button>
						<button className="frequency-button">Año</button>
					</div>
				</div>
				<div className="second-row">
					<StaticsPanel
						iconPanel={FaRegCircleCheck}
						labelPanel="Total Revisadas"
						stat="265"
						bgcolor="#1D4545"
					/>{" "}
					<StaticsPanel
						iconPanel={FaChartLine}
						labelPanel="Tasa de Retención"
						stat="85%"
						bgcolor="#4B412E"
					/>
					<StaticsPanel
						iconPanel={FaRegCircleXmark}
						labelPanel="Respuestas Incorrectas"
						stat="37"
						bgcolor="#4A2E3A"
					/>{" "}
				</div>
				<div className="third-row">
					<Chart data={sampleData} />
				</div>
			</div>
		</div>
	);
}
