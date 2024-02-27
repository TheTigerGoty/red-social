import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Avatar,
    Center,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react'
import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import usePreviewImg from '../hooks/usePreviewImg';
import useShowToast from '../hooks/useShowToast';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

//!---------------------------------------------------------------------------------!//

interface Inputs {
    name: string;
    username: string;
    email: string;
    bio: string;
    password: string;
}

//!---------------------------------------------------------------------------------!//

export default function UpdateProfilePage() {

    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useRecoilState(userAtom);
    const [inputs, setInputs] = useState<Inputs>({
        name: user?.name || '',
        username: user?.username || '',
        email: user?.email || '',
        bio: user?.bio || '',
        password: user?.password || ''
    });
    const { name, username, email, bio, password } = inputs;
    const fileRef = useRef<HTMLInputElement>(null);
    const [updating, setUpdating] = useState(false);
    const showToast = useShowToast();
    const { handleImageChange, imgUrl } = usePreviewImg();
    // console.log(user);

    //*---------------------------------------------------------------------------------*//

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: value });
    };

    //*---------------------------------------------------------------------------------*//

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault(); // Prevenir el comportamiento de 'enviar' del formulario

        if (updating) return; // Si se encuentra 'updating' salirse de la funcion para evitar duplicidad
        setUpdating(true); // Se stablece 'true' para indicar 'updating' en curso

        try {
            const res = await fetch(`/api/users/update/${user?._id}`, { // Solicitudad HTTTP
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...inputs, profilePic: imgUrl }) //  Enviar datos en formato JSON incluyendo los 'inputs' y la URL de la imagen de perfil
            });

            const data = await res.json(); // Actualizar el objeto de usuario 

            if (data.error) {
                showToast('Error', data.error, 'error');
                return;
            }
            showToast('Success', 'Perfil Actualizado Correctamente', 'success');

            setUser(data); // Actualizar el estado del Usuario
            localStorage.setItem('user-threads', JSON.stringify(data)); // Almacenar los datos localmente
        } catch (error) {
            showToast('Error', (error as string), 'error')
        } finally { // Ya sea exitosa o no la solicitud, dejar de 'updating'
            setUpdating(false);
        }
    }

    //!---------------------------------------------------------------------------------!//

    return (
        <form onSubmit={handleSubmit}>
            <Flex
                align={'center'}
                justify={'center'}
                my={6}
            >
                <Stack
                    spacing={4}
                    w={'full'}
                    maxW={'md'}
                    bg={useColorModeValue('white', 'gray.dark')}
                    rounded={'xl'}
                    boxShadow={'lg'}
                    p={6}
                >
                    <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                        Editar Perfil
                    </Heading>
                    <FormControl id="userName">
                        <Stack direction={['column', 'row']} spacing={6}>
                            <Center>
                                <Avatar size="xl" boxShadow={'md'} src={imgUrl || user?.profilePic} />
                            </Center>
                            <Center w="full">
                                <Button w="full" onClick={() => fileRef.current?.click()}>Cambiar Imagen</Button>
                                <Input type='file' hidden ref={fileRef} onChange={handleImageChange} />
                            </Center>
                        </Stack>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Nombre Completo</FormLabel>
                        <Input
                            value={name}
                            name="name"
                            onChange={handleChange}
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                        />
                    </FormControl>
                    <FormControl >
                        <FormLabel>Nombre de Usuario</FormLabel>
                        <Input
                            value={username}
                            name="username"
                            onChange={handleChange}
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                        />
                    </FormControl>
                    <FormControl >
                        <FormLabel>Correo Electronico</FormLabel>
                        <Input
                            value={email}
                            name="email"
                            onChange={handleChange}
                            _placeholder={{ color: 'gray.500' }}
                            type="email"
                        />
                    </FormControl>
                    <FormControl >
                        <FormLabel>Biografia</FormLabel>
                        <Input
                            placeholder='Pon algo interesante :3'
                            value={bio}
                            name="bio"
                            onChange={handleChange}
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                        />
                    </FormControl>
                    <FormControl >
                        <FormLabel>Contraseña</FormLabel>
                        <InputGroup>
                            <Input
                                placeholder='Pon algo nuevo esta vez'
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                name="password"
                                onChange={handleChange}
                            />
                            <InputRightElement h={'full'}>
                                <Button
                                    variant={'ghost'}
                                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <Stack spacing={6} direction={['column', 'row']}>
                        <Button
                            bg={'red.400'}
                            color={'white'}
                            w="full"
                            _hover={{
                                bg: 'red.500',
                            }}>
                            Cancel
                        </Button>
                        <Button
                            bg={'green.400'}
                            color={'white'}
                            w="full"
                            _hover={{
                                bg: 'blue.500',
                            }}
                            type='submit'
                            isLoading={updating}
                        >
                            Submit
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </form>
    )
}