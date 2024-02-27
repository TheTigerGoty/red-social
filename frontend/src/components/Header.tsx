import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import userAtom from "../atoms/userAtom"
import { AiFillHome } from "react-icons/ai"
import { Link as RouterLink } from 'react-router-dom'
import { RxAvatar } from "react-icons/rx"
import useLogout from "../hooks/useLogout"
import authScreenAtom from "../atoms/authAtom"

//!---------------------------------------------------------------------------------!//

const Header: React.FC = () => {

    const { colorMode, toggleColorMode } = useColorMode()
    const user = useRecoilValue(userAtom);
    const logout = useLogout();
    const setAuthScreen = useSetRecoilState(authScreenAtom)

    //!---------------------------------------------------------------------------------!//

    return (
        <Flex justifyContent={'space-between'} mt={6} mb='12'>

            {user && (
                <Link as={RouterLink} to='/'>
                    <AiFillHome size={24} />
                </Link>
            )}

            {!user && (
                <Link as={RouterLink} to={'/auth'} onClick={() => setAuthScreen('login')}>
                    Ingresar
                </Link>
            )}

            <Image
                cursor={'pointer'}
                alt="logo"
                w={6}
                src={colorMode === 'dark' ? '/light-logo.svg' : '/dark-logo.svg'}
                onClick={toggleColorMode}
            />

            {user && (
                <Flex alignItems={'center'} gap={4}>
                    <Link as={RouterLink} to={`/${user.username}`}>
                        <RxAvatar size={24} />
                    </Link>

                    <Button size={'xs'} onClick={logout}>
                        Cerrar Sesion
                    </Button>
                </Flex>
            )}

            {!user && (
                <Link as={RouterLink} to={'/auth'} onClick={() => setAuthScreen('signup')}>
                    Registrarse
                </Link>
            )}
        </Flex>
    )
}

//!---------------------------------------------------------------------------------!//

export default Header