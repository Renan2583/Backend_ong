import GatoImg from '../assets/Cat.jpg'
import CaoImg from '../assets/Dog.jpg'
import Navbar from '../components/Navbar';
import '../styles/global.css'

const Home = () => (

  <>
    <div className="hero-duo">
      <a href="/Caes" className="hero-item">
        <img src={CaoImg} alt="Cães" />
        <span className="hero-text">Cães</span>
      </a>
      <a href="/Gatos" className="hero-item">
        <img src={GatoImg} alt="Gatos" />
        <span className="hero-text">Gatos</span>
      </a>
    </div>


      <Navbar />
  </>
);

export default Home