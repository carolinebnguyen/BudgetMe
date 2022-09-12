import { useEffect, useState } from 'react';
import {
    Button,
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
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { budgetProfileSelector } from '../../slices/budgetProfile.js';
import { addMonthlyBudget } from '../../actions/budgetProfile.js';

const NewMonthlyBudgetModal = ({isOpen, onClose}) => {
    const dispatch = useDispatch();
    const { monthlyBudgets, selectedMonthlyBudget } = useSelector(budgetProfileSelector);
    const [yearMonth, setYearMonth] = useState();
    const [monthlyAmount, setMonthlyAmount] = useState(0);

    const currDate = new Date();
    const getDefaultDate = () => {
        let laterDate = currDate;
        if (monthlyBudgets.length > 0) {
            const latestDate = new Date(monthlyBudgets[0].monthYearString);
            const nextMonthDate = new Date(latestDate.getFullYear(), latestDate.getMonth() + 1, 1);
            if (nextMonthDate > laterDate) {
                laterDate = nextMonthDate;
            }
        }
        return `${laterDate.toISOString().slice(0,7)}`;
    }

    useEffect(() => {
        if (monthlyBudgets.length > 0) {
            setYearMonth(getDefaultDate());
        }
    }, [monthlyBudgets]);

    useEffect(() => {
        onClose();
    }, [selectedMonthlyBudget]);

    const onMonthlyAmountChange = (value) => {
        setMonthlyAmount(value.replace(/^\$/, ''));
    };
    
    const onCreateMonthlyBudget = () => {
        const monthYear = yearMonth.split('-').reverse().join('-');
        dispatch(addMonthlyBudget(monthYear, monthlyAmount));
    }

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            size={'sm'} 
            isCentered
        >
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Create a new monthly budget</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Heading as='h4' size='sm'>
                    Select a month and year:
                </Heading>
                <Input
                    mt={1}
                    value={yearMonth}
                    onChange={(e) => setYearMonth(e.target.value)}
                    min={`${currDate.getFullYear() - 1}-01`}
                    max={`${currDate.getFullYear() + 1}-12`}
                    size="lg"
                    type="month"
                />
                <Heading as='h4' size='sm' mt={5}>
                    Input the budget amount:
                </Heading>
                <NumberInput 
                    mt={1}
                    value={`$${monthlyAmount}`} 
                    precision={2} 
                    step={50}
                    size={'lg'}
                    allowMouseWheel
                    onChange={onMonthlyAmountChange}
                >
                <NumberInputField textAlign={'right'} />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
            </ModalBody>
            <ModalFooter>
                <Button colorScheme='gray' mr={3} onClick={onClose}>
                    Cancel
                </Button>
                <Button colorScheme='green' onClick={onCreateMonthlyBudget}>Create</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default NewMonthlyBudgetModal;