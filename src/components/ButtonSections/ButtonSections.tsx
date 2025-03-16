import "./ButtonSections.css";
import { GoHomeFill } from "react-icons/go";
import { BsFillInboxesFill } from "react-icons/bs";
import { PiCardsFill } from "react-icons/pi";

export default function ButtonSections() {
	return (
		<ul className="sections-ul">
			<li className="navbar-li">
				<GoHomeFill />
				Home
			</li>
			<li className="navbar-li">
				<BsFillInboxesFill />
				Boxes
			</li>
			<li className="navbar-li">
				<PiCardsFill />
				Rewiews
			</li>
		</ul>
	);
}
