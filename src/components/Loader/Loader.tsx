export default function Loader({
	size = "30",
	stroke = "5",
	speed = "0.9",
	color = "black",
}) {
	return (
		<l-tailspin
			size={size}
			stroke={stroke}
			speed={speed}
			color={color}
		></l-tailspin>
	);
}
