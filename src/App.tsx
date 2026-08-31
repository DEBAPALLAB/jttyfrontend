import { ChangeEvent, Children, cloneElement, isValidElement, PointerEvent, ReactElement, ReactNode, useEffect, useMemo, useRef, useState } from "react"
import { ArrowBendUpLeft, ArrowLeft, Bell, Camera, Check, Copy, DeviceMobile, DotsThree, Eraser, FileArrowUp, FileText, Highlighter, IdentificationCard, MagnifyingGlass, Microphone, NotePencil, PenNib, Plus, Printer, SealCheck, ShareFat, Stack, TextAa, Translate, UsersThree, X } from "@phosphor-icons/react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

type View = "library" | "reader" | "scanner" | "studio" | "print" | "publish" | "social"
type Room = "note" | "send" | "space" | "history" | "find" | "quote" | "gather" | "compare" | "remind" | "translate" | "math" | "intake" | "device" | "together"
type RadialChoice = "highlight" | "note" | "quote" | "send"
type ActionType = "highlight" | "highlight-range" | "annotate" | "important" | "send" | "space-moment" | "undo" | "return" | "open-document" | "math-keep" | "history" | "find" | "quote" | "gather" | "compare" | "remind" | "translate" | "capture" | "share-intake" | "device-drop" | "togetherness"
type Block = { id: string; text: string; region?: "left" | "right" }
type Note = { id: string; blockId: string; text: string; createdAt: string; undone?: boolean }
type Moment = { id: string; blockIds: string[]; type: "highlight" | "range" | "important" | "quote" | "gather" | "translation" | "math"; excerpt: string; createdAt: string; label?: string; destination?: string; undone?: boolean }
type ActRecord = { id: string; type: ActionType; intention: string; proof: string; createdAt: string; blockIds: string[]; momentId?: string; noteId?: string; destination?: string; undone?: boolean }
type Space = { id: string; name: string; momentIds: string[] }
type Reminder = { id: string; momentId: string; when: string; text: string; createdAt: string; undone?: boolean }
type DeviceDrop = { id: string; words: string[]; mode: "voice" | "manual"; momentId?: string; createdAt: string }
type Intake = { id: string; source: string; text: string; createdAt: string }
type Comment = { id: string; blockId: string; text: string; author: string; createdAt: string }
type Doc = {
  id: string
  title: string
  meta: string
  blocks: Block[]
  notes: Note[]
  currentBlockId: string
  layout?: "linear" | "columns"
  sourceImage?: string
  sourceKind?: "scan" | "text" | "handwriting"
  documentType?: string
  authorship?: "typed" | "handwritten" | "mixed"
  moments: Moment[]
  acts: ActRecord[]
  spaces: Space[]
  reminders: Reminder[]
  drops: DeviceDrop[]
  intakes: Intake[]
  comments: Comment[]
  status: "new" | "continue" | "finished" | "published"
}

const uid = () => crypto.randomUUID()
const stamp = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
const today = () => new Date().toISOString().slice(0, 16)
const words = ["coral", "violin", "harbor"]
const actionCopy: Record<ActionType, string> = {
  "highlight": "highlight this",
  "highlight-range": "highlight from this to that",
  "annotate": "add a note",
  "important": "mark this important",
  "send": "send this to",
  "space-moment": "send this to my space",
  "undo": "undo that",
  "return": "take me back",
  "open-document": "open document",
  "math-keep": "keep expression",
  "history": "show my acts",
  "find": "where did it say",
  "quote": "quote this",
  "gather": "gather these",
  "compare": "compare these",
  "remind": "bring this back later",
  "translate": "translate this",
  "capture": "capture this page",
  "share-intake": "send into jetty",
  "device-drop": "continue on my other device",
  "togetherness": "read this together",
}
const scannerText: Record<string, string> = {
  "Aadhaar card": "Identity document\n\nName, date of birth, and address have been detected. Review the sensitive fields before you save or print this copy.",
  "Passport": "Travel document\n\nIdentity page captured. Verify passport number, date of birth, and expiry before sharing a copy.",
  "Lease agreement": "Lease document\n\nReview term, rent, deposit, notice, and signature clauses before creating a reading copy.",
  "Tax filing": "Tax document\n\nFinancial fields need a final review. Sensitive values will stay masked in the print preview by default.",
  "Research paper": "Abstract\n\nCapture the argument, evidence, and questions you want to return to.",
}

