import { Link } from 'react-router-dom';

const locations = [
  {
    id: 1,
    name: 'Flagship Store - Pune',
    address: 'Shop no. 1, Nirmal complex, Meeta nagar, Kondhwa',
    city: 'Pune - 411048',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Shop+no.+1,+Nirmal+complex,+Meeta+nagar,+Kondhwa,+Pune+411048',
    embedUrl: 'https://maps.google.com/maps?q=Shop+no.+1,+Nirmal+complex,+Meeta+nagar,+Kondhwa,+Pune+411048&t=&z=15&ie=UTF8&iwloc=&output=embed',
    hours: 'Monday - Sunday: 10:00 AM - 10:00 PM',
    phone: '+91 9999999999'
  }
];

export default function LocationPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--np-gold)]">
          Visit Us
        </p>
        <h1 className="font-editorial mt-4 text-4xl leading-tight text-[var(--np-ink)] md:text-5xl">
          Our Locations
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--np-muted)]">
          Experience the luxury of our curated fragrances in person. Stop by our store to test, discover, and find your signature scent.
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-12">
        {locations.map((loc) => (
          <div key={loc.id} className="overflow-hidden rounded-[2.2rem] bg-white/88 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
            <div className="grid md:grid-cols-2">
              <div className="flex flex-col justify-center p-8 md:p-12">
                <h2 className="font-editorial text-3xl text-[var(--np-ink)]">{loc.name}</h2>
                
                <div className="mt-8 space-y-6">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--np-gold)]">Address</h3>
                    <p className="mt-2 text-sm text-[var(--np-muted)]">{loc.address}</p>
                    <p className="text-sm text-[var(--np-muted)]">{loc.city}</p>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--np-gold)]">Hours</h3>
                    <p className="mt-2 text-sm text-[var(--np-muted)]">{loc.hours}</p>
                  </div>

                  <a 
                    href={loc.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gold-button inline-flex rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-widest transition"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
              
              <div className="min-h-[300px] w-full bg-[var(--np-surface)] md:min-h-[400px]">
                <iframe 
                  title={`Google Maps - ${loc.name}`}
                  src={loc.embedUrl} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full object-cover"
                ></iframe>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
