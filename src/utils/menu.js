// src/utils/menu.js
export const getMenuItems = () => {
  // Retrieve menu items from localStorage or use default values
  const storedItems = localStorage.getItem('menuItems');
  
  if (storedItems) {
    return JSON.parse(storedItems);
  }
  
  // Default menu if nothing is stored
  const defaultMenu = [
    // ☕️ Drinks
    {
      id: '1',
      name: 'Espresso',
      price: 2.5,
      category: 'drinks',
      image: '/espresso.jpg',
      description: 'Intense and bold coffee shot with rich crema',
      isNew: false,
      isFeatured: true
    },
    {
      id: '2',
      name: 'Cappuccino',
      price: 4.0,
      category: 'drinks',
      image: '/cappuccino.jpg',
      description: 'Espresso with steamed milk and velvety foam',
      isNew: false,
      isFeatured: true
    },
    {
      id: '3',
      name: 'Latte',
      price: 4.5,
      category: 'drinks',
      image: '/latte.jpg',
      description: 'Espresso with steamed milk and a light layer of foam',
      isNew: false,
      isFeatured: false
    },
    {
      id: '4',
      name: 'Americano',
      price: 3.0,
      category: 'drinks',
      image: '/americano.jpg',
      description: 'Espresso diluted with hot water for a milder flavor',
      isNew: false,
      isFeatured: false
    },
    {
      id: '5',
      name: 'Macchiato',
      price: 3.5,
      category: 'drinks',
      image: '/macchiato.jpg',
      description: 'Espresso "stained" with a touch of foamed milk',
      isNew: false,
      isFeatured: false
    },
    {
      id: '6',
      name: 'Flat White',
      price: 4.0,
      category: 'drinks',
      image: '/flatwhite.jpg',
      description: 'Smooth espresso with steamed milk and minimal foam',
      isNew: false,
      isFeatured: false
    },
    {
      id: '7',
      name: 'Mocha',
      price: 4.5,
      category: 'drinks',
      image: '/mocha.jpg',
      description: 'Espresso with chocolate, steamed milk and whipped cream',
      isNew: false,
      isFeatured: true
    },
    {
      id: '8',
      name: 'Cold Brew',
      price: 4.0,
      category: 'drinks',
      image: '/coldbrew.jpg',
      description: 'Smooth cold coffee brewed over 12+ hours',
      isNew: false,
      isFeatured: false
    },
    {
      id: '9',
      name: 'Chai Latte',
      price: 4.0,
      category: 'drinks',
      image: '/chai-latte.jpg',
      description: 'Spiced tea blend with steamed milk and foam',
      isNew: false,
      isFeatured: false
    },
    {
      id: '10',
      name: 'Green Tea',
      price: 3.0,
      category: 'drinks',
      image: '/green-tea.jpg',
      description: 'Aromatic green tea brewed to perfection',
      isNew: false,
      isFeatured: false
    },
  
    // 🥐 Food
    {
      id: '11',
      name: 'Butter Croissant',
      price: 3.0,
      category: 'food',
      image: '/croissant.jpg',
      description: 'Flaky and buttery French pastry',
      isNew: false,
      isFeatured: true
    },
    {
      id: '12',
      name: 'Blueberry Muffin',
      price: 3.5,
      category: 'food',
      image: '/blueberry-muffin.jpg',
      description: 'Moist muffin filled with blueberries',
      isNew: false,
      isFeatured: false
    },
    {
      id: '13',
      name: 'Chocolate Muffin',
      price: 3.5,
      category: 'food',
      image: '/chocolate-muffin.jpg',
      description: 'Rich and fluffy chocolate muffin',
      isNew: false,
      isFeatured: false
    },
    {
      id: '14',
      name: 'Avocado Toast',
      price: 6.0,
      category: 'food',
      image: '/avocado-toast.jpg',
      description: 'Multigrain toast topped with smashed avocado',
      isNew: false,
      isFeatured: true
    },
    {
      id: '15',
      name: 'Breakfast Sandwich',
      price: 5.5,
      category: 'food',
      image: '/breakfast-sandwich.jpg',
      description: 'Egg, cheese and sausage on toasted bun',
      isNew: true,
      isFeatured: false
    },
    {
      id: '16',
      name: 'Chicken Panini',
      price: 7.5,
      category: 'food',
      image: '/chicken-panini.jpg',
      description: 'Grilled panini with chicken, cheese, and veggies',
      isNew: true,
      isFeatured: true
    },
    {
      id: '17',
      name: 'Vegetable Wrap',
      price: 6.5,
      category: 'food',
      image: '/vegetable-wrap.jpg',
      description: 'Fresh veggie wrap with hummus and greens',
      isNew: false,
      isFeatured: false
    },
  
    // 🎂 Specials / Hero Items
    {
      id: '18',
      name: 'Pumpkin Spice Latte',
      price: 5.0,
      category: 'specials',
      image: '/pumpkin-spice.jpg',
      description: 'Seasonal favorite with pumpkin, spices, and espresso',
      isNew: true,
      isFeatured: true
    }
  ];
  
  
  // Save default menu to localStorage
  localStorage.setItem('menuItems', JSON.stringify(defaultMenu));
  
  return defaultMenu;
};

export const getCategories = () => {
  return ['drinks', 'food', 'desserts', 'specials'];
};

export const getCategoryDetails = () => {
  return {
    drinks: {
      name: 'Coffee & Drinks',
      icon: 'FaCoffee',
      description: 'Premium coffee beverages crafted with our house-roasted beans'
    },
    food: {
      name: 'Food',
      icon: 'FaUtensils',
      description: 'Fresh, house-made breakfast and lunch options'
    },
    desserts: {
      name: 'Desserts',
      icon: 'FaBirthdayCake',
      description: 'Sweet treats to complement your coffee experience'
    },
    specials: {
      name: 'Neo Cafe Specials',
      icon: 'FaStar',
      description: 'Unique offerings and seasonal specialties created by our master baristas'
    }
  };
};

export const getFeaturedItems = () => {
  const allItems = getMenuItems();
  return allItems.filter(item => item.isFeatured);
};

export const getNewItems = () => {
  const allItems = getMenuItems();
  return allItems.filter(item => item.isNew);
};

export const getItemById = (id) => {
  const allItems = getMenuItems();
  return allItems.find(item => item.id === id);
};

export const searchMenuItems = (query) => {
  if (!query) return getMenuItems();
  
  const allItems = getMenuItems();
  const searchTerm = query.toLowerCase();
  
  return allItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm) || 
    item.description.toLowerCase().includes(searchTerm) ||
    item.category.toLowerCase().includes(searchTerm)
  );
};

export const filterItemsByPrice = (maxPrice) => {
  if (!maxPrice) return getMenuItems();
  
  const allItems = getMenuItems();
  return allItems.filter(item => item.price <= maxPrice);
};

export const getItemsByCategory = (category) => {
  if (!category || category === 'all') return getMenuItems();
  
  const allItems = getMenuItems();
  return allItems.filter(item => item.category === category);
};