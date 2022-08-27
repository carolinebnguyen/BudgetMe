import { Text, Flex, Spinner } from '@chakra-ui/react';

// React Router
import { Outlet, Navigate } from 'react-router-dom';

// Redux
import { useSelector } from 'react-redux';
import { authSelector } from '../../slices/auth.js';

const PrivateRoute = () => {
    const { initialAuth, isAuthenticated } = useSelector(authSelector);

    if (initialAuth) {
        return (
            <Flex
                minH={'100vh'}
                justify={'center'}
                alignItems={'center'}
                direction={'column'}
            >
                <Text fontSize="4xl">Authenticating</Text>
                <Spinner
                    thickness="5px"
                    speed="0.75s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size={'xl'}
                />
            </Flex>
        );
    }
    if (!isAuthenticated) return <Navigate to={'/login'} />;
    return <Outlet />;
};

export default PrivateRoute;
