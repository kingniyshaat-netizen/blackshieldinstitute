import { useMemo, useState } from "react";

const DESTINATIONS = { passagesPDF: "downloads/passages/", curriculumPDF: "downloads/curriculum/", booksPDF: "downloads/books/", coverImages: "assets/images/covers/", passagesImages: "assets/images/passages/", branding: "assets/images/branding/", playroom: "interactives/playroom/", games: "interactives/games/", beatbright: "apps/beatbright/" };

const CATEGORY_LABELS = { passagesPDF: "PASSAGES PDFs", curriculumPDF: "Curriculum PDFs", booksPDF: "Book PDFs", coverImages: "Book Covers", passagesImages: "PASSAGES Images", branding: "Branding Images", playroom: "Playroom Tools", games: "Interactive Games", beatbright: "BeatBright Files" };

const QUICK_LINKS = [ { label: "Home", path: "index.html" }, { label: "Curriculum Hub", path: "curriculum.html" }, { label: "PASSAGES Series", path: "passages-series.html" }, { label: "Digital Playroom", path: "digital-playroom.html" }, { label: "Contact", path: "contact.html" } ];

const CHECKLISTS = { passagesPDF: [ "Use lowercase filenames only", "Use hyphens instead of spaces", "Upload into downloads/passages/", "Verify PDF opens directly after upload" ], curriculumPDF: [ "Match curriculum page title to file name", "Upload into downloads/curriculum/", "Update curriculum page button href after upload", "Test direct PDF URL after commit" ], booksPDF: [ "Use direct-sale or general book PDFs only", "Upload into downloads/books/", "Confirm book cover path separately", "Check file name against button href" ], coverImages: [ "Use .png or .jpg only", "Upload into assets/images/covers/", "Keep names lowercase", "Test image URL after upload" ], passagesImages: [ "Use passages-01.png style names", "Upload into assets/images/passages/", "Keep numbering consistent with PDF", "Refresh passages page after commit" ], branding: [ "Only official Blackshield branding files", "Upload into assets/images/branding/", "Do not overwrite shield unless intentional", "Check homepage visibility" ], playroom: [ "Use single HTML tools when possible", "Upload into interactives/playroom/", "Add matching entry to manifest if needed", "Test launcher path after upload" ], games: [ "Use clear game file names", "Upload into interactives/games/", "Verify relative asset paths inside game", "Open file directly before linking" ], beatbright: [ "Do not overwrite global site files", "Keep BeatBright files inside apps/beatbright/", "Preserve separate CSS/JS when needed", "Test app independently before linking" ] };

function cleanFileName(name) { return name .toLowerCase() .replace(/\s+/g, "-") .replace(/[^a-z0-9-.]/g, ""); }

function prettySize(bytes) { if (bytes < 1024) return ${bytes} B; if (bytes < 1024 * 1024) return ${Math.round(bytes / 1024)} KB; return ${(bytes / (1024 * 1024)).toFixed(2)} MB; }

