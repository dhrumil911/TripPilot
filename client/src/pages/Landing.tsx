import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, ArrowRight, MapPin, Sparkles, DollarSign } from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token') !== null;

  const handleStartPlanning = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-paper text-charcoal font-sans">
      
      {/* 1. Header Navigation */}
      <header className="border-b border-sand px-4 sm:px-6 lg:px-8 py-4 sticky top-0 bg-paper/90 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-teal font-editorial font-bold text-xl tracking-tight">
            <Compass className="h-5.5 w-5.5 text-coral" />
            <span>TripPilot</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-wider text-charcoal-muted">
            <a href="#discover" className="hover:text-teal transition-colors">Explore</a>
            <a href="#how-it-works" className="hover:text-teal transition-colors">How It Works</a>
            <a href="#features" className="hover:text-teal transition-colors">Features</a>
          </nav>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="bg-teal hover:bg-teal-hover text-paper px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-xs font-bold uppercase tracking-wider text-charcoal hover:text-teal transition-colors">
                  Log in
                </Link>
                <button
                  onClick={handleStartPlanning}
                  className="bg-teal hover:bg-teal-hover text-paper px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Start Planning
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 lg:py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Column */}
          <div className="lg:col-span-7 space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-editorial font-bold leading-tight tracking-tight text-charcoal">
              Plan the journey.<br />
              <span className="italic font-normal text-teal">Not just the destination.</span>
            </h1>
            <p className="text-charcoal-muted text-base max-w-xl leading-relaxed">
              Build personalized multi-city trips, discover curated local experiences, manage your budget in real time, and share every detail of the journey with friends.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleStartPlanning}
                className="bg-teal hover:bg-teal-hover text-paper font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded transition-colors shadow-md flex items-center justify-center space-x-2"
              >
                <span>Start Planning</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#discover"
                className="border border-sand hover:border-charcoal text-charcoal font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded text-center transition-colors"
              >
                Explore Trips
              </a>
            </div>

            {/* Travel Metadata Widget */}
            <div className="border-t border-sand pt-6 max-w-md">
              <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-extrabold text-coral mb-2">
                <span>Featured Route</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-sm font-bold">
                <span>Ahmedabad</span>
                <span className="text-gray-400">&rarr;</span>
                <span>Mumbai</span>
                <span className="text-gray-400">&rarr;</span>
                <span>Goa</span>
                <span className="mx-2 text-sand">&middot;</span>
                <span className="text-charcoal-muted font-normal text-xs">7 days &middot; 3 stops &middot; $350 est.</span>
              </div>
            </div>
          </div>

          {/* Hero Right Column: Editorial Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full max-w-md mx-auto aspect-square bg-sand/30 rounded-2xl p-6 border border-sand">
              {/* Main Visual Image */}
              <div className="absolute inset-6 rounded-xl overflow-hidden shadow-lg border border-sand">
                <img
                  src="https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80"
                  alt="Taj Mahal Palace, India"
                  className="w-full h-full object-cover grayscale-[20%] hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Float Overlay 1 */}
              <div className="absolute -top-4 -left-4 bg-paper border border-sand p-3.5 rounded-lg shadow-md max-w-[180px] space-y-1 animate-fadeIn">
                <div className="flex items-center space-x-1 text-coral font-bold text-[10px] uppercase tracking-wider">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span>Next Stop</span>
                </div>
                <h4 className="font-bold text-xs">Colaba, Mumbai</h4>
                <p className="text-[10px] text-gray-500">Day 3 &middot; Gateway Heritage Tour</p>
              </div>

              {/* Float Overlay 2 */}
              <div className="absolute -bottom-4 -right-4 bg-paper border border-sand p-3.5 rounded-lg shadow-md max-w-[160px] space-y-1">
                <div className="flex items-center space-x-1 text-teal font-bold text-[10px] uppercase tracking-wider">
                  <DollarSign className="h-3 w-3 text-green-700 shrink-0" />
                  <span>Category splits</span>
                </div>
                <div className="w-full bg-sand-light h-1.5 rounded-full overflow-hidden">
                  <div className="bg-teal h-full w-[45%]" />
                </div>
                <p className="text-[9px] text-gray-400">Meals & Stay: 65%</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Sample Journey Route Visual Preview */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-sand-light border-y border-sand">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-coral">Route Visualizer</span>
            <h2 className="text-3xl font-editorial font-bold">The anatomy of an itinerary</h2>
            <p className="text-charcoal-muted text-xs">TripPilot translates linear lists into beautiful step-by-step route timelines.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {[
              { 
                city: 'Ahmedabad', 
                day: 'Day 1 - 2', 
                info: 'Sabarmati Ashram & Heritage Walk', 
                cost: '$80', 
                img: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=300&q=80' 
              },
              { 
                city: 'Mumbai', 
                day: 'Day 3 - 5', 
                info: 'Colaba, Marine Drive & Food Tour', 
                cost: '$180', 
                img: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=300&q=80' 
              },
              { 
                city: 'Goa', 
                day: 'Day 6 - 7', 
                info: 'Anjuna Beach Sunset & Seafood', 
                cost: '$90', 
                img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=300&q=80' 
              },
            ].map((stop, i) => (
              <div key={i} className="bg-paper border border-sand rounded-xl p-5 space-y-4 hover:shadow-md transition-shadow relative">
                <div className="absolute top-5 right-5 bg-sand-light text-[10px] font-black rounded-full h-6 w-6 flex items-center justify-center border border-sand">
                  0{i + 1}
                </div>
                <div className="h-32 rounded-lg overflow-hidden border border-sand">
                  <img src={stop.img} alt={stop.city} className="w-full h-full object-cover grayscale-[10%]" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-coral font-extrabold uppercase">{stop.day}</span>
                    <span className="text-xs font-bold text-green-700">{stop.cost}</span>
                  </div>
                  <h3 className="text-lg font-bold">{stop.city}</h3>
                  <p className="text-xs text-charcoal-muted">{stop.info}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Feature Story Section */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto space-y-24">
        
        {/* Story 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal">01 / Discover</span>
            <h3 className="text-2xl sm:text-3xl font-editorial font-bold text-charcoal">Find places worth stopping for.</h3>
            <p className="text-charcoal-muted text-xs leading-relaxed">
              Explore custom local experiences and food guides curated for traveler catalogs. Instantly search and browse sightseeing landmarks by estimated budget, duration, and activity tags.
            </p>
          </div>
          <div className="lg:col-span-7 bg-sand-light p-6 rounded-xl border border-sand">
            {/* Mock UX component */}
            <div className="bg-paper p-4 rounded-lg shadow-sm border border-sand space-y-3 max-w-md mx-auto">
              <div className="flex items-center justify-between border-b border-sand pb-2">
                <span className="text-xs font-bold text-teal flex items-center space-x-1">
                  <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                  <span>Activity Selector Catalog</span>
                </span>
                <span className="text-[10px] text-gray-400">24 results</span>
              </div>
              <div className="border border-sand rounded p-3 flex justify-between items-center text-xs">
                <div>
                  <h5 className="font-bold">Gateway Heritage Tour</h5>
                  <p className="text-[10px] text-gray-400">Culture &middot; 120 mins</p>
                </div>
                <button className="bg-teal text-paper px-2.5 py-1 rounded text-[10px] font-bold">Add to stop</button>
              </div>
            </div>
          </div>
        </div>

        {/* Story 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center lg:flex-row-reverse">
          <div className="lg:col-span-5 lg:order-last space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal">02 / Design</span>
            <h3 className="text-2xl sm:text-3xl font-editorial font-bold text-charcoal">Turn places into a journey.</h3>
            <p className="text-charcoal-muted text-xs leading-relaxed">
              Build your stops chronological hierarchy. Sort arrivals, departures, and cities with simple sorting buttons that sync layout sequences immediately.
            </p>
          </div>
          <div className="lg:col-span-7 bg-sand-light p-6 rounded-xl border border-sand">
            <div className="bg-paper p-4 rounded-lg shadow-sm border border-sand space-y-2 max-w-md mx-auto text-xs">
              <div className="flex items-center justify-between bg-gray-50 border border-sand p-2.5 rounded">
                <div className="flex items-center space-x-2">
                  <span className="font-black text-gray-400">01</span>
                  <span className="font-bold">Ahmedabad, Gujarat</span>
                </div>
                <span className="text-[10px] text-gray-400 font-semibold">2 days</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 border border-sand p-2.5 rounded">
                <div className="flex items-center space-x-2">
                  <span className="font-black text-gray-400">02</span>
                  <span className="font-bold">Mumbai, Maharashtra</span>
                </div>
                <span className="text-[10px] text-gray-400 font-semibold">3 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Story 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal">03 / Control</span>
            <h3 className="text-2xl sm:text-3xl font-editorial font-bold text-charcoal">Know what the journey will cost.</h3>
            <p className="text-charcoal-muted text-xs leading-relaxed">
              Track costs as they accumulate. Group expenses by category (stay, meals, transport, sightseeing) and visualize splits using clear, interactive progress indicators.
            </p>
          </div>
          <div className="lg:col-span-7 bg-sand-light p-6 rounded-xl border border-sand">
            <div className="bg-paper p-5 rounded-lg shadow-sm border border-sand space-y-4 max-w-md mx-auto text-xs">
              <div className="flex justify-between border-b border-sand pb-2 font-bold">
                <span>Total Spent</span>
                <span className="text-teal font-extrabold">$350.00 USD</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px]">
                  <span>Stay & Lodging</span>
                  <span>$150.00 (43%)</span>
                </div>
                <div className="w-full bg-sand h-2 rounded-full overflow-hidden">
                  <div className="bg-teal h-full w-[43%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* 5. How It Works Sequential Section */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-20 bg-sand border-y border-sand/40">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-md mx-auto space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-coral">Workflow</span>
            <h2 className="text-3xl font-editorial font-bold">How TripPilot works</h2>
            <p className="text-charcoal-muted text-xs">Five simple steps to plan your perfect multi-city journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 pt-4">
            {[
              { step: '01', title: 'Choose destinations', desc: 'Select stops and input dates.' },
              { step: '02', title: 'Build timeline', desc: 'Map out your daily activities.' },
              { step: '03', title: 'Add experiences', desc: 'Attach local sights & foods.' },
              { step: '04', title: 'Track budget', desc: 'Monitor category spent splits.' },
              { step: '05', title: 'Share & Clone', desc: 'Generate copyable shared links.' },
            ].map((item, idx) => (
              <div key={idx} className="bg-paper p-5 rounded-xl border border-sand/60 space-y-3">
                <span className="text-3xl font-editorial italic font-normal text-coral">{item.step}</span>
                <h4 className="font-bold text-sm text-charcoal">{item.title}</h4>
                <p className="text-xs text-charcoal-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Destination Discovery Explorer */}
      <section id="discover" className="px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-coral">Discovery</span>
            <h2 className="text-3xl font-editorial font-bold">Inspiration for your next trip</h2>
          </div>
          <p className="text-charcoal-muted text-xs max-w-sm">
            Boutique travel catalogs compiled to inspire your stops, activities, and budget planning.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {[
            { city: 'Paris', country: 'France', cost: '$$$$', popularity: '9.8', desc: 'Cafes, Louvre tours, and Seine walk paths.', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80' },
            { city: 'Tokyo', country: 'Japan', cost: '$$$', popularity: '9.7', desc: 'Shibuya alleyways, fresh sushi, and temples.', img: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=400&q=80' },
            { city: 'Rome', country: 'Italy', cost: '$$$', popularity: '9.5', desc: 'Colosseum ruins, fresh pasta, and monuments.', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80' },
            { city: 'New York', country: 'USA', cost: '$$$$', popularity: '9.4', desc: 'Central Park walks, Broadway, and pizza tours.', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&q=80' },
          ].map((dest, i) => (
            <div key={i} className="bg-paper border border-sand rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="h-44 overflow-hidden relative">
                  <img src={dest.img} alt={dest.city} className="w-full h-full object-cover grayscale-[10%]" />
                  <div className="absolute top-3 right-3 bg-paper/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-black border border-sand text-teal">
                    ★ {dest.popularity}
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>{dest.city}, {dest.country}</span>
                    <span className="text-green-700">{dest.cost}</span>
                  </div>
                  <p className="text-xs text-charcoal-muted leading-relaxed">{dest.desc}</p>
                </div>
              </div>
              <div className="p-4 bg-sand-light border-t border-sand flex justify-end">
                <button
                  onClick={handleStartPlanning}
                  className="text-xs text-teal hover:text-teal-hover font-bold flex items-center space-x-1"
                >
                  <span>Plan trip</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-sand py-12 px-4 sm:px-6 lg:px-8 bg-paper">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-charcoal-muted">
          <div className="flex items-center space-x-2 text-teal font-editorial font-bold text-lg">
            <Compass className="h-4.5 w-4.5 text-coral" />
            <span>TripPilot</span>
          </div>
          <div>
            <span>&copy; {new Date().getFullYear()} TripPilot. Premium travel journal planner interface.</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
