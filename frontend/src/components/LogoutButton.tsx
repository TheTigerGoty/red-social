import { Button } from "@chakra-ui/react"
import { useSetRecoilState } from "recoil"
import userAtom from "../atoms/userAtom"
import useShowToast from '../hooks/useShowToast';

//!---------------------------------------------------------------------------------!//

const LogoutButton: React.FC = () => {

    const setUser = useSetRecoilState(userAtom);
    const ShowToast = useShowToast();

    //*---------------------------------------------------------------------------------*//

    const handleLogout = async () => {
        try {
            localStorage.removeItem('user-threads');

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

            localStorage.removeItem('user-threads');
            setUser(null);
        } catch (error) {
            ShowToast('Error', (error as string), 'error')
        }
    }

    //!---------------------------------------------------------------------------------!//

    return (
        <Button position={'fixed'} top={'30px'} right={'30px'} size={'sm'} onClick={handleLogout}>
            Cerrar Sesion
        </Button>
    )
}

export default LogoutButton