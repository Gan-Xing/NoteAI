import { Extension } from "@tiptap/core";
import { inputRules, InputRule } from "prosemirror-inputrules";
import { showSlashCommandPalette, commandPalettePosition } from "@/store/useCommand";

export const SlashCommands = Extension.create({
  name: "inputRules",

  addProseMirrorPlugins() {
    const rules = [
      new InputRule(/\/$/, (state, match, start, end) => {
        const { selection } = state;
        const { $from } = selection;
        // 检查当前选择是否在一个段落的起始位置
        if ($from.parentOffset === 0 && ($from.nodeBefore == null || $from.nodeBefore.type.name === 'paragraph')) {
          const selection = document.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            // 设置弹窗位置
            commandPalettePosition.set({
              left: rect.left + window.scrollX - 10, // 加上滚动的偏移
              top: rect.bottom + window.scrollY - 20,
            });

            showSlashCommandPalette.set(true);
            // 删除“/”并阻止进一步插入
            return state.tr.delete(start, end);
          }
        }
        return null; // 不进行任何文本插入
      }),
    ];

    return [inputRules({ rules })];
  },
});
