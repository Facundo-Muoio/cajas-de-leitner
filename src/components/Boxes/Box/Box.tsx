import "./Box.css";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

export default function Box({
	nameOfBox,
	numberOfCards,
	description,
}: {
	nameOfBox: string;
	numberOfCards: number;
	description?: string;
}) {
	return (
		<div className="box">
			<div className="box-header">
				<h2>{nameOfBox}</h2>
				<div className="box-buttons">
					<button>
						<FaEdit className="box-icon-button" />
					</button>
					<button>
						<FaTrash className="box-icon-button" />
					</button>
				</div>
			</div>
			<div className="box-content">
				<p>{description && description}</p>
			</div>
			<div className="box-footer">
				<span>{numberOfCards} tarjetas</span>
				<button>Repasar</button>
			</div>
		</div>
	);
}
