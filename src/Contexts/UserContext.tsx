import { supabase } from "@/supabase/client";
import { User } from "@supabase/supabase-js";
import { createContext, useState, useEffect } from "react";

interface InterUserContext {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Definimos el contexto con un tipo que acepta User o null
const UserContext = createContext<InterUserContext | null>(null);

export function UserContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const getUser = async () => {
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();
			if (error) {
				console.error(error.message);
			}
			if (user) {
				setUser(user);
			}
		};

		getUser();
	}, []);

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
}

export { UserContext };
