---
title: Cüzdan API
---

# Cüzdan API

Bir Cüzdan ile, JavaScript _REPL_ (_Read-Eval-Print Loop_) aracılığıyla etkileşimde bulunabilirsiniz. Bu, Cüzdan UI görüntüsünün en altında görünmektedir. REPL'de, `home.wallet` adlı cüzdanınıza mesajlar gönderirsiniz; bu, o sayfa/proses üzerinde çalışan cüzdandır. REPL'de `E(home.wallet).foo()` yazmak, mevcut tüm Cüzdan API yöntemlerinin adlarını döndüren zekice bir yöntemdir; şu şekilde çalışır: var olmayan bir API yöntemini değerlendirmesini isterseniz, geçerli yöntemlerin listelendiği bir hata mesajı alırsınız.

`agoric open --repl only` komutunu çalıştırdığınızda, yalnızca REPL'i gösteren bir tarayıcı sekmesi açar; bu, Cüzdan UI ve REPL alanının birleşiminden ziyade sadece REPL'dir. REPL'den Cüzdan'a komut gönderirken, bu komutların `E(home.wallet).` biçiminde olması gerekir. `E()` hakkında daha fazla bilgi için,  için Dağıtık JavaScript Programlama Kılavuzu'na bakın.

Cüzdan API komutlarının çalıştığı iki nesne vardır:

- `WalletUser`: `local.wallet` (ve geriye dönük uyumluluk için `home.wallet`) olarak sunulan mevcut.  
  Bu, Cüzdan API komutları için bir alan sağlar.
- `WalletBridge`: Bu nesnenin yöntemleri, cüzdanın bütünlüğünü ihlal etmeden güvensiz bir Dapp tarafından kullanılabilir. Bu yöntemler, bir Dapp UI'nin cüzdana erişebilmesi için kullanabileceği iframe/WebSocket köprüsü aracılığıyla da sunulur.