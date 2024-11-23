# TON'da Sözlükler

Akıllı sözleşmeler sözlükleri kullanabilir - sıralı anahtar-değer eşlemeleri. İçsel olarak hücrelerden oluşan ağaçlar ile temsil edilirler.

:::warning
Hücrelerden oluşan potansiyel olarak büyük ağaçlarla çalışmanın birkaç dikkate alınması gereken hususu vardır:
1. Her güncelleme işlemi, önemli miktarda hücre inşa eder (ve inşa edilen her hücre 500 gaz tutar, bu da `TVM Talimatları` sayfasında bulunabilir), bu da bu işlemlerin dikkat edilmeden kullanılması durumunda gazın tükenebileceği anlamına gelir.
   - Özellikle, Cüzdan botu bir kez böyle bir sorunla karşılaştı; yüksek yük-v2 cüzdanı kullanırken. Limitsiz döngü, her yinelemede pahalı sözlük güncellemeleri ile birleştiğinde gaz tükenmesine neden oldu ve sonunda bakiyesini boşaltan [fd78228f352f582a544ab7ad7eb716610668b23b88dae48e4f4dbd4404b5d7f6](https://tonviewer.com/transaction/fd78228f352f582a544ab7ad7eb716610668b23b88dae48e4f4dbd4404b5d7f6) gibi tekrarlanan işlemlere yol açtı.
2. N anahtar-değer çifti için ikili ağaç, N-1 çatala sahiptir ve bu nedenle toplamda en az 2N-1 hücre bulunur. Akıllı sözleşme depolaması 65536 benzersiz hücre ile sınırlıdır, bu nedenle sözlükteki maksimum öğe sayısı 32768 veya tekrar eden hücreler varsa biraz daha fazladır.
:::

## Sözlük Türleri

### "Hash" Haritası

Görünüşe göre, TON'da en bilinen ve kullanılan sözlük türü hashmap'tir. Bunun için TVM opcode'ları (`TVM Talimatları` - Sözlük Manipülasyonu) bölümünde kapsamlı bir bölüm vardır ve akıllı sözleşmelerde yaygın olarak kullanılmaktadır.

Bu sözlükler, aynı uzunluktaki anahtarları (belirtilen uzunluk tüm fonksiyonlara argüman olarak sağlanır) değer dilimlerine eşleyen haritalardır. İsimdeki "hash"a ters olarak, oradaki kayıtlar sıralıdır ve anahtara, önceki ya da sonraki anahtar-değer çiftine ulaşmada düşük maliyetli bir çıkarım sunar. Değerler, iç düğüm etiketleri ve olası anahtar parçalarıyla aynı hücrede yer alır; bu nedenle tüm 1023 biti kullanamazlar; bu durumda `~udict_set_ref` sıkça kullanılır.

Boş hashmap, TVM tarafından `null` olarak temsil edilir; dolayısıyla, bu bir hücre değildir. Bir sözlüğü bir hücrede depolamak için, önce bir bit (0 boş için, 1 aksi takdirde) kaydedilir ve ardından hashmap boş değilse referans eklenir. Bu nedenle, `store_maybe_ref` ve `store_dict` birbirinin yerini alabilir ve bazı akıllı sözleşme yazarları, gelen mesajdan veya depolamadan `Maybe ^Cell` yüklemek için `load_dict` kullanır.

> **Hashmap'ler için mümkün olan işlemler:**
> 
> - dilimden yükleme, yapılandırıcıya depolama
> - anahtara göre değeri getir/set/sil
> - değeri değiştirme (anahtar zaten varsa yeni değer ayarla) / ekleme (anahtar yoksa)
> - anahtar-değer çiftinin bir sonrakine/öncekine geçme, anahtarlar sırasına göre (gaz limiti bir endişe değilse `sözlüklerde yineleme yapmak için` kullanılabilir)
> - en küçük/büyük anahtarı değeri ile birlikte alma
> - anahtar ile fonksiyonu (devamı) alma ve hemen yürütme

Sözleşmenin gaz limitini aşmadan bozulmaması için, bir işlem işlenirken yalnızca sınırlı sayıda sözlük güncellemesi yapılmalıdır. Geliştiricinin koşullarına göre haritayı sürdürmek için sözleşmenin bakiyesi kullanılıyorsa, sözleşme kendisine bir mesaj göndererek temizlik işlemini devam ettirebilir.

:::info
Bir alt sözlüğü almak için talimatlar vardır: belirli bir anahtar aralığında girişlerin alt kümesi. Bu talimatlar test edilmemiştir, bu nedenle bunları yalnızca TVM montaj biçiminde inceleyebilirsiniz: `SUBDICTGET` ve benzerleri.
:::

#### Hashmap Örnekleri

Hashmap'lerin nasıl göründüğünü görelim, özellikle 257-bit tamsayı anahtarlarını boş değer dilimlerine eşleyen bir harita üzerinden bakalım (bu tür bir harita yalnızca öğenin varlığı veya yokluğunu belirtir).

Bunu hızlı bir şekilde kontrol etmenin bir yolu, aşağıdaki Python betiğini çalıştırmaktır (gerekirse `pytoniq` yerine uygun başka bir SDK ile değiştirilebilir):

```python
import pytoniq
k = pytoniq.HashMap(257)
em = pytoniq.begin_cell().to_slice()
k.set(5, em)
k.set(7, em)
k.set(5 - 2**256, em)
k.set(6 - 2**256, em)
print(str(pytoniq.begin_cell().store_maybe_ref(k.serialize()).end_cell()))
```

Yapı ikili ağaçtır; kök hücresini göz ardı edersek dengeli bir ağaçtır.

```
1[80] -> {
	2[00] -> {
		265[9FC00000000000000000000000000000000000000000000000000000000000000080] -> {
			4[50],
			4[50]
		},
		266[9FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF40] -> {
			2[00],
			2[00]
		}
	}
}
```

Belgelerde `hashmap ayrıştırma ile ilgili daha fazla örnek` bulunmaktadır.

### Artırılmış Haritalar (her düğümde ek veri ile)

Bu haritalar, TON doğrulayıcıları tarafından bir shard'daki tüm sözleşmelerin toplam bakiyesini hesaplamak için içsel olarak kullanılır (her düğümdeki toplam alt ağaç bakiyesi ile haritaların kullanılması, güncellemeleri çok hızlı bir şekilde doğrulamalarına olanak tanır). Bunlarla çalışmak için TVM ilkeleri yoktur.

### Önek Sözlüğü

:::info
Testler, önek sözlükler oluşturmak için yeterli belgelerin olmadığını ortaya koymaktadır. İlgili opcode'ların, `PFXDICTSET` ve benzerlerinin nasıl çalıştığı konusunda tam bilgi sahibi olmadıkça, bunları üretim sözleşmelerinde kullanmamalısınız.
:::
