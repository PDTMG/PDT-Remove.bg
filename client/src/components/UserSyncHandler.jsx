import { useAuth, useUser } from "@clerk/clerk-react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const UserSyncHandler = () => {
    const { isLoaded, isSignedIn, getToken } = useAuth();
    const { user } = useUser();
    const [synced, setSynced] = useState(false);
    const { backendUrl, loadUserCredit } = useContext(AppContext);
    useEffect(() => {
        const saveUser = async () => {
            if (!isLoaded || !isSignedIn || synced) return;

            try {
                const token = await getToken();
                const userData = {
                    clerkId: user.id,
                    email: user.primaryEmailAddress?.emailAddress,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    photoUrl: user.imageUrl
                };

                await axios.post(backendUrl + "/users", userData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setSynced(true);
                await loadUserCredit(); // Load user credits after syncing
            } catch (error) {
                console.error('Error syncing user:', error);
                toast.error('Failed to sync user data. Please try again later.');
            }
        }

        saveUser();
    }, [isLoaded, isSignedIn, getToken, user, synced, backendUrl]);

    return null;
};

export default UserSyncHandler;