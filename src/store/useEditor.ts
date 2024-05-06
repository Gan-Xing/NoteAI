import { writable } from 'svelte/store';
import type { Editor } from "@tiptap/core";
export const editorStore = writable<Editor | null>(null);