const baseDoc = (doc: Partial<Doc> & Pick<Doc, "id" | "title" | "blocks" | "currentBlockId" | "status">): Doc => ({
  meta: "Opened just now",
  notes: [],
  moments: [],
  acts: [],
  spaces: [{ id: "space-proof", name: "Proof folder", momentIds: [] }, { id: "space-reading", name: "Reading circle", momentIds: [] }],
  reminders: [],
  drops: [],
  intakes: [],
  comments: [],
  ...doc,
})
const seed: Doc[] = [
  baseDoc({
    id: "lease",
    title: "Lease Agreement - 4821 Meridian Dr",
    meta: "Opened 9 minutes ago",
    status: "continue",
    currentBlockId: "lease-3",
    moments: [{ id: "m1", blockIds: ["lease-3"], type: "highlight", excerpt: "sixty days written notice", createdAt: "09:42" }],
    notes: [{ id: "lease-note", blockId: "lease-3", text: "Compare the notice period with the main lease.", createdAt: "09:42" }],
    acts: [{ id: "a1", type: "highlight", intention: "highlight this", proof: "Selected words retained with source passage.", createdAt: "09:42", blockIds: ["lease-3"], momentId: "m1" }],
    blocks: [
      { id: "lease-1", text: "The tenant agrees to pay rent of $2,400 per month, due on the first day of each calendar month." },
      { id: "lease-2", text: "Landlord shall maintain all fixtures and structural elements in good repair throughout this lease." },
      { id: "lease-3", text: "Either party may terminate this agreement by providing sixty days written notice to the other party." },
      { id: "lease-4", text: "Tenant shall not make alterations to the property without prior written consent from the landlord." },
    ],
  }),
  baseDoc({
    id: "research",
    title: "Active Reading and Memory Anchors",
    meta: "Opened yesterday",
    status: "continue",
    layout: "columns",
    currentBlockId: "research-2",
    blocks: [
      { id: "research-1", region: "left", text: "Abstract. This paper studies whether reader-created moments improve later retrieval in long technical documents." },
      { id: "research-2", region: "left", text: "Introduction. Readers notice passages, but interfaces rarely preserve why a passage mattered or where it was encountered." },
      { id: "research-3", region: "left", text: "Method. Participants completed recall, comparison, and contradiction-finding tasks across policy and academic material." },
      { id: "research-4", region: "right", text: "Results. Return cues reduced median retrieval time when the interface treated a marked passage as a place, not merely coloured text." },
      { id: "research-5", region: "right", text: "The strongest outcome appeared when the original reading geometry remained visible during a later return." },
      { id: "research-6", region: "right", text: "Limitation. This study did not evaluate handwritten marginalia or mixed paper-digital workflows." },
    ],
  }),
  baseDoc({
    id: "paper-return-cues",
    title: "Return Cues in Dense Reading Systems",
    meta: "19-page paper - two columns",
    status: "continue",
    layout: "columns",
    documentType: "Research paper",
    currentBlockId: "return-3",
    moments: [{ id: "return-m1", blockIds: ["return-7"], type: "highlight", excerpt: "the remembered place outperformed the remembered quote", createdAt: "11:18" }],
    acts: [{ id: "return-a1", type: "highlight", intention: "highlight this", proof: "the remembered place outperformed the remembered quote", createdAt: "11:18", blockIds: ["return-7"], momentId: "return-m1" }],
    blocks: [
      { id: "return-1", region: "left", text: "# Return Cues in Dense Reading Systems\n### Mira Venkataraman, Kabir Sethi, and Leela Rao\n\n**Abstract.** Long documents rarely fail because readers cannot mark text. They fail because marked text loses its original place, visual neighborhood, and reason for being marked. We evaluate a reader interface where a kept passage behaves as a returnable place rather than as a detached annotation." },
      { id: "return-2", region: "left", text: "## 1. Introduction\nReaders often remember an argument spatially: it was near the bottom of a page, after a method table, beside a narrow paragraph, or before a figure. Conventional document tools compress these cues into highlights, comments, and search results. The compression is convenient, but it weakens later return." },
      { id: "return-3", region: "left", text: "Our hypothesis is simple: a reading system should preserve the geometry of attention. A kept moment should know the text, the user intention, and the local shape of the page. When the reader returns, the document should make the place feel familiar before asking for another action." },
      { id: "return-4", region: "left", text: "## 2. Study Design\nWe recruited 42 participants who read policy memos, lease agreements, and academic papers across phone and laptop sessions. Each participant completed two sessions separated by 48 hours. The first session asked them to keep passages while reading; the second asked them to answer questions using only their saved places." },
      { id: "return-5", region: "left", text: "| Condition | Median return time | Error rate |\n| --- | ---: | ---: |\n| Highlight list | 42.8s | 18.4% |\n| Search result | 36.1s | 14.7% |\n| Place return | 21.6s | 7.2% |\n\nThe place-return condition retained document geometry and showed a short memory card before scrolling." },
      { id: "return-6", region: "left", text: "## 3. Interaction Protocol\nThe interface used three gestures: tap the ambient indicator to return, hold the indicator to pause or resume listening, and hold a passage to reveal the circular action menu. No persistent toolbar was shown during ordinary reading. This constraint forced every visible element to earn its place." },
      { id: "return-7", region: "right", text: "## 4. Findings\nAcross all document types, the remembered place outperformed the remembered quote. Participants described the page around the passage more often than the exact words. This suggests that document memory is partly topographic, especially when the document is long enough to develop a recognizable landscape." },
      { id: "return-8", region: "right", text: "A second finding concerned interruption. Participants tolerated a small ambient card when it appeared as a result of their own action. They rejected side panels that opened automatically, even when those panels contained useful history. The timing of assistance mattered as much as the content of assistance." },
      { id: "return-9", region: "right", text: "## 5. Design Implications\nA high-quality reader should keep the ordinary page quiet. Action surfaces should appear only at the site of intent: the held passage, the ambient dot, or the returned place. If a control is visible all the time, it becomes part of the document whether the reader wants it or not." },
      { id: "return-10", region: "right", text: "> The best return cue did not explain the document. It gave the reader the confidence that they had been here before.\n\nThis observation shaped the final prototype: the return card shows the remembered passage, then disappears without requiring dismissal." },
      { id: "return-11", region: "right", text: "## 6. Limitations\nThe study used simulated work documents and did not include handwritten margins, scanned multilingual pages, or low-vision settings. Future work should test how place memory behaves when OCR confidence, handwriting, and page rotation vary across captures." },
      { id: "return-12", region: "right", text: "## References\n[1] O'Hara, K. and Sellen, A. A comparison of reading paper and online documents.\n[2] Marshall, C. Toward an ecology of hypertext annotation.\n[3] Schilit, B., Golovchinsky, G., and Price, M. Beyond paper: supporting active reading." },
    ],
  }),
  baseDoc({
    id: "paper-ocr-forms",
    title: "Fast OCR Review for Indian Everyday Documents",
    meta: "24-page paper - scanned forms",
    status: "new",
    layout: "columns",
    documentType: "Research paper",
    currentBlockId: "ocr-1",
    blocks: [
      { id: "ocr-1", region: "left", text: "# Fast OCR Review for Indian Everyday Documents\n### Field notes from mobile-first document intake\n\n**Abstract.** This paper studies the review layer needed after fast capture of Indian identity, tax, and rental documents. The central problem is not recognition alone; it is showing uncertainty without making the user read the same document twice." },
      { id: "ocr-2", region: "left", text: "## 1. Background\nEveryday paperwork in India includes Aadhaar, PAN, passports, rental agreements, bank letters, fee receipts, and tax filings. These documents mix printed text, handwritten additions, stamps, signatures, and photographed shadows. A scanner must therefore be fast without pretending that every field is equally certain." },
      { id: "ocr-3", region: "left", text: "## 2. Capture Model\nThe capture flow used four stages: edge detection, glare check, field grouping, and human review. The important design choice was to avoid a separate correction dashboard. Instead, uncertain fields stayed on the page and carried small confidence marks that could be touched only when needed." },
      { id: "ocr-4", region: "left", text: "| Document | Common failure | Preferred review cue |\n| --- | --- | --- |\n| Aadhaar copy | cropped address line | page-edge warning |\n| Passport | glare over surname | field glow |\n| Rent receipt | handwritten amount | tap-to-confirm chip |\n| ITR-V | dense table rows | row confidence mark |" },
      { id: "ocr-5", region: "left", text: "## 3. Handwriting Layer\nHandwritten text was treated as a first-class source, not an exception. The interface stored the rendered transcription beside the source crop, but the reader saw only the document unless they asked for proof. This reduced visual clutter during normal reading." },
      { id: "ocr-6", region: "left", text: "The fastest successful review pattern was a quiet escape hatch: voice remained primary, but manual entry appeared when recognition confidence dropped or when a device was in a noisy environment. Participants disliked being forced into a form before seeing the page." },
      { id: "ocr-7", region: "right", text: "## 4. Results\nMedian capture-to-readable time was 8.7 seconds for a single-page identity document and 31.4 seconds for a five-page lease packet. Users corrected fewer fields when confidence marks were embedded in the document instead of listed separately." },
      { id: "ocr-8", region: "right", text: "The review surface performed best when it used a small number of meanings: unread, uncertain, confirmed, and masked. More detailed OCR scores helped engineers but distracted users. A scanner UI should reveal precision only when a person needs to make a decision." },
      { id: "ocr-9", region: "right", text: "## 5. Privacy and Masking\nDocuments containing Aadhaar numbers, passport numbers, and tax identifiers required automatic masking before share or print. The original remained in the private vault. The working copy was treated as a derivative with its own proof trail." },
      { id: "ocr-10", region: "right", text: "> The capture should feel instant, but the proof should feel patient.\n\nThis principle separated scanner speed from reader trust. The interface could move quickly because the evidence remained available behind every accepted field." },
      { id: "ocr-11", region: "right", text: "## 6. Design Recommendation\nDo not make the user manage pages, fields, and corrections in three separate places. Let the page stay visible, let uncertainty stay local, and let completed documents return to the same reader surface as written documents." },
      { id: "ocr-12", region: "right", text: "## Appendix: Review Commands\n- confirm this field\n- mask this before printing\n- read the address aloud\n- compare this with the lease\n- send the masked copy to the print shop" },
    ],
  }),
  baseDoc({
    id: "paper-authorship",
    title: "Authorship Proofs for Human-Written Longform",
    meta: "31-page paper - draft manuscript",
    status: "continue",
    layout: "columns",
    documentType: "Research paper",
    currentBlockId: "author-4",
    blocks: [
      { id: "author-1", region: "left", text: "# Authorship Proofs for Human-Written Longform\n### A prototype for durable attribution\n\n**Abstract.** As generated text becomes cheap, longform written by humans may become culturally and economically important again. We describe an authorship record that preserves drafting acts, revisions, reading appointments, and publication events without turning writing into surveillance." },
      { id: "author-2", region: "left", text: "## 1. Motivation\nReaders increasingly ask whether a text was written, assembled, translated, or generated. A useful system should not answer this question with a single badge. It should preserve a chain of acts that can be inspected at different levels of detail." },
      { id: "author-3", region: "left", text: "We distinguish proof from performance. Proof records what happened: a handwritten passage was captured, a typed paragraph was revised, a quote was extracted, or a draft was published. Performance tries to convince the viewer. The reader should receive proof, not theatre." },
      { id: "author-4", region: "left", text: "## 2. Authorship Trail\nThe trail contains four layers: source material, writing acts, revision acts, and release acts. Each layer can be private, shared with a collaborator, or published. The default is private because authorship systems become unusable when they expose too much by default." },
      { id: "author-5", region: "left", text: "| Layer | Stored evidence | Visible by default |\n| --- | --- | --- |\n| Source | scan, import, voice seed | no |\n| Draft | typed or handwritten edit | author only |\n| Revision | change summary | collaborators |\n| Release | timestamp, license, version | readers |" },
      { id: "author-6", region: "left", text: "## 3. Reader Appointment\nA long document can also become a social object. The prototype allowed a reader to schedule an appointment with an authorial voice, a historical character, or another reader. The appointment was attached to a passage, not to a generic chat panel." },
      { id: "author-7", region: "right", text: "## 4. Findings\nParticipants valued attribution most when it answered a concrete question: who wrote this paragraph, where did this quote come from, what changed since the last version, and can I cite this exact passage? Abstract trust labels were rarely opened." },
      { id: "author-8", region: "right", text: "A second pattern was emotional. Readers wanted the document to feel inhabited, but not crowded. Presence indicators worked when they were quiet and local. Large collaboration panels made the manuscript feel like workplace software." },
      { id: "author-9", region: "right", text: "## 5. Publication Model\nThe release flow treated print and digital publication as siblings. A self-published essay could create a reading copy, a printable packet, and a public attribution page from the same source trail. This made paper feel like an extension of authorship rather than an export format." },
      { id: "author-10", region: "right", text: "> Originality is not only a property of text. It is a relationship between a person, a process, and a durable record.\n\nThe product implication is that writing, reading, print, and sharing should not be separate modules with unrelated histories." },
      { id: "author-11", region: "right", text: "## 6. Risks\nThe system must avoid coercive proof demands, false certainty, and permanent exposure of private drafts. A humane authorship record gives the writer control over resolution: enough proof for the context, not maximum disclosure." },
      { id: "author-12", region: "right", text: "## References\n[1] W3C Verifiable Credentials Data Model.\n[2] C2PA Technical Specification.\n[3] Klein, L. and D'Ignazio, C. Data Feminism.\n[4] Chartier, R. Forms and Meanings: Texts, Performances, and Audiences." },
    ],
  }),
  baseDoc({
    id: "aadhaar",
    title: "Aadhaar Card - Sample Resident Copy",
    meta: "Opened 3 days ago",
    status: "finished",
    documentType: "Aadhaar card",
    sourceKind: "scan",
    currentBlockId: "aadhaar-1",
    blocks: [
      { id: "aadhaar-1", text: "Identity document. Name, date of birth, and address require sensitive handling before any print or share action." },
      { id: "aadhaar-2", text: "Use the masked copy for routine verification. Preserve the original capture only in the private vault." },
    ],
  }),
]
const blocksFromText = (text: string): Block[] => text.split(/\n\s*\n/).map(value => value.trim()).filter(Boolean).map(text => ({ id: uid(), text }))
const normalizeMoment = (moment: Moment): Moment => {
  const value = moment as unknown as Partial<Moment> & { blockId?: string }
  if (value.blockIds) return moment
  return { id: value.id ?? uid(), blockIds: [value.blockId ?? ""], type: value.type === "important" ? "important" : "highlight", excerpt: value.excerpt ?? "", createdAt: value.createdAt ?? stamp() }
}
const normalizeDoc = (raw: Partial<Doc>): Doc => baseDoc({
  id: raw.id ?? uid(),
  title: raw.title ?? "Untitled document",
  meta: raw.meta ?? "Opened just now",
  status: raw.status ?? "continue",
  currentBlockId: raw.currentBlockId ?? raw.blocks?.[0]?.id ?? "",
  blocks: raw.blocks?.length ? raw.blocks : blocksFromText("This document is ready to read."),
  notes: raw.notes ?? [],
  moments: (raw.moments ?? []).map(moment => { const normalized = normalizeMoment(moment); return normalized.blockIds[0] ? normalized : { ...normalized, blockIds: [raw.currentBlockId ?? ""] } }),
  acts: raw.acts ?? [],
  spaces: raw.spaces ?? [{ id: "space-proof", name: "Proof folder", momentIds: [] }, { id: "space-reading", name: "Reading circle", momentIds: [] }],
  reminders: raw.reminders ?? [],
  drops: raw.drops ?? [],
  intakes: raw.intakes ?? [],
  comments: raw.comments ?? [],
  layout: raw.layout,
  sourceImage: raw.sourceImage,
  sourceKind: raw.sourceKind,
  documentType: raw.documentType,
  authorship: raw.authorship,
})
function loadDocs() {
  try {
    const raw = localStorage.getItem("jetty.documents.v4") ?? localStorage.getItem("jetty.documents.v3")
    return raw ? (JSON.parse(raw) as Partial<Doc>[]).map(normalizeDoc) : seed
  } catch {
    return seed
  }
}
function act(type: ActionType, blockIds: string[], extra: Partial<ActRecord> = {}): ActRecord {
  return { id: uid(), type, intention: extra.intention ?? actionCopy[type], proof: extra.proof ?? "Source passage and timestamp retained on this device.", createdAt: stamp(), blockIds, ...extra }
}
function blockText(doc: Doc, ids: string[]) {
  return ids.map(id => doc.blocks.find(block => block.id === id)?.text).filter(Boolean).join(" ")
}
function latestMoment(doc: Doc) {
  return [...doc.moments].reverse().find(item => !item.undone)
}
function radialChoice(cx: number, cy: number, x: number, y: number): RadialChoice | null {
  const dx = x - cx, dy = y - cy, distance = Math.hypot(dx, dy)
  if (distance < 26 || distance > 116) return null
  const angle = Math.atan2(dy, dx) * 180 / Math.PI
  if (angle >= -135 && angle < -45) return "highlight"
  if (angle >= -45 && angle < 45) return "note"
  if (angle >= 45 && angle < 135) return "quote"
  return "send"
}

