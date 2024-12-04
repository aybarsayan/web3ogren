---
title: Durum Yönetimi
seoTitle: Durum Yönetimi - React Eğitimi
sidebar_position: 4
description: Bu bölümde, durumunuzu nasıl iyi yapılandıracağınızı öğreneceksiniz. Gereksiz durumları ortadan kaldırarak hata kaynağını azaltabilir ve bileşenler arasında durumu paylaşıp yönetmeyi öğrenebilirsiniz.
tags: 
  - durum yönetimi
  - react
  - bileşen
  - kullanıcı arayüzü
keywords: 
  - durum
  - react
  - bileşenler
  - kullanıcı arayüzü
---
Uygulamanız büyüdükçe, durumun nasıl organize edildiği ve bileşenleriniz arasında verinin nasıl aktığı konusunda daha dikkatli olmak faydalı olur. Gereksiz veya kopya durum, yaygın bir hata kaynağıdır. Bu bölümde, durumunuzu nasıl iyi yapılandıracağınızı, durum güncelleme mantığınızı nasıl sürdürülebilir kılacağınızı ve uzak bileşenler arasında durumu nasıl paylaşacağınızı öğreneceksiniz.





* `Durum değişikliklerini UI değişiklikleri olarak düşünme`
* `Durumu iyi yapılandırma`
* `Durumu "yukarı kaldırma" ile bileşenler arasında paylaşma`
* `Durumun saklanıp saklanmayacağını kontrol etme`
* `Karmaşık durum mantığını bir fonksiyonda birleştirme`
* `Bilgiyi "prop drilling" olmadan geçirme`
* `Uygulamanız büyüdükçe durum yönetimini ölçeklendirme`



## Durum ile girişe tepki verme {/*reacting-to-input-with-state*/}

React ile UI'yi doğrudan koddan değiştirmeyeceksiniz. Örneğin, "butonu devre dışı bırak", "butonu etkinleştir", "başarı mesajını göster" gibi komutlar yazmayacaksınız. Bunun yerine, bileşeninizin farklı görsel durumları ("ilk durum", "yazma durumu", "başarı durumu") için görmek istediğiniz UI'yi tarif edeceksiniz ve ardından kullanıcı girdilerine yanıt olarak durum değişikliklerini tetikleyeceksiniz. Bu, tasarımcıların UI'yi düşündüğü şekilde benzerdir.

İşte React kullanılarak oluşturulmuş bir sınav formu. Gönder düğmesini etkinleştirip devre dışı bırakmak için `status` durum değişkeninin nasıl kullanıldığını ve başarı mesajının ne zaman gösterileceğini gözlemleyin.



```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>Doğru!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>Şehir sınavı</h2>
      <p>
        Hangi şehirde hava içilebilir suya dönüşen bir reklam panosu var?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Gönder
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Ağa bağlanıyormuş gibi davranın.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('İyi bir tahmin ama yanlış bir cevap. Tekrar deneyin!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```





Durum ile Girişlere Tepki Verme hakkında daha fazla bilgi için **`Buraya tıklayın`**.



## Durum Yapısını Seçme {/*choosing-the-state-structure*/}

Durumu iyi yapılandırmak, üzerinde modifikasyon ve hata ayıklama için hoş bir bileşen ile sürekli hata kaynağı olan bir bileşen arasında fark yaratabilir. En önemli ilke, durumun gereksiz veya kopya bilgi içermemesi gerektiğidir. Gerekli olmayan bir durum varsa, bunu güncellemeyi unuttuğunuz zaman hatalar ortaya çıkar!

Örneğin, bu formda **gereksiz** bir `fullName` durum değişkeni bulunmaktadır:



```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Check-in yapalım</h2>
      <label>
        İsim:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Soyisim:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Biletiniz şuna düzenlenecek: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```



Bunu kaldırabilir ve kodu `fullName`'ı bileşen render edilirken hesaplayarak basitleştirebilirsiniz:



```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Check-in yapalım</h2>
      <label>
        İsim:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Soyisim:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Biletiniz şuna düzenlenecek: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```



Bu küçük bir değişim gibi görünebilir, ancak React uygulamalarındaki birçok hata bu şekilde düzeltildi.



Durum Yapısını Seçme hakkında daha fazla bilgi için **`Buraya tıklayın`**.



## Bileşenler Arasında Durum Paylaşımı {/*sharing-state-between-components*/}

