import { useRef } from 'react';
import { useToast } from '@chakra-ui/react';

export const useLoadingNotification = () => {
    const toast = useToast();
    const toastIdRef = useRef();
    let state;

    const displayLoading = (msg) => {
        state = {
            title: msg,
            status: 'loading',
            position: 'top',
            duration: null,
            isClosable: true,
            containerStyle: {
                marginTop: '6vh',
            },
        };
        toastIdRef.current = toast(state);
        const currentToastId = toastIdRef.current;
        setTimeout(() => {
            toast.update(currentToastId, {
                ...state,
                title: 'Error!',
                description: 'Request has been timed out.',
                status: 'error',
                duration: 2000,
            });
        }, 5000);
        return toastIdRef;
    };

    const displaySuccess = (msg) => {
        toast.update(toastIdRef.current, {
            ...state,
            title: 'Success!',
            description: msg,
            status: 'success',
            duration: 2000,
        });
    };

    const displayError = (msg) => {
        toast.update(toastIdRef.current, {
            ...state,
            title: 'Error!',
            description: msg,
            status: 'error',
            duration: 2000,
        });
    };

    return {
        displayLoading,
        displaySuccess,
        displayError,
    };
};