export default function App() {
  const [docs, setDocs] = useState<Doc[]>(loadDocs), [view, setView] = useState<View>("library"), [activeId, setActiveId] = useState(() => loadDocs()[0]?.id ?? seed[0].id), [query, setQuery] = useState("")
  const active = docs.find(doc => doc.id === activeId) ?? docs[0]
  useEffect(() => { localStorage.setItem("jetty.documents.v4", JSON.stringify(docs)) }, [docs])
  const update = (id: string, change: (doc: Doc) => Doc) => setDocs(current => current.map(doc => doc.id === id ? change(doc) : doc))
  const jump = (docId: string, blockId: string) => {
    setActiveId(docId)
    update(docId, doc => ({ ...doc, currentBlockId: blockId, meta: "Opened just now", acts: [...doc.acts, act("return", [blockId], { proof: "Returned to a remembered passage." })] }))
    setView("reader")
  }
  const open = (doc: Doc) => {
    setActiveId(doc.id)
    update(doc.id, value => ({ ...value, meta: "Opened just now", status: value.status === "new" ? "continue" : value.status, acts: [...value.acts, act("open-document", [value.currentBlockId], { proof: "Opened from local vault." })] }))
    setView("reader")
  }
  const create = (title: string, text: string, extra: Partial<Doc> = {}) => {
    const blocks = blocksFromText(text)
    const doc = normalizeDoc({ id: uid(), title, meta: "Created just now", status: "new", currentBlockId: blocks[0]?.id ?? "", blocks, ...extra })
    setDocs(current => [doc, ...current])
    setActiveId(doc.id)
    setView("reader")
  }
  const importDoc = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => create(file.name.replace(/\.[^/.]+$/, ""), file.type.startsWith("image/") ? scannerText["Aadhaar card"] : String(reader.result || "This document is ready to read."), file.type.startsWith("image/") ? { sourceImage: String(reader.result), sourceKind: "scan", documentType: "Captured document" } : { sourceKind: "text", authorship: "typed" })
    file.type.startsWith("image/") ? reader.readAsDataURL(file) : reader.readAsText(file)
    event.target.value = ""
  }
  if (!active) return null
  if (view === "library") return <Library docs={docs} query={query} onQuery={setQuery} onOpen={open} onImport={importDoc} onNew={() => create("Untitled note", "Start with the part worth remembering.", { authorship: "typed" })} onNavigate={setView} />
  if (view === "scanner") return <Scanner onBack={() => setView("library")} onSave={(title, image, type) => create(title, scannerText[type], { sourceImage: image, sourceKind: "scan", documentType: type, authorship: "mixed" })} />
  if (view === "studio") return <Studio onBack={() => setView("library")} onCreate={create} />
  if (view === "print") return <PrintDesk doc={active} onBack={() => setView("reader")} />
  if (view === "publish") return <PublishDesk doc={active} onBack={() => setView("reader")} onPublish={() => update(active.id, doc => ({ ...doc, status: "published", meta: "Published just now", acts: [...doc.acts, act("quote", [doc.currentBlockId], { proof: "Published copy carries authorship record." })] }))} />
  if (view === "social") return <ShareDesk doc={active} onBack={() => setView("reader")} onUpdate={change => update(active.id, change)} />
  return <Reader doc={active} docs={docs} onBack={() => setView("library")} onNavigate={setView} onUpdate={change => update(active.id, change)} onJump={jump} />
}

