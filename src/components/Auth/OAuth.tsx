import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import { Session } from "@supabase/supabase-js";

export function OAuth() {
	const [session, setSession] = useState<Session | null>(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data, error }) => {
			if (error) {
				console.error("Error getting session:", error.message);
				setSession(null);
			} else {
				setSession(data.session);
			}
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) =>
			setSession(session)
		);

		return () => subscription.unsubscribe();
	}, []);

	return session;
}
