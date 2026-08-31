# JETTY — Deep Interaction Spec & Screen-Level Prompt Briefs
### Version 2.0 · August 2026 · Supersedes history-drawer concept from v1

---

This document does three things:

1. **Fixes the history drawer** — the previous "drawer that slides up over the document" concept is scrapped. A new concept, **The Margin**, replaces it.
2. **Goes deep on every screen** — full interaction choreography, not just layout. Every tap, every voice trigger, every state transition, timed and described.
3. **Provides longer, more detailed prompt briefs** — closer to a spec than a suggestion, so a wireframing tool or a human designer can execute with almost no ambiguity left.

---

## Table of Contents

1. [Why the Drawer Was Wrong](#1-why-the-drawer-was-wrong)
2. [The New Concept: The Margin](#2-the-new-concept-the-margin)
3. [Full Interaction Map (All Screens)](#3-full-interaction-map-all-screens)
4. [Screen 01 — Reading Surface: Full Interaction Choreography](#4-screen-01--reading-surface-full-interaction-choreography)
5. [Screen 02 — The Margin (Replaces History Drawer)](#5-screen-02--the-margin-replaces-history-drawer)
6. [Screen 03 — Return Sequence: Frame-by-Frame Timing](#6-screen-03--return-sequence-frame-by-frame-timing)
7. [Screen 04 — Document Library: Interaction Detail](#7-screen-04--document-library-interaction-detail)
8. [Screen 05 — Onboarding: Full Script](#8-screen-05--onboarding-full-script)
9. [Screen 06 — Sharing: Full Interaction Detail](#9-screen-06--sharing-full-interaction-detail)
10. [Screen 07 — Error / Misheard Command](#10-screen-07--error--misheard-command)
11. [Micro-interaction Library (Reusable Across Screens)](#11-micro-interaction-library-reusable-across-screens)
12. [Deep Prompt Brief 01 — Reading Surface, Full Fidelity](#12-deep-prompt-brief-01--reading-surface-full-fidelity)
13. [Deep Prompt Brief 02 — The Margin, Full Fidelity](#13-deep-prompt-brief-02--the-margin-full-fidelity)
14. [Deep Prompt Brief 03 — Return Sequence, Full Fidelity Storyboard](#14-deep-prompt-brief-03--return-sequence-full-fidelity-storyboard)
15. [Deep Prompt Brief 04 — Highlight Interaction, Micro-detail](#15-deep-prompt-brief-04--highlight-interaction-micro-detail)
16. [Deep Prompt Brief 05 — Document Library, Full Fidelity](#16-deep-prompt-brief-05--document-library-full-fidelity)
17. [Deep Prompt Brief 06 — Onboarding, Full Fidelity Storyboard](#17-deep-prompt-brief-06--onboarding-full-fidelity-storyboard)
18. [Deep Prompt Brief 07 — Sharing Flow, Full Fidelity](#18-deep-prompt-brief-07--sharing-flow-full-fidelity)
19. [Deep Prompt Brief 08 — Error State, Full Fidelity](#19-deep-prompt-brief-08--error-state-full-fidelity)
20. [Deep Prompt Brief 09 — Full App Flow Storyboard (All Screens, One Sequence)](#20-deep-prompt-brief-09--full-app-flow-storyboard-all-screens-one-sequence)

---

## 1. Why the Drawer Was Wrong

Being honest about the problem: a drawer that slides up and covers the document is, structurally, still a **panel**. It just delays showing the panel instead of removing it. The moment it's summoned, we're right back to "software with a panel" — a sheet with a list of cards, a drag handle, a title. It looks like every other app's "activity" or "notifications" surface. It doesn't feel like Jetty. It feels like Notion's version history with better copy.

The deeper issue: a drawer implies **separation**. It says "your history lives somewhere else, and you go visit it." But the whole thesis of Jetty is that the document *remembers itself* — the history isn't a separate place, it's a property of the passages themselves. Pulling it into a separate sheet contradicts that thesis structurally, not just visually.

So the fix isn't a prettier drawer. It's removing the idea of history as a separate destination entirely.

---

## 2. The New Concept: The Margin

**The history doesn't live in a drawer. It lives in the document, in the margin, exactly next to the passage it belongs to — visible only as a small mark until touched, at which point it reveals itself in place.**

Think of how a real book works when someone has annotated it in pencil: you don't open a separate notebook to see their notes. You see a small mark in the margin next to the sentence, and if you want to know more, you look closer at *that specific spot*. The information never leaves its context.

### How it actually works

**At rest:** Any block that has one or more moments attached to it (highlighted, annotated, marked important, previously returned-to) shows a single small mark in the left margin — not a badge, not a colored dot with a count, just a thin vertical tick, similar visual weight to the "active block" rule from the reading surface, but a different, muted tone so the two aren't confused.

```
     This agreement is made between
     the landlord and the tenant...

  ┃  The tenant agrees to pay rent      ← margin tick: this block
     on the first day of each month.      has a moment attached

     Should the tenant fail to pay
     within five days...
```

**On touch (tap the tick, or tap the block itself):** The block gently expands downward, in place, to reveal the moment — using the same moment card visual language established previously (icon + quoted passage + metadata) but now it's not a card floating in a drawer, it's literally *unfolding from the sentence itself*.

```
  ┃  The tenant agrees to pay rent
     on the first day of each month.
     ┗━ ✎ highlighted · 2 minutes ago

     Should the tenant fail to pay...
```

**No separate screen. No overlay. No drag handle. No dimming of the rest of the document.** The rest of the page stays exactly as it was — only the touched block grows slightly to make room for its own note, and everything below it reflows down gently to accommodate.

**Multiple moments on one block** simply stack within that same unfolded space:

```
  ┃  The tenant agrees to pay rent
     on the first day of each month.
     ┗━ ✎ highlighted · 2 minutes ago
     ┗━ ★ marked important · 2 minutes ago
```

**Tapping the expanded block again (or tapping elsewhere on the page) folds it back closed.** The interaction is symmetrical and reversible — nothing ever feels like "opening a new place," only "looking closer, then looking away again."

### What replaces the drawer's "browse everything" function

There's still a genuine need, especially for the power user (Section 12 of the UI Strategy doc — progressive disclosure), to see the *whole* trail at once rather than block by block. That need is real. But it shouldn't be the *default* way history is encountered — it should be a deliberate, secondary action.

**Solution: a single "see it all" affordance, reached only from the overflow menu (···) in the top bar — not from a persistent bottom indicator.** When invoked, it doesn't slide up as a sheet either — it transforms the *entire reading surface itself* into a compressed, scannable view: the same document, same scroll position logic, but every block that has moments attached is shown pre-expanded, and blocks with nothing attached collapse to a thin muted line so the eye can scan straight down the page and see only what mattered.

```
Normal reading view:              "see it all" view:
                                   (same document, same page,
This agreement is made...         moments pre-expanded, empty
                                   blocks compressed to a line)
The tenant agrees to pay
rent on the first day.            ─── (collapsed, no moments)
                                   
Should the tenant fail                The tenant agrees to pay
to pay within five days...            rent on the first day.
                                       ┗━ ✎ highlighted
This deposit shall be                 ┗━ ★ important
refunded within 14 days
of the tenancy's end.             ─── (collapsed, no moments)
                                   
                                       This deposit shall be
                                       refunded within 14 days.
                                       ┗━ ✎ highlighted
```

This is still *the same document*, never a different screen or a different metaphor. It's a zoom level, not a destination. Toggling out of it returns to the normal reading view instantly, at the same scroll position.

### Why this is better

- It never introduces a second surface or a second metaphor — the document is always the only thing on screen, exactly per the core design philosophy.
- It makes history feel like a property of the content, which is the actual truth of the architecture (Product Brief §9 — the moment belongs to the passage).
- It scales naturally: one moment, a margin tick. Ten moments across a long document, a "see it all" scan. No separate information architecture needed for small vs. large history.
- It removes an entire category of design problem (drawer states, drag handles, dimming/overlay treatment, dismiss gestures) by not needing them at all.

---

## 3. Full Interaction Map (All Screens)

```
                         ┌─────────────────────┐
                         │   FIRST LAUNCH       │
                         │   (empty invite)     │
                         └──────────┬───────────┘
                                    │ open/paste doc
                                    ↓
                         ┌─────────────────────┐
              ┌──────────┤   READING SURFACE    ├──────────┐
              │          │   (default screen)    │          │
              │          └──────────┬───────────┘          │
              │                     │                       │
     tap ← top-left          tap/hold a block         "take me back"
              │                     │                       │
              ↓                     ↓                       ↓
    ┌──────────────┐      ┌─────────────────┐    ┌──────────────────┐
    │   LIBRARY    │      │  BLOCK UNFOLDS   │    │  RETURN SEQUENCE │
    │  (documents) │      │  (the margin)     │    │  (5-step glide)  │
    └──────┬───────┘      └─────────────────┘    └──────────────────┘
           │
     tap "+ " or drop file
           │
           ↓
    ┌──────────────┐
    │  DOC OPENS   │──────→ back to READING SURFACE
    └──────────────┘

    From READING SURFACE, overflow menu (···) also reaches:
       → "see it all" (compressed margin-scan view of same doc)
       → share (three-word pairing)
       → settings

    Voice, at any time while listening:
       "highlight this" / "mark this important" / "note that..."
             → block gets a moment, margin tick appears/updates
       "undo"
             → most recent moment reversed, new record added
       "take me back" / "where was I"
             → Return Sequence triggers
       misheard / no clear match
             → Error / Misheard state (Section 10)
```

---

## 4. Screen 01 — Reading Surface: Full Interaction Choreography

This section describes every possible thing that can happen on the primary screen, with timing.

### 4.1 — Idle state
- Document rendered, active block marked with left-edge rule (see UI Strategy §5)
- Ambient indicator at bottom, slow breathing pulse, ~4s cycle
- Any block with existing moments shows a margin tick (Section 2), quiet and small, always visible but never demanding attention

### 4.2 — User reads silently, no voice/touch action
- Nothing changes. Jetty does not need to "do" anything just because the user is reading. **Position only updates when the user speaks, taps, or scrolls meaningfully** — it should never feel like Jetty is aggressively tracking eye movement or making guesses about where attention is. This preserves trust: the system only acts when it has real signal.

### 4.3 — User speaks "highlight this"
```
t=0ms     Ambient indicator: idle pulse → quickens, small ripple animates outward once
t=0-150ms Speech recognized, intent parsed (invisible to user, but should feel instant)
t=150ms   Target block identified. If ambiguous (see 4.3a), branch to confirmation.
t=150ms   Highlight fill begins to animate in — NOT an instant flat-color change.
          A soft warm wash animates across the passage left-to-right, ~250ms duration,
          like a highlighter pen actually being dragged across the words
t=400ms   Highlight settles at its resting warm tone (see UI Strategy §10 — highlight-warm)
t=400ms   Margin tick for that block appears, small fade-in, ~150ms
t=400ms   Ambient indicator returns to idle pulse
```

**4.3a — Ambiguous target (branch):** If Jetty cannot confidently resolve which passage "this" refers to (e.g., the user has been silent for a while and there's no clear "current" passage), do NOT guess silently. Instead:
```
Ambient indicator brightens, stays elevated (not idle pulse)
A single quiet inline prompt appears just above the ambient indicator:
    "this one?" — with the best-guess passage very subtly outlined
      (a faint dotted border, not a full highlight yet)
User can: say "yes" / tap the passage to confirm / say a correction
Once confirmed → proceeds exactly as 4.3 from t=150ms
```

### 4.4 — User speaks "mark this important"
Same choreography as 4.3, but the resting color is `important-rust` (UI Strategy §10) instead of `highlight-warm`, and the fill animation is slightly different in character — rather than a left-to-right wash, it's a brief full-passage flash-then-settle (since "important" is a stronger, more declarative act than a highlight, it should read as slightly more emphatic in its animation, not just a different color).

### 4.5 — User speaks "note that [x]"
```
t=0ms     Ambient indicator quickens (same as 4.3)
t=150ms   Target block identified
t=150ms   A small note-icon (✎) fades in at the margin next to the block, ~150ms
t=150ms   The block gently unfolds (same mechanic as Section 2's margin interaction)
          to reveal the note content being written in, appearing to type itself in
          at a natural reading pace (not instant, not a slow typewriter effect —
          roughly the pace of quick human speech, ~40-60ms per word)
t=+       Once complete, the unfolded note stays revealed for ~2 seconds, then
          gently folds back closed on its own — the user doesn't need to dismiss it,
          but CAN tap to keep it open longer if they're still reading it
```

This is an important detail: the note briefly shows itself unprompted right after creation (so the user gets confirmation of exactly what was captured), then closes itself automatically — respecting the "document is the world, don't clutter it" principle without ever leaving the user wondering if it worked.

### 4.6 — User says "undo"
```
t=0ms     Ambient indicator quickens
t=150ms   The most recent moment is identified
t=150ms   Whatever visual state that moment created (highlight fill, important flash,
          note) reverses using the SAME animation as its creation, but played backward
          — the highlight wash retracts right-to-left, the note folds itself away
t=400ms   Margin tick for that block either disappears (if that was the block's only
          moment) or updates its count/stack (if other moments remain)
t=400ms   A brief, very quiet confirmation appears near the ambient indicator:
          "undone" — small, muted text, fades after 1.5s
```
Per Product Brief §11, the undo itself is still recorded as an event — this is invisible to the user in the moment, but means if they later use "see it all" (Section 2) or ask "what happened," the full honest sequence (action, then undo) is still there.

### 4.7 — User taps and holds a block (touch equivalent of voice actions)
```
t=0ms     Block is pressed, subtle scale-down (98%) + shadow lift, ~100ms
t=150ms   (hold threshold met) A minimal radial menu appears centered on the touch
          point: 3 icons only — highlight / important / note — arranged in a tight
          arc, not a full circle menu (avoid the "too many choices" feeling)
t=+       User drags to one icon, releases → same settle animation as the equivalent
          voice action (4.3 / 4.4 / 4.5) plays immediately
          User can also just release without dragging to any icon → menu dismisses,
          nothing happens, block returns to resting state
```

### 4.8 — User taps a margin tick or an already-annotated block
Triggers the margin unfold described in Section 2 — not a voice/creation action, purely a reveal/review action. No ambient indicator change needed since this isn't a new event being created, just an existing one being viewed.

---

## 5. Screen 02 — The Margin (Replaces History Drawer)

Already conceptually described in Section 2. Here is the state machine for it specifically:

```
STATE: collapsed (default)
   block shows plain text + margin tick (if it has moments)
        │
        │ tap tick OR tap block
        ↓
STATE: expanding
   block content grows in height, ~200ms ease-out
   moment card(s) fade + slide in from the top of the new space, ~150ms,
   slightly staggered if there are multiple (each +50ms after the last)
        │
        ↓
STATE: expanded
   block shows plain text + unfolded moment card(s) beneath it
   rest of document reflows smoothly to accommodate, ~200ms
        │
        │ tap the block again, OR tap elsewhere on the page
        ↓
STATE: collapsing
   moment card(s) fade + slide up/out, ~120ms
   block content shrinks back, ~180ms ease-in
        │
        ↓
STATE: collapsed
```

**Key interaction rule: only one block can be expanded at a time.** If the user taps a second tick while another block is already expanded, the first one collapses automatically as the second expands — this keeps the page visually calm and prevents an accumulating cascade of open notes making the document feel cluttered again (the exact problem we're solving by removing the drawer in the first place).

### "See it all" mode — state detail
```
Trigger: overflow menu (···) → "see it all"
        │
        ↓
Transition: every block with moments simultaneously begins expanding
(staggered by position, top to bottom, ~40ms delay between each,
so it reads as a wave passing down the page rather than an instant
jarring switch)
Every block WITHOUT moments simultaneously compresses to a thin
muted horizontal line (same timing/stagger)
        │
        ↓
Resting "see it all" state: user can scroll normally, tap any
expanded moment to jump straight to it in normal reading mode
(tapping = exit "see it all," land on that exact block, expanded)
        │
        │ tap "see it all" toggle again (now labeled "back to reading")
        ↓
Reverse transition, same stagger logic, back to STATE: collapsed
for all blocks, at the same scroll position
```

---

## 6. Screen 03 — Return Sequence: Frame-by-Frame Timing

Expanding the 5-frame storyboard from the previous document into exact timing and easing detail.

```
FRAME 1 — Trigger (t = 0ms)
  User says "take me back"
  Ambient indicator: idle pulse → quick brighten + ripple, 150ms
  No other visual change yet — document still fully visible, normal state

FRAME 2 — Dim (t = 150ms → 450ms, 300ms duration, ease-in-out)
  Document content: opacity 100% → 55%, plus a very slight gaussian
  blur (2-4px) fading in
  Ambient indicator: stays brightened, does NOT return to idle yet —
  this is the signal that something is actively happening

FRAME 3 — Card rises (t = 450ms → 850ms, 400ms duration, ease-out)
  A card slides up from below the bottom edge of the screen,
  decelerating as it arrives ~55% up the screen height
  Card contents fade in slightly AFTER the card's position settles
  (position first, content second, ~100ms stagger) so it doesn't
  feel like text is flying in
  Card shows: location label (small, muted) + one-line quoted
  passage preview (larger, primary)

FRAME 4 — Transition (t = 850ms → 1350ms, 500ms duration)
  The dimmed document behind the card begins to visually shift —
  NOT a hard scroll-jump. Treat it as the destination paragraph
  gently rising into center-frame from below, while the current
  view very subtly recedes — like a soft crossfade with a slight
  upward drift, not a literal scroll animation
  The card from Frame 3 simultaneously shrinks and drifts upward,
  fading out as it goes, ~300ms of this window, released a beat
  after the document transition begins (~100ms offset) so the two
  motions don't compete for attention at the same instant

FRAME 5 — Settle (t = 1350ms → 1700ms, 350ms duration, ease-out)
  Document opacity/blur returns to 100%/0
  The destination block is now centered in the reading viewport
  That specific block gets a distinct "just arrived" treatment:
  a soft outer glow using amber-glow at low opacity, which itself
  fades out over the following ~800ms (this is NOT the same visual
  as a highlight — it's temporary, marking "you just arrived here,"
  not "this is highlighted")
  Ambient indicator eases back down to idle pulse

TOTAL SEQUENCE DURATION: ~1.7 seconds
```

This total duration matters: long enough to feel considered and "carried," short enough to never feel like the user is waiting. 1.5–2 seconds is the right range for a moment designed to be the product's signature beat — treat this timing as close to final, not a rough placeholder.

---

## 7. Screen 04 — Document Library: Interaction Detail

### Entry
```
Tap back/library control (top-left, reading surface)
   → Reading surface slides/fades out (~200ms)
   → Library fades/slides in (~200ms), NOT a hard cut
```

### Row interaction
```
Tap a document row with "continue" status
   → Row briefly highlights (background tint, ~100ms)
   → Transitions directly into the Return Sequence (Section 6),
     but starting from Frame 3 (skip the dim-of-nothing, since
     there's no document currently open to dim) — the card rises
     over the library itself, then carries the user directly into
     the reading surface at the remembered position
   → This reuses the signature interaction rather than introducing
     a separate "open document" transition, reinforcing that
     opening a document you've read before IS a return
```

```
Tap a document row with "finished" status
   → Opens normally into the reading surface at block 1 (no
     "return" framing needed, since there's no specific place
     to return to — the reading is complete)
```

```
Tap "+" or drop a new file
   → Standard file-open flow, lands on the reading surface at
     block 1, with the one-time onboarding hint if this is the
     user's very first document ever (Section 8)
```

---

## 8. Screen 05 — Onboarding: Full Script

Writing this as an actual script, not just a layout description, since tone and timing matter as much as visuals here.

```
[App opens for the very first time]

SCREEN: empty invitation
COPY: "Open a document, or just start talking."
       (small, centered, quiet — this is the ONLY text on screen
       besides the drop-zone label "drop a file here" / "or paste
       text")

[User drops a file or pastes text]

TRANSITION: (~300ms fade/scale) directly into the reading surface,
document loaded, positioned at block 1

SCREEN: reading surface, first document, first time
   0.0s   Document renders normally
   0.5s   (small delay so the user has a beat to see the document
          itself first, before anything else appears)
   0.5s   A small, soft callout fades in near the ambient indicator:
          "say 'highlight this' while you read"
          — styled as a small speech-bubble shape pointing down at
          the ambient indicator, muted background, quiet type

[User speaks "highlight this," OR taps-and-holds a passage and
 selects highlight from the radial menu]

   The highlight lands using the exact 4.3 choreography from Section 4
   IMMEDIATELY upon this first successful action:
   The onboarding callout fades out, ~200ms, and does not return —
   not just for this session, but permanently for this user, on
   this and every future document

[If the user does NOT act within, say, 8-10 seconds of the callout
 appearing]

   The callout does not become more insistent, does not add an
   arrow or a pulse animation to demand attention. It simply
   remains, quiet, as long as needed. There is no urgency
   engineered into this moment. A grandma reading slowly should
   never feel rushed by her own onboarding.
```

---

## 9. Screen 06 — Sharing: Full Interaction Detail

```
Trigger: overflow menu (···) → "share"

STATE: word generation
   Screen transitions to the centered three-circle layout
   Three words are generated and displayed immediately below
   the (still empty) circles: e.g. "coral · violin · harbor"
   Instruction: "Say these into the other device"

STATE: listening for confirmation
   The initiating device's mic is now actively listening for
   confirmation coming back from the receiving device (which
   will, on its own screen, be prompting ITS user to listen and
   repeat the words back, or simply hold the two devices near
   each other so both mics pick up the same spoken words at once
   — exact mechanism is a product/engineering decision, but the
   WIREFRAME should show the visual confirmation regardless of
   which mechanism is used)

STATE: word 1 confirmed
   First circle: outline → solid fill, with the SAME warm wash
   animation used for highlight creation (Section 4.3) — reusing
   this animation deliberately, so confirmation of a shared word
   visually rhymes with confirmation of a highlight; both are
   "Jetty confirming it heard/understood something correctly"

STATE: word 2 confirmed (same treatment)

STATE: word 3 confirmed (same treatment)
   Once all three circles are filled:
   Brief full-row glow/pulse across all three circles at once,
   ~300ms, signaling completion
   Text below transitions from "Say these into the other device"
   to "Connected" (or similarly plain confirmation)
   ~1s later, auto-transitions back to the reading surface, with
   a small transient confirmation near the ambient indicator:
   "shared" — fades after 1.5s, same pattern as the "undone"
   confirmation in Section 4.6

STATE: mismatch/timeout (failure path)
   If words aren't confirmed within a reasonable window:
   Circles remain in their partial state (some filled, some not)
   Text changes to: "Didn't hear a match on the other device.
   Try saying the words again, a bit slower."
   A simple "try again" tap target regenerates the flow (possibly
   with new words, to avoid confusion about which attempt is live)
```

---

## 10. Screen 07 — Error / Misheard Command

```
Trigger: voice input received, but intent cannot be confidently
resolved to any known action AND cannot be resolved to a specific
passage (distinct from the 4.3a "ambiguous target" case, where the
ACTION is clear but the TARGET passage isn't — this is the case
where even the action itself isn't clear)

STATE: uncertain
   Ambient indicator: brief double-pulse (distinct rhythm from the
   single quick-brighten used for successful recognition — this
   difference should be felt even without looking directly at the
   screen)
   A small, quiet inline message appears near the ambient indicator:
   "Didn't catch that clearly. Try again, a little closer."
   No modal, no red error color, no alarming iconography — this is
   a gentle nudge, not a system failure. Use the SAME muted tone
   as other transient confirmations ("undone," "shared"), NOT a
   distinct "error" color like red — errors in Jetty should feel
   like part of a calm conversation, not a system alarm
   Message fades after ~3s, or immediately upon the user's next
   attempt (whichever comes first)
```

---

## 11. Micro-interaction Library (Reusable Across Screens)

To keep the whole product feeling like one coherent system rather than a set of separately-designed screens, these five animation patterns should be the ONLY animation vocabulary used anywhere in the product. Every interaction in this document reuses one of these:

| Pattern name | Used for | Character |
|---|---|---|
| **The Wash** | Highlight creation, word confirmation in sharing | A warm fill animates across content left-to-right, ~250ms, like a highlighter pen physically dragged |
| **The Flash-Settle** | Mark important (a stronger, more declarative act) | A brief full-element flash to a saturated tone, then eases down to its resting shade, ~300ms total |
| **The Unfold** | Margin reveal, note creation, "see it all" mode | Content grows in place from within its own space, never slides in from off-screen, ~200ms ease-out |
| **The Carry** | The Return sequence exclusively | The multi-step dim → card → transition → settle sequence (Section 6) — reserved ONLY for Return, never reused elsewhere, so it keeps its special, signature weight |
| **The Whisper** | Transient confirmations ("undone," "shared"), error messages | Small muted text, fades in ~150ms, holds, fades out ~300ms, never demands attention, never uses alarming color |

**Design rule: no new animation pattern should be introduced without first checking if one of these five already covers the need.** This is what will make Jetty feel considered and singular rather than like a collection of separately-designed moments — the same five verbs of motion, applied consistently everywhere.

---

## 12. Deep Prompt Brief 01 — Reading Surface, Full Fidelity

```
Design a low-fidelity wireframe for Jetty's primary reading screen,
now including interaction-state annotations, not just static layout.

BASE LAYOUT (as before): full-bleed document, generous centered
reading column (60-75 characters wide), minimal top bar (back control
left, overflow ··· right), ambient listening indicator bottom-center.

NEW REQUIREMENT — show THREE states of the same screen side by side:

STATE 1 — Idle: document in its resting state. One block has a subtle
left-edge vertical rule marking it as the "active" block (a thin line,
not a filled box). At least one OTHER block, elsewhere in the visible
text, shows a small margin tick (a short vertical mark in the left
margin, visually distinct and more muted than the active-block rule)
indicating it has a moment attached, but is NOT expanded.

STATE 2 — Mid-highlight: show the SAME document, but now depict a
highlight animation caught mid-motion — the "Wash" pattern: a warm
gray fill (indicate warmth via a slightly different gray tone or a
dot pattern if pure grayscale) covering roughly 60% of one passage
left to right, implying it's still animating in, with the remaining
40% of that same passage still unfilled. Add a small caption below
this frame: "highlight animates in, ~250ms, left to right."

STATE 3 — Margin unfolded: show the SAME document, but now the block
that had a margin tick in State 1 is expanded — the paragraph itself
is unchanged, but directly beneath it, indented slightly from the
margin tick's position, a small unfolded note is visible: a small
icon + a short quoted phrase from that passage + muted metadata text
below it (e.g. "highlighted · 2 minutes ago"). The rest of the
document below this block should appear to have reflowed downward
slightly to make room, not overlapping or covering anything.

CONTENT: use lease agreement language throughout, consistent across
all three states (same document, different moments in time).

STYLE: low-fidelity, grayscale, but use dot-pattern or lighter-gray
fills (not color) to distinguish "highlighted" states from plain
text, since the animations described rely on a visual state change
that needs to read clearly even in grayscale.

DELIVERABLE: three frames side by side, mobile viewport (375x812)
each, captioned "1. idle" / "2. mid-highlight" / "3. margin unfolded."
```

---

## 13. Deep Prompt Brief 02 — The Margin, Full Fidelity

```
Design a low-fidelity wireframe set showing Jetty's "Margin" system —
this REPLACES any concept of a separate history drawer/sheet. There
is no overlay, no sliding panel, no dimming of the rest of the screen.
History is shown IN PLACE, inline with the document content itself.

Produce FOUR frames:

FRAME 1 — Collapsed, single moment: A short passage of document text
with ONE small vertical tick mark in the left margin next to it,
indicating this block has one moment attached. The tick should be
visually distinct from (but similar weight to) the "active block"
marker used elsewhere in the reading surface — use a different line
style (e.g. dotted vs. solid, or shorter length) to differentiate
"this is the block I'm currently at" from "this block has history."

FRAME 2 — Expanded, single moment: The SAME passage, now with the
margin tick's block expanded downward. Beneath the original paragraph
text, indented slightly, show: a small icon (representing "highlighted"
or "note"), a short quoted excerpt of the passage in quotation marks,
and small muted metadata text below that ("highlighted · 2 minutes
ago"). Add a caption: "tap the tick, or tap the block itself, to
unfold — tap again to fold back closed."

FRAME 3 — Expanded, multiple moments: A different passage where the
block has TWO moments attached (e.g. it was both highlighted AND
marked important at different times). Show both moment entries
stacked vertically beneath the paragraph, each with its own icon,
quoted text, and timestamp, most recent first.

FRAME 4 — "See it all" mode: A longer stretch of document (5-6
paragraph blocks) shown in the compressed scanning mode. Blocks WITH
moments are shown fully expanded (as in Frame 2/3). Blocks WITHOUT any
moments are compressed down to a single thin horizontal line (roughly
the height of one text line, not their full paragraph height) so the
whole page reads as a scannable summary of only what mattered. Add a
caption: "reached via the overflow menu — same document, same page,
just zoomed to show only what has moments attached."

STYLE: low-fidelity, grayscale, consistent icon and card style across
all four frames (this needs to look like ONE coherent system, since
it's meant to replace the old drawer concept entirely — there should
be no visual trace of "drawer," "sheet," "modal," or "overlay"
anywhere in this set).

DELIVERABLE: four frames in a 2x2 grid, mobile viewport proportions
(375x812) each, with the captions specified above under each frame.
```

---

## 14. Deep Prompt Brief 03 — Return Sequence, Full Fidelity Storyboard

```
Design a 5-frame low-fidelity storyboard for Jetty's signature "Return"
interaction, now with precise timing annotations matching a real
motion spec (not just a general description).

FRAME 1 (t=0ms, "Trigger"): Reading surface in normal idle state.
Ambient indicator at the bottom shows a small outward ripple/pulse
animation (indicate with 2-3 concentric faint circles around the
indicator dot) to represent the moment of the "take me back" voice
trigger being recognized. Caption: "t=0ms — trigger recognized."

FRAME 2 (t=150-450ms, "Dim"): Same document, but now rendered at
reduced opacity/contrast (use a lighter gray wash over the whole text
area to indicate this in grayscale) with a subtle blur implied (you
can indicate blur in a low-fi wireframe with slightly fuzzy/doubled
text-line placeholders rather than actual blur if easier). The ambient
indicator remains brightened, not yet returned to idle. Caption:
"t=150-450ms — document dims, 300ms ease."

FRAME 3 (t=450-850ms, "Card rises"): The dimmed document is visible
in the background. A card has risen from the bottom, now resting
roughly 55% up the screen height, centered, with rounded corners.
Card contents: a small muted location label ("block 6 · 2 days ago")
and a larger, primary line of quoted text ("the tenant agrees to
pay rent..."). Caption: "t=450-850ms — card rises + settles, 400ms
ease-out, content fades in 100ms after position settles."

FRAME 4 (t=850-1350ms, "Transition"): Show the destination paragraph
appearing to rise into center-frame — indicate this with the
destination text block positioned centrally and perhaps a few faint
horizontal motion lines above/below it suggesting upward drift, while
the previous view's text is shown more faded/receded above and below
it. The card from Frame 3 is now smaller and positioned higher,
fading out. Caption: "t=850-1350ms — destination rises into frame
as previous card fades and drifts up, 500ms, ~100ms offset stagger."

FRAME 5 (t=1350-1700ms, "Settle"): Document back at full opacity/
contrast, now centered on the destination block. That specific block
has a distinct soft outer glow treatment around it (indicate with a
subtle gradient border or dotted halo, different from the highlight
fill style used elsewhere) representing "you just arrived here" —
this fades away over the next ~800ms (show as a lighter version of
the same glow, with a small caption noting the fade continues past
this frame). Ambient indicator has returned to slow idle pulse.
Caption: "t=1350-1700ms — settle, arrival glow fades over following
800ms (not shown), total sequence ~1.7s."

STYLE: low-fidelity, grayscale, but the dimming, glow, and motion
states need to be clearly differentiated from each other using
distinct gray values/patterns even without color, since the whole
point of this storyboard is to specify FEELING and TIMING, not just
static layout.

DELIVERABLE: one horizontal storyboard strip containing all 5 frames
side by side, mobile viewport proportions (375x812) per frame, with
the exact captions specified above beneath each frame.
```

---

## 15. Deep Prompt Brief 04 — Highlight Interaction, Micro-detail

```
Design a single, highly detailed low-fidelity wireframe frame
isolating just ONE micro-interaction: the "Wash" animation used when
a highlight is created in Jetty (whether by voice: "highlight this,"
or by touch: tap-and-hold then select highlight from a radial menu).

Show this as a FILM-STRIP of 4 sub-frames within one wireframe,
representing consecutive moments in a single ~250ms animation:

SUB-FRAME A (0%): A sentence of plain document text, completely
unstyled, no highlight yet.

SUB-FRAME B (33%): The same sentence, now with the first third of
the words (left-to-right) showing a warm fill behind them (indicate
with a light gray or dot-pattern background directly behind just
those words), the remaining two-thirds still plain.

SUB-FRAME C (66%): Same sentence, now two-thirds filled from the
left, one-third remaining plain.

SUB-FRAME D (100%): Same sentence, fully filled with the resting
highlight treatment across the entire passage, animation complete.

Arrange these 4 sub-frames in a single horizontal row, connected
visually (e.g. with small arrow glyphs between them) to communicate
this is ONE continuous motion, not four separate states a user would
ever actually pause on. Add an overall caption beneath the whole strip:
"the Wash — highlight fills left-to-right like a highlighter pen
being dragged across the words, ~250ms total, used consistently for
every highlight-creation moment across the product."

ALSO include, below the main film-strip, a SEPARATE small comparison
showing the "Flash-Settle" pattern (used specifically for "mark
important," a more declarative/stronger action) as a contrast: 2
sub-frames only — first showing the full passage flashing to a
strong/saturated fill all at once (not left-to-right), second showing
it settled to its resting darker/muted tone. Caption: "the Flash-
Settle — used only for 'mark important,' a full-passage flash rather
than a directional wash, to feel more emphatic and immediate."

STYLE: low-fidelity, grayscale, but this frame specifically needs
very precise incremental shading across the sub-frames to correctly
communicate a left-to-right fill progression — take care that
sub-frames B and C are visually distinguishable from each other and
from A and D.

DELIVERABLE: one wide frame containing the 4-part Wash film-strip on
top and the 2-part Flash-Settle comparison below it, annotated with
the captions above.
```

---

## 16. Deep Prompt Brief 05 — Document Library, Full Fidelity

```
Design a low-fidelity wireframe set for Jetty's document library,
including the specific transition behavior into a document.

Produce THREE frames:

FRAME 1 — Populated library: Header "your documents" (lowercase,
quiet type) with a small "+" control top-right. A vertical list of
5 document rows, generous spacing between each. Each row shows:
title (largest/primary text), a plain-language status directly below
it ("continue" or "finished" — this should be the second-most
prominent text, NOT the block number), and small muted metadata
below THAT (block position + relative last-opened time, e.g. "block
6 of 7 · 2 hours ago"). Vary the 5 example rows: one recently
continued (minutes ago), one continued days ago, one finished, one
brand new with no progress shown yet, one continued weeks ago. No
thumbnails, no file-type icons beyond a simple minimal document glyph
if any icon is used at all.

FRAME 2 — Row pressed/transitioning: Show the SAME library, but with
ONE row (a "continue" row) in a pressed/active state — indicate with
a subtle background tint on just that row — and layer a small card
beginning to rise from the bottom of the screen, partially visible,
OVER the library list (echo the Return Sequence's Frame 3 card style
from Deep Prompt Brief 03, since opening a "continue" document reuses
that same interaction). Caption: "tapping a 'continue' row begins the
same Return sequence used within a document — opening a previously-
read document IS a return."

FRAME 3 — Empty state: The same header/layout structure, but with no
document rows. Instead, vertically centered in the remaining space: a
short line of copy ("Open a document, or just start talking.") and a
simple soft-bordered drop-zone rectangle beneath it labeled "drop a
file here," with smaller text below that reading "or paste text." No
onboarding carousel, no feature callouts, no illustration beyond this
minimal invitation.

STYLE: low-fidelity, grayscale, generous whitespace throughout,
consistent type hierarchy (title > status > metadata) across all rows
in Frame 1.

DELIVERABLE: three frames, mobile viewport (375x812) each, captioned
"1. populated" / "2. opening a document (reuses Return)" / "3. empty
state."
```

---

## 17. Deep Prompt Brief 06 — Onboarding, Full Fidelity Storyboard

```
Design a 4-frame low-fidelity storyboard for Jetty's complete
first-time onboarding sequence, written as an actual timed script,
not just a static layout.

FRAME 1 (t=0s) — Empty invitation: Centered, minimal screen. Copy:
"Open a document, or just start talking." Below it, a soft-bordered
drop-zone rectangle labeled "drop a file here," and smaller text
below that: "or paste text." No other elements anywhere on screen —
no logo treatment beyond a very small, quiet wordmark if needed, no
navigation, no tour indicators.

FRAME 2 (t≈0.3s after file dropped) — Document loads: Show the
reading surface now populated with the user's first document (use
lease agreement content), rendered in its completely normal resting
state — no callouts yet. Caption: "document loads directly into the
reading surface, ~300ms fade/scale transition from Frame 1, no
intermediate loading screen."

FRAME 3 (t≈0.8s, half a second after Frame 2) — First hint appears:
Same reading surface, now with ONE small soft callout near the bottom
ambient indicator — styled as a small speech-bubble/tooltip shape
pointing down toward the indicator — containing the text: "say
'highlight this' while you read." Muted background, quiet type, no
arrow demanding attention, no pulsing/attention-grabbing animation on
the callout itself. Caption: "appears 0.5s after document renders, so
the user sees their content first."

FRAME 4 (after first successful voice/touch action) — Hint dismissed,
first highlight lands: Same reading surface, now showing one passage
with the Wash-pattern highlight fully settled (warm fill, resting
state), and the callout from Frame 3 is completely gone — not
minimized, not collapsed, fully removed from the layout. Caption:
"the callout fades permanently the moment the user succeeds once —
this hint never reappears on this or any future document for this
user."

Also include a small note beneath the whole storyboard: "If no action
occurs within several seconds, the callout in Frame 3 does NOT
intensify, pulse, or add urgency of any kind — it simply remains,
patient, for as long as needed."

STYLE: low-fidelity, grayscale, warm-fill highlight in Frame 4 shown
with a light gray/dot-pattern fill distinct from plain text.

DELIVERABLE: four frames in a horizontal storyboard strip, mobile
viewport (375x812) each, with the timing captions specified above.
```

---

## 18. Deep Prompt Brief 07 — Sharing Flow, Full Fidelity

```
Design a low-fidelity wireframe set for Jetty's device-pairing/
sharing flow — pairing two devices via three spoken words, no codes,
no QR scanning.

Produce FOUR frames:

FRAME 1 — Initial state: Centered, minimal layout. Header: "Say
three words to share." Below it, three circular outline placeholders
(unfilled) arranged horizontally with generous spacing. Below the
circles, the three actual words displayed in large, spaced-out
lowercase text: "coral · violin · harbor" (middle-dot separators).
Below that, instruction text: "Say these into the other device."
Nothing else on screen — no cancel button prominent, no settings,
just this one focused moment.

FRAME 2 — First word confirmed: Same layout, but the FIRST circle is
now solid-filled (use the same warm-fill visual treatment established
for highlight creation, to visually connect "confirming a shared
word" with "confirming a highlight" as the same family of
interaction). The other two circles remain outline/unfilled.

FRAME 3 — All three words confirmed: All three circles solid-filled.
Add a brief full-row glow/pulse indication across all three at once
(show as a lighter halo extending slightly beyond all three circles
together). Header text has changed from the instruction to a simple
confirmation: "Connected." Caption: "auto-transitions back to reading
surface ~1s after this state, with a brief 'shared' confirmation near
the ambient indicator (reuse the Whisper pattern from other transient
confirmations like 'undone')."

FRAME 4 — Mismatch/timeout state: Same three-circle layout, but shown
with a partial state (e.g. only 1 of 3 filled) and NO further
progress. Header text has changed to: "Didn't hear a match on the
other device. Try saying the words again, a bit slower." Include a
simple "try again" tap target below this message. Use the SAME muted,
non-alarming tone as other error states in the product (no red, no
alarming iconography) — caption: "errors in Jetty are gentle nudges,
never system alarms — same visual register as other quiet
confirmations."

STYLE: low-fidelity, grayscale, generous negative space around the
three-circle element in every frame since it's the visual focal point
throughout this entire flow.

DELIVERABLE: four frames, mobile viewport (375x812) each, with
captions as specified.
```

---

## 19. Deep Prompt Brief 08 — Error State, Full Fidelity

```
Design a single low-fidelity wireframe frame showing Jetty's
misheard-command / uncertain-input state, plus a comparison frame
showing the DIFFERENT "ambiguous target" state (these are two
distinct situations and should look distinguishably different from
each other despite both being "something wasn't quite understood").

FRAME 1 — Fully misheard (action unclear): Reading surface in its
normal state, document visible and unchanged (nothing should be
guessed or acted upon). Near the bottom ambient indicator, show a
small quiet inline message: "Didn't catch that clearly. Try again,
a little closer." Indicate the ambient indicator itself with a
slightly different pulse pattern than its normal idle state — e.g.
show two small overlapping pulse rings instead of the normal single
ripple, to suggest a distinct "uncertain" rhythm. Use muted, non-
alarming type styling for the message — same visual family as other
quiet confirmations elsewhere in the product, NOT a red/alarm treatment.

FRAME 2 — Ambiguous target (action clear, passage unclear): Reading
surface, but now show a specific passage in the document with a
faint DOTTED outline around it (distinct from both the solid active-
block rule and the warm highlight fill — this is a tentative "best
guess" indicator, not a confirmed state). Near the ambient indicator,
show a small inline prompt: "this one?" Caption beneath this frame:
"appears when Jetty understood the ACTION (e.g. 'highlight this')
but isn't confident which passage 'this' refers to — user can say
'yes,' tap the dotted passage to confirm, or say a correction."

STYLE: low-fidelity, grayscale, but the two different "uncertain"
treatments (double-pulse ambient indicator vs. dotted passage
outline) need to be visually distinct from each other since they
represent genuinely different situations.

DELIVERABLE: two frames side by side, mobile viewport (375x812)
each, captioned "1. misheard command" / "2. ambiguous target."
```

---

## 20. Deep Prompt Brief 09 — Full App Flow Storyboard (All Screens, One Sequence)

```
Design a comprehensive, single-narrative low-fidelity storyboard
showing a complete first-time user journey through Jetty end to end,
combining every screen and interaction into one continuous story.
This is meant to be used as a master reference / pitch artifact,
showing the whole product as one coherent experience rather than
disconnected screens.

Produce a sequence of 10 frames, in order:

1. Empty invitation (first launch) — per Deep Prompt Brief 06, Frame 1
2. Document loads — per Deep Prompt Brief 06, Frame 2
3. First hint appears — per Deep Prompt Brief 06, Frame 3
4. First highlight lands, hint dismissed — per Deep Prompt Brief 06,
   Frame 4
5. User continues reading, marks a second passage important (show the
   Flash-Settle pattern from Deep Prompt Brief 04 on a different
   passage further down the same document)
6. User taps a margin tick to review what they've marked so far — per
   Deep Prompt Brief 02, Frame 2 (single moment expanded)
7. Some time passes — show the library screen with this document now
   showing "continue" status — per Deep Prompt Brief 05, Frame 1
   (but focus/highlight just the one relevant row)
8. User reopens the document via "take me back" — show Frame 3 (card
   rising) from the Return Sequence, Deep Prompt Brief 03
9. User has landed back exactly where they left off — show Frame 5
   (settle, with arrival glow) from the Return Sequence
10. User shares this moment with someone else — show Frame 1 (three
    words displayed) from the Sharing flow, Deep Prompt Brief 07

Each frame should include a brief one-line caption describing what's
happening AND roughly how much time has passed since the previous
frame in the narrative (e.g. "moments later," "a few days later," "on
a new device") so the sequence reads as a believable real usage story
across time, not just a features tour.

STYLE: low-fidelity, grayscale, consistent visual language across all
10 frames (reuse exact icon styles, fill patterns, and spacing from
the individual prior prompt briefs referenced above — this sequence
should look like it was designed by one hand, not stitched together).

DELIVERABLE: one long horizontal storyboard strip (or a 2-row grid of
5 frames each if horizontal space is constrained), mobile viewport
proportions (375x812) per frame, captioned throughout as described.
```

---

*Document prepared August 2026. Version 2.0 — supersedes the history-drawer concept from the original Wireframe Exploration document. The Margin replaces the drawer as Jetty's history mechanism throughout all future design work.*