function Library({ docs, query, onQuery, onOpen, onImport, onNew, onNavigate }: { docs: Doc[]; query: string; onQuery: (value: string) => void; onOpen: (doc: Doc) => void; onImport: (event: ChangeEvent<HTMLInputElement>) => void; onNew: () => void; onNavigate: (view: View) => void }) {
  const visible = useMemo(() => docs.filter(doc => `${doc.title} ${doc.blocks.map(block => block.text).join(" ")}`.toLowerCase().includes(query.toLowerCase())), [docs, query])
  const briefing = useMemo(() => {
    const moments = docs.reduce((total, doc) => total + doc.moments.filter(item => !item.undone).length, 0)
    const acts = docs.reduce((total, doc) => total + doc.acts.filter(item => !item.undone && item.type !== "undo").length, 0)
    const unfinished = docs.filter(doc => doc.status === "continue")
    const notes = docs.reduce((total, doc) => total + doc.notes.filter(item => !item.undone).length, 0)
    return { moments, acts, unfinished, notes, resume: unfinished[0] ?? docs[0] }
  }, [docs])
  const sheet = useRef<HTMLElement>(null)
  const [raised, setRaised] = useState(false)
  const searching = query.trim().length > 0
  useEffect(() => {
    if (searching) { setRaised(true); return }
    const onScroll = () => setRaised(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [searching])
  const lower = () => window.scrollTo({ top: 0, behavior: "smooth" })
  const raise = () => sheet.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  return <main className={`library-page ${raised ? "sheet-raised" : ""}`}>
    <header className="library-page-top"><div className="wordmark">jtty<span>.</span></div><div><button onClick={() => onNavigate("scanner")}><Camera size={16} /> scan</button><label className="import"><FileArrowUp size={15} /> import<input type="file" accept="image/*,.txt,.md,.markdown" onChange={onImport} /></label></div></header>
    <section className="library-brief" aria-hidden={raised}>
      <div className="brief-count">
        <strong>{docs.length}</strong>
        <i />
        <span>{docs.length === 1 ? "document" : "documents"}<em>in your vault</em></span>
      </div>
      <p className="brief-line">
        {briefing.unfinished.length > 0
          ? <>You are <b>mid&#8209;read</b> in {briefing.unfinished.length === 1 ? "one document" : `${briefing.unfinished.length} documents`}.</>
          : <>Everything here is <b>finished</b>.</>}
      </p>
      <dl className="brief-tally">
        <div><dt><Highlighter size={14} weight="fill" />passages kept</dt><dd>{briefing.moments}</dd></div>
        <div><dt><SealCheck size={14} weight="fill" />acts recorded</dt><dd>{briefing.acts}</dd></div>
        <div><dt><NotePencil size={14} weight="fill" />notes written</dt><dd>{briefing.notes}</dd></div>
      </dl>
      {briefing.resume && <button className="brief-resume" onClick={() => onOpen(briefing.resume)}>
        <small>pick up where you stopped</small>
        <strong>{briefing.resume.title}</strong>
        <ArrowBendUpLeft size={16} weight="bold" />
      </button>}
      <button className="brief-pull" onClick={raise}><i /><span>{docs.length} in the vault</span></button>
    </section>
    <section className="library-sheet" ref={sheet}>
      <button className="sheet-grip" onClick={raised ? lower : raise} aria-label={raised ? "Show reading summary" : "Show documents"}><i /></button>
      <label className="search"><MagnifyingGlass size={15}/><input value={query} onChange={e => onQuery(e.target.value)} placeholder="Find a document or passage" /><kbd>cmd K</kbd></label>
      <div className="library-grid">{visible.length ? visible.map(doc => <button className="library-doc" key={doc.id} onClick={() => onOpen(doc)}><FileText size={18}/><span><small>{doc.documentType ?? doc.status}</small><strong>{doc.title}</strong><em>{doc.moments.filter(item => !item.undone).length} moments - {doc.acts.length} acts - {doc.meta}</em></span></button>) : <p className="sheet-empty">No document matches <b>{query}</b>. Try a phrase you remember reading.</p>}</div>
      <footer className="library-footer"><button onClick={onNew}><Plus size={16}/> new document</button><button onClick={() => onNavigate("studio")}><PenNib size={16}/> write with proof</button></footer>
    </section>
  </main>
}

function Reader({ doc, docs, onBack, onNavigate, onUpdate, onJump }: { doc: Doc; docs: Doc[]; onBack: () => void; onNavigate: (view: View) => void; onUpdate: (change: (doc: Doc) => Doc) => void; onJump: (docId: string, blockId: string) => void }) {
  const [note, setNote] = useState(""), [selected, setSelected] = useState(doc.currentBlockId), [selectedText, setSelectedText] = useState(""), [room, setRoom] = useState<Room | null>(null), [documentSurface, setDocumentSurface] = useState<"menu" | "share" | "moments" | null>(null), [rangeStart, setRangeStart] = useState<string | null>(null), [speaking, setSpeaking] = useState(false), [ambient, setAmbient] = useState<"listening" | "paused">("listening"), [suggestions, setSuggestions] = useState(false), [ambientCard, setAmbientCard] = useState<{ kind: "return" | "share"; text: string; meta: string } | null>(null), [holding, setHolding] = useState<string | null>(null), [navHidden, setNavHidden] = useState(false), [radial, setRadial] = useState<{ id: string; x: number; y: number; choice: RadialChoice | null } | null>(null)
  const hold = useRef<number | null>(null), holdPoint = useRef<{ x: number; y: number } | null>(null), ambientHold = useRef<number | null>(null), ambientCardTimer = useRef<number | null>(null), passageRefs = useRef<Record<string, HTMLDivElement | null>>({}), selectedRef = useRef(selected), scrollFrame = useRef<number | null>(null)
  useEffect(() => { setSelected(doc.currentBlockId); setSelectedText(""); setRadial(null); setDocumentSurface(null) }, [doc.id, doc.currentBlockId])
  useEffect(() => { selectedRef.current = selected }, [selected])
  useEffect(() => () => { if (hold.current) window.clearTimeout(hold.current); if (ambientHold.current) window.clearTimeout(ambientHold.current); if (ambientCardTimer.current) window.clearTimeout(ambientCardTimer.current); window.speechSynthesis?.cancel() }, [])
  useEffect(() => {
    let lastY = window.scrollY || document.documentElement.scrollTop
    let touchY: number | null = null
    let downDistance = 0
    let frame: number | null = null
    const currentScroll = () => window.scrollY || document.documentElement.scrollTop || 0
    const reveal = () => {
      downDistance = 0
      setNavHidden(false)
    }
    const reactToDelta = (delta: number, y = currentScroll()) => {
      if (y < 36) { reveal(); return }
      if (delta < 0) { reveal(); return }
      if (delta > 1) {
        downDistance += delta
        if (downDistance > 18 && y > 72) setNavHidden(true)
      }
    }
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = null
        const currentY = currentScroll()
        reactToDelta(currentY - lastY, currentY)
        lastY = currentY
      })
    }
    const onWheel = (event: WheelEvent) => reactToDelta(event.deltaY)
    const onTouchStart = (event: TouchEvent) => { touchY = event.touches[0]?.clientY ?? null }
    const onTouchMove = (event: TouchEvent) => {
      const nextY = event.touches[0]?.clientY ?? null
      if (touchY === null || nextY === null) { touchY = nextY; return }
      reactToDelta(touchY - nextY)
      touchY = nextY
    }
    const onPointerMove = (event: globalThis.PointerEvent) => {
      if (event.pointerType !== "touch" || touchY === null) return
      reactToDelta(touchY - event.clientY)
      touchY = event.clientY
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("wheel", onWheel, { passive: true })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: true })
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("pointermove", onPointerMove)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [doc.id])
  useEffect(() => {
    if (!radial) return
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setRadial(null) }
    const move = (event: globalThis.PointerEvent) => {
      setRadial(current => current ? { ...current, choice: radialChoice(current.x, current.y, event.clientX, event.clientY) } : current)
    }
    // Two ways in: drag out to a wedge and release, or release in place and click a button.
    // Only resolve the gesture if the pointer actually travelled - otherwise leave the menu
    // open so the buttons stay clickable, since click fires after pointerup.
    const up = (event: globalThis.PointerEvent) => {
      const choice = radialChoice(radial.x, radial.y, event.clientX, event.clientY)
      if (!choice) return
      const id = radial.id
      setRadial(null)
      executeRadial(choice, id)
    }
    window.addEventListener("keydown", close)
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", up)
    return () => {
      window.removeEventListener("keydown", close)
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
    }
  }, [radial?.id, radial?.x, radial?.y])
  useEffect(() => {
    const pickNearest = () => {
      if (window.getSelection()?.toString()) return
      const targetY = window.innerHeight * .46
      const selectedNode = passageRefs.current[selectedRef.current]
      if (selectedNode) {
        const selectedRect = selectedNode.getBoundingClientRect()
        const selectedDistance = Math.abs((selectedRect.top + selectedRect.height * .32) - targetY)
        if (selectedRect.bottom > 88 && selectedRect.top < window.innerHeight - 96 && selectedDistance < 150) return
      }
      let next = selectedRef.current, distance = Number.POSITIVE_INFINITY
      doc.blocks.forEach(block => {
        const node = passageRefs.current[block.id]
        if (!node) return
        const rect = node.getBoundingClientRect()
        if (rect.bottom < 68 || rect.top > window.innerHeight) return
        const current = Math.abs((rect.top + rect.height * .32) - targetY)
        if (current < distance) { distance = current; next = block.id }
      })
      if (next !== selectedRef.current && distance < 220) { selectedRef.current = next; setSelected(next) }
    }
    const onScroll = () => {
      if (scrollFrame.current) return
      scrollFrame.current = window.requestAnimationFrame(() => { scrollFrame.current = null; pickNearest() })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    pickNearest()
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (scrollFrame.current) window.cancelAnimationFrame(scrollFrame.current)
    }
  }, [doc.id, doc.blocks])
  const focus = (id: string, persist = true) => {
    selectedRef.current = id
    setSelected(id)
    if (persist) onUpdate(value => ({ ...value, currentBlockId: id, status: value.status === "new" ? "continue" : value.status }))
  }
  const showAmbientCard = (kind: "return" | "share", text: string, meta: string) => {
    if (ambientCardTimer.current) window.clearTimeout(ambientCardTimer.current)
    setSuggestions(false)
    setAmbientCard({ kind, text: text.slice(0, 150), meta })
    ambientCardTimer.current = window.setTimeout(() => setAmbientCard(null), 2400)
  }
  const captureSelection = () => {
    const selection = window.getSelection()
    const text = selection?.toString().trim() ?? ""
    if (!text) return
    const element = selection?.anchorNode?.parentElement?.closest("[data-block]") as HTMLElement | null
    const id = element?.dataset.block
    if (id) { setSelected(id); setSelectedText(text) }
  }
  const passageIdsBetween = (from: string, to: string) => {
    const ids = doc.blocks.map(block => block.id), a = ids.indexOf(from), b = ids.indexOf(to)
    if (a < 0 || b < 0) return [to]
    return ids.slice(Math.min(a, b), Math.max(a, b) + 1)
  }
  const recordMoment = (type: Moment["type"], blockIds: string[], excerpt: string, actionType: ActionType, label?: string) => {
    const id = uid()
    onUpdate(value => ({ ...value, currentBlockId: blockIds[blockIds.length - 1] ?? value.currentBlockId, moments: [...value.moments, { id, type, blockIds, excerpt, createdAt: stamp(), label }], acts: [...value.acts, act(actionType, blockIds, { momentId: id, proof: `${excerpt.slice(0, 90)}${excerpt.length > 90 ? "..." : ""}` })] }))
    setSelectedText("")
    return id
  }
  const highlight = () => recordMoment("highlight", [selected], selectedText || blockText(doc, [selected]), "highlight")
  const important = () => recordMoment("important", [selected], selectedText || blockText(doc, [selected]), "important")
  const range = () => {
    if (!rangeStart) { setRangeStart(selected); return }
    const ids = passageIdsBetween(rangeStart, selected)
    recordMoment("range", ids, blockText(doc, ids), "highlight-range")
    setRangeStart(null)
  }
  const addNote = () => {
    const text = note.trim() || selectedText.trim()
    if (!text) return
    const id = uid()
    onUpdate(value => ({ ...value, notes: [...value.notes, { id, blockId: selected, text, createdAt: stamp() }], acts: [...value.acts, act("annotate", [selected], { noteId: id, proof: text })] }))
    setNote("")
    setSelectedText("")
  }
  const quote = () => recordMoment("quote", [selected], selectedText || blockText(doc, [selected]), "quote")
  const mathKeep = (expression: string) => recordMoment("math", [selected], expression || selectedText || "x = (-b +- sqrt(b^2 - 4ac)) / 2a", "math-keep", "spoken expression")
  const latest = latestMoment(doc)
  const sendTo = (destination: string) => {
    if (!latest || !destination.trim()) return
    onUpdate(value => ({ ...value, moments: value.moments.map(item => item.id === latest.id ? { ...item, destination } : item), acts: [...value.acts, act("send", latest.blockIds, { momentId: latest.id, destination, proof: `Moment sent to ${destination}.` })] }))
  }
  const keepForSend = () => {
    const id = recordMoment("highlight", [selected], selectedText || blockText(doc, [selected]), "highlight", "kept for sending")
    onUpdate(value => ({ ...value, acts: [...value.acts, act("send", [selected], { momentId: id, destination: "Send room", proof: "Moment prepared for destination selection." })] }))
    showAmbientCard("share", selectedText || blockText(doc, [selected]), "moment ready to send")
    setRoom("send")
  }
  const executeRadial = (choice: RadialChoice, id: string) => {
    focus(id)
    const excerpt = selectedText || blockText(doc, [id])
    if (choice === "highlight") {
      recordMoment("highlight", [id], excerpt, "highlight", "kept moment")
      return
    }
    if (choice === "note") {
      setSelected(id)
      setRoom("note")
      return
    }
    if (choice === "quote") {
      recordMoment("quote", [id], excerpt, "quote")
      return
    }
    const momentId = recordMoment("highlight", [id], excerpt, "highlight", "kept for sending")
    onUpdate(value => ({ ...value, acts: [...value.acts, act("send", [id], { momentId, destination: "Send room", proof: "Moment prepared for destination selection." })] }))
    showAmbientCard("share", excerpt, "moment ready to send")
    setRoom("send")
  }
  const sendToSpace = (spaceId: string) => {
    if (!latest) return
    onUpdate(value => ({ ...value, spaces: value.spaces.map(space => space.id === spaceId ? { ...space, momentIds: Array.from(new Set([...space.momentIds, latest.id])) } : space), acts: [...value.acts, act("space-moment", latest.blockIds, { momentId: latest.id, destination: value.spaces.find(space => space.id === spaceId)?.name, proof: "Moment placed in a current space." })] }))
  }
  const undo = () => onUpdate(value => {
    const last = [...value.acts].reverse().find(item => !item.undone && item.type !== "undo")
    if (!last) return value
    return {
      ...value,
      acts: [...value.acts.map(item => item.id === last.id ? { ...item, undone: true } : item), act("undo", last.blockIds, { proof: `Reversed ${last.type}; original record remains visible.` })],
      moments: last.momentId ? value.moments.map(item => item.id === last.momentId ? { ...item, undone: true } : item) : value.moments,
      notes: last.noteId ? value.notes.map(item => item.id === last.noteId ? { ...item, undone: true } : item) : value.notes,
      reminders: last.momentId ? value.reminders.map(item => item.momentId === last.momentId ? { ...item, undone: true } : item) : value.reminders,
    }
  })
  const returnLast = () => {
    const target = latestMoment(doc) ?? doc.moments.find(item => !item.undone)
    const id = target?.blockIds.at(-1) ?? doc.currentBlockId
    showAmbientCard("return", target?.excerpt || blockText(doc, [id]), target ? "returning to last kept moment" : "returning to last opened place")
    passageRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" })
    focus(id)
    onUpdate(value => ({ ...value, acts: [...value.acts, act("return", [id], { proof: "Returned to latest kept moment." })] }))
  }
  const readSelected = () => {
    const block = doc.blocks.find(item => item.id === selected)
    if (!block || !("speechSynthesis" in window)) return
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return }
    const utterance = new SpeechSynthesisUtterance(block.text)
    utterance.onend = () => setSpeaking(false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setSpeaking(true)
  }
  const handleCommand = (phrase: string, details: { destination?: string; spaceId?: string; expression?: string } = {}) => {
    const command = phrase.toLowerCase()
    if (command.includes("highlight from") || command.includes("range")) range()
    else if (command.includes("highlight")) highlight()
    else if (command.includes("note")) addNote()
    else if (command.includes("important")) important()
    else if (command.includes("send") && command.includes("space")) details.spaceId ? sendToSpace(details.spaceId) : setRoom("space")
    else if (command.includes("send")) sendTo(details.destination ?? "Draft desk")
    else if (command.includes("undo")) undo()
    else if (command.includes("back") || command.includes("where was")) returnLast()
    else if (command.includes("open document")) onBack()
    else if (command.includes("expression") || command.includes("keep that")) mathKeep(details.expression ?? "")
    else if (command.includes("acts") || command.includes("history")) setRoom("history")
    else if (command.includes("find")) setRoom("find")
    else if (command.includes("quote") || command.includes("extract")) quote()
    else if (command.includes("gather")) setRoom("gather")
    else if (command.includes("compare")) setRoom("compare")
    else if (command.includes("remind")) setRoom("remind")
    else if (command.includes("translate")) setRoom("translate")
    else if (command.includes("capture")) onNavigate("scanner")
    else if (command.includes("jtty")) setRoom("intake")
    else if (command.includes("device")) { setRoom(null); setSuggestions(false); setDocumentSurface("share") }
    else if (command.includes("together")) setRoom("together")
  }
  const blockButton = (block: Block, index: number) => {
    const visibleMoments = doc.moments.filter(item => !item.undone)
    const marked = visibleMoments.some(item => item.blockIds.includes(block.id) && (item.type === "highlight" || item.type === "range"))
    const kept = visibleMoments.some(item => item.blockIds.includes(block.id) && item.type === "important")
    const down = (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return
      focus(block.id)
      holdPoint.current = { x: event.clientX, y: event.clientY }
      setHolding(block.id)
      hold.current = window.setTimeout(() => { hold.current = null; holdPoint.current = null; window.getSelection()?.removeAllRanges(); setHolding(null); setRadial({ id: block.id, x: event.clientX, y: event.clientY, choice: null }) }, 520)
    }
    const move = (event: PointerEvent<HTMLDivElement>) => {
      if (!hold.current || !holdPoint.current) return
      const moved = Math.hypot(event.clientX - holdPoint.current.x, event.clientY - holdPoint.current.y)
      if (moved > 10) cancel()
    }
    const cancel = () => { if (hold.current) window.clearTimeout(hold.current); hold.current = null; holdPoint.current = null; setHolding(null) }
    return <div className={`passage ${selected === block.id ? "focused" : ""} ${marked ? "marked" : ""} ${kept ? "important" : ""} ${holding === block.id ? "holding" : ""}`} key={block.id} role="button" tabIndex={0} data-block={block.id} ref={node => { passageRefs.current[block.id] = node }} onClick={() => { if (!window.getSelection()?.toString()) focus(block.id) }} onContextMenu={event => radial && event.preventDefault()} onMouseUp={captureSelection} onKeyDown={event => { if (event.key === "Enter") focus(block.id) }} onPointerDown={down} onPointerMove={move} onPointerUp={cancel} onPointerCancel={cancel}><MarkdownBlock text={block.text} moments={visibleMoments.filter(item => item.blockIds.includes(block.id))} /></div>
  }
  const current = Math.max(1, doc.blocks.findIndex(block => block.id === selected) + 1), selectedNotes = doc.notes.filter(item => item.blockId === selected && !item.undone), left = doc.blocks.filter(block => block.region !== "right"), right = doc.blocks.filter(block => block.region === "right")
  const openRoom = (next: Room) => { setRoom(next); setSuggestions(false) }
  const openDocumentMenu = () => {
    setNavHidden(false)
    setSuggestions(false)
    setRoom(null)
    setDocumentSurface(current => current ? null : "menu")
  }
  const returnToMoment = (moment: Moment) => {
    const id = moment.blockIds.at(-1) ?? doc.currentBlockId
    setDocumentSurface(null)
    window.setTimeout(() => {
      passageRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" })
      focus(id)
    }, 80)
  }
  const paperClass = `${doc.layout === "columns" ? "paper column-paper" : "paper linear-paper"} ${doc.documentType === "Research paper" ? "research-paper" : ""}`.trim()
  const readerBodyClass = `reader-body ${doc.layout === "columns" ? "column-reader" : "linear-reader"} ${doc.documentType === "Research paper" ? "research-reader" : ""}`.trim()
  return <main className={`reader-page ${room ? "has-room" : ""}`}>
    <header className={`reader-top ${navHidden ? "nav-hidden" : ""}`}>
      <button className="back" onClick={onBack} aria-label="Back to library"><ArrowLeft size={18}/></button>
      <span>{doc.title}</span>
      <button className={`reader-more ${documentSurface ? "active" : ""}`} onClick={openDocumentMenu} aria-label="Open document actions" aria-haspopup="dialog" aria-expanded={Boolean(documentSurface)}><DotsThree size={22} weight="bold"/></button>
    </header>
    <section className={readerBodyClass}><div className="document-head"><p>{doc.documentType ?? doc.status} - {doc.meta}</p><h2>{doc.title}</h2><div className="progress"><i style={{ width: `${Math.max(8, current / Math.max(doc.blocks.length, 1) * 100)}%` }}/></div></div>{doc.sourceImage && <figure className="source-image"><img src={doc.sourceImage} alt={`${doc.title} source`} /><figcaption>Original capture retained in the private vault.</figcaption></figure>}<article className={paperClass}>{doc.layout === "columns" ? <div className="reading-columns"><div>{left.map(blockButton)}</div><div>{right.map((block, index) => blockButton(block, index + left.length))}</div></div> : doc.blocks.map(blockButton)}</article></section>
    <AmbientIndicator state={ambient} open={suggestions} card={ambientCard} onOpen={setSuggestions} onReturn={returnLast} onSelect={openRoom} hold={ambientHold} />
    {radial && <><button className="radial-backdrop" aria-label="Cancel action menu" onClick={() => setRadial(null)} /><div className="radial-menu" style={{ left: radial.x, top: radial.y }}><button className="radial-center" aria-label="Cancel" title="Cancel" onClick={() => setRadial(null)}><X size={13}/></button><button className={`radial-action radial-highlight ${radial.choice === "highlight" ? "armed" : ""}`} aria-label="Keep moment" title="Keep moment" onClick={() => { executeRadial("highlight", radial.id); setRadial(null) }}><Highlighter size={18}/></button><button className={`radial-action radial-note ${radial.choice === "note" ? "armed" : ""}`} aria-label="Add note" title="Add note" onClick={() => { executeRadial("note", radial.id); setRadial(null) }}><NotePencil size={18}/></button><button className={`radial-action radial-quote ${radial.choice === "quote" ? "armed" : ""}`} aria-label="Quote passage" title="Quote passage" onClick={() => { executeRadial("quote", radial.id); setRadial(null) }}><Copy size={17}/></button><button className={`radial-action radial-send ${radial.choice === "send" ? "armed" : ""}`} aria-label="Send moment" title="Send moment" onClick={() => { executeRadial("send", radial.id); setRadial(null) }}><ShareFat size={18}/></button></div></>}
    {room && <aside className="margin"><CommandPanel room={room} setRoom={setRoom} doc={doc} docs={docs} selected={selected} selectedText={selectedText} note={note} setNote={setNote} selectedNotes={selectedNotes} rangeStart={rangeStart} onCommand={handleCommand} onHighlight={highlight} onRange={range} onImportant={important} onNote={addNote} onQuote={quote} onMath={mathKeep} onSend={sendTo} onSpace={sendToSpace} onUndo={undo} onReturn={returnLast} onNavigate={onNavigate} onUpdate={onUpdate} onJump={onJump} /></aside>}
    {documentSurface && <DocumentActions surface={documentSurface} doc={doc} selected={selected} onSurface={setDocumentSurface} onClose={() => setDocumentSurface(null)} onPrint={() => { setDocumentSurface(null); onNavigate("print") }} onMoment={returnToMoment} onUpdate={onUpdate} />}
  </main>
}

