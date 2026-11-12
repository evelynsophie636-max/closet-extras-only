import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, Menu, X, ChevronRight, Phone, Mail, MapPin, ArrowRight, MessageCircle } from 'lucide-react';

// --- DATA & PRODUCTS ---
const initialProducts = [
  {
    id: 1,
    name: "Contrast Collar Sleeveless Skater Dress",
    category: "fashion",
    price: 8000,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800",
    description: "A chic sleeveless skater dress with a sharp contrast collar for an effortless day-to-night look.",
    colors: ["Black/White", "Navy/White"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: 2,
    name: "Elegant Side-Ruched Maxi Dress",
    category: "fashion",
    price: 12000,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800",
    description: "Flattering silhouette featuring detailed side-ruching, made with soft breathable fabric.",
    colors: ["Emerald Green", "Burgundy", "Black"],
    sizes: ["S", "M", "L"],
    inStock: true
  },
  {
    id: 3,
    name: "Halter Neck Ruched Mermaid Maxi Gown",
    category: "fashion",
    price: 14000,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800",
    description: "Turn heads in this stunning halter neck gown designed to sculpt and accentuate your curves.",
    colors: ["Gold", "Champagne", "Wine"],
    sizes: ["M", "L"],
    inStock: true
  },
  {
    id: 4,
    name: "Polka Dot Tiered Ruffle Mini Dress",
    category: "fashion",
    price: 15000,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800",
    description: "Playful feminine mini dress with playful polka dots and tiered ruffle skirt detailing.",
    colors: ["Black Dot", "Red Dot"],
    sizes: ["XS", "S", "M"],
    inStock: true
  },
  {
    id: 5,
    name: "Long Sleeve Graphic Print Bodycon Mini Dress",
    category: "fashion",
    price: 14000,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?auto=format&fit=crop&q=80&w=800",
    description: "Bold graphic prints combined with a comfortable bodycon fit, perfect for weekend outings.",
    colors: ["Multicolor"],
    sizes: ["S", "M", "L"],
    inStock: true
  },
  {
    id: 6,
    name: "Hydrating Vitamin C Glow Serum",
    category: "skincare",
    price: 6500,
    originalPrice: 8500,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
    description: "Brighten skin tone and boost collagen production with our lightweight Vitamin C formula.",
    colors: ["Standard"],
    sizes: ["30ml"],
    inStock: true
  },
  {
    id: 7,
    name: "Minimalist Champagne Gold Watch",
    category: "wristwatches",
    price: 18500,
    originalPrice: 22000,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800",
    description: "Classic mesh strap timepiece engineered with Japanese quartz movement.",
    colors: ["Champagne Gold", "Rose Gold", "Silver"],
    sizes: ["One Size"],
    inStock: true
  },
  {
    id: 8,
    name: "Structured Faux Leather Crossbody Bag",
    category: "bags",
    price: 16000,
    originalPrice: 20000,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800",
    description: "Compact luxury leatherette shoulder bag with adjustable chain strap and gold hardware.",
    colors: ["Nude Beige", "Classic Black", "Taupe"],
    sizes: ["One Size"],
    inStock: true
  }
];

const calculateDiscountPercent = (original, current) => {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('ceo_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('ceo_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('ceo_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ceo_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product, selectedSize = null, selectedColor = null) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => 
        item.id === product.id && 
        item.selectedSize === (selectedSize || product.sizes?.[0]) && 
        item.selectedColor === (selectedColor || product.colors?.[0])
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, {
        ...product,
        quantity: 1,
        selectedSize: selectedSize || product.sizes?.[0] || 'Default',
        selectedColor: selectedColor || product.colors?.[0] || 'Default'
      }];
    });
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, delta) => {
    setCart(prev => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty > 0) {
        updated[index].quantity = newQty;
      }
      return updated;
    });
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) return prev.filter(item => item.id !== product.id);
      return [...prev, product];
    });
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans text-chocolate bg-ivory">
        {/* Announcement Bar */}
        <div className="bg-chocolate text-beige text-xs uppercase tracking-widest py-2 px-4 text-center font-medium">
          "Your Extras, Your Style, Your Confidence." — Benin City, Nigeria
        </div>

        {/* Navigation Header */}
        <header className="sticky top-0 z-40 bg-ivory/90 backdrop-blur-md border-b border-beige/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-chocolate">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link to="/" className="text-center md:text-left">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider block text-chocolate">
                  CLOSET EXTRAS ONLY
                </span>
                <span className="text-[10px] uppercase tracking-widest text-taupe block -mt-1 font-sans">
                  Fashion • Beauty • Lifestyle
                </span>
              </Link>

              <nav className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-wider font-medium">
                <Link to="/" className="hover:text-champagne transition-colors">Home</Link>
                <Link to="/shop" className="hover:text-champagne transition-colors">Shop All</Link>
                <Link to="/about" className="hover:text-champagne transition-colors">About</Link>
                <Link to="/contact" className="hover:text-champagne transition-colors">Contact</Link>
              </nav>

              <div className="flex items-center space-x-5">
                <Link to="/wishlist" className="relative p-1 text-chocolate hover:text-champagne">
                  <Heart className="w-5 h-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blush text-chocolate text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="relative p-1 text-chocolate hover:text-champagne">
                  <ShoppingBag className="w-5 h-5" />
                  {totalCartItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-champagne text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {totalCartItems}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden bg-ivory border-b border-beige px-6 py-4 space-y-3 font-medium text-sm tracking-wider uppercase">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-2">Home</Link>
              <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="block py-2">Shop All</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block py-2">About Us</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block py-2">Contact Us</Link>
            </div>
          )}
        </header>

        {/* Routes */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomeView addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
            <Route path="/shop" element={<ShopView addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
            <Route path="/product/:id" element={<ProductDetailView addToCart={addToCart} />} />
            <Route path="/cart" element={<CartView cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} />
            <Route path="/checkout" element={<CheckoutView cart={cart} />} />
            <Route path="/wishlist" element={<WishlistView wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />} />
            <Route path="/about" element={<AboutView />} />
            <Route path="/contact" element={<ContactView />} />
          </Routes>
        </main>

        {/* Floating WhatsApp Widget */}
        <a
          href="https://wa.me/2349161314677?text=Hello%20Closet%20Extras%20Only!%20I%20would%20like%20to%20make%20an%20enquiry."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
        >
          <MessageCircle className="w-7 h-7 fill-current" />
        </a>

        {/* Footer */}
        <footer className="bg-chocolate text-ivory pt-12 pb-6 border-t border-taupe/20 mt-16">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-serif text-lg font-bold mb-2">CLOSET EXTRAS ONLY</h3>
              <p className="text-xs text-taupe uppercase tracking-widest mb-2">"Your Extras, Your Style, Your Confidence."</p>
              <p className="text-sm text-beige/80">Ugbowo, Benin City, Edo State, Nigeria.</p>
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold mb-3 text-beige">Quick Links</h4>
              <ul className="space-y-2 text-sm text-beige/80">
                <li><Link to="/shop">Shop Catalogue</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold mb-3 text-beige">WhatsApp Community</h4>
              <a
                href="https://chat.whatsapp.com/Foeb1GvWGiz3Lof6ZmHse6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-champagne text-chocolate text-xs font-bold uppercase py-2.5 px-4"
              >
                Join Community Group
              </a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

// --- SUB-VIEWS / PAGES ---
function HomeView({ addToCart, wishlist, toggleWishlist }) {
  return (
    <div>
      <section className="bg-blush/30 py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-xs uppercase tracking-widest font-semibold text-taupe">Luxury Boutique</span>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-chocolate leading-tight">
            YOUR STYLE. YOUR BEAUTY.<br /><span className="text-champagne italic">YOUR EXTRAS.</span>
          </h1>
          <p className="text-sm sm:text-base text-chocolate/80">
            Carefully selected everyday essentials designed to make every moment feel special without breaking the bank.
          </p>
          <Link to="/shop" className="inline-block bg-chocolate text-iv0ry hover:bg-champagne hover:text-chocolate uppercase text-xs font-bold tracking-wider px-8 py-4 transition-colors">
            Shop Collection
          </Link>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-serif font-bold text-center mb-8">Featured Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {initialProducts.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} isWishlisted={wishlist.some(w => w.id === product.id)} toggleWishlist={toggleWishlist} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product, addToCart, isWishlisted, toggleWishlist }) {
  const discount = calculateDiscountPercent(product.originalPrice, product.price);
  return (
    <div className="bg-white border border-beige p-4 flex flex-col justify-between">
      <div className="relative aspect-square mb-3 overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
        {discount > 0 && <span className="absolute top-2 left-2 bg-chocolate text-beige text-[10px] px-2 py-0.5">{discount}% OFF</span>}
        <button onClick={() => toggleWishlist(product)} className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full">
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>
      <div>
        <span className="text-[10px] uppercase text-taupe">{product.category}</span>
        <Link to={`/product/${product.id}`} className="font-serif font-semibold text-sm line-clamp-1 block hover:text-champagne">{product.name}</Link>
        <div className="flex items-center space-x-2 mt-1">
          <span className="font-bold">₦{product.price.toLocaleString()}</span>
          {product.originalPrice && <span className="text-xs text-taupe line-through">₦{product.originalPrice.toLocaleString()}</span>}
        </div>
      </div>
      <button onClick={() => addToCart(product)} className="mt-4 w-full bg-chocolate text-ivory py-2 text-xs uppercase font-bold tracking-wider hover:bg-champagne hover:text-chocolate transition-colors">
        Add to Cart
      </button>
    </div>
  );
}

function ShopView({ addToCart, wishlist, toggleWishlist }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold text-center mb-8">Boutique Catalogue</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {initialProducts.map(product => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} isWishlisted={wishlist.some(w => w.id === product.id)} toggleWishlist={toggleWishlist} />
        ))}
      </div>
    </div>
  );
}

