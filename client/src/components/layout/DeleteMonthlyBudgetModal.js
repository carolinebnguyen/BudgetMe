import { useEffect } from 'react';
import {
    Button,
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
import { deleteMonthlyBudget } from '../../actions/budgetProfile.js';

const DeleteMonthlyBudgetModal = ({isOpen, onClose}) => {
    const dispatch = useDispatch();
    const { selectedMonthlyBudget } = useSelector(budgetProfileSelector);

    useEffect(() => {
        onClose();
    }, [selectedMonthlyBudget]);

    const onDeleteMonthlyBudget = () => {
        console.log(selectedMonthlyBudget);
        dispatch(deleteMonthlyBudget(selectedMonthlyBudget._id));
    }

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            isCentered
        >
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Delete Monthly Budget</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                Are you sure? You can't undo this action afterwards.
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='gray' mr={3} onClick={onClose}>
                    Cancel
                </Button>
                <Button colorScheme='red' onClick={onDeleteMonthlyBudget}>Delete</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default DeleteMonthlyBudgetModal;