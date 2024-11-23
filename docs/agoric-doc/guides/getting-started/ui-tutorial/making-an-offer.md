---
title: Teklif Yapma
---

## Teklif Yapma

Eğer buraya kadar geldiyseniz, bir cüzdana bağlanan, kullanıcının IST cüzdan bakiyesini gösteren ve `chainStorageWatcher` ile zinciri okuyan bir React uygulaması oluşturmuşsunuz demektir. Herhangi bir sorunla karşılaştıysanız, referans için  dalına göz atabilirsiniz.

Bu son eğitimde, uygulamanızdan teklifler yapmayı öğrenecek, her şeyi kullanıcı için temel bir uçtan uca deneyimde birleştireceksiniz.

### UI Oluşturma

Bir teklif göndermeden önce, kullanıcının istedikleri öğeleri belirtmesi için bazı temel girişler oluşturmamız gerekiyor. Sözleşmede satış için mevcut 3 tür öğe bulunmaktadır, bu yüzden `Trade.tsx` dosyasında bunları listelemek için bir dizi oluşturun:

```ts
const allItems = ['scroll', 'map', 'potion'];
```

Sonra, kullanıcının teklifteki her bir öğenin miktarını seçebilmesi için `Trade.tsx` dosyasına başka bir bileşen ekleyin:

```tsx
const Item = ({
  label,
  value,
  onChange,
  inputStep
}: {
  label: string;
  value: number | string;
  onChange: React.ChangeEventHandler;
  inputStep?: string;
}) => (
  
    {label}
    
  
);
```

Ve `App.css` dosyasına bazı stiller ekleyin:

```css
.item-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 15px 25px 15px;
  margin: 5px;
}

.row-center {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.input {
  border: none;
  background: #242424;
  text-align: center;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 1.2rem;
  width: 75px;
}

.input[type='number']::-webkit-inner-spin-button {
  opacity: 1;
}
```

Şimdi, `Trade` bileşeninizde listedeki her biri için bir `Item` render edin:

```tsx
const Trade = () => {
  ...

  const [choices, setChoices] = useState>({
    map: 1n,
    scroll: 2n,
  });

  const changeChoice = (ev: FormEvent) => {
    if (!ev.target) return;
    const elt = ev.target as HTMLInputElement;
    const title = elt.title;
    if (!title) return;
    const qty = BigInt(elt.value);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [title]: _old, ...rest } = choices;
    const newChoices = qty > 0 ? { ...rest, [title]: qty } : rest;
    setChoices(newChoices);
  };

  return (
    
      İstediğiniz: En fazla 3 öğe seçin
      
        {allItems.map(title => (
          
        ))}
      
    
  );
}
```

Gördüğünüz gibi, `choices`'ı bir `useState` kancası ile saklıyorsunuz. Böylece, kullanıcı girişleri değiştirdikçe, her tür öğenin sayısı güncelleniyor. Daha sonra `choices` kullanarak teklifi belirleyeceksiniz.

Sonraki adımda, kullanıcının öğeler için vermek istediği IST miktarını belirtmesi için bir giriş alanı ekleyeceksiniz. Öncelikle önceden oluşturduğunuz `usePurse` ile IST cüzdanına bir referans alın ve IST değeri için bir durum kancası oluşturun:

```tsx
const Trade = () => {
  const istPurse = usePurse('IST');
  const [giveValue, setGiveValue] = useState(0n);

  ...
}
```

Sonra, IST "verme" miktarı için bir giriş eklemek üzere `` bileşenini kullanın:

```tsx
import { AmountInput } from '@agoric/react-components';

...

// 'Trade' bileşeninde:
{istPurse && (
  <>
    Verilecek: En az 0.25 IST
    
      
    
  
)}
```

### Teklif Gönderme

Bu bileşenler oluşturulduğunda, kullanıcı öğe ve IST miktarlarını seçebilir ve uygulama bunları durumunda saklayabilir. Şimdi, seçilen miktarlarla akıllı sözleşmeye bir teklif yapmak için `makeOffer` fonksiyonunu nasıl kullanacağınızı göreceksiniz.

