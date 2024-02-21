import UsePost from "../components/UsePost"
import UserHeader from "../components/UserHeader"

//!---------------------------------------------------------------------------------!//

const UserPage: React.FC = () => {
  return (
    <>
      <UserHeader />
      <UsePost likes={1200} replies={481} postImg={'/post1.png'} postTitle='Buen Tutorial'/>
      <UsePost likes={100} replies={13} postImg={'/post2.png'} postTitle='Amor a este chico'/>
      <UsePost likes={423} replies={4525} postImg={'/post3.png'} postTitle='Quiero ser Youtuber'/>
      <UsePost likes={1234} replies={34234} postTitle='I am Gay'/>
    </>
  )
}

//!---------------------------------------------------------------------------------!//

export default UserPage