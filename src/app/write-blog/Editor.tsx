"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapImage from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, Quote, Plus, Image as ImageIcon, Code, MoreHorizontal, Loader2, Trash2, Replace, Link as LinkIcon, Type } from "lucide-react";
import { uploadEditorImage } from "@/actions/blog";

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function Editor({ value, onChange }: EditorProps) {
  const [isFloatingOpen, setIsFloatingOpen] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  type DialogConfig = {
    isOpen: boolean;
    type: "alert" | "prompt";
    title: string;
    message: string;
    inputValue?: string;
    onConfirm?: (val?: string) => void;
    onCancel?: () => void;
  };
  const [dialog, setDialog] = React.useState<DialogConfig | null>(null);

  const showAlert = (title: string, message: string) => {
    setDialog({
      isOpen: true,
      type: "alert",
      title,
      message,
      onConfirm: () => setDialog(null),
    });
  };

  const showPrompt = (title: string, message: string, defaultValue: string): Promise<string | null> => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        type: "prompt",
        title,
        message,
        inputValue: defaultValue,
        onConfirm: (val) => {
          setDialog(null);
          resolve(val || "");
        },
        onCancel: () => {
          setDialog(null);
          resolve(null);
        },
      });
    });
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Save the current cursor position before focus is lost to the file dialog/upload process
    const currentPosition = editor?.state.selection.anchor;
    console.log("Saved cursor position:", currentPosition);

    // Check File Size (Max 500KB)
    const MAX_FILE_SIZE = 500 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      showAlert("File Too Large", "Image size must be less than 500 KB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);
    
    // Check Landscape orientation
    const img = new window.Image();
    img.onload = async () => {
      // Check if landscape
      if (img.width <= img.height) {
        showAlert("Invalid Dimensions", "Please upload a landscape image (width must be greater than height).");
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        console.log("Uploading image...");
        const result = await uploadEditorImage(formData);
        console.log("Upload result:", result);
        
        if (result.url && editor) {
          console.log("Inserting image URL:", result.url, "at position:", currentPosition);
          
          const chain = editor.chain();
          
          if (currentPosition !== undefined && currentPosition !== null) {
            // Insert exactly where the cursor was
            chain.insertContentAt(currentPosition, {
              type: 'image',
              attrs: { src: result.url }
            })
            // Move cursor to after the image and add a new paragraph
            .setTextSelection(currentPosition + 1)
            .insertContent('<p></p>');
          } else {
            // Fallback if position was lost
            chain.focus().setImage({ src: result.url }).insertContent('<p></p>');
          }
          
          chain.run();
          console.log("Image insertion command executed");
        } else if (result.error) {
          showAlert("Upload Failed", result.error);
        }
      } catch (error) {
        console.error("Image upload error:", error);
        showAlert("Error", "An error occurred during upload.");
      } finally {
        setIsUploading(false);
        setIsFloatingOpen(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    img.src = URL.createObjectURL(file);
  };
  
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TiptapImage.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-[15px] mx-auto block max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-green-600 underline cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder: "Tell your story...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        className:
          "prose prose-lg dark:prose-invert prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-headings:text-gray-900 dark:prose-headings:text-white max-w-none focus:outline-none min-h-[85vh]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <>
    <div 
      className="relative w-full min-h-[85vh] group cursor-text border-none outline-none"
      onClick={() => editor.chain().focus().run()}
    >
      <style>{`
        .tiptap img {
          border-radius: 15px;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
        .tiptap:focus {
          outline: none;
        }
        .tiptap {
          outline: none;
          border: none;
        }
        .tiptap h1 {
          font-size: 2.5rem;
          font-weight: 800;
          line-height: 1.2;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .tiptap h2 {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1.3;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .tiptap h3 {
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.4;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .tiptap p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
      
      <BubbleMenu
        editor={editor}
        shouldShow={({ editor }) => editor.isActive("image")}
        // @ts-ignore
        tippyOptions={{ placement: 'bottom' }}
        className="flex items-center gap-1 p-1 bg-slate-900 dark:bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden"
      >
        <button
          type="button"
          onClick={async () => {
            const currentAlt = editor.getAttributes("image").alt || "";
            const newAlt = await showPrompt("Image Alt Text", "Enter alt text for SEO:", currentAlt);
            if (newAlt !== null) {
              editor.chain().focus().updateAttributes("image", { alt: newAlt }).run();
            }
          }}
          className="p-2 rounded hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
          title="Add Alt Text"
        >
          <Type size={18} />
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
          title="Replace Image"
        >
          <Replace size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().deleteSelection().run()}
          className="p-2 rounded hover:bg-red-600 text-gray-400 hover:text-white transition-colors"
          title="Delete Image"
        >
          <Trash2 size={18} />
        </button>
      </BubbleMenu>

      <BubbleMenu
        editor={editor}
        shouldShow={({ editor, state, from, to }) => {
          return !editor.isActive("image") && from !== to;
        }}
        // @ts-ignore
        tippyOptions={{ placement: 'bottom', flip: false }}
        className="flex items-center gap-1 p-1 bg-slate-900 dark:bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-x-auto"
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-slate-700 transition-colors ${editor.isActive("bold") ? "bg-slate-700 text-white" : "text-gray-400"}`}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-slate-700 transition-colors ${editor.isActive("italic") ? "bg-slate-700 text-white" : "text-gray-400"}`}
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-slate-700 transition-colors ${editor.isActive("strike") ? "bg-slate-700 text-white" : "text-gray-400"}`}
          title="Strike"
        >
          <Strikethrough size={18} />
        </button>
        
        <button
          type="button"
          onClick={async () => {
            const previousUrl = editor.getAttributes('link').href;
            const url = await showPrompt("Add Link", "Enter URL:", previousUrl || "");
            
            // cancelled
            if (url === null) {
              return;
            }
            // empty
            if (url === '') {
              editor.chain().focus().extendMarkRange('link').unsetLink().run();
              return;
            }
            // update link
            let validUrl = url;
            if (!validUrl.match(/^(https?:\/\/|mailto:|tel:|\/|#)/i)) {
              validUrl = `https://${validUrl}`;
            }
            editor.chain().focus().extendMarkRange('link').setLink({ href: validUrl }).run();
          }}
          className={`p-2 rounded hover:bg-slate-700 transition-colors ${editor.isActive("link") ? "bg-slate-700 text-white" : "text-gray-400"}`}
          title="Add Link"
        >
          <LinkIcon size={18} />
        </button>

        <div className="w-px h-6 bg-slate-700 mx-1"></div>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-slate-700 transition-colors ${editor.isActive("heading", { level: 1 }) ? "bg-slate-700 text-white" : "text-gray-400"}`}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-slate-700 transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-slate-700 text-white" : "text-gray-400"}`}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-slate-700 transition-colors ${editor.isActive("heading", { level: 3 }) ? "bg-slate-700 text-white" : "text-gray-400"}`}
          title="Heading 3"
        >
          <Heading3 size={18} />
        </button>
        
        <div className="w-px h-6 bg-slate-700 mx-1"></div>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-slate-700 transition-colors ${editor.isActive("blockquote") ? "bg-slate-700 text-white" : "text-gray-400"}`}
          title="Blockquote"
        >
          <Quote size={18} />
        </button>
      </BubbleMenu>

      <FloatingMenu
        editor={editor}
        pluginKey="floatingMenu"
        // @ts-ignore
        tippyOptions={{ placement: 'left' }}
        shouldShow={({ state }) => {
          const { selection } = state;
          const { $from, empty } = selection;
          return empty && $from.parent.isTextblock && $from.parent.content.size === 0;
        }}
        className="flex items-center gap-2 translate-x-[calc(100vw-5rem)] md:translate-x-[650px]"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsFloatingOpen(!isFloatingOpen)}
            className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all ${isFloatingOpen ? 'border-slate-400 rotate-45' : 'border-slate-300 dark:border-slate-700'} hover:border-slate-500 text-slate-500`}
          >
            <Plus size={18} />
          </button>
          
          {isFloatingOpen && (
            <div className="flex items-center gap-2 bg-transparent animate-in fade-in slide-in-from-left-4 duration-300">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center justify-center w-8 h-8 rounded-full border border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors bg-white dark:bg-slate-900 disabled:opacity-50"
                title="Upload Image"
              >
                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  editor?.chain().focus().toggleCodeBlock().run();
                  setIsFloatingOpen(false);
                }}
                className="flex items-center justify-center w-8 h-8 rounded-full border border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors bg-white dark:bg-slate-900"
                title="Add Code Block"
              >
                <Code size={16} />
              </button>

              <button
                type="button"
                onClick={() => {
                  editor?.chain().focus().setHorizontalRule().run();
                  setIsFloatingOpen(false);
                }}
                className="flex items-center justify-center w-8 h-8 rounded-full border border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors bg-white dark:bg-slate-900"
                title="Add Divider"
              >
                <MoreHorizontal size={16} />
              </button>
            </div>
          )}
        </div>
      </FloatingMenu>
      
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleImageUpload} 
      />
      
      
      <EditorContent editor={editor} />
    </div>

      {dialog?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 dark:border-slate-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{dialog.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">{dialog.message}</p>
            
            {dialog.type === "prompt" && (
              <input
                type="text"
                defaultValue={dialog.inputValue}
                onChange={(e) => {
                  dialog.inputValue = e.target.value;
                }}
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 mb-6"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && dialog.onConfirm) dialog.onConfirm(dialog.inputValue);
                  if (e.key === 'Escape' && dialog.onCancel) dialog.onCancel();
                }}
              />
            )}
            
            <div className="flex gap-3 justify-end">
              {dialog.type === "prompt" && (
                <button
                  onClick={dialog.onCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => dialog.onConfirm && dialog.onConfirm(dialog.inputValue)}
                className="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                {dialog.type === "prompt" ? "Save" : "OK"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}