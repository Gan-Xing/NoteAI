import sveltePreprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';

const config = {
    kit: {
        adapter: adapter(), // 如果你的项目需要生成为静态站点，使用这个适配器
    },
    preprocess: sveltePreprocess(), // 使用 sveltePreprocess 来支持 SASS/SCSS, TypeScript 等
    compilerOptions: {
        customElement: true // 使 Svelte 在编译组件时，将其作为自定义元素来处理
    }
};

export default config;
