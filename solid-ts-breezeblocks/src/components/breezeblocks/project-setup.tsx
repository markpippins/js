function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-4 text-sm text-muted-foreground font-code">
      <code>{children}</code>
    </pre>
  );
}

export function ProjectSetup() {
  return (
    <div className="space-y-4 text-sm">
      <p>Follow these steps to set up a new SolidJS project with TailwindCSS.</p>

      <div>
        <h4 className="font-semibold">1. Create a new SolidJS project</h4>
        <p>Use degit to scaffold a new project with the TypeScript + Vite template.</p>
        <CodeBlock>npx degit solidjs/templates/ts-vite my-breeze-app</CodeBlock>
      </div>

      <div>
        <h4 className="font-semibold">2. Navigate and install dependencies</h4>
        <CodeBlock>{`cd my-breeze-app
npm install`}</CodeBlock>
      </div>

      <div>
        <h4 className="font-semibold">3. Install TailwindCSS</h4>
        <p>Add TailwindCSS, PostCSS, and Autoprefixer to your dev dependencies.</p>
        <CodeBlock>npm install -D tailwindcss postcss autoprefixer</CodeBlock>
      </div>

      <div>
        <h4 className="font-semibold">4. Initialize TailwindCSS</h4>
        <p>Generate `tailwind.config.js` and `postcss.config.js` files.</p>
        <CodeBlock>npx tailwindcss init -p</CodeBlock>
      </div>

      <div>
        <h4 className="font-semibold">5. Configure template paths</h4>
        <p>In your `tailwind.config.js`, add paths to all of your template files.</p>
        <CodeBlock>{`/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};`}</CodeBlock>
      </div>

      <div>
        <h4 className="font-semibold">6. Add Tailwind directives</h4>
        <p>Add the `@tailwind` directives for each of Tailwind’s layers to your main CSS file (e.g., `./src/index.css`).</p>
        <CodeBlock>{`@tailwind base;
@tailwind components;
@tailwind utilities;`}</CodeBlock>
      </div>

      <div>
        <h4 className="font-semibold">7. Start your development server</h4>
        <p>You're all set! Start the dev server and begin creating.</p>
        <CodeBlock>npm run dev</CodeBlock>
      </div>
    </div>
  );
}
