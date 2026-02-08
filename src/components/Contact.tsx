import React, { useEffect, useState } from 'react';
import { SectionHeading } from './SectionHeading';

interface ContactContent {
    email: string;
    availabilityText: string;
}

const defaultContact: ContactContent = {
    email: "contact@dottyedits.com",
    availabilityText: "Available for freelance & collaborations"
};

export const Contact: React.FC = () => {
    const [content, setContent] = useState<ContactContent>(defaultContact);

    useEffect(() => {
        fetch('/api/site-content')
            .then(res => res.json())
            .then(data => {
                if (data.contact) setContent({ ...defaultContact, ...data.contact });
            })
            .catch(() => { });
    }, []);

    return (
        <section id="contact" className="py-32 bg-black relative overflow-hidden border-t border-white/5">
            <div className="absolute inset-0 z-0 bg-dot-grid bg-grid-md opacity-20 pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <SectionHeading
                    title="Contact Me"
                    subtitle="Ready to start? Send me an email and let's discuss your project."
                    centered
                />

                <div className="mt-12 text-center">
                    <a href={`mailto:${content.email}`} className="group inline-block">
                        <span className="block text-2xl md:text-6xl font-black text-white group-hover:text-neutral-400 transition-colors uppercase tracking-tighter">
                            {content.email}
                        </span>
                        <span className="block h-1 w-0 bg-white mt-4 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                    <p className="mt-8 text-neutral-500 uppercase tracking-widest text-xs">
                        {content.availabilityText}
                    </p>
                </div>
            </div>
        </section>
    );
};
