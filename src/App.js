import { BrowserRouter,Routes, Route } from 'react-router-dom';
import './App.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Layout from './pages/Layout';
import EmployeeList from './pages/EmployeeList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route path='/' element={<Login/>}/>
          <Route path='/dashboard' element={<Home/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/employeelist' element={<EmployeeList/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
