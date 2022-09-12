import { useEffect, useState } from 'react';
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Heading,
    Input,
    NumberInput,
    NumberInputField,
    Select,
    Stack,
    useColorModeValue,
} from '@chakra-ui/react';
import NavBar from '../layout/NavBar.js';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { budgetProfileSelector } from '../../slices/budgetProfile.js';
import { expenseSelector } from '../../slices/expense.js';
import { addExpense } from '../../actions/expense.js';

const AddExpense = () => {
    const dispatch = useDispatch();
    const { monthlyBudgets, expenseCategories } = useSelector(budgetProfileSelector);
    const { selectedExpense } = useSelector(expenseSelector);

    const [isFormError, setIsFormError] = useState(false);
    const [expenseFormData, setExpenseFormData] = useState({
        monthYear: '',
        categoryName: '',
        expenseName: '',
        cost: 0,
        date: '',
    });
    const { monthYear, categoryName, expenseName, cost, date } = expenseFormData;

    const onChange = (e) => {
        setExpenseFormData({ ...expenseFormData, [e.target.name]: e.target.value });
    };

    const onCostChange = (cost) => {
        setExpenseFormData({ ...expenseFormData, cost });
    }

    const onAddExpense = () => {
        if (monthYear && expenseName && cost > 0) {
            setIsFormError(false);
            dispatch(addExpense(monthYear, categoryName, expenseName, cost, date));
        } else {
            setIsFormError(true);
        }
    }

    useEffect(() => {
        setExpenseFormData({ expenseName: '', cost: 0 });
    }, [selectedExpense])

    return (
        <>
            <NavBar />
            <Flex
                height={'95vh'}
                align={'center'}
                justify={'center'}
                bg={useColorModeValue('gray.50', 'gray.800')}
            >
                <Stack
                    spacing={6}
                    w={'full'}
                    maxW={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    rounded={'xl'}
                    boxShadow={'lg'}
                    p={12}
                    my={12}
                >
                    <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
                        Add a new expense
                    </Heading>
                    <FormControl id="monthYear" isRequired isInvalid={isFormError && !monthYear}>
                        <FormLabel style={{ fontWeight: 'bold' }}>Select Monthly Budget</FormLabel>
                        <Select placeholder='Select monthly budget' name="monthYear" onChange={onChange}>
                            {monthlyBudgets.map(m => <option key={m.monthYear} value={m.monthYear}>{m.monthYearString}</option>)}
                        </Select>
                        {isFormError && !monthYear && <FormErrorMessage>Please select a monthly budget</FormErrorMessage>}
                    </FormControl>
                    <FormControl id="categoryName">
                        <FormLabel style={{ fontWeight: 'bold' }}>Select Expense Category (optional)</FormLabel>
                        <Select placeholder='Select expense category' name="categoryName" onChange={onChange}>
                            {expenseCategories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </Select>
                    </FormControl>
                    <FormControl id="expenseName" isRequired isInvalid={isFormError && !expenseName}>
                        <FormLabel style={{ fontWeight: 'bold' }}>Expense Name</FormLabel>
                        <Input
                            type="text"
                            name="expenseName"
                            value={expenseName}
                            onChange={onChange}
                        />
                        {isFormError && !expenseName && <FormErrorMessage>Please enter an expense name</FormErrorMessage>}
                    </FormControl>
                    <FormControl id="cost" isRequired isInvalid={isFormError && cost <= 0}>
                        <FormLabel style={{ fontWeight: 'bold' }}>Cost</FormLabel>
                        <NumberInput 
                            value={`$${cost}`} 
                            precision={2} 
                            step={1}
                            size={'md'}
                            allowMouseWheel
                            onChange={onCostChange}
                        >
                            <NumberInputField />
                        </NumberInput>
                        {isFormError && cost <= 0 && <FormErrorMessage>Please enter a cost greater than zero</FormErrorMessage>}
                    </FormControl>
                    <FormControl id="date">
                        <FormLabel style={{ fontWeight: 'bold' }}>Date</FormLabel>
                        <Input
                            type="date"
                            name="date"
                            value={date}
                            onChange={onChange}
                        />
                    </FormControl>
                    <Stack spacing={6}>
                        <Button
                            bg={'green.400'}
                            color={'white'}
                            _hover={{
                                bg: 'green.500',
                            }}
                            onClick={onAddExpense}
                        >
                            Add Expense
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </>
    );
};

export default AddExpense;