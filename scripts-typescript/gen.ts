import { logmsg } from "./debug.js";
import { capitalize, config } from "./utils.js";

export const generateJSX = (name: string, type: "component" | "route" = "component"): string => {
  logmsg("Generate", name, type)
  name = name.replace("/", "_");
  const isTS = config.typescript === "enable";
  const JSXname = capitalize(name);
  const isRoute = type === "route";
  const istailwind = config.styling === "Tailwind CSS"

  if (isRoute) {
    return `${isTS ? '//@ts-ignore\n' : ''}import { State${isTS ? ", Ura, VDOM, Props" : ""} } from 'ura';
import Header from './header';
import Main from './main';
import Footer from './footer';

function ${JSXname}(props${isTS ? ": Props" : ""})${isTS ? ": VDOM" : ""} {
  document.title = "${name} Page";

  return (
    <div className="${!istailwind ? name.toLowerCase() : "flex flex-col min-h-screen text-text bg-bg"}">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

export default ${JSXname}`;
  }

  const content = `${isTS ? '//@ts-ignore\n' : ''}import { State${isTS ? ", Ura, VDOM, Props" : ""} } from 'ura';

function ${JSXname}(props${isTS ? ": Props" : ""})${isTS ? ": VDOM" : ""} {
  const [count, setCount] = State(0);

  return (
    <div className="${!istailwind ? name.toLowerCase() : "bg-bg p-6 flex flex-col justify-center items-center h-screen"}">
      <h1 className="${istailwind ? "text-2xl text-text font-semibold mb-6 text-center" : ""}">Hello from ${JSXname} component!</h1>
      <button className="${istailwind ? "bg-accent text-white py-3 px-6 rounded-lg text-lg shadow-lg hover:bg-blue-500 hover:transform hover:translate-y-[-2px] active:scale-95 transition-transform" : ""}" onclick={() => setCount(count() + 1)}>
        Click me [{count()}]
      </button>
    </div>
  );
}

export default ${JSXname}`;
  
  return content;
};

export const generateHeader = (name: string): string => {
  const isTS = config.typescript === "enable";
  const istailwind = config.styling === "Tailwind CSS";
  
  return `${isTS ? '//@ts-ignore\n' : ''}import { State${isTS ? ", Ura, VDOM, Props" : ""} } from 'ura';

function Header(props${isTS ? ": Props" : ""})${isTS ? ": VDOM" : ""} {
  return (
    <>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="UraJS - A lightweight JavaScript framework for building modern web applications" />
        <meta name="keywords" content="UraJS, JavaScript, Framework, Web Development, Frontend" />
        <meta name="author" content="UraJS Team" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="UraJS Framework" />
        <meta property="og:description" content="A lightweight JavaScript framework for building modern web applications" />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://urajs.dev" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="UraJS Framework" />
        <meta name="twitter:description" content="A lightweight JavaScript framework for building modern web applications" />
        <meta name="twitter:image" content="/twitter-image.png" />
        
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        <title>${name}</title>
      </head>
      
      <header className="${!istailwind ? "navbar" : "bg-nav px-8 py-4 flex justify-between items-center border-b border-border"}">
        <div className="${!istailwind ? "logo" : "text-[--accent] text-2xl font-bold"}">UraJS</div>
        <nav>
          <a ${istailwind ? 'className="ml-6 text-text hover:text-[#3c82c9] transition-colors duration-300"' : ""} href="https://github.com/mohammedhrima/UraJS/" target="_blank">
            github
          </a>
        </nav>
      </header>
    </>
  );
}

export default Header`;
};

export const generateMain = (name: string): string => {
  const isTS = config.typescript === "enable";
  const JSXname = capitalize(name);
  const istailwind = config.styling === "Tailwind CSS";
  
  return `${isTS ? '//@ts-ignore\n' : ''}import { State${isTS ? ", Ura, VDOM, Props" : ""} } from 'ura';

function Main(props${isTS ? ": Props" : ""})${isTS ? ": VDOM" : ""} {
  const [count, setCount] = State(0);

  return (
    <main className="${istailwind ? "flex-1 flex flex-col items-center justify-center px-4 py-12 text-center" : "body"}">
      <h1 ${istailwind ? 'className="text-4xl md:text-5xl mb-8 text-[#f1f5f9]"' : ""}>
        Hello from ${JSXname} route!
      </h1>
      <button ${istailwind ? 'className="px-6 py-3 bg-[--accent] text-white rounded-lg text-base shadow-lg transition-transform transform hover:bg-[#3c82c9] hover:-translate-y-0.5 active:scale-95"' : ""} onclick={() => setCount(count() + 1)}>
        Click me [{count()}]
      </button>
    </main>
  );
}

export default Main`;
};

export const generateFooter = (name: string): string => {
  const isTS = config.typescript === "enable";
  const istailwind = config.styling === "Tailwind CSS";
  
  return `${isTS ? '//@ts-ignore\n' : ''}import { State${isTS ? ", Ura, VDOM, Props" : ""} } from 'ura';

function Footer(props${isTS ? ": Props" : ""})${isTS ? ": VDOM" : ""} {
  return (
    <footer className="${istailwind ? "bg-nav text-center p-4 text-sm border-t border-border text-text-muted" : 'footer'}">
      <p>Built with 💙 using UraJS</p>
    </footer>
  );
}

export default Footer`;
};

export const generateStyle = (name: string, type: 'component' | 'route' = 'component'): string => {
  name = name.replace("/", "_");
  if (config.styling === "Tailwind CSS") return "";
  if (type === 'route')
    return `
:root {
  --bg: #0f172a;
  --nav: #1e293b;
  --accent: #26578d;
  --text: #e2e8f0;
  --text-muted: #94a3b8;
  --border: #334155;
}

.${name.toLowerCase()} {
  color: var(--text);
  background-color: var(--bg);
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* Navbar */
  .navbar {
    background-color: var(--nav);
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border);
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--accent);
    }
    nav a {
      margin-left: 1.5rem;
      text-decoration: none;
      color: var(--text);
      transition: color 0.3s ease;
      &:hover {
        color: #3c82c9;
      }
    }
  }

  /* Main content */
  .body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    text-align: center;
    h1 {
      font-size: 2.75rem;
      margin-bottom: 2rem;
      color: #f1f5f9;
    }
    button {
      padding: 0.75rem 1.5rem;
      background: var(--accent);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s, transform 0.2s;
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);
      &:hover {
        background: #3c82c9;
        transform: translateY(-2px);
      }
      &:active {
        transform: scale(0.97);
      }
    }
  }

  /* Footer */
  .footer {
    background-color: var(--nav);
    text-align: center;
    padding: 1rem;
    font-size: 0.9rem;
    border-top: 1px solid var(--border);
    color: var(--text-muted);
  }
}`
  return `
:root {
  --bg: #0f172a;
  --nav: #1e293b;
  --accent: #26578d;
  --text: #e2e8f0;
  --text-muted: #94a3b8;
  --border: #334155;
}

.${name.toLowerCase()} {
  background-color: var(--bg);
  color: var(--text);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 2rem;

  h1 {
    font-size: 2.5rem;
    color: var(--text);
    margin-bottom: 2rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-align: center;
  }

  button {
    padding: 1rem 2rem;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-size: 1.25rem;
    cursor: pointer;
    transition: background 0.3s, transform 0.2s, box-shadow 0.3s ease;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);

    &:hover {
      background: #3c82c9;
      transform: translateY(-3px);
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.3);
    }

    &:active {
      transform: scale(0.98);
    }
  }
}

`;
};
