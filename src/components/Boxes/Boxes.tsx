import "./Boxes.css";
import { useState } from "react";
import Modal from "../Modal/Modal";

export default function Boxes({ children }: { children: React.ReactNode }) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<div className="wraper-boxes">
			<div className="boxes">
				<div className="boxes-header">
					<h2>Cajas de Leitner</h2>
					<button onClick={() => setIsModalOpen(true)}>Añadir Caja</button>
				</div>
				<div className="boxes-content">{children}</div>
			</div>
			<Modal isOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
				<form>
					<input type="text" name="name" />
					<label htmlFor="name"></label>
					<input type="text" name="description" />
					<label htmlFor="description"></label>
				</form>
			</Modal>
		</div>
	);
}
