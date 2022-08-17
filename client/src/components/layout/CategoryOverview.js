import { useEffect } from 'react';
import { Flex, SimpleGrid, Box, Container } from '@chakra-ui/react';
import NavBar from './NavBar.js';

const CategoryOverview = () => {
    return (
        <Flex minW={'70vw'} justify={'center'}>
            <Container
                bgColor={'pink'}
                w={{ base: '300px', md: '400px', lg: '500px' }}
                paddingTop={'20px'}
            >
                <SimpleGrid columns={{ base: 1, md: 2 }}>
                    <Box bgColor={'green.200'}>Mochi-kun</Box>
                    <Box bgColor={'blue.200'}>Mochi-san</Box>
                </SimpleGrid>
            </Container>
        </Flex>
    );
};

export default CategoryOverview;
