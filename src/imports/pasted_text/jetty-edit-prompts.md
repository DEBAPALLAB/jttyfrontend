# JETTY — Editing Prompts: Add Minimal Touch to Existing Designs
### These are EDIT prompts, not new-build prompts. They assume the screens already exist and describe exactly what to change.

---

## Why this edit is needed

Everything built so far assumes voice is always available and always the primary path. That's wrong for real usage: libraries, offices, shared rooms, someone who just doesn't want to talk to their phone, someone who physically can't. Every voice action needs a touch equivalent that is **discoverable without being visible as a UI element** — the whole design philosophy (document is the world, nothing competes with the text) has to survive this addition, not get undone by it.

The fix is not a toolbar. It's not visible buttons next to text. It's exactly one gesture — **tap-and-hold** — that reveals a tiny, minimal action set only when a finger is actually on the page. Nothing is ever visible at rest except what's already there (the ambient indicator, margin ticks). Touch is a hidden layer, not a second UI.

---

## EDIT PROMPT 1 — Reading Surface: Add the Tap-and-Hold Layer

```
Edit the existing Jetty reading surface wireframe. Do NOT change the
base layout — the full-bleed document, generous margins, minimal top
bar, ambient listening indicator, and margin ticks all stay exactly
as designed. Add ONE new interaction layer on top: tap-and-hold.

ADD a new frame (or new state within the existing set) showing:

STATE — Tap-and-hold in progress: A passage of document text is being
pressed by a finger (indicate with a simple circular touch-point
glyph at the press location). The pressed passage shows a subtle
scale-down (indicate ~98% scale with slightly tighter text spacing
or a faint inset shadow around just that passage) to confirm the
press registered.

STATE — Hold threshold met (appears after a short hold, ~150ms):
A minimal radial menu appears, anchored at the touch point — EXACTLY
THREE icons only, arranged in a tight arc above or beside the touch
point (never a full circle, never more than 3 options): one for
highlight, one for mark important, one for note. Each icon should be
simple, single-color, no text labels (icons must be immediately
legible without words — use a highlighter-stroke glyph, a star or
flag glyph, and a small pencil/note glyph respectively). The rest of
the document remains fully visible and undimmed behind this menu —
this is NOT a modal, it's a small floating cluster anchored to one
point on the page.

STATE — Icon selected: User's finger has dragged to and released on
one of the three icons (show the "highlight" icon in a selected/
pressed state as the example). Caption: "releasing on an icon
triggers the exact same settle animation as its voice equivalent —
the Wash for highlight, Flash-Settle for important, Unfold for note.
Touch and voice always converge on the same result and the same
animation."

STATE — Released with no selection: Finger lifted without dragging to
any icon. The radial menu fades out (~150ms), the passage returns to
its normal scale, nothing happens. Caption: "tap-and-hold with no
follow-through is a safe, reversible gesture — never accidentally
triggers an action."

IMPORTANT CONSTRAINTS:
- Do not add any permanently-visible button, icon, or toolbar
  anywhere in the resting/idle state of the reading surface. The
  radial menu ONLY exists while a finger is actively pressing the
  page — it must not persist or leave any residue once released.
- The three icons must be visually minimal — flat, single-weight
  line icons, no color beyond grayscale, no drop shadows, no badges.
- The radial menu must never cover the passage being acted on — 
  position it just above or beside the touch point so the user can
  still see what they're about to act on.

STYLE: low-fidelity, grayscale, consistent with the existing reading
surface wireframes already built.

DELIVERABLE: a short film-strip of 4 states (press → hold-threshold/
menu appears → icon selected → released-no-selection), mobile
viewport (375x812) per frame, captioned as described above.
```

---

## EDIT PROMPT 2 — Ambient Indicator: Add a Touch Fallback for "Take Me Back"

```
Edit the existing ambient listening indicator at the bottom of the
Jetty reading surface. Currently it only responds to voice. Add a
minimal touch equivalent for the single most important voice command
— "take me back" — without adding any new visible element.

ADD a new interaction state:

STATE — Tap on the ambient indicator itself (not tap-and-hold, a
simple single tap): This single tap is the touch equivalent of
saying "take me back." Show the SAME Return sequence already
designed (dim → card rises → transition → settle) beginning
immediately on tap, with no intermediate confirmation screen or menu.
Caption: "a single tap directly on the ambient indicator triggers
Return — the same signature sequence as the voice command. No
separate icon needed; the indicator itself IS the touch target,
since it's already the one persistent element on screen."

STATE — Long-press on the ambient indicator (distinct from single
tap): This is the touch equivalent of "pause listening" / "resume
listening." Show the indicator transitioning from its normal
breathing-pulse state to a dimmed, static-glow "paused" state after
a long-press, and back again on a second long-press. Caption: "long-
press toggles listening on/off — distinct gesture (hold vs. tap) so
it's never triggered by accident while reaching for Return."

IMPORTANT CONSTRAINTS:
- Do not add a second icon, button, or badge near the ambient
  indicator. Both new behaviors (tap = return, long-press = pause)
  live entirely on the EXISTING single indicator element — it now
  has to do a bit more work, but nothing new appears on screen.
- The indicator's existing idle/listening/processing pulse states
  from earlier specs are unchanged. This edit only adds what happens
  when it is touched directly.

STYLE: low-fidelity, grayscale, consistent with the existing ambient
indicator design already built.

DELIVERABLE: two short state pairs (tap → Return begins; long-press →
paused / long-press again → resumed), mobile viewport (375x812),
captioned as described.
```

