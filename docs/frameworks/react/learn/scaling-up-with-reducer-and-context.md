---
title: Reducer ve Context ile Ölçeklendirme
seoTitle: Reducer ve Context Kullanarak Durum Yönetimi
sidebar_position: 3
description: Bu belge, React uygulamalarında reducer ve context kullanarak etkili durum yönetimini açıklamaktadır. Öğrenecekleriniz arasında reducer ile contextin birleştirilmesi ve prop geçişinden kaçınma yer almaktadır.
tags: 
  - React
  - state management
  - reducer
  - context
  - JavaScript
keywords: 
  - React
  - state management
  - reducer
  - context
  - JavaScript
---
Reducerlar, bir bileşenin durum güncelleme mantığını konsolide etmenizi sağlar. Context, bilgiyi diğer bileşenlere derinlemesine iletmenizi sağlar. Durumunuzu yönetmek için reducerlar ve context'i bir araya getirebilirsiniz.





* Bir reducer ile context nasıl birleştirilir
* Durum ve dispatch'in prop'lar aracılığıyla geçirilmesinden nasıl kaçınılır
* Context ve durum mantığını ayrı bir dosyada nasıl tutulur



## Bir reducer ile context'i birleştirme {/*combining-a-reducer-with-context*/}

Bu örnekte `reducer'lara giriş` başlığından, durum bir reducer tarafından yönetilmektedir. Reducer fonksiyonu, tüm durum güncelleme mantığını içerir ve bu dosyanın altında tanımlanmıştır:



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
      <h1>Kyoto'da İzin Günü</h1>
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
      throw Error('Bilinmeyen işlem: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Filozoflar Yolu', done: true },
  { id: 1, text: 'Tapınağı ziyaret et', done: false },
  { id: 2, text: 'Matcha iç', done: false }
];
```

```js src/AddTask.js
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

```js src/TaskList.js
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



Bir reducer, olay işleyicileri kısa ve öz tutmanıza yardımcı olur. Ancak, uygulamanız büyüdükçe başka bir zorlukla karşılaşabilirsiniz. **Şu anda `tasks` durumu ve `dispatch` fonksiyonu sadece üst düzey `TaskApp` bileşeninde mevcut.** Diğer bileşenlerin görevler listesini okumalarını veya değişiklik yapmalarını sağlamak için, mevcut durumu ve bunu değiştiren olay işleyicilerini prop'lar olarak açıkça `geçmeniz` gerekir.

Örneğin, `TaskApp`, görevler listesini ve olay işleyicilerini `TaskList` bileşenine geçirir:

```js
<TaskList
  tasks={tasks}
  onChangeTask={handleChangeTask}
  onDeleteTask={handleDeleteTask}
/>
```

Ve `TaskList`, olay işleyicilerini `Task` bileşenine geçirir:

```js
<Task
  task={task}
  onChange={onChangeTask}
  onDelete={onDeleteTask}
/>
```

Bu kadar küçük bir örnekte işe yarasa da, ortada onlarca veya yüzlerce bileşen olduğunda, tüm durumu ve fonksiyonları geçmek oldukça can sıkıcı olabilir!

Bu nedenle, prop'lar aracılığıyla geçirmek yerine, `tasks` durumunu ve `dispatch` fonksiyonunu `context'e` koymayı düşünebilirsiniz. **Bu durumda, `TaskApp`'in altında herhangi bir bileşen görevleri okuyabilir ve işlemleri iletebilir, tekrarlayan "prop drilling" yapmadan.**

İşte bir reducer ile context'i nasıl birleştirebilirsiniz:

1. **Context'i oluşturun.**
2. **Durum ve dispatch'i context'e koyun.**
3. **Context'i ağaçtaki herhangi bir yerde kullanın.**

### Adım 1: Context'i oluşturun {/*step-1-create-the-context*/}

`useReducer` Hook'u, geçerli `tasks` ve bunları güncellemenize olanak tanıyan `dispatch` fonksiyonunu döner:

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

Onları ağacın aşağısına geçirmek için, iki ayrı context `oluşturacaksınız`:

- `TasksContext`, geçerli görevler listesini sağlar.
- `TasksDispatchContext`, bileşenlerin işlemleri iletmelerine olanak tanır.

Onları ayrı bir dosyadan dışa aktararak, daha sonra başka dosyalardan içe aktarabilirsiniz:



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
      <h1>Kyoto'da İzin Günü</h1>
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
      throw Error('Bilinmeyen işlem: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Filozoflar Yolu', done: true },
  { id: 1, text: 'Tapınağı ziyaret et', done: false },
  { id: 2, text: 'Matcha iç', done: false }
];
```

```js src/TasksContext.js active
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

```js src/AddTask.js
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

```js src/TaskList.js
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



Burada, iki context için varsayılan değer olarak `null` geçiyorsunuz. Gerçek değerler, `TaskApp` bileşeni tarafından sağlanacaktır.

### Adım 2: Durum ve dispatch'i context'e koyun {/*step-2-put-state-and-dispatch-into-context*/}

Artık her iki context'i de `TaskApp` bileşenine aktarabilirsiniz. `useReducer()` aracılığıyla dönen `tasks` ve `dispatch`'i `sağlayacaksınız` ağaçtaki tüm bileşenlere:

```js
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
  // ...
  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        ...
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}
```

Şu an için, bilgileri hem prop'lar aracılığıyla hem de context yoluyla geçiriyorsunuz:



```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

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
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        <h1>Kyoto'da İzin Günü</h1>
        <AddTask
          onAddTask={handleAddTask}
        />
        <TaskList
          tasks={tasks}
          onChangeTask={handleChangeTask}
          onDeleteTask={handleDeleteTask}
        />
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
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
      throw Error('Bilinmeyen işlem: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Filozoflar Yolu', done: true },
  { id: 1, text: 'Tapınağı ziyaret et', done: false },
  { id: 2, text: 'Matcha iç', done: false }
];
```

```js src/TasksContext.js
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

```js src/AddTask.js
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

```js src/TaskList.js
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



Sonraki adımda, prop geçişini kaldıracaksınız.