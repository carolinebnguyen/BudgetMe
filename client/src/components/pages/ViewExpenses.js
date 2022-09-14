import { useEffect, useState } from 'react';
import {
    Container,
    Divider,
    Flex,
    Heading,
    Icon,
    Table,
    TableContainer,
    Thead,
    Tbody,
    Td,
    Th,
    Tr,
    VStack,
    useDisclosure
  } from '@chakra-ui/react';
import { MdAttachMoney } from 'react-icons/md';

import NavBar from '../layout/NavBar.js';
import MonthlyBudgetSelector from '../layout/MonthlyBudgetSelector.js';
import EditExpenseModal from '../layout/EditExpenseModal.js';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { budgetProfileSelector } from '../../slices/budgetProfile.js';
import { expenseSelector } from '../../slices/expense.js';
import { getMonthlyExpenses, setSelectedExpense } from '../../actions/expense.js';

const ViewExpenses = () => {
    const dispatch = useDispatch();
    const { selectedMonthlyBudget } = useSelector(budgetProfileSelector);
    const { monthlyExpenses, selectedExpense } = useSelector(expenseSelector);
    const { isOpen: isEditExpenseOpen, onOpen: onEditExpenseOpen, onClose: onEditExpenseClose } = useDisclosure();
    const [hoverState, setHoverState] = useState({});

    useEffect(() => {
        if (selectedMonthlyBudget) {
            dispatch(getMonthlyExpenses(selectedMonthlyBudget.monthYear));
        }
    }, [selectedMonthlyBudget, selectedExpense]);

    const onHover = (index, isHovered) => {
        setHoverState({ [index]: isHovered });
    }

    const onClickExpense = (expense) => {
        dispatch(setSelectedExpense(expense));
        onEditExpenseOpen();
    };

    const renderExpenses = () => {
        if (monthlyExpenses.length > 0) {
            return monthlyExpenses.map((expense, index) => {
                let date;
                if (expense.date) {
                    date = expense.date.slice(0,10).split('-');
                    date = date.slice(1, date.length).concat(date.slice(0,1)).join('-');
                }
                return (
                    <Tr 
                        key={expense._id} 
                        style={{cursor: 'pointer'}} 
                        onMouseOver={()=>onHover(index, true)} 
                        onMouseOut={()=>onHover(index, false)}
                        onClick={()=>onClickExpense(expense)}
                        bg={hoverState[index] ? 'gray.100' : 'white'}
                    >
                        <Td>{date ?? 'None'}</Td>
                        <Td>{expense.categoryName ?? 'None'}</Td>
                        <Td>{expense.name}</Td>
                        <Td isNumeric><Flex align={'center'}><Icon as={MdAttachMoney} color={'green'} />{expense.cost.toFixed(2)}</Flex></Td>
                    </Tr>
                );
            });
        } else {
            return (
                <Tr>
                    <Td colSpan={4} textAlign={'center'}>No expenses to display</Td>
                </Tr>
            );
        }
    }

    return (
        <>
            <NavBar />
            <Flex
                height={'95vh'}
                width={'100%'}
                justify={'center'}
                paddingTop={'4vh'}
            >
                    <VStack spacing={6} as={Container} maxW={'3xl'} textAlign={'center'}>
                        <Heading fontSize={'3xl'}>View Expenses</Heading>
                        <Flex justify={'center'}>
                            <MonthlyBudgetSelector />
                        </Flex>
                        <Divider />
                        <TableContainer>
                            <Table variant='simple' maxW={'6xl'}>
                                <Thead>
                                    <Tr>
                                        <Th>Date</Th>
                                        <Th>Category</Th>
                                        <Th>Expense Name</Th>
                                        <Th isNumeric>Cost</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {renderExpenses()}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </VStack>
            </Flex>
            <EditExpenseModal isOpen={isEditExpenseOpen} onClose={onEditExpenseClose} />
        </>
    );
};

export default ViewExpenses;
