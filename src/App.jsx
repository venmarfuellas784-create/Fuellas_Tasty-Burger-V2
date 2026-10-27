import React, { useState } from 'react';
import './App.css';

const burgerData = [
  {
    id: 1,
    name: "Caramelized Burger",
    description: "Juicy beef patty topped with sweet caramelized onions, melted cheese, and savory sauce.",
    price: 199,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Gourmet Picanha Bacon Burger",
    description: "Premium picanha beef, crispy bacon, melted cheese, and rich signature sauce.",
    price: 229,
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Turkey Burger",
    description: "Juicy turkey patty with fresh lettuce, tomato, and creamy sauce in a soft toasted bun.",
    price: 249,
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Indian Veggie Burger",
    description: "Flavorful veggie patty with Indian-inspired spices, fresh vegetables, and creamy sauce.",
    price: 249,
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&auto=format&fit=crop"
  }
];

export default function App() {
  const [quantities, setQuantities] = useState({ 1: 0, 2: 0, 3: 0, 4: 0 });
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  
  // ✨ State para sa pag-click ng burger card (para sa burger details modal)
  const [selectedBurger, setSelectedBurger] = useState(null);

  const changeQuantity = (id, delta) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const addToCart = (burger, e) => {
    // Pigilan na mag-bukas ang card details modal kapag ang pinindot ay ang quantity o add to cart button
    if (e) e.stopPropagation();

    const qty = quantities[burger.id];
    if (qty <= 0) {
      showNotification("Mangyaring pumili muna ng tamang dami bago idagdag sa cart.");
      return;
    }

    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === burger.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === burger.id ? { ...item, quantity: item.quantity + qty } : item
        );
      } else {
        return [...prevCart, { ...burger, quantity: qty }];
      }
    });

    setQuantities(prev => ({
      ...prev,
      [burger.id]: 0
    }));

    showNotification(`Matagumpay na naidagdag ang ${qty}x ${burger.name} sa iyong cart.`);

    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification("");
    }, 3500);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      showNotification("Walang laman ang iyong cart.");
      return;
    }
    showNotification(`Maraming salamat sa iyong order! Kabuuang Bayarin: ₱${totalPrice}.`);
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <div className="app">
      {notification && (
        <div className="notification-banner">
          <span>{notification}</span>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">🍔 Hamburger</div>
        <div className="nav-links">
          <a href="#about">ABOUT</a>
          <a href="#menu">OUR MENU</a>
          <a href="#shop">SHOP</a>
          <a href="#contact">CONTACT</a>
          <button className={`cart-btn ${isAnimating ? 'cart-bounce' : ''}`} onClick={() => setIsCartOpen(true)}>
            🛒 Cart ({totalItems})
          </button>
        </div>
      </nav>

      {/* HERO BANNER */}
      <header className="hero">
        <h1 className="hero-title">HAMBURGER</h1>
        <div className="hero-content">
          <div className="burger-image-container">
            <img 
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop" 
              alt="Main Burger" 
              className="main-burger-img"
            />
            <span className="price-tag">ONLY ₱199</span>
          </div>
          <div className="hero-text">
            <button className="order-btn" onClick={() => setIsCartOpen(true)}>ORDER NOW</button>
            <h3>Our Cheese Burger</h3>
            <p>A juicy beef patty topped with melted cheese, fresh veggies, and a delicious sauce, all in a soft toasted bun.</p>
          </div>
        </div>
      </header>

      {/* MENU SECTION - CLICKABLE CARDS */}
      <section className="menu-container">
        <div className="burger-grid">
          {burgerData.map((burger) => (
            <div 
              key={burger.id} 
              className="burger-card clickable-card"
              onClick={() => setSelectedBurger(burger)} // ✨ Kapag kinlik ang card, bubukas ang details modal
            >
              <img src={burger.image} alt={burger.name} className="card-img" />
              <h2>{burger.name}</h2>
              <p className="description">{burger.description}</p>
              <p className="price">₱{burger.price}</p>
              
              <div className="quantity-controls" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => changeQuantity(burger.id, -1)}>-</button>
                <span>{quantities[burger.id]}</span>
                <button onClick={() => changeQuantity(burger.id, 1)}>+</button>
              </div>

              <button className="add-cart-btn" onClick={(e) => addToCart(burger, e)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ✨ BURGER DETAILS POPUP MODAL */}
      {selectedBurger && (
        <div className="modal-overlay" onClick={() => setSelectedBurger(null)}>
          <div className="modal-content burger-detail-modal" onClick={(e) => e.stopPropagation()}>
            <img src={selectedBurger.image} alt={selectedBurger.name} className="detail-img" />
            <h2>{selectedBurger.name}</h2>
            <p className="detail-desc">{selectedBurger.description}</p>
            <p className="price" style={{ fontSize: '1.3rem', margin: '15px 0' }}>₱{selectedBurger.price}</p>
            <button className="close-btn" style={{ width: '100%' }} onClick={() => setSelectedBurger(null)}>Isara</button>
          </div>
        </div>
      )}

      {/* CART MODAL POPUP */}
      {isCartOpen && (
        <div className="modal-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>🛒 Buod ng Iyong Order</h2>
            {cart.length === 0 ? (
              <p className="empty-msg">Kasalukuyang walang laman ang iyong shopping cart.</p>
            ) : (
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>₱{item.price * item.quantity}</span>
                  </div>
                ))}
                <hr />
                <div className="cart-total">
                  <strong>Kabuuan:</strong>
                  <strong>₱{totalPrice}</strong>
                </div>
              </div>
            )}
            <div className="modal-actions">
              <button className="close-btn" onClick={() => setIsCartOpen(false)}>Isara</button>
              {cart.length > 0 && (
                <button className="checkout-btn" onClick={handleCheckout}>Mag-checkout</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}