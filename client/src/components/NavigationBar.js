import { Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <Flex
      flexDirection="row"
      width="100wh"
      height="10vh"
      backgroundColor="teal.500"
      justifyContent="space-evenly"
      alignItems="center"
    >
      <Link to="/login">Login</Link>
      <Link to="/signup">Sign Up</Link>
    </Flex>
  );
}

export default NavigationBar;