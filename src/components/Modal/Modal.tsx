import "./Modal.css";
import { useRef } from "react";

interface ModalProps {
	isOpen: boolean;
	setIsModalOpen: (isOpen: boolean) => void;
	children: React.ReactNode;
}

export default function Modal({
	children,
	isOpen,
	setIsModalOpen,
}: ModalProps) {
	const ModalRef = useRef<HTMLDialogElement | null>(null);

	console.log(isOpen);

	if (isOpen && ModalRef.current) {
		ModalRef.current.showModal();
	}

	function closeModal() {
		if (ModalRef.current) {
			ModalRef.current.close();
		}
		setIsModalOpen(false);
	}

	const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
		if (e.target === ModalRef.current) {
			closeModal();
		}
	};

	return (
		<div className="modal-container">
			<dialog className="modal" ref={ModalRef} onClick={handleBackdropClick}>
				<div className="modal-content">{children}</div>
				<button onClick={closeModal} className="close-modal">
					Cerrar
				</button>
			</dialog>
		</div>
	);
}
