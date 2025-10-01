# usename

A simple command-line tool and library to check whether an NPM package or organization name is available or already taken.

---

## 📦 Installation

### Global install (CLI)

```bash
npm install -g usename
```

### Using npx (no install needed)

```bash
npx usename <package-name>
```

---

## ⚡ CLI Usage

### Check a single package name

```bash
usename react
# or using npx
npx usename react
```

**Example Output:**

```
🔍 Searching for "react"...

🌐 Organization  : Taken
📦 Package       : Taken
```

### Interactive / Loop Mode

To check multiple names repeatedly:

```bash
npx usename -l
```

- You will be prompted to enter a package name each time.
- To exit the loop, type:

```bash
exit
```

or press `Ctrl+C`.

---

## 🖋 Library Usage

You can also use `usename` in your own Node.js or TypeScript projects:

```ts
import { runCLI, searchForPackage } from 'usename'

// Run CLI programmatically
await runCLI('react')

// Check package/org availability directly
const result = await searchForPackage('my-unique-package')
console.log(result)
// { orgTaken: false, packageTaken: true }
```

- `runCLI(packageName?: string, showExitMsg?: boolean)`
  Runs the CLI programmatically. `showExitMsg` will display exit instructions when `true`.

- `searchForPackage(name: string)`
  Checks if an NPM package and organization name are taken and returns an object:

  ```ts
  { orgTaken: boolean, packageTaken: boolean }
  ```

---

## 📌 Notes

- `usename` works both as a CLI tool and as a library in your code.
- In CLI mode, the tool shows a spinner and colored output.
- In library mode, you can call the functions directly for programmatic checks.
