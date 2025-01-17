import React, {
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useRef,
  useLayoutEffect,
} from "react";
import { Editor, Range, Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  MessageSquarePlus,
  Text,
} from "lucide-react";

interface CommandItemProps {
  title: string;
  description: string;
  icon: ReactNode;
}

interface Command {
  editor: Editor;
  range: Range;
}

const Command = Extension.create({
  name: "slash-command",
  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: any;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});


const getSuggestionItems = ({ query }: { query: string }) => {
  const customPrompt = "create a blog post about zoe"; 
  // const [customPrompt, setCustomPrompt] = useState("");


  return [
    {
      title: "Heading 1",
      description: "Big section heading.",
      icon: <Heading1 size={18} />,
      command: ({ editor, range }: Command) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 1 })
          .run();
      },
    },
    {
      title: "Heading 2",
      description: "Medium section heading.",
      icon: <Heading2 size={18} />,
      command: ({ editor, range }: Command) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 2 })
          .run();
      },
    },
    {
      title: "Heading 3",
      description: "Small section heading.",
      icon: <Heading3 size={18} />,
      command: ({ editor, range }: Command) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 3 })
          .run();
      },
    },
    {
      title: "Text",
      description: "Just start typing with plain text.",
      icon: <Text size={18} />,
      command: ({ editor, range }: Command) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .run();
      },
    },
    {
      title: "Bold",
      description: "Make text bold.",
      icon: <Bold size={18} />,
      command: ({ editor, range }: Command) => {
        editor.chain().focus().deleteRange(range).setMark("bold").run();
      },
    },
    {
      title: "Italic",
      description: "Make text italic.",
      icon: <Italic size={18} />,
      command: ({ editor, range }: Command) => {
        editor.chain().focus().deleteRange(range).setMark("italic").run();
      },
    },
    {
      title: "Bullet List",
      description: "Create a simple bullet list.",
      icon: <List size={18} />,
      command: ({ editor, range }: Command) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: "Numbered List",
      description: "Create a list with numbering.",
      icon: <ListOrdered size={18} />,
      command: ({ editor, range }: Command) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: "Blog Post",
      description: "Create a blog post with AI.",
      icon: <ListOrdered size={18} />, // Replace YourIconComponent with your actual icon component
      command: ({ editor, range }: Command) => {
        editor?.chain().focus().aiTextPrompt({text: customPrompt}).run()
      },
    },
    {
      title: "Short Story",
      description: "Create a short story with AI.",
      icon: <ListOrdered size={18} />, // Replace YourIconComponent with your actual icon component
      command: ({ editor, range }: Command) => {
        const customPrompt = "create a short story about zoe";
        editor?.chain().focus().aiTextPrompt({text: customPrompt}).run()
      },
    },
    {
      title: "Essay",
      description: "Create an essay with AI.",
      icon: <ListOrdered size={18} />, // Replace YourIconComponent with your actual icon component
      command: ({ editor, range }: Command) => {
        const customPrompt = "write an essay about zoe";
        editor?.chain().focus().aiTextPrompt({text: customPrompt}).run()
      },
    },
    {
      title: "Job Description",
      description: "Create a job description with AI.",
      icon: <ListOrdered size={18} />, // Replace YourIconComponent with your actual icon component
      command: ({ editor, range }: Command) => {
        const customPrompt = "create a job description for a software engineer";
        editor?.chain().focus().aiTextPrompt({text: customPrompt}).run()
      },
    },
    {
      title: "Instagram Caption",
      description: "Create an Instagram caption with AI.",
      icon: <ListOrdered size={18} />, // Replace YourIconComponent with your actual icon component
      command: ({ editor, range }: Command) => {
        const customPrompt = "create an Instagram caption about a beach vacation";
        editor?.chain().focus().aiTextPrompt({text: customPrompt}).run()
      },
    },
    {
      title: "Content Lists",
      description: "Create a content list with AI.",
      icon: <ListOrdered size={18} />, // Replace YourIconComponent with your actual icon component
      command: ({ editor, range }: Command) => {
        const customPrompt = "create a list of content ideas for a tech blog";
        editor?.chain().focus().aiTextPrompt({text: customPrompt}).run()
      },
    },
    {
      title: "Tweet Composer",
      description: "Compose a tweet with AI.",
      icon: <ListOrdered size={18} />, // Replace YourIconComponent with your actual icon component
      command: ({ editor, range }: Command) => {
        const customPrompt = "compose a tweet about the latest tech news";
        editor?.chain().focus().aiTextPrompt({text: customPrompt}).run()
      },
    }
  ].filter((item) => {
    if (typeof query === "string" && query.length > 0) {
      return item.title.toLowerCase().includes(query.toLowerCase());
    }
    return true;
  });
  // .slice(0, 10);
};

