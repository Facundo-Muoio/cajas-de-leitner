import "./AlertForm.css";

export default function AlertForm({
	children,
	title,
	message,
}: {
	ref: React.RefObject<HTMLDivElement | null>;
	title: string;
	message: string;
	children?: React.ReactNode;
}) {
	return (
		<div className="container-alert-form">
			{children}
			<h2>{title}</h2>
			<p>{message}</p>
		</div>
	);
}
