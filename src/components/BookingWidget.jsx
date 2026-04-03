import React, { useState, useRef, useEffect } from 'react';
import { Check, Info, Calendar as CalIcon, Clock, MapPin, ChevronRight, ChevronLeft, ExternalLink } from 'lucide-react';
import './BookingWidget.css';

const SERVICES = [
  { id: 'oil-sedan', name: 'Oil Change (Sedan)', price: 100 },
  { id: 'oil-lrg', name: 'Oil Change (SUV/Large)', price: 150 },
  { id: 'tire-rot', name: 'Tire Rotation', price: 40, discountPrice: 20 },
  { id: 'wash', name: 'Car Wash', price: 75, label: "Est. $50-$100" },
  { id: 'detail', name: 'Interior Detail', price: 75, label: "Est. $50-$100" },
];

// Service area cities from Santaquin up to Draper
const SERVICE_CITIES = [
  { city: 'Santaquin', zip: '84655' },
  { city: 'Payson', zip: '84651' },
  { city: 'Salem', zip: '84653' },
  { city: 'Spanish Fork', zip: '84660' },
  { city: 'Springville', zip: '84663' },
  { city: 'Mapleton', zip: '84664' },
  { city: 'Provo', zip: '84601' },
  { city: 'Orem', zip: '84097' },
  { city: 'Lindon', zip: '84042' },
  { city: 'Pleasant Grove', zip: '84062' },
  { city: 'American Fork', zip: '84003' },
  { city: 'Highland', zip: '84003' },
  { city: 'Cedar Hills', zip: '84062' },
  { city: 'Lehi', zip: '84043' },
  { city: 'Saratoga Springs', zip: '84045' },
  { city: 'Eagle Mountain', zip: '84005' },
  { city: 'Herriman', zip: '84096' },
  { city: 'Bluffdale', zip: '84065' },
  { city: 'Riverton', zip: '84065' },
  { city: 'South Jordan', zip: '84095' },
  { city: 'Draper', zip: '84020' },
];

const TIME_SLOTS = [
  "08:00 AM", "09:30 AM", "11:00 AM", "01:00 PM", "02:30 PM", "04:00 PM"
];

const MECHANIC_EMAIL = 'uvmobilecarcare@gmail.com';

