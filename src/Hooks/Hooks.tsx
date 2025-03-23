import useSWR from "swr";
import { getAllRows } from "@/Helpers/Helpers";

const options = {
	revalidateOnFocus: true,
	revalidateOnReconnect: true,
	refreshInterval: 0,
};

function useSupabaseSWR(table: string) {
	return useSWR(table, getAllRows, options);
}

export { useSupabaseSWR };