Bazen, iki bileşenin durumunun her zaman birlikte değişmesini istersiniz. Bunu yapmak için, her iki bileşenden de durumu kaldırın, en yakın ortak üst bileşene taşıyın ve ardından bunu props aracılığıyla onlara geçirin. Bu, "durumu yukarı kaldırma" olarak bilinir ve React kodu yazarken yapacağınız en yaygın şeylerden biridir.

Bu örnekte, yalnızca bir panel her seferinde aktif olmalıdır. Bunu başarmak için, her bireysel panelin içinde aktif durumu tutmak yerine, üst bileşen durumu tutar ve çocukları için props'ları belirtir.



```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almatı, Kazakistan</h2>
      <Panel
        title="Hakkında"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        Nüfusu yaklaşık 2 milyon olan Almatı, Kazakistan'ın en büyük şehridir. 1929'dan 1997'ye kadar, ülkenin başkenti olmuştur.
      </Panel>
      <Panel
        title="Etimoloji"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        Adı, Kazakça "elma" anlamına gelen <span lang="kk-KZ">алма</span> kelimesinden gelmektedir ve genellikle "elma dolu" olarak çevrilir. Aslında, Almatı çevresindeki bölgenin elmanın atalarının evi olduğu düşünülmektedir ve vahşi <i lang="la">Malus sieversii</i>'nin modern ev elmasının atası olabileceği düşünülmektedir.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Göster
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```





Bileşenler Arasında Durum Paylaşımı hakkında daha fazla bilgi için **`Buraya tıklayın`**.



## Durumu Saklama ve Sıfırlama {/*preserving-and-resetting-state*/}

Bir bileşeni yeniden render ettiğinizde, React, ağacın hangi bölümlerinin korunacağı (ve güncelleneceği) ve hangi bölümlerin terkedileceği veya baştan yaratılacağına karar vermek zorundadır. Çoğu durumda, React'in otomatik davranışı yeterince iyi çalışır. Varsayılan olarak, React, daha önce render edilmiş bileşen ağacına "uygun" olan ağaç bölümlerini korur.

Ancak, bazen bu istediğiniz şey olmayabilir. Bu sohbet uygulamasında, bir mesaj yazarak sonra alıcıyı değiştirmek, girişi sıfırlamaz. Bu, kullanıcının yanlış kişiye mesaj göndermesine neden olabilir:



```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Mesajınızı ' + contact.name + ' ile görüşün'}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>{contact.email} adresine gönder</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```



React, varsayılan davranışı geçersiz kılmanıza ve bir bileşeni farklı bir `key` geçirerek durumunun sıfırlanmasını *zorlamanıza* izin verir, örneğin ``. Bu, React'e eğer alıcı farklıysa, bunun farklı bir `Chat` bileşeni olarak ele alınması gerektiğini ve yeni veri (ve UI gibi girişlerle birlikte) baştan yeniden yaratılması gerektiğini söylemektedir. Artık alıcılar arasında geçiş yapıldığında giriş alanı sıfırlanır--aynı bileşeni render etseniz bile.



```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.email} contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Mesajınızı ' + contact.name + ' ile görüşün'}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>{contact.email} adresine gönder</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```





Durumu Saklama ve Sıfırlama hakkında daha fazla bilgi için **`Buraya tıklayın`**.



## Durum Mantığını Reducer'a Ayırma {/*extracting-state-logic-into-a-reducer*/}

Birçok durum güncellemesi birçok olay işleyicisinde yayılmış olan bileşenler, bunaltıcı hale gelebilir. Bu durumlar için tüm durum güncelleme mantığını bileşeninizin dışına, "reducer" olarak adlandırılan tek bir fonksiyona konsolide edebilirsiniz. Olay işleyicileriniz, yalnızca kullanıcı "hareketlerini" belirtir, ve dosyanın en altında, reducer fonksiyonu her harekete yanıt olarak durumun nasıl güncelleneceğini belirtir!



```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prag programı</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Bilinmeyen eylem: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Kafka Müzesi’ni Ziyaret Et', done: true },
  { id: 1, text: 'Bir kukla gösterisi izle', done: false },
  { id: 2, text: 'Lennon Duvarı resmi', done: false }
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Görev ekle"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Ekle</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Kaydet
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Düzenle
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Sil
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```





Durum Mantığını Reducer'a Ayırma hakkında daha fazla bilgi için **`Buraya tıklayın`**.