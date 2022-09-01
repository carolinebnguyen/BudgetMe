import { useEffect, useState } from 'react';
import {
    Button,
    Heading,
    HStack,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { updateMonthlyBudget } from '../../actions/budgetProfile.js';
import { budgetProfileSelector } from '../../slices/budgetProfile.js';

const BudgetAmount = () => {
    const dispatch = useDispatch();
    const { selectedMonthlyBudget } = useSelector(budgetProfileSelector);
    const [monthlyAmount, setMonthlyAmount] = useState(0);

    useEffect(() => {
        if (selectedMonthlyBudget) {
            setMonthlyAmount(selectedMonthlyBudget.amount);
        }
    }, [selectedMonthlyBudget]);

    const onMonthlyAmountChange = (value) => {
        setMonthlyAmount(value.replace(/^\$/, ''));
    };

    const onSaveMonthlyAmount = () => {
        if (!selectedMonthlyBudget || monthlyAmount === selectedMonthlyBudget.amount) {
            return;
        }
        const { _id, monthYear } = selectedMonthlyBudget
        dispatch(updateMonthlyBudget(_id, monthYear, monthlyAmount))
    };

    return (
        <HStack justify={'center'} minW={'100%'} spacing={'1vw'}>
            <Heading size={'md'} noOfLines={1}>Budget Amount</Heading>
            <NumberInput 
                width={'35%'}
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
            <Button 
                colorScheme={'green'} 
                size={'md'} 
                width={'10%'} 
                isDisabled={!selectedMonthlyBudget || monthlyAmount === selectedMonthlyBudget.amount}
                onClick={onSaveMonthlyAmount}
            >
                Save
            </Button>
        </HStack>
    )
}

export default BudgetAmount;