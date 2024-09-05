import buildAxiosClient from "@/app/helpers/build-axios-client";
import {CurrentUserInterface} from "@/app/layout";


async function getAuth(): Promise<CurrentUserInterface | undefined> {
    const axiosClient = buildAxiosClient();

    try {
        const response = await axiosClient.get("/api/users/currentuser");
        return response.data.currentUser;
    } catch (error) {
        console.error(error);
        return undefined // Handle error or no auth state
    }
}

export default async function Home() {
    const auth = await getAuth();
    console.log('Home ', auth);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {auth ? "You are signed" : "You are not signed in"}
        </main>
    );
}
