import "./Streak.css";
import { getMonthsAndDays } from "../../Helpers/Helpers";
import StreakMonth from "./StreakMonth/StreakMonth";

// const akaDaysOfWeek = ["Lun", "Mar", "Miér", "Jue", "Vie", "Sáb", "Dom"];

// const generateFakeData = (): number[][] => {
// 	const weeks = 52;
// 	const daysPerWeek = 7;
// 	return Array.from({ length: weeks }, () =>
// 		Array.from({ length: daysPerWeek }, () => Math.floor(Math.random() * 6))
// 	);
// };

export default function Streak() {
	const daysInMonths = getMonthsAndDays();
	const year = new Date().getFullYear();

	return (
		<>
			<div className="streak-container">
				<h2 className="header-streak">Racha de Actividad</h2>
				<div className="grid-streak">
					<div className="aka-days">
						<p></p>
						<p>Lun</p>
						<p>Mar</p>
						<p>Mier</p>
						<p>Jue</p>
						<p>Vie</p>
						<p>Sab</p>
						<p>Dom</p>
					</div>
					{daysInMonths.map(({ days, numberMonth }, index) => (
						<StreakMonth
							key={index}
							uniqueKey={index}
							numberDays={days}
							numberMonth={numberMonth}
							year={year}
						/>
					))}
				</div>
			</div>
		</>
	);
}
