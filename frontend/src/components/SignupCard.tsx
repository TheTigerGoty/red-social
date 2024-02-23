'use client'

import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
} from '@chakra-ui/react'
import { ChangeEvent, useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import authScreenAtom from '../atoms/authAtom'
import { useSetRecoilState } from 'recoil'
import useShowToast from '../hooks/useShowToast'
import userAtom from '../atoms/userAtom'

//!---------------------------------------------------------------------------------!//

export default function SignupCard() {

    const [showPassword, setShowPassword] = useState(false);
    const setAuthScreen = useSetRecoilState(authScreenAtom);
    const [inputs, setInputs] = useState({
        name: '',
        username: '',
        email: '',
        password: ''
    });
    const { name, username, email, password } = inputs;
    const showToast = useShowToast();
    const setUser = useSetRecoilState(userAtom); 

    //*---------------------------------------------------------------------------------*//

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: value });
    };

    //*---------------------------------------------------------------------------------*//

    const handleSignup = async () => {
        // console.log(inputs);
        try {
            const res = await fetch('/api/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inputs)
            });
            const data = await res.json();
            // console.log(data);
            if (data.error) {
                showToast('Error', data.error, 'error');
                return;
            }

            localStorage.setItem('user-threads', JSON.stringify(data));
            setUser(data);
        } catch (error) {
            showToast('Error', (error as string), 'error')
        }
    };

    //!---------------------------------------------------------------------------------!//

    return (
        <Flex align={'center'} justify={'center'} >
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Sign up
                    </Heading>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.dark')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <HStack>
                            <Box>
                                <FormControl isRequired>
                                    <FormLabel>Nombre Completo</FormLabel>
                                    <Input
                                        type="text"
                                        value={name}
                                        name="name"
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </Box>
                            <Box>
                                <FormControl isRequired>
                                    <FormLabel>Nombre de Usuario</FormLabel>
                                    <Input
                                        type="text"
                                        value={username}
                                        name="username"
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </Box>
                        </HStack>
                        <FormControl isRequired>
                            <FormLabel>Correo Electronico</FormLabel>
                            <Input
                                type="email"
                                value={email}
                                name="email"
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Contraseña</FormLabel>
                            <InputGroup>
                                <Input
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
                        <Stack spacing={10} pt={2}>
                            <Button
                                loadingText='Submitting'
                                size='lg'
                                bg={useColorModeValue("gray.600", "gray.700")}
                                color={"white"}
                                _hover={{
                                    bg: useColorModeValue("gray.700", "gray.800"),
                                }}
                                onClick={handleSignup}
                            >
                                Registrate
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={'center'}>
                                ¿Estas Registrado? <Link color={'blue.400'} onClick={() => setAuthScreen('login')}>Ingresa</Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    )
}