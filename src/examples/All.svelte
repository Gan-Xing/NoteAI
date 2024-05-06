<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Editor, type Content, type Editor as TiptapEditor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import Underline from '@tiptap/extension-underline';
  import TextAlign from '@tiptap/extension-text-align';
  import Superscript from '@tiptap/extension-superscript';
  import Subscript from '@tiptap/extension-subscript';
  import Table from '@tiptap/extension-table';
  import TableCell from '@tiptap/extension-table-cell';
  import TableHeader from '@tiptap/extension-table-header';
  import TableRow from '@tiptap/extension-table-row';
  import Image from '@tiptap/extension-image';
  type Level = 1 | 2 | 3 | 4 | 5 | 6;
  let editor: TiptapEditor | null = null;
  let htmlContent: string = '';
  let editorElement: HTMLDivElement | undefined; // 将 editorElement 初始化为 null

  onMount(() => {
    if (editorElement) { 
      editor = new Editor({
      element: editorElement,
      extensions: [
        StarterKit,
        Underline,
        TextAlign.configure({
          alignments: ['left', 'center', 'right', 'justify'],
          types: ['heading', 'paragraph', 'taskItem'],
        }),
        Superscript,
        Subscript,
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        Image.configure({
          inline: true,
          allowBase64: true,
        }),
      ],
      content: '',
      onTransaction: () => {
        // force re-render so `editor.isActive` works as expected
        editor = editor;
      },
    });

    editor.on('update', () => {
      if (editor) {
        htmlContent = editor.getHTML();
      }
    });

    } // 确保 editorElement 不是 undefined

    if (editor) {
      htmlContent = editor.getHTML();
    }
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });

  $: hasTextSelected =
    editor && editor.state.selection.from !== editor.state.selection.to;

  // 加粗
  const toggleBold = () => {
    if (editor) {
      editor.chain().toggleBold().run();
    }
  };
  $: isBoldActive = hasTextSelected && editor?.isActive("bold");

  // 斜体
  const toggleItalic = () => {
    if (editor) {
      editor.chain().toggleItalic().run();
    }
  };
  $: isItalicActive = hasTextSelected && editor?.isActive("italic");

  // 下划线
  const toggleUnderline = () => {
    if (editor) {
      editor.chain().toggleUnderline().run();
    }
  };
  $: isUnderlineActive = hasTextSelected && editor?.isActive("underline");

  // 引用
  const toggleBlockquote = () => {
    if (editor) {
      editor.chain().focus().toggleBlockquote().run();
    }
  };
  $: isBlockquoteActive = editor && editor.isActive("blockquote");

  // 设置标题大小
  const setHeading = (level: Level) => {
    if (editor) {
      editor.chain().toggleHeading({ level }).run();
    }
  };

  // 删除线
  const toggleStrike = () => {
    if (editor) {
      editor.chain().toggleStrike().run();
    }
  };
  $: isStrikeActive = hasTextSelected && editor?.isActive("strike");

  // 无序列表
  const toggleBulletList = () => {
    if (editor) {
      editor.chain().toggleBulletList().run();
    }
  };
  $: isBulletListActive = hasTextSelected && editor?.isActive("bulletList");

  // 有序列表
  const toggleOrderedList = () => {
    if (editor) {
      editor.chain().toggleOrderedList().run();
    }
  };
  $: isOrderedListActive = hasTextSelected && editor?.isActive("orderedList");

  // 水平线
  const toggleHorizontalRule = () => {
    if (editor) {
      editor.chain().setHorizontalRule().run();
    }
  };

  const setTextAlign = (direction: string) => {
    if (editor) {
      editor.chain().focus().setTextAlign(direction).run();
    }
  };

  const isTextAlignActive = (direction: string) => {
    if (editor && direction !== "left") {
      return editor.isActive({ textAlign: direction });
    }
    return false;
  };

  const undo = () => {
    if (editor) {
      editor.chain().undo().run();
    }
  };

  const redo = () => {
    if (editor) {
      editor.chain().redo().run();
    }
  };

  const toggleSuperscript = () => {
    if (editor) {
      editor.chain().focus().toggleSuperscript().run();
    }
  };
  $: isSuperscriptActive = hasTextSelected && editor?.isActive("superscript");

  const toggleSubscript = () => {
    if (editor) {
      editor.chain().focus().toggleSubscript().run();
    }
  };
  $: isSubscriptActive = hasTextSelected && editor?.isActive("subscript");

  const handleTableCommand = (command: string) => {
    if (!editor) return;

    switch (command) {
      case "insertTable":
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run();
        break;
      case "addColumnBefore":
        editor.chain().focus().addColumnBefore().run();
        break;
      case "addColumnAfter":
        editor.chain().focus().addColumnAfter().run();
        break;
      case "deleteColumn":
        editor.chain().focus().deleteColumn().run();
        break;
      case "addRowBefore":
        editor.chain().focus().addRowBefore().run();
        break;
      case "addRowAfter":
        editor.chain().focus().addRowAfter().run();
        break;
      case "deleteRow":
        editor.chain().focus().deleteRow().run();
        break;
      case "mergeCells":
        editor.chain().focus().mergeCells().run();
        break;
      case "splitCell":
        editor.chain().focus().splitCell().run();
        break;
      case "toggleHeaderColumn":
        editor.chain().focus().toggleHeaderColumn().run();
        break;
      case "toggleHeaderRow":
        editor.chain().focus().toggleHeaderRow().run();
        break;
      case "toggleHeaderCell":
        editor.chain().focus().toggleHeaderCell().run();
        break;
      case "mergeOrSplit":
        editor.chain().focus().mergeOrSplit().run();
        break;
      case "setCellAttribute":
        editor.chain().focus().setCellAttribute("colspan", 2).run();
        break;
      case "fixTables":
        editor.chain().focus().fixTables().run();
        break;
      case "goToNextCell":
        editor.chain().focus().goToNextCell().run();
        break;
      case "goToPreviousCell":
        editor.chain().focus().goToPreviousCell().run();
        break;
      default:
        break;
    }
  };

  const updateEditorContent = (newHtml: Content) => {
    if (editor && newHtml) {
      editor.commands.setContent(newHtml);
    }
  };

  const getHTML = () => {
    const htmlString = editor && editor.getHTML();
    const parser = new DOMParser();
    const doc = htmlString && parser.parseFromString(htmlString, "text/html");
    const serializer = new XMLSerializer();
    const xmlString = doc && serializer.serializeToString(doc.body);
    const bodyContentXml =
      xmlString && xmlString.replace(/^<body[^>]*>|<\/body>$/g, "");
    return bodyContentXml;
  };

  const insertText = (fieldName: Content) => {
    return editor && editor.chain().insertContent(fieldName).run();
  };

  $: {
    editor = new Editor({
      extensions: [
        StarterKit,
        Underline,
        TextAlign.configure({
          alignments: ["left", "center", "right", "justify"],
          types: ["heading", "paragraph", "taskItem"],
        }),
        Superscript,
        Subscript,
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        Image.configure({
          inline: true,
          allowBase64: true,
        }),
      ],
      content: "",
    });

    editor.on("update", () => {
      if (editor) {
        htmlContent = editor.getHTML();
      }
    });

    if (editor) {
      htmlContent = editor.getHTML();
    }
  }

  const handleDestroy = () => {
    if (editor) {
      editor.destroy();
    }
  };
