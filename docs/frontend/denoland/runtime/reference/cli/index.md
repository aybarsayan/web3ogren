---
title: "Deno CLI Alt Komutları"
description: Deno CLI, Deno çalışma zamanı ortamında çeşitli görevler gerçekleştirmek için bir dizi alt komut sunar. Bu belgede, temel alt komutlar, bağımlılık yönetimi ve araçlar hakkında bilgi bulacaksınız.
keywords: [Deno, CLI, komutlar, bağımlılık yönetimi, araçlar]
oldUrl: "/runtime/reference/cli/all_commands"
---

Deno CLI (Komut Satırı Arayüzü), terminalinizden veya komut istemcinizden Deno çalışma zamanı ortamıyla etkileşimde bulunmanıza olanak tanır. CLI, farklı görevleri yerine getirmek için kullanılabilecek bir dizi alt komuta sahiptir. Her bir alt komut hakkında daha fazla bilgi için aşağıdaki bağlantılara bakın.

## Yürütme

- `deno run` - bir script çalıştır
- `deno serve` - bir web sunucusu çalıştır
- `deno task` - bir görevi çalıştır
- `deno repl` - bir okuma-değerlendirme-yazdırma döngüsü başlatır
- `deno eval` - sağlanan scripti değerlendir

---

## Bağımlılık yönetimi

- `deno add` - bağımlılık ekle
- `deno install` - bir bağımlılığı veya bir scripti yükle
- `deno uninstall` - bir bağımlılığı veya bir scripti kaldır
- `deno remove` - bağımlılıkları kaldır
- `deno outdated` - güncel olmayan bağımlılıkları görüntüle veya güncelle

:::tip
En iyi uygulama olarak, bağımlılıkların güncel tutulması, projenizin sağlığı için kritik öneme sahiptir.
:::

---

## Araçlar

- `deno bench` - karşılaştırma aracı
- `deno check` - programınızın türünü çalıştırmadan kontrol et
- `deno compile` - bir programı bağımsız bir çalıştırılabilir dosya haline getir
- `deno completions` - shell tamamlamaları oluştur
- `deno coverage` - test kapsam raporları oluştur
- `deno doc` - bir modül için dokümantasyon oluştur
- `deno fmt` - kodunuzu biçimlendir
- `deno info` - bir ES modülünü ve tüm bağımlılıklarını incele
- `deno init` - yeni bir proje oluştur
- `deno jupyter` - bir Jupyter defteri çalıştır
- `deno lint` - kodunuzu denetle
- `deno lsp` - dil sunucusu protokolü entegrasyonu
- `deno publish` - bir modülü JSR'ye yayınla
- `deno test` - testlerinizi çalıştır
- `deno types` - çalışma zamanı türlerini yazdır
- `deno upgrade` - Deno'yu en son sürüme yükselt

:::info
Deno CLI, geliştiricilere projelerinde çeşitli işlevsellik ve verimlilik sağlamak için tasarlanmıştır.
:::

---

## Diğer

- `Kararsız özellik bayrakları`
- `Deno LSP Entegrasyonu`