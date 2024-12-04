---
title: Sunucu Eylemleri
seoTitle: Sunucu Eylemleri - React Dokümantasyonu
sidebar_position: 4
description: Sunucu Eylemleri, İstemci Bileşenlerinin sunucuda çalıştırılan async fonksiyonları çağırmasına olanak tanır. Bu belgede, bu özelliklerin nasıl kullanılacağına dair kapsamlı bilgiler bulacaksınız.
tags: 
  - React
  - Sunucu Eylemleri
  - Geliştirici
  - JavaScript
keywords: 
  - React
  - Sunucu Eylemleri
  - Geliştirici
  - JavaScript
---
Sunucu Eylemleri, İstemci Bileşenlerinin sunucuda çalıştırılan async fonksiyonları çağırmasına olanak tanır.







#### Sunucu Eylemleri için nasıl destek oluşturabilirim? {/*how-do-i-build-support-for-server-actions*/}

:::tip
React 19'daki Sunucu Eylemleri stabil ve büyük versiyonlar arasında bozulmayacak olsa da, React Sunucu Bileşenleri paketleyicisi veya çerçevesinde Sunucu Eylemleri'ni uygulamak için kullanılan temel API'ler semver'i takip etmez ve React 19.x arasında küçük versiyonlar arasında bozulabilir.
:::

Paketleyici veya çerçeve olarak Sunucu Eylemleri'ni desteklemek için, belirli bir React sürümüne sabitleme yapmayı veya Canary sürümünü kullanmayı öneriyoruz. Gelecekte Sunucu Eylemleri'ni uygulamak için kullanılan API'leri istikrara kavuşturmak amacıyla paketleyiciler ve çerçevelerle çalışmaya devam edeceğiz.



Bir Sunucu Eylemi `"use server"` direktifi ile tanımlandığında, çerçeveniz otomatik olarak sunucu fonksiyonuna bir referans oluşturacak ve bu referansı İstemci Bileşenine iletecektir. Bu fonksiyon İstemci'de çağrıldığında, React sunucuya fonksiyonu çalıştırması için bir istek gönderir ve sonucu döndürür.

Sunucu Eylemleri, Sunucu Bileşenlerinde oluşturulabilir ve İstemci Bileşenlerine props olarak geçirilebilir veya İstemci Bileşenlerinde içe aktarılıp kullanılabilir.

### Sunucu Bileşeninden Sunucu Eylemi Oluşturma {/*creating-a-server-action-from-a-server-component*/}

Sunucu Bileşenleri, `"use server"` direktifi ile Sunucu Eylemleri tanımlayabilir:

```js [[2, 7, "'use server'"], [1, 5, "createNoteAction"], [1, 12, "createNoteAction"]]
// Sunucu Bileşeni
import Button from './Button';

function EmptyNote () {
  async function createNoteAction() {
    // Sunucu Eylemi
    'use server';

    await db.notes.create();
  }

  return <Button onClick={createNoteAction}/>;
}
```

React `EmptyNote` Sunucu Bileşenini render ettiğinde, `createNoteAction` fonksiyonuna bir referans oluşturacak ve bu referansı `Button` İstemci Bileşenine iletecektir. Butona tıklandığında, React sunucuya `createNoteAction` fonksiyonunu sağlanan referans ile çalıştırması için bir istek gönderecektir:

```js {5}
"use client";

export default function Button({onClick}) { 
  console.log(onClick); 
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={() => onClick()}>Boş Not Oluştur</button>
}
```

Daha fazla bilgi için `"use server"` belgelerine bakın.

### İstemci Bileşenlerinden Sunucu Eylemlerini İçe Aktarma {/*importing-server-actions-from-client-components*/}

İstemci Bileşenleri, `"use server"` direktifini kullanan dosyalardan Sunucu Eylemlerini içe aktarabilir:

```js [[1, 3, "createNoteAction"]]
"use server";

export async function createNoteAction() {
  await db.notes.create();
}
```

