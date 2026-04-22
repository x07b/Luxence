-- Import test content for LED Frameless Panel Light product
-- This adds the editable sections shown in your admin screenshots
-- Run this after the product_details_sections table is created

-- First, get the product ID for the LED Frameless Panel Light
-- Replace 'your_product_id' with the actual ID from your database
-- You can find it in the products table

-- To find the product ID, run this first:
-- SELECT id, name FROM products WHERE slug = 'led-frameless-panel-light';

-- Then use that ID in the INSERT statements below:

-- Example insert (replace 'your_product_id' with actual ID):
INSERT INTO product_details_sections (product_id, title, content, order_index)
VALUES 
  (
    'your_product_id',
    'Pourquoi choisir ce produit ?',
    'Performance garantie
Nous garantissons la performance constante de ce luminaire avec une couverture complète et un support technique réactif. Votre investissement est protégé.

Solution économique
Réduisez vos coûts énergétiques tout en profitant d''une qualité d''éclairage supérieure. Amortissement rapide et rentabilité garantie.

Respect de l''environnement
Solution écologique et durable, recyclable et certifiée. Contribuez à la préservation de l''environnement sans compromis.

Support expert
Équipe d''experts disponible pour assistance, conseil et maintenance. Satisfaction client garantie à 100%.',
    0
  ),
  (
    'your_product_id',
    'Cas d''application',
    'Espaces professionnels
Bureau, open space, salles de réunion. Créez un environnement productif et confortable pour vos équipes.

Espaces résidentiels
Salon, cuisine, chambre. Transformez votre habitat avec un éclairage adapté à votre style de vie.

Environnements commerciaux
Boutique, galerie, showroom. Mettez en valeur vos produits avec un éclairage professionnel et élégant.',
    1
  );

-- Note: The structure uses newlines to separate items that will be displayed in the admin form.
-- The ProductDetailsPanel component will handle rendering this content appropriately.