---

## EDIT PROMPT 3 — The Margin: Add Touch as the Primary (Not Secondary) Path

```
Edit the existing Jetty "Margin" wireframe set (margin ticks, unfold-
in-place moment cards, "see it all" mode). These were originally
described as reachable by "tap the tick, or tap the block" — touch
was already present here, but make it explicit and add one missing
piece: how a user discovers the "see it all" mode via touch, since it
was previously only described as reachable through the overflow menu.

ADD a new state to the existing set:

STATE — Overflow menu opened via touch: Show the top-right overflow
control (···) in its pressed state, with a minimal dropdown/menu
appearing directly below it — no more than 3 plain-language text
options, left-aligned, no icons needed here since this is a rare,
low-frequency menu (unlike the tap-and-hold radial, which needs icon-
only speed): "see it all," "share," "settings." Keep this menu
visually plain — small type, generous spacing, no dividers or
elaborate styling, since it's intentionally a quiet, secondary
surface used rarely.

STATE — "see it all" selected: Transitions directly into the already-
designed compressed scanning view (annotated blocks expanded, empty
blocks compressed to thin lines). No new visual language needed here
— just show the tap-to-select moment on the "see it all" menu item
itself.

CONFIRM (no change needed, just verify consistency): The margin tick
tap-to-unfold and block tap-to-unfold interactions already designed
remain the PRIMARY touch path for reviewing individual moments — this
edit does not change that, it only fills in how the LESS common
"view everything at once" action is reached by touch.

STYLE: low-fidelity, grayscale, consistent with the existing Margin
wireframes already built. The overflow menu should look deliberately
plainer/quieter than the tap-and-hold radial menu (Edit Prompt 1) —
that contrast in visual weight is intentional: frequent actions get
icon-only speed, rare actions get plain readable text.

DELIVERABLE: two frames — the overflow menu open with its 3 text
options, and the tap-to-select moment on "see it all" — mobile
viewport (375x812) each.
```

---

## EDIT PROMPT 4 — Document Library: Confirm Touch-Native, No Change Needed (Verification Pass)

```
Review the existing Jetty document library wireframe. This screen was
already designed touch-first (tap a row to open/continue, tap "+" to
add a document) — voice was never the primary path here since
browsing a list is naturally a touch/scroll interaction.

No structural edit is required. Instead, produce ONE new frame
confirming the voice-optional nature of this screen explicitly, for
documentation completeness:

FRAME — Annotated existing library view: Take the already-built
populated library frame and add small caption labels pointing at the
key touch targets already present: "tap row → continue (Return
sequence)," "tap + → open new document," "tap document title text
itself is the full touch target, not just an icon — generous hit
area for easy tapping." No new visual elements, purely annotation
overlay on the existing design to confirm it already satisfies the
minimal-touch requirement.

STYLE: low-fidelity, grayscale, identical to the existing library
wireframe, with added caption/annotation overlay only.

DELIVERABLE: one annotated frame, mobile viewport (375x812), reusing
the exact existing library layout with touch-target callouts added.
```

---

## EDIT PROMPT 5 — Sharing Flow: Add a Touch Fallback for Word Confirmation

```
Edit the existing Jetty sharing/device-pairing wireframe (three
spoken words, circles filling as each is confirmed). Voice is the
natural mechanism here since the whole point is two people speaking
words aloud — but add a minimal touch fallback for the edge case
where speaking isn't practical (e.g. a noisy room, a user who can't
speak clearly).

ADD one new state to the existing set:

STATE — Manual fallback option: Below the three-circle element and
the "say these into the other device" instruction, add ONE small,
quiet, plain-text link-style option: "or enter manually." This should
be visually minimal — small muted type, no button styling, sitting
naturally below the primary voice-driven flow so it never competes
with it for attention.

STATE — Manual entry invoked: Tapping that option reveals a simple
row of 3 small text input fields (or a single text field expecting
all three words), styled plainly, with a single "connect" tap target
below it. Keep this as minimal as possible — no additional
explanation text needed beyond what's already been established by
the primary flow above it.

IMPORTANT CONSTRAINT: This fallback must remain visually secondary at
all times. The three-circle voice flow is still the primary, most
prominent element on this screen. The manual option should look like
a quiet escape hatch, not an equal alternative — most users should
never need to notice it, but it must be there for the ones who do.

STYLE: low-fidelity, grayscale, consistent with the existing sharing
flow wireframes already built.

DELIVERABLE: two frames — the primary three-circle view now showing
the small "or enter manually" text link beneath it, and the manual
entry state it reveals — mobile viewport (375x812) each.
```

