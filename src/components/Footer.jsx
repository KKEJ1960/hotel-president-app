import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Hotel Info */}
          <div>
            <h3 className="text-2xl font-serif mb-4">Hôtel Président</h3>
            <p className="text-gray-400 mb-4">
              L'hébergement de prestige au cœur de Yamoussoukro, 
              alliant luxe ivoirien et service d'excellence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-medium mb-4">Liens Rapides</h4>
            <ul className="space-y-2">
              <li><a href="#chambres" className="text-gray-400 hover:text-white transition-colors">Nos Chambres</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
              <li><a href="#restaurant" className="text-gray-400 hover:text-white transition-colors">Restaurant</a></li>
              <li><a href="#spa" className="text-gray-400 hover:text-white transition-colors">Spa & Bien-être</a></li>
              <li><a href="#evenements" className="text-gray-400 hover:text-white transition-colors">Événements</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-medium mb-4">Services</h4>
            <ul className="space-y-2">
              <li><span className="text-gray-400">Conciergerie 24/7</span></li>
              <li><span className="text-gray-400">Navette aéroport</span></li>
              <li><span className="text-gray-400">Business center</span></li>
              <li><span className="text-gray-400">Piscine extérieure</span></li>
              <li><span className="text-gray-400">Salle de sport</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-medium mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-green-400" />
                <span className="text-gray-400">
                  Yamoussoukro, Côte d'Ivoire
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-green-400" />
                <span className="text-gray-400">
                  +225 27 00 000 000
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-green-400" />
                <span className="text-gray-400">
                  reservation@hotelpresident.ci
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Hôtel Président Yamoussoukro. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Mentions légales
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                CGV
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
