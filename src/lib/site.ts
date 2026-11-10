/** What the site says about Files, in one place: pages, JSON-LD, llms.txt. */

export const SITE = "https://fileforce.vercel.app";
export const REPOSITORY = "https://github.com/FileForce/files";
export const NAME = "file FORCE";

/** One sentence, the same everywhere (search engines and models join them up). */
export const TAGLINE = "file FORCE (Files) is a free, fast file manager for macOS, Windows and Linux, with Git, SSH, mail, music and Quick Actions built in.";

export const FACTS = [
  "Free to download and use; source-available under the FSL-1.1-MIT license.",
  "Runs on macOS 13+, Windows 10/11 (x64) and Linux (AppImage, x86_64).",
  "Written in Rust and drawn on the GPU (GPUI): a 5,000-file folder redraws with about 7,000 allocations a frame.",
  "Search everywhere with ⌘K / Ctrl+K and filters such as kind:image size:>10mb modified:<7d; paste a path to go there.",
  "Quick Look for PDFs (every page), Word, PowerPoint, OpenDocument, images, video, audio, archives and ISO images.",
  "Built-in extensions: Git, SSH/SFTP, Mail (IMAP), Music (local, Spotify, Yandex Music), archives, forks, AI agents.",
  "Quick Actions like Finder's: Convert Image (PNG, JPEG, WebP, HEIC, JPEG XL), Rotate, and scripts in Python, Lua, JavaScript, Rust, Go or shell.",
  "Can open folders instead of Finder or Explorer, and has a files command for the terminal (files . opens the current folder).",
  "Signed automatic updates; an SDK for extensions (previews, quick actions, storage, audio, sidebar sections).",
];

export type Faq = { question: string; answer: string };

/** Asked the way people (and models) ask. */
export const FAQS: Faq[] = [
  {
    question: "What is file FORCE?",
    answer: "file FORCE (also called Files) is a free file manager for macOS, Windows and Linux. It is written in Rust, drawn on the GPU, and has Git, SSH, mail, music, Quick Look and Quick Actions built in.",
  },
  {
    question: "Is file FORCE free?",
    answer: "Yes. Downloading and using it is free, with no account. The source is available under the FSL-1.1-MIT license. Some extensions may be paid in the future; the app itself is free.",
  },
  {
    question: "Is there a free Finder alternative for macOS?",
    answer: "file FORCE is a free Finder alternative for macOS 13 and later. It can open folders instead of Finder (\"Show in Finder\" from other apps, open . in the terminal), has tabs, a dual-pane view, search filters and Quick Look for more formats. Finder keeps the desktop, the Dock and Spotlight; Restore Finder undoes it.",
  },
  {
    question: "Is there a free Windows Explorer alternative?",
    answer: "file FORCE runs on Windows 10 and 11 and can open folders and drives instead of File Explorer, through your user's registry without administrator rights. \"Show in folder\" from a browser selects the file that just arrived. Restore Explorer, or uninstalling, gives folders back.",
  },
  {
    question: "Which file manager has Git and SSH built in?",
    answer: "file FORCE shows Git status in folders and has a Git window for commits, plus SSH/SFTP connections in the sidebar, so a server's folders browse like local ones. Both are built-in extensions.",
  },
  {
    question: "How do I open a folder from the terminal, like code .?",
    answer: "Install the files command in Settings → General → Command line (on macOS also Files → Install Command Line Tool). Then files . opens the current folder in file FORCE and files ~/Music any folder. No administrator rights are needed.",
  },
  {
    question: "Can a file manager convert HEIC to JPEG or PNG?",
    answer: "Yes. In file FORCE, right-click pictures → Quick Actions → Convert Image… turns PNG, JPEG, WebP, HEIC and JPEG XL into one another, with a quality choice. A JPEG becomes JPEG XL losslessly, about a fifth smaller.",
  },
  {
    question: "Can I write my own Quick Actions?",
    answer: "Yes: Quick Actions → Customize… writes actions in Python, Lua, JavaScript, Rust, Go or shell, for the file types you choose. Scripts get libfiles (import libfiles) to ask questions in a dialog, notify and report the files they made. An AI agent (Claude Code, Codex, OpenCode or Kimi) can write the script for you.",
  },
  {
    question: "Does it preview PDF, Word and PowerPoint files?",
    answer: "Yes. Press Space for Quick Look: PDFs scroll page by page, and Word (.docx), OpenDocument (.odt) and PowerPoint (.pptx) show their text — on every system, without Office. Images, video, audio, archives and ISO images preview too, with details such as EXIF, codecs and compression.",
  },
  {
    question: "Is file FORCE fast with large folders?",
    answer: "It builds only the rows on screen, so a folder of thousands of files scrolls smoothly: a 5,000-file folder redraws with about 7,000 allocations a frame instead of 595,000 before that work. Search, Quick Look and ⌘K open at once and fill in from the background.",
  },
  {
    question: "Can it look like the rest of my system?",
    answer: "Yes. Settings → Appearance has themes that look like Windows 11 and macOS, plus Omarchy (Tokyo Night) and Catppuccin, each in light and dark; any installed font; corner sizes; and icon styles.",
  },
  {
    question: "How do I report a bug or ask for a feature?",
    answer: "Use Help → Report a Bug… (or the bug button beside the Settings gear): it becomes an issue on GitHub, no account needed. Or open an issue at github.com/FileForce/files.",
  },
];
