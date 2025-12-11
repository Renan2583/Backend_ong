import { Link } from 'react-router-dom';
import GatoImg from '../assets/Cat.jpg'
import CaoImg from '../assets/Dog.jpg'
import Navbar from '../components/Navbar';
import '../styles/global.css'

const Home = () => (
  <>
    <Navbar />
    <div className="hero-duo">
      <Link to="/Caes" className="hero-item">
        <img src={CaoImg} alt="Cães" />
        <span className="hero-text">Cães</span>
      </Link>
      <Link to="/Gatos" className="hero-item">
        <img src={GatoImg} alt="Gatos" />
        <span className="hero-text">Gatos</span>
      </Link>
    </div>
  </>
);

export default Home