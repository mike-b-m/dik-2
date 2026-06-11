export type WordRow = {
  id: number
  word: string
  def: string | null
  sino: string[] | null
  kont: string[] | null
  api: string | null
  etymology: string | null
  exemple: string[] | null
  nature: string | null
  approved: boolean
  created_at: string
  submitted_by: string | null
}

export const NATURE_OPTIONS = [
  'Non',
  'Vèb',
  'Adjektif',
  'Advèb',
  'Pwonon',
  'Prepozisyon',
  'Konjonksyon',
  'Entèjeksyon',
  'Detèminan',
  'Ekspresyon',
]

// "tandrès, atachman; renmen" -> ["tandrès","atachman","renmen"]
export const toList = (s: string): string[] =>
  s.split(/[,;\n]+/).map((x) => x.trim()).filter(Boolean)

export const fromList = (a?: string[] | null): string => (a ?? []).join(', ')

// One example per line in the textarea
export const linesToList = (s: string): string[] =>
  s.split(/\n+/).map((x) => x.trim()).filter(Boolean)

export const listToLines = (a?: string[] | null): string => (a ?? []).join('\n')
