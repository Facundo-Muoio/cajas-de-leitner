import "./Dashboard.css";
import Navbar from "../Navbar/Navbar";
import ProgressOverview from "../ProgressOverview/ProgressOverview";
import CardOverview from "../ProgressOverview/CardOverview/CardOverview";
import CardReview from "../Reviews/CardReview/CardReview";
import Reviews from "../Reviews/Reviews";
import SliderBoxes from "../SliderBoxes/SliderBoxes";
import CardBox from "../SliderBoxes/CardBox/CardBox";
import Streak from "../Streak/Streak";
import LearningProgress from "../LearningProgress/LearningProgress";
import Phrase from "../Phrase/Phrase";
import useAuth from "../Auth/Auth";

export default function Dashboard() {
	const { session } = useAuth();

	if (!session) {
		return;
	}

	return (
		<div className="container-dashboard">
			<Navbar />
			<ProgressOverview>
				<CardOverview label="Para revisar" key="Para revisar">
					<p className="content">15</p>
				</CardOverview>
				<CardOverview label="Aprendió" key="Aprendió">
					<p className="content">230</p>
				</CardOverview>
				<CardOverview label="Racha" key="Racha">
					<p className="content">7 días</p>
				</CardOverview>
				<CardOverview label="Exactitud" key="Exactitud">
					<p className="content">85%</p>
				</CardOverview>
			</ProgressOverview>
			<SliderBoxes>
				<CardBox nameOfBox="Matemáticas" numberOfCards={15} />
				<CardBox nameOfBox="Fisica" numberOfCards={8} />
				<CardBox nameOfBox="Historia" numberOfCards={22} />
				<CardBox nameOfBox="Química" numberOfCards={3} />
				<CardBox nameOfBox="Lengua" numberOfCards={45} />
				<CardBox nameOfBox="Filosofía" numberOfCards={1} />
				<CardBox nameOfBox="Arte" numberOfCards={6} />
				<CardBox nameOfBox="Ingles" numberOfCards={19} />
			</SliderBoxes>
			<Reviews>
				<CardReview
					dateTime="MAÑANA 04:10 PM"
					numbersOfRevisionCards={15}
					revisionName="Matemática"
				/>
				<CardReview
					dateTime="JUEVES 10:42 AM"
					numbersOfRevisionCards={8}
					revisionName="Fisica"
				/>
				<CardReview
					dateTime="VIERNES 12:13 AM"
					numbersOfRevisionCards={22}
					revisionName="Historia"
				/>
				<CardReview
					dateTime="DOMINIGO 11:35 PM"
					numbersOfRevisionCards={3}
					revisionName="Química"
				/>
			</Reviews>
			<div className="charts"></div>
			<LearningProgress />
			<Phrase />
			<Streak />
		</div>
	);
}
