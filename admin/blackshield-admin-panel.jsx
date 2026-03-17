import { useMemo, useState } from "react";

const DESTINATIONS = { passagesPDF: "downloads/passages/", curriculumPDF: "downloads/curriculum/", booksPDF: "downloads/books/", coverImages: "assets/images/covers/", passagesImages: "assets/images/passages/", branding: "assets/images/branding/", playroom: "interactives/playroom/", games: "interactives/games/", beatbright: "apps/beatbright/" };

const CATEGORY_LABELS = { passagesPDF: "PASSAGES PDFs", curriculumPDF: "Curriculum PDFs", booksPDF: "Book PDFs", coverImages: "Book Covers", passagesImages: "PASSAGES Images", branding: "Branding Images", playroom: "Playroom Tools", games: "Interactive Games", beatbright: "BeatBright Files" };

function cleanFileName(name) { return name .toLowerCase() .replace(/\s+/g, "-") .replace(/[^a-z0-9-.]/g, ""); }

function prettySize(bytes) { if (bytes < 1024) return ${bytes} B; if (bytes < 1024 * 1024) return ${Math.round(bytes / 1024)} KB; return ${(bytes / (1024 * 1024)).toFixed(2)} MB; }

export default function BlackshieldAdminPanel() {

const [category, setCategory] = useState("passagesPDF"); const [files, setFiles] = useState([]); const [dragging, setDragging] = useState(false); const [copied, setCopied] = useState(false);

const destination = useMemo(() => DESTINATIONS[category], [category]);

function processFiles(fileList) { const processed = Array.from(fileList).map((file) => { const clean = cleanFileName(file.name);

return {
    original: file.name,
    clean,
    size: prettySize(file.size),
    path: destination + clean
  };
});

setFiles(processed);

}

function handleFileInput(e) { processFiles(e.target.files); }

function handleDrop(e) { e.preventDefault(); setDragging(false);

if (e.dataTransfer.files) {
  processFiles(e.dataTransfer.files);
}

}

function handleDragOver(e) { e.preventDefault(); setDragging(true); }

function handleDragLeave() { setDragging(false); }

function copyPath(path) { navigator.clipboard.writeText(path); setCopied(true);

setTimeout(() => setCopied(false), 1500);

}

return (

<div className="min-h-screen bg-black text-white p-8">

  <div className="max-w-6xl mx-auto space-y-8">

    <div>
      <h1 className="text-4xl font-bold text-yellow-400">Blackshield Upload Command Center</h1>
      <p className="text-gray-400 mt-2">
        Drag files here to automatically generate correct GitHub upload paths and prevent 404 errors.
      </p>
    </div>


    <div className="bg-gray-900 p-6 rounded-xl">

      <label className="block mb-2 font-semibold">Destination Folder</label>

      <select
        className="w-full p-3 rounded bg-gray-800"
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

      <p className="text-sm text-gray-400 mt-2">
        Files will upload to: <strong className="text-yellow-400">{destination}</strong>
      </p>

    </div>


    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`border-2 border-dashed rounded-xl p-12 text-center transition ${
        dragging ? "border-yellow-400 bg-gray-900" : "border-gray-700"
      }`}
    >

      <p className="text-lg font-semibold">Drag & Drop Files Here</p>
      <p className="text-gray-400 mt-2">or click below</p>

      <input
        type="file"
        multiple
        onChange={handleFileInput}
        className="mt-6"
      />

    </div>


    {files.length > 0 && (

      <div className="bg-gray-900 p-6 rounded-xl">

        <h2 className="text-2xl font-semibold mb-6">Prepared Upload Paths</h2>

        <div className="space-y-4">

          {files.map((file, i) => (

            <div
              key={i}
              className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
            >

              <div>
                <p className="font-semibold text-yellow-400">{file.clean}</p>
                <p className="text-sm text-gray-400">{file.size}</p>
                <p className="text-xs text-gray-500">{file.path}</p>
              </div>

              <button
                onClick={() => copyPath(file.path)}
                className="bg-yellow-500 text-black px-4 py-2 rounded font-semibold"
              >
                Copy Path
              </button>

            </div>

          ))}

        </div>

        {copied && (
          <p className="text-green-400 text-sm mt-4">Path copied to clipboard</p>
        )}

      </div>

    )}


    <div className="text-sm text-gray-500">
      Workflow:
      <br/>1. Select category
      <br/>2. Drag file into drop zone
      <br/>3. Copy generated path
      <br/>4. Upload file into that folder in GitHub
      <br/>5. Commit changes
      <br/>6. Open direct file URL to verify
    </div>

  </div>

</div>

); }
