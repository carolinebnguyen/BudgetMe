import { Link as RouteLink } from 'react-router-dom';
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
import logo from '../assets/logo.png';

const LoginPage = () => {
    // TODO: Add Login API usage

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
                            />
                        </Link>
                    </Box>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Sign in to your account
                    </Heading>
                </Stack>
                <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
                    <Stack spacing={4}>
                        <FormControl id="email">
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <Input type="password" />
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
