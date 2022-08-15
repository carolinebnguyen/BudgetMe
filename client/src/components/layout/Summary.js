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
    HStack,
} from '@chakra-ui/react';
import NavBar from './NavBar.js';

const Summary = () => {
    return (
        <>
            <NavBar minH={'5vh'} />
            <Flex
                minH={'95vh'}
                align={'center'}
                justify={'center'}
                bgColor={'gray.50'}
            >
                <Stack align={'center'}>
                    <Box bgColor={'green.200'}>Hello, I am Box under Stack</Box>
                    <Box bgColor={'green.200'}>Hello, I am Box under Stack</Box>
                </Stack>
            </Flex>
        </>
    );
};

export default Summary;
