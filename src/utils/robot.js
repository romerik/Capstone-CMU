export const getRobotStatus = () => {
    // Simuler un statut de robot
    const statuses = ['idle', 'delivering', 'returning', 'charging'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const batteryLevel = Math.floor(Math.random() * 100);
    
    return {
      status,
      batteryLevel,
      location: {
        latitude: 48.8584 + (Math.random() - 0.5) * 0.01,
        longitude: 2.2945 + (Math.random() - 0.5) * 0.01
      }
    };
  };
  
  export const sendRobotCommand = (command) => {
    console.log(`Commande envoyée au robot: ${command}`);
    // Dans une vraie application, ceci enverrait une commande à un robot réel
    return { success: true, message: `Commande "${command}" exécutée avec succès` };
  };