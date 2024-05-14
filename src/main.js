import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css'
import {message,} from 'ant-design-vue';
import {router} from './router'
import VueMarkdownEditor from '@kangc/v-md-editor'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import createTipPlugin from '@kangc/v-md-editor/lib/plugins/tip/index';
import '@kangc/v-md-editor/lib/plugins/tip/tip.css';
import '@kangc/v-md-editor/lib/style/base-editor.css'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';


import Prism from 'prismjs'
import './assets/main.css'



VueMarkdownEditor.use(vuepressTheme,{
  Prism,
})
VueMarkdownEditor.use(createEmojiPlugin());
VueMarkdownEditor.use(createTipPlugin())

const pinia=createPinia()

const app=createApp(App)
app.use(pinia)
app.use(router)
app.use(Antd)
app.use(message)
app.use(VueMarkdownEditor)
message.config({
    top: `100px`,
    duration: 2,
    maxCount: 3,
  });
app.mount('#app')