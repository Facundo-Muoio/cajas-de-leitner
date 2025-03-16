import "./StreakMonth.css";
import { Day, getDayName } from "@/Helpers/Helpers";

const akaMonths = [
	"Ene",
	"Feb",
	"Mar",
	"Abr",
	"May",
	"Jun",
	"Jul",
	"Ago",
	"Sep",
	"Oct",
	"Nov",
	"Dic",
];

const days: readonly Day[] = [
	"Lunes",
	"Martes",
	"Miércoles",
	"Jueves",
	"Viernes",
	"Sábado",
	"Domingo",
];

interface StreakMonthProps {
	uniqueKey: number;
	numberDays: number;
	numberMonth: number;
	year: number;
}

export default function StreakMonth({
	uniqueKey,
	numberDays,
	numberMonth,
	year,
}: StreakMonthProps) {
	const firstMonthDay = days.indexOf(
		getDayName(new Date(year, numberMonth, 1))
	);

	const emptySquares = [];
	const squares = [];

	for (let i = 0; i < firstMonthDay; i++) {
		emptySquares.push(<div className="empty-square" key={i}></div>);
	}

	for (let i = 0; i < numberDays; i++) {
		squares.push(
			<div className="square-day" key={i}>
				{" "}
			</div>
		);
	}

	return (
		<div className={`streak-month ${akaMonths[numberMonth]}`} key={uniqueKey}>
			<h6 className="aka-month">{akaMonths[numberMonth]}</h6>
			<div className="streak-grid-days">
				{emptySquares}
				{squares}
			</div>
		</div>
	);
}
