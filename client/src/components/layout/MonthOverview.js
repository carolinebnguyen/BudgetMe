import React, { useEffect } from 'react';
import {
    Button,
    Flex,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
} from '@chakra-ui/react';
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons';

const MonthOverview = () => {
    return (
        <Flex minW={'30vw'} justify="center">
            <Menu isOpen>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    Actions
                </MenuButton>
                <MenuList>
                    <MenuItem>Download</MenuItem>
                    <MenuItem>Create a Copy</MenuItem>
                    <MenuItem tabIndex={0}>Mark as Draft</MenuItem>
                    <MenuItem>Delete</MenuItem>
                    <MenuItem icon={<AddIcon />}>New Monthly Budget</MenuItem>
                </MenuList>
            </Menu>
        </Flex>
    );
};

export default MonthOverview;
