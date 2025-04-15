import "./PanelReviews.css";
import Navbar from "../Navbar/Navbar";
import { SiSpeedtest } from "react-icons/si";
import { LuClipboardPen } from "react-icons/lu";
import { GiAnticlockwiseRotation } from "react-icons/gi";
import { useState, useRef } from "react";
import InputSearch from "../InputSearch/InputSearch";
import Loader from "../Loader/Loader";

import {
	getDecksWithCountsFlashcards,
	getDecksWithPendingFlashcards,
} from "@/Helpers/Helpers";
import useSWRMutation from "swr/mutation";
import BoxesView from "../BoxesView/BoxesView";

export interface Decks {
	deck_id: string;
	deck_name: string;
	total_flashcards_count: number;
	pending_flashcards_count: number;
}

export default function PanelRevisions() {
	const {
		data: deckCounts,
		isMutating: isLoading,
		trigger: triggerAllDecks,
	} = useSWRMutation("listReviews", getDecksWithCountsFlashcards, {
		onSuccess: data => setDecks(data),
		onError: error => console.error(error),
	});

	const {
		data: deckPendingCounts,
		isMutating: isLoadingPendings,
		trigger: triggerPendings,
	} = useSWRMutation("listReviewsPendings", getDecksWithPendingFlashcards, {
		onSuccess: data => setDecks(data),
		onError: error => console.error(error),
	});

	const [selectedMode, setSelectedMode] = useState("");
	const [decks, setDecks] = useState<Decks[] | []>([]);
	const [filterDecks, setFilterDecks] = useState<Decks[] | []>([]);
	const [selectedDeck, setSelectedDeck] = useState<string | undefined>();
	const [notFoundDecks, setNotFoundDecks] = useState(false);
	const [visibleBoxesView, setVisibleBoxesView] = useState(false);
	const headerSelectDeck = useRef<HTMLHeadingElement>(null);

	const handleClick = async (mode: string) => {
		const searchText = (
			headerSelectDeck.current?.nextElementSibling
				?.firstChild as HTMLInputElement
		)?.value.toLowerCase();
		setSelectedMode(mode);
		if (mode === "Pendientes") {
			triggerPendings();
			if (searchText.trim()) {
				const decks = deckPendingCounts;
				if (decks && decks.length > 0) {
					for (const deck of decks) {
						if (deck.deck_name.toLowerCase() === searchText) {
							setNotFoundDecks(false);
							setFilterDecks(
								decks!.filter(
									deck => deck.deck_name.toLowerCase() === searchText
								)
							);
						} else {
							setNotFoundDecks(true);
						}
					}
				}
			}
			return;
		}
		if (searchText.trim()) {
			const decks = deckCounts;
			if (decks && decks.length > 0) {
				for (const deck of decks) {
					if (deck.deck_name.toLowerCase() === searchText) {
						setNotFoundDecks(false);
						setFilterDecks(
							decks!.filter(deck => deck.deck_name.toLowerCase() === searchText)
						);
					}
				}
			}
		}
		triggerAllDecks();
	};

	const onSubmit = (nameDeck: string) => {
		if (!nameDeck.trim()) {
			setFilterDecks([]);
			setNotFoundDecks(false);
			return;
		}
		if (
			!decks.some(
				deck => deck.deck_name.toLowerCase() === nameDeck.toLowerCase()
			)
		) {
			setNotFoundDecks(true);
			return;
		}
		setNotFoundDecks(false);
		setFilterDecks(
			decks.filter(
				deck => deck.deck_name.toLowerCase() === nameDeck.toLowerCase()
			)
		);
	};

	const handleRevision = () => {
		if (
			selectedMode === "Pendientes" &&
			deckPendingCounts?.some(deck => deck.deck_id === selectedDeck)
		) {
			setVisibleBoxesView(true);
			return;
		}
		setVisibleBoxesView(false);
	};

	return (
		<div className="panel-reviews">
			<Navbar />
			{visibleBoxesView ? (
				<BoxesView
					setVisibleBoxesView={setVisibleBoxesView}
					deckId={selectedDeck}
				/>
			) : (
				<>
					<div className="header-panel-reviews">
						<h2>Iniciar Revisión</h2>
						<div className="modes-of-reviews">
							<h4>Modo de Revisión</h4>
							<div className="container-modes">
								<div
									className={`card-mode-review ${
										selectedMode === "Exámen" && "selected"
									}`}
									onClick={() => handleClick("Exámen")}
								>
									<LuClipboardPen className="icon-mode" />
									Exámen
								</div>
								<div
									className={`card-mode-review ${
										selectedMode === "Pendientes" && "selected"
									}`}
									onClick={() => handleClick("Pendientes")}
								>
									<GiAnticlockwiseRotation className="icon-mode" />
									Pendientes
								</div>
								<div
									className={`card-mode-review ${
										selectedMode === "Cuestionario" && "selected"
									}`}
									onClick={() => handleClick("Cuestionario")}
								>
									<SiSpeedtest className="icon-mode" />
									Cuestionario con Tiempo
								</div>
							</div>
						</div>
					</div>
					<div className="panel-revies-content">
						<div className="header-content-reviews">
							<h2 ref={headerSelectDeck}>Seleccionar Mazo</h2>
							<InputSearch
								onSubmit={onSubmit}
								placeholder="Buscar por nombre de mazo"
								className="input-search-reviews"
							/>
						</div>
						<div className="decks-container-reviews">
							{isLoading || isLoadingPendings ? (
								<Loader color="#ffdc69" />
							) : notFoundDecks ? (
								<p className="decks-reviews-notfounds">
									No existe un mazo con ese nombre.
								</p>
							) : filterDecks && filterDecks.length > 0 ? (
								filterDecks.map(deck => (
									<div
										className={`card_deck ${
											deck.deck_id === selectedDeck ? "selected" : ""
										}`}
										key={deck.deck_id}
										onClick={() => setSelectedDeck(deck.deck_id)}
									>
										<p className="deck_name">{deck.deck_name}</p>
										<span>
											{deck.total_flashcards_count >= 0 &&
												`${deck.total_flashcards_count} tarjetas - ${deck.pending_flashcards_count} pendientes`}
										</span>
									</div>
								))
							) : (
								decks &&
								decks.length > 0 &&
								decks.map(deck => (
									<div
										className={`card_deck ${
											deck.deck_id === selectedDeck ? "selected" : ""
										}`}
										key={deck.deck_id}
										onClick={() => setSelectedDeck(deck.deck_id)}
									>
										<p className="deck_name">{deck.deck_name}</p>
										<span>
											{deck.total_flashcards_count >= 0 &&
												`${deck.total_flashcards_count} tarjetas - ${deck.pending_flashcards_count} pendientes`}
										</span>
									</div>
								))
							)}
						</div>
						<button className="btn-start-review" onClick={handleRevision}>
							Comenzar Revisión
						</button>
					</div>
				</>
			)}
		</div>
	);
}
