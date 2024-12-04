---
title: Durum Mantığını Bir Reducera Dönüştürme
seoTitle: Durum Mantığı Eğitiminde Reducer Kullanımı
sidebar_position: 4
description: Bu doküman, bileşenlerdeki karmaşık durum güncellemelerini yönetmek için reducer kullanımını açıklar. Reducer işlevinin, durum ayarlamaktan eylemleri dağıtmaya geçiş ve örnekler içerir.
tags: 
  - reducer
  - durum yönetimi
  - React
  - JavaScript
keywords: 
  - reducer
  - durum yönetimi
  - bileşen
  - JavaScript
---
Birçok durum güncellemeleriyle dolu bileşenler, yönetilmesi zor hale gelebilir. Bu durumlar için, tüm durum güncelleme mantığını bileşeninizin dışındaki tek bir işlevde toplayabilirsiniz, buna _reducer_ denir.





- Reducer işlevinin ne olduğunu
- `useState`'den `useReducer`'e nasıl geçileceğini
- Ne zaman bir reducer kullanılacağını
- İyi bir reducer'ın nasıl yazılacağını



## Reducer ile durum mantığını birleştir {/*consolidate-state-logic-with-a-reducer*/}

Bileşenleriniz karmaşıklık kazandıkça, bir bileşenin durumunun güncellenme şekillerini gözden geçirebilmek zorlaşabilir. Örneğin, aşağıdaki `TaskApp` bileşeni, durumda bir dizi `tasks` tutar ve görevleri eklemek, çıkarmak ve düzenlemek için üç farklı olay işleyici kullanır:



```js src/App.js
import { useState } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
      <h1>Prag Gezi Programı</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Kafka Müzesi\'ni ziyaret et', done: true},
  {id: 1, text: 'Bir kukla gösterisi izle', done: false},
  {id: 2, text: 'Lennon Duvarı fotoğrafı', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Görev ekle"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Ekle
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Kaydet</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Düzenle</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Sil</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```



Her bir olay işleyicisi, durumu güncellemek için `setTasks`'i çağırır. Bu bileşen büyüdükçe, içindeki durum mantığının miktarı da artar. Bu karmaşıklığı azaltmak ve tüm mantığınızı tek bir kolay erişilebilir yere koymak için, o durum mantığını bileşeninizin dışındaki tek bir işleve taşıyabilirsiniz, **buna "reducer" denir.**

Reducers, durumu yönetmenin farklı bir yoludur. `useState`'den `useReducer`'e geçmek için üç adım izlemeniz gerekmektedir:

1. **Geçiş yapın** durum ayarlamaktan eylemleri dağıtmaya.
2. **Yazın** bir reducer işlevi.
3. **Kullanın** bileşeninizden reducer'ı.

### Adım 1: Durum ayarlamaktan eylemleri dağıtmaya geçin {/*step-1-move-from-setting-state-to-dispatching-actions*/}

Olay işleyicileriniz şu anda durum ayarlayarak _ne yapacağınıza_ karar veriyor:

```js
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

function handleChangeTask(task) {
  setTasks(
    tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    })
  );
}

function handleDeleteTask(taskId) {
  setTasks(tasks.filter((t) => t.id !== taskId));
}
```

Tüm durum ayarlama mantığını çıkarın. Geride kalanlar üç olay işleyicisi olacaktır:

- `handleAddTask(text)`, kullanıcı "Ekle" butonuna bastığında çağrılır.
- `handleChangeTask(task)`, kullanıcı bir görevi geçiş yaptığında veya "Kaydet" butonuna bastığında çağrılır.
- `handleDeleteTask(taskId)`, kullanıcı "Sil" butonuna bastığında çağrılır.

Durum yönetimi, doğrudan durum ayarlamaktan biraz farklıdır. React'e "ne yapacağını" belirlemek yerine, olay işleyicilerinizden "kullanıcının ne yaptığını" belirtiyorsunuz ve eylemleri dağınık olarak dağıtıyorsunuz. (Durum güncelleme mantığı başka bir yerde yaşayacak!) Bu nedenle, "görevleri ayarla" yerine "görev eklendi/değiştirildi/silindi" eylemini dağıtıyorsunuz. Bu, kullanıcının niyetini daha açıklayıcı hale getirir.

```js
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
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId,
  });
}
```

`dispatch`'e geçirdiğiniz nesne bir "eylem" olarak adlandırılır:

```js {3-7}
function handleDeleteTask(taskId) {
  dispatch(
    // "eylem" nesnesi:
    {
      type: 'deleted',
      id: taskId,
    }
  );
}
```

Bu, standart bir JavaScript nesnesidir. İçine ne koyacağınızı siz belirlersiniz, ancak genellikle _ne olduğunu_ belirtmek için minimal bilgiyi içermelidir. (`dispatch` işlevini sonraki bir adımda ekleyeceksiniz.)



Bir eylem nesnesinin herhangi bir şekli olabilir.

