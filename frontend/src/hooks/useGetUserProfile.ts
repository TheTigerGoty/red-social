import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";
import { User } from "../components/UserHeader";

//!---------------------------------------------------------------------------------!//

const useGetUserProfile = () => {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { username } = useParams<{ username: string }>(); // Obtener de la URL el 'username'
    const showToast = useShowToast();

    //*---------------------------------------------------------------------------------*//\

    useEffect(() => {

        const getUser = async () => {
            try {
                const res = await fetch(`/api/users/profile/${username}`);
                const data = await res.json();

                if (data.error) {
                    showToast('Error', data.error, 'error');
                    return;
                };

                setUser(data);
            } catch (error) {
                showToast('Error', (error as string), 'error');
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, [username, showToast])

    //*---------------------------------------------------------------------------------*//\

    return { loading, user }
}

//!---------------------------------------------------------------------------------!//

export default useGetUserProfile