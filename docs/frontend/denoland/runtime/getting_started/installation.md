---
title: Kurulum
description: Deno, macOS, Linux ve Windows üzerinde kurulumu hakkında kapsamlı bilgi sağlayan bir kaynaktır. Deno'nun nasıl indirileceği, kurulum yöntemleri ve test süreçleri adım adım açıklanmaktadır.
keywords: [Deno, kurulum, macOS, Windows, Linux, Docker, güncelleme]
oldUrl:
  - /runtime/manual/fundamentals/installation
  - /runtime/manual/getting_started/installation
  - /runtime/fundamentals/installation
---

Deno, macOS, Linux ve Windows üzerinde çalışır. Deno, tek bir ikili yürütülebilir dosyadır. Harici bağımlılıkları yoktur. macOS üzerinde, hem M1 (arm64) hem de Intel (x64) yürütülebilir dosyalar sağlanır. Linux ve Windows üzerinde yalnızca x64 desteklenmektedir.

## İndir ve kur

[deno_install](https://github.com/denoland/deno_install), ikili dosyayı indirmek ve kurmak için kullanım kolayı sağlayan betikler temin eder.




Shell kullanarak:

```shell
curl -fsSL https://deno.land/install.sh | sh
```

[Homebrew](https://formulae.brew.sh/formula/deno) kullanarak:

```shell
brew install deno
```

[MacPorts](https://ports.macports.org/port/deno/) kullanarak:

```shell
sudo port install deno
```

[Nix](https://nixos.org/download.html) kullanarak:

```shell
nix-shell -p deno
```

[asdf](https://asdf-vm.com/) kullanarak:

```shell
asdf plugin-add deno https://github.com/asdf-community/asdf-deno.git

# Deno'nun en son sürümünü indir ve kur
asdf install deno latest

# Deno'yu global olarak varsayılan sürüm olarak ayarla
asdf global deno latest

# Deno'yu yerel (mevcut proje için) varsayılan sürüm olarak ayarla
asdf local deno latest
```

[vfox](https://vfox.lhan.me/) kullanarak:

```shell
vfox add deno

# Deno'nun en son sürümünü indir ve kur
vfox install deno@latest

# Deno'nun sürümünü global olarak ayarla
vfox use --global deno
```




PowerShell (Windows) kullanarak:

```powershell
irm https://deno.land/install.ps1 | iex
```

[Scoop](https://scoop.sh/) kullanarak:

```shell
scoop install deno
```

[Chocolatey](https://chocolatey.org/packages/deno) kullanarak:

```shell
choco install deno
```

[Winget](https://github.com/microsoft/winget-cli) kullanarak:

```shell
winget install DenoLand.Deno
```

[vfox](https://vfox.lhan.me/) kullanarak:

```shell
vfox add deno

# Deno'nun en son sürümünü indir ve kur
vfox install deno@latest

# Deno'nun sürümünü global olarak ayarla
vfox use --global deno
```




Shell kullanarak:

```shell
curl -fsSL https://deno.land/install.sh | sh
```

[Nix](https://nixos.org/download.html) kullanarak:

```shell
nix-shell -p deno
```

[asdf](https://asdf-vm.com/) kullanarak:

```shell
asdf plugin-add deno https://github.com/asdf-community/asdf-deno.git

# Deno'nun en son sürümünü indir ve kur
asdf install deno latest

# Deno'yu global olarak varsayılan sürüm olarak ayarla
asdf global deno latest

# Deno'yu yerel (mevcut proje için) varsayılan sürüm olarak ayarla
asdf local deno latest
```

[vfox](https://vfox.lhan.me/) kullanarak:

```shell
vfox add deno

# Deno'nun en son sürümünü indir ve kur
vfox install deno@latest

# Deno'nun sürümünü global olarak ayarla
vfox use --global deno
```




:::info
Ayrıca, [Cargo](https://crates.io/crates/deno) kullanarak kaynaklardan derleyebilir ve kurabilirsiniz:

```shell
cargo install deno --locked
```
:::

Deno ikili dosyaları manuel olarak da kurulabilir, [github.com/denoland/deno/releases](https://github.com/denoland/deno/releases) adresinden bir zip dosyası indirerek. Bu paketler yalnızca tek bir yürütülebilir dosya içerir. **macOS** ve **Linux'ta** yürütme bitini ayarlamanız gerekecektir.

---

## Docker

Resmi Docker görüntüleri hakkında daha fazla bilgi ve talimatlar için: [https://github.com/denoland/deno_docker](https://github.com/denoland/deno_docker)

---

## Kurulumunuzu test etme

Kurulumunuzu test etmek için `deno --version` komutunu çalıştırın. Eğer bu komut Deno sürümünü konsola yazdırıyorsa, kurulum başarılı olmuştur.

> "Deno'nun bayrakları ve kullanımı hakkında dokümantasyon metni görmek için `deno help` komutunu kullanın."  
> — Deno Kullanım Kılavuzu

CLI hakkında detaylı rehber almak için `buraya` göz atabilirsiniz.

---

## Güncelleme

Daha önce kurulmuş bir Deno sürümünü güncellemek için şu komutu çalıştırabilirsiniz:

```shell
deno upgrade
```

Yahut [Winget](https://github.com/microsoft/winget-cli) kullanarak (Windows):

```shell
winget upgrade DenoLand.Deno
```

Bu, [github.com/denoland/deno/releases](https://github.com/denoland/deno/releases) adresinden en son sürümü alacak, zip dosyasını açacak ve mevcut yürütülebilir dosyanızı bununla değiştirecektir.

Belirli bir Deno sürümünü kurmak için bu aracı da kullanabilirsiniz:

```shell
deno upgrade --version 1.0.1
```

---

## Kaynaklardan derleme

:::note
Kaynaklardan nasıl derleneceği hakkında bilgi, `Katkıda Bulunma` bölümünde bulunabilir.
:::