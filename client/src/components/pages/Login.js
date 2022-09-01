import { useEffect, useState } from 'react';
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    Image,
} from '@chakra-ui/react';
import { useLoadingNotification } from '../../util/loadingNotification.js';
import logo from '../../assets/logo.png';

// React Router
import { Link as RouteLink, useNavigate } from 'react-router-dom';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { authSelector } from '../../slices/auth.js';
import { authLogin } from '../../actions/auth.js';

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loadingNotification = useLoadingNotification();
    const { isAuthenticated, loading } = useSelector(authSelector);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } 
        if (loading.show) {
            if (!loading.isFinished) {
                loadingNotification.displayLoading(loading.msg);
            }
            else if (!loading.isError) {
                loadingNotification.displaySuccess(loading.msg);
            }
            else {
                loadingNotification.displayError(loading.msg);
            }
        }
    }, [isAuthenticated, loading, loadingNotification, navigate]);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const { username, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onLogin = async (e) => {
        e.preventDefault();

        // TODO: Check if any input is not filled in and that passwords match. Otherwise, indicate some error message.
        dispatch(authLogin(username.trim(), password));
    };

    const onKeyDown = async (e) => {
        if (e.key === 'Enter') {
            dispatch(authLogin(username.trim(), password));
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
                        Sign in to your account
                    </Heading>
                </Stack>
                <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
                    <Stack spacing={4}>
                        <FormControl id="username">
                            <FormLabel>Username</FormLabel>
                            <Input
                                type="text"
                                name="username"
                                value={username}
                                onChange={onChange}
                            />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                onKeyDown={onKeyDown}
                            />
                        </FormControl>
                        <Stack spacing={10}>
                            <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                align={'start'}
                                justify={'space-between'}
                            >
                                <Checkbox colorScheme="green">
                                    Remember me
                                </Checkbox>
                                <Link color={'#6FC393'}>Forgot password?</Link>
                            </Stack>
                            <Button
                                bg={'#54B87F'}
                                color={'white'}
                                _hover={{
                                    bg: '#6FC393',
                                }}
                                onClick={onLogin}
                            >
                                Sign in
                            </Button>
                        </Stack>
                        <Stack pt={4}>
                            <Text align={'center'}>
                                New to BudgetMe?{' '}
                                <Link
                                    as={RouteLink}
                                    to="/signup"
                                    color={'#6FC393'}
                                >
                                    Create an account
                                </Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
};

export default LoginPage;
