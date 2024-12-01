---
name: Preact Test Kütüphanesi ile Test
description: 'Preact uygulamalarını test-library ile kolayca test etme. Bu kütüphane ile Preact bileşenlerinizi kolayca test ederek uygulamanızın güvenilirliğini artırabilirsiniz.'
keywords: [Preact, test-library, Jest, Mocha, bileşen test, kanca test, JavaScript]
---

# Preact Test Kütüphanesi ile Test

[Preact Test Kütüphanesi](https://github.com/testing-library/preact-testing-library), `preact/test-utils` etrafında hafif bir sardırıcıdır. Kullanıcıların bir sayfadaki öğeleri bulma şekline benzer bir şekilde, render edilen DOM'a erişmek için bir dizi sorgulama yöntemi sağlar. Bu yaklaşım, testlerin uygulama detaylarına bağımlı olmadan yazılmasına olanak tanır. Bu da testleri daha kolay bakım yapılabilir ve test edilen bileşen yeniden yapılandırıldığında daha dayanıklı hale getirir.

`Enzyme` ile karşılaştırıldığında, Preact Test Kütüphanesi bir DOM ortamında çağrılmalıdır.

---



---

## Kurulum

Aşağıdaki komutla test-library Preact adaptörünü kurun:

```sh
npm install --save-dev @testing-library/preact
```

:::note
Bu kütüphane bir DOM ortamının mevcut olmasına bağlıdır. [Jest](https://github.com/facebook/jest) kullanıyorsanız, zaten varsayılan olarak dahildir ve etkinleştirilmiştir. [Mocha](https://github.com/mochajs/mocha) veya [Jasmine](https://github.com/jasmine/jasmine) gibi başka bir test koşucusu kullanıyorsanız, [jsdom](https://github.com/jsdom/jsdom) kurarak node'a bir DOM ortamı ekleyebilirsiniz.
:::

## Kullanım

Diyelim ki, bir başlangıç değeri gösteren ve bunu güncellemek için bir butona sahip olan bir `Counter` bileşenimiz var:

```jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';

export function Counter({ initialCount }) {
  const [count, setCount] = useState(initialCount);
  const increment = () => setCount(count + 1);

  return (
    <div>
      Geçerli değer: {count}
      <button onClick={increment}>Arttır</button>
    </div>
  );
}
```

Counter'ımızın başlangıç sayısını gösterdiğini ve butona tıklamanın bunu artıracağını doğrulamak istiyoruz. [Jest](https://github.com/facebook/jest) veya [Mocha](https://github.com/mochajs/mocha) gibi seçtiğiniz test koşucusunu kullanarak, bu iki senaryoyu yazabiliriz:

```jsx
import { expect } from 'expect';
import { h } from 'preact';
import { render, fireEvent, screen, waitFor } from '@testing-library/preact';

import Counter from '../src/Counter';

describe('Counter', () => {
  test('başlangıç sayısını göstermeli', () => {
    const { container } = render(<Counter initialCount={5}/>);
    expect(container.textContent).toMatch('Geçerli değer: 5');
  });

  test('Butona tıklandığında artırılmalı ("Arttır")', async () => {
    render(<Counter initialCount={5}/>);

    fireEvent.click(screen.getByText('Arttır'));
    await waitFor(() => {
      // .toBeInTheDocument() jest-dom'dan gelen bir doğrulamadır.
      // Aksi takdirde .toBeDefined() kullanılabilir.
      expect(screen.getByText("Geçerli değer: 6")).toBeInTheDocument();
    });
  });
});
```

> **Önemli Not:** `waitFor()` çağrısını orada fark etmiş olabilirsiniz. Bunun nedeni Preact'in DOM'a render olabilmesi ve tüm bekleyen etkileri boşaltabilmesi için yeterli zamana sahip olmasını sağlamak.

```jsx
test('sayacı artırmalı', async () => {
  render(<Counter initialCount={5}/>);

  fireEvent.click(screen.getByText('Arttır'));
  // YANLIŞ: Preact burada muhtemelen render etmeyi bitirmemiştir
  expect(screen.getByText("Geçerli değer: 6")).toBeInTheDocument();
});
```

Temelinde, `waitFor` sağlanan geri çağırma fonksiyonunu tekrar tekrar çağırarak hata fırlatmaktan vazgeçene veya zaman aşımı dolana kadar (varsayılan: 1000ms) yürütür. Yukarıdaki örnekte, güncellemenin tamamlandığını, sayacın artırıldığında ve yeni değerin DOM'a render edildiğinde biliyoruz.

Ayrıca, "getBy" yerine "findBy" sorgularını kullanarak asenkron öncelikli bir şekilde test yazabiliriz. Asenkron sorgular temelinde `waitFor` kullanarak yeniden dener ve Promise döner, bu nedenle onları beklemeniz gerekir.

```jsx
test('sayacı artırmalı', async () => {
  render(<Counter initialCount={5}/>);

  fireEvent.click(screen.getByText('Arttır'));

  await screen.findByText('Geçerli değer: 6'); // değişen öğe için bekler
  
  expect(screen.getByText("Geçerli değer: 6")).toBeInTheDocument(); // geçerli
});
```

---

## Öğeleri Bulma

Tam bir DOM ortamı mevcutken, DOM düğümlerimizi doğrudan doğrulayabiliriz. Genellikle testler, bir giriş değerinin mevcut olması gibi özniteliklerin kontrol edildiği veya bir öğenin göründüğü/görünmediği kontrol edilir. Bunu yapmak için, DOM'daki öğeleri bulabilmemiz gerekir.

### İçerik Kullanarak

Test Kütüphanesi felsefesi, "testleriniz yazılımınızın nasıl kullanıldığına ne kadar benzerse, o kadar çok güven verebilir" şeklindedir.

Bir sayfayla etkileşime girmenin önerilen yolu, öğeleri bir kullanıcı gibi metin içeriği yoluyla bulmaktır. 

Doğru sorguyu seçmek için Test Kütüphanesi belgelerinin ['Hangi sorguyu kullanmalıyım'](https://testing-library.com/docs/guide-which-query) sayfasında bir rehber bulabilirsiniz. En basit sorgu `getByText` olup, öğelerin `textContent`'ına bakar. Ayrıca etiket metni, yer tutucu, başlık öznitelikleri vb. için sorgular da vardır. `getByRole` sorgusu en güçlüsüdür çünkü DOM'un üzerinde soyutlama sağlar ve ekran okuyucu tarafından sayfanızın nasıl okunduğu ile erişilebilirlik ağacında öğeleri bulmanıza olanak tanır. [`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques) ve [`erişim ismi`](https://www.w3.org/TR/accname-1.1/#mapping_additional_nd_name) birleştirilerek birçok yaygın DOM geçişini tek bir sorguda kapsar.

```jsx
import { render, fireEvent, screen } from '@testing-library/preact';

test('giriş yapabilmeli', async () => {
  render(<MyLoginForm />);
  
  // Erişim ismiyle metin kutusu rolünü kullanarak girişi bul
  const field = await screen.findByRole('textbox', { name: 'Giriş Yap' });
  
  // alana yaz
  fireEvent.change(field, { value: 'user123' });
})
```

Bazen doğrudan metin içeriği kullanmak, içerik çok değiştiğinde veya bir uluslararasılaştırma çerçevesi kullanıyorsanız, metni farklı dillere çevirdiğinde sıkıntı yaratabilir. Bunu çözmek için metni, güncel ama gerçek doğruluk kaynağını testin dışına çıkaran veriler olarak ele alabilirsiniz.

```jsx
test('giriş yapabilmeli', async () => {
  render(<MyLoginForm />);
  
  // Uygulamayı başka bir dilde mi render edersek, ya da metni değiştirirsek? Test başarısız olur.
  const field = await screen.findByRole('textbox', { name: 'Giriş Yap' });
  fireEvent.change(field, { value: 'user123' });
})
```

Bir çeviri çerçevesi kullanmasanız bile, dizelerinizi ayrı bir dosyada tutarak ve aşağıdaki örnekteki gibi aynı stratejiyi kullanarak geçerli hale getirebilirsiniz:

```jsx
test('giriş yapabilmeli', async () => {
  render(<MyLoginForm />);

  // Testte doğrudan çeviri işlevimizi kullanabiliriz
  const label = translate('signinpage.label', 'en-US');
  // Ne olduğunu bildiğimizden sonucu snapshot alalım
  expect(label).toMatchInlineSnapshot(`Giriş Yap`);

  const field = await screen.findByRole('textbox', { name: label });
  fireEvent.change(field, { value: 'user123' });
})
```

### Test ID'lerini Kullanarak

Test ID'leri, belirsiz veya tahmin edilemeyen durumlarda içerik seçimini kolaylaştırmak veya DOM yapısı gibi uygulama detaylarından ayrıştırmak için DOM öğelerine eklenen veri öznitelikleridir. Diğer öğe bulma yöntemlerinin mantıksız olduğu durumlarda kullanılabilirler.

```jsx
function Foo({ onClick }) {
  return (
    <button onClick={onClick} data-testid="foo">
      buraya tıkla
    </button>
  );
}

// Metin aynı kalırsa çalışır
fireEvent.click(screen.getByText('buraya tıkla'));

// Metni değiştirirsek çalışır
fireEvent.click(screen.getByTestId('foo'));
```

## Testleri Hata Ayıklama

Geçerli DOM durumunu hata ayıklamak için `debug()` işlevini kullanarak DOM'un düzgün bir versiyonunu yazdırabilirsiniz.

```jsx
const { debug } = render(<App />);

// DOM'un düzgün bir versiyonunu yazdırır
debug();
```

## Özel Bağlam Sağlayıcıları Temin Etmek

Sıklıkla, paylaşılan bağlam durumuna bağlı bir bileşenle karşılaşırsınız. Genel Sağlayıcılar, genellikle Yönlendiriciler, Durum ve bazen Temalar ve belirli uygulamanız için küresel olan diğerleri gibi çeşitlilik gösterir. Bu, her test durumu için tekrarlı olarak ayarlandığında sıkıcı hale gelebilir, bu nedenle `@testing-library/preact`'ten gelen sarıcıyı sarmalayarak özel bir `render` işlevi oluşturmayı öneririz.

```jsx
// helpers.js
import { render as originalRender } from '@testing-library/preact';
import { createMemoryHistory } from 'history';
import { FooContext } from './foo';

const history = createMemoryHistory();

export function render(vnode) {
  return originalRender(
    <FooContext.Provider value="foo">
      <Router history={history}>
        {vnode}
      </Router>
    </FooContext.Provider>
  );
}

// Kullanım her zamanki gibi. Bak, hiç sağlayıcı yok!
render(<MyComponent />)
```

## Preact Kancalarını Test Etme

`@testing-library/preact` ile artık kancalarımızın implementasyonunu da test edebiliriz! Counter işlevselliğini birden çok bileşen için yeniden kullanmak istediğimizi ve bunu bir kancaya çıkardığımızı düşünün. Şimdi bunu test etmek istiyoruz.

```jsx
import { useState, useCallback } from 'preact/hooks';

const useCounter = () => {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => setCount(c => c + 1), []);
  return { count, increment };
}
```

Daha önce olduğu gibi, temel yaklaşım benzer: Sayacımızı artırabileceğimizi doğrulamak istiyoruz. Bu nedenle, kancamızı bir şekilde çağırmamız gerekecek. Bu, otomatik olarak içsel bir çevreleyici bileşeni oluşturan `renderHook()` işlevi ile yapılabilir. İşlev, geçerli kanca döndürme değerini `result.current` altında döner, bunu doğrulamalarımızda kullanabiliriz:

```jsx
import { renderHook, act } from '@testing-library/preact';
import useCounter from './useCounter';

test('sayacı artırmalı', () => {
  const { result } = renderHook(() => useCounter());

  // Başlangıçta sayaç 0 olmalıdır
  expect(result.current.count).toBe(0);

  // Kanca geri çağrısını çağırarak sayacı güncelleyelim
  act(() => {
    result.current.increment();
  });

  // Kanca döndürme değerinin yeni durumu yansıtıp yansıtmadığını kontrol et.
  expect(result.current.count).toBe(1);
});
```

Daha fazla bilgi için `@testing-library/preact` hakkında [buraya](https://github.com/testing-library/preact-testing-library) göz atabilirsiniz.