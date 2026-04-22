# Premium Product Detail Components

A modular, Builder.io-ready component library for creating premium product detail pages. All components are CMS-driven, responsive, and support dark mode.

## Architecture Overview

The product detail page is split into **8 independent components**, each handling a specific section. This modular approach enables:

- ✅ **Flexible Content**: Admin can configure all sections independently
- ✅ **Reusability**: Components can be used across different product pages
- ✅ **Maintainability**: Changes to one component don't affect others
- ✅ **Builder.io Integration**: All props are CMS-configurable
- ✅ **Responsive Design**: Mobile-first, optimized for all breakpoints
- ✅ **Dark Mode**: Full support via CSS variables

---

## Components

### 1. ProductDetailHero
**Location**: `ProductDetailHero.tsx`

Hero section with product information and CTA buttons.

```tsx
<ProductDetailHero
  name="LED Frameless Panel Light"
  category="Plafonniers"
  description="Premium smart lighting solution"
  price={249.99}
  features={smartFeatures}
  pdfFile="/path/to/spec-sheet.pdf"
  pdfFilename="LED-Panel-Specs.pdf"
>
  <ProductGallery images={images} productName={name} />
</ProductDetailHero>
```

**Props**:
- `name` (string, required): Product name
- `category` (string, required): Product category/badge
- `description` (string, required): Short product description
- `price` (number, required): Product price in TND
- `features` (Feature[], optional): Smart feature badges (RGB, Dimmable, etc.)
- `pdfFile` (string, optional): URL to technical sheet PDF
- `pdfFilename` (string, optional): PDF download filename
- `onDownloadPDF` (function, optional): Custom PDF download handler
- `onAddToCart` (function, optional): Custom add to cart handler
- `children` (ReactNode, optional): Gallery component slot

**Features**:
- Feature badges with icons
- Price display with accent color
- Download PDF button
- Add to cart button with toast notification
- Flexible gallery slot (children)

---

### 2. ProductGallery
**Location**: `ProductGallery.tsx`

Image gallery with slider, thumbnails, and fullscreen preview.

```tsx
<ProductGallery
  images={[
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
  ]}
  productName="LED Panel Light"
  videoUrl="https://example.com/video.mp4"
/>
```

**Props**:
- `images` (string[], required): Array of product image URLs
- `productName` (string, required): Product name for alt text
- `videoUrl` (string, optional): Optional video URL

**Features**:
- Main image display with zoom effect
- Thumbnail navigation
- Prev/next navigation arrows
- Image counter badge
- Fullscreen modal with keyboard controls
- Smooth hover animations

**Keyboard Controls**:
- Arrow Left/Right: Navigate between images
- Escape: Close fullscreen

---

### 3. BenefitsSection
**Location**: `BenefitsSection.tsx`

"Pourquoi vous allez l'aimer" section with benefit cards.

```tsx
<BenefitsSection
  benefits={[
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Longue durée de vie",
      description: "3000 heures de fonctionnement optimal"
    },
    // ... more benefits
  ]}
  sectionTitle="Avantages clés"
  sectionSubtitle="Caractéristiques"
  sectionDescription="Découvrez ce qui fait l'excellence..."
/>
```

**Props**:
- `benefits` (Benefit[], required): Array of benefit objects
- `sectionTitle` (string, optional): Section heading
- `sectionSubtitle` (string, optional): Section label/badge
- `sectionDescription` (string, optional): Section description

**Benefit Object**:
```ts
interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}
```

**Features**:
- Responsive grid (1 col mobile, 3 cols desktop)
- Icon cards with gradient backgrounds
- Staggered animation entrance
- Hover elevation effect

---

### 4. ProductDescription
**Location**: `ProductDescription.tsx`

Product description section with rich text and bullet points.

```tsx
<ProductDescription
  title="Description du produit"
  subtitle="Détails"
  content="Découvrez notre solution d'éclairage premium..."
  bulletPoints={[
    "Technologie LED haute performance",
    "Design architectural épuré",
    "Installation facile"
  ]}
/>
```

**Props**:
- `title` (string, optional): Section heading
- `subtitle` (string, optional): Section label
- `content` (string, optional): Main description text
- `bulletPoints` (string[], optional): Array of bullet points

**Features**:
- Semantic HTML structure
- Bullet points with checkmark icons
- Responsive typography
- Hover effects on list items

---

### 5. TechnicalSpecifications
**Location**: `TechnicalSpecifications.tsx`

