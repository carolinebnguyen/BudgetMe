import {
    Divider,
    Flex,
    Heading,
    HStack,
    Text,
    VStack,
} from '@chakra-ui/react';
import BudgetAmount from './BudgetAmount.js';
import ExpenseChart from './ExpenseChart.js';
import MonthlyBudgetSelector from './MonthlyBudgetSelector.js';

// Redux
import { useSelector } from 'react-redux';
import { expenseSelector } from '../../slices/expense.js';

const MonthOverview = () => {
    const { monthlyExpenses } = useSelector(expenseSelector);

    const getTotalExpenses = () => {
        const totalExpenses = monthlyExpenses.map(e => e.cost).reduce((a,b) => a + b, 0)
        const totalExpensesToPrecisionTwo = Number.parseFloat(totalExpenses).toFixed(2)
        return `$${totalExpensesToPrecisionTwo}`
    }

    return (
        <Flex width={'40vw'} marginTop={'4vh'}>
            <VStack align={'center'} width={'100%'} spacing={'4vh'}>
                <MonthlyBudgetSelector />
                <BudgetAmount />
                <HStack justify={'center'} minW={'100%'} spacing={'1vw'}>
                    <Heading size={'md'} noOfLines={1}>Total Expenses: </Heading>
                    <Text width={'35%'} fontSize={'xl'}>
                        {getTotalExpenses()} 
                    </Text>
                </HStack>
                <Divider />
                <Flex width={'85%'} paddingX={'2vw'}>
                    <ExpenseChart />
                </Flex>
            </VStack>
        </Flex>
    );
};

export default MonthOverview;
