import LoginCard from "../components/LoginCard"
import SignupCard from "../components/SignupCard"
import authScreenAtom from '../atoms/authAtom';
import { useRecoilValue } from "recoil";

//!---------------------------------------------------------------------------------!//

const AuthPage: React.FC = () => {
    
    const authScreenState = useRecoilValue(authScreenAtom);

    //!---------------------------------------------------------------------------------!//

    return (
        <>
            {authScreenState === 'login' ? <LoginCard /> : <SignupCard />}
        </>
    )
}

//!---------------------------------------------------------------------------------!//

export default AuthPage