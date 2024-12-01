---
title: "deno completions"
description: This guide provides essential information on setting up shell completions for Deno in various command-line environments, including Bash, PowerShell, Zsh, and Fish. Follow the examples for easy configuration to enhance your Deno development experience.
keywords: [Deno, completions, shell configuration, Bash, PowerShell, Zsh, Fish]
---

## Örnekler

### Bash kabuk tamamlama yapılandırması

```bash
deno completions bash > /usr/local/etc/bash_completion.d/deno.bash
source /usr/local/etc/bash_completion.d/deno.bash
```

:::tip
To ensure that Bash completions work, make sure to source the file after running the command.
:::

### PowerShell kabuk tamamlama yapılandırması

```bash
deno completions powershell | Out-String | Invoke-Expression
```

:::info
This command initializes Deno completions for PowerShell, making it easier to use Deno commands without memorizing them.
:::

### zsh kabuk tamamlama yapılandırması

İlk olarak, aşağıdakileri `.zshrc` dosyanıza ekleyin:

```bash
fpath=(~/.zsh/completion $fpath)
autoload -U compinit
compinit
```

Sonrasında, aşağıdaki komutları çalıştırın:

```bash
deno completions zsh > _deno
mv _deno ~/.zsh/completion/_deno
autoload -U compinit && compinit
```

:::note
Remember to restart your terminal or source your `.zshrc` to apply the changes.
:::

### fish kabuk tamamlama yapılandırması

```bash
deno completions fish > completions.fish
chmod +x ./completions.fish
```

:::warning
Ensure the `completions.fish` script has the correct permissions to execute; otherwise, it won't run as expected.
:::