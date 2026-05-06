"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { UploadCloud, Loader2, X, Plus, Type, Replace, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { submitBlogForReview } from "@/actions/blog";

// Dynamically import the editor to prevent SSR issues with TipTap
const TipTapEditor = dynamic(() => import("./Editor"), { ssr: false });

export default function WriteBlogPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    metaDescription: "",
    featuredImage: null as File | null,
    featuredImageAlt: "",
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  type DialogConfig = {
    isOpen: boolean;
    type: "alert" | "prompt";
    title: string;
    message: string;
    inputValue?: string;
    onConfirm?: (val?: string) => void;
    onCancel?: () => void;
  };
  const [dialog, setDialog] = useState<DialogConfig | null>(null);

  const showAlert = (title: string, message: string, onConfirm?: () => void) => {
    setDialog({
      isOpen: true,
      type: "alert",
      title,
      message,
      onConfirm: () => {
        setDialog(null);
        if (onConfirm) onConfirm();
      },
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSeen = localStorage.getItem("blog_editor_tutorial");
      if (!hasSeen) {
        setShowTutorial(true);
      }
      
      const draft = localStorage.getItem("blog_draft");
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          if (parsed.title) {
            setFormData(prev => ({ 
              ...prev, 
              title: parsed.title, 
              slug: parsed.slug || prev.slug, 
              metaDescription: parsed.metaDescription || prev.metaDescription,
              featuredImageAlt: parsed.featuredImageAlt || prev.featuredImageAlt
            }));
          }
          if (parsed.editorContent) setEditorContent(parsed.editorContent);
        } catch(e) {}
      }
    }
  }, []);

  useEffect(() => {
    if (formData.title || editorContent) {
      setIsAutoSaving(true);
      const timer = setTimeout(() => {
        localStorage.setItem("blog_draft", JSON.stringify({
          title: formData.title,
          slug: formData.slug,
          metaDescription: formData.metaDescription,
          featuredImageAlt: formData.featuredImageAlt,
          editorContent: editorContent
        }));
        setIsAutoSaving(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData.title, formData.slug, formData.metaDescription, formData.featuredImageAlt, editorContent]);

  const closeTutorial = () => {
    localStorage.setItem("blog_editor_tutorial", "true");
    setShowTutorial(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({ ...prev, title, slug }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const MAX_FILE_SIZE = 500 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        showAlert("File Too Large", "Featured image size must be less than 500 KB.");
        e.target.value = "";
        return;
      }
      
      const img = new window.Image();
      img.onload = () => {
        if (img.width <= img.height) {
          showAlert("Invalid Dimensions", "Please upload a landscape image (width must be greater than height).");
          e.target.value = "";
          return;
        }
        setFormData((prev) => ({ ...prev, featuredImage: file }));
        setImagePreview(URL.createObjectURL(file));
      };
      img.src = URL.createObjectURL(file);
    }
  };
  
  const removeImage = () => {
    setFormData((prev) => ({ ...prev, featuredImage: null }));
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strip HTML to see if there's actual text content
    const plainText = editorContent.replace(/<[^>]*>?/gm, '').trim();
    if (!editorContent || plainText.length === 0) {
      showAlert("Missing Content", "Please write some content before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("slug", formData.slug);
      data.append("description", formData.metaDescription);
      
      if (formData.featuredImage) {
        data.append("image", formData.featuredImage);
      }
      if (formData.featuredImageAlt) {
        data.append("imageAlt", formData.featuredImageAlt);
      }

      await submitBlogForReview(data, editorContent);
      
      // Forcefully clear state and local storage immediately to prevent auto-save from restoring it
      setFormData({
        title: "",
        slug: "",
        metaDescription: "",
        featuredImage: null,
        featuredImageAlt: "",
      });
      setEditorContent("");
      setImagePreview(null);
      localStorage.removeItem("blog_draft");
      
      showAlert(
        "Article Submitted", 
        "Your article has been successfully submitted for review. Our editorial team will read it, and it will be published shortly.", 
        () => {
          router.push("/blogs");
        }
      );
    } catch (error: any) {
      console.error("Submission failed:", error);
      showAlert("Submission Error", `Error submitting blog: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const plainText = editorContent.replace(/<[^>]*>?/gm, '').trim();
  const wordCount = plainText.length > 0 ? plainText.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <>
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-3xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 mt-2">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md pt-6 pb-4 mb-8 border-b border-gray-100 dark:border-slate-800/50 flex justify-between items-center -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm">
              <span>Draft</span>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <div className="flex items-center gap-2 transition-all">
                {isAutoSaving ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-green-500" />
                    <span className="text-gray-400">Saving...</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                    <span className="text-green-600 dark:text-green-500 font-medium">Saved</span>
                  </>
                )}
              </div>
              <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">•</span>
              <span className="hidden sm:inline text-xs text-gray-400 font-mono">{wordCount} words ({readTime} min read)</span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              suppressHydrationWarning
              className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm font-medium transition-colors focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish"
              )}
            </button>
          </div>

          <div className="space-y-6">
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full bg-transparent text-4xl md:text-5xl font-bold text-gray-900 dark:text-white border-none outline-none placeholder-gray-300 dark:placeholder-gray-700 py-6"
              placeholder="Title"
            />

            <input
              type="text"
              id="slug"
              required
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full bg-transparent text-sm md:text-base text-gray-500 dark:text-gray-400 border-none outline-none placeholder-gray-300 dark:placeholder-gray-700 font-mono py-2"
              placeholder="url-slug"
            />
            
            <textarea
              id="metaDesc"
              rows={2}
              required
              value={formData.metaDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
              className="w-full bg-transparent text-lg md:text-xl text-gray-600 dark:text-gray-400 border-none outline-none placeholder-gray-300 dark:placeholder-gray-700 resize-none overflow-hidden py-4"
              placeholder="Add a subtle meta description..."
              style={{ minHeight: '120px' }}
            />
          </div>

          <div className="py-2">
            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
            {imagePreview ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
                <img src={imagePreview} alt={formData.featuredImageAlt || "Featured"} className="object-cover w-full h-full" />
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 p-1.5 rounded-lg backdrop-blur-sm">
                  <button
                    type="button"
                    onClick={async () => {
                      const newAlt = await showPrompt("Cover Image Alt Text", "Enter alt text for SEO:", formData.featuredImageAlt);
                      if (newAlt !== null) {
                        setFormData(prev => ({ ...prev, featuredImageAlt: newAlt }));
                      }
                    }}
                    className="p-1.5 rounded hover:bg-slate-700 text-gray-300 hover:text-white transition-colors"
                    title="Add Alt Text"
                  >
                    <Type className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const fileInput = document.getElementById("file-upload");
                      if (fileInput) fileInput.click();
                    }}
                    className="p-1.5 rounded hover:bg-slate-700 text-gray-300 hover:text-white transition-colors"
                    title="Replace Cover"
                  >
                    <Replace className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="p-1.5 rounded hover:bg-red-600 text-gray-300 hover:text-white transition-colors"
                    title="Remove Cover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex items-center gap-2"
                >
                  <UploadCloud className="w-5 h-5" />
                  <span className="text-sm font-medium">Add a cover image (optional)</span>
                </label>
              </div>
            )}
          </div>

          {/* TipTap Editor Section */}
          <div className="min-h-[85vh]">
            <TipTapEditor value={editorContent} onChange={setEditorContent} />
          </div>

        </form>
      </div>
    </div>
    
    {showTutorial && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-8 relative shadow-2xl border border-gray-100 dark:border-slate-800">
          <button 
            onClick={closeTutorial}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Welcome to the Editor</h3>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 font-bold">1</div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Format Text</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Highlight any text to reveal the formatting menu for bold, italics, headings, and links.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 font-bold">2</div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Add Media</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Click the <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-gray-400 mx-1"><Plus size={12}/></span> icon on any empty line to add images, dividers, or code blocks.</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={closeTutorial}
            className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl transition-colors"
          >
            Got it, let's write!
          </button>
        </div>
      </div>
    )}

    {dialog?.isOpen && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{dialog.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{dialog.message}</p>
          
          {dialog.type === "prompt" && (
            <input
              type="text"
              autoFocus
              value={dialog.inputValue || ""}
              onChange={(e) => setDialog(prev => prev ? { ...prev, inputValue: e.target.value } : null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && dialog.onConfirm) {
                  dialog.onConfirm(dialog.inputValue);
                } else if (e.key === "Escape" && dialog.onCancel) {
                  dialog.onCancel();
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg mb-6 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          )}

          <div className="flex gap-3 justify-end mt-2">
            {dialog.type === "prompt" && (
              <button
                onClick={dialog.onCancel || (() => setDialog(null))}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={() => dialog.onConfirm ? dialog.onConfirm(dialog.inputValue) : setDialog(null)}
              className="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}