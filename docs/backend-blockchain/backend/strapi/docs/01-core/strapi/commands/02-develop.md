---
title: Geliştir
description: develop komutu, Strapi uygulamalarını geliştirmek için kullanılır. Bu kılavuz, bu komutun kullanımını, seçeneklerini ve nasıl çalıştığını açıklar.
keywords: [Strapi, develop, CLI, içerik türleri, yönetim paneli, geliştirme]
---

`develop` komutu, Strapi node uygulamanızı geliştirmek için kullanılır; örneğin, `content-type-builder` içinde içerik türleri oluşturmak ve Strapi monorepo içinde veya bağımsız bir projede yerel geliştirme için webpack ile yönetim panelini "izlemek".

## Kullanım

```bash
strapi develop
```

### Seçenekler

```bash
Strapi uygulamanızı geliştirme modunda başlatır

Seçenekler:
  --polling         Ağ dizinlerinde dosya değişikliklerini izleyin (varsayılan: false)
  --watch-admin     Yönetim panelini sıcak değişiklikler için izleyin
  --open            Yönetimi tarayıcınızda açın (varsayılan: true)
  -h, --help        Komut için yardım göster
```

### :::info Önemli Bilgiler
`develop` komutunu kullanmadan önce, gerekli tüm bağımlılıkların yüklü olduğundan emin olun. Bu, çalışmalarınızı sorunsuz yapacaktır.

## Nasıl çalışır

Develop komutu, `build` komutu gibi kendini ayarlar. Middleware'lerimizi ekledikten sonra, Strapi örneğini yükleriz ve ardından kullanıcının örneğine dayalı türleri oluştururuz ve eğer bir TS projesindeysek herhangi bir TS sunucu kodunu derleyebiliriz. Son adım, kullanıcı projesini geliştirirken Strapi örneğini gerçek zamanlı olarak yeniden başlatabilmemiz için proje dizinini izlemektir.

## Node Kullanımı

```ts
import { develop, DevelopOptions } from '@strapi/admin/_internal';

const args: DevelopOptions = {
  // ...
};

await develop(args);
```

### Seçenekler

```ts
interface DevelopOptions extends CLIContext {
  /**
   * Komutun çalıştırıldığı dizin
   */
  cwd: string;
  /**
   * Kullanılacak logger.
   */
  logger: Logger;
  /**
   * Derleme tamamlandıktan sonra tarayıcıyı açıp açmamaya karar verir.
   */
  open?: boolean;
  /**
   * Ağ dizinlerinde dosya değişikliklerini izleyin
   */
  polling?: boolean;
  /**
   * Derleme için kullanılacak tsconfig. Tanımlı değilse, bu bir TS projesi değildir.
   */
  tsconfig?: TsConfig;
  /**
   * Değişiklikler için yönetimi izleyin
   */
  watchAdmin?: boolean;
}
```

### :::tip İpuçları
- Komutlarınızı düzenli olarak test edin.
- Geliştirme sırasında tarayıcınızı sık sık yeniden yükleyerek değişikliklerinizi kontrol edin.

```ts
interface Logger {
  warnings: number;
  errors: number;
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  log: (...args: unknown[]) => void;
  spinner: (text: string) => Pick<ora.Ora, 'succeed' | 'fail' | 'start' | 'text'>;
}

interface TsConfig {
  config: ts.ParsedCommandLine;
  path: string;
}
```