Daha önce `Trade` bileşeninize eklediğiniz `useContract` kancasını hatırlayın. Teklifi göndermek için markaları ve örneği ihtiyaç duyacaksınız:

```ts
const { brands, instance } = useContract();
```

Ardından, `useAgoric()` kancasından `makeOffer` fonksiyonunu alın:

```ts
const { makeOffer } = useAgoric();
```

Şimdi teklifi göndermek için bir fonksiyon oluşturun. Bunun nasıl çalıştığına dair daha fazla bilgi için  dokümanına bakın:

```ts
import { makeCopyBag } from '@agoric/store';

// 'Trade' bileşeninin içinde:
const submitOffer = () => {
  assert(brands && instance && makeOffer);
  const value = makeCopyBag(Object.entries(choices));
  const want = { Items: { brand: brands.Item, value } };
  const give = { Price: { brand: brands.IST, value: giveValue } };

  makeOffer(
    {
      source: 'contract',
      instance,
      publicInvitationMaker: 'makeTradeInvitation'
    },
    { give, want },
    undefined,
    (update: { status: string; data?: unknown }) => {
      console.log('GÜNCELLEME', update);
      if (update.status === 'error') {
        alert(`Teklif hatası: ${update.data}`);
      }
      if (update.status === 'accepted') {
        alert('Teklif kabul edildi');
      }
      if (update.status === 'refunded') {
        alert('Teklif reddedildi');
      }
    }
  );
};
```

Tekliflerin nasıl çalıştığı hakkında özel bilgiler için  belgesine bakın. `makeOffer` fonksiyonu, bir `InvitationSpec` belirtmenizi sağlar, otomatik olarak verilerin marshalling işlemini gerçekleştirir ve teklif durumuna yapılan güncellemeleri kolayca yönetmenize olanak tanır.

Yeni yazdığınız fonksiyon, sözleşmenin anlayabileceği şekilde öğe miktarını oluşturmak için `makeCopyBag` yardımcı fonksiyonunu kullanır. Bunu bağımlılıklarınıza ekleyin:

```
yarn add -D @agoric/store@0.9.2
```

Ve `vite-env.d.ts` dosyasına türü ekleyin:

```ts
declare module '@agoric/store' {
  export const makeCopyBag;
}
```

Artık, teklifi göndermek için bir buton ekleyin:

```tsx
{
  !!(brands && instance && makeOffer && istPurse) && (
    Teklif Yap
  );
}
```

Teklife tıkladığınızda, seçtiğiniz "Verilecek" ve "İstenecek"lerle birlikte bir Keplr penceresinin onay verme isteği ile açıldığını görmelisiniz. 3 öğe seçmeyi ve 0.25 IST vermeyi deneyin; teklif kabul edilmelidir. 3'ten fazla öğe seçerseniz ya da 0.25 IST'den az verirseniz, teklif reddedilmelidir ve IST'niz geri alınmalıdır (bkz. ).

### Öğelerin Cüzdanını Görsel Olarak Gösterme

Öyleyse, başarılı bir teklif verdiniz ve bazı öğeler aldınız, ama onlar nerede? Öğeleri IST cüzdanına benzer bir şekilde görselleştirebilirsiniz. `Purses.tsx` dosyasına aşağıdakileri ekleyin:

```tsx
...

  const itemsPurse = usePurse('Item');
...

  
    Öğeler: 
    {itemsPurse ? (
      
        {itemsPurse.currentAmount.value.payload.map(
          // @ts-expect-error 'any' türünü görmezden gel
          ([name, number]) => (
            
              {String(number)} {name}
            
          )
        )}
      
    ) : (
      'Yok'
    )}
  
```

Şimdi, başka bir teklif yapın ve teklif kabul edildikten sonra öğeler cüzdanınızın otomatik olarak güncellendiğini görün. Bu örnek için tam çözümü görmek için  dalına göz atın.

### Sonuç

Uygulama sonrası neye benzediğini merak ediyor musunuz? Uygulamanın sonucunu görmek için  göz atabilirsiniz.