---
title: Agoric REPL
---

**Not:** Bu sayfa Agoric REPL hakkında bilgi vermektedir. Eğer `node` veya Node.js REPL hakkında bilgi arıyorsanız,  göz atabilirsiniz.

## Giriş

`agoric start --reset` komutunu çalıştırdığınızda, yerel bir _ag-solo_ başlatmış olursunuz.

`agoric start`, kişisel bir yerel Agoric düğümü olan _ag-solo_’yu başlatmak için kullanılır. Agoric ağ hizmetleri ile etkileşimde bulunmak için makinenizde bir ag-solo'nun çalışır durumda olması gerekir; bu, `agoric start` ile başlatılan bir entegre simüle edilmiş zincir veya tamamen merkeziyetsiz bir genel Agoric blok zinciri olabilir.

Tüm dağıtım yerel olarak çalışan Agoric süreci üzerinden gerçekleşir. Bu genellikle ag-solo sürecidir ve sıklıkla bu şekilde veya sadece ag-solo olarak anılır. Bazen Agoric VM veya yerel sunucu olarak da tanımlanır.

Bir ag-solo, ya yerel olarak çalışan ya da uzaktaki bir zincir ile iletişim kurar. Bu yerel süreç (ag-solo), Zoe, nesneleri paylaşmak için kullanılan Board ve bir uygulama kullanıcısının Cüzdanı gibi, zincir üzerindeki hizmetlere referanslar içeren bir `home` nesnesine sahiptir. Geliştiriciler, bu hizmet referanslarını kullanarak hizmetin ilişkili API komutlarını çağırabilirler.

Sözleşme kodu, kullanıcının bilgisayarındaki bir dosyada başlar; bu kod, ya kullanıcı tarafından yazılmış ya da `agoric/zoe`’den içe aktarılmış olabilir. Kod, dağıtım betiği çalışırken bellekte mevcut olan özel bir biçimlendirilmiş kod parçasına _paketlenir_. `E(zoe).install()` çağrıldığında, bu kod parçası zincire gönderilir ve depolanır, böylece Zoe ona erişebilir.

Bir ag-solo, ilişkili bir REPL (_Read-Eval-Print Loop_) ile birlikte gelir. REPL'den ve `home` nesnesinden, geliştiriciler, sözleşmeleri ve Dapps'i dağıtmak için dağıtım betiklerinin kullandığı tüm zincir üzerinde komutları kullanabilirler. Zincir üzerindeki komutların yanı sıra, REPL'den diğer JavaScript komutlarını da çalıştırabilirler.

## REPL'e Erişim

Bir ag-solo çalışmaya başladıktan ve zincir üzerinde aktif hale geldikten sonra, ilişkili REPL’ine iki şekilde erişebilirsiniz.

- Bir tarayıcı sekmesinde, `localhost:8000` adresine gidin. Tarayıcının genişliğine bağlı olarak, Cüzdan UI’si ve REPL ya ayrı sütunlarda ya da ayrı satırlarda görünecektir.





- Bir terminalden, `agoric open --repl` komutunu çalıştırın. Bu, kullanıcının Cüzdan UI’sini ve ilişkili REPL’ini açar. Yalnızca REPL'i açmak için `agoric open --repl only` komutunu çalıştırın.



## REPL Kullanımı

REPL’den JavaScript komutlarını çalıştırabilirsiniz. Ayrıca REPL'in `home` nesnesinin diğer nesneler ve hizmetlerle önceden tanımlanmış bağlantılarını kullanabilirsiniz. Nelerin mevcut olduğunu görmek için, REPL’e sadece `home` yazmanız yeterlidir:



```js
Command[1] home
History[1] {"chainTimerService":[Presence o-50],"contractHost":[Presence o-52],"ibcport":[Presence o-53],"registrar":[Presence o-54],"registry":[Presence o-55],"zoe":[Presence o-56],"localTimerService":[Presence o-57],"uploads":[Presence o-58],"spawner":[Presence o-59],"wallet":[Presence o-60],"network":[Presence o-61],"http":[Presence o-62]}
```

REPL'e girilen komutların sonuçları `history[N]` altında kaydedilir.

Aşağıdaki bölümler, geliştiricilerin kullanabileceği `home` nesnelerini açıklamaktadır. Daha fazla ayrıntılı belgeye ulaşmak için bölüm başlığına tıklayın. Bazı `home` nesneleri sadece Agoric iç kullanımı için tasarlanmıştır veya kullanım dışıdır. Bu nesneler, son bölümde birlikte listelenmiştir. Dış geliştiricilerin bunları görmezden gelmeleri ve kullanmaya çalışmamaları önerilir.

### 

Kullanıcının adına zincir üzerindeki dijital varlıkları ve nesne yeteneklerini saklar. Başlık bağlantısı sizi standart REPL dışı `wallet` API belgelerine yönlendirecektir. REPL'den `wallet` API yöntemlerini çağırırken, `wallet`'i `home.` ile önceden belirtmeli ve `E()` kullanmalısınız. Örneğin, `E(home.wallet).getPurses()`. 

### 

Olayları planlamak için kullanılan zincir üzerindeki zaman otoritesi. 

### 

Olayları planlamak için kullanılan yerel zincir dışı zaman otoritesi. 

### 

Kullanıcıların genel olarak erişilebilir değerleri paylaşabilecekleri zincir üzerindeki paylaşılan bir konum. 

### 

Vats'ın dinleme portlarını açıp kapatmasına, uzaktaki portlara bağlanmasına ve veri gönderip almasına olanak tanıyan IBC uygulaması. 

### 

Akıllı sözleşmeleri dağıtmak ve onlarla etkileşim sağlamak için kullanılır. Zoe, akıllı sözleşme kullanıcılarını dijital varlıkları güvence altına alarak korur ve kullanıcılara istedikleri şeyi ya da yatırdıkları varlıkların geri iadesini garanti eder. Sözleşme hatalı veya kötü niyetli olsa bile. Başlık bağlantısı sizi standart, REPL dışı `zoe` API belgelerine yönlendirir. REPL'den `zoe` API yöntemlerini çağırırken, `zoe`'yi `home.` ile önceden belirtmeli ve `E()` kullanmalısınız. Örneğin, `E(home.zoe).getFoo()`. 

### 

Dijital varlık çiftleri için fiyat teklifleri almak için kullanılır. 

### 

Ag-solo'nuzda daha sonra kullanım için anahtar-değer çiftlerini saklamak için kullanılan bir zincir dışı, özel yerdir. 

### Kullanım Dışı ve Yalnızca Dahili Nesneler

- `contractHost`: `spawner` nesnesi ile değiştirilmiştir.
- `faucet`: Zincir kurulumu için dahili.
- `http`: `api/deploy.js` bunu yeni HTTP ve WebSocket yöneticilerini bir ag-solo'da kurmak için kullanır. Bunu kullanmanız gerekmez.
- `network`: Dahili kullanım için ayrıcalıklı nesne. 
- `plugin`: Dahili kullanım için ayrıcalıklı nesne.
- `priceAuthorityAdmin`: Dahili kullanım için ayrıcalıklı nesne.
- `registrar`: Kullanımdan kaldırıldı.
- `registry`: Kullanımdan kaldırıldı.
- `spawner`: Dahili kullanım için ayrıcalıklı nesne.
- `uploads`: `scratch` için kullanım dışı isim.
- `vattp`: Dahili kullanım için ayrıcalıklı nesne.