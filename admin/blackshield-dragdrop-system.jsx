import { useMemo, useState } from "react";

const DESTINATIONS = { passagesPDF: "downloads/passages/", curriculumPDF: "downloads/curriculum/", booksPDF: "downloads/books/", coverImages: "assets/images/covers/", passagesImages: "assets/images/passages/", branding: "assets/images/branding/", playroom: "interactives/playroom/", games: "interactives/games/", beatbright: "apps/beatbright/" };

const CATEGORY_LABELS = { passagesPDF: "PASSAGES PDFs", curriculumPDF: "Curriculum PDFs", booksPDF: "Book PDFs", coverImages: "Book Covers", passagesImages: "PASSAGES Images", branding: "Branding Images", playroom: "Playroom Tools", games: "Interactive Games", beatbright: "BeatBright Files" };

const EXPECTED_PDFS = { passagesPDF: Array.from({ length: 12 }, (_, i) => passages-${String(i + 1).padStart(2, "0")}.pdf), curriculumPDF: [ "foundational-literacy.pdf", "personal-discipline.pdf", "strategic-thinking.pdf", "economic-literacy.pdf", "financial-literacy.pdf", "leadership-development.pdf", "conflict-resolution.pdf", "community-building.pdf", "life-strategy.pdf" ], booksPDF: [ "diamond-in-the-rough.pdf", "book-01.pdf", "book-02.pdf", "book-03.pdf" ] };

function cleanFileName(name) { return name .toLowerCase() .replace(/\s+/g, "-") .replace(/[^a-z0-9-.]/g, ""); }

function prettySize(bytes) { if (bytes < 1024) return ${bytes} B; if (bytes < 1024 * 1024) return ${Math.round(bytes / 1024)} KB; return ${(bytes / (1024 * 1024)).toFixed(2)} MB; }

async function checkUrl(url) { try { const response = await fetch(url, { method: "HEAD", cache: "no-store" }); if (response.ok) return "live"; return "missing"; } catch { return "missing"; } }

