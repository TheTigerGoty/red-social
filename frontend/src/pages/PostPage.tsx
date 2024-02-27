import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from "@chakra-ui/react"
import Actions from "../components/Actions"
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useEffect } from "react";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/postsAtom";

//!---------------------------------------------------------------------------------!//

const PostPage = () => {

  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom)
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const currentPost = posts[0];

  //*---------------------------------------------------------------------------------*//\

  useEffect(() => {

    const getPost = async () => {
       
      setPosts([]); // Antes de cada solicitud se limpiara el estado de los posts, para evitar renderiar datos antiguos

      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();

        if (data.error) {
          showToast('Error', data.error, 'error');
          return;
        };

        setPosts([data]); // Se actualiza el estado de los posts con el nuevo post obtenido
      } catch (error) {
        showToast('Error', (error as Error).message, 'error'); 
      }
    }

    getPost();
  }, [showToast, pid, setPosts]) // Se renderizara cada vez que haya un cambion en showToast | pid | setPosts

  //*---------------------------------------------------------------------------------*//\

  const handleDeletePost = async () => {
    try {
      if (!window.confirm('Estas seguro de eliminar esta publicacion?')) return; // Aparecera una ventana de confirmacion

      const res = await fetch(`/api/posts/${currentPost?._id}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (data.error) {
        showToast('Error', data.error, 'error');
        return;
      }

      showToast('Success', 'Publicacion Eliminada', 'success');
      navigate(`/${user?.username}`) // Despues de una correcta ejecucion se llevara al pefil del usuario
    } catch (error) {
      showToast('Error', (error as Error).message, 'error');
    }
  }

  //*---------------------------------------------------------------------------------*//\

  if (!user && loading) {
    return (
      <Flex justifyContent={'center'}>
        <Spinner size='xl' />
      </Flex>
    )
  };

  //*---------------------------------------------------------------------------------*//\

  if (!currentPost) return null;

  //!---------------------------------------------------------------------------------!//

  return (
    <>
      <Flex>
        <Flex w={'full'} alignItems={'center'} gap={3}>
          <Avatar src={user?.profilePic} size={'md'} name="TheTigerGod" />
          <Flex>
            <Text fontSize={'sm'} fontWeight={'bold'}>
              {user?.username}
            </Text>

            <Image src="/verified.png" w='4' h={4} ml={4} />
          </Flex>
        </Flex>

        <Flex gap={4} alignItems={'center'}>
          <Text fontSize={'sm'} width={36} textAlign={'right'} color={'gray.light'}>
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>

          {currentUser?._id === user?._id && <DeleteIcon fontSize={20} cursor={'pointer'} onClick={handleDeletePost} />}
        </Flex>
      </Flex>

      <Text my={3}>{currentPost.text}</Text>

      {currentPost.img && (
        <Box borderRadius={6} overflow={'hidden'} border={'1px solid'} borderColor={'gray.light'}>
          <Image src={currentPost.img} w={'full'} />
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />

      <Flex justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
          <Text fontSize={'2xl'}>👋</Text>
          <Text>Obten la aplicacion para dar me gusta, compartir y publicar</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4} />

      {currentPost.replies.map(reply => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id} // Verificar si la respuesta actual es la ultima del arreglo
        />
      ))}


    </>
  )
}

//!---------------------------------------------------------------------------------!//

export default PostPage