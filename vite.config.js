// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   build: {
//     // three.js is the heaviest dependency by far. Splitting it out lets the
//     // HTML/CSS shell paint while the 3D bundle is still arriving.
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           three: ['three'],
//           r3f: ['@react-three/fiber', '@react-three/drei'],
//         },
//       },
//     },
//     chunkSizeWarningLimit: 1200,
//   },
// })

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react-vendor",
              test: /node_modules\/(react|react-dom)\//,
            },
            {
              name: "three-vendor",
              test: /node_modules\/(three|@react-three)\//,
            },
          ],
        },
      },
    },
  },
});