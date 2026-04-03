import React, { useState } from 'react';
import { Check, Info, Calendar as CalIcon, Clock, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';
import './BookingWidget.css';

const SERVICES = [
  { id: 'oil-sedan', name: 'Oil Change (Sedan)', price: 100 },
  { id: 'oil-lrg', name: 'Oil Change (SUV/Large)', price: 150 },
  { id: 'tire-rot', name: 'Tire Rotation', price: 40, discountPrice: 20 },
  { id: 'wash', name: 'Car Wash', price: 75, label: "Est. $50-$100" },
  { id: 'detail', name: 'Interior Detail', price: 75, label: "Est. $50-$100" },
];

const TIME_SLOTS = [
  "08:00 AM", "09:30 AM", "11:00 AM", "01:00 PM", "02:30 PM", "04:00 PM"
];

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
    if (step === 2) return address.trim().length > 5;
    if (step === 3) return date !== '' && time !== '';
    if (step === 4) return paymentMethod !== '';
    return true;
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else {
      // Final booking step (simulate API call)
      setIsBooked(true);
    }
  };

  if (isBooked) {
    return (
      <div className="booking-widget">
        <div className="booking-body" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ display: 'inline-flex', background: '#dcfce7', color: '#166534', padding: '20px', borderRadius: '50%', marginBottom: '24px' }}>
            <Check size={48} />
          </div>
          <h2 className="step-title" style={{ marginBottom: '16px' }}>Booking Confirmed!</h2>
          <p style={{ color: 'var(--slate-500)', maxWidth: '400px', margin: '0 auto', marginBottom: '24px' }}>
            Your appointment for <strong>{date} at {time}</strong> is scheduled. Our mechanic will arrive at <strong>{address}</strong>.
          </p>
          <button className="btn" onClick={() => window.location.reload()}>Book Another Service</button>
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
            <div className="location-input-wrap">
              <label>Service Address (Utah Valley Area)</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={20} color="var(--slate-400)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                <input 
                  type="text" 
                  placeholder="123 Example St, Orem, UT" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ paddingLeft: '48px' }}
                />
              </div>
            </div>
            <div className="info-alert">
              <Info size={20} style={{ flexShrink: 0 }} />
              <span>We are a fully mobile service. Please ensure your vehicle is parked in an accessible driveway or parking lot.</span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <h3 className="step-title">Choose a Date & Time</h3>
            <div className="info-alert" style={{ marginBottom: '24px' }}>
              <Info size={20} style={{ flexShrink: 0 }} />
              <span>Time slots automatically include a 30-minute buffer for our mechanics to drive to your location.</span>
            </div>
            
            <div className="schedule-grid">
              <div className="date-selector">
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '12px' }}><CalIcon size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }}/> Select Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="time-selector">
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '12px' }}><Clock size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }}/> Available Times</label>
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
                    {paymentMethod === 'online' && <div style={{width: '10px', height: '10px', background: 'var(--accent)', borderRadius: '50%'}}></div>}
                  </div>
                  <span>Pay Now Online (Credit/Debit)</span>
                </div>
                <input 
                  type="radio" 
                  style={{ display: 'none' }} 
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                />
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
                    {paymentMethod === 'in-person' && <div style={{width: '10px', height: '10px', background: 'var(--accent)', borderRadius: '50%'}}></div>}
                  </div>
                  <span>Pay In Person (Cash/Card/Venmo)</span>
                </div>
                <input 
                  type="radio" 
                  style={{ display: 'none' }} 
                  checked={paymentMethod === 'in-person'}
                  onChange={() => setPaymentMethod('in-person')}
                />
              </label>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="step-content">
            <h3 className="step-title">Review & Confirm</h3>
            
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
