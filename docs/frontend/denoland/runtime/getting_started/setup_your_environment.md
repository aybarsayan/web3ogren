---
title: "Ortamınızı Kurun"
description: "Bu sayfa, Deno'yu geliştirme sırasında en iyi şekilde kullanmanızı sağlayacak ortamınızı nasıl kuracağınızı adım adım anlatmaktadır. Editör ve IDE'ler için gerekli kurulumları ve yapılandırmaları öğrenin."
keywords: [Deno, geliştirme ortamı, IDE, dil sunucusu, kod editörü, shell tamamlayıcı, yerleşik dil sunucusu]
---

Deno, uygulama geliştirmek için sıklıkla gereken birçok aracı içerir; bunlar arasında seçtiğiniz IDE'yi desteklemek için tam bir
`dil sunucusu (LSP)` bulunmaktadır. Bu sayfa, Deno'yu geliştirme sırasında en iyi şekilde kullanmanızı sağlamak için ortamınızı kurmanızda yardımcı olacaktır.

:::tip
Kurulum adımlarını dikkatlice izleyin ve her bir IDE için gereken eklentileri doğru şekilde yüklediğinizden emin olun.
:::

Kapsayacağımız konular:

- Deno'yu favori editörünüz/IDE'niz ile nasıl kullanacağınız
- Shell tamamlama nasıl oluşturulur

---

## Editörünüzü/IDE'nizi kurma

### Visual Studio Code

Eğer henüz yapmadıysanız, Visual Studio Code'u [resmi web sitesinden](https://code.visualstudio.com/) indirin ve kurun.

Extensions sekmesine gidin, "Deno" araması yapın ve [Denoland tarafından sağlanan eklentiyi](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno) kurun.

Sonra, `Ctrl+Shift+P` tuşlarına basarak Komut Paletini açın ve `Deno: Initialize Workspace Configuration` yazın. Bu seçeneği seçerek Deno'yu çalışma alanınız için yapılandırın.

![Deno: Çalışma Alanı Yapılandırmasını Başlat seçeneğinin seçili olduğu VSCode komut paleti.](../../../images/cikti/denoland/runtime/getting_started/images/vscode-setup.png)

Çalışma alanınızda `.vscode/settings.json` adında aşağıdaki yapılandırmaya sahip bir dosya oluşturulacaktır:

```json
{
  "deno.enable": true
}
```

Hepsi bu kadar! VSCode kullanarak Deno için geliştirme ortamınızı başarıyla kurdunuz. Artık Deno'nun LSP'sinin tüm avantajlarından faydalanacaksınız; bu avantajlar arasında IntelliSense, kod formatlama, linting ve daha fazlası bulunmaktadır.

### JetBrains IDE'leri

Deno Eklentisini yüklemek için IDE'nizi açın ve **File** > **Settings** seçeneğine gidin. **Plugins** bölümüne geçin ve `Deno` araması yapın. Resmi Deno eklentisini yükleyin.

![WebStorm eklenti ayarları](../../../images/cikti/denoland/runtime/getting_started/images/webstorm_setup.png)

:::info
Eklentiyi yapılandırmak için tekrar **File** > **Settings** seçeneğine gidin. **Languages & Frameworks** > **Deno** bölümüne geçin. **Projeniz için Deno'yu etkinleştir** seçeneğini işaretleyin ve Deno çalıştırılabilir dosyasının yolunu belirtin (eğer otomatik olarak algılanmadıysa).
:::

Deno ile JetBrains IDE'lerinde başlamanız hakkında daha fazla bilgi edinmek için [bu blog yazısına](https://blog.jetbrains.com/webstorm/2020/06/deno-support-in-jetbrains-ides/) göz atın.

---

### Vim/Neovim üzerinden eklentiler ile

