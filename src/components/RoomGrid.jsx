import { ArrowRight } from 'lucide-react';

const RoomGrid = () => {
  const rooms = [
    {
      id: 1,
      title: "Suite Panoramique",
      description: "Une vue imprenable sur la piscine et la tour octogonale de l'hôtel. Luxe et confort absolu.",
      image: "https://images.unsplash.com/photo-1611892440507-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      features: ["65m²", "Vue panoramique", "Terrasse privée", "King Size"]
    },
    {
      id: 2,
      title: "Chambre Luxe Tower",
      description: "Élégance et modernité dans notre tour emblématique. Un séjour inoubliable vous attend.",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      features: ["45m²", "Vue ville", "Climatisation", "Queen Size"]
    },
    {
      id: 3,
      title: "Appartement Présidentiel",
      description: "L'excellence absolue avec services dédiés. Pour les séjours les plus prestigieux.",
      image: "https://images.unsplash.com/photo-1590490360807-2875d56a2006?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      features: ["120m²", "2 chambres", "Salon privé", "Services VIP"]
    }
  ];

  return (
    <section id="chambres" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            Nos Chambres d'Exception
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chaque espace a été conçu pour offrir un confort inégalé et une expérience mémorable
          </p>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              {/* Room Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={room.image} 
                  alt={room.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-gray-800">{room.features[0]}</span>
                </div>
              </div>

              {/* Room Content */}
              <div className="p-6">
                <h3 className="text-2xl font-serif text-gray-900 mb-3">
                  {room.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {room.description}
                </p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {room.features.slice(1).map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 bg-green-800 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button className="w-full bg-green-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-900 transition-colors flex items-center justify-center gap-2 group">
                  VOIR LA FICHE
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoomGrid;
