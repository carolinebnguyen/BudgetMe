import { Link as RouteLink } from 'react-router-dom';
import {
    Box,
    Flex,
    HStack,
    Link,
    Button,
    Menu,
    MenuButton,
    Stack,
    Image,
} from '@chakra-ui/react';
import logo from '../../assets/logo_with_words.png';

const Header = () => {
    return (
        <>
            <Box bg={'#54B87F'} px={4} minH={'5vh'}>
                <Flex
                    h={16}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                >
                    <HStack spacing={4} alignItems={'center'}>
                        <Box>
                            <Link as={RouteLink} to="/">
                                <Image
                                    src={logo}
                                    height="6vh"
                                    objectFit={'contain'}
                                    draggable={'false'}
                                />
                            </Link>
                        </Box>
                    </HStack>
                    <Flex alignItems={'center'}>
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                minW={0}
                                minH={50}
                            ></MenuButton>
                        </Menu>
                    </Flex>
                    <Stack
                        flex={{ base: 1, md: 0 }}
                        justify={'flex-end'}
                        direction={'row'}
                        spacing={6}
                    >
                        <Button
                            display={{ md: 'flex' }}
                            bg={'gray.200'}
                            _hover={{
                                bg: 'gray.100',
                            }}
                        >
                            <Link
                                as={RouteLink}
                                to="/login"
                                style={{ textDecoration: 'none' }}
                            >
                                Login
                            </Link>
                        </Button>
                    </Stack>
                </Flex>
            </Box>
        </>
    );
};

export default Header;
