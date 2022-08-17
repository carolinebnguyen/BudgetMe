import {
    Box,
    Flex,
    Avatar,
    HStack,
    Link,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    Stack,
    Center,
    Image,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import logo from '../../assets/logo_with_words.png';
import defaultAvatar from '../../assets/default_avatar.png';

// React Router
import { Link as RouteLink } from 'react-router-dom';

// Redux
import store from '../../store.js';
import { logout } from '../../slices/auth.js';

const Links = [
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/expenses', name: 'Expenses' },
];

const NavLink = ({ children, path }) => (
    <Link
        as={RouteLink}
        to={path}
        px={2}
        py={1}
        rounded={'md'}
        textColor={'gray.50'}
        _hover={{
            textDecoration: 'none',
            bg: '#6FC393',
        }}
    >
        {children}
    </Link>
);

const NavBar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const onLogout = (e) => {
        e.preventDefault();
        store.dispatch(logout());
    };

    return (
        <>
            <Box bg={'#54B87F'} px={4} minH={'5vh'}>
                <Flex
                    h={16}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                >
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={4} alignItems={'center'}>
                        <Box>
                            <Link as={RouteLink} to="/dashboard">
                                <Image
                                    src={logo}
                                    height={'6vh'}
                                    objectFit={'contain'}
                                    draggable={'false'}
                                />
                            </Link>
                        </Box>
                        <HStack
                            as={'nav'}
                            spacing={4}
                            display={{ base: 'none', md: 'flex' }}
                        >
                            {Links.map(({ path, name }) => (
                                <NavLink key={name} path={path}>
                                    {name}
                                </NavLink>
                            ))}
                        </HStack>
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
                            >
                                <Avatar size={'sm'} src={defaultAvatar} />
                            </MenuButton>
                            <MenuList alignItems={'center'}>
                                <br />
                                <Center>
                                    <Avatar size={'2xl'} src={defaultAvatar} />
                                </Center>
                                <br />
                                <Center>
                                    <p>Username</p>
                                </Center>
                                <br />
                                <MenuDivider />
                                <MenuItem as={RouteLink} to="/profile">
                                    Account Settings
                                </MenuItem>
                                <MenuItem onClick={onLogout}>Logout</MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            {Links.map(({ path, name }) => (
                                <NavLink key={name} path={path}>
                                    {name}
                                </NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
        </>
    );
};

export default NavBar;
