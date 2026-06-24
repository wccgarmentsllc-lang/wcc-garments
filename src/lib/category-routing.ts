import { DIVISIONS } from '@/lib/constants'

const CATEGORY_ALIASES: Record<string, Record<string, string>> = {
  households: {
    cookware: 'cookware',
    triplycookware: 'cookware',
    microfiber: 'cookware',
    industrialmicrofiber: 'cookware',
    cutlery: 'cutlery',
    premiumcutlery: 'cutlery',
    liquids: 'cutlery',
    bulkliquidssanitizers: 'cutlery',
    tabletop: 'table-top',
    tableserveware: 'table-top',
    kitchenlinens: 'table-top',
    institutionallinens: 'table-top',
    utility: 'utility',
    storageorganizer: 'utility',
    storage: 'utility',
    oemessentials: 'utility',
    oemcustomessentials: 'utility',
  },
  hospitality: {
    barware: 'barware',
    barwareproducts: 'barware',
    cookware: 'cookware',
    cookwareproducts: 'cookware',
    servingtools: 'serving-tools',
    servingkitchentools: 'serving-tools',
    cutlery: 'cutlery',
    tablecutlery: 'cutlery',
    storageserving: 'storage-serving',
  },
}

export function normalizeCategoryValue(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function resolveDivisionCategorySlug(
  divisionSlug: string,
  value?: string | null
) {
  if (!value) return null

  const division = DIVISIONS.find((item) => item.slug === divisionSlug)

  const normalizedValue = normalizeCategoryValue(value)
  const aliasedSlug = CATEGORY_ALIASES[divisionSlug]?.[normalizedValue]
  if (aliasedSlug) {
    return aliasedSlug
  }

  // Try to match against static DIVISIONS categories
  if (division) {
    const matchedCategory = division.categories.find((category) => {
      const normalizedName = normalizeCategoryValue(category.name)
      const normalizedSlug = normalizeCategoryValue(category.slug)

      return (
        category.slug === value ||
        normalizedSlug === normalizedValue ||
        normalizedName === normalizedValue
      )
    })

    if (matchedCategory) return matchedCategory.slug
  }

  // For live DB categories not in static DIVISIONS, convert the value to a slug
  // e.g. "Serving & Kitchen Tools" → "serving-kitchen-tools"
  const derivedSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return derivedSlug || null
}

export function getDivisionCategoryHref(
  divisionSlug: string,
  value?: string | null
) {
  const resolvedSlug = resolveDivisionCategorySlug(divisionSlug, value)

  if (!resolvedSlug || resolvedSlug === 'all') {
    return `/products/${divisionSlug}`
  }

  return `/products/${divisionSlug}/${resolvedSlug}`
}

export function getProductHref(divisionSlug: string, productSlug: string) {
  return `/products/${divisionSlug}/details/${productSlug}`
}

export function categoryMatchesSelection({
  divisionSlug,
  productCategoryName,
  productCategorySlug,
  selectedCategory,
  targetCategoryName,
}: {
  divisionSlug: string
  productCategoryName: string
  productCategorySlug?: string | null
  selectedCategory: string
  targetCategoryName: string
}) {
  if (selectedCategory === 'all') {
    return true
  }

  if (productCategorySlug === selectedCategory) {
    return true
  }

  const resolvedProductSlug =
    resolveDivisionCategorySlug(divisionSlug, productCategorySlug) ??
    resolveDivisionCategorySlug(divisionSlug, productCategoryName)

  if (resolvedProductSlug === selectedCategory) {
    return true
  }

  const normalizedProductCategory = normalizeCategoryValue(productCategoryName)
  const normalizedTargetCategory = normalizeCategoryValue(targetCategoryName)

  return (
    normalizedProductCategory.includes(normalizedTargetCategory) ||
    normalizedTargetCategory.includes(normalizedProductCategory)
  )
}