Technical specs grid with responsive layout.

```tsx
<TechnicalSpecifications
  specifications={[
    { label: "Power", value: "15W" },
    { label: "Lumens", value: "1200 lm" },
    { label: "Color Temp", value: "2700-6500K" },
    { label: "IP Rating", value: "IP20" },
    { label: "Lifetime", value: "30,000 hours" }
  ]}
  sectionTitle="Caractéristiques techniques"
  sectionSubtitle="Détails techniques"
/>
```

**Props**:
- `specifications` (Specification[], required): Array of spec objects
- `sectionTitle` (string, optional): Section heading
- `sectionSubtitle` (string, optional): Section label

**Specification Object**:
```ts
interface Specification {
  label: string;
  value: string;
}
```

**Features**:
- Responsive card grid (2 cols on desktop, 1 on mobile)
- Hover highlight effects
- Clean label/value layout
- Gradient background container

---

### 6. UseCasesSection
**Location**: `UseCasesSection.tsx`

Product use cases with images and captions.

```tsx
<UseCasesSection
  useCases={[
    {
      image: "https://example.com/office.jpg",
      title: "Bureaux modernes",
      caption: "Illumination professionnelle..."
    },
    // ... more use cases
  ]}
  sectionTitle="Cas d'usage"
  sectionSubtitle="Applications"
/>
```

**Props**:
- `useCases` (UseCase[], required): Array of use case objects
- `sectionTitle` (string, optional): Section heading
- `sectionSubtitle` (string, optional): Section label

**UseCase Object**:
```ts
interface UseCase {
  image: string;
  title: string;
  caption: string;
}
```

**Features**:
- Image cards with captions
- Responsive grid (3 cols desktop, 1 mobile)
- Image zoom on hover
- Dark overlay effect
- Auto-hides if no use cases provided

---

### 7. CertificationsSection
**Location**: `CertificationsSection.tsx`

Compliance badges and certifications.

```tsx
<CertificationsSection
  certifications={[
    { icon: <CheckCircle className="w-12 h-12" />, label: "RoHS" },
    { icon: <CheckCircle className="w-12 h-12" />, label: "CE" },
    // ... more certs
  ]}
  sectionTitle="Certifications et conformité"
  sectionSubtitle="Normes & Standards"
/>
```

**Props**:
- `certifications` (Certification[], required): Array of cert objects
- `sectionTitle` (string, optional): Section heading
- `sectionSubtitle` (string, optional): Section label
- `sectionDescription` (string, optional): Section description

**Certification Object**:
```ts
interface Certification {
  icon: React.ReactNode;
  label: string;
}
```

**Features**:
- Responsive badge grid (4 cols desktop, 2 mobile)
- Icon with label layout
- Staggered animation entrance
- Hover scale effect

---

### 8. CTASection
**Location**: `CTASection.tsx`

Final call-to-action banner section.

```tsx
<CTASection
  productName="LED Panel Light"
  mainText="Prêt à illuminer vos espaces ?"
  description="Découvrez la performance et l'élégance..."
  primaryButtonText="Nous contacter"
  primaryButtonLink="/contact"
  secondaryButtonText="Voir d'autres produits"
  secondaryButtonLink="/products"
/>
```

**Props**:
- `productName` (string, required): Product name (for default description)
- `mainText` (string, optional): CTA heading
- `description` (string, optional): CTA description
- `primaryButtonText` (string, optional): Primary button label
- `primaryButtonLink` (string, optional): Primary button URL
- `secondaryButtonText` (string, optional): Secondary button label
- `secondaryButtonLink` (string, optional): Secondary button URL

**Features**:
- Dark background with gold accents
- Two-button CTA layout
- Responsive button stack (vertical on mobile, horizontal on desktop)
- Arrow icon animation on hover

---

## Design System

### Colors
- **Foreground**: `hsl(210 40% 20%)` - Deep Navy
- **Accent**: `hsl(28 100% 54%)` - Warm Gold
- **Background**: `hsl(0 0% 99%)` - Ivory
- **Muted Foreground**: `hsl(210 20% 50%)` - Soft Gray

All colors automatically adapt in dark mode via CSS variables.

### Typography
- **Headings** (h1-h3): Poppins (font-futura class)
- **Body Text**: Roboto (font-roboto class)
- **Font Sizes**: sm (0.875rem) → 5xl (3rem)
- **Font Weights**: Regular (400) → Bold (700)

