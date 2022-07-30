import { useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Flex,
    FormControl,
    FormHelperText,
    Heading,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Link,
    Stack,
} from '@chakra-ui/react';
import { FaUser, FaLock } from 'react-icons/fa';
import { Link as RouteLink } from 'react-router-dom';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const handleShowClick = () => setShowPassword(!showPassword);

    // TODO: Add Login API usage

    return (
        <Flex
            flexDirection="column"
            width="100wh"
            height="90vh"
            backgroundColor="gray.200"
            justifyContent="center"
            alignItems="center"
        >
            <Stack
                flexDir="column"
                mb="2"
                justifyContent="center"
                alignItems="center"
            >
                <Avatar bg="teal.500" />
                <Heading color="teal.400">Welcome to BudgetMe</Heading>
                <Box minW={{ base: '90%', md: '468px' }}>
                    <form>
                        <Stack
                            spacing={4}
                            p="1rem"
                            backgroundColor="whiteAlpha.900"
                            boxShadow="md"
                        >
                            <FormControl>
                                <InputGroup>
                                    <InputLeftElement
                                        pointerEvents="none"
                                        children={
                                            <Icon
                                                as={FaUser}
                                                color="gray.300"
                                            />
                                        }
                                    />
                                    <Input
                                        type="username"
                                        placeholder="Username"
                                    />
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <InputGroup>
                                    <InputLeftElement
                                        pointerEvents="none"
                                        color="gray.300"
                                        children={
                                            <Icon
                                                as={FaLock}
                                                color="gray.300"
                                            />
                                        }
                                    />
                                    <Input
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        placeholder="Password"
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Button
                                            h="1.75rem"
                                            size="sm"
                                            onClick={handleShowClick}
                                        >
                                            {showPassword ? 'Hide' : 'Show'}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                                <FormHelperText textAlign="right">
                                    <Link>Forgot password?</Link>
                                </FormHelperText>
                            </FormControl>
                            <Button
                                borderRadius={0}
                                type="submit"
                                variant="solid"
                                colorScheme="teal"
                                width="full"
                            >
                                Login
                            </Button>
                        </Stack>
                    </form>
                </Box>
            </Stack>
            <Box>
                New to BudgetMe?{' '}
                <Link as={RouteLink} to="/signup" color="teal.500">
                    Sign Up
                </Link>
            </Box>
        </Flex>
    );
};

export default LoginPage;