export default function BlackshieldAdminPanel() { const [category, setCategory] = useState("passagesPDF"); const [files, setFiles] = useState([]); const [copied, setCopied] = useState("");

function handleFiles(e) { const selected = Array.from(e.target.files || []); const validated = selected.map((file) => { const clean = cleanFileName(file.name); return { original: file.name, clean, size: prettySize(file.size), path: DESTINATIONS[category] + clean, category }; }); setFiles(validated); }

async function copyText(text) { try { await navigator.clipboard.writeText(text); setCopied(text); setTimeout(() => setCopied(""), 1800); } catch { alert(Copy failed. Manual copy: ${text}); } }

const currentChecklist = useMemo(() => CHECKLISTS[category] || [], [category]); const currentDestination = DESTINATIONS[category];

return ( <div className="min-h-screen bg-slate-950 text-white p-6 md:p-8"> <div className="max-w-7xl mx-auto grid gap-6"> <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl"> <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"> <div> <div className="text-xs tracking-[0.25em] text-yellow-400 font-semibold mb-2">BLACKSHIELD CONTROL SYSTEM</div> <h1 className="text-3xl md:text-4xl font-bold">Blackshield Admin Panel</h1> <p className="text-slate-400 mt-2 max-w-3xl"> Use this control panel to prepare PDFs, images, curriculum assets, playroom tools, and BeatBright files before placing them into GitHub. It validates naming, generates exact destination paths, and reduces pathing mistakes that cause 404s. </p> </div> <div className="grid grid-cols-2 gap-3 text-sm"> <div className="rounded-2xl bg-slate-800 p-4 border border-slate-700"> <div className="text-slate-400">Primary destination</div> <div className="font-semibold mt-1">{CATEGORY_LABELS[category]}</div> </div> <div className="rounded-2xl bg-slate-800 p-4 border border-slate-700"> <div className="text-slate-400">Prepared files</div> <div className="font-semibold mt-1">{files.length}</div> </div> </div> </div> </div>

<div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="grid gap-6">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-4">File Transfer Console</h2>
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <label className="block text-sm font-medium mb-2">Select Destination</label>
              <select
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setFiles([]);
                }}
              >
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <p className="text-sm text-slate-400 mt-2">
                Files prepared here will target: <span className="text-yellow-400 font-semibold">{currentDestination}</span>
              </p>
            </div>
            <button
              onClick={() => copyText(currentDestination)}
              className="rounded-xl bg-yellow-500 text-black font-semibold px-5 py-3 hover:bg-yellow-400 transition"
            >
              Copy Folder Path
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-6">
            <label className="block text-sm font-medium mb-3">Select Files</label>
            <input
              type="file"
              multiple
              onChange={handleFiles}
              className="block w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-4 text-sm"
            />
            <p className="text-xs text-slate-500 mt-3">
              Filenames are automatically converted to lowercase and hyphen format before paths are generated.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-semibold">Prepared Upload Paths</h2>
            {copied && <span className="text-xs text-emerald-400">Copied</span>}
          </div>

          {files.length === 0 ? (
            <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-6 text-slate-400">
              No files prepared yet. Choose a destination, then select files to generate exact GitHub paths.
            </div>
          ) : (
            <div className="space-y-4">
              {files.map((file, i) => (
                <div key={`${file.clean}-${i}`} className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="font-semibold break-all">{file.clean}</div>
                    <div className="text-sm text-slate-400">Original: {file.original}</div>
                    <div className="text-sm text-slate-500">{file.size}</div>
                    <div className="text-xs text-yellow-400 mt-2 break-all">{file.path}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => copyText(file.path)}
                      className="rounded-xl bg-yellow-500 text-black font-semibold px-4 py-2 hover:bg-yellow-400 transition"
                    >
                      Copy Full Path
                    </button>
                    <button
                      onClick={() => copyText(file.clean)}
                      className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 hover:bg-slate-700 transition"
                    >
                      Copy File Name
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-6">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Quick Site Links</h2>
          <div className="space-y-3">
            {QUICK_LINKS.map((link) => (
              <div key={link.path} className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4 flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{link.label}</div>
                  <div className="text-xs text-slate-400">{link.path}</div>
                </div>
                <button
                  onClick={() => copyText(link.path)}
                  className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm hover:bg-slate-700 transition"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Upload Checklist</h2>
          <ol className="space-y-3 text-sm text-slate-300">
            {currentChecklist.map((item, idx) => (
              <li key={item} className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4 flex gap-3">
                <span className="text-yellow-400 font-semibold">{idx + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-4">GitHub Workflow</h2>
          <div className="text-sm text-slate-300 space-y-3">
            <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4">1. Select destination category in this panel.</div>
            <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4">2. Choose file and copy the generated destination path.</div>
            <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4">3. Open GitHub and upload into that exact folder.</div>
            <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4">4. Commit changes and test the direct file URL.</div>
          </div>
        </section>
      </div>
    </div>
  </div>
</div>

); }
