"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TipTapEditorExtensions } from "./extensions";
import { TipTapEditorProps } from "./props";
import { PatchDocType } from "@/app/api/documents/[publicId]/route";
import { useDebouncedCallback } from "use-debounce";


export default function Editor({
  document,
  publicId,
}: {
  document: PatchDocType;
  publicId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<string>("Saved");
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [content, setContent] = useState<PatchDocType["document"]>();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [selectedText, setSelectedText] = useState<string>("")
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [showInput, setShowInput] = useState(false); // Added this line


  async function patchRequest(publicId: string, title: string, document: any) {
    const response = await fetch(`/api/documents/${publicId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        document: document,
      }),
    });

    if (!response.ok) {
      setSaveStatus("Waiting to Save.");
      throw new Error("Failed to update document");
    }

    setSaveStatus("Saved");

    startTransition(() => {
      // Force a cache invalidation.
      router.refresh();
    });
  }

  const debouncedUpdates = useDebouncedCallback(async ({ editor }) => {
    const json = editor.getJSON();
    setContent(json);
    await patchRequest(publicId, document.title, json);
    // Simulate a delay in saving.
    setTimeout(() => {
      setSaveStatus("Saved");
    }, 500);
  }, 1000);

  const editor = useEditor({
    extensions: TipTapEditorExtensions,
    editorProps: TipTapEditorProps,
    onUpdate: (e) => {
      setSaveStatus("Saving...");
      debouncedUpdates(e);
    },
    onSelectionUpdate: ({ editor }) => {
      setIsTextSelected(!editor.state.selection.empty);
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to);
      setSelectedText(text);
    },
    content: content,
  });

// Hydrate the editor with the content from the database.
useEffect(() => {
  if (editor && document && !hydrated) {
    editor.commands.setContent(document.document);
    setHydrated(true);
  }
}, [editor, document, hydrated]);

  return (
    <div
      onClick={() => {
        editor?.chain().focus().run();
      }}
      className="relative flex flex-col items-center w-full min-h-screen p-32 cursor-text"
    >
    

      <nav className="flex items-start justify-between w-full px-2 py-2 text-white bg-black rounded-t">
      <button 
  className="px-2 transition-colors duration-200 bg-gray-800 rounded hover:bg-gray-300"
  onClick={() => setShowDropdown(!showDropdown)}
  disabled={!isTextSelected}
>
  AI
</button>
        {showDropdown && (
          <div className="absolute top-0 right-0 w-48 py-2 mt-2 bg-white rounded-lg shadow-xl">
            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
               onClick={() => {
                 editor?.chain().focus().aiComplete({ text: selectedText }).run();
               }}
            >Complete</a>
            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
               onClick={() => {
                 editor?.chain().focus().aiShorten({ text: selectedText }).run();
               }}
            >Shorten</a>
            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
               onClick={() => {
                 editor?.chain().focus().aiExtend({ text: selectedText }).run();
               }}
            >Extend</a>
            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
               onClick={() => {
                 editor?.chain().focus().aiRephrase({ text: selectedText }).run();
               }}
            >Rephrase</a>
            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
               onClick={() => {
                 editor?.chain().focus().aiSimplify({ text: selectedText }).run();
               }}
            >Simplify</a>
            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
               onClick={() => {
                 editor?.chain().focus().aiFixSpellingAndGrammar({ text: selectedText }).run();
               }}
            >Spelling & Grammar</a>
            <div className="border-t border-gray-200"></div>
            <a href="#" className="relative block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white group">
              Tone of Voice &#9654;
  <div className="absolute top-0 w-48 py-2 transition-opacity duration-200 bg-white rounded-lg shadow-xl opacity-0 left-full group-hover:opacity-100">
    <a
      href="#"
      className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
      onClick={() => {
        editor?.chain().focus().aiAdjustTone('academic', { strength: 'medium' }).run();
      }}
    >
      Academic
    </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
                  onClick={() => {
                    editor?.chain().focus().aiAdjustTone('confident', { strength: 'medium' }).run();
                  }}
                >
                  Confident
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
                  onClick={() => {
                    editor?.chain().focus().aiAdjustTone('excited', { strength: 'medium' }).run();
                  }}
                >
                  Excited
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
                  onClick={() => {
                    editor?.chain().focus().aiAdjustTone('formal', { strength: 'medium' }).run();
                  }}
                >
                  Formal
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
                  onClick={() => {
                    editor?.chain().focus().aiAdjustTone('friendly', { strength: 'medium' }).run();
                  }}
                >
                  Friendly
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
                  onClick={() => {
                    editor?.chain().focus().aiAdjustTone('funny', { strength: 'medium' }).run();
                  }}
                >
                  Funny
                </a>
              </div>
            </a>
            <a href="#" className="relative block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white group">
  Translate &#9654;
  <div className="absolute top-0 w-48 py-2 transition-opacity duration-200 bg-white rounded-lg shadow-xl opacity-0 left-full group-hover:opacity-100">
    <a
      href="#"
      className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
      onClick={() => {
        editor?.chain().focus().aiTranslate('en').run();
      }}
    >
      English
    </a>
    <a
      href="#"
      className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
      onClick={() => {
        editor?.chain().focus().aiTranslate('es').run();
      }}
    >
      Spanish
    </a>
    <a
      href="#"
      className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
      onClick={() => {
        editor?.chain().focus().aiTranslate('fr').run();
      }}
    >
      French
    </a>
    <a
      href="#"
      className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
      onClick={() => {
        editor?.chain().focus().aiTranslate('nl').run();
      }}
    >
      Dutch
    </a>
    <a
      href="#"
      className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
      onClick={() => {
        editor?.chain().focus().aiTranslate('sv').run();
      }}
    >
      Swedish
    </a>
  </div>
</a>
          </div>
        )}
      </nav>
      <div className="w-full max-w-screen-lg ">
        <div className="absolute px-2 py-1 text-sm text-gray-400 bg-gray-100 rounded-lg left-8 top-8">
          {saveStatus}
        </div>
        <h1 className="mb-8 text-6xl font-bold">{document.title}</h1>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}


