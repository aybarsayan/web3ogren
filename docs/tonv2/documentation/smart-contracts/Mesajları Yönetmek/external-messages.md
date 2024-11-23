# Dış Mesajlar

Dış mesajlar, akıllı sözleşmelere belirli işlemler gerçekleştirmeleri için TON Blockchain'i üzerinden `dışarıdan gönderilen` iletilerdir.

Örneğin, bir cüzdan akıllı sözleşmesi, cüzdan sahibinin imzaladığı dış mesajlar içeren talimatlar almayı bekler (örneğin, cüzdan akıllı sözleşmesinden gönderilmesi gereken dahili mesajlar). Bu tür bir dış mesaj cüzdan akıllı sözleşmesi tarafından alındığında, önce imza kontrol edilir, ardından mesaj kabul edilir (TVM ilkesinden `ACCEPT` çalıştırılarak) ve ardından gereken işlemler gerçekleştirilir.

:::danger
Tüm dış mesajların `tekrar saldırılarına` karşı `korunması gerektiğini` unutmayın. Doğrulayıcılar genellikle dış mesajı, ağdan alınan önerilen dış mesajlar havuzundan çıkarır; ancak bazı durumlarda `başka bir doğrulayıcı` aynı dış mesajı iki kez işleyebilir (bu da orijinal eylemin çoğaltılmasına neden olarak aynı dış mesaj için ikinci bir işlem oluşturur). Daha da kötüsü, `kötü niyetli bir aktör`, işleme işlemine ait bloktan dış mesajı çıkartabilir ve daha sonra tekrar gönderebilir. Bu durum, bir cüzdan akıllı sözleşmesinin, örneğin, bir ödemeyi tekrarlamasına neden olabilir.
:::

```javascript
export const Highlight = ({children, color}) => (
<span
style={{
backgroundColor: color,
borderRadius: '2px',
color: '#4a080b',
padding: '0.2rem',
}}>
{children}
</span>
);
```

Dış mesajlarla ilgili `tekrar saldırılarından` akıllı sözleşmeleri korumanın en basit yolu, akıllı sözleşmenin kalıcı verilerinde 32-bit bir sayaç `cur-seqno` depolamak ve herhangi bir gelen dış mesajın (imzalı kısmında) `req-seqno` değerini beklemektir. Sonra bir dış mesaj, sadece imza geçerli ise ve `req-seqno` `cur-seqno`ya eşit ise kabul edilir. Başarılı bir işlemden sonra, kalıcı verilerdeki `cur-seqno` değeri bir artırılır, böylece aynı dış mesaj bir daha asla kabul edilmeyecektir.

Ayrıca birisi, dış mesajda bir `expire-at` alanı da ekleyebilir ve dış mesajı yalnızca mevcut Unix zamanı bu alanın değerinden küçükse kabul edebilir. Bu yaklaşım `seqno` ile birlikte kullanılabilir; alternatif olarak, alıcı akıllı sözleşme, kalıcı verilerinde (tüm yakın, süresi dolmamış) kabul edilen dış mesajların (hash'lerinin) kümesini depolayabilir ve yeni bir dış mesajı yalnızca önceden depolanmış mesajlardan biriyle bir kopya olması durumunda reddedebilir. Ayrıca, bu kümedeki süresi dolmuş mesajların bir kısmının temizlenmesi de yapılmalıdır, böylece kalıcı verilerin şişmesini önleyebilirsiniz.

:::note
Genel olarak, bir dış mesaj 256-bit bir imza (gerekirse), 32-bit bir `req-seqno` (gerekirse), 32-bit bir `expire-at` (gerekirse) ve muhtemelen `op` için gerekli diğer parametrelerle birlikte bir 32-bit `op` ile başlar. Dış mesajların yapısı, farklı geliştiriciler tarafından yazılan ve farklı sahipler tarafından yönetilen akıllı sözleşmeler arasında etkileşim için kullanılmadığından, dahili mesajların yapısı kadar standartlaştırılmış olmasına gerek yoktur.
::: 

--- 

:::info
**Önemli Not**: Dış mesajlarda kullanılan veri yapıları ve parametreler, uygulamadan uygulamaya farklılık gösterebilir. Uygulamanızın özel gereksinimlerine göre uygun değişiklikleri yapmayı unutmayın.
:::