---
description: Bu belgede, PM2 için otomatik tamamlama kurulumu açıklanmaktadır. Kullanıcılar, komutlarını ve argümanlarını hızlı ve kolay bir şekilde tamamlamak için adım adım kılavuz bulacaklardır.
keywords: [PM2, otomatik tamamlama, sekme tamamlaması, CLI, bash, zsh]
---

# CLI tamamlama

PM2 için Sekme-tamamlaması:

```bash
pm2 completion install
```

Ya da tamamlanma betiğini manuel olarak `~/.bashrc` veya `~/.zshrc` dosyanıza ekleyin:

```bash
pm2 completion >> ~/.bashrc # veya ~/.zshrc
```

:::tip
Mevcut oturumunuz için `.bashrc` veya `.zshrc` dosyanızı kullanarak PM2 tamamlama özelliğini aktif hale getirin.
:::

Ardından mevcut oturum için `.bashrc` veya `.zshrc` dosyanızı kaynaklayın:

```bash
source ~/.bashrc # veya ~/.zshrc
```

PM2 tamamlama özelliğini mevcut oturumunuza **bu şekilde** ekleyebilirsiniz:

```bash
. <(pm2 completion)
```

:::info
PM2 otomatik tamamlama, komutları ve argümanları daha hızlı yazmanıza yardımcı olur ve CLI deneyiminizi geliştirir.
:::