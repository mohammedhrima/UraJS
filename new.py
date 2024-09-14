import sys
import os
from pathlib import Path

def relative_path(from_path: Path, to_path: Path) -> str:
    """Calculate the relative path from `from_path` to `to_path`."""
    return os.path.relpath(to_path, from_path).replace(os.path.sep, '/')

if len(sys.argv) < 3:
    print("Error: run program as follows: new.py <component/page> <name>")
    sys.exit(1)

command = sys.argv[1]
name = sys.argv[2]

# Split the name into components based on '/'
name_parts = name.split('/')
name_parts = [part[0].upper() + part[1:] for part in name_parts]

# Define the base directory path
if command.lower() == "component" or command.lower() == "c":
    base_path = Path(f"src/components")
elif command.lower() == "page" or command.lower() == "p":
    base_path = Path(f"src/pages")
else:
    print("Error: run program as follows: new.py <component/page> <name>")
    sys.exit(1)

# Construct the full directory path
dir_path = base_path.joinpath(*name_parts)

# Check if directory already exists
if not dir_path.exists():
  dir_path.mkdir(parents=True)

# Create the directory

# Define file paths
file_name = name_parts[-1]
file_path = dir_path / f"{file_name}.tsx"
css_path = dir_path / f"{file_name}.css"

# Calculate the relative import path
mini_path = relative_path(dir_path, Path("./src/mini/mini.js"))
types_path = relative_path(dir_path, Path("./src/mini/types.js"))

# css_path =  relative_path("./src", str(css_path))
relative_css_path = relative_path("src", css_path)

# print("create", file_path)
# print("import mini from: ", mini_path)
# print("dir_path", dir_path)
# print("css_path: ", css_path)
# print("relative_css_path: ", relative_css_path)

# Create the TypeScript file
with open(file_path, 'w') as ts_file:
    text = f"""import Mini from \"{mini_path}\";
import {{ MiniComponent }} from \"{types_path}\";
Mini.loadCSS("{relative_css_path}");

function {file_name}(): MiniComponent {{
  const [key, state] = Mini.initState();
  return {{
    key: key,
    render: () => {{
      return (
        <get by={{"#root"}}>
          <div>{file_name}</div>
        </get>
      );
    }},
  }};
}}
export default {file_name};
    """
    ts_file.write(text)

# Create the CSS file
with open(css_path, 'w') as css_file:
    css_file.write(f"/* Add your styles here */\n")

print(f"{command.capitalize()} '{name}' created")
