import { writable } from 'svelte/store';
export const showSlashCommandPalette = writable(false);
export const commandPalettePosition = writable({ left: 0, top: 0 });