function ProductDetailView({ addToCart }) {
  const id = window.location.pathname.split('/').pop();
  const product = initialProducts.find(p => p.id === parseInt(id)) || initialProducts[0];
  const [size, setSize] = useState(product.sizes?.[0] || '');
  const [color, setColor] = useState(product.colors?.[0] || '');

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      <img src={product.image} alt={product.name} className="w-full h-[400px] object-cover border border-beige" />
      <div className="space-y-4">
        <span className="text-xs uppercase text-taupe font-bold">{product.category}</span>
        <h1 className="text-3xl font-serif font-bold">{product.name}</h1>
        <p className="text-xl font-bold">₦{product.price.toLocaleString()}</p>
        <p className="text-sm text-chocolate/80">{product.description}</p>
        <button onClick={() => addToCart(product, size, color)} className="w-full bg-chocolate text-ivory py-4 text-xs font-bold uppercase tracking-wider">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

function CartView({ cart, removeFromCart, updateQuantity }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (cart.length === 0) return <div className="text-center py-20"><h2 className="text-2xl font-serif">Cart is Empty</h2><Link to="/shop" className="underline text-xs mt-2 block">Go to Shop</Link></div>;
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-2xl font-serif font-bold">Shopping Cart</h1>
      {cart.map((item, idx) => (
        <div key={idx} className="flex justify-between items-center border-b border-beige pb-4">
          <div><h3 className="font-semibold">{item.name}</h3><p className="text-xs">Qty: {item.quantity}</p></div>
          <span className="font-bold">₦{(item.price * item.quantity).toLocaleString()}</span>
          <button onClick={() => removeFromCart(idx)} className="text-xs text-red-500 underline">Remove</button>
        </div>
      ))}
      <div className="flex justify-between font-bold text-lg pt-4"><span>Total:</span><span>₦{subtotal.toLocaleString()}</span></div>
      <Link to="/checkout" className="block text-center bg-chocolate text-ivory py-3 text-xs uppercase font-bold">Proceed to Checkout</Link>
    </div>
  );
}