</script>

<div class="tiptapEditor">
  <div class="editor-menu-bar">
    <!-- 加粗 -->
    <button class:active={isBoldActive} on:click={toggleBold}>
      <svg-icon type="加粗" />
    </button>
    <!-- 斜体 -->
    <button class:active={isItalicActive} on:click={toggleItalic}>
      <svg-icon type="斜体" />
    </button>
    <!-- 下划线 -->
    <button class:active={isUnderlineActive} on:click={toggleUnderline}>
      <svg-icon type="下划线" />
    </button>
    <!-- 引用 -->
    <button class:active={isBlockquoteActive} on:click={toggleBlockquote}>
      <svg-icon type="引用" />
    </button>
    <div class="dropdown">
      <button on:click={() => setHeading(2)}>
        <svg-icon type="标题" />
      </button>
      <div class="dropdown-content">
        <button on:click={() => setHeading(2)}>H1</button>
        <button on:click={() => setHeading(3)}>H2</button>
        <button on:click={() => setHeading(4)}>H3</button>
        <button on:click={() => setHeading(5)}>H4</button>
        <button on:click={() => setHeading(6)}>H5</button>
      </div>
    </div>
    <!-- 删除线 -->
    <button class:active={isStrikeActive} on:click={toggleStrike}>
      <svg-icon type="删除线" />
    </button>
    <!-- 无序列表 -->
    <button class:active={isBulletListActive} on:click={toggleBulletList}>
      <svg-icon type="无序列表" />
    </button>
    <!-- 有序列表 -->
    <button class:active={isOrderedListActive} on:click={toggleOrderedList}>
      <svg-icon type="有序列表" />
    </button>
    <!-- 分隔线 -->
    <button on:click={toggleHorizontalRule}>
      <svg-icon type="横线" />
    </button>
    <!-- 左对齐 -->
    <button
      class:active={isTextAlignActive("left")}
      on:click={() => setTextAlign("left")}
    >
      <svg-icon type="文字居左" />
    </button>
    <!-- 文字居中 -->
    <button
      class:active={isTextAlignActive("center")}
      on:click={() => setTextAlign("center")}
    >
      <svg-icon type="文字居中" />
    </button>
    <!-- 右对齐 -->
    <button
      class:active={isTextAlignActive("right")}
      on:click={() => setTextAlign("right")}
    >
      <svg-icon type="文字居右" />
    </button>
    <!-- 两端对齐 -->
    <button
      class:active={isTextAlignActive("justify")}
      on:click={() => setTextAlign("justify")}
    >
      <svg-icon type="文字两边对齐" />
    </button>
    <!-- 上标 -->
    <button class:active={isSuperscriptActive} on:click={toggleSuperscript}>
      <svg-icon type="上标" />
    </button>
    <!-- 下标 -->
    <button class:active={isSubscriptActive} on:click={toggleSubscript}>
      <svg-icon type="下标" />
    </button>
    <!-- 撤销 -->
    <button on:click={undo}>
      <svg-icon type="撤销" />
    </button>
    <!-- 重做 -->
    <button on:click={redo}>
      <svg-icon type="重做" />
    </button>
    <!-- 表格操作 Dropdown ... -->
    <div class="dropdown">
      <button>
        <svg-icon type="表格" />
      </button>
      <div class="dropdown-content">
        <button on:click={() => handleTableCommand("insertTable")}
          >插入表格</button
        >
        <button on:click={() => handleTableCommand("addColumnBefore")}
          >左侧插入列</button
        >
        <button on:click={() => handleTableCommand("addColumnAfter")}
          >右侧插入列</button
        >
        <button on:click={() => handleTableCommand("deleteColumn")}
          >删除列</button
        >
        <button on:click={() => handleTableCommand("addRowBefore")}
          >上方插入行</button
        >
        <button on:click={() => handleTableCommand("addRowAfter")}
          >下方插入行</button
        >
        <button on:click={() => handleTableCommand("deleteRow")}>删除行</button>
        <button on:click={() => handleTableCommand("mergeOrSplit")}
          >合并或拆分</button
        >
        <button on:click={() => handleTableCommand("toggleHeaderColumn")}
          >切换列头</button
        >
        <button on:click={() => handleTableCommand("toggleHeaderRow")}
          >切换行头</button
        >
        <button on:click={() => handleTableCommand("toggleHeaderCell")}
          >切换单元格头</button
        >
      </div>
    </div>
  </div>

  {#if editorElement}
    <div bind:this={editorElement} class="editor-content" />
  {/if}
</div>

<style lang="less">
  /* 编辑器样式 */
  button {
    background-color: transparent;
    border: 2px solid #7f7f7f; /* ElementUI 蓝色 */
    padding: 6px 10px; /* 减小了内部间距 */
    border-radius: 4px;
    color: #7f7f7f;
    cursor: pointer;
    transition: all 0.3s ease;
    outline: none;
    font-size: 13px; /* 调整字体大小 */
    font-weight: 500;
    margin: 4px; /* 调整间距，使其有缝隙 */
    position: relative;
  }

  button:hover {
    background-color: #7f7f7f;
    color: white;
  }

  button.active {
    background-color: #7f7f7f; /* 使用稍微明亮的黄色作为活跃背景色 */
    border-color: #7f7f7f;
    color: white;
  }

  button:active {
    transform: translateY(1px); /* 减小按下效果的移动距离 */
  }

  button:focus {
    box-shadow: 0 0 6px #7f7f7f; /* 使用ElementUI蓝色的焦点阴影 */
  }

  .EditorContent {
    width: 830px;
    border: 2px solid #d3d4d7;
    padding: 16px;
    border-radius: 4px;
    color: #333;
    font-size: 15px;
    transition: border 0.3s ease;
    outline: none;
    flex: 1;
    overflow: scroll;
  }

  .EditorContent:focus {
    border-color: #7f7f7f; /* 使用黄色作为焦点边框色 */
    box-shadow: 0 0 6px #7f7f7f; /* 使用ElementUI蓝色的焦点阴影 */
  }

  .tiptap .ProseMirror:focus-visible {
    outline: none; /* ElementUI 蓝色 */
  }

  /* 引用的样式 */
  blockquote {
    padding-left: 1rem;
    border-left: 3px solid rgb(13 13 13 / 10%);
  }

  .tableWrapper {
    padding: 1rem 0;
    overflow-x: auto;
  }

  .resize-cursor {
    cursor: ew-resize;
    cursor: col-resize;
  }

  /* Dropdown 样式 */
  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }

  .dropdown-content button {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }

  .dropdown-content button:hover {
    background-color: #7f7f7f;
    color: white;
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }

  /* 表格样式 */
  .tiptap {
    table {
      border-collapse: collapse;
      table-layout: fixed;
      width: 100%;
      margin: 0;
      overflow: hidden;

      td,
      th {
        min-width: 1em;
        border: 2px solid #ced4da;
        padding: 3px 5px;
        vertical-align: top;
        box-sizing: border-box;
        position: relative;

        > * {
          margin-bottom: 0;
        }
      }

      th {
        font-weight: bold;
        text-align: left;
        background-color: #f1f3f5;
      }

      .selectedCell::after {
        z-index: 2;
        position: absolute;
        content: "";
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgb(200 200 255 / 40%);
        pointer-events: none;
      }

      .column-resize-handle {
        position: absolute;
        right: -2px;
        top: 0;
        bottom: -2px;
        width: 4px;
        background-color: #7f7f7f;
        pointer-events: none;
      }

      p {
        margin: 0;
      }
    }
  }
</style>
