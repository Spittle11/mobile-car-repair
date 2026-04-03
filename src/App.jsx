import React from 'react';
import { Calendar, Wrench, Phone, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';
import BookingWidget from './components/BookingWidget';
import './App.css';

function App() {
  const scrollToBooking = () => {
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-wrapper">
      {/* Navbar */}
      <nav>
        <div className="container nav-container">
          <a href="#" className="nav-logo">Utah Valley Mobile Car Care</a>
          <button onClick={scrollToBooking} className="btn nav-book-btn">Book Now</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Your Trusted Mobile Mechanic<br/><span>We Come To You!</span></h1>
            <p className="hero-subtitle">Serving the Utah Valley area. Get 10% OFF your first service!</p>
            <div className="hero-actions">
              <button onClick={scrollToBooking} className="btn hero-btn">
                <Calendar size={20} />
                Schedule Service
              </button>
              <a href="tel:480-469-2664" className="btn btn-secondary hero-btn">
                <Phone size={20} />
                480-469-2664
              </a>
            </div>
            
            <div className="hero-trust">
              <div className="trust-badge"><ShieldCheck size={18}/> Trusted Professionals</div>
              <div className="trust-badge"><MapPin size={18}/> Utah Valley Area</div>
              <div className="trust-badge"><CheckCircle2 size={18}/> 10% Off First Visit</div>
            </div>
            
            <div className="team-photo-container">
              <img src="https://images.unsplash.com/photo-1625296048106-9cc334e85741?q=80&w=800&auto=format&fit=crop" alt="Utah Valley Mobile Car Care Team" className="team-photo" />
              <p className="team-photo-caption">We are students! Trusted faces coming to your home.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid">
            
            <div className="service-card">
              <div className="service-icon"><Wrench size={32}/></div>
              <h3>Oil Change</h3>
              <p className="service-desc">Full synthetic oil change at your doorstep.</p>
              <div className="price-tiers">
                <div className="tier"><span>Sedans</span> <span className="price">$100</span></div>
                <div className="tier"><span>SUVs/Trucks</span> <span className="price">$150</span></div>
              </div>
            </div>
            
            <div className="service-card highlight-card">
              <div className="service-badge">Bundle & Save!</div>
              <div className="service-icon"><Wrench size={32}/></div>
              <h3>Tire Rotation</h3>
              <p className="service-desc">Extend the life of your tires.</p>
              <div className="price-tiers">
                <div className="tier"><span>Standard Price</span> <span className="price">$40</span></div>
                <div className="tier bundle"><span>With Oil Change</span> <span className="price">$20</span></div>
              </div>
            </div>

            <div className="service-card">
              <div className="service-icon"><Wrench size={32}/></div>
              <h3>Detailing</h3>
              <p className="service-desc">Get your car looking brand new.</p>
              <div className="price-tiers">
                <div className="tier"><span>Car Wash</span> <span className="price">$50 - $100</span></div>
                <div className="tier"><span>Interior Detail</span> <span className="price">$50 - $100</span></div>
              </div>
            </div>

            <div className="service-card">
              <div className="service-icon"><Wrench size={32}/></div>
              <h3>General Maintenance</h3>
              <p className="service-desc">Brakes, diagnostics, and repairs.</p>
              <div className="price-tiers center-tier">
                <span className="price highlight">Call for Quote</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Booking Widget Section */}
      <section id="booking" className="booking-section">
        <div className="container">
          <h2 className="section-title">Book Your Appointment</h2>
          <p className="text-center booking-subtitle">Select your services, choose a time, and we'll come to your driveway.</p>
          <div className="booking-widget-container">
            <BookingWidget />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container footer-content">
          <div>
            <h3>Utah Valley Mobile Car Care</h3>
            <p>Your Trusted Mobile Mechanic</p>
          </div>
          <div className="footer-contact">
            <p><strong>Text/Call for Scheduling:</strong></p>
            <a href="tel:480-469-2664" className="footer-phone">480-469-2664</a>
            <p className="promo">10% OFF your first service!</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Utah Valley Mobile Car Care. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
