"use client";

import {
  type ClipboardEvent as ReactClipboardEvent,
  type DragEvent as ReactDragEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ChangeEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "@/components/admin/RichTextEditor.css";
import { uploadMediaPublicUrl } from "@/lib/upload-media-client";
import {
  FaAlignCenter,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaEraser,
  FaHighlighter,
  FaImage,
  FaItalic,
  FaList,
  FaListOl,
  FaTextHeight,
  FaTrash,
  FaUnderline,
  FaVideo,
} from "react-icons/fa";

export type RichTextProps = {
  /** Form field name — synced to a hidden input for FormData. */
  name: string;
  /** Initial HTML (e.g. when editing). */
  defaultHtml?: string;
  onHtmlChange?: (html: string) => void;
  /** Full-width layout inside admin cards (no outer max-width / centered margin). */
  embed?: boolean;
  className?: string;
  /** Min height of the editable area in pixels. */
  editorMinHeight?: number;
};

/** True when pasted HTML has no meaningful text (for required body validation). */
export function isRichTextBodyEmpty(html: string): boolean {
  const text = html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, "")
    .trim();
  return text.length === 0;
}

type ToolbarAction =
  | "bold"
  | "italic"
  | "underline"
  | "bulletList"
  | "numberList"
  | "highlight"
  | "alignLeft"
  | "alignCenter"
  | "alignRight"
  | "capitalize"
  | "image"
  | "video"
  | "clear";

type AlignKey = "left" | "center" | "right";

