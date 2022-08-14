import { Link as RouteLink } from 'react-router-dom';
import {
    Box,
    Heading,
    Text,
    Button,
    Stack,
    Flex,
    Link,
} from '@chakra-ui/react';
import Header from '../layout/Header.js';

const Landing = () => {
    return (
        <>
            <Header />
            <Flex
                minH={'95vh'}
                align={'center'}
                flexDirection={'column'}
                justify={'center'}
                bg={'gray.50'}
                bgGradient="radial(gray.50, #ABD8BF)"
            >
                <Stack
                    as={Box}
                    textAlign={'center'}
                    spacing={{ base: 8, md: 14 }}
                    maxW={'lg'}
                    py={{ base: 20, md: 36 }}
                >
                    <Heading
                        fontWeight={600}
                        fontSize={{ base: '4xl', sm: '4xl', md: '6xl' }}
                        lineHeight={'110%'}
                    >
                        Budgeting <br />
                        <Text as={'span'} color={'#54B87F'}>
                            made easy
                        </Text>
                    </Heading>
                    <Text color={'gray.500'}>
                        View your expenses at a glance and manage your spending.
                        Save time and money, effortlessly.
                    </Text>
                    <Stack
                        direction={'column'}
                        spacing={3}
                        align={'center'}
                        alignSelf={'center'}
                        position={'relative'}
                    >
                        <Button
                            bg={'#54B87F'}
                            rounded={'full'}
                            px={6}
                            _hover={{
                                bg: '#6FC393',
                            }}
                            color={'white'}
                            size={'lg'}
                        >
                            <Link
                                as={RouteLink}
                                to="/signup"
                                style={{ textDecoration: 'none' }}
                            >
                                Get started
                            </Link>
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </>
    );
};

export default Landing;
