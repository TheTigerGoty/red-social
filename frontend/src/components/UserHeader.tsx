import { Avatar, Box, Button, Flex, Link, Menu, MenuButton, MenuItem, MenuList, Portal, Text, VStack, useToast } from "@chakra-ui/react"
import { BsInstagram } from "react-icons/bs"
import { CgMoreO } from "react-icons/cg"
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from 'react-router-dom'
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";

//!---------------------------------------------------------------------------------!//

export interface User {
    _id: string;
    name: string;
    username: string;
    bio: string;
    followers: string[];
    profilePic?: string;
    email: string;
    password: string;
}

//*---------------------------------------------------------------------------------*//

interface UserHeaderProps {
    user: User | null;
} 

//!---------------------------------------------------------------------------------!//

const UserHeader: React.FC<UserHeaderProps> = ({ user }) => {

    const toast = useToast(); // TODO: Uso de la ventana emergente
    const currentUser = useRecoilValue(userAtom);
    const showToast = useShowToast();
    const [following, setFollowing] = useState(user?.followers.includes(currentUser?._id || '')); // Verifica si el usuario actual esta incluido en la lista de seguidores
    const [updating, setUpdating] = useState(false);

    //*---------------------------------------------------------------------------------*//

    const copyURL = () => { // TODO:  Logica para copiar la URL
        const currentURL: string = window.location.href;
        navigator.clipboard.writeText(currentURL).then(() => {
            toast({
                title: 'Cuenta Creada',
                status: 'success',
                description: 'Link del Pefil Copiado',
                duration: 3000,
                isClosable: true
            })
        })
    };

    //*---------------------------------------------------------------------------------*//

    const handleFollowUnFollow = async () => {

        if (!currentUser) { // Si el usaurio no esta autenticada se mostrara el siguiente mensaje cuando desea presionar los follows
            showToast('Error', 'Debes iniciar sesion para seguir a esta cuenta', 'error');
            return;
        } 

        if (updating) return; // Si hay actualizacion en curso la funcion de bloqueara para evitar solicitudes duplicadas

        setUpdating(true); 

        try {
            const res = await fetch(`/api/users/follow/${user?._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await res.json();

            if (data.error) {
                showToast('Error', data.error, 'error');
                return;
            };

            if (following) {
                showToast('Success', `Dejaste de seguir a ${user?.name}`, 'success');
                user?.followers.pop();
            } else {
                showToast('Success', `Empezaste a seguir a ${user?.name}`, 'success');
                user?.followers.push(currentUser?._id);
            }; // TODO: ESTO SOLO SIMULA, MAS NO ES A TIEMPO REAL

            setFollowing(!following); // Cambia el estado following al contrario de su valor actual. Si estaba siguiendo, ahora dejará de seguir, y viceversa.
        } catch (error) {
            showToast('Error', (error as string), 'error');
        } finally {
            setUpdating(false);
        }
    }

    //!---------------------------------------------------------------------------------!//

    return (
        <VStack gap={4} alignItems={'start'}>
            <Flex justifyContent={'space-between'} w={'full'}>
                <Box>
                    <Text fontSize={'2xl'} fontWeight={'bold'}>
                        {user?.name}
                    </Text>
                    <Flex gap={2} alignItems={'center'}>
                        <Text fontSize={'sm'}>{user?.username}</Text>
                        <Text fontSize={'xs'} bg={'gray.dark'} color={'gray.light'} p={1} borderRadius={'full'}>
                            threads.net
                        </Text>
                    </Flex>
                </Box>
                <Box>
                    {user?.profilePic && (
                        <Avatar
                            name={user.name}
                            src={user.profilePic}
                            size={{
                                base: 'md',
                                md: 'xl'
                            }} //TODO : MediaQuery del avatar del Usuario
                        />
                    )}
                    {!user?.profilePic && (
                        <Avatar
                            name={user?.name}
                            src='https://bit.ly/broken-link'
                            size={{
                                base: 'md',
                                md: 'xl'
                            }} //TODO : MediaQuery del avatar del Usuario
                        />
                    )}
                </Box>
            </Flex>

            <Text>{user?.bio}</Text>

            {currentUser?._id === user?._id && (
                <Link as={RouterLink} to="/update">
                    <Button size={'sm'}>Actualizar Perfil</Button>
                </Link>
            )}

            {currentUser?._id !== user?._id && (
                <Button size={'sm'} onClick={handleFollowUnFollow} isLoading={updating}>
                    {following ? 'Dejar de Seguir' : 'Seguir'}
                </Button>
            )}

            <Flex w={'full'} justifyContent={'space-between'}>
                <Flex gap={2} alignItems={'center'}>
                    <Text color={'gray.light'}>{user?.followers.length} seguidores</Text>
                    <Box w={1} h={1} bg={'gray.light'} borderRadius={'full'}></Box>
                    <Link color={'gray.light'}>instagram.com</Link>
                </Flex>

                <Flex>
                    <Box className="icon-container">
                        <BsInstagram size={24} cursor={'pointer'} />
                    </Box>
                    <Box className="icon-container">
                        <Menu>
                            <MenuButton>
                                <CgMoreO size={24} cursor={'pointer'} />
                            </MenuButton>
                            <Portal>
                                <MenuList bg={'gray.dark'}>
                                    <MenuItem bg={'gray.dark'} onClick={copyURL}>Copiar Link</MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                </Flex>
            </Flex>

            <Flex w={'full'}>
                <Flex flex={1} borderBottom={'1.5px solid white'} justifyContent={'center'} pb={'3'} cursor={'pointer'}>
                    <Text fontWeight={'bold'}>Threads</Text>
                </Flex>

                <Flex flex={1} borderBottom={'1.5px solid gray'} justifyContent={'center'} pb={'3'} color={'gray.light'} cursor={'pointer'}>
                    <Text fontWeight={'bold'}>Replies</Text>
                </Flex>
            </Flex>
        </VStack>
    )
}

//!---------------------------------------------------------------------------------!//

export default UserHeader