export const updateScrollView = (container: HTMLElement, item: HTMLElement) => {
  const containerHeight = container.offsetHeight;
  const itemHeight = item ? item.offsetHeight : 0;

  const top = item.offsetTop;
  const bottom = top + itemHeight;

  if (top < container.scrollTop) {
    container.scrollTop -= container.scrollTop - top + 5;
  } else if (bottom > containerHeight + container.scrollTop) {
    container.scrollTop += bottom - containerHeight - container.scrollTop + 5;
  }
};

const CommandList = ({
  items,
  command,
  renderInput,
  onEnter,
}: {
  items: CommandItemProps[];
  command: any;
  renderInput?: boolean;
  onEnter?: (text: string) => void;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const commandListContainer = useRef<HTMLDivElement>(null);
  const selectedButtonRef = useRef<HTMLButtonElement>(null);
  const [inputText, setInputText] = useState("");
  const [customPrompt, setCustomPrompt] = useState(""); // Moved here
  const [showInput, setShowInput] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null); // Added this line

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];
      if (item) {
        command(item);
      }
    },
    [command, items]
  );
  useEffect(() => {
    const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];
    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();
        if (e.key === "ArrowUp") {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
          return true;
        }
        if (e.key === "ArrowDown") {
          setSelectedIndex((selectedIndex + 1) % items.length);
          return true;
        }
        if (e.key === "Enter") {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [items, selectedIndex, setSelectedIndex, selectItem]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  useEffect(() => {
    const container = commandListContainer.current;
    const item = selectedButtonRef.current;

    if (item && container) {
      container.scrollTop = item.offsetTop - container.offsetTop;

      item.focus();
    }

    if (selectedIndex === 0 && items.length > 0) {
      setTimeout(() => {
        selectedButtonRef.current?.focus();
      }, 10);
    }
  }, [selectedIndex, items]);

  return items.length > 0 ? (
    
    <div
      ref={commandListContainer}
      className="relative z-50 h-auto max-h-[330px] w-72 overflow-y-auto scroll-smooth rounded-md border border-gray-200 bg-white px-1 py-2 shadow-md transition-all"
    >
      {hoveredItem === "Blog Post" && (
        <div>
             <input
               type="text"
               placeholder="Enter custom prompt"
               className="absolute right-0 w-48 p-2 ml-4 bg-white border border-gray-200 rounded-md"
               onChange={(e) => setCustomPrompt(e.target.value)}
             />
             </div>
           )}
           
      {items.map((item: CommandItemProps, index: number) => {
        const isSelected = index === selectedIndex;
        return (
          <div key={index}>
            <button
              ref={isSelected ? selectedButtonRef : null}
              className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-gray-900 hover:bg-gray-100 ${
                isSelected ? "bg-gray-100 text-gray-900" : ""
              }`}
              key={index}
              onClick={() => selectItem(index)}
              onMouseEnter={() => setHoveredItem(item.title)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-md">
                {item.icon}
              </div>
              <div className="flex-grow">
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </button>
           
          </div>
        );
      })}
    </div>
    
  ) : null;
};

const renderItems = () => {
  let component: ReactRenderer | null = null;
  let popup: any | null = null;

  return {
    onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
      component = new ReactRenderer(CommandList, {
        props,
        editor: props.editor,
      });

      // @ts-ignore
      popup = tippy("body", {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
      });
    },
    onUpdate: (props: { editor: Editor; clientRect: DOMRect }) => {
      component?.updateProps(props);

      popup &&
        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
    },
    onKeyDown: (props: { event: KeyboardEvent }) => {
      if (props.event.key === "Escape") {
        popup?.[0].hide();

        return true;
      }

      // @ts-ignore
      return component?.ref?.onKeyDown(props);
    },
    onExit: () => {
      popup?.[0].destroy();
      component?.destroy();
    },
  };
};

const SlashCommand = Command.configure({
  suggestion: {
    items: getSuggestionItems,
    render: renderItems,
  },
});

export default SlashCommand;
