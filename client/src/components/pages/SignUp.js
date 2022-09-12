import { useEffect, useState } from 'react';
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

// React Router
import { Link as RouteLink, useNavigate } from 'react-router-dom';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { authSelector } from '../../slices/auth.js';
import { authSignup } from '../../actions/auth.js';

const SignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(authSelector);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        repeatedPassword: '',
    });

    const { name, email, username, password, repeatedPassword } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSignup = async (e) => {
        e.preventDefault();

        // TODO: Check if any input is not filled in and that passwords match. Otherwise, indicate some error message.
        dispatch(authSignup({ name, email, username, password }));
    };

    const onKeyDown = async (e) => {
        if (e.key === 'Enter') {
            dispatch(authSignup({ name, email, username, password }));
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
                    <Stack spacing={4}>
                        <FormControl id="name" isRequired>
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
                        <FormControl id="repeatedPassword" isRequired>
                            <FormLabel>Re-enter password</FormLabel>
                            <Input
                                type="password"
                                name="repeatedPassword"
                                value={repeatedPassword}
                                onChange={onChange}
                                onKeyDown={onKeyDown}
                            />
                        </FormControl>
                        <Button
                            loadingText="Submitting"
                            size="lg"
                            bg={'#54B87F'}
                            color={'white'}
                            _hover={{
                                bg: '#6FC393',
                            }}
                            onClick={onSignup}
                        >
                            Sign up
                        </Button>
                        <Text align={'center'}>
                            Already a user?{' '}
                            <Link as={RouteLink} to="/login" color={'#6FC393'}>
                                Login
                            </Link>
                        </Text>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
};

export default SignUp;