---

## EDIT PROMPT 6 — Onboarding: Update the Hint Copy to Mention Touch

```
Edit the existing Jetty onboarding storyboard (empty invitation →
document loads → first hint appears → first highlight lands, hint
dismissed). Only ONE change is needed: the hint copy in the "first
hint appears" frame.

CHANGE: The existing hint text "say 'highlight this' while you read"
should be replaced with: "say 'highlight this' — or press and hold
any line."

Keep every other visual element of this frame identical to the
existing design — same speech-bubble shape, same position near the
ambient indicator, same muted styling, same permanent-dismissal
behavior after first successful action (whether that first action
comes from voice OR from the tap-and-hold gesture).

No other frames in the onboarding sequence need to change. The
"first highlight lands" frame already shows the resulting highlight
state, which looks identical regardless of whether voice or touch
triggered it — no edit needed there.

STYLE: low-fidelity, grayscale, identical to the existing onboarding
frame, with only the caption text inside the hint bubble updated.

DELIVERABLE: one updated frame (the "first hint appears" frame only),
mobile viewport (375x812), with the new copy shown in place of the
old.
```

---

## EDIT PROMPT 7 — Full App Flow Storyboard: Insert One Touch-Only Frame

```
Edit the existing Jetty 10-frame full app flow storyboard (empty
invitation → document loads → hint → first highlight → mark
important → margin review → library → return card → return settle →
share). Insert ONE new frame to demonstrate that the same journey
works without voice at all.

INSERT after frame 4 (first highlight lands) and before frame 5 (mark
important), as a new frame 4.5:

FRAME 4.5 — Touch-only alternative shown explicitly: Show the SAME
document from frame 4, but depict the tap-and-hold radial menu
(designed in Edit Prompt 1) actively open on a different passage,
mid-selection, with a finger/touch-point glyph visible pressing the
page. Caption: "the entire product works identically through touch
alone — this same document, same passage, same three actions
available, reached without a single spoken word."

Renumber no other frames — simply insert this as an additional beat
in the sequence, making it 11 frames total. All other frames and
their captions remain exactly as already designed.

STYLE: low-fidelity, grayscale, consistent with the existing 10-frame
storyboard already built.

DELIVERABLE: the single new frame 4.5, mobile viewport (375x812),
designed to slot into the existing storyboard sequence at that exact
position.
```

---

## Shared System Prompt for This Editing Pass

```
You are EDITING existing wireframes for "Jetty," not designing from
scratch. The voice-first design language, the five animation patterns
(Wash, Flash-Settle, Unfold, Carry, Whisper), the Margin system, and
the overall layout philosophy (document is the whole world, nothing
permanently visible except the ambient indicator and margin ticks)
are ALL ALREADY DECIDED and must not change.

The only new addition across this entire editing pass is: minimal,
discoverable touch equivalents for every voice action, added without
introducing any new permanently-visible UI element.

Rules specific to this pass:
- Touch affordances only ever appear WHILE a finger is actively
  touching the screen (tap-and-hold radial menu) or ON an element
  that already exists at rest (tapping the ambient indicator itself,
  tapping an existing margin tick, tapping the existing overflow
  menu). Never add a new icon, button, or badge that sits visible on
  the page at idle.
- The tap-and-hold radial menu is capped at exactly 3 icon options,
  no text labels, positioned so it never covers the passage being
  acted on.
- Every touch action must resolve into the EXACT SAME animation/
  result as its voice equivalent — touch and voice are two doors
  into one system, never two different experiences.
- Low-priority actions (settings, "see it all," manual sharing
  fallback) can use plain small text menus, since they're rare. High-
  frequency actions (highlight, important, note) must stay icon-only
  and fast, since they're common.
- Low-fidelity, grayscale, real example content, consistent with
  everything already built. Mobile viewport (375x812) unless stated
  otherwise.
```

---

*Editing pass — August 2026. These prompts assume the base wireframes (reading surface, Margin, Return sequence, library, onboarding, sharing, full app flow) already exist and modify them in place rather than rebuilding from zero.*