import { AddIcon } from "@chakra-ui/icons"
import { Button, CloseButton, Flex, FormControl, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import { useRef, useState } from "react"
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import userAtom from "../atoms/userAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useShowToast from "../hooks/useShowToast";
import { User } from "./UserHeader";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";

//!---------------------------------------------------------------------------------!//

const MAX_CHAR = 500;

//!---------------------------------------------------------------------------------!//

const CreatePost: React.FC = () => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [postText, setPostText] = useState('');
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const imageRef = useRef<HTMLInputElement>(null);
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const user = useRecoilValue<User | null>(userAtom);
    const showToast = useShowToast();
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useRecoilState(postsAtom);
    const {username} = useParams()


    //*---------------------------------------------------------------------------------*//

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputText = e.target.value; // Muestra el valor actual dentro del area del texto

        if (inputText.length > MAX_CHAR) { // Verifica si la longitud del texto supera el limite 'MAX_CHAR'
            const truncatedText = inputText.slice(0, MAX_CHAR); // Si supera el limite, truncarlo hasta lo maximo permitido
            setPostText(truncatedText); // Se establece el estado del texto con lo conseguido en 'truncatedText'
            setRemainingChar(0); // Establecer los caracteres a cero al llegar al maximo
        } else {
            setPostText(inputText); // Si el texto está dentro del límite, establecer el estado del texto
            setRemainingChar(MAX_CHAR - inputText.length) // Calcular y establecer el estado de caracteres restantes
        }
    }

    //*---------------------------------------------------------------------------------*//

    const handleCreatePost = async () => {

        setLoading(true)

        try {
            const res = await fetch('/api/posts/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ postedBy: user?._id, text: postText, img: imgUrl })
            });

            const data = await res.json();

            if (data.error) {
                showToast('Error', data.error, 'error');
                return;
            }

            showToast('Success', 'Publicacion creada correctamente', 'success');
            if (username === user?.username) {
                setPosts([data, ...posts]); // Se agregara el ultimo post creado hacia una copia de los posts
            }
            onClose();
            setPostText(''); // Limpia el estado del Texto
            setImgUrl(''); // Limpia el estado de la imagen
        } catch (error) {
            showToast('Error', (error as string), 'error')
        } finally {
            setLoading(false)
        }
    }

    //!---------------------------------------------------------------------------------!//

    return (
        <>
            <Button
                position={'fixed'}
                bottom={10}
                right={5}
                bg={useColorModeValue('gray.300', 'gray.dark')}
                onClick={onOpen}
                size={{ base: 'sm', sm: 'md' }}
            >
                <AddIcon />
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Crear Publicacion</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Textarea
                                placeholder="Pon el contenido de tu publicacion aqui :D"
                                onChange={handleTextChange}
                                value={postText}
                            />

                            <Text fontSize='xs' fontWeight='bold' textAlign={'right'} m={'1'} color={'gray.800'}>
                                {remainingChar}/{MAX_CHAR}
                            </Text>

                            <Input
                                type="file"
                                hidden
                                ref={imageRef}
                                onChange={handleImageChange}
                            />

                            <BsFillImageFill
                                style={{ marginLeft: '5px', cursor: 'pointer' }}
                                size={16}
                                onClick={() => imageRef.current?.click()}
                            />
                        </FormControl>

                        {imgUrl && (
                            <Flex mt={5} w={'full'} position={'relative'}>
                                <Image src={imgUrl} alt="Imagen seleccionada" />
                                <CloseButton
                                    onClick={() => {
                                        setImgUrl('')
                                    }}
                                    bg={'gray.800'}
                                    position={'absolute'}
                                    top={2}
                                    right={2}
                                />
                            </Flex>
                        )}

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading}>
                            Publicar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

//!---------------------------------------------------------------------------------!//

export default CreatePost