### Spacing
- **Section Padding**: py-16 (mobile) → py-28 (desktop)
- **Horizontal Padding**: px-4 (mobile) → max-w-7xl (desktop)
- **Component Gaps**: gap-8 (large), gap-4 (medium), gap-2 (small)

### Animations
- **Fade In**: 0.6s ease-out
- **Slide Up**: 0.6s ease-out (20px translate)
- **Hover Scale**: 0.3s ease-out (-2px translate-y)
- **Color Transition**: 0.3s ease-out

All animations use TailwindCSS built-in utilities for optimal performance.

### Responsive Breakpoints
- **Mobile**: < 640px (single column layouts)
- **Small**: 640px - 768px (intermediate)
- **Medium**: 768px - 1024px (2 columns)
- **Large**: 1024px+ (3-4 columns)

---

## Integration with Builder.io

All components are designed to work with Builder.io's CMS:

### Example Page Structure
```tsx
// client/pages/ProductDetail.tsx
<div>
  <ProductDetailHero {...cmsData.hero}>
    <ProductGallery {...cmsData.gallery} />
  </ProductDetailHero>
  
  <BenefitsSection {...cmsData.benefits} />
  <ProductDescription {...cmsData.description} />
  <TechnicalSpecifications {...cmsData.specs} />
  <UseCasesSection {...cmsData.useCases} />
  <CertificationsSection {...cmsData.certifications} />
  <CTASection {...cmsData.cta} />
</div>
```

### Builder.io Entry Schema
Each component can map to Builder.io models:
- `ProductHero` model: name, category, description, features, price
- `Gallery` model: images array, video URLs
- `SectionContent` model: title, subtitle, description, items array
- `Specifications` model: label/value pairs
- `CertificationsList` model: icon, label pairs

---

## Customization

### Custom Styling
Components use TailwindCSS utility classes. Customize via:
1. **Tailwind config**: `tailwind.config.ts`
2. **Global CSS**: `client/global.css`
3. **Component props**: Pass className overrides

### Custom Icons
Replace icon components:
```tsx
import { Heart } from "lucide-react"; // or any icon library

<BenefitsSection benefits={[
  { icon: <Heart className="w-8 h-8" />, ... }
]} />
```

### Custom Animations
Modify animation delays via inline styles:
```tsx
style={{
  animation: `fade-in 0.6s ease-out forwards`,
  animationDelay: `${index * 150}ms` // Increase delay
}}
```

---

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android)

---

## Performance

- **Bundle Size**: ~15KB (minified + gzipped)
- **Rendering**: Optimized with React.memo and useMemo
- **Animations**: GPU-accelerated CSS transforms
- **Image Optimization**: Use next-gen formats (WebP) with fallbacks

---

## Accessibility

- ✅ Semantic HTML structure
- ✅ ARIA labels for interactive elements
- ✅ Keyboard navigation support
- ✅ Focus states for all buttons
- ✅ Color contrast compliant (WCAG AA)
- ✅ Screen reader friendly

---

## Examples

### Complete Product Page
See `client/pages/ProductDetail.tsx` for a full implementation example.

### Component Composition
```tsx
function MyProductPage() {
  const product = useProduct(productId);
  
  return (
    <>
      <ProductDetailHero {...product}>
        <ProductGallery images={product.images} />
      </ProductDetailHero>
      <BenefitsSection benefits={product.benefits} />
      <ProductDescription content={product.description} />
      <TechnicalSpecifications specifications={product.specs} />
      <UseCasesSection useCases={product.useCases} />
      <CertificationsSection certifications={product.certs} />
      <CTASection productName={product.name} />
    </>
  );
}
```

---

## Troubleshooting

### Images not displaying
- Check image URLs are accessible
- Verify CORS headers if using external CDN
- Use relative paths for internal images

### Animations not smooth
- Check browser GPU acceleration is enabled
- Test on different devices
- Consider reducing animation duration on mobile

### Dark mode not working
- Ensure `dark` class is on parent container
- Check CSS variable overrides in `:root.dark`
- Verify TailwindCSS dark mode is enabled

---

## Contributing

When adding new components:
1. Follow existing naming convention: `ComponentNameSection.tsx`
2. Use TypeScript interfaces for props
3. Support responsive design (mobile-first)
4. Include JSDoc comments
5. Test in light and dark modes
6. Update this README

---

## License

Part of Luxence Premium Lighting E-Commerce Platform.
