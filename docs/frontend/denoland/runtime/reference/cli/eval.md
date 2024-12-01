---
description: The 'deno eval' command allows you to evaluate JavaScript or TypeScript code directly in the Deno runtime. This document provides an overview of how to use 'deno eval', along with examples and best practices.
keywords: [deno, eval, JavaScript, TypeScript, command line]
---

# deno eval

:::info
The `deno eval` command is an essential tool for executing small snippets of code without the need for a separate file.

## Overview

The `eval` command is used to evaluate code snippets written in JavaScript or TypeScript. You can utilize this command to quickly test out code or run scripts in an interactive manner.

**Syntax:**
```bash
deno eval [OPTIONS] <SCRIPT>
```

## Options

- `--help`: Show help information about the eval command.
- `--no-check`: Skip type checking the script (useful for TypeScript).

## Example Usage

To evaluate a simple expression, run:

```bash
deno eval "console.log('Hello, Deno!');"
```

### Key Takeaway
> “`deno eval` is perfect for quick testing and prototyping.”  
— Deno Documentation

---

## Advanced Features


Click here for advanced usage tips

1. **Running Asynchronous Code:**
   ```bash
   deno eval "const fetchData = async () => { const response = await fetch('https://example.com'); return response.json(); }; fetchData().then(console.log);"
   ```

2. **Using External Modules:**
   ```bash
   deno eval "import { serve } from 'https://deno.land/std/http/server.ts'; serve(() => new Response('Hello World'));"
   ```



:::tip
When using `deno eval`, remember to keep your code snippets concise for better readability and maintainability.

:::warning
Be cautious when executing untrusted code snippets as they could potentially harm your system or compromise security.

---

For further reading, refer to the [Deno Documentation](https://deno.land/manual/runtime/tools/eval).

