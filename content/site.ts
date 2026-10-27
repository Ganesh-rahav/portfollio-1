/**
 * Site-wide facts. Every value here must trace back to
 * docs/decisions-v2.md — nothing invented. See tests/unit/content.test.ts.
 */

export type SiteLink = {
  label: string;
  url: string;
};

export type Site = {
  name: string;
  role: string;
  location: string;
  links: {
    github: SiteLink;
    instagram: SiteLink;
    email: SiteLink;
    /**
     * WhatsApp must only ever be rendered as a wa.me button with a
     * prefilled message — never as a plain-text phone number.
     */
    whatsapp: SiteLink;
  };
};

export const site: Site = {
  name: 'Ganesh Rahav',
  role: 'Co-Founder & CTO, Tranzora Digital',
  location: 'Trichy, Tamil Nadu, India',
  links: {
    github: {
      label: 'GitHub',
      url: 'https://github.com/Ganesh-rahav',
    },
    instagram: {
      label: 'Instagram',
      url: 'https://www.instagram.com/ga4_rahav/',
    },
    email: {
      label: 'Email',
      url: 'mailto:ga4.rahav7@gmail.com',
    },
    whatsapp: {
      label: 'WhatsApp',
      url: 'https://wa.me/918438275577?text=Hi%20Ganesh%2C%20I%20found%20your%20portfolio.',
    },
  },
};
