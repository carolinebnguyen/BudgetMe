import { Flex } from '@chakra-ui/react';
import NavBar from '../layout/NavBar.js';
import MonthOverview from '../layout/MonthOverview.js';
import CategoryOverview from '../layout/CategoryOverview.js';

const Dashboard = () => {
    return (
        <>
            <NavBar />
            <Flex height={'95vh'}>
                <MonthOverview />
                <CategoryOverview />
            </Flex>
        </>
    );
};

export default Dashboard;
