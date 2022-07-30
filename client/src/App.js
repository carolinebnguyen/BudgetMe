import React from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import { Box } from  '@chakra-ui/react';
import NavigationBar from './components/NavigationBar';

const App = () => {
  const [data, setData] = React.useState(null);

  // TODO: Pass into navbar and login/signup page
  // If user is defined, navbar does not show login/signup but instead shows profile pic, name
  // If user is defined, login and signup page just redirects route back to main page
  // If user is not defined, navbar shows login/signup links
  // If user is not defined, login/signup page defines user after successful login/signup and redirects to main page.
  const [user, setUser] = React.useState(null);


  // TODO: Remove after using somewhere else
  React.useEffect(() => {
    fetch('/api')
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <Box 
      className="App"
    >
      <NavigationBar />
      {/* <header className="App-header">
        <img src='/budgetme.png' className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
      </header> */}
      <Outlet />
    </Box>
  );
}

export default App;
