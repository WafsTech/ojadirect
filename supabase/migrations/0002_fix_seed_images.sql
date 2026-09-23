-- Oja Direct — fix 7 seed product images
-- Paste this into the Supabase SQL Editor and run it once against your
-- existing project. It only updates `image_urls` on 7 already-seeded rows —
-- no schema, policy or pricing changes.
--
-- Two kinds of bugs, both found by checking every seeded image URL:
--   1. Dead links (404): the URL simply didn't resolve, so next/image
--      rendered nothing and the browser fell back to showing the alt text.
--      -> nonstick-cooking-pot-set-5pc, stainless-cutlery-set-24pc,
--         rechargeable-table-fan-12in
--   2. Live but wrong: the URL returned 200, so it rendered fine, but the
--      photo was of a completely different subject.
--      -> rechargeable-standing-fan-18in and wall-mount-ceiling-fan-56in
--         were both showing a chair; electric-blender-1.5l was showing
--         coffee-making equipment; led-rechargeable-lantern was showing an
--         unrelated desk flatlay with another company's name visible in it.
--
-- Every replacement URL below was fetched and confirmed to return HTTP 200
-- and visually confirmed to show the right subject before being used here.

update products set image_urls = array['https://images.unsplash.com/photo-1580929753603-10519c6e480a?w=800']
  where slug = 'nonstick-cooking-pot-set-5pc';

update products set image_urls = array['https://images.unsplash.com/photo-1654064754916-e3edeb09c042?w=800']
  where slug = 'electric-blender-1.5l';

update products set image_urls = array['https://images.unsplash.com/photo-1739133337655-1652d6df6581?w=800']
  where slug = 'stainless-cutlery-set-24pc';

update products set image_urls = array['https://images.unsplash.com/photo-1601084195907-44baaa49dabd?w=800']
  where slug = 'rechargeable-standing-fan-18in';

update products set image_urls = array['https://images.unsplash.com/photo-1622480916526-285a5e0e533b?w=800']
  where slug = 'rechargeable-table-fan-12in';

update products set image_urls = array['https://images.unsplash.com/photo-1646840299746-0be3a2604eb0?w=800']
  where slug = 'wall-mount-ceiling-fan-56in';

update products set image_urls = array['https://images.unsplash.com/photo-1685342654383-584d56907425?w=800']
  where slug = 'led-rechargeable-lantern';

-- Not changed, flagged for your own judgment instead (neither is broken or
-- misleading, just not a great photo — see the chat writeup):
--   - ankara-print-mens-shirt: shows plain folded shirts, not a printed fabric.
--   - budget-feature-phone-dual-sim: shows a premium-looking smartphone.
--   - ladies-handbag-leather-look: the bag's hardware resembles a known
--     luxury brand's design.
