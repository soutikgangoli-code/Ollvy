-- Fix broken external links in service_packages review_sources
-- These government URLs have changed/moved

-- Fix CBIC GST links (old: cbic.gov.in -> new: cbic-gst.gov.in)
UPDATE service_packages
SET review_sources = REPLACE(
  REPLACE(
    review_sources::text,
    'https://www.cbic.gov.in/htdocs-cbec/gst/cgst-act.pdf',
    'https://cbic-gst.gov.in/gst-acts.html'
  ),
  'https://www.cbic.gov.in',
  'https://cbic-gst.gov.in'
)::jsonb
WHERE review_sources IS NOT NULL
  AND review_sources::text LIKE '%cbic.gov.in%';

-- Fix IP India Trade Marks Act link
UPDATE service_packages
SET review_sources = REPLACE(
  review_sources::text,
  'https://ipindia.gov.in/writereaddata/Portal/IPOAct/1_34_1_trade-marks-act-1999.pdf',
  'https://www.indiacode.nic.in/bitstream/123456789/15427/1/the_trade_marks_act,_1999.pdf'
)::jsonb
WHERE review_sources IS NOT NULL
  AND review_sources::text LIKE '%ipindia.gov.in/writereaddata%';

-- Fix LLP MCA Portal link
UPDATE service_packages
SET review_sources = REPLACE(
  review_sources::text,
  'https://llp.mca.gov.in',
  'https://www.mca.gov.in/content/mca/global/en/mca/llp-e-filling.html'
)::jsonb
WHERE review_sources IS NOT NULL
  AND review_sources::text LIKE '%llp.mca.gov.in%';
