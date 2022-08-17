import { useEffect } from 'react';
import { Flex, HStack } from '@chakra-ui/react';
import NavBar from '../layout/NavBar.js';
import MonthOverview from '../layout/MonthOverview.js';
import CategoryOverview from '../layout/CategoryOverview.js';

// Redux
import { useDispatch, useSelector } from 'react-redux';

const Dashboard = () => {
    return (
        <>
            <NavBar />
            <Flex minH={'95vh'}>
                <MonthOverview />
                <CategoryOverview />
            </Flex>
        </>
    );
};

export default Dashboard;