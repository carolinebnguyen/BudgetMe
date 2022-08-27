import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Divider,
    Flex,
    Heading,
    HStack,
    Input,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuOptionGroup,
    MenuDivider,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Text,
    VStack,
} from '@chakra-ui/react';
import { AddIcon, CalendarIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { useLoadingNotification } from '../../util/loadingNotification.js';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { getBudgetProfile, updateMonthlyBudget } from '../../actions/budgetProfile.js';
import { budgetProfileSelector, setSelectedMonthlyBudget } from '../../slices/budgetProfile.js';
import { getMonthlyExpenses } from '../../actions/expense.js';
import { expenseSelector } from '../../slices/expense.js';

const MonthOverview = () => {
    const dispatch = useDispatch();
    const loadingNotification = useLoadingNotification();
    const { loading, monthlyBudgets, selectedMonthlyBudget } = useSelector(budgetProfileSelector);
    const { monthlyExpenses } = useSelector(expenseSelector);
    const [showNewMonthlyBudgetForm, setShowNewMonthlyBudgetForm] = useState(false);
    const [monthlyAmount, setMonthlyAmount] = useState(0);

    useEffect(() => {
        dispatch(getBudgetProfile());
    }, [dispatch])

    useEffect(() => {
        if (monthlyBudgets.length > 0 && !selectedMonthlyBudget) {
            onMonthlyBudget(monthlyBudgets[0])
        }
    }, [monthlyBudgets]);

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
    }, [loading]);

    useEffect(() => {
        // console.log(monthlyExpenses)
    }, [monthlyExpenses]);

    const renderMonthlyBudgets = () => {
        if (monthlyBudgets.length === 0) {
            return null;
        }
        return monthlyBudgets.map(m => 
            <MenuItemOption 
                key={m._id} 
                value={m.monthYear} 
                onClick={()=>onMonthlyBudget(m)}
            >
                    {m.monthYearString}
            </MenuItemOption>
        )
    };

    const onMonthlyBudget = (m) => {
        dispatch(setSelectedMonthlyBudget(m));
        dispatch(getMonthlyExpenses(m.monthYear));
        setMonthlyAmount(m.amount);
    };

    const onNewMonthlyBudget = () => {

    };

    const onMonthlyAmountChange = (value) => {
        setMonthlyAmount(value.replace(/^\$/, ''));
    };

    const onSaveMonthlyAmount = () => {
        if (!selectedMonthlyBudget || monthlyAmount == selectedMonthlyBudget.amount) {
            return;
        }
        const { _id, monthYear } = selectedMonthlyBudget
        dispatch(updateMonthlyBudget(_id, monthYear, monthlyAmount))
    };

    const getTotalExpenses = () => {
        console.log(monthlyExpenses)
        const totalExpenses = monthlyExpenses.map(e => e.cost).reduce((a,b) => a + b, 0)
        const totalExpensesToPrecisionTwo = Number.parseFloat(totalExpenses).toFixed(2)
        return `$${totalExpensesToPrecisionTwo}`
    }

    return (
        <Flex minW={'30vw'} marginTop={'5vh'}>
            <VStack align={'center'} minW={'100%'} spacing={'5vh'}>
                <Flex minW={'100%'}>
                    <HStack minW={'100%'} justify={'center'} spacing={'1vh'}>
                    <Menu matchWidth>
                        <MenuButton as={Button} leftIcon={<CalendarIcon />} rightIcon={<ChevronDownIcon />} size={'lg'} width={'50%'}>
                            {selectedMonthlyBudget ? selectedMonthlyBudget.monthYearString : null}
                        </MenuButton>
                        <MenuList style={{ margin: 0 }}>
                            <MenuOptionGroup type='radio'>{renderMonthlyBudgets()}</MenuOptionGroup>
                            <MenuDivider />
                            <MenuItem icon={<AddIcon />}>New Monthly Budget</MenuItem>
                        </MenuList>
                    </Menu>
                    <Button colorScheme={'blue'} size={'md'}>Update</Button>
                    <Button colorScheme={'red'} size={'md'}>Delete</Button>
                    </HStack>
                </Flex>
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
                        isDisabled={!selectedMonthlyBudget || monthlyAmount == selectedMonthlyBudget.amount}
                        onClick={onSaveMonthlyAmount}
                    >
                        Save
                    </Button>
                </HStack>
                <HStack justify={'center'} minW={'100%'} spacing={'1vw'}>
                    <Heading size={'md'} noOfLines={1}>Total Expenses: </Heading>
                    <Text 
                        width={'35%'}
                        fontSize={'xl'}
                    >
                        {getTotalExpenses()} 
                    </Text>
                </HStack>
                <Divider />
            </VStack>
        </Flex>
    );
};

export default MonthOverview;
