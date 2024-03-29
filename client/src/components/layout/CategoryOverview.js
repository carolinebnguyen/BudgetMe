import { Divider, Flex, SimpleGrid, Box, Container } from '@chakra-ui/react';

const CategoryOverview = () => {
    return (
        <Flex width={'60vw'} justify={'center'}>
            <Divider orientation='vertical' />
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