function DocumentActions({ surface, doc, selected, onSurface, onClose, onPrint, onMoment, onUpdate }: { surface: "menu" | "share" | "moments"; doc: Doc; selected: string; onSurface: (surface: "menu" | "share" | "moments") => void; onClose: () => void; onPrint: () => void; onMoment: (moment: Moment) => void; onUpdate: (change: (doc: Doc) => Doc) => void }) {
  const liveMoments = doc.moments.filter(moment => !moment.undone)
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") onClose() }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", close)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", close)
    }
  }, [onClose])
  return <div className="document-actions-layer" role="presentation" onClick={onClose}>
    <section className={`document-actions-panel ${surface}`} role="dialog" aria-modal="true" aria-label={surface === "menu" ? "Document actions" : surface} onClick={event => event.stopPropagation()}>
      <header className="document-actions-head">
        {surface === "menu" ? <span>document actions</span> : <button onClick={() => onSurface("menu")}><ArrowLeft size={15}/> actions</button>}
        <button className="document-actions-close" onClick={onClose} aria-label="Close document actions"><X size={16}/></button>
      </header>
      {surface === "menu" && <div className="document-menu-body">
        <div className="document-menu-intro"><small>{doc.documentType ?? "document"}</small><h2>{doc.title}</h2><p>{doc.blocks.length} passages. {liveMoments.length} kept {liveMoments.length === 1 ? "moment" : "moments"}.</p></div>
        <div className="document-menu-actions">
          <button className="document-menu-action share" onClick={() => onSurface("share")}><span className="menu-action-icon"><ShareFat size={20}/></span><span><strong>Share</strong><small>Pair another device with three spoken words.</small></span><i aria-hidden="true">01</i></button>
          <button className="document-menu-action moments" onClick={() => onSurface("moments")}><span className="menu-action-icon"><Highlighter size={20}/></span><span><strong>Moments</strong><small>Return to the passages you chose to keep.</small></span><i aria-hidden="true">{String(liveMoments.length).padStart(2, "0")}</i></button>
          <button className="document-menu-action print" onClick={onPrint}><span className="menu-action-icon"><Printer size={20}/></span><span><strong>Print</strong><small>Compose a reading copy, quiet copy, or moments folio.</small></span><i aria-hidden="true">03</i></button>
        </div>
      </div>}
      {surface === "share" && <div className="document-share-body"><div className="document-surface-title"><small>continue elsewhere</small><h2>Share this reading</h2><p>Open jtty on the other device, then speak the words shown here.</p></div><DeviceShareFlow selectedMoment={latestMoment(doc)} selectedBlockId={selected} onUpdate={onUpdate} onConnected={onClose} /></div>}
      {surface === "moments" && <div className="document-moments-body"><div className="document-surface-title"><small>kept from this document</small><h2>Moments</h2><p>Each fragment returns to its original place in the reading.</p></div>{liveMoments.length ? <ol className="moment-trail">{liveMoments.map((moment, index) => <li key={moment.id}><button onClick={() => onMoment(moment)}><span>{String(index + 1).padStart(2, "0")}</span><blockquote>{moment.excerpt}</blockquote><small>{moment.label ?? moment.type.replace(/-/g, " ")} - {moment.createdAt}</small></button></li>)}</ol> : <div className="moments-empty"><Highlighter size={24}/><strong>No moments yet.</strong><p>Close this menu and keep a passage while you read. It will appear here.</p></div>}</div>}
    </section>
  </div>
}

function MarkdownBlock({ text, moments }: { text: string; moments: Moment[] }) {
  const whole = moments.some(item => item.type === "range" || item.type === "important" || (item.type === "highlight" && item.excerpt === text))
  const terms = moments.filter(item => item.type === "highlight" && item.excerpt && item.excerpt !== text).map(item => item.excerpt)
  return <div className={`passage-text ${whole ? "whole-mark" : ""}`}><ReactMarkdown remarkPlugins={[remarkGfm]} components={{
    p: ({ children }) => <p>{markNode(children, terms)}</p>,
    li: ({ children }) => <li>{markNode(children, terms)}</li>,
    h1: ({ children }) => <h1>{markNode(children, terms)}</h1>,
    h2: ({ children }) => <h2>{markNode(children, terms)}</h2>,
    h3: ({ children }) => <h3>{markNode(children, terms)}</h3>,
    strong: ({ children }) => <strong>{markNode(children, terms)}</strong>,
    em: ({ children }) => <em>{markNode(children, terms)}</em>,
    code: ({ children }) => <code>{children}</code>,
    a: ({ href, children }) => <a href={href} target="_blank" rel="noreferrer">{markNode(children, terms)}</a>,
  }}>{text}</ReactMarkdown></div>
}

function markNode(node: ReactNode, terms: string[]): ReactNode {
  return Children.map(node, child => {
    if (typeof child === "string") return markPlainText(child, terms)
    if (isValidElement(child)) {
      const element = child as ReactElement<{ children?: ReactNode }>
      return cloneElement(element, { children: markNode(element.props.children, terms) })
    }
    return child
  })
}

function markPlainText(text: string, terms: string[]): ReactNode {
  const term = terms.find(item => item.length > 1 && text.includes(item))
  if (!term) return text
  const index = text.indexOf(term)
  return <>{text.slice(0, index)}<mark>{term}</mark>{text.slice(index + term.length)}</>
}

function AmbientIndicator({ state, open, card, onOpen, onReturn, onSelect, hold }: { state: "listening" | "paused"; open: boolean; card: { kind: "return" | "share"; text: string; meta: string } | null; onOpen: (open: boolean) => void; onReturn: () => void; onSelect: (room: Room) => void; hold: React.MutableRefObject<number | null> }) {
  const longPress = useRef(false)
  const suggestions: { room: Room; label: string }[] = [{ room: "note", label: "note" }, { room: "send", label: "send" }, { room: "space", label: "space" }, { room: "find", label: "find" }, { room: "quote", label: "quote" }, { room: "history", label: "acts" }, { room: "together", label: "together" }]
  const down = () => { longPress.current = false; hold.current = window.setTimeout(() => { longPress.current = true; onOpen(true) }, 2000) }
  const up = () => { if (hold.current) window.clearTimeout(hold.current); hold.current = null }
  return <div className="ambient-wrap">{card && <div className={`ambient-card ${card.kind}`} role="status" aria-live="polite"><span>{card.kind === "return" ? "returned" : "ready to share"}</span><p>{card.text}</p><small>{card.meta}</small></div>}{open && <div className="suggestion-stack">{suggestions.map(item => <button key={item.room} onClick={() => onSelect(item.room)}>{item.label}</button>)}</div>}<button className={`ambient ${state}`} onClick={() => { if (longPress.current) { longPress.current = false; return }; onOpen(false); onReturn() }} onPointerDown={down} onPointerUp={up} onPointerCancel={up} title="Tap to return. Hold for suggestions."><span /> <em>{open ? "choose" : "return"}</em></button></div>
}

