import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <div className="bg-gray-100 p-8">
        <p>Si vous voyez ce message, l'application fonctionne avec Navbar et HeroSection !</p>
      </div>
    </div>
  );
}

export default App;
