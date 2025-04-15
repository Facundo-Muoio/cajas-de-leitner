import "./BoxesView.css";
import { SetStateAction, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import useSWR from "swr";
import { getAmountOfFlashcardsByBoxLevel } from "../../Helpers/Helpers";
import { useNavigate } from "react-router";

interface BoxesViewProps {
	setVisibleBoxesView: React.Dispatch<SetStateAction<boolean>>;
	deckId: string | undefined;
}

export default function BoxesView({
	setVisibleBoxesView,
	deckId,
}: BoxesViewProps) {
	const [boxSelected, setBoxSelected] = useState<number | null>(null);
	interface FlashcardData {
		nivel_de_caja: number;
		total_de_flashcards: number;
	}

	const navigate = useNavigate();

	const { data } = useSWR<FlashcardData[]>(
		[`getFlashcardsByBoxLevel-${deckId}`, deckId],
		() => getAmountOfFlashcardsByBoxLevel(deckId!)
	);

	const handleClickBox = (e: React.MouseEvent<HTMLDivElement>) => {
		const boxLevel = (e.target as HTMLElement).getAttribute("data-level");
		setBoxSelected(Number(boxLevel));
	};

	const handlerStartReview = () => {
		navigate(`/deck/${deckId}/flashcards/revisions/box/${boxSelected}`);
	};

	return (
		<div className="boxes-view">
			<div className="header-boxes-view">
				<h2>Mis Cajas</h2>
				<button className="back" onClick={() => setVisibleBoxesView(false)}>
					{" "}
					<IoChevronBack />
					Volver Atrás{" "}
				</button>
			</div>
			<div className="content-boxes-view">
				<div
					className={`box-view ${boxSelected === 1 ? "selected" : ""}`}
					data-level="1"
					onClick={e => handleClickBox(e)}
				>
					<h2 data-level="1">Box 1</h2>
					<p data-level="1">
						Tarjetos{" "}
						{data?.find(item => item.nivel_de_caja === 1)
							?.total_de_flashcards ?? "0"}
					</p>
				</div>
				<div
					className={`box-view ${boxSelected === 2 ? "selected" : ""}`}
					data-level="2"
					onClick={e => handleClickBox(e)}
				>
					<h2 data-level="2">Box 2</h2>
					<p data-level="2">
						Tarjetos{" "}
						{data?.find(item => item.nivel_de_caja === 2)
							?.total_de_flashcards ?? "0"}
					</p>
				</div>
				<div
					className={`box-view ${boxSelected === 3 ? "selected" : ""}`}
					data-level="3"
					onClick={e => handleClickBox(e)}
				>
					<h2 data-level="3">Box 3</h2>
					<p data-level="3">
						Tarjetos{" "}
						{data?.find(item => item.nivel_de_caja === 3)
							?.total_de_flashcards ?? "0"}
					</p>
				</div>
				<div
					className={`box-view ${boxSelected === 4 ? "selected" : ""}`}
					data-level="4"
					onClick={e => handleClickBox(e)}
				>
					<h2 data-level="4">Box 4</h2>
					<p data-level="4">
						Tarjetos{" "}
						{data?.find(item => item.nivel_de_caja === 4)
							?.total_de_flashcards ?? "0"}
					</p>
				</div>
				<div
					className={`box-view ${boxSelected === 5 ? "selected" : ""}`}
					data-level="5"
					onClick={e => handleClickBox(e)}
				>
					<h2 data-level="5">Box 5</h2>
					<p data-level="5">
						Tarjetos{" "}
						{data?.find(item => item.nivel_de_caja === 5)
							?.total_de_flashcards ?? "0"}
					</p>
				</div>
			</div>
			<button onClick={handlerStartReview}>Revisar</button>
		</div>
	);
}
