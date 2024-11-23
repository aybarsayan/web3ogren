---
title: Agoric Sağlayıcısını Kurma
---

## Agoric Sağlayıcısını Kurma

`AgoricProvider`, uygulamanızın bağlamında birkaç özellik sunar; bunlara kancalar ve bileşenler aracılığıyla erişebilirsiniz:

- Çeşitli cüzdanlar için cüzdan bağlantı desteği (cosmos-kit kullanarak).
- Kullanıcının cüzdan bakiyelerine, tekliflerine ve diğer akıllı cüzdan durumlarına erişim.
- Teklif yapma ve işlemleri imzalama için geri çağırmalar.
- Vstorage'den zincir üstü durumu okumak için bir `chainStorageWatcher` erişimi.

Bu özellikler, platforma özgü uygulama detaylarının yönetimini kolaylaştırır, böylece kullanıcı arayüzlerinizi oluştururken iş mantığı ve kullanıcı deneyimine odaklanabilirsiniz.

### Bağımlılıklar

Aşağıdaki bağımlılıkları yükleyin:

```
yarn add -D @agoric/react-components@0.2.0 cosmos-kit@2.8.5 @interchain-ui/react@1.22.11
```

`cosmos-kit` bağımlılığı, cüzdan bağlantı penceresinde farklı cüzdanları sağlamak için kullanılır. `@interchain-ui/react` bağımlılığı, `@agoric/react-components` kullanılan bazı temel bileşenler için temalar ve stiller sağlamak amacıyla kullanılacaktır. Ayrıca, kendi uygulamanızı oluştururken kullanışlı olabilecek birçok bileşen de sağlanır. Agoric bileşenleri, aynı `ThemeProvider` kullanılarak özelleştirilebilir.

> **Not:** `yarn build` komutunun bellek hatalarıyla başarısız olduğunu görüyorsanız, bu durum artan paket boyutundan kaynaklanabilir. Bunun üstesinden gelmek için, `package.json` dosyasındaki `build` kısmına şu bayrağı eklemeyi deneyin:

```json
  "build": "tsc && NODE_OPTIONS=--max-old-space-size=4096 vite build",
```

### Sağlayıcıyı Eklemek

Sağlayıcıyı uygulamanızın köküne yerleştirmek için `App.tsx` dosyasını düzenleyin. Aynı zamanda bazı varsayılan iskelet kullanıcı arayüzü bileşenlerini de kaldırabiliriz. Sonuç, aşağıdaki gibi görünmelidir:

```tsx
import { AgoricProvider, ConnectWalletButton } from '@agoric/react-components';
import { wallets } from 'cosmos-kit';
import { ThemeProvider, useTheme } from '@interchain-ui/react';
import './App.css';
import '@agoric/react-components/dist/style.css';

function App() {
  const { themeClass } = useTheme();
  return (
    
      
        
          Agoric UI Eğitimi
          
        
      
    
  );
}

export default App;
```

`defaultChainName` prop'unun yerel bir zincire işaret ettiğini fark etmiş olabilirsiniz. Bu, hâlâ  Docker üzerinden yerel zinciri çalıştırdığınız varsayımına dayanıyor. Eğer bunu yapmıyorsanız, devam etmeden önce bu adımları izlediğinizden emin olun.

> **Not:** `wallets` prop'unda bir tür hatası görüyorsanız, bu muhtemelen `@agoric/react-components`'ın uygulamanızda kurulu olandan daha eski bir `cosmos-kit` sürümünü kullanıyor olmasından kaynaklanmaktadır. Bunu düzeltmek için, `package.json` dosyanıza şu şekilde `resolutions` ekleyebilirsiniz:

```json
  "resolutions": {
    "@cosmos-kit/core": "2.8.9"
  }
```

## Deneme

Bu değişiklikleri yaptıktan sonra uygulamanızın tekrar inşa edilmesini sağlamak için `yarn dev` komutunu deneyin. Eğer sorun yaşıyorsanız, örnek reposundaki `checkpoint-2` dalına göz atın. Fark edeceğiniz gibi, kullanıcı arayüzüne bir "Cüzdan Bağla" butonu ekledik. Bir sonraki bölümde bunu test edecek ve kullanıcının hesabına ve cüzdanlarına nasıl erişeceğimizi öğreneceğiz.