import { Avatar, Box, Flex, Link, Menu, MenuButton, MenuItem, MenuList, Portal, Text, VStack, useToast } from "@chakra-ui/react"
import { BsInstagram } from "react-icons/bs"
import { CgMoreO } from "react-icons/cg"

//!---------------------------------------------------------------------------------!//

const UserHeader: React.FC = () => {

    const toast = useToast(); // TODO: Uso de la ventana emergente

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
    }

    //!---------------------------------------------------------------------------------!//

    return (
        <VStack gap={4} alignItems={'start'}>
            <Flex justifyContent={'space-between'} w={'full'}>
                <Box>
                    <Text fontSize={'2xl'} fontWeight={'bold'}>
                        TheTigerGod
                    </Text>
                    <Flex gap={2} alignItems={'center'}>
                        <Text fontSize={'sm'}>thetigergod</Text>
                        <Text fontSize={'xs'} bg={'gray.dark'} color={'gray.light'} p={1} borderRadius={'full'}>
                            threads.net
                        </Text>
                    </Flex>
                </Box>
                <Box>
                    <Avatar
                        name="Castro Barrera"
                        src="/zuck-avatar.png"
                        size={{
                            base: 'md',
                            md: 'xl'
                        }} //TODO : MediaQuery del avatar del Usuario
                    />
                </Box>
            </Flex>

            <Text>Co-funder, executive chairman and CEO of Meta Platsforms.</Text>
            <Flex w={'full'} justifyContent={'space-between'}>
                <Flex gap={2} alignItems={'center'}>
                    <Text color={'gray.light'}>3.2K followers</Text>
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
                                    <MenuItem bg={'gray.dark'} onClick={copyURL}>Copy Link</MenuItem>
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