function CommandPanel(props: { room: Room; setRoom: (room: Room | null) => void; doc: Doc; docs: Doc[]; selected: string; selectedText: string; note: string; setNote: (value: string) => void; selectedNotes: Note[]; rangeStart: string | null; onCommand: (phrase: string, details?: { destination?: string; spaceId?: string; expression?: string }) => void; onHighlight: () => void; onRange: () => void; onImportant: () => void; onNote: () => void; onQuote: () => void; onMath: (expression: string) => void; onSend: (destination: string) => void; onSpace: (spaceId: string) => void; onUndo: () => void; onReturn: () => void; onNavigate: (view: View) => void; onUpdate: (change: (doc: Doc) => Doc) => void; onJump: (docId: string, blockId: string) => void }) {
  const [phrase, setPhrase] = useState(""), [browsing, setBrowsing] = useState(false)
  const hasMoments = props.doc.moments.filter(item => !item.undone).length > 0
  const suggested = suggestedRooms(props.room, props.selectedText, hasMoments, props.doc)
  useEffect(() => { setBrowsing(false) }, [props.room])
  if (props.room === "history") return <><header className="history-top"><span>record</span><button onClick={() => props.setRoom(null)} aria-label="Close panel"><X size={15}/></button></header><HistoryLedger doc={props.doc} onUndo={props.onUndo} onReturn={props.onReturn} /></>
  return <>
    <header><span>{roomMeta[props.room].title}</span><button onClick={() => props.setRoom(null)} aria-label="Close panel"><X size={15}/></button></header>
    <p className="room-explainer">{roomMeta[props.room].hint}</p>
    <div className="voice-strip"><Microphone size={17}/><input value={phrase} onChange={event => setPhrase(event.target.value)} placeholder={`say: ${roomMeta[props.room].say}`} /><button onClick={() => { props.onCommand(phrase); setPhrase("") }}>act</button></div>
    <RoomSurface {...props} />
    <nav className="room-next">
      {!browsing && suggested.length > 0 && <><p className="room-next-kicker">next</p><div className="room-suggested">{suggested.map(id => <button key={id} onClick={() => props.setRoom(id)}><span>{roomMeta[id].title}</span><small>{roomMeta[id].hint}</small></button>)}</div></>}
      <button className="room-browse" aria-expanded={browsing} onClick={() => setBrowsing(value => !value)}>{browsing ? "hide all tools" : "all tools"}<i /></button>
      {browsing && <div className="room-groups">{roomGroups.map(group => <section key={group.name}><p>{group.name}</p><div>{group.rooms.map(id => <button key={id} className={props.room === id ? "active" : ""} onClick={() => props.setRoom(id)} title={roomMeta[id].hint}>{roomMeta[id].title}</button>)}</div></section>)}</div>}
    </nav>
  </>
}

const roomMeta: Record<Room, { title: string; hint: string; say: string }> = {
  note: { title: "note", hint: "Attach your words beside this passage.", say: "add a note" },
  quote: { title: "quote", hint: "Keep the exact wording with its source.", say: "quote this" },
  gather: { title: "gather", hint: "Group related moments into one set.", say: "gather these" },
  compare: { title: "compare", hint: "Put two moments side by side.", say: "compare these" },
  send: { title: "send", hint: "Send the last kept moment to someone.", say: "send this to" },
  space: { title: "space", hint: "File this moment into a space.", say: "send this to my space" },
  remind: { title: "remind", hint: "Bring this passage back later.", say: "bring this back later" },
  find: { title: "find", hint: "Search words you remember reading.", say: "where did it say" },
  history: { title: "acts", hint: "Every act recorded, with proof.", say: "show my acts" },
  translate: { title: "translate", hint: "Keep a translation beside the original.", say: "translate this" },
  math: { title: "math", hint: "Keep a rendered expression.", say: "keep expression" },
  intake: { title: "intake", hint: "Bring in material shared from another app.", say: "send into jetty" },
  device: { title: "device", hint: "Hand this off to your other device.", say: "continue on my other device" },
  together: { title: "together", hint: "Read this passage alongside someone.", say: "read this together" },
}
// Grouped by what the reader is trying to do, not by which screen it happens to open.
const roomGroups: { name: string; rooms: Room[] }[] = [
  { name: "keep", rooms: ["note", "quote", "gather", "math"] },
  { name: "move", rooms: ["send", "space", "device", "together"] },
  { name: "revisit", rooms: ["remind", "find", "history", "compare"] },
  { name: "bring in", rooms: ["translate", "intake"] },
]
// Two or three rooms that make sense right after the current one, given what is on screen.
function suggestedRooms(room: Room, selectedText: string, hasMoments: boolean, doc: Doc): Room[] {
  const has = selectedText.trim().length > 0
  const pool: Room[] = room === "note" ? (has ? ["quote", "remind", "send"] : ["quote", "find"])
    : room === "quote" ? ["send", "space", "note"]
    : room === "send" ? ["space", "history"]
    : room === "space" ? ["gather", "send"]
    : room === "find" ? ["note", "remind"]
    : room === "gather" ? ["compare", "space"]
    : room === "compare" ? ["gather", "history"]
    : room === "remind" ? ["note", "history"]
    : room === "translate" ? ["note", "quote"]
    : room === "math" ? ["note", "quote"]
    : room === "intake" ? ["note", "find"]
    : room === "together" ? ["note", "send"]
    : ["note", "quote"]
  return pool.filter(id => id !== room).filter(id => {
    if (id === "send" || id === "space" || id === "compare" || id === "gather") return hasMoments
    if (id === "history") return doc.acts.length > 0
    return true
  }).slice(0, 3)
}

function HistoryLedger({ doc, onUndo, onReturn }: { doc: Doc; onUndo: () => void; onReturn: () => void }) {
  const liveActs = doc.acts.filter(item => !item.undone && item.type !== "undo")
  const proofCount = liveActs.filter(item => item.proof).length
  const last = liveActs.at(-1)
  return <section className="history-ledger"><div className="history-summary"><div><strong>{liveActs.length}</strong><span>acts</span></div><div><strong>{doc.moments.filter(item => !item.undone).length}</strong><span>moments</span></div><div><strong>{proofCount}</strong><span>proofs</span></div></div><div className="history-current"><span>latest</span><p>{last ? `${humanAct(last.type)} - ${last.intention}` : "No acts recorded yet."}</p></div><div className="history-actions"><button onClick={onUndo}><ArrowBendUpLeft size={15}/>undo last</button><button onClick={onReturn}><Check size={15}/>return</button></div><ol>{doc.acts.length ? [...doc.acts].reverse().map(item => <li className={item.undone ? "undone" : ""} key={item.id}><time>{item.createdAt}</time><strong>{humanAct(item.type)}</strong><p>{item.intention}</p><small>{item.proof}</small></li>) : <p className="empty-note">Nothing has been recorded yet.</p>}</ol></section>
}

function humanAct(type: ActionType) {
  return type.replace(/-/g, " ")
}

