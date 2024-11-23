# Non-bounceable mesajlar

```javascript
export const Highlight = ({children, color}) => (
<span
style={{
backgroundColor: color,
borderRadius: '2px',
color: '#fff',
padding: '0.2rem',
}}>
{children}
</span>
);
```

Akıllı sözleşmeler arasında gönderilen neredeyse tüm iç mesajların bounceable olması gerekir; yani "bounce" bitinin ayarlanmış olması gerekir. Eğer hedef akıllı sözleşme yoksa veya bu mesajı işlerken işlenmemiş bir istisna fırlatıyorsa, mesaj "bounce" yapılarak geri gönderilecektir ve orijinal değerin geri kalanını (tüm mesaj aktarım ve gaz ücretleri hariç) taşıyacaktır. 

> **Önemli:** Bounce yapılan mesajın gövdesi `32 bit 0xffffffff` ve ardından orijinal mesajdan gelen `256 bit` içerecektir, ancak "bounce" bayrağı temizlenmiş ve "bounced" bayrağı ayarlanmıştır. Bu nedenle, tüm akıllı sözleşmeler tüm gelen mesajların "bounced" bayrağını kontrol etmeli ve ya sessizce kabul etmeli (hemen sıfır çıkış kodu ile sona ererek) ya da hangi çıkış sorgusunun başarısız olduğunu tespit etmek için özel bir işlem gerçekleştirmelidir. 

:::info
Bounce yapılan mesajın gövdesindeki sorgu  asla yürütülmemelidir.
:::

Bazı durumlarda, `non-bounceable iç mesajlar` kullanılması gerekir. Örneğin, yeni hesaplar oluşturulamaz, en az bir non-bounceable iç mesajın onlara gönderilmesi gerekmektedir. Bu mesaj, yeni akıllı sözleşmenin kodu ve verisi ile birlikte bir `StateInit` içermedikçe, non-bounceable bir iç mesajda boş olmayan bir gövdeye sahip olmanın bir anlamı yoktur.

:::tip
Son kullanıcının (örneğin, bir cüzdanın) büyük miktarda değer (örneğin, beş Toncoin'den fazla) içeren bounce yapılamaz mesajlar göndermesine "izin vermemek" iyi bir fikirdir veya böyle yaparlarsa onları uyarmak daha iyidir. Öncelikle küçük bir miktar göndermek, ardından yeni akıllı sözleşmeyi başlatmak ve sonra daha büyük bir miktar göndermek daha "iyi bir fikir" olacaktır.
:::