---
title: Başlarken
---

# Başlarken

Agoric UI'lerini oluşturmayı daha rahat hale getiren birkaç kütüphane bulunmaktadır; bu kütüphanelerin tamamı  reposunda yer almaktadır:

- : Blockchain ve akıllı sözleşme durumlarını sorgulamak ve güncellemeleri almak için kullanılır.
- : Akıllı cüzdana erişmek, teklifler oluşturmak ve varlık bakiyelerini görüntülemek gibi yardımcı araçlar için kullanılır.
- : Yukarıda açıklanan tüm işlevlerin yanı sıra kullanım kolaylığı için pratik kancalar ve bağlam içeren React bileşenleri.

Bu öğretici, bu kütüphanelerden faydalanacak ve onları daha iyi öğrenmek için ipuçları sunacaktır.

## Şablon Oluşturma

Bu öğretici, en büyük rahatlık için  kullanacaktır. Bu nedenle, ilk adım yeni bir React uygulaması oluşturmak için  kullanmaktır. Yeni bir çalışma alanı oluşturun ve yeni bir `react-ts` uygulaması şablonu oluşturmaya yönelik şu komutu kullanın:

```
yarn create vite my-agoric-ui --template react-ts
```

Komutun çıktısında yer alan talimatları izleyin ve temel bir React uygulamasıyla yerel bir geliştirme sunucusu çalışır durumda olmalıdır.

## Güçlendirme

Bir sonraki adım,  kütüphanesini yüklemektir çünkü Agoric kütüphaneleri Hardened JavaScript'e bağımlıdır. Kurulumu yapmak için birkaç bağımlılık ekleyelim:

```
yarn add -D ses @endo/eventual-send
```

Ayrıca, daha sonra  kullanabilmek için `buffer` kütüphanesini de eklememiz gerekecek. Şimdi bunu yapalım:

```
yarn add -D buffer
```

Şimdi, yeni bir dosya oluşturun: `src/installSesLockdown.ts`:

```typescript
import 'ses'; // lockdown, harden ve Compartment ekler
import '@endo/eventual-send/shim.js'; // E'nin ihtiyaç duyduğu desteği ekler
import { Buffer } from 'buffer';

const consoleTaming = import.meta.env.DEV ? 'unsafe' : 'safe';

lockdown({
  errorTaming: 'unsafe',
  overrideTaming: 'severe',
  consoleTaming
});

Error.stackTraceLimit = Infinity;

globalThis.Buffer = Buffer;

// @ts-expect-error cosmos-kit için bağlama process ekle
globalThis.process = { env: import.meta.env };
```

Ve `src/main.tsx` dosyasının en üstüne yeni dosyayı import edin:

```typescript
import './installSesLockdown.ts';
```

Uygulamanızı yeniden başlatın ve hatasız olarak eskisi gibi yüklenmesini sağlamalısınız. Artık uygulamanız Hardened JS etkinleştirilmiş şekilde çalışıyor ve devam etmek için hazırız.