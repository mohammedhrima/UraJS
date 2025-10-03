#!/usr/bin/env node
import { basename, join, dirname } from "path";
import { config, source, createFile, updateRoutes, root } from "./utils.js";
import { generateJSX, generateStyle } from "./gen.js";

if (process.argv.length < 3) {
  console.error("Usage: uracomp <component-name> OR uracomp <route-name>/<component-name>");
  console.error("\nExamples:");
  console.error("  uracomp Button              # Creates shared component: src/components/Button.jsx");
  console.error("  uracomp user/UserProfile    # Creates route component: src/pages/user/components/UserProfile.jsx");
  process.exit(1);
}

async function createComponentFiles(name: string): Promise<void> {
  const holder = await import(join(root, "ura.config.js"));
  await holder.default();

  const ext = config.typescript === "enable" ? "tsx" : "jsx";
  let styleExt = config.styling === "SCSS" ? "scss" : config.styling === "CSS" ? "css" : null;

  if (name.includes('/')) {
    const parts = name.split('/');
    const componentName = parts[parts.length - 1]; 
    const routePath = parts.slice(0, -1).join('/'); 

    createFile(
      join(source, `./pages/${routePath}/components/`, basename(`${componentName}.${ext}`)),
      generateJSX(componentName, 'component')
    );

    if (styleExt) {
      createFile(
        join(source, `./pages/${routePath}/components/`, basename(`${componentName}.${styleExt}`)),
        generateStyle(componentName, 'component')
      );
    }

    console.log(`✓ Created route-specific component: pages/${routePath}/components/${componentName}.${ext}`);
  } else {
    createFile(
      join(source, "./components/", basename(`${name}.${ext}`)),
      generateJSX(name, 'component')
    );

    if (styleExt) {
      createFile(
        join(source, "./components/", basename(`${name}.${styleExt}`)),
        generateStyle(name, 'component')
      );
    }

    console.log(`✓ Created shared component: components/${name}.${ext}`);
  }

  updateRoutes();
}

process.argv.slice(2).forEach(createComponentFiles);
