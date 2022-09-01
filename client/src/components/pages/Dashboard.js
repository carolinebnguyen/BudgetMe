import { useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import NavBar from '../layout/NavBar.js';
import MonthOverview from '../layout/MonthOverview.js';
import CategoryOverview from '../layout/CategoryOverview.js';
import { useLoadingNotification } from '../../util/loadingNotification.js';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { getBudgetProfile } from '../../actions/budgetProfile.js';
import { budgetProfileSelector } from '../../slices/budgetProfile.js';

const Dashboard = () => {
    const dispatch = useDispatch();
    const loadingNotification = useLoadingNotification();
    const { loading } = useSelector(budgetProfileSelector);

    useEffect(() => {
        dispatch(getBudgetProfile());
    }, [dispatch]);

    useEffect(() => {
        if (loading.show) {
            if (!loading.isFinished) {
                loadingNotification.displayLoading(loading.msg);
            }
            else if (!loading.isError) {
                loadingNotification.displaySuccess(loading.msg);
            }
            else {
                loadingNotification.displayError(loading.msg);
            }
        }
    }, [loading, loadingNotification]);

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
