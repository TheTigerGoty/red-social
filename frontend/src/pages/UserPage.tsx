import { useEffect, useState } from "react"
import UserHeader from "../components/UserHeader"
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

//!---------------------------------------------------------------------------------!//

const UserPage: React.FC = () => {

  const { user, loading } = useGetUserProfile();
  const { username } = useParams<{ username: string }>(); // Obtener de la URL el 'username'
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);

  //*---------------------------------------------------------------------------------*//\

  useEffect(() => {

    const getPost = async () => {

      setFetchingPosts(true);

      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        // console.log(data);
        setPosts(data);
      } catch (error) {
        showToast('Error', (error as Error).message, 'error');
        setPosts([]); // Si hay un error en la carga de datos, setPosts por defecto no traera nada. 
      } finally {
        setFetchingPosts(false);
      }
    }

    getPost();
  }, [username, showToast, setPosts]); // Se ejecutara y redenrizara cada vez que cambie el valor de 'username | showToast | setPosts'

  //*---------------------------------------------------------------------------------*//\

  if (!user && loading) {
    return (
      <Flex justifyContent={'center'}>
        <Spinner size='xl' />
      </Flex>
    )
  }; // Si no encuentra usaurio no renderizara nada 

  //*---------------------------------------------------------------------------------*//\

  if (!user && !loading) {
    return <h1>Usuario no encontrado</h1>;
  }; 

  //!---------------------------------------------------------------------------------!//

  return (
    <>
      <UserHeader user={user} />

      {!fetchingPosts && posts.length === 0 && <h1>Aun no tiene publicaciones</h1>}
      {fetchingPosts && (
        <Flex justifyContent={'center'} my={12}>
          <Spinner size={'xl'} />
        </Flex>
      )}

      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  )
}

//!---------------------------------------------------------------------------------!//

export default UserPage