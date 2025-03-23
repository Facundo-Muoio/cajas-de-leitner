import "./Modal.css";
import { useRef, useEffect } from "react";
import { IoIosClose } from "react-icons/io";

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

	function closeModal() {
		if (ModalRef.current) {
			ModalRef.current.close();
			(
				ModalRef.current?.closest(".modal-container") as HTMLElement
			).style.display = "none";
		}
		setIsModalOpen(false);
	}

	useEffect(() => {
		if (isOpen && ModalRef.current) {
			(
				ModalRef.current?.closest(".modal-container") as HTMLElement
			).style.display = "block";
			ModalRef.current.showModal();
		}

		if (!isOpen && ModalRef.current) {
			ModalRef.current.close();
			(ModalRef.current?.parentNode as HTMLElement).style.display = "none";
			setIsModalOpen(false);
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				if (ModalRef.current) {
					ModalRef.current.close();
					(
						ModalRef.current?.closest(".modal-container") as HTMLElement
					).style.display = "none";
				}
				setIsModalOpen(false);
			}
		};
		document.addEventListener("keydown", handleKeyDown);

		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, setIsModalOpen]);

	const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
		if (e.target === ModalRef.current) {
			closeModal();
		}
	};

	return (
		<div className="modal-container">
			<dialog className="modal" ref={ModalRef} onClick={handleBackdropClick}>
				<button onClick={closeModal} className="close-modal">
					<IoIosClose />
				</button>
				<div className="modal-content">{children}</div>
			</dialog>
		</div>
	);
}