function buildGoogleCalendarLink({ date, time, address, selectedServices, paymentMethod, calculateTotal }) {
  // Parse date
  const [year, month, day] = date.split('-');

  // Parse time e.g. "08:00 AM"
  const [timePart, ampm] = time.split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);
  if (ampm === 'PM' && hours !== 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;

  const pad = (n) => String(n).padStart(2, '0');
  const startDT = `${year}${month}${day}T${pad(hours)}${pad(minutes)}00`;

  // End time = start + 1.5 hours
  let endH = hours + 1;
  let endM = minutes + 30;
  if (endM >= 60) { endH += 1; endM -= 60; }
  const endDT = `${year}${month}${day}T${pad(endH)}${pad(endM)}00`;

  const serviceNames = selectedServices
    .map(id => SERVICES.find(s => s.id === id)?.name)
    .filter(Boolean)
    .join(', ');

  const details = [
    `Mobile car service appointment`,
    `Services: ${serviceNames}`,
    `Estimated Total: $${calculateTotal()}+`,
    `Payment: ${paymentMethod === 'online' ? 'Credit/Debit Card (Online)' : 'In Person (Cash/Card/Venmo)'}`,
    ``,
    `Contact: 480-469-2664`,
    `Email: ${MECHANIC_EMAIL}`,
  ].join('\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Utah Valley Mobile Car Care – ${serviceNames}`,
    dates: `${startDT}/${endDT}`,
    details,
    location: address,
    add: MECHANIC_EMAIL,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function CityAutocomplete({ value, onChange }) {
  const [street, setStreet] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const filtered = cityQuery.length > 0
    ? SERVICE_CITIES.filter(c =>
        c.city.toLowerCase().includes(cityQuery.toLowerCase())
      )
    : SERVICE_CITIES;

  // Combine street + city into the parent address value
  useEffect(() => {
    if (street && selectedCity) {
      onChange(`${street}, ${selectedCity.city}, UT ${selectedCity.zip}`);
    } else {
      onChange('');
    }
  }, [street, selectedCity]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="city-autocomplete-wrap">
      {/* Street Address */}
      <div className="location-input-wrap">
        <label>Street Address</label>
        <div style={{ position: 'relative' }}>
          <MapPin size={20} color="var(--slate-400)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="123 Main St"
            value={street}
            onChange={e => setStreet(e.target.value)}
            style={{ paddingLeft: '48px' }}
          />
        </div>
      </div>

      {/* City Selector */}
      <div className="location-input-wrap" ref={dropdownRef} style={{ position: 'relative' }}>
        <label>City <span style={{ color: 'var(--slate-400)', fontWeight: 400 }}>(Service area: Santaquin – Draper)</span></label>
        <input
          type="text"
          placeholder="Search city..."
          value={selectedCity ? `${selectedCity.city}, UT` : cityQuery}
          onFocus={() => { setShowDropdown(true); if (selectedCity) { setCityQuery(''); setSelectedCity(null); } }}
          onChange={e => { setCityQuery(e.target.value); setSelectedCity(null); setShowDropdown(true); }}
          className={selectedCity ? 'city-selected' : ''}
        />

        {showDropdown && (
          <div className="city-dropdown">
            {filtered.length === 0 ? (
              <div className="city-dropdown-empty">
                No cities in service area match "{cityQuery}"
              </div>
            ) : (
              filtered.map(c => (
                <div
                  key={c.city}
                  className={`city-dropdown-item ${selectedCity?.city === c.city ? 'active' : ''}`}
                  onMouseDown={() => {
                    setSelectedCity(c);
                    setCityQuery('');
                    setShowDropdown(false);
                  }}
                >
                  <MapPin size={14} style={{ flexShrink: 0 }} />
                  <span>{c.city}, UT <span className="city-zip">{c.zip}</span></span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Preview */}
      {street && selectedCity && (
        <div className="address-preview">
          <Check size={14} />
          <span>{street}, {selectedCity.city}, UT {selectedCity.zip}</span>
        </div>
      )}
    </div>
  );
}

function BookingWidget() {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const hasOilChange = selectedServices.includes('oil-sedan') || selectedServices.includes('oil-lrg');

  const toggleService = (id) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    let total = 0;
    selectedServices.forEach(srvId => {
      const srv = SERVICES.find(s => s.id === srvId);
      if (srvId === 'tire-rot' && hasOilChange) {
        total += srv.discountPrice;
      } else {
        total += srv.price;
      }
    });
    return total;
  };

  const canProceed = () => {
    if (step === 1) return selectedServices.length > 0;
    if (step === 2) return address.trim().length > 10;
    if (step === 3) return date !== '' && time !== '';
    if (step === 4) return paymentMethod !== '';
    return true;
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else setIsBooked(true);
  };

  if (isBooked) {
    const calLink = buildGoogleCalendarLink({ date, time, address, selectedServices, paymentMethod, calculateTotal });

    return (
      <div className="booking-widget">
        <div className="booking-body booking-confirmed">
          <div className="confirmed-icon">
            <Check size={48} />
          </div>
          <h2 className="step-title">Booking Confirmed!</h2>
          <p className="confirmed-subtitle">
            Your appointment for <strong>{date} at {time}</strong> is scheduled.<br />
            Our mechanic will arrive at <strong>{address}</strong>.
          </p>

          <a
            href={calLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn cal-btn"
          >
            <CalIcon size={20} />
            Add to Google Calendar
            <ExternalLink size={16} />
          </a>
          <p className="cal-hint">This also sends an invite to our team so we know you're all set!</p>

          <button className="btn btn-secondary" style={{ marginTop: '12px' }} onClick={() => window.location.reload()}>
            Book Another Service
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-widget">
      {/* Header */}
      <div className="booking-header">
        {['Services', 'Location', 'Schedule', 'Payment', 'Confirm'].map((label, i) => (
          <div key={label} className={`step-indicator ${step >= i + 1 ? 'active' : ''}`}>
            <div className="step-num">{i + 1}</div>
            {label}
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="booking-body">

        {step === 1 && (
          <div className="step-content">
            <h3 className="step-title">What do you need done?</h3>
            <div className="service-options">
              {SERVICES.map(srv => {
                const isSelected = selectedServices.includes(srv.id);
                const isDiscounted = srv.id === 'tire-rot' && hasOilChange;
                return (
                  <label key={srv.id} className={`service-option-label ${isSelected ? 'selected' : ''}`}>
                    <div className="service-name-wrap">
                      <div className="checkbox-custom">
                        {isSelected && <Check size={14} />}
                      </div>
                      <span>{srv.name}</span>
                      {isDiscounted && <span className="discount-badge">Bundle Discount Applies!</span>}
                    </div>
                    <div className="service-price">
                      {srv.label ? srv.label : (isDiscounted ? `$${srv.discountPrice}` : `$${srv.price}`)}
                    </div>
                    <input
                      type="checkbox"
                      style={{ display: 'none' }}
                      checked={isSelected}
                      onChange={() => toggleService(srv.id)}
                    />
                  </label>
                )
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <h3 className="step-title">Where should we come?</h3>
            <CityAutocomplete value={address} onChange={setAddress} />
            <div className="info-alert" style={{ marginTop: '16px' }}>
              <Info size={20} style={{ flexShrink: 0 }} />
              <span>We are a fully mobile service. Please ensure your vehicle is parked in an accessible driveway or parking lot.</span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <h3 className="step-title">Choose a Date &amp; Time</h3>
            <div className="info-alert" style={{ marginBottom: '24px' }}>
              <Info size={20} style={{ flexShrink: 0 }} />
              <span>Time slots automatically include a 30-minute buffer for our mechanics to drive to your location.</span>
            </div>

            <div className="schedule-grid">
              <div className="date-selector">
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '12px' }}>
                  <CalIcon size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                  Select Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="time-selector">
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '12px' }}>
                  <Clock size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                  Available Times
                </label>
                {date ? (
                  <div className="time-slots">
                    {TIME_SLOTS.map(t => (
                      <div
                        key={t}
                        className={`time-slot ${time === t ? 'selected' : ''}`}
                        onClick={() => setTime(t)}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>Please select a date first.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="step-content">
            <h3 className="step-title">Payment Options</h3>
            <p style={{ color: 'var(--slate-500)', marginBottom: '24px' }}>How would you like to pay for your service?</p>

            <div className="service-options">
              <label className={`service-option-label ${paymentMethod === 'online' ? 'selected' : ''}`}>
                <div className="service-name-wrap">
                  <div className="checkbox-custom" style={{ borderRadius: '50%' }}>
                    {paymentMethod === 'online' && <div style={{ width: '10px', height: '10px', background: 'var(--accent)', borderRadius: '50%' }}></div>}
                  </div>
                  <span>Pay Now Online (Credit/Debit)</span>
                </div>
                <input type="radio" style={{ display: 'none' }} checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
              </label>

              {paymentMethod === 'online' && (
                <div style={{ padding: '24px', border: '1px solid var(--slate-200)', borderRadius: '8px', marginTop: '8px', marginBottom: '8px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Card Number</label>
                  <input type="text" placeholder="0000 0000 0000 0000" style={{ width: '100%', padding: '12px', border: '1px solid var(--slate-300)', borderRadius: '6px', marginBottom: '16px', fontFamily: 'inherit' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Expiry</label>
                      <input type="text" placeholder="MM/YY" style={{ width: '100%', padding: '12px', border: '1px solid var(--slate-300)', borderRadius: '6px', fontFamily: 'inherit' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>CVC</label>
                      <input type="text" placeholder="123" style={{ width: '100%', padding: '12px', border: '1px solid var(--slate-300)', borderRadius: '6px', fontFamily: 'inherit' }} />
                    </div>
                  </div>
                </div>
              )}

              <label className={`service-option-label ${paymentMethod === 'in-person' ? 'selected' : ''}`}>
                <div className="service-name-wrap">
                  <div className="checkbox-custom" style={{ borderRadius: '50%' }}>
                    {paymentMethod === 'in-person' && <div style={{ width: '10px', height: '10px', background: 'var(--accent)', borderRadius: '50%' }}></div>}
                  </div>
                  <span>Pay In Person (Cash/Card/Venmo)</span>
                </div>
                <input type="radio" style={{ display: 'none' }} checked={paymentMethod === 'in-person'} onChange={() => setPaymentMethod('in-person')} />
              </label>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="step-content">
            <h3 className="step-title">Review &amp; Confirm</h3>

            <div className="summary-card">
              <h4 style={{ marginBottom: '16px', color: 'var(--navy)' }}>Service Summary</h4>
              {selectedServices.map(srvId => {
                const srv = SERVICES.find(s => s.id === srvId);
                const isDiscounted = srv.id === 'tire-rot' && hasOilChange;
                return (
                  <div key={srv.id} className="summary-item">
                    <span>{srv.name} {isDiscounted && <span style={{ color: '#166534', fontSize: '0.75rem', marginLeft: '8px' }}>(Bundle Discount)</span>}</span>
                    <span>{srv.label ? srv.label : `$${isDiscounted ? srv.discountPrice : srv.price}`}</span>
                  </div>
                )
              })}
              <div className="summary-total">
                <span>Estimated Total</span>
                <span>${calculateTotal()}+</span>
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '16px', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <MapPin color="var(--slate-500)" /> <strong>Location:</strong> {address}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <CalIcon color="var(--slate-500)" /> <strong>Schedule:</strong> {date} at {time}
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Check color="var(--slate-500)" /> <strong>Payment:</strong> {paymentMethod === 'online' ? 'Card Online' : 'In Person'}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer Actions */}
      <div className="booking-footer">
        <button
          className={`btn btn-secondary ${step === 1 ? 'btn-disabled' : ''}`}
          onClick={() => step > 1 && setStep(step - 1)}
          disabled={step === 1}
        >
          <ChevronLeft size={20} /> Back
        </button>

        <button
          className={`btn ${!canProceed() ? 'btn-disabled' : ''}`}
          onClick={handleNext}
          disabled={!canProceed()}
        >
          {step === 5 ? 'Confirm Booking' : 'Continue'} {step < 5 && <ChevronRight size={20} />}
        </button>
      </div>

    </div>
  );
}

export default BookingWidget;
