import './styles.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Components/Pages/Login/Login';
import  Register from './Components/Pages/Register/Register';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/'element={<Login/>}/>
          <Route path='/Register'element={<Register/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
