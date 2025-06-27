import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { createContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext()

const AppContextProvider = (props) => {


    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [credit, setCredit] = useState(false);
    const { getToken } = useAuth();
    const [image, setImage] = useState(false);
    const [resultImage, setResultImage] = useState(false);
    const { isSignedIn } = useUser();
    const { openSignIn } = useClerk();
    const navigate = useNavigate();
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
    const removeBg = async (selectedImage) => {
        try {
            if (!isSignedIn) {
                return openSignIn();
            }
            setImage(selectedImage);
            setResultImage(false);
            //navigate
            navigate("/result");

            const token = await getToken();
            const formData = new FormData();
            selectedImage && formData.append("file", selectedImage);
            const { data: base64Image } = await axios.post(
                `${backendUrl}/images/remove-background`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setResultImage(`data:image/png;base64,${base64Image}`);
            setCredit(credit - 1);
        } catch (error) {
            console.error("Error removing background:", error);
            if (error.response?.data) {
                toast.error(error.response.data?.message || "Failed to remove background");
                console.log("Server response:", error.response.data);
            } else {
                toast.error("Failed to remove background");
            }
        }

    }

    const contextValue = {
        credit, setCredit,
        image, setImage,
        resultImage, setResultImage,
        backendUrl,
        loadUserCredit,
        removeBg
    }

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider;