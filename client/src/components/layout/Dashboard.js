import { useEffect } from 'react';
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
} from '@chakra-ui/react';
import NavBar from './NavBar.js';

// React Router
import { useNavigate } from 'react-router-dom';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { authSelector } from '../../slices/auth.js';

const Dashboard = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector(authSelector);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    });

    return (
        <>
            <NavBar />
            <Flex minH={'95vh'} align={'center'} justify={'center'}></Flex>
        </>
    );
};

export default Dashboard;
