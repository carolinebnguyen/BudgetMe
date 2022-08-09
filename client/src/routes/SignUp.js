import { useState } from 'react';
import { Link as RouteLink } from 'react-router-dom';
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    Link,
    Image,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import logo from '../assets/logo.png';

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Flex minH={'100vh'} align={'center'} justify={'center'} bg={'gray.50'}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Box>
                        <Image
                            src={logo}
                            boxSize={100}
                            objectFit={'cover'}
                            objectPosition={'center'}
                        />
                    </Box>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Create an account
                    </Heading>
                </Stack>
                <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
                    <Stack spacing={4}>
                        <FormControl id="Name" isRequired>
                            <FormLabel>Name</FormLabel>
                            <Input type="text" />
                        </FormControl>
                        <FormControl id="email" isRequired>
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" />
                        </FormControl>
                        <FormControl id="username" isRequired>
                            <FormLabel>Username</FormLabel>
                            <Input type="text" />
                        </FormControl>
                        <FormControl id="password" isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                />
                                <InputRightElement h={'full'}>
                                    <Button
                                        variant={'ghost'}
                                        onClick={() =>
                                            setShowPassword(
                                                (showPassword) => !showPassword
                                            )
                                        }
                                    >
                                        {showPassword ? (
                                            <ViewIcon />
                                        ) : (
                                            <ViewOffIcon />
                                        )}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
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
                </Box>
            </Stack>
        </Flex>
    );
};

export default SignUp;
