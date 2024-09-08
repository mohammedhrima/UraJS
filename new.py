import sys
import os
from pathlib import Path

if len(sys.argv) < 3:
  print("Error: run program as follows: new.py <component/page> <name>")
  sys.exit(1)

command = sys.argv[1]
name = sys.argv[2]
name = name[0].upper() + name[1:]

# Define the directory path
if command.lower() == "component" or command.lower() == "c":
  directory_path = Path(f"src-ts/components/{name}")
elif command.lower() == "page" or command.lower() == "p":
  directory_path = Path(f"src-ts/pages/{name}")
else:
  print("Error: run program as follows: new.py <component/page> <name>")
  sys.exit(1)

# Check if directory already exists
if directory_path.exists():
  print(f"Error: Directory '{directory_path}' already exists.")
  sys.exit(1)

# Create the directory
directory_path.mkdir(parents=True)

# Define file paths
file_path = directory_path / f"{name}.tsx"
css_file_path = directory_path / f"{name}.css"

# Create the TypeScript file
with open(file_path, 'w') as ts_file:
  ts_file.write(f"import Mini from \"../../mini/mini.js\";\n")
  ts_file.write(f"import {{ MiniComponent }} from \"../../mini/types.js\";\n\n")
  ts_file.write(f"function {name}(): MiniComponent {{\n")
  ts_file.write(f"  const [key, state] = Mini.initState();\n")
  ts_file.write(f"  return {{\n")
  ts_file.write(f"    key: key,\n")
  ts_file.write(f"    component: () => {{\n")
  ts_file.write(f"      return <div>{name}</div>;\n")  # Added className
  ts_file.write(f"    }},\n")
  ts_file.write(f"  }};\n")
  ts_file.write(f"}}\n")
  ts_file.write(f"export default {name};\n")

# Create the CSS file
with open(css_file_path, 'w') as css_file:
  css_file.write(f"  /* Add your styles here */\n")

print(f"{command.capitalize()} '{name}' created")
