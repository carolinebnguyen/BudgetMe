import { Link as RouteLink } from 'react-router-dom';
import { Flex, Box, Heading, Text, Button, Link } from '@chakra-ui/react';

const NotFound = () => {
    return (
        <Flex minH={'100vh'} align={'center'} justify={'center'} bg={'gray.50'}>
            <Box textAlign="center" py={10} px={6}>
                <Heading
                    display="inline-block"
                    as="h2"
                    size="2xl"
                    bgColor={'#54B87F'}
                    backgroundClip="text"
                >
                    404
                </Heading>
                <Text fontSize="18px" mt={3} mb={2}>
                    Page Not Found
                </Text>
                <Text color={'gray.500'} mb={6}>
                    The page that you're looking for cannot be found
                </Text>

                <Button
                    bg={'#54B87F'}
                    color={'white'}
                    _hover={{
                        bg: '#6FC393',
                    }}
                >
                    <Link
                        as={RouteLink}
                        to="/"
                        style={{ textDecoration: 'none' }}
                    >
                        Go to Home Page
                    </Link>
                </Button>
            </Box>
        </Flex>
    );
};

export default NotFound;
