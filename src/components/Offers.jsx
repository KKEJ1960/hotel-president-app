import { Gift, Clock, Sparkles } from 'lucide-react';

const Offers = () => {
  const offers = [
    {
      id: 1,
      title: "Séjour Romantique",
      description: "2 nuits, petit-déjeuner, dîner aux chandelles et spa inclus",
      discount: "20% de réduction",
      icon: <Sparkles size={24} />,
      color: "bg-pink-50 border-pink-200",
      buttonColor: "bg-pink-600 hover:bg-pink-700"
    },
    {
      id: 2,
      title: "Weekend Détente",
      description: "3 nuits, accès illimité au spa, massage inclus",
      discount: "15% de réduction",
      icon: <Clock size={24} />,
      color: "bg-blue-50 border-blue-200",
      buttonColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
      id: 3,
      title: "Forfait Affaires",
      description: "WiFi haut débit, salle de réunion, petit-déjeuner",
      discount: "10% de réduction",
      icon: <Gift size={24} />,
      color: "bg-green-50 border-green-200",
      buttonColor: "bg-green-600 hover:bg-green-700"
    }
  ];

  return (
    <section id="offres" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            Offres Exclusives
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Profitez de nos offres spéciales pour un séjour inoubliable
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div key={offer.id} className={`border-2 ${offer.color} rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300`}>
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${offer.buttonColor} text-white mb-6`}>
                {offer.icon}
              </div>

              {/* Discount Badge */}
              <div className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                {offer.discount}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-serif text-gray-900 mb-3">
                {offer.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {offer.description}
              </p>

              {/* CTA Button */}
              <button className={`w-full ${offer.buttonColor} text-white py-3 px-6 rounded-lg font-medium transition-colors`}>
                Réserver cette offre
              </button>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-green-800 to-green-900 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-serif mb-4">
            Besoin d'un séjour sur mesure ?
          </h3>
          <p className="text-xl mb-8 text-green-100">
            Notre équipe est à votre disposition pour créer l'expérience parfaite
          </p>
          <button className="bg-white text-green-800 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Contacter notre conciergerie
          </button>
        </div>
      </div>
    </section>
  );
};

export default Offers;
