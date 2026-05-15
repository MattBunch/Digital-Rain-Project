You are planning a new feature for the Digital Rain Project — a Svelte 5 + TypeScript + Vite app.
Read the repository reference at docs/REPO_REFERENCE.md and the following key files before planning:

- src/lib/constants/matrix.ts
- src/lib/constants/presets.ts
- src/lib/types/index.ts
- src/lib/components/SettingsMenu.svelte
- src/lib/utils/UrlParams.ts
- src/lib/utils/SettingsUtils.ts
- src/lib/constants/HelpData.ts
- src/lib/utils/MathUtils.ts
- src/lib/utils/**tests**/MathUtils.test.ts
- src/lib/models/MatrixString.ts
- src/lib/models/**tests**/MatrixString.test.ts
- src/lib/engine/CoreEngine.ts
- src/lib/engine/**tests**/CoreEngine.test.ts
- src/lib/types/index.ts

---

FEATURE: Character Set Switcher

The user wants to switch the character set used by the digital rain animation. Options:

- katakana (current default — already in ALPHABET in matrix.ts)
- latin (a-z, A-Z, 0-9 only)
- binary (0 and 1 only)
- hex (0-9, A-F)
- braille (Unicode braille block U+2800–U+28FF)
- custom (user types their own string of characters)

---

ARCHITECTURAL DECISION (CONFIRMED — DO NOT QUESTION OR PROPOSE ALTERNATIVES):

getRandomChar() and generateWord() in MathUtils.ts will be refactored to accept
an optional alphabet parameter using a functional programming approach:

getRandomChar(alphabet?: string): string
generateWord(wordSize: number, alphabet?: string): string

When the alphabet parameter is omitted, both functions fall back to the module-level
ALPHABET constant from matrix.ts — preserving 100% backward compatibility with all
existing call sites that do not pass an alphabet.

The resolved alphabet string must be threaded through the call chain as follows:

IEngineSettings.charSet (string key e.g. "katakana" | "binary" | "hex" | "braille" | "latin" | "custom")
IEngineSettings.customCharSet (string — only used when charSet === "custom")
↓
CoreEngine holds the resolved alphabet string at runtime
(a pure getter that maps charSet + customCharSet → the actual character string,
using a lookup table defined in matrix.ts alongside the existing ALPHABET constant)
↓
CoreEngine passes the resolved alphabet into generateWord() and getRandomChar()
wherever it currently calls them (createMatrixArray, changeWordCheck, moveWord, etc.)
↓
MatrixString.show() and MatrixString.showAlternative() receive the alphabet via
IMatrixStringConfig (add an alphabet field to that interface) so that per-character
random substitution (the onePercentChance letter swap) also uses the correct charset
↓
MatrixString internally calls getRandomChar(alphabet) and generateWord(size, alphabet)
using the value passed through IMatrixStringConfig

No global mutable state. No module-level alphabet variable outside of the
constant definition in matrix.ts. The ALPHABET constant in matrix.ts remains
as the katakana+latin fallback and is never reassigned.

---

CONSTRAINTS:

- All existing call sites of getRandomChar() and generateWord() that do NOT pass
  an alphabet must continue to work identically — the optional parameter must
  default to ALPHABET from matrix.ts.
- IEngineSettings must gain two new fields:
  charSet: 'katakana' | 'latin' | 'binary' | 'hex' | 'braille' | 'custom'
  customCharSet: string (ignored unless charSet === 'custom', default '')
- A CHAR_SETS lookup object must be added to matrix.ts mapping each key to its
  character string. 'katakana' maps to the existing ALPHABET value.
- CoreEngine must expose a readonly resolvedAlphabet getter that returns the
  correct string based on its current charSet and customCharSet state, falling
  back to ALPHABET if the resolved string would be empty.
- URL hash serialization (UrlParams.ts) must support both new fields with short keys.
- compareSettings() in SettingsUtils.ts must include both new fields.
- DEFAULT_SETTINGS and PRESETS in presets.ts must be updated with charSet defaults.
- The SettingsMenu accordion must gain a CyberSelect for charSet. When "custom"
  is selected, a CyberTextInput appears beneath it for the user to enter their
  character pool (minimum length validation: if empty or whitespace only, fall
  back to ALPHABET silently in the engine — no error thrown in the UI).
- All existing unit tests must continue to pass without modification where possible.
  Where a test directly imports and calls getRandomChar() or generateWord() without
  an alphabet, it must still pass because of the default parameter fallback.
- New unit tests must be written covering:
  - getRandomChar() with no argument (backward compat)
  - getRandomChar(alphabet) returns only chars from that alphabet
  - generateWord(n) with no alphabet argument (backward compat)
  - generateWord(n, alphabet) returns only chars from that alphabet
  - CoreEngine.resolvedAlphabet returns correct string for each charSet key
  - CoreEngine.resolvedAlphabet falls back to ALPHABET when customCharSet is empty
  - compareSettings() correctly detects charSet and customCharSet differences
  - UrlParams round-trip serialization for both new fields

---

PLAN FORMAT:
Produce a strictly ordered, numbered implementation plan. For each step include:

1. Which file(s) change
2. Exactly what changes (type signatures, new constants, new fields, UI additions)
3. Which existing tests are affected and how (most should need zero changes
   due to the default parameter fallback)
4. What new tests to write for that step

Keep each step atomic and independently reviewable via a single git commit.
Do not write any code — produce the plan only.
Flag any remaining ambiguities that need confirmation before coding begins,
but do NOT re-open the architectural question about parameter passing — that is settled.
