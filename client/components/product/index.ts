// Product Detail Page Components
// A modular, CMS-ready component library for premium product pages

export { ProductDetailHero } from "./ProductDetailHero";

export { ProductGallery } from "./ProductGallery";

export { ProductStickyHeader } from "./ProductStickyHeader";

export { BenefitsSection } from "./BenefitsSection";
export type { Benefit } from "./BenefitsSection";

export { ProductDescription } from "./ProductDescription";

export { TechnicalSpecifications } from "./TechnicalSpecifications";

export { UseCasesSection } from "./UseCasesSection";

export { CertificationsSection } from "./CertificationsSection";

export { CTASection } from "./CTASection";

/**
 * Component Structure for Premium Product Detail Page
 *
 * 1. ProductDetailHero
 *    - Product name, category, description
 *    - Smart feature badges (RGB, Tunable White, Dimmable, App Control)
 *    - Price display
 *    - CTA buttons (Download PDF, Add to Cart)
 *    - Slot for gallery component
 *
 * 2. ProductGallery
 *    - Image carousel with thumbnails
 *    - Keyboard/arrow navigation
 *    - Fullscreen modal preview
 *    - Image counter badge
 *    - Optional video support
 *
 * 3. BenefitsSection ("Pourquoi vous allez l'aimer")
 *    - Benefit cards with icons
 *    - Configurable number of benefits
 *    - Smooth animations on scroll
 *    - Hover effects
 *
 * 4. ProductDescription
 *    - Rich text content
 *    - Optional bullet points list
 *    - Responsive typography
 *    - Semantic HTML structure
 *
 * 5. TechnicalSpecifications
 *    - Dynamic spec grid/card layout
 *    - Responsive: cards on mobile, grid on desktop
 *    - Admin-editable fields
 *    - Hover state animations
 *
 * 6. UseCasesSection
 *    - Image + caption cards
 *    - Grid layout (3 columns on desktop, 1 on mobile)
 *    - Optional section (hidden if no use cases)
 *    - Image hover zoom effect
 *
 * 7. CertificationsSection
 *    - Certification badges
 *    - Icon + label layout
 *    - 2 columns on mobile, 4 on desktop
 *    - Staggered animation
 *
 * 8. CTASection
 *    - Hero call-to-action banner
 *    - Primary and secondary buttons
 *    - Links to contact and products pages
 *    - Dark background with accent color accent
 *
 * Design System:
 * - Colors: Navy foreground, Gold accent (28 100% 54%), Ivory backgrounds
 * - Fonts: Poppins (futura class) for headings, Roboto for body
 * - Animations: Fade-in, slide-up (0.3-0.6s ease-out)
 * - Spacing: Consistent py-16/py-20/py-28 for sections, px-4 for padding
 * - Responsive: Mobile-first with sm, md, lg breakpoints
 * - Dark Mode: Fully supported via CSS variables
 *
 * CMS Integration Points:
 * - All text content is props-driven
 * - All icon content can be customized
 * - Image arrays for galleries
 * - Specification/benefit/use-case arrays for flexible content
 * - All sections independently configurable
 */