Paketleyici `EmptyNote` İstemci Bileşenini oluşturduğunda, paket içinde `createNoteAction` fonksiyonuna bir referans oluşturacaktır. Butona tıklandığında, React sunucuya `createNoteAction` fonksiyonunu sağlanan referans ile çalıştırması için bir istek gönderecektir:

```js [[1, 2, "createNoteAction"], [1, 5, "createNoteAction"], [1, 7, "createNoteAction"]]
"use client";
import {createNoteAction} from './actions';

function EmptyNote() {
  console.log(createNoteAction);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={createNoteAction} />
}
```

Daha fazla bilgi için `"use server"` belgelerine bakın.

### Sunucu Eylemlerini Eylemler ile Birleştirme {/*composing-server-actions-with-actions*/}

Sunucu Eylemleri, istemcideki Eylemler ile birleştirilebilir:

```js [[1, 3, "updateName"]]
"use server";

export async function updateName(name) {
  if (!name) {
    return {error: 'İsim zorunludur'};
  }
  await db.users.updateName(name);
}
```

```js [[1, 3, "updateName"], [1, 13, "updateName"], [2, 11, "submitAction"],  [2, 23, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const [isPending, startTransition] = useTransition();

  const submitAction = async () => {
    startTransition(async () => {
      const {error} = await updateName(name);
      if (!error) {
        setError(error);
      } else {
        setName('');
      }
    })
  }
  
  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Başarısız: {state.error}</span>}
    </form>
  )
}
```

Bu, Sunucu Eyleminin `pending` durumuna erişmenizi sağlar ve istemcideki bir Eylem ile sararak kullanılabilir.

Daha fazla bilgi için `Sunucu Eylemini `` Dışında Çağırma` belgelerine bakın.

### Sunucu Eylemleri ile Form Eylemleri {/*form-actions-with-server-actions*/}

Sunucu Eylemleri, React 19'daki yeni Form özellikleri ile çalışır.

Bir Form'a bir Sunucu Eylemi geçirebilir ve formun otomatik olarak sunucuya gönderilmesini sağlayabilirsiniz:

```js [[1, 3, "updateName"], [1, 7, "updateName"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  return (
    <form action={updateName}>
      <input type="text" name="name" />
    </form>
  )
}
```

Form gönderimi başarıyla gerçekleştiğinde, React formu otomatik olarak sıfırlayacaktır. Bekleyen duruma, son yanıta erişim veya kademeli geliştirmeyi desteklemek için `useActionState` ekleyebilirsiniz.

Daha fazla bilgi için `Formlarda Sunucu Eylemleri` belgelerine bakın.

### `useActionState` ile Sunucu Eylemleri {/*server-actions-with-use-action-state*/}

Sunucu Eylemlerini `useActionState` ile, yalnızca eylem bekleyen durumuna ve en son dönen yanıta erişim sağlamak için yaygın olan durumda birleştirebilirsiniz:

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "submitAction"], [2, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [state, submitAction, isPending] = useActionState(updateName, {error: null});

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Başarısız: {state.error}</span>}
    </form>
  );
}
```

`useActionState` kullanıldığında, React ayrıca hidratasyon tamamlanmadan önce girilen form gönderimlerini otomatik olarak tekrar oynatacaktır. Bu, kullanıcıların uygulamanızla, uygulamanın hidratasyonu tamamlanmadan etkileşimde bulunmalarını sağlar.

Daha fazla bilgi için `useActionState` belgelerine bakın.

### `useActionState` ile Kademeli Geliştirme {/*progressive-enhancement-with-useactionstate*/}

Sunucu Eylemleri ayrıca `useActionState`'nin üçüncü argümanıyla kademeli geliştirmeyi destekler.

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "/name/update"], [3, 6, "submitAction"], [3, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [, submitAction] = useActionState(updateName, null, `/name/update`);

  return (
    <form action={submitAction}>
      ...
    </form>
  );
}
```

`useActionState` ile sağlanan kalıcı bağlantı belirlendiğinde, eğer form JavaScript paketi yüklenmeden önce gönderilirse, React belirtilen URL'ye yönlendirecektir.

Daha fazla bilgi için `useActionState` belgelerine bakın.