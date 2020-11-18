// import react from 'react';
import { BrowserRouter as Router, route } from 'react-router-dom';
import { Container } from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import MenuBar from './components/MenuBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Container>
        <MenuBar />
        <route exact path='/' component={Home} />
        <route exact path='/login' component={Login} />
        <route exact path='/register' component={Register} />
      </Container>
    </Router>

  );
}

export default App;
