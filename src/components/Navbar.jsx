import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-serif text-gray-900">Hôtel Président</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#chambres" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Chambres
              </a>
              <a href="#services" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Services
              </a>
              <a href="#temoignages" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Témoignages
              </a>
              <a href="#contact" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Contact
              </a>
              <button className="bg-green-800 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-green-900 transition-colors">
                Réserver une Suite
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-gray-900 p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#chambres" className="block text-gray-700 hover:text-gray-900 px-3 py-2 text-base font-medium">
              Chambres
            </a>
            <a href="#services" className="block text-gray-700 hover:text-gray-900 px-3 py-2 text-base font-medium">
              Services
            </a>
            <a href="#temoignages" className="block text-gray-700 hover:text-gray-900 px-3 py-2 text-base font-medium">
              Témoignages
            </a>
            <a href="#contact" className="block text-gray-700 hover:text-gray-900 px-3 py-2 text-base font-medium">
              Contact
            </a>
            <button className="w-full text-left bg-green-800 text-white px-3 py-2 rounded-full text-base font-medium">
              Réserver une Suite
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
