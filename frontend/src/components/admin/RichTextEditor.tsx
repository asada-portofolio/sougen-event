import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo, Heading2 } from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  // Sync external content changes (e.g. initial load)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleHeading = () => editor.chain().focus().toggleHeading({ level: 2 }).run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();
  const undo = () => editor.chain().focus().undo().run();
  const redo = () => editor.chain().focus().redo().run();

  return (
    <div className="border border-admin-border rounded-lg overflow-hidden bg-white focus-within:border-sougen-blue focus-within:ring-1 focus-within:ring-sougen-blue transition-all">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-admin-border p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={toggleBold}
          className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'bg-sougen-blue/10 text-sougen-blue' : 'text-gray-500 hover:bg-gray-200'}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={toggleItalic}
          className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'bg-sougen-blue/10 text-sougen-blue' : 'text-gray-500 hover:bg-gray-200'}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={toggleHeading}
          className={`p-1.5 rounded transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-sougen-blue/10 text-sougen-blue' : 'text-gray-500 hover:bg-gray-200'}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        <button
          type="button"
          onClick={toggleBulletList}
          className={`p-1.5 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-sougen-blue/10 text-sougen-blue' : 'text-gray-500 hover:bg-gray-200'}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={toggleOrderedList}
          className={`p-1.5 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-sougen-blue/10 text-sougen-blue' : 'text-gray-500 hover:bg-gray-200'}`}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={toggleBlockquote}
          className={`p-1.5 rounded transition-colors ${editor.isActive('blockquote') ? 'bg-sougen-blue/10 text-sougen-blue' : 'text-gray-500 hover:bg-gray-200'}`}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        <button
          type="button"
          onClick={undo}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="bg-white min-h-[200px]" />
    </div>
  );
}
