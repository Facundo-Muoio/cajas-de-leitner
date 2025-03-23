import "./Boxes.css";
import { useState, useContext, useRef, useCallback, useEffect } from "react";
import Modal from "../Modal/Modal";
import { z } from "zod";
import Form, { Field } from "../Form/Form";
import { FieldValues } from "react-hook-form";
import {
	alreadyExists,
	getOneRow,
	getPaginatedRows,
	insertRow,
} from "@/Helpers/Helpers";
import Box from "./Box/Box";
import { UserContext } from "@/Contexts/UserContext";
import Toast from "../Toast/Toast";
import useAuth from "../Auth/Auth";
import useSWRMutation from "swr/mutation";
import useSWRInfinite from "swr/infinite";
import SkeletonCard from "../SkeletonCard/SkeletonCard";
import Navbar from "../Navbar/Navbar";
import InputSearch from "../InputSearch/InputSearch";

export interface Deck {
	id: string;
	name: string;
	description?: string;
	user_id: string;
	created_at?: string;
}

export default function Boxes() {
	const { session } = useAuth();
	const userContext = useContext(UserContext);

	const [decks, setDecks] = useState<Deck[]>([]);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isAlertVisible, setIsAlertVisible] = useState(false);
	const [errorAddDeck, setErrorAddDeck] = useState("");
	const [isEditAlertOpen, setIsEditAlertOpen] = useState(false);
	const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
	const boxContentRef = useRef<HTMLDivElement>(null);

	function getKey(pageIndex: number, previousPageData: unknown[]) {
		if (previousPageData && !previousPageData.length) {
			return null;
		}
		return ["decks", pageIndex];
	}

	const options = {
		revalidateOnFocus: true,
		revalidateOnReconnect: true,
		refreshInterval: 0,
	};

	const {
		data,
		isLoading,
		isValidating,
		size,
		setSize,
		mutate: mutateDecks,
	} = useSWRInfinite(
		getKey,
		([table, pageIndex]: [string, number]) =>
			getPaginatedRows(table, pageIndex, 9),
		options
	);

	useEffect(() => {
		if (data) {
			setDecks(data.flat());
		}
	}, [data]);

	const loadMore = useCallback(() => {
		if (boxContentRef.current && !isLoading && !isValidating) {
			const bottom =
				boxContentRef.current.scrollHeight ===
				boxContentRef.current.scrollTop + boxContentRef.current.clientHeight;
			if (bottom) {
				setSize(size + 1); // Aumentamos la página de la paginación
			}
		}
	}, [isLoading, size, setSize, isValidating]);

	const handleScroll = () => loadMore();

	const { trigger: insertTrigger } = useSWRMutation(
		"decks",
		(
			_,
			{
				arg,
			}: {
				arg: {
					table: string;
					fields: Pick<Deck, "name" | "description" | "user_id">[];
				};
			}
		) => insertRow(arg.table, arg.fields)
	);

	const schema = z.object({
		name: z
			.string()
			.trim()
			.min(3, "El nombre debe tener al menos 3 caracteres")
			.max(50, "El nombre no puede tener más de 50 caracteres")
			.refine(
				async name => {
					const exists = await alreadyExists(name, "decks", "name");
					return !exists;
				},
				{ message: "Ya existe un mazo con este nombre" }
			),
		description: z.string().trim(),
	});
	const fields: Field[] = [
		{ name: "name", label: "Nombre", type: "text" },
		{ name: "description", label: "Descripción", type: "textarea" },
	];

	const onClick = () => {
		setIsAddModalOpen(true);
	};

	const onSubmit = async ({ name, description }: FieldValues) => {
		setErrorAddDeck("");

		await insertTrigger({
			table: "decks",
			fields: [{ name, description, user_id: userContext!.user!.id }],
		});

		mutateDecks(
			async arrDecks => {
				const newDeck = { name, description, id: crypto.randomUUID() };
				if (arrDecks && arrDecks.length < 2) {
					return [[...arrDecks.flat(), newDeck]];
				}
				if (arrDecks) {
					const newArrDecks = arrDecks?.map(decks => {
						return decks.length < 9 ? [...decks, newDeck] : [...decks];
					});
					return newArrDecks[newArrDecks.length - 2].length < 9
						? newArrDecks.slice(0, newArrDecks.length - 1)
						: newArrDecks;
				}
			},
			{ revalidate: false }
		);
	};

	const onSearch = async (
		valueOfSearch: string | number | boolean | object | Date
	) => {
		const deck = await getOneRow(
			"decks",
			userContext!.user!.id,
			"name",
			valueOfSearch.toString()
		);
		setDecks([deck]);
	};

	if (!session) {
		return;
	}

	return (
		<div className="wraper-boxes">
			<div className="container-navbar">
				<Navbar />
			</div>
			<div className="boxes">
				<div className="boxes-header">
					<h2>Cajas de Leitner</h2>
					<InputSearch placeholder="¿Qué mazo buscas?" onSubmit={onSearch} />
					<button onClick={onClick}>Añadir Mazo</button>
				</div>
				<div
					className="boxes-content"
					ref={boxContentRef}
					onScroll={handleScroll}
				>
					{isLoading ? (
						<>
							<SkeletonCard />
							<SkeletonCard />
							<SkeletonCard />
							<SkeletonCard />
							<SkeletonCard />
							<SkeletonCard />
							<SkeletonCard />
						</>
					) : (
						decks?.flat().map(deck => (
							<Box
								id={deck.id ?? deck.user_id}
								key={deck.id}
								nameOfDeck={deck.name}
								description={deck.description && deck.description}
								numberOfCards={10}
								decks={decks!}
								// setDecks={setDecks}
								setEditAlertVisible={setIsEditAlertOpen}
								setDeleteAlertVisible={setIsDeleteAlertOpen}
							/>
						))
					)}
				</div>
			</div>

			<Modal isOpen={isAddModalOpen} setIsModalOpen={setIsAddModalOpen}>
				<h2 className="add-header">Crear Nuevo Mazo</h2>
				<Form
					fields={fields}
					schema={schema}
					labelButton="Añadir Mazo"
					onSubmit={onSubmit}
					error={errorAddDeck}
					isModalOpen={isAddModalOpen}
					setIsModalOpen={setIsAddModalOpen}
					setAlertVisible={setIsAlertVisible}
				/>
			</Modal>

			<Toast
				message="Deck añadido correctamente,
							agregarle tarjetas y comenzar a estudiar. 📚🔥"
				duration={5000}
				type="success"
				onClose={() => setIsAlertVisible(false)}
				isVisible={isAlertVisible}
			/>
			<Toast
				message="Deck actualizado con éxito. 🎉"
				duration={5000}
				type="success"
				onClose={() => setIsEditAlertOpen(false)}
				isVisible={isEditAlertOpen}
			/>
			<Toast
				message="🗑️ Has eliminado el deck con éxito."
				duration={5000}
				type="success"
				onClose={() => setIsDeleteAlertOpen(false)}
				isVisible={isDeleteAlertOpen}
			/>
		</div>
	);
}
