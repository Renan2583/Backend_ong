import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => (

  <>

    <div class="hero-duo">
      <a href="/Caes" class="hero-item">
        <img src={CaoImg} alt="Cães" />
        <span class="hero-text">Cães</span>
      </a>
      <a href="/Gatos" class="hero-item">
        <img src={GatoImg} alt="Gatos" />
        <span class="hero-text">Gatos</span>
      </a>
    </div>


    <div className="container mt-4">
      <h1>Bem-vindo ao Sistema da ONG-ADAPV</h1>
    </div>
  </>
);

export default Home