import { useState, useEffect } from 'react';
import { Link as RouteLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuth, authSelector } from '../../slices/auth.js';
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    Text,
    Link,
    Image,
} from '@chakra-ui/react';
import logo from '../../assets/logo.png';

const SignUp = (props) => {
    const dispatch = useDispatch();
    const { authenticated } = useSelector(authSelector);

    useEffect(() => {
        // dispatch(fetchAuth());
    }, [dispatch]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        password2: '',
    });

    const { name, email, username, password, password2 } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();

        if (password !== password2) {
            props.setAlert('Passwords do not match', 'danger');
        } else {
            console.log('SUCCESS');
        }
    };

    return (
        <Flex minH={'100vh'} align={'center'} justify={'center'} bg={'gray.50'}>
            <Stack
                spacing={8}
                mx={'auto'}
                minW={{ base: 'sm', sm: 'md', md: 'lg' }}
                py={12}
                px={6}
            >
                <Stack align={'center'}>
                    <Box>
                        <Link as={RouteLink} to="/">
                            <Image
                                src={logo}
                                boxSize={100}
                                objectFit={'cover'}
                                objectPosition={'center'}
                                draggable={'false'}
                            />
                        </Link>
                    </Box>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Create an account
                    </Heading>
                </Stack>
                <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
                    <form onSubmit={onSubmit}>
                        <Stack spacing={4}>
                            <FormControl id="Name" isRequired>
                                <FormLabel>Name</FormLabel>
                                <Input
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                />
                            </FormControl>
                            <FormControl id="email" isRequired>
                                <FormLabel>Email address</FormLabel>
                                <Input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                />
                            </FormControl>
                            <FormControl id="username" isRequired>
                                <FormLabel>Username</FormLabel>
                                <Input
                                    type="text"
                                    name="username"
                                    value={username}
                                    onChange={onChange}
                                />
                            </FormControl>
                            <FormControl id="password" isRequired>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                />
                            </FormControl>
                            <FormControl id="password2" isRequired>
                                <FormLabel>Re-enter password</FormLabel>
                                <Input
                                    type="password"
                                    name="password2"
                                    value={password2}
                                    onChange={onChange}
                                />
                            </FormControl>
                            <Stack spacing={10} pt={2}>
                                <Button
                                    loadingText="Submitting"
                                    size="lg"
                                    bg={'#54B87F'}
                                    color={'white'}
                                    _hover={{
                                        bg: '#6FC393',
                                    }}
                                >
                                    Sign up
                                </Button>
                            </Stack>
                            <Stack pt={4}>
                                <Text align={'center'}>
                                    Already a user?{' '}
                                    <Link
                                        as={RouteLink}
                                        to="/login"
                                        color={'#6FC393'}
                                    >
                                        Login
                                    </Link>
                                </Text>
                            </Stack>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Flex>
    );
};

export default SignUp;
