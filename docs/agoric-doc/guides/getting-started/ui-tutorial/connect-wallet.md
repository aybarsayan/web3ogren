## Cüzdanı Bağla

Bu aşamada, tek bir "Cüzdanı Bağla" butonuna sahip bir uygulamanız olmalıdır. Butona tıkladığınızda, birçok cüzdan seçeneği sunan bir modal açılmalıdır. "Keplr" seçeneğine tıklayın, bağlantıyı onaylayın ve butonun kesilmiş adresinizi gösterdiğini göreceksiniz.

### Cüzdan Verilerine Erişim

Cüzdan uzantımıza bağlandığımızda, bir uygulamanın gerçekleştirmek isteyebileceği bazı yaygın görevler vardır:

- Kullanıcının cüzdan bakiyelerini görüntülemek için bakiyelere erişmek.
- Teklif vermek ve akıllı sözleşmelerle etkileşimde bulunmak için Keplr'de işlemleri imzalamak.

`AgoricProvider`, bu her iki görevi de kolay hale getirir. Bu bölümde ilk noktaya odaklanacağız ve daha sonra bir teklif nasıl yapılacağını göreceğiz.

### Cüzdan Bileşeni Oluşturma

"Teklif Yap" sözleşmesi, NFT'leri satın almak için ücret token'ı olarak IST kullandığından, kullanıcıların IST bakiyesini göstermeye başlayabiliriz.

`src/Purses.tsx` adında yeni bir dosya oluşturun ve cüzdan bakiyelerini görüntülemek için bir bileşen yazın.

```tsx
import { useAgoric } from '@agoric/react-components';

const Purses = () => {
  const { walletConnection } = useAgoric();

  return (
    
      Cüzdanlar
      {walletConnection ? (
        
          
            IST: 
            TODO - IST Bakiyesini Göster
          
        
      ) : (
        'Bağlı cüzdan yok.'
      )}
    
  );
};

export default Purses;
```

Daha sonra, `App.tsx` dosyasında bileşeni `AgoricProvider` içinde, ``'ın altına yerleştirin:

```tsx
import Purses from './Purses';
...
    
    
...
```

Uygulama yeniden inşa edildiğinde, "Cüzdanlar" bölümünü görmelisiniz. `useAgoric` kancası tarafından sağlanan `walletConnection` nesnesini kullandığını fark edeceksiniz. Şu anda bileşen, cüzdan bağlantısının olup olmadığını kontrol etmek için sadece bunu kullanıyor. Eğer "Bağlı cüzdan yok." mesajını Keplr'ye bağlandıktan sonra hala görüyorsanız, yerel zincirinizin çalıştığından emin olun ve konsolunuzu RPC hataları için kontrol edin.

### IST Bakiyesini Görüntüleme

Cüzdan verilerine `useAgoric` kancasından erişeceğiz. Öncelikle, ileride NFT'ler için başka bir cüzdanı görüntülememiz gerektiğinden, kullanım kolaylığı için yeni bir kanca oluşturacağız. `src/hooks.ts` adında yeni bir dosya oluşturun.

```ts
import { useAgoric } from '@agoric/react-components';

export const usePurse = (brandPetname: string) => {
  const { purses } = useAgoric();

  return purses?.find(p => p.brandPetname === brandPetname);
};
```

Bu, kullanıcıların cüzdanlarını isim ile aramak için bir yardımcı fonksiyon sağlar. `useAgoric()`'ten `purses`'a eriştiğine dikkat edin. ``, cüzdanları almak için tüm zincir sorgularını yönetir ve bakiyeler değiştiğinde `purses`'i otomatik olarak günceller. Aynı zamanda ERTP cüzdanlarını  ile otomatik olarak birleştirir. Bu verilerin nereden geldiği hakkında daha fazla bilgi için  bölümüne bakın.

Sonra, tutarları görüntülemek ve çeşitli birimleri yönetmek için bir yardımcı araç sağlayan `@agoric/web-components`'a bir bağımlılık ekleyeceğiz:

```
yarn add -D @agoric/web-components@0.16.0
```

Ardından, `Purses.tsx` dosyasında, IST bakiyesini görüntülemek için hepsini bir araya getirebiliriz:

```tsx
import { useAgoric } from '@agoric/react-components';
import { usePurse } from './hooks';
import { stringifyAmountValue } from '@agoric/web-components';

const Purses = () => {
  const { walletConnection } = useAgoric();
  const istPurse = usePurse('IST');

  return (
    
      Cüzdanlar
      {walletConnection ? (
        
          
            IST: 
            {istPurse ? (
              stringifyAmountValue(
                istPurse.currentAmount,
                istPurse.displayInfo.assetKind,
                istPurse.displayInfo.decimalPlaces
              )
            ) : (
              Bakiyeyi alıyor...
            )}
          
        
      ) : (
        'Bağlı cüzdan yok.'
      )}
    
  );
};
```

Uygulama yeniden inşa edildiğinde, "Cüzdanlar" bölümünde gerçek IST bakiyesini göreceksiniz. Artık bir kullanıcının cüzdanına bağlanıp, cüzdan bakiyelerini görüntüleyebiliyorsunuz, ancak buradan ne yapabilirsiniz? Bir sonraki bölümde, kullanıcıların etkileşimde bulunabilmesi için akıllı sözleşme verilerini kullanıcı arayüzünden nasıl okuyacağınızı öğreneceksiniz.

Yine, herhangi bir zorlukla karşılaşırsanız, örnek deposunda `checkpoint-3` dalına bakabilirsiniz.