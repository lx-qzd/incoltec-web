/**
 * Single source of truth for corporate data shown on the website
 * (legal notice, contact page, footer, structured data).
 *
 * Source: legal notice published on https://incoltec.com/aviso-legal/ (Nov 2026).
 * Must be validated by Incoltec's legal adviser before going live.
 */
export const company = {
  brand: 'INCOLTEC',
  legalName: 'Innovation Colour Technology S.L.',
  // The current incoltec.com legal notice shows "NB-66895475"; the standard
  // Spanish CIF format is "B66895475". Confirm with Incoltec before launch.
  taxId: 'B66895475',
  registry:
    'Registro Mercantil de Barcelona, Tomo 45693, Folio 156, Hoja/Libro 496075, Inscripción 1ª',
  registryEn:
    'Barcelona Commercial Registry, Volume 45693, Folio 156, Sheet/Book 496075, 1st entry',
  email: 'info@incoltec.com',
  phone: '+34 93 798 62 16',
  phoneHref: 'tel:+34937986216',
  headquarters: {
    labelEn: 'Headquarters & laboratory',
    labelEs: 'Sede central y laboratorio',
    street: 'Vía Europa 98-2',
    postalCode: '08304',
    city: 'Mataró',
    region: 'Barcelona',
    country: 'España',
    countryEn: 'Spain',
    countryCode: 'ES',
  },
  production: {
    labelEn: 'Production plant',
    labelEs: 'Planta de producción',
    city: 'Barberà del Vallès',
    region: 'Barcelona',
  },
  social: {
    linkedin: 'https://www.linkedin.com/company/incoltec/',
    youtube: 'https://www.youtube.com/@incoltec-colorantesalimentario',
  },
} as const;

const hq = company.headquarters;
export const hqAddressLine = `${hq.street}, ${hq.postalCode} ${hq.city} (${hq.region})`;
const mapsQuery = encodeURIComponent(`${hq.street}, ${hq.postalCode} ${hq.city}, ${hq.region}, Spain`);
/** Opens Google Maps with directions to HQ (works on mobile and desktop). */
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;
export const mapUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
export const osmUrl = `https://www.openstreetmap.org/search?query=${mapsQuery}`;
