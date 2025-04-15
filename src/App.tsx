import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Signup from "./components/Signup.tsx/Signup";
import Dashboard from "./components/Dashboard/Dashboard";
import ConfirmEmail from "./components/ConfirmEmail/ConfirmEmail";
import Login from "./components/Login/Login";
import ResetPasswordForm from "./components/ResetPasswordForm/ResetPasswordForm";
import UpdatePassword from "./components/UpdatePassword/UpdatePassword";
import Decks from "./components/Decks/Decks";
import { UserContextProvider } from "./Contexts/UserContext";
import DecksProvider from "./Contexts/DecksContext";
import Flashcards from "./components/Flashcards/Flashcards";
import FlashcardsProvider from "./Contexts/FlashcardsContext";
import AddFlashcardform from "./components/FlashcardForm/AddFlashcardForm/AddFlashcardForm";
import EditFlashcardForm from "./components/FlashcardForm/EditFlashcardForm/EditFlashcardForm";
import AlertsFlashcardsProvider from "./Contexts/AlertsFlashcards";
import SkeletonFlashcards from "./components/SkeletonFlashcards/SkeletonFlashcards";
import PanelRevisions from "./components/PanelRevisions/PanelReviews";
import ViewRevisionBox from "./components/ViewRevisionBox/ViewRevisionBox";

function App() {
	return (
		<>
			<UserContextProvider>
				<BrowserRouter>
					<DecksProvider>
						<FlashcardsProvider>
							<AlertsFlashcardsProvider>
								<Routes>
									<Route path="/login" element={<Login />} />
									<Route path="/signup" element={<Signup />} />
									<Route
										path="/reset-password"
										element={<ResetPasswordForm />}
									/>
									<Route path="/update-password" element={<UpdatePassword />} />
									<Route path="/confirm-user" element={<ConfirmEmail />} />

									<Route path="/dashboard" element={<Dashboard />} />
									<Route path="/decks" element={<Decks />} />
									<Route
										path="/deck/:deck_id/flashcards"
										element={<Flashcards />}
									/>
									<Route
										path="/deck/:deck_id/flashcards/add"
										element={<AddFlashcardform />}
									/>
									<Route
										path="/deck/:deck_id/flashcard/:id/edit"
										element={<EditFlashcardForm />}
									/>
									<Route path="/revisions" element={<PanelRevisions />} />
									<Route
										path="/deck/:deck_id/flashcards/revisions/box/:box_level"
										element={<ViewRevisionBox />}
									/>
									<Route path="/demo" element={<SkeletonFlashcards />} />
								</Routes>
							</AlertsFlashcardsProvider>
						</FlashcardsProvider>
					</DecksProvider>
				</BrowserRouter>
			</UserContextProvider>

			{/* <LayoutAccount
				src="./src/assets/images/tree-primary.webp"
				alt="arbol con hojas y notas"
			/> */}
			{/* <Dashboard /> */}
			{/* <Boxes>
				<Box
					nameOfBox="Matemática"
					numberOfCards={15}
					description="Un repaso sobre trigonometría fundamental"
				/>
				<Box
					nameOfBox="Química"
					numberOfCards={10}
					description="Formación de sales y ácidos"
				/>
				<Box
					nameOfBox="Física"
					numberOfCards={15}
					description="Estudo de la cinemática"
				/>
				<Box
					nameOfBox="Lengua"
					numberOfCards={15}
					description="Obras literarias modernas"
				/>
			</Boxes> */}
		</>
	);
}

export default App;
