---
title: Akıllı Sözleşmelerin Dağıtımı
---

# Akıllı Sözleşmelerin Dağıtımı

`agoric deploy` komutu,  aracılığıyla sözleşmeler ve bu sözleşmelerle iletişim kuran zincir dışı web uygulamalarını dağıtmayı destekler. Bu komutun iki ana kullanım alanı vardır:

- Akıllı sözleşme kaynak kodunu blok zincirine dağıtmak.
- Agoric sürecini çalıştıran yerel bir sunucuda bir uygulama programı dağıtmak ve ayarlamak.

`agoric deploy` komutunu, dapp'inizin `contract/deploy.js` ve `api/deploy.js` betiklerini çalıştırmak için kullanın. Mevcut bir Dapp'tan kopyalanan dağıtım betiklerini olduğu gibi kullanabilir veya bu belgede daha sonra önerilen şekilde değiştirebilirsiniz.

Unutmayın, Dapp'inizin üç ana alt dizini vardır:

- `contract/` dizini, zincir üzerindeki akıllı sözleşmenizi tanımlayan dosyaları içerir.
- `api/` dizini, kullanıcı arayüzünün, zincir üzerindeki bir arka uç sözleşme örneğiyle HTTP/WebSocket aracılığıyla iletişim kurmasını sağlar ve Dapp sözleşmesi ile arka uç işlemini başlatır.
- `ui/` dizini, sözleşmenizin tarayıcı kullanıcı arayüzü ile ilgili dosyaları içerir.

## Nasıl Çalışır

Tüm dağıtım işlemleri, yerel olarak çalışan Agoric süreci aracılığıyla gerçekleşir. Bu genellikle **ag-solo** süreci olarak adlandırılır ve bazen bir Agoric VM veya yerel sunucu olarak tanımlanır.

`ag-solo`, ya yerel olarak çalışan bir zincirle ya da uzaktan bir zincirle iletişim kurar. Yerel süreçte, çeşitli API komutlarını çağırmak için kullanılabilecek zincir üzerindeki hizmetlere atıf yapan bir `home` nesnesi bulunmaktadır. Bu tür referanslar arasında `zoe`, nesneleri paylaşmak için `board` ve uygulama kullanıcısının `wallet`'ı yer alır.

Her `deploy.js`, `ag-solo` ile bağlantılı kendi geçici sürecinde çalışır; böylece zincire erişebilir. İlk olarak, paketlenmiş sözleşme kaynak kodunu `ag-solo`'ya yükler, ardından `home` nesnesini kullanarak `zoe`'ye erişir ve o kodu zincir üzerinde kurmak için kullanır.

Dağıtım betiklerinin sözleşmeleri ve Dapp'leri dağıtmak için kullandığı tüm zincir üstü komutlar, cüzdanlarıyla ilişkili REPL aracılığıyla geliştiriciler için de mevcut bulunmaktadır.

## Sözleşme Dağıtımı

Öncelikle _sözleşme dağıtımına_ bakalım. `contract/deploy.js`, bir sözleşmenin kaynak kodunu (birden çok dosya ve modülden oluşabilir) paketler ve `Zoe` kullanarak bunu blok zincirine "kurar". Bu, sözleşme kodunu çalıştırmaz; yalnızca kodu zincir üzerinde kullanılabilir hale getirir.

Sözleşme dağıtım süreci, sözleşme kaynak kodunu zincir üzerinde kurmak için  kullanır. Bu, kaynak kodu ile ilişkili bir _kurulum_ döndürür. Tipik bir sözleşme dağıtımında, dağıtım betiği kurulumu varsayılan paylaşılan board'a ekler, böylece zincir üzerinde erişilebilir hale gelir. Ardından, betik, Dapp'in `ui` dizinindeki bir yapılandırma dosyasına board kimliğini yazar.

Varsayılan olarak, `agoric init` komutunu çalıştırdığınızda, Dapp'iniz, tipik bir sözleşme dağıtım betiği örneğimiz olan  alır.

`dapp-fungible-faucet` sözleşmesini dağıtmak (örneğin, `agoric deploy contract/deploy.js` ile `agoric init` komutu sonrasında yerel bir dizine kopyalanmışsa) onu zincir üzerinde kurar ve aşağıdakine benzer içeriğe sahip `ui/public/conf/installationConstants.js` dosyasını üretir:

```js
// dapp-fungible-faucet/contract/deploy.js'dan ÜRETİLMİŞTİR
export default {
  CONTRACT_NAME: 'fungibleFaucet',
  INSTALLATION_BOARD_ID: '1456154132'
};
```

Board, her nesne için benzersiz bir kimlik sağlar; bu durumda `"1456154132"` olduğu için, her sözleşme dağıtımında farklıdır.

## Uygulama Servisi Dağıtımı ve Kurulumu

Şimdi de _uygulama dağıtımına ve kurulumuna_ bakalım. Sözleşme dağıtımına kıyasla, Agoric API sunucusunun dağıtımını ve kurulumunu uygulamanıza ve sözleşmenize göre çok daha fazla özelleştirmeniz gerekir. Bazı Dapp'ler, yalnızca bir kez kurulacağı ve tüm müşterilere hizmet edeceği varsayılan bir singleton sözleşme örneği kullanır (bir açık artırma veya takas sözleşmesine kıyasla, bu sözleşme bir kez kurulmuş ancak her satış için ayrı ayrı kurulur). Bir singleton aşağıdaki işlemleri yapması gerekebilir:

- Bir sözleşme örneği oluşturmak
- Belirli para birimleri için zincir üzerindeki kaynakları bulmak ve bağlanmak
- Yeni zincir üzerindeki kaynaklar (yeni para birimleri veya NFT'ler gibi) oluşturmak
- Uygulamanın kullanması için yeni cüzdanlar oluşturmak
- Zincir üzerindeki sözleşme örneğini ilk siparişler veya yapılandırmalarla tohumlamak.

Aşağıdaki örnek sözleşme `api/deploy.js` betikleri, yukarıda bahsedilen özel kurulum eylemlerinin bir kısmını göstermektedir:

- 
- 
- 

Uygulama dağıtım adımları şunları içerebilir:

- `api/` kodunu paketlemek ve bunu çalışan yerel `ag-solo`'ya dağıtmak
- Paket içindeki sözleşme kurulum yapılandırma bilgilerini dahil etmek
- Yeni para birimleri oluşturmak ve bunları uygulamanın cüzdanına eklemek

Tüm müşteriler için bir singleton örneği kullanan sözleşmeler için, ek adımlar şunları içerebilir:

- Sözleşme dağıtımında oluşturulan kurulumu kullanarak bir sözleşme örneği oluşturmak
- Yeni örneği yapılandırmak için o örnek oluşturma davetini kullanmak
- Sözleşme örneğinin `instance`'ını Board'a kaydetmek
- Sözleşme örneğinin Board Kimliğini bir yapılandırma dosyasına kaydetmek