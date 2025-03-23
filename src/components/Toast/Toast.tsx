import "./Toast.css";
import { useEffect, useLayoutEffect, useRef } from "react";
import { IoIosClose } from "react-icons/io";

interface ToastProps {
	isVisible: boolean;
	message: string;
	type?: "success" | "error" | "info";
	duration?: number;
	onClose: () => void;
}

export default function Toast({
	isVisible,
	message,
	type = "info",
	duration = 3000,
	onClose,
}: ToastProps) {
	const toastRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (toastRef.current) {
			toastRef.current.style.display = isVisible ? "flex" : "none";
		}
	}, [isVisible]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (onClose) onClose();
		}, duration);

		return () => clearTimeout(timer);
	}, [duration, onClose]);

	return (
		<div
			className={`toast ${type} ${isVisible ? "show" : "hide"}`}
			ref={toastRef}
		>
			<p className="message-toast">{message}</p>
			<button className="close-btn-toast" onClick={onClose}>
				<IoIosClose className="close-icon-toast" />
			</button>
		</div>
	);
}
