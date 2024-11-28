# Canonical Cell Serialization

## Cell weight

`Ağırlık`, hücreler ağacındaki her bir hücrenin bir özelliğidir ve şu şekilde tanımlanır:
* Eğer hücre bir yaprak düğümü ise: `ağırlık = 1`;
* Normal hücreler (yaprak olmayan) için ağırlık şudur: `hücre ağırlığı = çocuk ağırlığı + 1`;
* Eğer hücre bir _özel_ hücre ise, ağırlığı sıfıra ayarlanır.

Aşağıdaki algoritma, her hücreye ne zaman ve nasıl ağırlık atandığını açıklamaktadır.

## Ağırlık sıralama algoritması 

Her hücre, ağırlığı dengelenmiş bir ağaçtır ve [reorder_cells()](https://github.com/ton-blockchain/ton/blob/15088bb8784eb0555469d223cd8a71b4e2711202/crypto/vm/boc.cpp#L249) yöntemi, ağırlıkları çocukların toplam ağırlığına göre yeniden atar. Geçiş sırası kökler -> çocuklardır. Bu bir genişlik öncelikli arama olup, *muhtemelen* önbellek doğrusalığını korumak için kullanılır. Ayrıca, hash boyutunun yeniden hesaplanmasını tetikler ve çantayı (kökler) yeniden dizinler, her ağaç için yeni dizinler belirler ve boş referanslar için yeni dizinler ayarlar. Yeniden dizinleme derinlik önceliklidir, ancak bu dizinleme düzenine bağlı olan bir şey vardır, çünkü beyaz kağıt bunu tercih edildiğini belirtir.

:::tip
Orijinal düğümün hücre çantası serileştirmesini takip etmek için şunları yapmalısınız:
:::

- İlk olarak, eğer hücrelerin ağırlıkları ayarlanmamışsa (düğüm bunun hücre ithalinde işlemini yapar), her hücre için ağırlığı `1 + sum_child_weight` olarak ayarlıyoruz; burada `sum_child_weight`, hücrenin çocuk düğümlerinin ağırlıklarının toplamıdır. Yaprakların 1 ağırlığı olması için bir ekliyoruz.

- Tüm kökleri yineleyin, her kök hücre için:
  * Her bir referansının ağırlığının `maximum_possible_weight - 1 + ref_index` değerinin, kök hücre referanslarının sayısına bölündüğünde elde edilen değerden küçük olup olmadığını kontrol edin; böylece ebeveynlerin ağırlıklarını eşit şekilde paylaşırlar, (+ index) ile bölünme sırasında dilin sıfıra yakın olması durumunda hep matematiksel olarak yuvarlanmış bir sayı elde etmek için (örneğin 5 / 3 için C++, 1 döndürecektir, ancak burada 2 istemekteyiz).
      
  * Eğer bazı referanslar bu kuralı ihlal ediyorsa, bunları listeye ekliyoruz (veya daha verimli olarak bir bitmask oluşturuyoruz, orijinal düğümün yaptığı gibi) ve ardından yineleyerek bunların ağırlıklarını `weight_left / invalid_ref_count` olarak sıkıştırıyoruz; burada `weight_left`, `maximum_possible_weight - 1 - sum_of_valid_refs_weights` değeridir. Kodda, bir sayıcı değişkenin azaltılması olarak uygulamalar, ilk olarak `maximum_possible_weight - 1` ile başlar ve sonra `counter -= valid_ref_weight` ile azaltılır. Temelde, kalan ağırlığı bu düğümler arasında yeniden dağıtıyoruz (dengelemekteyiz).

:::info
Kökler üzerinde tekrar yineleyin, her kök için:
:::
* Referanslarının ağırlıklarının yeni toplamının `maximum_possible_weight` değerinden küçük olduğundan emin olun; yeni toplam, önceki kök hücresinin ağırlığından daha az oldu mu kontrol edin ve ağırlığını yeni toplamla sıkıştırın. (Eğer `new_sum  0 ise), en üst hash sayısını artırın, düğümün hash sayısı kadar.

### Ağaç üzerinde tekrar dizinleme yapın:
* Öncelikle, tüm kök hücreleri ön ziyaret edilmelidir. Eğer bu düğümü daha önce ziyaret etmediysek, tüm referanslarını özel düğümler için özyinelemeli olarak kontrol edin. Eğer bir özel düğüm bulursak, diğerlerinden önce ön ziyaret ve ziyaret etmemiz gerekir; bu, özel düğümün çocuklarının listede ilk sırada geleceği anlamına gelir (onların dizinleri en düşük olanlardır). Sonra diğer düğümlerin çocuklarını ekliyoruz (en derin -> en yüksek sıralama ile). Kökler listeye en son gelir (en büyük dizinlere sahiptir). Sonuç olarak, daha derin olan düğümün daha düşük bir dizine sahip olduğu sıralı bir liste elde ederiz.

`maximum_possible_weight` sabiti 64'tür.

---

## Denotes

* **Özel hücrenin ağırlığı** yoktur (0'dır)
* İthalatta ağırlığın 8 bitlik bir değere uyduğundan emin olun (ağırlık \<= 255)

* Dahili hash sayısı, tüm özel kök düğümlerinin hash sayılarının toplamıdır.
* En üst hash sayısı, diğer (özel olmayan) kök düğümlerinin hash sayılarının toplamıdır.