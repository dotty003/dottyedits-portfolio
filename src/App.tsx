import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { About } from './components/About';
import { Clients } from './components/Clients';
import { Services } from './components/Services';
import { BriefGenerator } from './components/BriefGenerator';
import { SectionHeading } from './components/SectionHeading';
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
          
          <section id="contact" className="py-32 bg-black relative overflow-hidden border-t border-white/5">
             {/* Localized stronger dots for contact section */}
            <div className="absolute inset-0 z-0 bg-dot-grid bg-grid-md opacity-20 pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
              <SectionHeading 
                title="Contact Me" 
                subtitle="Ready to start? Send me an email and let's discuss your project."
                centered
              />
              
              <div className="mt-12 text-center">
                <a href="mailto:contact@dottyedits.com" className="group inline-block">
                  <span className="block text-2xl md:text-6xl font-black text-white group-hover:text-neutral-400 transition-colors uppercase tracking-tighter">
                    contact@dottyedits.com
                  </span>
                  <span className="block h-1 w-0 bg-white mt-4 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <p className="mt-8 text-neutral-500 uppercase tracking-widest text-xs">
                  Available for freelance & collaborations
                </p>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;