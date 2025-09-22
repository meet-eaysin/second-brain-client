import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  EditorBubbleMenu,
  EditorCharacterCount,
  EditorClearFormatting,
  EditorFloatingMenu,
  EditorFormatBold,
  EditorFormatCode,
  EditorFormatItalic,
  EditorFormatStrike,
  EditorFormatSubscript,
  EditorFormatSuperscript,
  EditorFormatUnderline,
  EditorLinkSelector,
  EditorNodeBulletList,
  EditorNodeCode,
  EditorNodeHeading1,
  EditorNodeHeading2,
  EditorNodeHeading3,
  EditorNodeOrderedList,
  EditorNodeQuote,
  EditorNodeTable,
  EditorNodeTaskList,
  EditorNodeText,
  EditorProvider,
  EditorSelector,
  EditorTableColumnAfter,
  EditorTableColumnBefore,
  EditorTableColumnDelete,
  EditorTableColumnMenu,
  EditorTableDelete,
  EditorTableFix,
  EditorTableGlobalMenu,
  EditorTableHeaderColumnToggle,
  EditorTableHeaderRowToggle,
  EditorTableMenu,
  EditorTableMergeCells,
  EditorTableRowAfter,
  EditorTableRowBefore,
  EditorTableRowDelete,
  EditorTableRowMenu,
  EditorTableSplitCell,
} from "@/components/ui/kibo-ui/editor";
import { Button } from "@/components/ui/button";
import { Save, Loader2, X } from "lucide-react";
import { useDatabaseView } from "@/modules/database-view/context";
import {
  useRecord,
  useUpdateRecord,
} from "@/modules/database-view/services/database-queries";
import { toast } from "sonner";
import type { Editor, JSONContent } from "@/components/ui/kibo-ui/editor";
import type {
  TContentBlock,
  TTextAnnotations,
  TRichText,
  ERichTextType,
} from "@/modules/database-view/types";

// Import the correct enum from backend record types
enum EContentBlockType {
  PARAGRAPH = "paragraph",
  HEADING_1 = "heading_1",
  HEADING_2 = "heading_2",
  HEADING_3 = "heading_3",
  BULLETED_LIST_ITEM = "bulleted_list_item",
  NUMBERED_LIST_ITEM = "numbered_list_item",
  TO_DO = "to_do",
  TOGGLE = "toggle",
  QUOTE = "quote",
  DIVIDER = "divider",
  CODE = "code",
  CALLOUT = "callout",
  IMAGE = "image",
  VIDEO = "video",
  FILE = "file",
  BOOKMARK = "bookmark",
  EMBED = "embed",
  TABLE = "table",
  COLUMN_LIST = "column_list",
  COLUMN = "column",
}

interface EditorNode {
  type: string;
  content?: Array<{
    type: string;
    text?: string;
    marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
  }>;
  attrs?: Record<string, unknown>;
}