export default function BlackshieldAdminPanel() { const [category, setCategory] = useState("passagesPDF"); const [files, setFiles] = useState([]); const [dragging, setDragging] = useState(false); const [copied, setCopied] = useState(false); const [baseUrl, setBaseUrl] = useState("https://blackshieldinstitute.org"); const [scanResults, setScanResults] = useState([]); const [scanLoading, setScanLoading] = useState(false); const [filterText, setFilterText] = useState("");

const destination = useMemo(() => DESTINATIONS[category], [category]); const expectedPdfList = useMemo(() => EXPECTED_PDFS[category] || [], [category]);

function processFiles(fileList) { const processed = Array.from(fileList).map((file) => { const clean = cleanFileName(file.name); return { original: file.name, clean, extension: clean.includes(".") ? clean.split(".").pop() : "unknown", size: prettySize(file.size), path: destination + clean }; }); setFiles(processed); }

function handleFileInput(e) { processFiles(e.target.files); }

function handleDrop(e) { e.preventDefault(); setDragging(false); if (e.dataTransfer.files) processFiles(e.dataTransfer.files); }

function handleDragOver(e) { e.preventDefault(); setDragging(true); }

function handleDragLeave() { setDragging(false); }

function copyPath(path) { navigator.clipboard.writeText(path); setCopied(true); setTimeout(() => setCopied(false), 1500); }

async function runPdfScan() { if (!expectedPdfList.length) return; setScanLoading(true); setScanResults([]);

const normalizedBase = baseUrl.replace(/\/$/, "");
const results = [];

for (const fileName of expectedPdfList) {
  const relativePath = `${destination}${fileName}`;
  const fullUrl = `${normalizedBase}/${relativePath}`;
  const status = await checkUrl(fullUrl);
  results.push({ fileName, relativePath, fullUrl, status });
}

setScanResults(results);
setScanLoading(false);

}

const filteredFiles = files.filter((file) => { const hay = ${file.original} ${file.clean} ${file.path}.toLowerCase(); return hay.includes(filterText.toLowerCase()); });

return ( <div className="min-h-screen bg-black text-white p-8"> <div className="max-w-6xl mx-auto space-y-8"> <div> <h1 className="text-4xl font-bold text-yellow-400">Blackshield Drag-Drop Upload System</h1> <p className="text-gray-400 mt-2"> Drag files into the drop zone, generate exact GitHub upload paths, validate names, and run live PDF checks against your deployed domain. </p> </div>

<div className="grid gap-6 lg:grid-cols-3">
      <div className="bg-gray-900 p-6 rounded-xl lg:col-span-2">
        <label className="block mb-2 font-semibold">Destination Folder</label>
        <select
          className="w-full p-3 rounded bg-gray-800"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setFiles([]);
            setScanResults([]);
          }}
        >
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <p className="text-sm text-gray-400 mt-2">
          Files will upload to: <strong className="text-yellow-400">{destination}</strong>
        </p>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl flex flex-col justify-between">
        <div>
          <p className="font-semibold mb-2">Quick Copy</p>
          <p className="text-sm text-gray-400">Copy the active destination folder for GitHub uploads.</p>
        </div>
        <button
          onClick={() => copyPath(destination)}
          className="mt-4 bg-yellow-500 text-black px-4 py-3 rounded font-semibold"
        >
          Copy Folder Path
        </button>
      </div>
    </div>

    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`border-2 border-dashed rounded-xl p-12 text-center transition ${dragging ? "border-yellow-400 bg-gray-900" : "border-gray-700"}`}
    >
      <p className="text-lg font-semibold">Drag & Drop Files Here</p>
      <p className="text-gray-400 mt-2">or click below</p>
      <input type="file" multiple onChange={handleFileInput} className="mt-6" />
    </div>

    <div className="bg-gray-900 p-6 rounded-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <h2 className="text-2xl font-semibold">Prepared Upload Queue</h2>
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Filter file list"
          className="w-full lg:w-80 p-3 rounded bg-gray-800 border border-gray-700"
        />
      </div>

      {filteredFiles.length === 0 ? (
        <div className="text-gray-400">No files prepared yet.</div>
      ) : (
        <div className="space-y-4">
          {filteredFiles.map((file, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded-lg flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-semibold text-yellow-400">{file.clean}</p>
                <p className="text-sm text-gray-400">Original: {file.original}</p>
                <p className="text-sm text-gray-500">{file.size} • .{file.extension}</p>
                <p className="text-xs text-gray-500 break-all mt-1">{file.path}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => copyPath(file.path)}
                  className="bg-yellow-500 text-black px-4 py-2 rounded font-semibold"
                >
                  Copy Path
                </button>
                <button
                  onClick={() => copyPath(file.clean)}
                  className="bg-gray-700 px-4 py-2 rounded font-semibold"
                >
                  Copy Name
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {copied && <p className="text-green-400 text-sm mt-4">Copied to clipboard</p>}
    </div>

    <div className="bg-gray-900 p-6 rounded-xl space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Auto PDF Detection System</h2>
        <p className="text-sm text-gray-400 mt-2">
          Scan expected PDFs against your live domain after uploading and committing files.
        </p>
      </div>

      <div>
        <label className="block mb-2 font-semibold">Live Site Base URL</label>
        <input
          type="text"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          placeholder="https://blackshieldinstitute.org"
        />
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <button
          onClick={runPdfScan}
          disabled={scanLoading || !expectedPdfList.length}
          className="bg-yellow-500 text-black px-5 py-3 rounded font-semibold disabled:opacity-50"
        >
          {scanLoading ? "Scanning..." : "Run PDF Scan"}
        </button>

        {expectedPdfList.length === 0 && (
          <span className="text-sm text-gray-400">
            Select a PDF category to scan expected PDF files.
          </span>
        )}
      </div>

      {scanResults.length > 0 && (
        <div className="space-y-3 pt-2">
          {scanResults.map((item) => (
            <div key={item.relativePath} className="bg-gray-800 p-4 rounded-lg flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-semibold text-yellow-400">{item.fileName}</p>
                <p className="text-xs text-gray-400 break-all">{item.relativePath}</p>
                <p className="text-xs text-gray-500 break-all">{item.fullUrl}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded text-sm font-semibold ${item.status === "live" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                  {item.status === "live" ? "LIVE" : "MISSING"}
                </span>
                <button
                  onClick={() => copyPath(item.fullUrl)}
                  className="bg-slate-700 px-3 py-2 rounded text-sm"
                >
                  Copy URL
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    <div className="bg-gray-900 p-6 rounded-xl text-sm text-gray-400 leading-7">
      <strong className="text-white">Workflow</strong>
      <br />1. Select category
      <br />2. Drag file into drop zone
      <br />3. Copy generated path
      <br />4. Upload into that exact folder in GitHub
      <br />5. Commit changes
      <br />6. Run PDF scan
      <br />7. Fix anything marked MISSING
    </div>
  </div>
</div>

); }
