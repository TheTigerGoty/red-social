import { Flex, Spinner } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import { Reply } from "../components/Comment";

//!---------------------------------------------------------------------------------!//

export interface PostType {
    _id: string;
    text: string;
    img?: string;
    createdAt: string;
    replies: Reply[]
    likes: string[];
    postedBy: string;
};

//!---------------------------------------------------------------------------------!//

const HomePage: React.FC = () => {

    const [posts, setPosts] = useRecoilState(postsAtom);
    const [loading, setLoading] = useState(true);
    const showToast = useShowToast();

    //*---------------------------------------------------------------------------------*//

    useEffect(() => {
        const getFeedPosts = async () => {

            setLoading(true) // Se establece el estado de cargando
            setPosts([]); // Antes de cada solicitud se limpiara el estado de los posts, para evitar renderiar datos antiguos

            try {
                const res = await fetch('/api/posts/feed'); // Solicitud HTTP
                const data = await res.json(); // Parseo de respuesta JSON
                // console.log(data);

                if (data.error) {
                    showToast('Error', data.error, 'error');
                    return;
                }

                setPosts(data) // Actualiza el estado de los 'Post' con los datos obtenidos
            } catch (error) {
                showToast('Error', (error as Error).message, 'error')
            } finally {
                setLoading(false) // Se deja de establecer el estado de cargando independiente de lo que haya sucedido
            }
        };
        getFeedPosts();
    }, [showToast, setPosts]);

    //!---------------------------------------------------------------------------------!//

    return (
        <>
            {!loading && posts.length === 0 && <h1>Sigue a mas usuarios para ver sus contenidos :3</h1>}
            {/* Si ya no hay carga y no encuentra ningun 'post' mostrara el mensaje */}

            {loading && (
                <Flex justify='center'>
                    <Spinner size='xl' />
                </Flex>
            )}

            {posts.map((post) => (
                <Post key={post._id} post={post} postedBy={post.postedBy} /> //postedBy es un identificador de usuario
            ))}
        </>
    )
}

//!---------------------------------------------------------------------------------!//

export default HomePage