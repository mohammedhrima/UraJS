import sys
import os
from pathlib import Path

def calculate_relative_path(from_path: Path, to_path: Path) -> str:
    """Calculate the relative path from `from_path` to `to_path`."""
    return os.path.relpath(to_path, from_path).replace(os.path.sep, '/')

if len(sys.argv) < 3:
    print("Error: run program as follows: new.py <component/page> <name>")
    sys.exit(1)

command = sys.argv[1]
name = sys.argv[2]

# Split the name into components based on '/'
name_parts = name.split('/')
name_parts = [part[0].upper() + part[1:] for part in name_parts]  # Capitalize each part

# Define the base directory path
if command.lower() == "component" or command.lower() == "c":
    base_path = Path(f"src-ts/components")
elif command.lower() == "page" or command.lower() == "p":
    base_path = Path(f"src-ts/pages")
else:
    print("Error: run program as follows: new.py <component/page> <name>")
    sys.exit(1)

# Construct the full directory path
directory_path = base_path.joinpath(*name_parts)

# Check if directory already exists
if directory_path.exists():
    print(f"Error: Directory '{directory_path}' already exists.")
    sys.exit(1)

# Create the directory
directory_path.mkdir(parents=True)

# Define file paths
file_name = name_parts[-1]
file_path = directory_path / f"{file_name}.tsx"
css_file_path = directory_path / f"{file_name}.css"

# Define the base directory for the import path
mini_base_path = Path("src-ts/mini/mini")

# Calculate the relative import path
relative_import_path = calculate_relative_path(directory_path, mini_base_path)
relative_css_path = str(css_file_path).replace("src-ts", "src-js")
print("path0: ", relative_import_path)
print("path1: ", mini_base_path)
print("path2: ", relative_css_path)


# Create the TypeScript file
with open(file_path, 'w') as ts_file:
    ts_file.write(f"import Mini from \"{relative_import_path}.js\";\n")
    ts_file.write(f"import {{ MiniComponent }} from \"{calculate_relative_path(directory_path, Path('src-ts/mini/types.js')).replace(str(mini_base_path), 'mini')}\";\n")
    ts_file.write(f'Mini.loadCSS("{relative_css_path}");\n\n')
    ts_file.write(f"function {file_name}(): MiniComponent {{\n")
    ts_file.write(f"  const [key, state] = Mini.initState();\n")
    ts_file.write(f"  return {{\n")
    ts_file.write(f"    key: key,\n")
    ts_file.write(f"    component: () => {{\n")
    ts_file.write(f"      return <div>{file_name}</div>;\n")
    ts_file.write(f"    }},\n")
    ts_file.write(f"  }};\n")
    ts_file.write(f"}}\n")
    ts_file.write(f"export default {file_name};\n")

# Create the CSS file
with open(css_file_path, 'w') as css_file:
    css_file.write(f"/* Add your styles here */\n")

print(f"{command.capitalize()} '{name}' created")
