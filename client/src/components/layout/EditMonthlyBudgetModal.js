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
} from '@chakra-ui/react';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { budgetProfileSelector } from '../../slices/budgetProfile.js';
import { updateMonthlyBudget } from '../../actions/budgetProfile.js';

const EditMonthlyBudgetModal = ({isOpen, onClose}) => {
    const dispatch = useDispatch();
    const { selectedMonthlyBudget } = useSelector(budgetProfileSelector);
    const currDate = new Date();
    const [yearMonth, setYearMonth] = useState();

    useEffect(() => {
        if (selectedMonthlyBudget) {
            const selectedDate = new Date(selectedMonthlyBudget.monthYearString);
            setYearMonth(selectedDate.toISOString().slice(0,7));
        }
        onClose();
    }, [selectedMonthlyBudget]);

    const onUpdateMonthlyBudget = () => {
        const monthYear = yearMonth.split('-').reverse().join('-');
        dispatch(updateMonthlyBudget(selectedMonthlyBudget._id, monthYear, selectedMonthlyBudget.amount));
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
            <ModalHeader>Edit monthly budget</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Heading as='h4' size='sm'>
                    Change month and year:
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
            </ModalBody>
            <ModalFooter>
                <Button colorScheme='gray' mr={3} onClick={onClose}>
                    Cancel
                </Button>
                <Button colorScheme='green' onClick={onUpdateMonthlyBudget}>Update</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EditMonthlyBudgetModal;