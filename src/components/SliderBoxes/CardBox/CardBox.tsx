import "./CardBox.css";

interface CardBoxProps {
	nameOfBox: string;
	numberOfCards: number;
}

export default function CardBox({ nameOfBox, numberOfCards }: CardBoxProps) {
	return (
		<div className="card-box">
			<h6 className="name-box">{nameOfBox}</h6>
			<p className="number-cards-box">{numberOfCards}</p>
			<p className="cards-box">cards</p>
		</div>
	);
}
