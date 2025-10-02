# MayDayz Smokn BBQ Website

**"WE SMOKED OUT!!"**

## About MayDayz Smokn BBQ

MayDayz Smokn BBQ brings authentic Southern BBQ to Charlotte, NC. We specialize in savory smoked ribs, pulled pork, and full catering services, with convenient weekend delivery to your door.

### Visit Us
- **Address**: 6500 Monteith Drive, Charlotte, NC 28213
- **Phone**: [980-499-8399](tel:980-499-8399)
- **Email**: [maydayzbbq@maydayz.com](mailto:maydayzbbq@maydayz.com)
- **Website**: [www.maydayz.com](https://www.maydayz.com)

### Hours of Operation
- **Saturday**: 12:00 PM - 8:00 PM
- **Sunday**: 12:00 PM - 8:00 PM
- Closed Monday - Friday

### Connect With Us
- [Instagram](https://www.instagram.com/maydayz_bbq/)
- [Facebook](https://www.facebook.com/people/MayDayz-Smokn-Bar-Be-Que/61562127020412/)
- [TikTok](https://www.tiktok.com/@maydayzbbq)

---

## What You Can Do on Our Website

### For Customers
- **Order Online**: Easy ordering system for weekend pickup and delivery
- **View Our Menu**: Browse our full selection of BBQ, sides, and specialties
- **Book Catering**: Get quotes for your events and parties
- **Buy Gift Cards**: Perfect gifts for BBQ lovers via Square
- **Create an Account**: Save your info for faster ordering

### Featured Menu Items
- **Sampler** - $32 (Try a little bit of everything!)
- **Chef's Favorite Rib Plate** - $22 (Our signature dish)
- Plus wings with bold new sauces and seasonal specials!

---

## For Developers

### Project Overview
This is a static HTML website with modern web technologies, optimized for performance and user experience across all devices.

### Tech Stack

**Frontend**
- HTML5 with semantic markup
- Tailwind CSS for styling
- Vanilla JavaScript for interactions
- Custom CSS animations

**Third-Party Integrations**
- **Google Analytics** (G-PN5PZ1Z3KG) - Traffic analytics
- **reCAPTCHA Enterprise** - Bot protection on order forms
- **Square** - Gift card purchases and payments

**Assets & Media**
- WebP images for optimal compression
- WebM video format for animations
- Custom font families for branding

### Key Features Implemented

**Performance**
- Service Worker for offline functionality and PWA support
- Resource preloading (CSS, fonts, images)
- Lazy loading for below-the-fold images
- Async script loading
- Optimized image formats (WebP)

**Responsive Design**
- Mobile-first approach
- Device detection (serves video on desktop, static images on mobile)
- Touch-friendly interface
- Fluid layouts with Tailwind breakpoints

**User Experience**
- Loading animation with smooth fade-out
- Custom pulse animation on CTA button
- Hover effects and micro-interactions
- Auto-playing logo video on desktop

**SEO & Accessibility**
- Structured data (JSON-LD) for search engines
- Open Graph and Twitter Card meta tags
- Semantic HTML elements
- ARIA labels on interactive elements
- Alt text on all images
- Proper heading hierarchy (h1, h2, h3)

**PWA Features**
- Web manifest for installability
- Service worker registration
- Apple touch icon support
- Theme color customization

### File Structure
```
/
├── index.html (main landing page)
├── /src/
│   ├── /css/
│   │   └── output.css (Tailwind compiled styles)
│   ├── /html/
│   │   ├── about.html
│   │   ├── menu.html
│   │   ├── catering.html
│   │   ├── login.html
│   │   ├── option.html
│   │   ├── privacy-policy.html
│   │   └── terms-of-service.html
│   ├── /assets/
│   │   ├── /Fonts/ (custom typography)
│   │   └── /Images/ (logos, food photos, icons)
│   └── manifest.json
└── service-worker.js
```

### Custom Animations

**Pulse Animation** (Order Now button)
```css
Alternates between red background/white text and white background/red text
Animation duration: 2.5s infinite
Pauses on hover
```

**Hover Effects**
- Navigation buttons: Red → White background on hover
- Featured items: Lift effect (-5px translateY)
- Footer links: Color change on hover

### Browser Support
- Modern browsers with ES6+ JavaScript
- CSS Grid and Flexbox support
- Video autoplay (desktop only)
- Service Worker support for PWA features

### Setup & Deployment

**Local Development**
1. Clone the repository
2. Ensure all asset paths are correct
3. Use a local server (Live Server, Python SimpleHTTPServer, etc.)
4. No build process required - static HTML

**Production Deployment**
- Hosted at: www.maydayz.com
- Ensure HTTPS for PWA features
- Update Google Analytics and reCAPTCHA keys if deploying to new domain
- Configure service worker scope appropriately

### Performance Metrics
- Optimized for Core Web Vitals
- Lazy loading reduces initial page load
- Service worker enables offline browsing
- Preloaded critical resources minimize render-blocking

### Accessibility Compliance
- WCAG 2.1 compliant
- Keyboard navigable
- Screen reader friendly
- High contrast ratios
- Descriptive link text

---

## Special Thanks

**In Loving Memory**: Annette Tomlin, a beloved member of the Charlotte community and MayDayz family.

**Website Created By**: SOXIETY Technology Solutions

---

## Legal
- [Privacy Policy](https://maydayz.com/src/html/privacy-policy.html)
- [Terms of Service](https://maydayz.com/src/html/MaydayzSmoknBarBeCueLLCTermsofService.html)

©2025 MayDayz Smokn BBQ. All rights reserved.
