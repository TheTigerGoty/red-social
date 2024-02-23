import { useEffect, useState } from "react"
import UsePost from "../components/UsePost"
import UserHeader, { User } from "../components/UserHeader"
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";

//!---------------------------------------------------------------------------------!//

const UserPage: React.FC = () => {

  const [user, setUser] = useState<User | null>(null); // user inicializa como 'null'
  const { username } = useParams<{ username: string }>(); // Obtener de la URL el 'username'
  const showToast = useShowToast();

  //*---------------------------------------------------------------------------------*//\

  useEffect(() => {

    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();

        if (data.error) {
          showToast('Error', data.error, 'error');
          return;
        };

        setUser(data);
      } catch (error) {
        showToast('Error', (error as string), 'error')
      }
    }

    getUser();
  }, [username, showToast]); // Se ejecutara y redenrizara cada vez que cambie el valor de 'username o showToast'

  if (!user) return null; // Si no encuentra usaurio no renderizara nada 

  //!---------------------------------------------------------------------------------!//

  return (
    <>
      <UserHeader user={user} />
      <UsePost likes={1200} replies={481} postImg={'/post1.png'} postTitle='Buen Tutorial' />
      <UsePost likes={100} replies={13} postImg={'/post2.png'} postTitle='Amor a este chico' />
      <UsePost likes={423} replies={4525} postImg={'/post3.png'} postTitle='Quiero ser Youtuber' />
      <UsePost likes={1234} replies={34234} postTitle='I am Gay' />
    </>
  )
}

//!---------------------------------------------------------------------------------!//

export default UserPage