function escapeHtmlAttr(raw: string): string {
  return raw.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

export default function RichText({
  name,
  defaultHtml = "",
  onHtmlChange,
  embed = true,
  className = "",
  editorMinHeight = 200,
}: RichTextProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const initializedRef = useRef(false);

  const [html, setHtml] = useState(defaultHtml);
  const [showEraseModal, setShowEraseModal] = useState(false);
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: "left" as AlignKey,
    highlight: false,
  });

  const syncFromEditor = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const nextHtml = el.innerHTML;
    setHtml(nextHtml);
    onHtmlChange?.(nextHtml);
  }, [onHtmlChange]);

  useLayoutEffect(() => {
    const el = editorRef.current;
    if (!el || initializedRef.current) return;
    el.innerHTML = defaultHtml || "";
    setHtml(el.innerHTML);
    initializedRef.current = true;
  }, [defaultHtml]);

  const focusEditor = useCallback(() => {
    editorRef.current?.focus();
  }, []);

  const execCommand = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value);
      focusEditor();
      syncFromEditor();
    },
    [focusEditor, syncFromEditor]
  );

  const handleEraseAll = () => {
    setShowEraseModal(true);
  };

  const confirmErase = () => {
    const el = editorRef.current;
    if (el) {
      el.innerHTML = "";
      setHtml("");
      onHtmlChange?.("");
    }
    setShowEraseModal(false);
    setActiveStyles({
      bold: false,
      italic: false,
      underline: false,
      align: "left",
      highlight: false,
    });
  };

  const handleToolbarAction = (action: ToolbarAction) => {
    switch (action) {
      case "bold":
      case "italic":
      case "underline":
        execCommand(action);
        setActiveStyles((prev) => ({
          ...prev,
          [action]: !prev[action],
        }));
        break;
      case "bulletList":
        execCommand("insertUnorderedList");
        break;
      case "numberList":
        execCommand("insertOrderedList");
        break;
      case "highlight": {
        const newHighlightState = !activeStyles.highlight;
        if (newHighlightState) {
          execCommand("backColor", "yellow");
        } else {
          execCommand("removeFormat");
        }
        setActiveStyles((prev) => ({
          ...prev,
          highlight: newHighlightState,
        }));
        break;
      }
      case "alignLeft":
      case "alignCenter":
      case "alignRight": {
        const map: Record<string, string> = {
          alignLeft: "justifyLeft",
          alignCenter: "justifyCenter",
          alignRight: "justifyRight",
        };
        execCommand(map[action] ?? "justifyLeft");
        const alignValue = action.replace("align", "").toLowerCase() as AlignKey;
        setActiveStyles((prev) => ({
          ...prev,
          align: alignValue,
        }));
        break;
      }
      case "capitalize": {
        const selection = window.getSelection();
        if (selection && selection.toString()) {
          const text = selection.toString().toUpperCase();
          execCommand("insertText", text);
        }
        break;
      }
      case "image":
      case "video":
        fileInputRef.current?.click();
        break;
      case "clear":
        execCommand("removeFormat");
        setActiveStyles({
          bold: false,
          italic: false,
          underline: false,
          align: "left",
          highlight: false,
        });
        break;
      default:
        break;
    }
  };

  const handleFontSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    execCommand("fontSize", e.target.value);
  };

  const insertMediaHtml = useCallback(
    (file: File, publicUrl: string) => {
      const src = escapeHtmlAttr(publicUrl);
      const uniqueId = `media-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const isImage =
        file.type.startsWith("image/") ||
        (!file.type && /\.(jpe?g|png|gif|webp|bmp|svg|heic|heif)$/i.test(file.name));

      if (isImage) {
        const block = `
            <div class="media-container" id="${uniqueId}">
              <button type="button" class="media-remove-btn" onclick="document.getElementById('${uniqueId}')?.remove()">×</button>
              <img src="${src}" style="max-width: 100%; max-height: 300px; object-fit: contain;" alt="Uploaded image" />
            </div>
          `;
        document.execCommand("insertHTML", false, block);
      } else {
        const block = `
            <div class="media-container" id="${uniqueId}">
              <button type="button" class="media-remove-btn" onclick="document.getElementById('${uniqueId}')?.remove()">×</button>
              <video controls src="${src}" style="max-width: 100%; max-height: 300px; object-fit: contain;"></video>
            </div>
          `;
        document.execCommand("insertHTML", false, block);
      }
      syncFromEditor();
    },
    [syncFromEditor]
  );

  const uploadFileIntoEditor = useCallback(
    async (file: File) => {
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File size should be less than 10MB");
        return;
      }

      const allowedVideoTypes = ["video/mp4", "video/webm"];
      const isImage =
        file.type.startsWith("image/") ||
        (!file.type && /\.(jpe?g|png|gif|webp|bmp|svg|heic|heif)$/i.test(file.name));

      if (!isImage && !allowedVideoTypes.includes(file.type)) {
        alert(
          "Please upload only images or videos (MP4, WEBM). Use the toolbar image button if drag-and-drop is unclear."
        );
        return;
      }

      focusEditor();
      const up = await uploadMediaPublicUrl(file);
      if (!up.ok) {
        alert(up.message);
        return;
      }
      insertMediaHtml(file, up.url);
    },
    [focusEditor, insertMediaHtml]
  );

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    input.value = "";

    if (!file) return;
    await uploadFileIntoEditor(file);
  };

  const handlePaste = async (e: ReactClipboardEvent<HTMLDivElement>) => {
    const cd = e.clipboardData;
    if (!cd) return;

    const files: File[] = [];
    for (let i = 0; i < cd.items.length; i++) {
      const it = cd.items[i];
      if (it.kind !== "file") continue;
      const f = it.getAsFile();
      if (!f) continue;
      if (f.type.startsWith("image/")) files.push(f);
    }

    if (files.length === 0) return;

    e.preventDefault();
    for (const file of files) {
      await uploadFileIntoEditor(file);
    }
  };

  const handleDrop = async (e: ReactDragEvent<HTMLDivElement>) => {
    const dt = e.dataTransfer;
    if (!dt?.files?.length) return;

    const files = Array.from(dt.files).filter((f) => {
      if (f.type.startsWith("image/")) return true;
      if (["video/mp4", "video/webm"].includes(f.type)) return true;
      if (!f.type && /\.(jpe?g|png|gif|webp|bmp|svg|heic|heif|mp4|webm)$/i.test(f.name))
        return true;
      return false;
    });
    if (files.length === 0) return;

    e.preventDefault();
    focusEditor();
    for (const file of files) {
      await uploadFileIntoEditor(file);
    }
  };

  const handleDragOver = (e: ReactDragEvent<HTMLDivElement>) => {
    if (e.dataTransfer?.types?.includes("Files")) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "b" && e.ctrlKey) {
      e.preventDefault();
      handleToolbarAction("bold");
    } else if (e.key === "i" && e.ctrlKey) {
      e.preventDefault();
      handleToolbarAction("italic");
    } else if (e.key === "u" && e.ctrlKey) {
      e.preventDefault();
      handleToolbarAction("underline");
    }
  };

  const rootClass = [
    "rich-text-container",
    embed ? "rich-text-container--embed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      <input type="hidden" name={name} value={html} onChange={() => {}} />

      <div className="toolbar">
        <button
          type="button"
          className={`format-icon ${activeStyles.bold ? "active" : ""}`}
          onClick={() => handleToolbarAction("bold")}
          title="Bold (Ctrl+B)"
        >
          <FaBold />
        </button>
        <button
          type="button"
          className={`format-icon ${activeStyles.italic ? "active" : ""}`}
          onClick={() => handleToolbarAction("italic")}
          title="Italic (Ctrl+I)"
        >
          <FaItalic />
        </button>
        <button
          type="button"
          className={`format-icon ${activeStyles.underline ? "active" : ""}`}
          onClick={() => handleToolbarAction("underline")}
          title="Underline (Ctrl+U)"
        >
          <FaUnderline />
        </button>
        <button
          type="button"
          className="format-icon"
          onClick={() => handleToolbarAction("capitalize")}
          title="Capitalize selection"
        >
          <FaTextHeight />
        </button>

        <div className="toolbar-divider" />

        <select
          className="font-size-select"
          onChange={handleFontSizeChange}
          title="Font size"
          aria-label="Font size"
        >
          <option value="3">Normal</option>
          <option value="1">Small</option>
          <option value="4">Large</option>
          <option value="5">Larger</option>
          <option value="6">Largest</option>
        </select>

        <div className="toolbar-divider" />

        <button
          type="button"
          className={`format-icon ${activeStyles.align === "left" ? "active" : ""}`}
          onClick={() => handleToolbarAction("alignLeft")}
          title="Align left"
        >
          <FaAlignLeft />
        </button>
        <button
          type="button"
          className={`format-icon ${activeStyles.align === "center" ? "active" : ""}`}
          onClick={() => handleToolbarAction("alignCenter")}
          title="Align center"
        >
          <FaAlignCenter />
        </button>
        <button
          type="button"
          className={`format-icon ${activeStyles.align === "right" ? "active" : ""}`}
          onClick={() => handleToolbarAction("alignRight")}
          title="Align right"
        >
          <FaAlignRight />
        </button>

        <div className="toolbar-divider" />

        <button
          type="button"
          className="format-icon"
          onClick={() => handleToolbarAction("bulletList")}
          title="Bullet list"
        >
          <FaList />
        </button>
        <button
          type="button"
          className="format-icon"
          onClick={() => handleToolbarAction("numberList")}
          title="Numbered list"
        >
          <FaListOl />
        </button>

        <div className="toolbar-divider" />

        <button
          type="button"
          className={`format-icon ${activeStyles.highlight ? "active" : ""}`}
          onClick={() => handleToolbarAction("highlight")}
          title={activeStyles.highlight ? "Disable highlight" : "Highlight"}
        >
          <FaHighlighter />
        </button>
        <button
          type="button"
          className="format-icon"
          onClick={() => handleToolbarAction("clear")}
          title="Clear formatting"
        >
          <FaEraser />
        </button>

        <div className="toolbar-divider" />

        <button
          type="button"
          className="format-icon"
          onClick={() => handleToolbarAction("image")}
          title="Insert image"
        >
          <FaImage />
        </button>
        <button
          type="button"
          className="format-icon"
          onClick={() => handleToolbarAction("video")}
          title="Insert video"
        >
          <FaVideo />
        </button>

        <div className="toolbar-divider" />

        <button
          type="button"
          className="format-icon"
          onClick={handleEraseAll}
          title="Erase all content"
        >
          <FaTrash />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          className="media-input"
          accept="image/*,video/*"
          onChange={handleFileUpload}
        />
      </div>

      <div
        ref={editorRef}
        className="editor-area"
        contentEditable
        role="textbox"
        aria-multiline
        onKeyDown={onKeyDown}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onInput={syncFromEditor}
        onBlur={syncFromEditor}
        suppressContentEditableWarning
        data-placeholder="Start typing…"
        style={{ minHeight: editorMinHeight }}
      />

      {showEraseModal ? (
        <div className="modal-overlay" role="presentation">
          <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="rich-text-erase-title">
            <div id="rich-text-erase-title" className="modal-title">
              Erase all content?
            </div>
            <div className="modal-buttons">
              <button type="button" className="modal-button cancel" onClick={() => setShowEraseModal(false)}>
                Cancel
              </button>
              <button type="button" className="modal-button confirm" onClick={confirmErase}>
                Erase all
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
