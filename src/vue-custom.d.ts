// Example: Add to src/vite-env.d.ts or create src/vue-custom.d.ts
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
