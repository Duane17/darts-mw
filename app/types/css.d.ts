// src/app/types/css.d.ts
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// For side-effect imports
declare module '*.css' {
  const content: any;
  export default content;
}