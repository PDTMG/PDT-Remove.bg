import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { createContext, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext()

const AppContextProvider = (props) => {


    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [credit, setCredit] = useState(false);
    const { getToken } = useAuth();


    const loadUserCredit = async () => {
        try {
            const token = await getToken();
            const response = await axios.get(backendUrl + "/users/credits", {
                headers: { Authorization: `Bearer ${token}` }
            });


            if (response.data.success) {
                setCredit(response.data.data.credits);
            } else {
                toast.error("Failed to load user credits");
            }
        } catch (error) {
            console.error("Error loading credits:", error);
            toast.error("Failed to load user credits");
        }
    };


    const contextValue = {
        credit, setCredit,
        backendUrl,
        loadUserCredit
    }

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider;