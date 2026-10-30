import React, { useRef, useState, useEffect } from "react";
import {
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ListTodo,
  Indent,
  Outdent,
  Link as LinkIcon,
  Unlink,
  Highlighter,
  Minus,
  Plus,
  ChevronDown,
  Check,
  RemoveFormatting,
  Rows,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GoogleDocsEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const FONT_FAMILIES = [
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Roboto", value: "Roboto, sans-serif" },
  { name: "Plus Jakarta Sans", value: "'Plus Jakarta Sans', sans-serif" },
  { name: "Times New Roman", value: "'Times New Roman', serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Courier New", value: "'Courier New', monospace" },
  { name: "Verdana", value: "Verdana, sans-serif" },
  { name: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
  { name: "Inter", value: "Inter, sans-serif" },
  { name: "Poppins", value: "Poppins, sans-serif" },
  { name: "Comic Sans MS", value: "'Comic Sans MS', cursive" },
];

const PRESET_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72, 90];

const HEADINGS = [
  { label: "Normal text", tag: "p", style: "text-sm font-normal" },
  { label: "Title / Heading 1", tag: "h1", style: "text-xl font-bold" },
  { label: "Heading 2", tag: "h2", style: "text-lg font-bold" },
  { label: "Heading 3", tag: "h3", style: "text-base font-semibold" },
  { label: "Heading 4", tag: "h4", style: "text-sm font-semibold" },
  { label: "Heading 5", tag: "h5", style: "text-xs font-semibold" },
];

const TEXT_COLORS = [
  "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#ffffff",
  "#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff",
  "#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc",
  "#dd7e6b", "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#a4c2f4", "#9fc5e8", "#b4a7d6", "#d5a6bd",
  "#cc4125", "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6d9eeb", "#6fa8dc", "#8e7cc3", "#c27ba0",
  "#a61c1c", "#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3c78d8", "#3d85c6", "#674ea7", "#a64d79",
  "#5b0f00", "#660000", "#783f04", "#7f6000", "#274e13", "#0c343d", "#1155cc", "#073763", "#20124d", "#4c1130"
];

const HIGHLIGHT_COLORS = [
  "transparent", "#ffff00", "#00ff00", "#00ffff", "#ff00ff", "#0000ff", "#ff0000",
  "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc", "#fce5cd",
  "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd", "#f9cb9c",
  "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79", "#e69138"
];

export function GoogleDocsEditor({
  value,
  onChange,
  placeholder = "Start writing your detailed project breakdown, system architecture, database design, modules, and viva questions...",
  minHeight = "480px",
}: GoogleDocsEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  const [currentFont, setCurrentFont] = useState("Arial");
  const [currentHeading, setCurrentHeading] = useState("Normal text");
  const [fontSize, setFontSize] = useState<number>(14);
  const [textColor, setTextColor] = useState("#000000");
  const [highlightColor, setHighlightColor] = useState("transparent");
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    align: "left",
  });

  // Dropdown states
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [showTextColorMenu, setShowTextColorMenu] = useState(false);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [showSpacingMenu, setShowSpacingMenu] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isEmpty, setIsEmpty] = useState(!value || value.trim() === "");

  // Capture current selection in editor before dropdown opens
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current && editorRef.current.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  // Restore saved selection
  const restoreSelection = () => {
    if (!savedRangeRef.current) return;
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  };

  // Sync initial content once
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      if (!editorRef.current.innerHTML || value) {
        editorRef.current.innerHTML = value || "";
        updateStats();
      }
    } else {
      updateStats();
    }
  }, [value]);

  const triggerChange = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      updateStats();
    }
  };

  const updateStats = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || "";
    setCharCount(text.length);
    const words = text.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
    const textContent = text.replace(/[\s\r\n]+/g, "").trim();
    setIsEmpty(textContent.length === 0);
  };

  // Close all popover menus
  const closeAllMenus = () => {
    setShowFontMenu(false);
    setShowHeadingMenu(false);
    setShowSizeMenu(false);
    setShowTextColorMenu(false);
    setShowHighlightMenu(false);
    setShowSpacingMenu(false);
  };

  // Safe command runner that prevents blur
  const execCmd = (cmd: string, val: string | undefined = undefined) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    restoreSelection();
    document.execCommand(cmd, false, val);
    saveSelection();
    triggerChange();
    updateToolbarState();
  };

  // Update active state of buttons and detect active heading/font based on cursor position
  const updateToolbarState = () => {
    try {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;

      if (editorRef.current && editorRef.current.contains(sel.anchorNode)) {
        savedRangeRef.current = sel.getRangeAt(0).cloneRange();
      }

      setActiveFormats({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        strike: document.queryCommandState("strikethrough"),
        align: document.queryCommandState("justifyCenter")
          ? "center"
          : document.queryCommandState("justifyRight")
          ? "right"
          : document.queryCommandState("justifyFull")
          ? "justify"
          : "left",
      });

      // Detect active heading tag at cursor position
      let node: Node | null = sel.anchorNode;
      let detectedHeading = "Normal text";
      let detectedSize = fontSize;

      while (node && node !== editorRef.current) {
        if (node instanceof HTMLElement) {
          const tag = node.tagName.toLowerCase();
          if (tag === "h1") detectedHeading = "Title / Heading 1";
          else if (tag === "h2") detectedHeading = "Heading 2";
          else if (tag === "h3") detectedHeading = "Heading 3";
          else if (tag === "h4") detectedHeading = "Heading 4";
          else if (tag === "h5") detectedHeading = "Heading 5";
          else if (tag === "p") detectedHeading = "Normal text";

          if (node.style.fontSize) {
            const parsed = parseInt(node.style.fontSize);
            if (!isNaN(parsed)) detectedSize = parsed;
          }
        }
        node = node.parentNode;
      }

      setCurrentHeading(detectedHeading);
      if (detectedSize && detectedSize !== fontSize) {
        setFontSize(detectedSize);
      }
    } catch (e) {
      // ignore
    }
  };

  // Apply custom font size from 1 to 90
  const applyFontSize = (sizeVal: number) => {
    const clamped = Math.max(1, Math.min(90, Math.round(sizeVal)));
    setFontSize(clamped);
    setShowSizeMenu(false);

    if (!editorRef.current) return;
    editorRef.current.focus();
    restoreSelection();

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);

    if (range.collapsed) {
      // Create span with cursor inside
      const span = document.createElement("span");
      span.style.fontSize = `${clamped}px`;
      span.style.lineHeight = "1.35";
      span.innerHTML = "&#8203;";
      range.insertNode(span);
      range.setStart(span.firstChild!, 1);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      savedRangeRef.current = range.cloneRange();
    } else {
      const fragment = range.extractContents();
      const span = document.createElement("span");
      span.style.fontSize = `${clamped}px`;
      span.style.lineHeight = "1.35";
      span.appendChild(fragment);
      range.insertNode(span);

      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      sel.removeAllRanges();
      sel.addRange(newRange);
      savedRangeRef.current = newRange.cloneRange();
    }

    triggerChange();
    updateToolbarState();
  };

  // Apply Font Family
  const applyFontFamily = (familyValue: string, fontName: string) => {
    setCurrentFont(fontName);
    setShowFontMenu(false);
    if (!editorRef.current) return;
    editorRef.current.focus();
    restoreSelection();

    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const fragment = range.extractContents();
      const span = document.createElement("span");
      span.style.fontFamily = familyValue;
      span.appendChild(fragment);
      range.insertNode(span);
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      sel.removeAllRanges();
      sel.addRange(newRange);
      savedRangeRef.current = newRange.cloneRange();
    } else {
      document.execCommand("fontName", false, familyValue);
    }
    triggerChange();
    updateToolbarState();
  };

  // Apply Heading (Google Docs style H1, H2, H3, H4, H5, Normal text P)
  const applyHeading = (tag: string, label: string) => {
    setCurrentHeading(label);
    setShowHeadingMenu(false);
    if (!editorRef.current) return;
    editorRef.current.focus();
    restoreSelection();

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const targetTag = tag.toLowerCase();

    // 1. Try standard formatBlock
    try {
      const formatted = document.execCommand("formatBlock", false, `<${targetTag}>`);
      if (!formatted) {
        document.execCommand("formatBlock", false, targetTag);
      }
    } catch (e) {
      // fallback to direct DOM node replacement below
    }

    // 2. DOM block transformation for 100% guarantee across all browsers
    let node: Node | null = sel.anchorNode;
    while (node && node !== editorRef.current) {
      if (
        node instanceof HTMLElement &&
        ["P", "DIV", "H1", "H2", "H3", "H4", "H5", "H6"].includes(node.tagName)
      ) {
        if (node.tagName.toLowerCase() !== targetTag) {
          const replacement = document.createElement(targetTag);
          replacement.innerHTML = node.innerHTML;
          node.parentNode?.replaceChild(replacement, node);
          const newRange = document.createRange();
          newRange.selectNodeContents(replacement);
          newRange.collapse(false);
          sel.removeAllRanges();
          sel.addRange(newRange);
          savedRangeRef.current = newRange.cloneRange();
        }
        break;
      }
      node = node.parentNode;
    }

    triggerChange();
    updateToolbarState();
  };

  // Apply Line Spacing
  const applyLineSpacing = (spacing: string) => {
    setShowSpacingMenu(false);
    if (!editorRef.current) return;
    editorRef.current.focus();
    restoreSelection();

    const sel = window.getSelection();
    if (sel && sel.anchorNode) {
      let node: Node | null = sel.anchorNode;
      while (node && node !== editorRef.current) {
        if (
          node instanceof HTMLElement &&
          ["P", "DIV", "H1", "H2", "H3", "H4", "H5", "LI"].includes(node.tagName)
        ) {
          node.style.lineHeight = spacing;
          break;
        }
        node = node.parentNode;
      }
    }
    triggerChange();
  };

  // Add paragraph spacing
  const addParagraphSpacing = (direction: "before" | "after") => {
    setShowSpacingMenu(false);
    if (!editorRef.current) return;
    editorRef.current.focus();
    restoreSelection();

    const sel = window.getSelection();
    if (sel && sel.anchorNode) {
      let node: Node | null = sel.anchorNode;
      while (node && node !== editorRef.current) {
        if (
          node instanceof HTMLElement &&
          ["P", "DIV", "H1", "H2", "H3", "H4", "H5"].includes(node.tagName)
        ) {
          if (direction === "before") {
            node.style.marginTop = "16px";
          } else {
            node.style.marginBottom = "16px";
          }
          break;
        }
        node = node.parentNode;
      }
    }
    triggerChange();
  };

  // Insert Checklist
  const insertChecklist = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    restoreSelection();

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);

    const checkDiv = document.createElement("div");
    checkDiv.className = "checklist-item";
    checkDiv.style.display = "flex";
    checkDiv.style.alignItems = "flex-start";
    checkDiv.style.gap = "8px";
    checkDiv.style.margin = "6px 0";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.marginTop = "4px";
    checkbox.style.cursor = "pointer";
    checkbox.style.width = "16px";
    checkbox.style.height = "16px";
    checkbox.style.accentColor = "#2563eb";

    const labelSpan = document.createElement("span");
    labelSpan.contentEditable = "true";
    labelSpan.innerHTML = range.toString() || "Task item...";

    checkDiv.appendChild(checkbox);
    checkDiv.appendChild(labelSpan);

    range.deleteContents();
    range.insertNode(checkDiv);

    const newRange = document.createRange();
    newRange.selectNodeContents(labelSpan);
    newRange.collapse(false);
    sel.removeAllRanges();
    sel.addRange(newRange);
    savedRangeRef.current = newRange.cloneRange();

    triggerChange();
  };

  // Insert Hyperlink Modal Trigger (preserves selection range)
  const handleOpenLinkModal = () => {
    saveSelection();
    const sel = window.getSelection();
    const selected = sel ? sel.toString() : "";
    setLinkText(selected);
    setLinkUrl("");
    setShowLinkModal(true);
  };

  // Apply Hyperlink without parent form submission or redirect
  const handleApplyLink = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!linkUrl.trim()) return;

    if (!editorRef.current) return;
    editorRef.current.focus();

    let finalUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = "https://" + finalUrl;
    }

    const sel = window.getSelection();
    let range: Range | null = null;
    if (savedRangeRef.current) {
      range = savedRangeRef.current;
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } else if (sel && sel.rangeCount > 0) {
      range = sel.getRangeAt(0);
    }

    if (range) {
      if (!range.collapsed) {
        document.execCommand("createLink", false, finalUrl);
      } else {
        const a = document.createElement("a");
        a.href = finalUrl;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.style.color = "#1a73e8";
        a.style.textDecoration = "underline";
        a.style.fontWeight = "500";
        a.innerText = linkText.trim() || finalUrl;
        range.insertNode(a);
        range.setStartAfter(a);
        range.collapse(true);
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    }

    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");
    savedRangeRef.current = null;
    triggerChange();
  };

  // Clear format
  const handleClearFormat = () => {
    execCmd("removeFormat");
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const fragment = range.extractContents();
      const div = document.createElement("div");
      div.appendChild(fragment);
      const styledElements = div.querySelectorAll("[style]");
      styledElements.forEach((el) => el.removeAttribute("style"));
      range.insertNode(div.firstChild || document.createTextNode(div.innerText));
    }
    triggerChange();
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      {/* Scoped CSS for authentic Google Docs typography */}
      <style>{`
        .gdocs-canvas-sheet {
          font-family: Arial, Roboto, 'Plus Jakarta Sans', sans-serif;
          color: #0f172a;
          background-color: #ffffff;
          line-height: 1.65;
        }
        .dark .gdocs-canvas-sheet {
          color: #f1f5f9;
          background-color: #020617;
        }
        .gdocs-canvas-sheet h1 {
          font-size: 26px !important;
          font-weight: 700 !important;
          line-height: 1.25 !important;
          margin-top: 20px !important;
          margin-bottom: 8px !important;
          color: #0f172a !important;
          letter-spacing: -0.02em !important;
        }
        .dark .gdocs-canvas-sheet h1 {
          color: #f8fafc !important;
        }
        .gdocs-canvas-sheet h2 {
          font-size: 20px !important;
          font-weight: 700 !important;
          line-height: 1.3 !important;
          margin-top: 16px !important;
          margin-bottom: 6px !important;
          color: #0f172a !important;
          letter-spacing: -0.01em !important;
        }
        .dark .gdocs-canvas-sheet h2 {
          color: #f8fafc !important;
        }
        .gdocs-canvas-sheet h3 {
          font-size: 16px !important;
          font-weight: 600 !important;
          line-height: 1.35 !important;
          margin-top: 14px !important;
          margin-bottom: 4px !important;
          color: #1e293b !important;
        }
        .dark .gdocs-canvas-sheet h3 {
          color: #e2e8f0 !important;
        }
        .gdocs-canvas-sheet h4 {
          font-size: 14px !important;
          font-weight: 600 !important;
          line-height: 1.4 !important;
          margin-top: 12px !important;
          margin-bottom: 4px !important;
          color: #334155 !important;
        }
        .dark .gdocs-canvas-sheet h4 {
          color: #cbd5e1 !important;
        }
        .gdocs-canvas-sheet h5 {
          font-size: 13px !important;
          font-weight: 600 !important;
          line-height: 1.4 !important;
          margin-top: 10px !important;
          margin-bottom: 2px !important;
          color: #475569 !important;
        }
        .dark .gdocs-canvas-sheet h5 {
          color: #94a3b8 !important;
        }
        .gdocs-canvas-sheet p {
          font-size: 14px;
          line-height: 1.65;
          margin-bottom: 12px;
          color: inherit;
        }
        .gdocs-canvas-sheet ul {
          list-style-type: disc !important;
          padding-left: 26px !important;
          margin-top: 4px !important;
          margin-bottom: 12px !important;
        }
        .gdocs-canvas-sheet ol {
          list-style-type: decimal !important;
          padding-left: 26px !important;
          margin-top: 4px !important;
          margin-bottom: 12px !important;
        }
        .gdocs-canvas-sheet li {
          margin-bottom: 4px !important;
          line-height: 1.6 !important;
        }
        .gdocs-canvas-sheet a {
          color: #1a73e8 !important;
          text-decoration: underline !important;
          cursor: pointer !important;
          font-weight: 500 !important;
        }
        .dark .gdocs-canvas-sheet a {
          color: #60a5fa !important;
        }
        .gdocs-canvas-sheet a:hover {
          color: #1557b0 !important;
        }
        .gdocs-canvas-sheet blockquote {
          border-left: 3px solid #cbd5e1 !important;
          padding-left: 14px !important;
          margin: 12px 0 !important;
          color: #64748b !important;
          font-style: italic !important;
        }
        .dark .gdocs-canvas-sheet blockquote {
          border-left-color: #475569 !important;
          color: #94a3b8 !important;
        }
        .gdocs-canvas-sheet hr {
          border: 0;
          border-top: 1px solid #e2e8f0;
          margin: 20px 0;
        }
        .dark .gdocs-canvas-sheet hr {
          border-top-color: #334155;
        }
      `}</style>

      {/* --------------------------------------------------------------------------------- */}
      {/* GOOGLE DOCS HEADER STRIP */}
      {/* --------------------------------------------------------------------------------- */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-border px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-foreground">
                Detailed Description Document
              </span>
              <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.2 rounded font-medium">
                Google Docs Interface
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Format code blueprints, viva presentation topics, and system architecture.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} characters</span>
        </div>
      </div>

      {/* --------------------------------------------------------------------------------- */}
      {/* GOOGLE DOCS COMPREHENSIVE TOOLBAR */}
      {/* --------------------------------------------------------------------------------- */}
      <div className="bg-slate-100/90 dark:bg-slate-900/90 border-b border-border p-1.5 flex flex-wrap items-center gap-1 text-xs select-none">
        {/* GROUP 1: Undo / Redo / Clear Format */}
        <button
          type="button"
          title="Undo (Ctrl+Z)"
          onMouseDown={(e) => {
            e.preventDefault();
            execCmd("undo");
          }}
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          title="Redo (Ctrl+Y)"
          onMouseDown={(e) => {
            e.preventDefault();
            execCmd("redo");
          }}
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <Redo className="w-4 h-4" />
        </button>

        <button
          type="button"
          title="Clear formatting"
          onMouseDown={(e) => {
            e.preventDefault();
            handleClearFormat();
          }}
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <RemoveFormatting className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-border mx-1" />

        {/* GROUP 2: Heading Dropdown (Normal text, H1, H2, H3, H4, H5) */}
        <div className="relative">
          <button
            type="button"
            title="Styles (Normal text, H1 to H5)"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={() => {
              const next = !showHeadingMenu;
              closeAllMenus();
              setShowHeadingMenu(next);
            }}
            className="flex items-center gap-1 h-7 px-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
          >
            <span>{currentHeading}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>

          {showHeadingMenu && (
            <div className="absolute left-0 top-full mt-1 w-48 rounded-md border border-border bg-card shadow-lg py-1 z-50 text-xs">
              {HEADINGS.map((h) => (
                <button
                  key={h.tag}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyHeading(h.tag, h.label);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-muted transition-colors flex items-center justify-between ${
                    currentHeading === h.label ? "text-primary font-bold bg-muted/50" : ""
                  }`}
                >
                  <span className={h.style}>{h.label}</span>
                  {currentHeading === h.label && <Check className="w-3 h-3 text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-border mx-1" />

        {/* GROUP 3: Font Style Dropdown (Arial, Roboto, etc.) */}
        <div className="relative">
          <button
            type="button"
            title="Font style"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={() => {
              const next = !showFontMenu;
              closeAllMenus();
              setShowFontMenu(next);
            }}
            className="flex items-center gap-1 h-7 px-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors max-w-[130px] truncate"
          >
            <span className="truncate">{currentFont}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
          </button>

          {showFontMenu && (
            <div className="absolute left-0 top-full mt-1 w-52 max-h-64 overflow-y-auto rounded-md border border-border bg-card shadow-lg py-1 z-50 text-xs">
              {FONT_FAMILIES.map((f) => (
                <button
                  key={f.name}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyFontFamily(f.value, f.name);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-muted transition-colors flex items-center justify-between ${
                    currentFont === f.name ? "text-primary font-bold bg-muted/50" : ""
                  }`}
                  style={{ fontFamily: f.value }}
                >
                  <span>{f.name}</span>
                  {currentFont === f.name && <Check className="w-3 h-3 text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-border mx-1" />

        {/* GROUP 4: Size 1 to 90 Control */}
        <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 h-7 px-1">
          <button
            type="button"
            title="Decrease font size"
            onMouseDown={(e) => {
              e.preventDefault();
              applyFontSize(fontSize - 1);
            }}
            className="p-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300"
          >
            <Minus className="w-3 h-3" />
          </button>

          {/* Direct Size Input (1 to 90) */}
          <input
            type="number"
            min={1}
            max={90}
            value={fontSize}
            onFocus={saveSelection}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val)) applyFontSize(val);
            }}
            title="Font size (1 to 90)"
            className="w-9 text-center text-xs font-semibold bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-foreground"
          />

          <button
            type="button"
            title="Increase font size"
            onMouseDown={(e) => {
              e.preventDefault();
              applyFontSize(fontSize + 1);
            }}
            className="p-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300"
          >
            <Plus className="w-3 h-3" />
          </button>

          {/* Quick presets chevron */}
          <div className="relative">
            <button
              type="button"
              title="Select preset size"
              onMouseDown={(e) => {
                e.preventDefault();
                saveSelection();
              }}
              onClick={() => {
                const next = !showSizeMenu;
                closeAllMenus();
                setShowSizeMenu(next);
              }}
              className="p-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"
            >
              <ChevronDown className="w-3 h-3" />
            </button>

            {showSizeMenu && (
              <div className="absolute right-0 top-full mt-1 w-20 max-h-56 overflow-y-auto rounded-md border border-border bg-card shadow-lg py-1 z-50 text-xs">
                {PRESET_SIZES.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      applyFontSize(sz);
                    }}
                    className={`w-full text-center py-1 hover:bg-muted font-mono ${
                      fontSize === sz ? "text-primary font-bold bg-muted/60" : ""
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-px h-5 bg-border mx-1" />

        {/* GROUP 5: Bold, Italic, Underline, Strikethrough */}
        <button
          type="button"
          title="Bold (Ctrl+B)"
          onMouseDown={(e) => {
            e.preventDefault();
            execCmd("bold");
          }}
          className={`p-1.5 rounded transition-colors ${
            activeFormats.bold
              ? "bg-slate-300 dark:bg-slate-600 font-bold text-foreground"
              : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
          }`}
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          title="Italic (Ctrl+I)"
          onMouseDown={(e) => {
            e.preventDefault();
            execCmd("italic");
          }}
          className={`p-1.5 rounded transition-colors ${
            activeFormats.italic
              ? "bg-slate-300 dark:bg-slate-600 text-foreground"
              : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
          }`}
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          title="Underline (Ctrl+U)"
          onMouseDown={(e) => {
            e.preventDefault();
            execCmd("underline");
          }}
          className={`p-1.5 rounded transition-colors ${
            activeFormats.underline
              ? "bg-slate-300 dark:bg-slate-600 text-foreground"
              : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
          }`}
        >
          <Underline className="w-4 h-4" />
        </button>

        <button
          type="button"
          title="Strikethrough"
          onMouseDown={(e) => {
            e.preventDefault();
            execCmd("strikeThrough");
          }}
          className={`p-1.5 rounded transition-colors ${
            activeFormats.strike
              ? "bg-slate-300 dark:bg-slate-600 text-foreground"
              : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
          }`}
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        {/* Text Color Popover */}
        <div className="relative">
          <button
            type="button"
            title="Text color"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={() => {
              const next = !showTextColorMenu;
              closeAllMenus();
              setShowTextColorMenu(next);
            }}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex flex-col items-center justify-center transition-colors"
          >
            <span className="font-bold text-xs leading-none">A</span>
            <div
              className="w-3.5 h-1 rounded-full mt-0.5"
              style={{ backgroundColor: textColor }}
            />
          </button>

          {showTextColorMenu && (
            <div className="absolute left-0 top-full mt-1 w-56 rounded-md border border-border bg-card shadow-xl p-3 z-50">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                Text color
              </span>
              <div className="grid grid-cols-8 gap-1 mb-2">
                {TEXT_COLORS.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setTextColor(c);
                      execCmd("foreColor", c);
                      setShowTextColorMenu(false);
                    }}
                    style={{ backgroundColor: c }}
                    className="w-5 h-5 rounded-sm border border-slate-300 dark:border-slate-700 hover:scale-110 transition-transform"
                    title={c}
                  />
                ))}
              </div>
              <div className="pt-2 border-t border-border flex items-center gap-1.5">
                <span className="text-[11px] text-muted-foreground">Custom:</span>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => {
                    setTextColor(e.target.value);
                    execCmd("foreColor", e.target.value);
                  }}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Highlight Color Popover */}
        <div className="relative">
          <button
            type="button"
            title="Highlight color"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={() => {
              const next = !showHighlightMenu;
              closeAllMenus();
              setShowHighlightMenu(next);
            }}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex flex-col items-center justify-center transition-colors"
          >
            <Highlighter className="w-3.5 h-3.5" />
            <div
              className="w-3.5 h-1 rounded-full mt-0.5"
              style={{
                backgroundColor: highlightColor === "transparent" ? "#fbbf24" : highlightColor,
              }}
            />
          </button>

          {showHighlightMenu && (
            <div className="absolute left-0 top-full mt-1 w-56 rounded-md border border-border bg-card shadow-xl p-3 z-50">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                Highlight color
              </span>
              <div className="grid grid-cols-7 gap-1.5 mb-2">
                {HIGHLIGHT_COLORS.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setHighlightColor(c);
                      execCmd(c === "transparent" ? "removeFormat" : "hiliteColor", c);
                      setShowHighlightMenu(false);
                    }}
                    style={{ backgroundColor: c === "transparent" ? "#ffffff" : c }}
                    className="w-5 h-5 rounded-sm border border-slate-300 dark:border-slate-700 hover:scale-110 transition-transform flex items-center justify-center text-[10px]"
                    title={c === "transparent" ? "None" : c}
                  >
                    {c === "transparent" && "✕"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-border mx-1" />

        {/* GROUP 6: Hyperlink */}
        <button
          type="button"
          title="Insert link (Ctrl+K)"
          onMouseDown={(e) => {
            e.preventDefault();
            handleOpenLinkModal();
          }}
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <LinkIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </button>

        <button
          type="button"
          title="Remove link"
          onMouseDown={(e) => {
            e.preventDefault();
            execCmd("unlink");
          }}
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <Unlink className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-5 bg-border mx-1" />

        {/* GROUP 7: Align Left, Center, Right, Justify */}
        <button
          type="button"
          title="Align left"
          onMouseDown={(e) => {
            e.preventDefault();
            execCmd("justifyLeft");
          }}
          className={`p-1.5 rounded transition-colors ${
            activeFormats.align === "left"
              ? "bg-slate-300 dark:bg-slate-600 text-foreground"
              : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
          }`}
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          title="Align center"
          onMouseDown={(e) => {
            e.preventDefault();
            execCmd("justifyCenter");
          }}
          className={`p-1.5 rounded transition-colors ${
            activeFormats.align === "center"
              ? "bg-slate-300 dark:bg-slate-600 text-foreground"
              : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
          }`}
        >
          <AlignCenter className="w-4 h-4" />
        </button>

        <button
          type="button"
          title="Align right"
          onMouseDown={(e) => {
            e.preventDefault();
            execCmd("justifyRight");
          }}
          className={`p-1.5 rounded transition-colors ${
            activeFormats.align === "right"
              ? "bg-slate-300 dark:bg-slate-600 text-foreground"
              : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
          }`}
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          title="Justify"
          onMouseDown={(e) => {
            e.preventDefault();
            execCmd("justifyFull");
          }}
          className={`p-1.5 rounded transition-colors ${
            activeFormats.align === "justify"
              ? "bg-slate-300 dark:bg-slate-600 text-foreground"
              : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
          }`}
        >
          <AlignJustify className="w-4 h-4" />
        </button>

        {/* Line & Paragraph Spacing Dropdown */}
        <div className="relative">
          <button
            type="button"
            title="Line & paragraph spacing"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={() => {
              const next = !showSpacingMenu;
              closeAllMenus();
              setShowSpacingMenu(next);
            }}
            className="flex items-center gap-0.5 p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Rows className="w-4 h-4" />
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>

          {showSpacingMenu && (
            <div className="absolute left-0 top-full mt-1 w-52 rounded-md border border-border bg-card shadow-lg py-1 z-50 text-xs">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyLineSpacing("1");
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-muted transition-colors flex items-center justify-between"
              >
                <span>Single (1.0)</span>
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyLineSpacing("1.15");
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-muted transition-colors flex items-center justify-between font-semibold"
              >
                <span>1.15 (Default)</span>
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyLineSpacing("1.5");
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-muted transition-colors flex items-center justify-between"
              >
                <span>1.5</span>
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyLineSpacing("2");
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-muted transition-colors flex items-center justify-between"
              >
                <span>Double (2.0)</span>
              </button>
              <div className="h-px bg-border my-1" />
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  addParagraphSpacing("before");
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-muted transition-colors"
              >
                <span>Add space before paragraph</span>
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  addParagraphSpacing("after");
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-muted transition-colors"
              >
                <span>Add space after paragraph</span>
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-border mx-1" />

        {/* GROUP 8: Checklist, Bulleted list, Numbered list */}
        <button
          type="button"
          title="Checklist (Interactive checkbox)"
          onMouseDown={(e) => {
            e.preventDefault();
            insertChecklist();
          }}
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <ListTodo className="w-4 h-4" />
        </button>

        <button
          type="button"
          title="Bulleted list (Ctrl+Shift+8)"
          onMouseDown={(e) => {
            e.preventDefault();
            execCmd("insertUnorderedList");
          }}
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          title="Numbered list (Ctrl+Shift+7)"
          onMouseDown={(e) => {
            e.preventDefault();
            execCmd("insertOrderedList");
          }}
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        {/* GROUP 9: Decrease Indent, Increase Indent */}
        <button
          type="button"
          title="Decrease indent"
          onMouseDown={(e) => {
            e.preventDefault();
            execCmd("outdent");
          }}
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <Outdent className="w-4 h-4" />
        </button>

        <button
          type="button"
          title="Increase indent"
          onMouseDown={(e) => {
            e.preventDefault();
            execCmd("indent");
          }}
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <Indent className="w-4 h-4" />
        </button>
      </div>

      {/* --------------------------------------------------------------------------------- */}
      {/* GOOGLE DOCS CANVAS CONTAINER (Realistic Page Surface) */}
      {/* --------------------------------------------------------------------------------- */}
      <div
        className="bg-slate-200/60 dark:bg-slate-900/60 p-3 sm:p-8 flex justify-center overflow-x-auto min-h-[460px] cursor-text"
        onClick={(e) => {
          if (e.target === e.currentTarget && editorRef.current) {
            editorRef.current.focus();
          }
        }}
      >
        <div className="relative w-full max-w-[820px]">
          {/* White Document Page */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={triggerChange}
            onKeyUp={updateToolbarState}
            onMouseUp={updateToolbarState}
            onSelect={updateToolbarState}
            style={{ minHeight }}
            className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-8 sm:p-14 rounded shadow-[0_4px_25px_rgba(0,0,0,0.07)] border border-slate-300/80 dark:border-slate-800 focus:outline-none transition-all max-w-none text-sm relative z-10 gdocs-canvas-sheet"
          />

          {/* Faint Guide Template (Small & light in color - only visible when empty) */}
          {isEmpty && (
            <div
              onClick={() => editorRef.current?.focus()}
              className="absolute top-0 left-0 right-0 p-8 sm:p-14 pointer-events-none select-none z-20 space-y-4 text-slate-400/40 dark:text-slate-500/40 font-normal"
            >
              <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-slate-800/40 pb-2">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400/50">
                  Guide / Example Structure (Start typing anywhere)
                </span>
                <span className="text-[10px] text-slate-400/50">
                  Documentation Reference
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-slate-400/60 dark:text-slate-500/60">
                  1. Project Abstract & Objective
                </h4>
                <p className="text-[11px] leading-relaxed text-slate-400/40 dark:text-slate-500/40">
                  Provide a clear summary of the application, problem statement, key deliverables, and target users.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-slate-400/60 dark:text-slate-500/60">
                  2. Technical Architecture & Component Breakdown
                </h4>
                <p className="text-[11px] leading-relaxed text-slate-400/40 dark:text-slate-500/40">
                  Explain the workflow between frontend client, backend REST services, middleware, and database schema.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-slate-400/60 dark:text-slate-500/60">
                  3. Core Technology Stack
                </h4>
                <p className="text-[11px] leading-relaxed text-slate-400/40 dark:text-slate-500/40">
                  • Frontend: React / Next.js with responsive Tailwind CSS components<br/>
                  • Backend: Python / Node.js with secure token authentication<br/>
                  • Database: PostgreSQL / Supabase / MongoDB relational data modeling
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-slate-400/60 dark:text-slate-500/60">
                  4. Key Engineering Features & Viva Questions
                </h4>
                <p className="text-[11px] leading-relaxed text-slate-400/40 dark:text-slate-500/40">
                  Detail unique selling points, core algorithms, and examiner FAQs to help students defend their project during viva.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --------------------------------------------------------------------------------- */}
      {/* DOCUMENT BOTTOM BAR (Only Clear Option) */}
      {/* --------------------------------------------------------------------------------- */}
      <div className="bg-slate-50 dark:bg-slate-900 border-t border-border px-4 py-2 flex items-center justify-end text-xs text-muted-foreground">
        <button
          type="button"
          onClick={() => {
            if (editorRef.current) {
              editorRef.current.innerHTML = "";
              triggerChange();
            }
          }}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors font-medium px-2 py-0.5 rounded hover:bg-muted"
          title="Clear content back to clean page"
        >
          Clear
        </button>
      </div>

      {/* --------------------------------------------------------------------------------- */}
      {/* LINK INSERTION MODAL (No nested form - prevents page redirect) */}
      {/* --------------------------------------------------------------------------------- */}
      {showLinkModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              e.preventDefault();
              e.stopPropagation();
              setShowLinkModal(false);
            }
          }}
        >
          <div
            className="bg-card border border-border rounded-xl p-5 w-full max-w-md shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-blue-600" />
                Insert Hyperlink
              </h4>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowLinkModal(false);
                }}
                className="text-muted-foreground hover:text-foreground text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleApplyLink(e);
                }
              }}
              className="space-y-3"
            >
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Text to display</label>
                <Input
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="e.g. Live Project Demo, GitHub Repository, or Documentation"
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Link URL *</label>
                <Input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com/demo"
                  required
                  autoFocus
                  className="h-8 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowLinkModal(false);
                  }}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleApplyLink(e);
                  }}
                  size="sm"
                  className="text-xs h-8"
                >
                  Apply Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
