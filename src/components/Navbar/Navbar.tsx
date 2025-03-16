import "./Navbar.css";
import Dropdown from "../Dropdown/Dropdown";
import ButtonSections from "../ButtonSections/ButtonSections";
import { GoHomeFill } from "react-icons/go";
import { BsFillInboxesFill } from "react-icons/bs";
import { PiCardsFill } from "react-icons/pi";
import { FaUserEdit } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { useState, useEffect } from "react";
import { supabase } from "@/supabase/client";
import { useNavigate } from "react-router";

export default function Navbar() {
	const [isMobileView, setIsMobileView] = useState(
		window.innerWidth >= 320 && window.innerWidth <= 767
	);
	const [isTabletView, setIsTabletView] = useState(window.innerWidth <= 1023);

	const navigate = useNavigate();

	useEffect(() => {
		const handleResize = () => {
			setIsMobileView(window.innerWidth >= 320 && window.innerWidth <= 767);
			setIsTabletView(window.innerWidth <= 1023);
		};

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const onSignOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error.name, error.message);
		} else {
			navigate("/login");
		}
	};

	return (
		<div className={isMobileView ? "navbar navbar-mobile" : "navbar"}>
			<div className="container-logo">Logo</div>
			{!isTabletView && <ButtonSections />}
			{isTabletView ? (
				<Dropdown
					nameVisibility={false}
					arrowVisibility={false}
					className={isMobileView ? "dropdown modibleDropdown" : "dropdown"}
					isMobileIcon={isMobileView ? true : false}
				>
					<li className="dropdown-li-item">
						<GoHomeFill className="dropdown-icon-item" />
						Home
					</li>
					<li className="dropdown-li-item">
						<BsFillInboxesFill className="dropdown-icon-item" />
						Boxes
					</li>
					<li className="dropdown-li-item">
						<PiCardsFill className="dropdown-icon-item" />
						Rewiews
					</li>
					<li className="dropdown-li-item">
						<hr />
					</li>
					<li className="dropdown-li-item">
						{" "}
						<FaUserEdit className="dropdown-icon-item" />
						Perfil
					</li>
					<li className="dropdown-li-item" onClick={onSignOut}>
						<IoMdLogOut className="dropdown-icon-item" />
						Cerrar sesion
					</li>
				</Dropdown>
			) : (
				<Dropdown isMobileIcon={isMobileView ? true : false}>
					<li className="dropdown-li-item-notebook">Perfil</li>
					<li className="dropdown-li-item-notebook" onClick={onSignOut}>
						Cerrar sesion
					</li>
				</Dropdown>
			)}
		</div>
	);
}
