import "./Dropdown.css";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";

interface DropdownProps {
	userImage?: string;
	name?: string;
	children: React.ReactNode;
	nameVisibility?: boolean;
	arrowVisibility?: boolean;
	className?: string;
	isMobileIcon?: boolean;
}

export default function Dropdown({
	userImage,
	name = "Facundo Muoio",
	children,
	nameVisibility = true,
	arrowVisibility = true,
	className,
	isMobileIcon = false,
}: DropdownProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isFirstRender, setIsFirstRender] = useState(true);

	const handlerClick = () => {
		setIsOpen(!isOpen);
		setIsFirstRender(false);
	};

	return (
		<div className={className ? className : "dropdown"}>
			{isMobileIcon ? (
				<RxHamburgerMenu
					className={`user-icon ${!nameVisibility && "user-icon-lonely"}`}
					onClick={handlerClick}
				/>
			) : userImage ? (
				<img src={userImage} onClick={handlerClick}></img>
			) : (
				<FaUserCircle
					className={`user-icon ${!nameVisibility && "user-icon-lonely"}`}
					onClick={handlerClick}
				/>
			)}
			<button className="dropdown-button" onClick={handlerClick}>
				{nameVisibility && name}
				<span className={`${isOpen ? "up" : isFirstRender ? "" : "down"}`}>
					{arrowVisibility && <IoIosArrowDown className="dropdown-arrow" />}
				</span>
			</button>

			<ul className={`${isOpen ? "open" : isFirstRender ? "" : "closed"}`}>
				{children}
			</ul>
		</div>
	);
}
