import { useEffect } from 'react';
import {
    Box,
    Button,
    HStack,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuOptionGroup,
    MenuDivider,
    useDisclosure
} from '@chakra-ui/react';
import { AddIcon, CalendarIcon, ChevronDownIcon } from '@chakra-ui/icons';
import NewMonthlyBudgetModal from './NewMonthlyBudgetModal.js';
import EditMonthlyBudgetModal from './EditMonthlyBudgetModal.js';
import DeleteMonthlyBudgetModal from './DeleteMonthlyBudgetModal.js';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { budgetProfileSelector, setSelectedMonthlyBudget } from '../../slices/budgetProfile.js';
import { getMonthlyExpenses } from '../../actions/expense.js';

const MonthlyBudgetSelector = () => {
    const dispatch = useDispatch();
    const { monthlyBudgets, selectedMonthlyBudget } = useSelector(budgetProfileSelector);

    const { isOpen: isNewMonthlyBudgetOpen, onOpen: onNewMonthlyBudgetOpen, onClose: onNewMonthlyBudgetClose } = useDisclosure();
    const { isOpen: isEditMonthlyBudgetOpen, onOpen: onEditMonthlyBudgetOpen, onClose: onEditMonthlyBudgetClose } = useDisclosure();
    const { isOpen: isDeleteMonthlyBudgetOpen, onOpen: onDeleteMonthlyBudgetOpen, onClose: onDeleteMonthlyBudgetClose } = useDisclosure();

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
    };

    return (
        <>
            <HStack spacing={'1vh'}>
                <Box>
                    <Menu matchWidth>
                        <MenuButton as={Button} leftIcon={<CalendarIcon />} rightIcon={<ChevronDownIcon />} size={'lg'} width={'20vw'}>
                            {selectedMonthlyBudget ? selectedMonthlyBudget.monthYearString : null}
                        </MenuButton>
                        <MenuList style={{ margin: 0 }}>
                            <MenuOptionGroup type='radio'>{renderMonthlyBudgets()}</MenuOptionGroup>
                            <MenuDivider />
                            <MenuItem icon={<AddIcon />} onClick={onNewMonthlyBudgetOpen}>New Monthly Budget</MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
                <Button colorScheme={'blue'} size={'md'} onClick={onEditMonthlyBudgetOpen}>Edit</Button>
                <Button colorScheme={'red'} size={'md'} onClick={onDeleteMonthlyBudgetOpen}>Delete</Button>
            </HStack>
            <NewMonthlyBudgetModal isOpen={isNewMonthlyBudgetOpen} onClose={onNewMonthlyBudgetClose} />
            <EditMonthlyBudgetModal isOpen={isEditMonthlyBudgetOpen} onClose={onEditMonthlyBudgetClose} />
            <DeleteMonthlyBudgetModal isOpen={isDeleteMonthlyBudgetOpen} onClose={onDeleteMonthlyBudgetClose} />
        </>
    )
}

export default MonthlyBudgetSelector;