import { createContext, useContext } from 'react'

/**
 * Terms already marked within the current card.
 *
 * A card that says "Lakeflow Jobs" four times should get **one** underline, not
 * four. <GlossaryScope> provides a fresh set per card; <RichText> adds to it as
 * it renders.
 *
 * Mutating during render is deliberate and safe here: the set is recreated on
 * every render of the scope, so a re-render (or React's double-invoke under
 * StrictMode) reproduces exactly the same result. It only affects decoration.
 *
 * Lives in `lib/` rather than beside the component so that the component file
 * exports components only, which is what Fast Refresh needs.
 */
export const SeenTermsContext = createContext<Set<string> | null>(null)

export function useSeenTerms() {
  return useContext(SeenTermsContext) ?? undefined
}
