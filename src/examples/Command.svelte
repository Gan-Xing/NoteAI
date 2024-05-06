<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Editor } from "@tiptap/core";
  import type { Editor as EditorType } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import SlashCommandPalette from "@/components/SlashCommands.svelte";
  import { SlashCommands } from "@/extentions"; // 确保正确引用自定义扩展
  import { editorStore } from "@/store";

  let element: HTMLDivElement;
  let editor: EditorType | null = null;

  onMount(() => {
    editor = new Editor({
      element,
      extensions: [StarterKit, SlashCommands],
      content: "<p>Hello World! 🌍️</p>",
    });
    editorStore.set(editor);
  });

  onDestroy(() => {
    editor?.destroy();
    editorStore.set(null);
  });
</script>

<div bind:this={element} class="EditorContent"></div>
<SlashCommandPalette {editor} />