Deno, [Vim](https://www.vim.org/) ve [Neovim](https://neovim.io/) üzerinde [coc.nvim](https://github.com/neoclide/coc.nvim), [vim-easycomplete](https://github.com/jayli/vim-easycomplete) ve [ALE](https://github.com/dense-analysis/ale) aracılığıyla iyi desteklenmektedir. coc.nvim, Deno dil sunucusu ile entegre olmayı sağlayan eklentiler sunarken, ALE hazır olarak destekler.

### Neovim 0.6+ kullanarak yerleşik dil sunucusu

Deno dil sunucusunu kullanmak için [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig/) yükleyin ve [sağlanan Deno yapılandırmasını](https://github.com/neovim/nvim-lspconfig/blob/master/doc/configs.md#denols) etkinleştirmek için talimatları izleyin.

:::warning
Eğer `ts_ls` de bir LSP istemcisi olarak halihazırda varsa, `ts_ls` ve `denols`'un her ikisinin de mevcut tamponunuza bağlı olduğu durumlarla karşılaşabilirsiniz. Bunu çözmek için, `ts_ls` ve `denols` için bazı benzersiz `root_dir` ayarları belirlemeniz gerektiğinden emin olun.
:::

Ayrıca, `single_file_support` ayarını `false` olarak ayarlamanız gerekebilir; böylece `ts_ls` "tek dosya modu"nda çalışmaz. İşte böyle bir yapılandırma örneği:

```lua
local nvim_lsp = require('lspconfig')
nvim_lsp.denols.setup {
  on_attach = on_attach,
  root_dir = nvim_lsp.util.root_pattern("deno.json", "deno.jsonc"),
}

nvim_lsp.ts_ls.setup {
  on_attach = on_attach,
  root_dir = nvim_lsp.util.root_pattern("package.json"),
  single_file_support = false
}
```

Deno için yukarıdaki örnek, projenin kökünde bir `deno.json` veya `deno.jsonc` dosyasının bulunduğunu varsayıyor.

#### coc.nvim

[coc.nvim](https://github.com/neoclide/coc.nvim/wiki/Install-coc.nvim) yüklendikten sonra, gerekli [coc-deno](https://github.com/fannheyward/coc-deno) eklentisini `:CocInstall coc-deno` komutu ile yüklemelisiniz.

Eklenti yüklendikten sonra, Deno'yu bir çalışma alanında etkinleştirmek istiyorsanız `:CocCommand deno.initializeWorkspace` komutunu çalıştırın ve `gd` (tanıma git) ve `gr` (git/bul bağlantılar) gibi komutları kullanabilmelisiniz.

#### ALE

ALE, Deno dil sunucusunu hazır olarak destekler ve birçok kullanım durumunda ek yapılandırma gerektirmez. [ALE yüklendiğinde](https://github.com/dense-analysis/ale#installation) `:help ale-typescript-deno` komutunu çalıştırarak yapılandırma seçenekleri hakkında bilgi alabilirsiniz.

ALE'yi nasıl ayarlayacağınız (tuş bağlamaları gibi) konusunda daha fazla bilgi için [resmi belgelerine](https://github.com/dense-analysis/ale#usage) başvurun.

---

### Vim-EasyComplete

Vim-EasyComplete, başka bir yapılandırma gerektirmeden Deno'yu destekler. [vim-easycomplete yüklendiğinde](https://github.com/jayli/vim-easycomplete#installation), henüz Deno'yu yüklemediyseniz `:InstallLspServer deno` komutunu çalıştırarak Deno'yu yüklemeniz gerekir. Daha fazla bilgi için [resmi belgelere](https://github.com/jayli/vim-easycomplete) göz atabilirsiniz.

### Emacs

#### lsp-mode

Emacs, [lsp-mode](https://emacs-lsp.github.io/lsp-mode/) kullanarak Deno'yu Deno dil sunucusu aracılığıyla destekler. [lsp-mode yüklendiğinde](https://emacs-lsp.github.io/lsp-mode/page/installation/) Deno'yu desteklemesi gerekir; bu yapılandırmalar [şu şekilde](https://emacs-lsp.github.io/lsp-mode/page/lsp-deno/) ayarlanabilir.

:::note
Eglot kullanarak Deno için bir örnek yapılandırma aşağıdaki gibidir:
:::

```elisp
(add-to-list 'eglot-server-programs '((js-mode typescript-mode) . (eglot-deno "deno" "lsp")))

(defclass eglot-deno (eglot-lsp-server) ()
  :documentation "Deno lsp için özel bir sınıf.")

(cl-defmethod eglot-initialization-options ((server eglot-deno))
  "Gerekli deno başlatma seçeneklerini iletir"
  (list :enable t
        :lint t))
```

---

### Pulsar

[Pulsar editörü, daha önce Atom olarak biliniyordu](https://pulsar-edit.dev) ve Deno dil sunucusu ile entegre olmayı [atom-ide-deno](https://web.pulsar-edit.dev/packages/atom-ide-deno) paketi aracılığıyla desteklemektedir. `atom-ide-deno`, Deno CLI'nin kurulu olmasını ve [atom-ide-base](https://web.pulsar-edit.dev/packages/atom-ide-base) paketinin de yüklenmesini gerektirir.

### Sublime Text

[Sublime Text](https://www.sublimetext.com/) Deno dil sunucusuna bağlanmayı [LSP paketi](https://packagecontrol.io/packages/LSP) aracılığıyla destekler. Tam sözdizimi renklendirmesi almak için [TypeScript paketini](https://packagecontrol.io/packages/TypeScript) de yüklemek isteyebilirsiniz.

LSP paketini yükledikten sonra, `.sublime-project` yapılandırmanıza aşağıdaki gibi bir yapılandırma eklemek isteyeceksiniz:

```jsonc
{
  "settings": {
    "LSP": {
      "deno": {
        "command": ["deno", "lsp"],
        "initializationOptions": {
          // "config": "", // Projenizdeki yapılandırma dosyasının yolunu ayarlar
          "enable": true,
          // "importMap": "", // Projenizdeki import haritasının yolunu ayarlar
          "lint": true,
          "unstable": false
        },
        "enabled": true,
        "languages": [
          {
            "languageId": "javascript",
            "scopes": ["source.js"],
            "syntaxes": [
              "Packages/Babel/JavaScript (Babel).sublime-syntax",
              "Packages/JavaScript/JavaScript.sublime-syntax"
            ]
          },
          {
            "languageId": "javascriptreact",
            "scopes": ["source.jsx"],
            "syntaxes": [
              "Packages/Babel/JavaScript (Babel).sublime-syntax",
              "Packages/JavaScript/JavaScript.sublime-syntax"
            ]
          },
          {
            "languageId": "typescript",
            "scopes": ["source.ts"],
            "syntaxes": [
              "Packages/TypeScript-TmLanguage/TypeScript.tmLanguage",
              "Packages/TypeScript Syntax/TypeScript.tmLanguage"
            ]
          },
          {
            "languageId": "typescriptreact",
            "scopes": ["source.tsx"],
            "syntaxes": [
              "Packages/TypeScript-TmLanguage/TypeScriptReact.tmLanguage",
              "Packages/TypeScript Syntax/TypeScriptReact.tmLanguage"
            ]
          }
        ]
      }
    }
  }
}
```

### Nova

[Nova editörü](https://nova.app) Deno dil sunucusu ile [Deno uzantısı](https://extensions.panic.com/extensions/jaydenseric/jaydenseric.deno) aracılığıyla entegre edilebilir.

### GitHub Codespaces

[GitHub Codespaces](https://github.com/features/codespaces), tamamen çevrimiçi veya yerel makinenizde Deno'yu yapılandırmadan veya yüklemeden geliştirme yapmanıza olanak tanır. Şu anda erken erişimdedir.

:::info
Bir proje Deno destekliyorsa ve depo içinde `.devcontainer` yapılandırmasına sahipse, projeyi GitHub Codespaces içinde açmak sadece "çalışıyor" olmalıdır.
:::

Yeni bir proje başlatıyorsanız veya mevcut bir kod alanına Deno desteği eklemek istiyorsanız, komut paletinden `Codespaces: Add Development Container Configuration Files...` seçeneğini bulup ardından `Show All Definitions...` seçeneğini seçerek `Deno` tanımına arama yaparak ekleyebilirsiniz.

Seçildikten sonra, Deno CLI'nin konteynıra eklenmesi için konteynırınızı yeniden oluşturmanız gerekecektir. Konteynır yeniden oluşturulduktan sonra, kod alanı Deno'yu destekleyecektir.

---

### Kakoune

[Kakoune](https://kakoune.org/) Deno dil sunucusuna bağlanmayı [kak-lsp](https://github.com/kak-lsp/kak-lsp) istemcisi aracılığıyla destekler. [kak-lsp yüklendiğinde](https://github.com/kak-lsp/kak-lsp#installation) Deno dil sunucusuna bağlanacak şekilde yapılandırmak için `kak-lsp.toml` dosyanıza aşağıdakileri ekleyebilirsiniz:

```toml
[language.typescript]
filetypes = ["typescript", "javascript"]
roots = [".git"]
command = "deno"
args = ["lsp"]
[language.typescript.settings.deno]
enable = true
lint = true
```

### Helix

[Helix](https://helix-editor.com), yerleşik dil sunucusu desteği ile gelir. Deno dil sunucusuna bağlanmayı sağlamak için `languages.toml` yapılandırma dosyasında bazı değişiklikler yapmanız gerekmektedir.

```toml
[[language]]
name = "typescript"
language-id = "typescript"
scope = "source.ts"
injection-regex = "^(ts|typescript)$"
file-types = ["ts"]
shebangs = ["deno"]
roots = ["deno.json", "deno.jsonc", "package.json"]
auto-format = true
language-servers = ["deno-lsp"]

[language-server.deno-lsp]
command = "deno"
args = ["lsp"]

[language-server.deno-lsp.config.deno]
enable = true
```

---

## Shell tamamlama

Deno CLI içinde, CLI için shell tamamlayıcı bilgileri oluşturma desteği yerleşik olarak bulunmaktadır. `deno completions ` komutunu kullanarak, Deno CLI stdout'a tamamlamaları çıktılar. Mevcut desteklenen shell'ler:

- bash
- elvish
- fish
- powershell
- zsh

### bash örneği

Tamamlamaları çıkartın ve çevreye ekleyin:

```shell
> deno completions bash > /usr/local/etc/bash_completion.d/deno.bash
> source /usr/local/etc/bash_completion.d/deno.bash
```

### PowerShell örneği

Tamamlamaları çıktılar:

```shell
> deno completions powershell >> $profile
> .$profile
```

Bu, `$HOME\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1` konumunda bir PowerShell profili oluşturacak ve bu profil her PowerShell başlatıldığında çalıştırılacaktır.

### zsh örneği

Tamamlamaların kaydedileceği bir dizin oluşturmalısınız:

```shell
> mkdir ~/.zsh
```

Sonra tamamlamaları gözden geçirin:

```shell
> deno completions zsh > ~/.zsh/_deno
```

Ve tamamlamaların `~/.zshrc` dosyanızda yüklendiğinden emin olun:

```shell
fpath=(~/.zsh $fpath)
autoload -Uz compinit
compinit -u
```

Shell'inizi yeniden yükledikten sonra tamamlamalar hala yüklenmiyorsa, önceki oluşturulmuş tamamlamaları kaldırmak için `~/.zcompdump/` dosyasını silmeniz ve ardından tamamlamaları tekrar oluşturmak için `compinit` komutunu çalıştırmanız gerekebilir.

### ohmyzsh ve antigen ile zsh örneği

[ohmyzsh](https://github.com/ohmyzsh/ohmyzsh) zsh için bir yapılandırma çerçevesidir ve shell yapılandırmanızı yönetmeyi kolaylaştırabilir. [antigen](https://github.com/zsh-users/antigen) zsh için bir eklenti yöneticisidir.

Tamamlamaları depolamak için bir dizin oluşturun ve tamamlamaları gözden geçirin:

```shell
> mkdir ~/.oh-my-zsh/custom/plugins/deno
> deno completions zsh > ~/.oh-my-zsh/custom/plugins/deno/_deno
```

Ardından `.zshrc` dosyanız aşağıdakine benzer bir hale gelebilir:

```shell
source /path-to-antigen/antigen.zsh

# oh-my-zsh'ın kütüphanesini yükle.
antigen use oh-my-zsh

antigen bundle deno
```

### fish örneği

Tamamlamaları fish yapılandırma dizinindeki bir `deno.fish` dosyasına çıkartın:

```shell
> deno completions fish > ~/.config/fish/completions/deno.fish
```

---

## Diğer araçlar

Deno dil sunucusu kullanarak bir topluluk entegrasyonu yazıyorsanız veya destekliyorsanız, Deno CLI kod deposunda bulunan [belgelere](https://github.com/denoland/deno/tree/main/cli/lsp#deno-language-server) ulaşabilirsiniz; ancak ayrıca [Discord topluluğumuza](https://discord.gg/deno) `#dev-lsp` kanalına katılmaktan da çekinmeyin.