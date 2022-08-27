import { useRef } from 'react';
import { useToast } from '@chakra-ui/react';

export const useLoadingNotification = () => {
    const toast = useToast();
    const toastIdRef = useRef();
    let state = {
        position: 'top',
        duration: null,
        isClosable: true,
        containerStyle: {
            marginTop: '6vh',
        },
    }

    const displayLoading = (msg) => {
        state = {
            ...state,
            title: msg,
            status: 'loading'
        }
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
        state = {
            ...state,
            title: 'Success!',
            description: msg,
            status: 'success',
            duration: 2000,
        }
        if (!toastIdRef.current) {
            toastIdRef.current = toast(state);
        } else {
            toast.update(toastIdRef.current, state);
        }
    };

    const displayError = (msg) => {
        state = {
            ...state,
            title: 'Error!',
            description: msg,
            status: 'error',
            duration: 2000,
        }
        if (!toastIdRef.current) {
            toastIdRef.current = toast(state);
        } else {
            toast.update(toastIdRef.current, state);
        }
    };

    return {
        displayLoading,
        displaySuccess,
        displayError,
    };
};