function RoomSurface(props: Parameters<typeof CommandPanel>[0]) {
  const [destination, setDestination] = useState("Ananya"), [spaceName, setSpaceName] = useState("Research proof"), [find, setFind] = useState("notice"), [expression, setExpression] = useState("E = mc^2"), [when, setWhen] = useState(today()), [translationLang, setTranslationLang] = useState("Hindi"), [intake, setIntake] = useState(""), [source, setSource] = useState("Share sheet"), [presence, setPresence] = useState("Meera")
  const selectedMoment = latestMoment(props.doc)
  const selectedBlockText = blockText(props.doc, [props.selected])
  const results = props.docs.flatMap(doc => doc.blocks.filter(block => `${doc.title} ${block.text}`.toLowerCase().includes(find.toLowerCase())).map(block => ({ doc, block })))
  const activeMoments = props.doc.moments.filter(moment => !moment.undone)
  const gathered = activeMoments.filter(moment => moment.type === "gather")
  if (props.room === "note") return <section className="room"><p className="room-kicker">selected</p><strong>{props.selectedText || selectedBlockText}</strong><div className="quick-actions"><button onClick={props.onHighlight}><Highlighter size={15}/>highlight</button><button onClick={props.onRange}><TextAa size={15}/>{props.rangeStart ? "finish range" : "range start"}</button><button onClick={props.onImportant}><Check size={15}/>important</button></div><div className="notes">{props.selectedNotes.length ? props.selectedNotes.map((item, index) => <div className="note" key={item.id}><span>{String(index + 1).padStart(2, "0")}</span><p>{item.text}<small>{item.createdAt}</small></p></div>) : <p className="empty-note">No notes on this passage yet.</p>}</div><div className="composer"><NotePencil size={17}/><textarea id="notes" value={props.note} onChange={event => props.setNote(event.target.value)} placeholder="Attach your words beside this passage" /><button onClick={props.onNote}>Add note</button></div></section>
  if (props.room === "send") return <section className="room"><p className="room-kicker">latest kept moment</p><strong>{selectedMoment?.excerpt ?? "Keep a moment first."}</strong><label className="field">Destination<input value={destination} onChange={event => setDestination(event.target.value)} /></label><button className="primary" onClick={() => props.onSend(destination)}><ShareFat size={16}/>Send moment</button></section>
  if (props.room === "space") return <section className="room"><p className="room-kicker">spaces</p>{props.doc.spaces.map(space => <button className="space-row" key={space.id} onClick={() => props.onSpace(space.id)}><Stack size={16}/><span><strong>{space.name}</strong><small>{space.momentIds.length} moments</small></span></button>)}<label className="field">New space<input value={spaceName} onChange={event => setSpaceName(event.target.value)} /></label><button className="text-button" onClick={() => props.onUpdate(doc => ({ ...doc, spaces: [...doc.spaces, { id: uid(), name: spaceName, momentIds: [] }] }))}><Plus size={15}/>Create space</button></section>
  if (props.room === "history") return <section className="room history-room"><button className="text-button" onClick={props.onUndo}><ArrowBendUpLeft size={15}/>Undo last act</button>{props.doc.acts.length ? [...props.doc.acts].reverse().map(item => <ActLine key={item.id} act={item} />) : <p className="empty-note">No acts recorded yet.</p>}</section>
  if (props.room === "find") return <section className="room"><label className="field">Remembered words<input value={find} onChange={event => setFind(event.target.value)} /></label><div className="result-list">{results.map(result => <button key={`${result.doc.id}-${result.block.id}`} onClick={() => props.onJump(result.doc.id, result.block.id)}><small>{result.doc.title}</small><span>{result.block.text}</span></button>)}</div></section>
  if (props.room === "quote") return <section className="room"><p className="room-kicker">exact passage</p><blockquote>{props.selectedText || selectedBlockText}</blockquote><button className="primary" onClick={props.onQuote}><Copy size={16}/>Keep quote with source</button></section>
  if (props.room === "gather") return <section className="room"><button className="primary" onClick={() => props.onMath("")}><Stack size={16}/>Keep current before gathering</button><button className="text-button" onClick={() => selectedMoment && props.onUpdate(doc => { const id = uid(); return { ...doc, moments: [...doc.moments, { id, type: "gather", blockIds: selectedMoment.blockIds, excerpt: selectedMoment.excerpt, createdAt: stamp(), label: "Gathered set" }], acts: [...doc.acts, act("gather", selectedMoment.blockIds, { momentId: id, proof: "Related moments kept together." })] } })}>Gather latest moment</button>{gathered.map(item => <MomentLine key={item.id} moment={item} />)}</section>
  if (props.room === "compare") return <section className="room"><p className="room-kicker">side by side</p><div className="compare-grid">{activeMoments.slice(-2).map(item => <MomentLine key={item.id} moment={item} />)}</div><p className="difference">Difference: one moment preserves the source wording; the other records why it was kept and where it can move next.</p><button className="text-button" onClick={() => props.onUpdate(doc => ({ ...doc, acts: [...doc.acts, act("compare", activeMoments.slice(-2).flatMap(item => item.blockIds), { proof: "Compared selected moments side by side." })] }))}>Record comparison</button></section>
  if (props.room === "remind") return <section className="room"><label className="field">Bring back at<input type="datetime-local" value={when} onChange={event => setWhen(event.target.value)} /></label><button className="primary" onClick={() => selectedMoment && props.onUpdate(doc => { const id = uid(); return { ...doc, reminders: [...doc.reminders, { id, momentId: selectedMoment.id, when, text: selectedMoment.excerpt, createdAt: stamp() }], acts: [...doc.acts, act("remind", selectedMoment.blockIds, { momentId: selectedMoment.id, proof: `Reminder set for ${when}.` })] } })}><Bell size={16}/>Set reminder</button>{props.doc.reminders.filter(item => !item.undone).map(item => <p className="status-message" key={item.id}>{item.when} - {item.text}</p>)}</section>
  if (props.room === "translate") return <section className="room"><label className="field">Language<select value={translationLang} onChange={event => setTranslationLang(event.target.value)}><option>Hindi</option><option>Tamil</option><option>Bengali</option><option>Spanish</option></select></label><blockquote>{props.selectedText || selectedBlockText}</blockquote><button className="primary" onClick={() => props.onUpdate(doc => { const id = uid(), text = `[${translationLang}] ${props.selectedText || selectedBlockText}`; return { ...doc, moments: [...doc.moments, { id, type: "translation", blockIds: [props.selected], excerpt: text, createdAt: stamp(), label: translationLang }], acts: [...doc.acts, act("translate", [props.selected], { momentId: id, proof: "Original passage retained with translation draft." })] } })}><Translate size={16}/>Keep translation</button></section>
  if (props.room === "math") return <section className="room"><label className="field">Rendered expression<input value={expression} onChange={event => setExpression(event.target.value)} /></label><div className="math-card">{expression}</div><button className="primary" onClick={() => props.onMath(expression)}><TextAa size={16}/>Keep expression</button></section>
  if (props.room === "intake") return <section className="room"><label className="field">Source<input value={source} onChange={event => setSource(event.target.value)} /></label><label className="field">Shared material<textarea value={intake} onChange={event => setIntake(event.target.value)} placeholder="Paste material shared by another app" /></label><button className="primary" onClick={() => intake.trim() && props.onUpdate(doc => ({ ...doc, intakes: [...doc.intakes, { id: uid(), source, text: intake, createdAt: stamp() }], acts: [...doc.acts, act("share-intake", [props.selected], { proof: `Material received from ${source}.` })] }))}>Save intake</button></section>
  if (props.room === "device") return <DeviceShareFlow selectedMoment={selectedMoment} selectedBlockId={props.selected} onUpdate={props.onUpdate} />
  return <section className="room"><label className="field">Reader present<input value={presence} onChange={event => setPresence(event.target.value)} /></label><button className="primary" onClick={() => props.onUpdate(doc => ({ ...doc, comments: [...doc.comments, { id: uid(), blockId: props.selected, text: `${presence} joined this passage.`, author: "Presence", createdAt: stamp() }], acts: [...doc.acts, act("togetherness", [props.selected], { proof: `${presence} joined the same document place.` })] }))}><UsersThree size={16}/>Start together</button><div className="discussion">{props.doc.comments.filter(item => item.blockId === props.selected).map(item => <p key={item.id}><strong>{item.author}</strong>{item.text}<small>{item.createdAt}</small></p>)}</div></section>
}

type ShareAttempt = "ready" | "listening" | "connected" | "mismatch"
type SpeechRecognizer = {
  start: () => void
  stop: () => void
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
}

function DeviceShareFlow({ selectedMoment, selectedBlockId, onUpdate, onConnected }: { selectedMoment?: Moment; selectedBlockId: string; onUpdate: (change: (doc: Doc) => Doc) => void; onConnected?: () => void }) {
  const [phase, setPhase] = useState<ShareAttempt>("ready")
  const [heard, setHeard] = useState<string[]>([])
  const recognition = useRef<SpeechRecognizer | null>(null)

  useEffect(() => () => recognition.current?.stop(), [])
  useEffect(() => {
    if (phase !== "connected" || !onConnected) return
    const timer = window.setTimeout(onConnected, 1400)
    return () => window.clearTimeout(timer)
  }, [phase, onConnected])

  const connect = () => {
    setPhase("connected")
    onUpdate(doc => ({
      ...doc,
      drops: [...doc.drops, { id: uid(), words, mode: "voice", momentId: selectedMoment?.id, createdAt: stamp() }],
      acts: [...doc.acts, act("device-drop", selectedMoment?.blockIds ?? [selectedBlockId], { momentId: selectedMoment?.id, proof: `Spoken pairing words confirmed: ${words.join(" - ")}.` })],
    }))
  }
  const listen = () => {
    setHeard([])
    setPhase("listening")
    const Recognition = (window as Window & { webkitSpeechRecognition?: new () => SpeechRecognizer }).webkitSpeechRecognition
    if (!Recognition) { window.setTimeout(() => setPhase("mismatch"), 500); return }
    const instance = new Recognition()
    recognition.current = instance
    instance.onresult = event => {
      const spoken = event.results[0]?.[0]?.transcript.toLowerCase().match(/[a-z]+/g) ?? []
      setHeard(spoken.slice(0, 3))
      if (words.every((word, index) => spoken[index] === word)) connect()
      else setPhase("mismatch")
    }
    instance.onerror = () => setPhase("mismatch")
    instance.onend = () => setPhase(current => current === "listening" ? "mismatch" : current)
    instance.start()
  }
  const visibleWords = phase === "connected" ? words : heard
  const isFailure = phase === "mismatch"
  return <section className={`room device-room device-share-flow ${phase}`} aria-live="polite">
    <button className="device-voice-target" onClick={listen} aria-label="Say the three words to share" disabled={phase === "listening" || phase === "connected"}>
      <p>{phase === "connected" ? "Connected." : isFailure ? "Didn't hear a match on the other device. Try saying the words again, a bit slower." : "Say three words to share."}</p>
      <div className="word-dots" aria-hidden="true">{words.map((word, index) => <span className={index < visibleWords.length || ((phase === "listening" || isFailure) && index === 0) ? "filled" : ""} key={word} />)}</div>
      <div className="pairing-words"><strong>{words.join(" - ")}</strong><small>{phase === "connected" ? "Taking you back to the document." : isFailure ? "Tap try again, then speak each word slowly." : phase === "listening" ? "Listening for the three words..." : "Say these into the other device."}</small></div>
    </button>
    {isFailure && <button className="share-retry" onClick={listen}>try again</button>}
  </section>
}

function ActLine({ act }: { act: ActRecord }) {
  return <div className={`act-line ${act.undone ? "undone" : ""}`}><small>{act.createdAt}</small><strong>{act.type}</strong><p>{act.intention}</p><em>{act.proof}</em></div>
}
function MomentLine({ moment }: { moment: Moment }) {
  return <div className="moment-line"><small>{moment.createdAt} - {moment.type}</small><p>{moment.excerpt}</p></div>
}

function Scanner({ onBack, onSave }: { onBack: () => void; onSave: (title: string, image: string, type: string) => void }) {
  const [image, setImage] = useState(""), [title, setTitle] = useState("Scanned document"), [type, setType] = useState("Aadhaar card"), [phase, setPhase] = useState<"capture" | "review">("capture")
  const video = useRef<HTMLVideoElement>(null), canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => () => { const stream = video.current?.srcObject as MediaStream | null; stream?.getTracks().forEach(track => track.stop()) }, [])
  const capture = (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { setImage(String(reader.result)); setPhase("review") }; reader.readAsDataURL(file); event.target.value = "" }
  const camera = async () => { try { const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); if (video.current) video.current.srcObject = stream } catch { } }
  const snap = () => { if (!video.current || !canvas.current) return; canvas.current.width = video.current.videoWidth; canvas.current.height = video.current.videoHeight; canvas.current.getContext("2d")?.drawImage(video.current, 0, 0); setImage(canvas.current.toDataURL("image/jpeg", .92)); setPhase("review") }
  const fields = type === "Research paper" ? ["title", "abstract", "sections", "references"] : type === "Tax filing" ? ["name", "assessment year", "PAN", "total income"] : type === "Lease agreement" ? ["tenant", "rent", "term", "signatures"] : type === "Passport" ? ["surname", "passport number", "date of birth", "expiry"] : ["name", "date of birth", "address", "document number"]
  return <main className="scanner-page">
    <header className="reader-top"><button className="back" onClick={onBack} aria-label="Back to vault"><ArrowLeft size={18}/></button><span>scan into jtty</span><div className="scan-step">{phase === "capture" ? "capture" : "review"}</div></header>
    <section className="scanner-shell">
      <div className="scanner-copy">
        <small>document intake</small>
        <h1>Bring a page into the vault.</h1>
        <p>The capture stays connected to the readable copy, print masking, and return trail.</p>
      </div>
      <div className="scanner-stage">
        <div className={`scan-preview ${image ? "has-image" : ""}`}>
          {image ? <img src={image} alt="Captured document" /> : <video ref={video} autoPlay playsInline />}
          <span className="scan-corner one" /><span className="scan-corner two" /><span className="scan-corner three" /><span className="scan-corner four" />
          <div className="scan-status"><span>{phase === "capture" ? "waiting for page" : "page captured"}</span><b>{type}</b></div>
        </div>
        <div className="scan-actions">
          {phase === "capture" ? <>
            <button className="primary" onClick={camera}><Camera size={16}/>camera</button>
            <button className="text-button" onClick={snap}>capture frame</button>
            <label className="import scan-upload"><FileArrowUp size={16}/>upload<input type="file" accept="image/*" capture="environment" onChange={capture}/></label>
          </> : <>
            <button className="text-button" onClick={() => { setImage(""); setPhase("capture") }}>retake</button>
            <button className="primary" onClick={() => onSave(title, image, type)}><Check size={16}/>save to vault</button>
          </>}
        </div>
      </div>
      <aside className="scan-review">
        <div className="scan-type-list" aria-label="Document type">
          {Object.keys(scannerText).map(item => <button key={item} className={type === item ? "active" : ""} onClick={() => setType(item)}>{item === "Aadhaar card" ? <IdentificationCard size={16}/> : <FileText size={16}/>}<span>{item}</span></button>)}
        </div>
        <label className="field">Document title<input value={title} onChange={e => setTitle(e.target.value)} /></label>
        <div className="scan-proof">
          <small>{phase === "capture" ? "ready to detect" : "detected"}</small>
          {fields.map((field, index) => <p key={field}><SealCheck size={15}/><span>{field}</span><em>{phase === "review" ? `${92 - index * 4}%` : "pending"}</em></p>)}
        </div>
        <button className="primary scan-save" disabled={!image} onClick={() => onSave(title, image, type)}>Save readable copy</button>
      </aside>
    </section>
    <canvas ref={canvas} hidden />
  </main>
}