function CheckoutView({ cart }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = (e) => {
    e.preventDefault();
    const msg = encodeURIComponent(`🛍️ *NEW ORDER*\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\nTotal: ₦${subtotal.toLocaleString()}`);
    window.open(`https://wa.me/2349161314677?text=${msg}`, '_blank');
  };

  return (
    <form onSubmit={handleOrder} className="max-w-xl mx-auto px-4 py-12 space-y-4">
      <h1 className="text-2xl font-serif font-bold">WhatsApp Checkout</h1>
      <input required placeholder="Full Name" className="w-full border p-3 text-sm" value={name} onChange={e => setName(e.target.value)} />
      <input required placeholder="Phone Number" className="w-full border p-3 text-sm" value={phone} onChange={e => setPhone(e.target.value)} />
      <textarea required placeholder="Delivery Address" className="w-full border p-3 text-sm" value={address} onChange={e => setAddress(e.target.value)}></textarea>
      <button type="submit" className="w-full bg-[#25D366] text-white py-4 font-bold text-xs uppercase">Place Order on WhatsApp</button>
    </form>
  );
}

function WishlistView({ wishlist, toggleWishlist, addToCart }) {
  return <div className="max-w-7xl mx-auto px-4 py-12"><h1 className="text-2xl font-serif font-bold text-center mb-6">Wishlist</h1><div className="grid grid-cols-1 sm:grid-cols-4 gap-6">{wishlist.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} isWishlisted={true} toggleWishlist={toggleWishlist} />)}</div></div>;
}

function AboutView() {
  return <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4"><h1 className="text-3xl font-serif font-bold">About Closet Extras Only</h1><p className="text-sm">Located in Ugbowo, Benin City, Nigeria. Your Extras, Your Style, Your Confidence.</p></div>;
}

function ContactView() {
  return <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4"><h1 className="text-3xl font-serif font-bold">Contact Us</h1><p className="text-sm">Phone: 0916 131 4677<br />Email: nwachukwuchinazaekpere5@gmail.com</p></div>;
}
