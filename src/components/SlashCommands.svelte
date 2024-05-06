<script lang="ts">
  import {
    showSlashCommandPalette,
    commandPalettePosition,
    editorStore,
  } from "@/store/index";
  import type { Editor as EditorType } from "@tiptap/core";

  export let editor: EditorType | null;
  editorStore.subscribe((value: EditorType | null) => {
    editor = value;
  });

  export let commands = [
    {
      label: "H1",
      action: () => editor?.chain().focus().setHeading({ level: 1 }).run(),
    },
    {
      label: "H2",
      action: () => editor?.chain().focus().setHeading({ level: 2 }).run(),
    },
    {
      label: "H3",
      action: () => editor?.chain().focus().setHeading({ level: 3 }).run(),
    },
    // 添加更多命令
  ];

  /**
   * @param {{ label?: string; action: any; }} command
   */
  function handleSelect(command: { label?: string; action: () => void }) {
    if (editor) {
      command.action();
      showSlashCommandPalette.set(false);
    }
  }
</script>

{#if $showSlashCommandPalette}
  <div
    class="slash-command-palette"
    style="left: {$commandPalettePosition.left}px; top: {$commandPalettePosition.top}px;"
  >
    <ul>
      {#each commands as command}
        <li>
          <button
            type="button"
            on:click={() => handleSelect(command)}
            on:keydown={(event) =>
              event.key === "Enter" && handleSelect(command)}
          >
            {command.label}
          </button>
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  .slash-command-palette {
    position: fixed;
    background: white;
    border: 1px solid #ccc;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 10px;
    z-index: 1000;
    width: 200px;
    border-radius: 8px;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    margin: 4px 0; /* Slight space between buttons */
  }
  button {
    width: 100%;
    padding: 8px 12px;
    cursor: pointer;
    background-color: transparent;
    border: none;
    border-radius: 6px;
    text-align: left;
  }
  button:hover {
    background-color: #f0f0f0;
  }
  button:focus {
    outline: none;
    box-shadow: 0 0 0 2px #005fcc; /* Focus indicator for better accessibility */
  }
</style>
