import React from 'react';
import { ArrowRightIcon, CheckCircleIcon, SparklesIcon } from './icons';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="flex-1 flex flex-col bg-transparent overflow-auto">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto text-center animate-fadeIn">
          {/* Logo or Brand Mark */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center animate-float">
                <SparklesIcon className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center animate-pulse">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold gradient-text mb-6 leading-tight">
            Transform Your Brand
            <br />
            Into Reality
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Visualize your logo on <span className="text-indigo-400 font-semibold">14+ premium advertising surfaces</span> instantly.
            From aircraft exteriors to metro wraps, shopping malls to highway billboards — see your brand everywhere.
          </p>

          {/* CTA Button */}
          <button
            onClick={onGetStarted}
            className="btn btn-primary text-lg px-12 py-6 group shadow-2xl shadow-indigo-500/50"
          >
            <span>Start Visualizing</span>
            <ArrowRightIcon className="h-5 w-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
          </button>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
              <span>AI-Powered Generation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
              <span>Professional Quality</span>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section - Example Visualizations */}
      <section className="py-20 px-8 bg-gradient-to-b from-transparent via-gray-900/30 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              See Your Brand Everywhere
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real examples of brand visualization across diverse advertising mediums
            </p>
          </div>

          {/* Image Grid - Showcasing Skylar Brand Examples */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            {/* Aircraft Exterior */}
            <div className="card hover-lift group">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                <img
                  src="/Skylar Brand Images/skylar-aircraft-exterior (3).png"
                  alt="Aircraft Branding Example"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-t border-white/5">
                <h3 className="text-white font-semibold text-lg mb-2">Aircraft Exterior</h3>
                <p className="text-gray-400 text-sm">Premium aviation branding</p>
              </div>
            </div>

            {/* Metro Exterior */}
            <div className="card hover-lift group">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                <img
                  src="/Skylar Brand Images/skylar-metro-exterior.png"
                  alt="Metro Branding Example"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-t border-white/5">
                <h3 className="text-white font-semibold text-lg mb-2">Metro Wrap</h3>
                <p className="text-gray-400 text-sm">High-visibility transit advertising</p>
              </div>
            </div>

            {/* Unipole Billboard */}
            <div className="card hover-lift group">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                <img
                  src="/Skylar Brand Images/skylar-unipole-billboard (2).png"
                  alt="Billboard Branding Example"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-t border-white/5">
                <h3 className="text-white font-semibold text-lg mb-2">Highway Billboard</h3>
                <p className="text-gray-400 text-sm">Massive outdoor impact</p>
              </div>
            </div>

            {/* Shopping Mall */}
            <div className="card hover-lift group">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                <img
                  src="/Skylar Brand Images/skylar-shopping-mall (1).png"
                  alt="Shopping Mall Advertising Example"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-t border-white/5">
                <h3 className="text-white font-semibold text-lg mb-2">Shopping Mall Display</h3>
                <p className="text-gray-400 text-sm">Luxury retail presence</p>
              </div>
            </div>

            {/* Car Wrap */}
            <div className="card hover-lift group">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                <img
                  src="/Skylar Brand Images/skylar-car-wrap (4).png"
                  alt="Vehicle Branding Example"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-t border-white/5">
                <h3 className="text-white font-semibold text-lg mb-2">Vehicle Wrap</h3>
                <p className="text-gray-400 text-sm">Mobile brand advertising</p>
              </div>
            </div>

            {/* Metro Pillar */}
            <div className="card hover-lift group">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                <img
                  src="/Skylar Brand Images/skylar-metro-pillar (2).png"
                  alt="Metro Pillar Digital Display Example"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-t border-white/5">
                <h3 className="text-white font-semibold text-lg mb-2">Digital Display</h3>
                <p className="text-gray-400 text-sm">Premium urban locations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              How Skylar Works
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Three simple steps to visualize your brand across premium advertising surfaces
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="glass-card p-8 rounded-2xl text-center hover-lift">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Upload Your Logo</h3>
              <p className="text-gray-400 leading-relaxed">
                Simply upload your brand logo in PNG, JPEG, or WebP format. Our AI will handle the rest.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-card p-8 rounded-2xl text-center hover-lift" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI Generation</h3>
              <p className="text-gray-400 leading-relaxed">
                Our advanced AI creates photorealistic visualizations of your logo across 14+ advertising mediums.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-card p-8 rounded-2xl text-center hover-lift" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Download & Share</h3>
              <p className="text-gray-400 leading-relaxed">
                Download high-quality images and share your brand vision with clients and stakeholders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advertising Surfaces Section */}
      <section className="py-20 px-8 bg-gradient-to-b from-transparent via-gray-900/30 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              14+ Advertising Surfaces
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Visualize your brand across diverse channels and locations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: 'Aircraft Exterior', icon: '✈️' },
              { name: 'Metro Wraps', icon: '🚇' },
              { name: 'Highway Billboards', icon: '🛣️' },
              { name: 'Shopping Malls', icon: '🏬' },
              { name: 'Vehicle Wraps', icon: '🚗' },
              { name: 'Digital Displays', icon: '📺' },
              { name: 'Airport Terminals', icon: '🏢' },
              { name: 'Boarding Passes', icon: '🎫' },
              { name: 'In-Flight Magazines', icon: '📰' },
              { name: 'Baggage Carts', icon: '🛒' },
              { name: 'Road Medians', icon: '🚧' },
              { name: 'Bridge/Flyover Ads', icon: '🌉' },
              { name: 'Auto Canopy Tents', icon: '⛺' },
              { name: 'Metro Pillars', icon: '🏗️' },
            ].map((surface, index) => (
              <div
                key={surface.name}
                className="glass-card p-6 rounded-xl text-center hover-lift animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="text-4xl mb-3">{surface.icon}</div>
                <p className="text-white font-medium text-sm">{surface.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More Examples Grid */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              More Brand Visualizations
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Explore additional advertising mediums and placements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Additional Examples */}
            <div className="card hover-lift group">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                <img
                  src="/Skylar Brand Images/skylar-boarding-pass (1).png"
                  alt="Boarding Pass Advertisement"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-t border-white/5">
                <h3 className="text-white font-semibold text-sm">Boarding Pass</h3>
              </div>
            </div>

            <div className="card hover-lift group">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                <img
                  src="/Skylar Brand Images/skylar-aircraft-magazine (1).png"
                  alt="Aircraft Magazine Advertisement"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-t border-white/5">
                <h3 className="text-white font-semibold text-sm">In-Flight Magazine</h3>
              </div>
            </div>

            <div className="card hover-lift group">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                <img
                  src="/Skylar Brand Images/skylar-baggage-cart (2).png"
                  alt="Baggage Cart Branding"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-t border-white/5">
                <h3 className="text-white font-semibold text-sm">Baggage Cart</h3>
              </div>
            </div>

            <div className="card hover-lift group">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                <img
                  src="/Skylar Brand Images/skylar-step-ladder (1).png"
                  alt="Aircraft Step Ladder"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-t border-white/5">
                <h3 className="text-white font-semibold text-sm">Step Ladder</h3>
              </div>
            </div>

            <div className="card hover-lift group">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                <img
                  src="/Skylar Brand Images/skylar-road-median.png"
                  alt="Road Median Advertisement"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-t border-white/5">
                <h3 className="text-white font-semibold text-sm">Road Median</h3>
              </div>
            </div>

            <div className="card hover-lift group">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                <img
                  src="/Skylar Brand Images/skylar-facade-bridge (1).png"
                  alt="Bridge Billboard Advertising"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-t border-white/5">
                <h3 className="text-white font-semibold text-sm">Bridge Billboard</h3>
              </div>
            </div>

            <div className="card hover-lift group">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                <img
                  src="/Skylar Brand Images/skylar-auto-canopy (1).png"
                  alt="Auto Canopy Tent"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-t border-white/5">
                <h3 className="text-white font-semibold text-sm">Canopy Tent</h3>
              </div>
            </div>

            <div className="card hover-lift group">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                <img
                  src="/Skylar Brand Images/skylar-meal-tray (2).png"
                  alt="Aircraft Meal Tray Advertisement"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-t border-white/5">
                <h3 className="text-white font-semibold text-sm">Meal Tray</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto text-center glass-card p-16 rounded-3xl">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Ready to See Your Brand Everywhere?
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Upload your logo now and get instant AI-generated visualizations across 14+ premium advertising surfaces.
          </p>
          <button
            onClick={onGetStarted}
            className="btn btn-primary text-lg px-12 py-6 group shadow-2xl shadow-indigo-500/50"
          >
            <span>Get Started Free</span>
            <ArrowRightIcon className="h-5 w-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
