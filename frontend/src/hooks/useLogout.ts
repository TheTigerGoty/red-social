import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from './useShowToast';

//!---------------------------------------------------------------------------------!//

const useLogout = () => {

    const setUser = useSetRecoilState(userAtom);
    const ShowToast = useShowToast()

    //*---------------------------------------------------------------------------------*//

    const logout = async () => {
        try {
            const res = await fetch('/api/users/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            // console.log(data);

            if (data.error) {
                ShowToast('Error', data.error, 'error')
                return;
            }

            localStorage.removeItem('user-threads'); // Remueve 'user-threads' de LocalStorage

            if (setUser) {
                setUser(null);
            }
        } catch (error) {
            ShowToast('Error', (error as string), 'error')
        }
    }

    //!---------------------------------------------------------------------------------!//

    return logout;
}

//!---------------------------------------------------------------------------------!//

export default useLogout