interface RecordEditorProps {
  databaseId: string;
  recordId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export function RecordEditor({
  databaseId,
  recordId,
  open,
  onOpenChange,
  className = "",
}: RecordEditorProps) {
  const { database } = useDatabaseView();

  const [content, setContent] = useState<JSONContent>({
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "Untitled" }],
      },
      {
        type: "paragraph",
        content: [],
      },
    ],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // API hooks - use records API instead of blocks
  const { data: recordData, isLoading: isLoadingRecord } = useRecord(
    databaseId!,
    recordId!
  );

  const updateRecordMutation = useUpdateRecord();

  // Load existing content
  useEffect(() => {
    if (recordData?.content && recordData.content.length > 0) {
      // Convert record content blocks to editor content
      const editorContent = convertBlocksToEditorContent(recordData.content);
      setContent(editorContent);
    }
  }, [recordData]);

  // Convert blocks to editor JSON content
  const convertBlocksToEditorContent = (
    blocks: TContentBlock[]
  ): JSONContent => {
    const content: JSONContent = {
      type: "doc",
      content: [],
    };

    blocks.forEach((block) => {
      // Convert block type to editor node type
      const node = convertBlockToEditorNode(block);
      if (node) {
        content.content!.push(node);
      }
    });

    return content;
  };

  // Convert individual block to editor node
  const convertBlockToEditorNode = (block: TContentBlock) => {
    const blockType = block.type;
    const blockContent = block.content || [];

    switch (blockType) {
      case EContentBlockType.PARAGRAPH:
        return {
          type: "paragraph",
          content: blockContent.map((item: TRichText) => ({
            type: "text",
            text: item.text?.content || "",
            marks: convertMarks(item.annotations || {}),
          })),
        };

      case EContentBlockType.HEADING_1:
        return {
          type: "heading",
          attrs: { level: 1 },
          content: blockContent.map((item: TRichText) => ({
            type: "text",
            text: item.text?.content || "",
            marks: convertMarks(item.annotations || {}),
          })),
        };

      case EContentBlockType.HEADING_2:
        return {
          type: "heading",
          attrs: { level: 2 },
          content: blockContent.map((item: TRichText) => ({
            type: "text",
            text: item.text?.content || "",
            marks: convertMarks(item.annotations || {}),
          })),
        };

      case EContentBlockType.HEADING_3:
        return {
          type: "heading",
          attrs: { level: 3 },
          content: blockContent.map((item: TRichText) => ({
            type: "text",
            text: item.text?.content || "",
            marks: convertMarks(item.annotations || {}),
          })),
        };

      case EContentBlockType.TO_DO:
        return {
          type: "taskItem",
          attrs: { checked: block.checked || false },
          content: [
            {
              type: "paragraph",
              content: blockContent.map((item: TRichText) => ({
                type: "text",
                text: item.text?.content || "",
                marks: convertMarks(item.annotations || {}),
              })),
            },
          ],
        };

      case EContentBlockType.TOGGLE:
        return {
          type: "details",
          content: [
            {
              type: "summary",
              content: blockContent.map((item: TRichText) => ({
                type: "text",
                text: item.text?.content || "",
                marks: convertMarks(item.annotations || {}),
              })),
            },
            // Children would be handled separately if supported
          ],
        };

      case EContentBlockType.BULLETED_LIST_ITEM:
        return {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: blockContent.map((item: TRichText) => ({
                type: "text",
                text: item.text?.content || "",
                marks: convertMarks(item.annotations || {}),
              })),
            },
          ],
        };

      case EContentBlockType.NUMBERED_LIST_ITEM:
        return {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: blockContent.map((item: TRichText) => ({
                type: "text",
                text: item.text?.content || "",
                marks: convertMarks(item.annotations || {}),
              })),
            },
          ],
        };

      case EContentBlockType.CODE:
        return {
          type: "codeBlock",
          attrs: { language: block.language || null },
          content: [
            {
              type: "text",
              text: blockContent
                .map((item: TRichText) => item.text?.content || "")
                .join(""),
            },
          ],
        };

      case EContentBlockType.QUOTE:
        return {
          type: "blockquote",
          content: [
            {
              type: "paragraph",
              content: blockContent.map((item: TRichText) => ({
                type: "text",
                text: item.text?.content || "",
                marks: convertMarks(item.annotations || {}),
              })),
            },
          ],
        };

      case EContentBlockType.DIVIDER:
        return {
          type: "horizontalRule",
        };

      case EContentBlockType.CALLOUT:
        return {
          type: "blockquote", // Using blockquote as closest approximation
          attrs: { class: "callout" },
          content: [
            {
              type: "paragraph",
              content: blockContent.map((item: TRichText) => ({
                type: "text",
                text: item.text?.content || "",
                marks: convertMarks(item.annotations || {}),
              })),
            },
          ],
        };

      case EContentBlockType.IMAGE:
        return {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: block.url ? `[Image: ${block.url}]` : "[Image]",
              marks: [{ type: "link", attrs: { href: block.url } }],
            },
          ],
        };

      case EContentBlockType.VIDEO:
        return {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: block.url ? `[Video: ${block.url}]` : "[Video]",
              marks: [{ type: "link", attrs: { href: block.url } }],
            },
          ],
        };

      case EContentBlockType.FILE:
        return {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: block.url ? `[File: ${block.url}]` : "[File]",
              marks: [{ type: "link", attrs: { href: block.url } }],
            },
          ],
        };

      case EContentBlockType.BOOKMARK:
        return {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: block.url ? `[Bookmark: ${block.url}]` : "[Bookmark]",
              marks: [{ type: "link", attrs: { href: block.url } }],
            },
          ],
        };

      case EContentBlockType.EMBED:
        return {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: block.url ? `[Embed: ${block.url}]` : "[Embed]",
              marks: [{ type: "link", attrs: { href: block.url } }],
            },
          ],
        };

      case EContentBlockType.TABLE:
        return {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "[Table - Not editable in rich text editor]",
            },
          ],
        };

      case EContentBlockType.COLUMN_LIST:
        return {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "[Column List - Not editable in rich text editor]",
            },
          ],
        };

      case EContentBlockType.COLUMN:
        return {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "[Column - Not editable in rich text editor]",
            },
          ],
        };

      default:
        return {
          type: "paragraph",
          content: [
            { type: "text", text: `Unsupported block type: ${blockType}` },
          ],
        };
    }
  };

  // Convert annotations to marks
  const convertMarks = (annotations: TTextAnnotations) => {
    const marks: Array<{ type: string; attrs?: Record<string, unknown> }> = [];

    if (annotations.bold) marks.push({ type: "bold" });
    if (annotations.italic) marks.push({ type: "italic" });
    if (annotations.strikethrough) marks.push({ type: "strike" });
    if (annotations.underline) marks.push({ type: "underline" });
    if (annotations.code) marks.push({ type: "code" });
    if (annotations.color && annotations.color !== "default") {
      marks.push({ type: "textStyle", attrs: { color: annotations.color } });
    }

    return marks;
  };

  // Handle editor updates
  const handleUpdate = ({ editor }: { editor: Editor }) => {
    const json = editor.getJSON();
    setContent(json);
    setHasUnsavedChanges(true);
  };

  // Save content
  const handleSave = async () => {
    if (!databaseId || !recordId || isSaving) return;

    setIsSaving(true);
    try {
      // Convert editor content back to blocks
      const blocks = convertEditorContentToBlocks(content);

      // Update the record with the new content
      await updateRecordMutation.mutateAsync({
        databaseId,
        recordId,
        payload: {
          content: blocks,
        },
      });

      setHasUnsavedChanges(false);
      toast.success("Content saved successfully");
    } catch (error) {
      console.error("Failed to save content:", error);
      toast.error("Failed to save content");
    } finally {
      setIsSaving(false);
    }
  };

  // Convert editor content to blocks
  const convertEditorContentToBlocks = (
    editorContent: JSONContent
  ): TContentBlock[] => {
    const blocks: TContentBlock[] = [];

    if (editorContent.content) {
      editorContent.content.forEach((node) => {
        const block = convertEditorNodeToBlock(node);
        if (block) {
          blocks.push(block);
        }
      });
    }

    return blocks;
  };

  // Convert editor node to block
  const convertEditorNodeToBlock = (node: EditorNode): TContentBlock | null => {
    const generateId = () => Math.random().toString(36).substr(2, 9);
    const now = new Date();

    switch (node.type) {
      case "heading": {
        const level = node.attrs?.level || 1;
        const type =
          level === 1
            ? EContentBlockType.HEADING_1
            : level === 2
            ? EContentBlockType.HEADING_2
            : EContentBlockType.HEADING_3;
        return {
          id: generateId(),
          type,
          content:
            node.content?.map((item) => ({
              type: ERichTextType.TEXT,
              text: { content: item.text || "" },
              annotations: convertMarksToAnnotations(item.marks || []),
              plain_text: item.text || "",
            })) || [],
          children: [],
          createdAt: now,
          createdBy: "user", // This should come from auth context
          lastEditedAt: now,
          lastEditedBy: "user",
        };
      }

      case "paragraph":
        return {
          id: generateId(),
          type: EContentBlockType.PARAGRAPH,
          content:
            node.content?.map((item) => ({
              type: ERichTextType.TEXT,
              text: { content: item.text || "" },
              annotations: convertMarksToAnnotations(item.marks || []),
              plain_text: item.text || "",
            })) || [],
          children: [],
          createdAt: now,
          createdBy: "user",
          lastEditedAt: now,
          lastEditedBy: "user",
        };

      case "taskItem":
        return {
          id: generateId(),
          type: EContentBlockType.TO_DO,
          checked: node.attrs?.checked || false,
          content:
            node.content?.[0]?.content?.map((item) => ({
              type: ERichTextType.TEXT,
              text: { content: item.text || "" },
              annotations: convertMarksToAnnotations(item.marks || []),
              plain_text: item.text || "",
            })) || [],
          children: [],
          createdAt: now,
          createdBy: "user",
          lastEditedAt: now,
          lastEditedBy: "user",
        };

      case "details":
        return {
          id: generateId(),
          type: EContentBlockType.TOGGLE,
          content:
            node.content?.[0]?.content?.map((item) => ({
              type: ERichTextType.TEXT,
              text: { content: item.text || "" },
              annotations: convertMarksToAnnotations(item.marks || []),
              plain_text: item.text || "",
            })) || [],
          children: [],
          createdAt: now,
          createdBy: "user",
          lastEditedAt: now,
          lastEditedBy: "user",
        };

      case "listItem":
        return {
          id: generateId(),
          type: EContentBlockType.BULLETED_LIST_ITEM,
          content:
            node.content?.[0]?.content?.map((item) => ({
              type: ERichTextType.TEXT,
              text: { content: item.text || "" },
              annotations: convertMarksToAnnotations(item.marks || []),
              plain_text: item.text || "",
            })) || [],
          children: [],
          createdAt: now,
          createdBy: "user",
          lastEditedAt: now,
          lastEditedBy: "user",
        };

      case "codeBlock":
        return {
          id: generateId(),
          type: EContentBlockType.CODE,
          language: node.attrs?.language || undefined,
          content: [
            {
              type: ERichTextType.TEXT,
              text: { content: node.content?.[0]?.text || "" },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
              plain_text: node.content?.[0]?.text || "",
            },
          ],
          children: [],
          createdAt: now,
          createdBy: "user",
          lastEditedAt: now,
          lastEditedBy: "user",
        };

      case "blockquote":
        return {
          id: generateId(),
          type: EContentBlockType.QUOTE,
          content:
            node.content?.[0]?.content?.map((item) => ({
              type: ERichTextType.TEXT,
              text: { content: item.text || "" },
              annotations: convertMarksToAnnotations(item.marks || []),
              plain_text: item.text || "",
            })) || [],
          children: [],
          createdAt: now,
          createdBy: "user",
          lastEditedAt: now,
          lastEditedBy: "user",
        };

      case "horizontalRule":
        return {
          id: generateId(),
          type: EContentBlockType.DIVIDER,
          content: [],
          children: [],
          createdAt: now,
          createdBy: "user",
          lastEditedAt: now,
          lastEditedBy: "user",
        };

      default:
        return null;
    }
  };

  // Convert marks to annotations
  const convertMarksToAnnotations = (
    marks: Array<{ type: string; attrs?: Record<string, unknown> }>
  ): TTextAnnotations => {
    const annotations: TTextAnnotations = {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: "default",
    };

    marks.forEach((mark) => {
      switch (mark.type) {
        case "bold":
          annotations.bold = true;
          break;
        case "italic":
          annotations.italic = true;
          break;
        case "strike":
          annotations.strikethrough = true;
          break;
        case "underline":
          annotations.underline = true;
          break;
        case "code":
          annotations.code = true;
          break;
        case "textStyle":
          if (mark.attrs?.color) {
            annotations.color = mark.attrs.color as string;
          }
          break;
      }
    });

    return annotations;
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to close?"
      );
      if (!confirmed) return;
    }
    onOpenChange(false);
  };

  const isFrozen = database?.isFrozen;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-w-6xl h-[90vh] flex flex-col ${className}`}
      >
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {database?.name || "Database"} - Record Editor
              {isFrozen && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                  Frozen
                </span>
              )}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {hasUnsavedChanges && (
                <span className="text-sm text-amber-600">Unsaved changes</span>
              )}
              <Button
                onClick={handleSave}
                disabled={isSaving || isFrozen}
                size="sm"
                className="gap-2"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save
                {isFrozen && <span className="ml-1 text-xs">(Frozen)</span>}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Record ID: {recordId}</p>
        </DialogHeader>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          {isLoadingRecord ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <EditorProvider
              className="h-full w-full overflow-y-auto rounded-none border-0 bg-background p-6"
              content={content}
              onUpdate={handleUpdate}
              placeholder="Start writing..."
              editable={!isFrozen}
            >
              <EditorFloatingMenu>
                <EditorNodeHeading1 hideName />
                <EditorNodeBulletList hideName />
                <EditorNodeQuote hideName />
                <EditorNodeCode hideName />
                <EditorNodeTable hideName />
              </EditorFloatingMenu>
              <EditorBubbleMenu>
                <EditorSelector title="Text">
                  <EditorNodeText />
                  <EditorNodeHeading1 />
                  <EditorNodeHeading2 />
                  <EditorNodeHeading3 />
                  <EditorNodeBulletList />
                  <EditorNodeOrderedList />
                  <EditorNodeTaskList />
                  <EditorNodeQuote />
                  <EditorNodeCode />
                </EditorSelector>
                <EditorSelector title="Format">
                  <EditorFormatBold />
                  <EditorFormatItalic />
                  <EditorFormatUnderline />
                  <EditorFormatStrike />
                  <EditorFormatCode />
                  <EditorFormatSuperscript />
                  <EditorFormatSubscript />
                </EditorSelector>
                <EditorLinkSelector />
                <EditorClearFormatting />
              </EditorBubbleMenu>
              <EditorTableMenu>
                <EditorTableColumnMenu>
                  <EditorTableColumnBefore />
                  <EditorTableColumnAfter />
                  <EditorTableColumnDelete />
                </EditorTableColumnMenu>
                <EditorTableRowMenu>
                  <EditorTableRowBefore />
                  <EditorTableRowAfter />
                  <EditorTableRowDelete />
                </EditorTableRowMenu>
                <EditorTableGlobalMenu>
                  <EditorTableHeaderColumnToggle />
                  <EditorTableHeaderRowToggle />
                  <EditorTableDelete />
                  <EditorTableMergeCells />
                  <EditorTableSplitCell />
                  <EditorTableFix />
                </EditorTableGlobalMenu>
              </EditorTableMenu>
              <EditorCharacterCount.Words>Words: </EditorCharacterCount.Words>
            </EditorProvider>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