Geleneksel olarak, ne olduğunu tanımlayan bir dize olan bir `type` vermek yaygındır ve ayrıca ek bilgiyi diğer alanlarda geçirebilirsiniz. `type`, bileşenle ilgili olduğundan, bu örnekte ya `'added'` ya da `'added_task'` uygun olacaktır. Ne olduğunu belirten bir isim seçin!

```js
dispatch({
  // bileşene özgü
  type: 'ne_oldu',
  // diğer alanlar buraya gelir
});
```



### Adım 2: Bir reducer işlevi yazın {/*step-2-write-a-reducer-function*/}

Bir reducer işlevi, durum mantığınızın yer alacağı yerdir. İki argüman alır: mevcut durum ve eylem nesnesi ve bir sonraki durumu döndürür:

```js
function yourReducer(state, action) {
  // React'in ayarlayacağı bir sonraki durumu döndür
}
```

React, reducer'dan döndürdüğünüz durumu ayarlayacaktır.

Bileşeninizin içindeki durum ayarlama mantığını olay işleyicilerinden bir reducer işlevine taşımak için, şu adımları izleyeceksiniz:

1. Mevcut durumu (`tasks`) birinci argüman olarak beyan etmek.
2. İkinci argüman olarak `action` nesnesini beyan etmek.
3. Reducer'dan bir sonraki durumu döndürmek (bu, React'in duruma ayarlayacağı durumdur).

İşte tüm durum ayarlama mantığı bir reducer işlevine taşınmış durumda:

```js
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [
      ...tasks,
      {
        id: action.id,
        text: action.text,
        done: false,
      },
    ];
  } else if (action.type === 'changed') {
    return tasks.map((t) => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === 'deleted') {
    return tasks.filter((t) => t.id !== action.id);
  } else {
    throw Error('Bilinmeyen eylem: ' + action.type);
  }
}
```

Çünkü reducer işlevi durumu (`tasks`) bir argüman olarak alır, **bunu bileşeninizin dışına beyan edebilirsiniz.** Bu, girinti seviyesini azaltır ve kodunuzu daha okunaklı hale getirebilir.



Yukarıdaki kod, if/else ifadelerini kullanır, ancak reducers içinde [switch ifadeleri](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/switch) kullanmak yaygındır. Sonuç aynıdır, ancak gözden geçirdiğinizde switch ifadelerini daha kolay okumak mümkündür.

Bunu belgelerin geri kalanında şu şekilde kullanacağız:

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Bilinmeyen eylem: ' + action.type);
    }
  }
}
```

Her bir `case` bloğunu `{` ve `}` süslü parantezler içine sarmayı önermekteyiz, böylece farklı `case` içindeki değişkenler birbiriyle karışmaz. Ayrıca, bir `case` genellikle bir `return` ile bitmelidir. `return`'ı unuttuğunuzda, kod "aşmasına" yol açarak hatalara neden olabilir!

Eğer switch ifadeleriyle henüz rahat değilseniz, if/else kullanmak tamamen bir seçenek.





#### Neden reducer denir? {/*why-are-reducers-called-this-way*/}

Reducer'lar, bileşen içindeki kod miktarını "azaltma" yeteneğine sahip olmalarına rağmen, aslında [`reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) işlemi nedeniyle bu ismi almışlardır. 

`reduce()` işlemi, bir diziyi alır ve birçok değerden "bir tek değer" elde etmenizi sağlar:

```
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```

`reduce`'e geçtiğiniz işlev "reducer" olarak bilinir. O _şu ana kadar elde edilen sonucu_ ve _geçerli öğeyi_ alır, ardından _bir sonraki sonucu_ döndürür. React reducer'ları da aynı fikrin bir örneğidir: _şu ana kadar elde edilen durumu_ ve _eylemi_ alır ve _bir sonraki durumu_ döndürür. Bu şekilde, zaman içinde eylemleri duruma biriktirirler.

Hatta `initialState` ve bir `actions` dizisi ile `reduce()` yöntemini kullanarak son durumu hesaplayabilirsiniz, reducer işlevinizi ona ileterek:



```js src/index.js active
import tasksReducer from './tasksReducer.js';

let initialState = [];
let actions = [
  {type: 'added', id: 1, text: 'Kafka Müzesi\'ni ziyaret et'},
  {type: 'added', id: 2, text: 'Bir kukla gösterisi izle'},
  {type: 'deleted', id: 1},
  {type: 'added', id: 3, text: 'Lennon Duvarı fotoğrafı'},
];

let finalState = actions.reduce(tasksReducer, initialState);

const output = document.getElementById('output');
output.textContent = JSON.stringify(finalState, null, 2);
```

```js src/tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Bilinmeyen eylem: ' + action.type);
    }
  }
}
```

```html public/index.html
<pre id="output"></pre>
```



Bunu kendiniz yapmanıza gerek kalmayacak, ama bu, React'in yaptığına benzer!