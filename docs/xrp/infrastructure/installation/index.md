---
title: Kurulum
seoTitle: XRP Ledger Sunucuları Kurulumu ve Güncellenmesi
sidebar_position: 1
description: XRP Ledger sunucularını, ana sunucu olan rippled ve API sunucusu Clioyu kurun ve güncelleyin. Bu rehber, gerekli adımları ve en iyi uygulamaları kapsamaktadır.
tags: 
  - XRP Ledger
  - rippled
  - Clio
  - kurulum
  - API sunucusu
keywords: 
  - XRP Ledger
  - rippled
  - Clio
  - kurulum
  - API sunucusu
---

# Kurulum

XRP Ledger sunucularını, ana sunucu olan **rippled** ve API sunucusu **Clio**'yu kurun ve güncelleyin.

:::tip
Rippled ve Clio sunucularınızı kurarken, gerekli bağımlılıkları ve sistem gereksinimlerini kontrol etmeyi unutmayın.
:::

## Adım 1: Gereksinimleri Kontrol Edin

Öncelikle, sistemde gerekli yazılımların ve bağımlılıkların kurulu olduğundan emin olun. Aşağıdakiler en azından gereklidir:

- **C++ derleyici**
- **CMake**
- **Boost kütüphanesi**
  
:::info
Bu yazılımlar, rippled ve Clio'nun doğru bir şekilde çalışması için kritik öneme sahiptir.
:::

## Adım 2: Rippled Kurulumu

Rippled sunucusunu kurmak için aşağıdaki adımları izleyin:

1. Repo'yu klonlayın:
   ```bash
   git clone https://github.com/ripple/rippled.git
   ```

2. Klasöre gidin ve yapılandırma dosyasını oluşturun:
   ```bash
   cd rippled
   mkdir build
   cd build
   cmake ..
   ```

:::warning
Yapılandırma adımında hata alırsanız, gerekli bağımlılıkların eksik olabileceğini kontrol edin.
:::

## Adım 3: Clio Kurulumu

API sunucusu Clio'yu şu şekilde kurabilirsiniz:

1. Clio repo'sunu klonlayın:
   ```bash
   git clone https://github.com/ripple/clio.git
   ```

2. Benzer adımları izleyerek yapılandırın ve kurun.

---

> **Önemli Not:** Rippled ve Clio'nun birlikte düzgün çalışabilmesi için versiyonlarının uyumlu olması gerekmektedir.
> — Ripple Kurulum Rehberi

## Destek ve Kaynaklar

Daha fazla bilgi ve güncellemeler için [Ripple resmi belgeleri](https://ripple.com/) sayfasını ziyaret edebilirsiniz.

