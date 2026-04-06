import { useState } from 'react';
import { Calendar, Users, Search } from 'lucide-react';

const HeroSection = () => {
  const [formData, setFormData] = useState({
    arrival: '',
    departure: '',
    adults: '2'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Recherche de disponibilités:', formData);
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://tse1.mm.bing.net/th/id/OIP.LHgZbC6yDkf_ReBz_BGTDwHaFj?rs=1&pid=ImgDetMain&o=7&rm=3" 
          alt="Hôtel Président Yamoussoukro" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 z-10"></div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-6xl mx-auto w-full">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-yellow-400 mb-6 leading-tight drop-shadow-lg">
            L'ÉLÉGANCE AU CŒUR
            <br />
            DE LA CÔTE D'IVOIRE
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light drop-shadow">
            Découvrez un hébergement d'exception au cœur de Yamoussoukro
          </p>
        </div>

        {/* Booking Bar */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Arrival */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arrivée
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  name="arrival"
                  value={formData.arrival}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Departure */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Départ
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  name="departure"
                  value={formData.departure}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Adults */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adultes
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  name="adults"
                  value={formData.adults}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent appearance-none"
                >
                  <option value="1">1 adulte</option>
                  <option value="2">2 adultes</option>
                  <option value="3">3 adultes</option>
                  <option value="4">4 adultes</option>
                  <option value="5">5 adultes</option>
                  <option value="6">6 adultes</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-green-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-900 transition-colors flex items-center justify-center gap-2"
              >
                <Search size={20} />
                VOIR NOS DISPONIBILITÉS
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
