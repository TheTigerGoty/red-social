import { Avatar, Box, Button, Divider, Flex, Image, Text } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs"
import Actions from "../components/Actions"
import { useState } from "react";
import Comment from "../components/Comment";

//!---------------------------------------------------------------------------------!//

const PostPage = () => {

  const [liked, setLiked] = useState<boolean>(false); //TODO : Funcionalidad del cambio de Estado de Like

  //!---------------------------------------------------------------------------------!//

  return (
    <>
      <Flex>
        <Flex w={'full'} alignItems={'center'} gap={3}>
          <Avatar src="/zuck-avatar.png" size={'md'} name="TheTigerGod" />
          <Flex>
            <Text fontSize={'sm'} fontWeight={'bold'}>
              thetigergod
            </Text>

            <Image src="/verified.png" w='4' h={4} ml={4} />
          </Flex>
        </Flex>

        <Flex gap={4} align={'center'}>
          <Text fontSize={'sm'} color={'gray.light'}>
            1d
          </Text>
          <BsThreeDots />
        </Flex>
      </Flex>

      <Text my={3}>Let's talk about Threads</Text>

      <Box borderRadius={6} overflow={'hidden'} border={'1px solid'} borderColor={'gray.light'}>
        <Image src={'/post1.png'} w={'full'} />
      </Box>

      <Flex gap={3} my={3}>
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>

      <Flex gap={2} alignItems={'center'}>
        <Text color={'gray.light'} fontSize={'sm'}>
          238 replies
        </Text>

        <Box w={0.5} h={0.5} borderRadius={'full'} bg={'gray.light'}></Box>

        <Text color={'gray.light'} fontSize={'sm'}>
          {200 + (liked ? 1 : 0)} likes
        </Text>
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

      <Comment
        comment='Se ve genial'
        createdAt='2d'
        likes={100}
        username='kranade'
        userAvatar='https://bit.ly/kent-c-dodds'
      />
      <Comment
        comment='OMG'
        createdAt='10d'
        likes={10}
        username='elrubius'
        userAvatar='https://bit.ly/prosper-baba'
      />
      <Comment
        comment='Viva Fernanfloo'
        createdAt='0d'
        likes={1000}
        username='splootwon'
        userAvatar='https://bit.ly/sage-adebayo'
      />

    </>
  )
}

//!---------------------------------------------------------------------------------!//

export default PostPage