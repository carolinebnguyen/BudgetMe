import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Avatar,
    AvatarBadge,
    IconButton,
    Center,
} from '@chakra-ui/react';
import { SmallCloseIcon } from '@chakra-ui/icons';
import defaultAvatar from '../assets/default_avatar.png';

const Profile = () => {
    return (
        <Flex minH={'100vh'} align={'center'} justify={'center'} bg={'gray.50'}>
            <Stack
                spacing={4}
                w={'full'}
                maxW={'md'}
                bg={'white'}
                rounded={'xl'}
                boxShadow={'lg'}
                p={6}
                my={12}
            >
                <Heading
                    lineHeight={1.1}
                    align={'center'}
                    fontSize={{ base: '2xl', sm: '3xl' }}
                >
                    Profile
                </Heading>
                <FormControl id="avatar">
                    <Center>
                        <Avatar size="xl" src={defaultAvatar}>
                            <AvatarBadge
                                as={IconButton}
                                size="sm"
                                rounded="full"
                                top="-10px"
                                colorScheme="red"
                                aria-label="remove Image"
                                icon={<SmallCloseIcon />}
                            />
                        </Avatar>
                    </Center>
                </FormControl>
                <FormControl id="username" isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input type="text" />
                </FormControl>
                <FormControl id="email" isRequired>
                    <FormLabel>Email address</FormLabel>
                    <Input type="email" />
                </FormControl>
                <FormControl id="oldPassword" isRequired>
                    <FormLabel> Current password</FormLabel>
                    <Input type="password" />
                </FormControl>
                <FormControl id="newPassword" isRequired>
                    <FormLabel>New password</FormLabel>
                    <Input type="password" />
                </FormControl>
                <FormControl id="confirmPassword" isRequired>
                    <FormLabel>Confirm new password</FormLabel>
                    <Input type="password" />
                </FormControl>
                <Stack spacing={6} direction={['column', 'row']}>
                    <Button
                        bg={'red.400'}
                        color={'white'}
                        w="full"
                        _hover={{
                            bg: 'red.500',
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        bg={'blue.400'}
                        color={'white'}
                        w="full"
                        _hover={{
                            bg: 'blue.500',
                        }}
                    >
                        Submit
                    </Button>
                </Stack>
            </Stack>
        </Flex>
    );
};

export default Profile;
