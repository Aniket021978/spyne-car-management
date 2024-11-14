import './App.css';
import Footer from './Home/Footer';
import HomeMain from './Home/HomeMain';
import Navbar from './Home/Navbar';
import {BrowserRouter as Router, Route,Routes} from 'react-router-dom'
import Login from './pages/Login';
import Register from './pages/Register';
import About from './Home/About';
import NotFound from './pages/NotFound';
import CarsFilterpage from './Home/CarsFilterpage';
import { Toaster } from 'react-hot-toast';
import SellCar from './Home/SellCar';
import MyCar from './Home/MyCar';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
      <Route path='/' element={<HomeMain />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/about' element={<About />} />
      <Route path='/cars' element={<CarsFilterpage />} />
      <Route path='/carsell' element={<SellCar />} />
      <Route path="/carsell/:carId" element={<SellCar />} />
      <Route path='/mycar' element={<MyCar />} />
      <Route path='/*' element={<NotFound/>} />
      </Routes>
      <Toaster containerStyle={{zIndex:'9999999'}} reverseOrder={true}/>
      <Footer/>
    </Router>
  );
}

export default App;
