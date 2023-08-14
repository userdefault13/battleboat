import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login'; 
import Signup from './pages/Signup'; 
import Logout from './pages/Logout'; 
import Landing from './pages/Landing'; 
import Lobby from './pages/Lobby'; 
import CreateGame from './pages/CreateGame'; 
import Game from './pages/Game'; 

const App = () => {
    return (
        <Router>
            <Routes>
                    <Route exact path="/" component={Landing} />
                    <Route path="/Signup" component={Signup} />
                    <Route path="/Login" exact component={Login} />
                    <Route path="/Logout" component={Logout} />
                    <Route path="/Lobby" component={Lobby} />
                    <Route path="/Create-game" component={CreateGame} />
                    <Route path="/Game" component={Game} />
                    {/* Add your other routes here */}
            </Routes> 
        </Router>  
    );
};

export default App;
