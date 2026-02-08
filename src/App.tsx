import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { About } from './components/About';
import { Clients } from './components/Clients';
import { Services } from './components/Services';
import { BriefGenerator } from './components/BriefGenerator';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="bg-black min-h-screen text-neutral-200 font-sans selection:bg-white selection:text-black relative">
      {/* Global Dotted Background */}
      <div className="fixed inset-0 z-0 bg-dot-grid-fade bg-grid-sm pointer-events-none"></div>

      <div className="relative z-10">
        <Navbar />

        <main>
          <Hero />

          <Portfolio />

          <Services />

          <About />

          <Clients />

          {/* AI Brief Generator Section */}
          <section id="brief" className="py-24 bg-neutral-950 border-t border-neutral-900 relative">
            <div className="container mx-auto px-6">
              <BriefGenerator />
            </div>
          </section>

          <Contact />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;