function Studio({ onBack, onCreate }: { onBack: () => void; onCreate: (title: string, text: string, extra?: Partial<Doc>) => void }) {
  const [title, setTitle] = useState("Untitled note"), [text, setText] = useState(""), [mode, setMode] = useState<"type" | "handwriting" | "voice">("type"), [ink, setInk] = useState(false)
  const canvas = useRef<HTMLCanvasElement>(null)
  const draw = (event: PointerEvent<HTMLCanvasElement>) => { if (!ink || !canvas.current) return; const rect = canvas.current.getBoundingClientRect(), ctx = canvas.current.getContext("2d"); if (!ctx) return; ctx.fillStyle = "#1b201d"; ctx.beginPath(); ctx.arc(event.clientX - rect.left, event.clientY - rect.top, 2, 0, Math.PI * 2); ctx.fill() }
  const dictate = () => { const Recognition = (window as Window & { webkitSpeechRecognition?: new () => { continuous: boolean; onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; start: () => void } }).webkitSpeechRecognition; if (!Recognition) return; const recognition = new Recognition(); recognition.continuous = false; recognition.onresult = event => setText(current => `${current}${current ? " " : ""}${event.results[0][0].transcript}`); recognition.start() }
  return <Desk title="Write with proof" detail="Typed words, voice, and ink can stay attached to the same human-authored document." onBack={onBack}><div className="mode-switch"><button className={mode === "type" ? "active" : ""} onClick={() => setMode("type")}>Type</button><button className={mode === "handwriting" ? "active" : ""} onClick={() => setMode("handwriting")}>Handwrite</button><button className={mode === "voice" ? "active" : ""} onClick={() => { setMode("voice"); dictate() }}>Dictate</button></div><label className="field">Title<input value={title} onChange={e => setTitle(e.target.value)} /></label>{mode === "handwriting" ? <div><canvas className="ink-canvas" ref={canvas} width={720} height={300} onPointerDown={() => setInk(true)} onPointerUp={() => setInk(false)} onPointerLeave={() => setInk(false)} onPointerMove={draw}/><button className="text-button" onClick={() => canvas.current?.getContext("2d")?.clearRect(0, 0, canvas.current.width, canvas.current.height)}><Eraser size={15}/>Clear ink</button></div> : <label className="field">Document text<textarea value={text} onChange={e => setText(e.target.value)} placeholder={mode === "voice" ? "Speak to add text" : "Separate paragraphs with a blank line"} /></label>}<button className="primary" disabled={mode !== "handwriting" && !text.trim()} onClick={() => onCreate(title, text || "Handwritten note captured in jtty.", { sourceKind: mode === "handwriting" ? "handwriting" : "text", authorship: mode === "handwriting" ? "handwritten" : "typed" })}>Open in reader</button></Desk>
}

function PrintDesk({ doc, onBack }: { doc: Doc; onBack: () => void }) {
  const [copies, setCopies] = useState(1), [provider, setProvider] = useState("Printo, Koramangala"), [masked, setMasked] = useState(true), [sent, setSent] = useState(false), [format, setFormat] = useState<"reading" | "moments" | "quiet">("reading"), [paperSize, setPaperSize] = useState<"A4" | "A5">("A4")
  const moments = doc.moments.filter(item => !item.undone)
  const price = copies * (paperSize === "A5" ? 7 : masked ? 9 : 12)
  const mask = (text: string) => masked ? text.replace(/\b\d{4,}\b/g, match => "\u2022".repeat(Math.min(match.length, 8))) : text
  const preview = format === "moments" ? moments.map(moment => ({ id: moment.id, text: moment.excerpt, meta: `${moment.type.replace(/-/g, " ")} - ${moment.createdAt}` })) : doc.blocks.map((block, index) => ({ id: block.id, text: block.text, meta: format === "reading" ? doc.notes.find(note => note.blockId === block.id && !note.undone)?.text ?? (moments.some(moment => moment.blockIds.includes(block.id)) ? "kept moment" : "") : index === 0 ? "quiet reading copy" : "" }))
  return <main className="print-desk-page">
    <header className="reader-top"><button className="back" onClick={onBack} aria-label="Back to reader"><ArrowLeft size={18}/></button><span>PRINT COMPOSER</span><button className="print-now" onClick={() => window.print()} aria-label="Print now"><Printer size={17}/></button></header>
    <section className="print-composer">
      <aside className="print-controls">
        <p>paper edition</p>
        <h1>Compose the copy.</h1>
        <span>Choose what the paper remembers before it leaves your screen.</span>
        <div className="print-format" aria-label="Print format">
          <button className={format === "reading" ? "active" : ""} onClick={() => setFormat("reading")}><strong>Reading copy</strong><small>Document with kept moments and notes.</small></button>
          <button className={format === "moments" ? "active" : ""} onClick={() => setFormat("moments")}><strong>Moments folio</strong><small>Only the fragments you chose to keep.</small></button>
          <button className={format === "quiet" ? "active" : ""} onClick={() => setFormat("quiet")}><strong>Quiet copy</strong><small>Clean text without reading marks.</small></button>
        </div>
        <div className="print-options">
          <label className="field">Paper<select value={paperSize} onChange={event => setPaperSize(event.target.value as "A4" | "A5")}><option>A4</option><option>A5</option></select></label>
          <label className="field">Copies<input type="number" min="1" value={copies} onChange={event => setCopies(Math.max(1, Number(event.target.value)))} /></label>
          <label className="field print-provider">Provider<select value={provider} onChange={event => setProvider(event.target.value)}><option>Printo, Koramangala</option><option>Xerox Point, Indiranagar</option><option>Paperboat, HSR Layout</option></select></label>
        </div>
        <label className="check-field"><input type="checkbox" checked={masked} onChange={event => setMasked(event.target.checked)} /> Mask long identifying numbers</label>
        <div className="print-total"><span>Ready in 18 minutes</span><strong>Rs {price}</strong></div>
        <div className="print-actions"><button className="primary" onClick={() => setSent(true)}>{sent ? "Sent - pickup JTTY-482" : "Send to provider"}</button><button className="text-button" onClick={() => window.print()}><Printer size={15}/>Print here</button></div>
      </aside>
      <div className={`print-preview-stage ${paperSize.toLowerCase()}`}>
        <article className="print-sheet">
          <header><span>jtty.</span><small>{format === "reading" ? "reading copy" : format === "moments" ? "moments folio" : "quiet copy"}</small></header>
          <h2>{doc.title}</h2>
          <p className="print-byline">{doc.documentType ?? "document"} - {preview.length} {preview.length === 1 ? "entry" : "entries"}</p>
          <div className="print-preview-content">{preview.length ? preview.map((item, index) => <section key={item.id}><span>{String(index + 1).padStart(2, "0")}</span><div><p>{mask(item.text)}</p>{item.meta && <small>{item.meta}</small>}</div></section>) : <div className="print-preview-empty">No moments have been kept from this document yet.</div>}</div>
          <footer><span>{doc.authorship ?? "typed"} source</span><span>{paperSize}</span></footer>
        </article>
      </div>
    </section>
  </main>
}

function PublishDesk({ doc, onBack, onPublish }: { doc: Doc; onBack: () => void; onPublish: () => void }) {
  const [published, setPublished] = useState(doc.status === "published"), [license, setLicense] = useState("All rights reserved")
  return <Desk title="Publish with attribution" detail="A release carries its origin trail: authoring mode, publication time, and a stable reading copy." onBack={onBack}><div className="ticket"><SealCheck size={22}/><strong>{doc.title}</strong><span>{doc.authorship ?? "typed"} authorship - {doc.moments.length} saved moments</span></div><label className="field">Release terms<select value={license} onChange={event => setLicense(event.target.value)}><option>All rights reserved</option><option>Share with attribution</option><option>Private link</option></select></label><div className="credential"><Check size={17}/> Authorship record attached</div><button className="primary" disabled={published} onClick={() => { onPublish(); setPublished(true) }}>{published ? "Published" : "Publish document"}</button></Desk>
}

function ShareDesk({ doc, onBack, onUpdate }: { doc: Doc; onBack: () => void; onUpdate: (change: (doc: Doc) => Doc) => void }) {
  const [message, setMessage] = useState(""), [comment, setComment] = useState(""), [selected, setSelected] = useState(doc.currentBlockId)
  const comments = doc.comments.filter(item => item.blockId === selected)
  const share = async () => { const payload = { title: doc.title, text: `Reading ${doc.title} in jtty.` }; if (navigator.share) await navigator.share(payload); else { await navigator.clipboard?.writeText(payload.text); setMessage("Link text copied") } }
  const add = () => { if (!comment.trim()) return; onUpdate(value => ({ ...value, comments: [...value.comments, { id: uid(), blockId: selected, text: comment.trim(), author: "You", createdAt: stamp() }] })); setComment("") }
  return <Desk title="Discuss the document" detail="Start with the passage, not a detached feed. Private notes stay private." onBack={onBack}><label className="field">Passage<select value={selected} onChange={event => setSelected(event.target.value)}>{doc.blocks.map((block, index) => <option key={block.id} value={block.id}>Passage {index + 1}</option>)}</select></label><div className="discussion">{comments.length ? comments.map(item => <p key={item.id}><strong>{item.author}</strong>{item.text}<small>{item.createdAt}</small></p>) : <p>No discussion on this passage yet.</p>}</div><label className="field">Add to discussion<textarea value={comment} onChange={event => setComment(event.target.value)} placeholder="Respond to this passage" /></label><button className="primary" onClick={add}>Post response</button><button className="text-button" onClick={share}><UsersThree size={16}/>Share reading link</button>{message && <p className="status-message">{message}</p>}</Desk>
}

function Desk({ title, detail, onBack, children }: { title: string; detail: string; onBack: () => void; children: ReactNode }) {
  return <main className="desk-page"><header className="reader-top"><button className="back" onClick={onBack}><ArrowLeft size={18}/></button><span>JTTY WORKSPACE</span><div /></header><section className="desk"><p>DOCUMENT WORKFLOW</p><h1>{title}</h1><span>{detail}</span><div className="desk-content">{children}</div></section></main>
}
