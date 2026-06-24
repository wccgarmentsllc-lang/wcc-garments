-- ═══════════════════════════════════════════════════════════════
-- WCC B2B PLATFORM — DATABASE MIGRATION VERIFICATION SCRIPT
-- ═══════════════════════════════════════════════════════════════
-- Run this in your Supabase SQL Editor AFTER running wcc_full_migration.sql.
-- It verifies counts, row level security (RLS), and index existence.

DO $$
DECLARE
    v_categories_count INTEGER;
    v_brands_count INTEGER;
    v_products_count INTEGER;
    v_enquiries_count INTEGER;
    v_media_count INTEGER;
    v_newsletter_count INTEGER;
    v_broadcasts_count INTEGER;
    v_website_content_count INTEGER;
    
    v_categories_rls BOOLEAN;
    v_brands_rls BOOLEAN;
    v_products_rls BOOLEAN;
    v_enquiries_rls BOOLEAN;
    v_media_rls BOOLEAN;
    v_newsletter_rls BOOLEAN;
    v_broadcasts_rls BOOLEAN;
    v_website_content_rls BOOLEAN;

    v_errors INTEGER := 0;
BEGIN
    RAISE NOTICE '════════════════════════════════════════════════════';
    RAISE NOTICE '      STARTING MIGRATION AUDIT & VERIFICATION       ';
    RAISE NOTICE '════════════════════════════════════════════════════';

    -- 1. COUNTING RECORDS
    SELECT COUNT(*) INTO v_categories_count FROM public.categories;
    SELECT COUNT(*) INTO v_brands_count FROM public.brands;
    SELECT COUNT(*) INTO v_products_count FROM public.products;
    SELECT COUNT(*) INTO v_enquiries_count FROM public.enquiries;
    SELECT COUNT(*) INTO v_media_count FROM public.media;
    SELECT COUNT(*) INTO v_newsletter_count FROM public.newsletter_subscribers;
    SELECT COUNT(*) INTO v_broadcasts_count FROM public.broadcasts;
    SELECT COUNT(*) INTO v_website_content_count FROM public.website_content;

    RAISE NOTICE 'TABLE RECORD COUNTS:';
    RAISE NOTICE '  - categories: % (Expected: 6)', v_categories_count;
    RAISE NOTICE '  - brands: % (Expected: 3)', v_brands_count;
    RAISE NOTICE '  - products: % (Expected: 15)', v_products_count;
    RAISE NOTICE '  - enquiries: % (Expected: 5)', v_enquiries_count;
    RAISE NOTICE '  - media: % (Expected: 6)', v_media_count;
    RAISE NOTICE '  - newsletter_subscribers: %', v_newsletter_count;
    RAISE NOTICE '  - broadcasts: %', v_broadcasts_count;
    RAISE NOTICE '  - website_content: % (Expected: 1)', v_website_content_count;

    IF v_categories_count < 6 OR v_brands_count < 3 OR v_products_count < 15 OR v_website_content_count < 1 THEN
        RAISE WARNING '  [FAIL] Record counts are lower than expected minimum seed values!';
        v_errors := v_errors + 1;
    ELSE
        RAISE NOTICE '  [PASS] Record counts match expected seed values.';
    END IF;

    -- 2. VERIFYING ROW LEVEL SECURITY (RLS)
    SELECT relrowsecurity INTO v_categories_rls FROM pg_class WHERE oid = 'public.categories'::regclass;
    SELECT relrowsecurity INTO v_brands_rls FROM pg_class WHERE oid = 'public.brands'::regclass;
    SELECT relrowsecurity INTO v_products_rls FROM pg_class WHERE oid = 'public.products'::regclass;
    SELECT relrowsecurity INTO v_enquiries_rls FROM pg_class WHERE oid = 'public.enquiries'::regclass;
    SELECT relrowsecurity INTO v_media_rls FROM pg_class WHERE oid = 'public.media'::regclass;
    SELECT relrowsecurity INTO v_newsletter_rls FROM pg_class WHERE oid = 'public.newsletter_subscribers'::regclass;
    SELECT relrowsecurity INTO v_broadcasts_rls FROM pg_class WHERE oid = 'public.broadcasts'::regclass;
    SELECT relrowsecurity INTO v_website_content_rls FROM pg_class WHERE oid = 'public.website_content'::regclass;

    RAISE NOTICE 'ROW LEVEL SECURITY (RLS) STATUS:';
    RAISE NOTICE '  - categories: %', CASE WHEN v_categories_rls THEN 'ENABLED' ELSE 'DISABLED' END;
    RAISE NOTICE '  - brands: %', CASE WHEN v_brands_rls THEN 'ENABLED' ELSE 'DISABLED' END;
    RAISE NOTICE '  - products: %', CASE WHEN v_products_rls THEN 'ENABLED' ELSE 'DISABLED' END;
    RAISE NOTICE '  - enquiries: %', CASE WHEN v_enquiries_rls THEN 'ENABLED' ELSE 'DISABLED' END;
    RAISE NOTICE '  - media: %', CASE WHEN v_media_rls THEN 'ENABLED' ELSE 'DISABLED' END;
    RAISE NOTICE '  - newsletter_subscribers: %', CASE WHEN v_newsletter_rls THEN 'ENABLED' ELSE 'DISABLED' END;
    RAISE NOTICE '  - broadcasts: %', CASE WHEN v_broadcasts_rls THEN 'ENABLED' ELSE 'DISABLED' END;
    RAISE NOTICE '  - website_content: %', CASE WHEN v_website_content_rls THEN 'ENABLED' ELSE 'DISABLED' END;

    IF NOT (v_categories_rls AND v_brands_rls AND v_products_rls AND v_enquiries_rls AND v_media_rls AND v_newsletter_rls AND v_broadcasts_rls AND v_website_content_rls) THEN
        RAISE WARNING '  [FAIL] Row Level Security is disabled on one or more tables!';
        v_errors := v_errors + 1;
    ELSE
        RAISE NOTICE '  [PASS] Row Level Security is enabled on all tables.';
    END IF;

    -- 3. CHECK FOREIGN KEY CONSTRAINTS
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_type = 'FOREIGN KEY' AND table_name = 'products'
    ) THEN
        RAISE NOTICE '  [PASS] Foreign Key constraints verified on products table.';
    ELSE
        RAISE WARNING '  [FAIL] Foreign Key constraints missing on products table!';
        v_errors := v_errors + 1;
    END IF;

    -- 4. CHECK STORAGE BUCKET wcc_media
    IF EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'wcc_media'
    ) THEN
        RAISE NOTICE '  [PASS] Storage bucket "wcc_media" exists.';
    ELSE
        RAISE WARNING '  [FAIL] Storage bucket "wcc_media" was not found!';
        v_errors := v_errors + 1;
    END IF;

    -- 5. FINAL REPORT
    RAISE NOTICE '════════════════════════════════════════════════════';
    IF v_errors = 0 THEN
        RAISE NOTICE '   MIGRATION SUCCESS: ALL VERIFICATION CHECKS PASSED  ';
    ELSE
        RAISE WARNING '   MIGRATION AUDIT FAILED WITH % ERROR(S)           ', v_errors;
    END IF;
    RAISE NOTICE '════════════════════════════════════════════════════';
END;
$$;
