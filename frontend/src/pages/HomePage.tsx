import { Button, Flex } from "@chakra-ui/react"
import { Link } from "react-router-dom"

//!---------------------------------------------------------------------------------!//

const HomePage: React.FC = () => {
    return (
        <Link to={'/thetigergod'}>
            <Flex w={'full'} justifyContent={'center'}>
                <Button mx={'auto'}>Visita la Pagina de Perfil</Button>
            </Flex>
        </Link>
    )
}

//!---------------------------------------------------------------------------------!//

export default HomePage