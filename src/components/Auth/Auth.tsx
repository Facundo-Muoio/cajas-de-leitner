import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "@/supabase/client";
import { Session } from "@supabase/supabase-js";

export default function useAuth() {
	const [session, setSession] = useState<Session | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const checkSession = async () => {
			const { data, error } = await supabase.auth.getSession();

			if (error) {
				console.error(error);
			}

			if (!data.session) {
				navigate("/login");
			}

			if (!error && data.session) {
				setSession(data.session);
			}
		};

		checkSession();

		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setSession(session);
			}
		);

		return () => listener.subscription.unsubscribe();
	}, [navigate]);

	return { session };
}
