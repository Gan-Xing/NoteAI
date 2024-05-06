<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import BubbleMenu from "@tiptap/extension-bubble-menu";
  import type { Editor as EditorType } from "@tiptap/core";
  import { DragAndDrop, SlashCommands } from "@/extentions";
  import SlashCommandPalette from "@/components/SlashCommands.svelte";
  import italic from "@/assets/svg/italic.svg";

  let element: HTMLDivElement;
  let editor: EditorType;
  let menuElement: HTMLDivElement; // 绑定到 BubbleMenu 的 HTML 元素

  onMount(() => {
    editor = new Editor({
      element,
      extensions: [
        StarterKit,
        DragAndDrop,
        SlashCommands,
        BubbleMenu.configure({
          element: menuElement,
          tippyOptions: {
            interactive: true,
            hideOnClick: false,
          },
        }),
      ],
      content: "<p>Hello World! 🌍️</p>",
      onTransaction: () => {
        editor = editor;
        if (!editor.state.selection.empty) {
          const { from, to } = editor.state.selection;
          const start = editor.view.coordsAtPos(from);
          const end = editor.view.coordsAtPos(to);
          const box = menuElement.getBoundingClientRect();
          const middle = (start.left + end.left) / 2 - box.width / 2;

          menuElement.style.left = `${middle}px`;
          menuElement.style.top = `${start.top - box.height - 10}px`;
          menuElement.style.visibility = "visible";
        } else {
          menuElement.style.visibility = "hidden";
        }
      },
    });
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });
</script>

<svelte:options customElement={{ tag: 'note-ai', shadow: 'open' }} />

{#if editor}
  <div bind:this={menuElement} class="menu">
    <button
      on:click={() => editor.chain().focus().toggleItalic().run()}
      disabled={!editor.can().chain().focus().toggleItalic().run()}
      class:is-active={editor.isActive("italic")}
    >
      <img src={italic} alt="Italic" />
    </button>
  </div>
  <button
    on:click={() => editor.chain().focus().toggleItalic().run()}
    disabled={!editor.can().chain().focus().toggleItalic().run()}
    class:is-active={editor.isActive("italic")}
  >
    <img src={italic} alt="Italic" />
  </button>
{/if}

<div bind:this={element} class="EditorContent" />
<SlashCommandPalette {editor} />

<style lang="less">
  .menu {
    display: flex;
    gap: 8px;
    background: white;
    border: 1px solid #ccc;
    padding: 4px;
    border-radius: 4px;
    position: absolute; // 定位为绝对，使其能够浮动
    z-index: 100; // 确保菜单在编辑器内容上方
    visibility: hidden; // 默认不可见
  }
  button.is-active {
    background: black;
    color: white;
    img {
      filter: invert(100%); /* 白色反转 */
    }
  }
  .EditorContent {
    width: 100%;
    border: 2px solid #d3d4d7;
    padding: 0 2rem;
    border-radius: 4px;
    color: #333;
    font-size: 1rem;
    transition: border 0.3s ease;
    outline: none;
    flex: 1;
    overflow: scroll;
  }
  .EditorContent:focus {
    border-color: #7f7f7f; /* 使用黄色作为焦点边框色 */
    box-shadow: 0 0 6px #7f7f7f; /* 使用ElementUI蓝色的焦点阴影 */
  }
  .EditorContent {
    display: flex;
    padding: 0 2rem;
    p {
      padding: 0 0.5rem;
      line-height: 1.5rem;
    }
    .tiptap {
      flex: 1;
    }
  }
  .ProseMirror:focus-visible {
    outline: none;
  }
  .ProseMirror:not(.dragging) .ProseMirror-selectednode {
    outline: none !important;
    transition: background-color 0.2s;
    box-shadow: none;
  }
  .drag-handle {
    position: fixed;
    opacity: 1;
    transition: opacity ease-in 0.2s;
    border-radius: 0.25rem;

    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' style='fill: rgba(0, 0, 0, 0.5)'%3E%3Cpath d='M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z'%3E%3C/path%3E%3C/svg%3E");
    background-size: calc(0.5em + 0.375rem) calc(0.5em + 0.375rem);
    background-repeat: no-repeat;
    background-position: center;
    width: 1.2rem;
    height: 1.5rem;
    z-index: 50;
    cursor: grab;

    &:hover {
      background-color: var(--novel-stone-100);
      transition: background-color 0.2s;
    }

    &:active {
      background-color: var(--novel-stone-200);
      transition: background-color 0.2s;
      cursor: grabbing;
    }

    &.hide {
      opacity: 0;
      pointer-events: none;
    }

    @media screen and (max-width: 600px) {
      display: none;
      pointer-events: none;
    }
  }
  .dark .drag-handle {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' style='fill: rgba(255, 255, 255, 0.5)'%3E%3Cpath d='M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z'%3E%3C/path%3E%3C/svg%3E");
  }
</style>
