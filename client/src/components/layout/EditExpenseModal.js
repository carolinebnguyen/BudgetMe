import { useEffect, useState } from 'react';
import {
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    NumberInput,
    NumberInputField,
    Select,
    Stack,
    useColorModeValue,
} from '@chakra-ui/react';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { budgetProfileSelector } from '../../slices/budgetProfile.js';
import { expenseSelector } from '../../slices/expense.js';
import { editExpense, deleteExpense } from '../../actions/expense.js';

const EditExpenseModal = ({isOpen, onClose}) => {
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

    useEffect(() => {
        if (selectedExpense) {
            setExpenseFormData({
                monthYear: selectedExpense.monthYear,
                categoryName: selectedExpense.categoryName,
                expenseName: selectedExpense.name,
                cost: selectedExpense.cost,
                date: selectedExpense.date ? selectedExpense.date.slice(0,10) : '',
            });
        } else {
            onClose();
        }
    }, [selectedExpense]);

    const onCloseClearState = () => {
        setExpenseFormData({
            monthYear: '',
            categoryName: '',
            expenseName: '',
            cost: 0,
            date: '',
        });
        onClose();
    }

    const onChange = (e) => {
        setExpenseFormData({ ...expenseFormData, [e.target.name]: e.target.value });
    };

    const onCostChange = (cost) => {
        setExpenseFormData({ ...expenseFormData, cost });
    }

    const enableUpdateButton = () => {
        if (!selectedExpense) {
            return false;
        }
        return selectedExpense.monthYear === monthYear 
            && selectedExpense.categoryName === categoryName 
            && selectedExpense.name === expenseName 
            && selectedExpense.cost === cost 
            && (!selectedExpense.date || selectedExpense.date.slice(0,10) === date);
    }

    const onUpdateExpense = () => {
        if (monthYear && expenseName && cost > 0) {
            setIsFormError(false);
            dispatch(editExpense(selectedExpense._id, monthYear, categoryName, expenseName, cost, date));
        } else {
            setIsFormError(true);
        }
    }

    const onDeleteExpense = () => {
        dispatch(deleteExpense(selectedExpense._id));
    }

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onCloseClearState} 
            size={'lg'} 
            isCentered
        >
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Edit expense</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Stack
                    spacing={6}
                    w={'full'}
                    p={6}
                >
                    <FormControl id="monthYear" isRequired isInvalid={isFormError && !monthYear}>
                        <FormLabel style={{ fontWeight: 'bold' }}>Select Monthly Budget</FormLabel>
                        <Select placeholder='Select monthly budget' name="monthYear" value={monthYear} onChange={onChange}>
                            {monthlyBudgets.map(m => <option key={m.monthYear} value={m.monthYear}>{m.monthYearString}</option>)}
                        </Select>
                        {isFormError && !monthYear && <FormErrorMessage>Please select a monthly budget</FormErrorMessage>}
                    </FormControl>
                    <FormControl id="categoryName">
                        <FormLabel style={{ fontWeight: 'bold' }}>Select Expense Category (optional)</FormLabel>
                        <Select placeholder='Select expense category' name="categoryName" value={categoryName} onChange={onChange}>
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
                </Stack>
            </ModalBody>
            <ModalFooter>
                <Button colorScheme='gray' mr={3} onClick={onCloseClearState}>
                    Cancel
                </Button>
                <Button colorScheme='red' mr={3} onClick={onDeleteExpense}>Delete</Button>
                <Button colorScheme='green' onClick={onUpdateExpense} isDisabled={enableUpdateButton()}>Update</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EditExpenseModal;