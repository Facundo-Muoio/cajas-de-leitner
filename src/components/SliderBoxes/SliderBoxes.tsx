import React from "react";
import "./SliderBoxes.css";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { useRef } from "react";

type side = "left" | "right";

export default function SliderBoxes({
	children,
}: {
	children: React.ReactNode;
}) {
	const sliderRef = useRef<HTMLDivElement | null>(null);

	const handlerClick = (side: side) => {
		console.log("click");
		if (sliderRef.current) {
			console.log("entre");
			const scrollAmount = sliderRef.current.clientWidth * 0.5;
			sliderRef.current.scrollBy({
				left: side === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth",
			});
		}
	};

	return (
		<div className="slider-boxes">
			<h2 className="header-boxes">Cajas de Leitner</h2>
			<IoIosArrowBack
				className="slider-back-arrow"
				onClick={() => handlerClick("left")}
			/>
			<div className="boxes" ref={sliderRef}>
				{children}
			</div>
			<IoIosArrowForward
				className="slider-next-arrow"
				onClick={() => handlerClick("right")}
			/>
		</div>
	);
}
