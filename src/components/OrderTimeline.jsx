// src/components/OrderTimeline.jsx
import { FaClock, FaCheck, FaTruck, FaHourglassHalf } from 'react-icons/fa';

const OrderTimeline = ({ orders = [] }) => {
  // S'il n'y a pas de commandes, afficher un message
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-coffee-latte">
        <h3 className="font-semibold text-lg mb-4">Recent activities</h3>
        <div className="text-center py-8 text-gray-500">
          Aucune commande récente
        </div>
      </div>
    );
  }
  
  // Trier les commandes par date (la plus récente en premier)
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );
  
  // Limiter à 5 commandes
  const recentOrders = sortedOrders.slice(0, 5);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-coffee-latte">
      <h3 className="font-semibold text-lg mb-4">Recent activities</h3>
      
      <div className="space-y-4">
        {recentOrders.map((order) => {
          let Icon;
          let statusColor;
          
          switch (order.status) {
            case 'preparing':
              Icon = FaHourglassHalf;
              statusColor = 'text-yellow-500';
              break;
            case 'delivering':
              Icon = FaTruck;
              statusColor = 'text-blue-500';
              break;
            case 'completed':
              Icon = FaCheck;
              statusColor = 'text-green-500';
              break;
            default:
              Icon = FaClock;
              statusColor = 'text-gray-500';
          }
          
          return (
            <div key={order.id} className="flex items-start">
              <div className={`rounded-full p-2 ${
                statusColor.replace('text', 'bg').replace('500', '100')
              } ${statusColor} mr-3`}>
                <Icon size={14} />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Commande #{order.id.substring(0, 8)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {order.items.length} article{order.items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <p className="text-sm font-medium">{order.total.toFixed(2)} €</p>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <p className={`text-xs ${statusColor} font-medium uppercase`}>
                    {order.status === 'preparing' ? 'En préparation' : 
                     order.status === 'delivering' ? 'En livraison' : 
                     order.status === 'completed' ? 'Complétée' : 'En attente'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;