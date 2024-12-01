---
description: Preact eğitimini başarıyla tamamladınız! Tüm adımları takip ederek projelerinize başlayın. 
keywords: [Preact, eğitim, bileşenler, kancalar, proje]
---

# Tebrikler!

Preact eğitimini tamamladınız!

Demo koduyla biraz daha oynamaktan çekinmeyin.

### Sonraki Adımlar

- `Sınıf bileşenleri hakkında daha fazla bilgi edinin`
- `Kancalar hakkında daha fazla bilgi edinin`
- [Kendi projenizi oluşturun](https://vite.new/preact)

> **Geri bildiriminizi bekliyoruz!**
>
> Preact'ı öğrendiğinizi düşünüyor musunuz? Takıldığınız noktalar oldu mu?
>
> Geri bildirimleriniz [bu tartışmada](https://github.com/preactjs/preact-www/discussions/815) memnuniyetle karşılanır.

---


Ek Bilgiler

Aşağıdaki kod örneği, Preact ile yapılmış bir ToDo uygulamasını göstermektedir. Uygulama, yerel depolamada görevleri saklar ve yönetir. 



```jsx:repl-initial
import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks'

const getTodos = async () => {
  try {
    return JSON.parse(localStorage.todos)
  } catch (e) {
    return [
      { id: 1, text: 'Preact\'ı öğren', done: true },
      { id: 2, text: 'harika bir uygulama yap', done: false },
    ]
  }
}

function ToDos() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    getTodos().then(todos => {
      setTodos(todos)
    })
  }, [])

  // todos her değiştiğinde...
  useEffect(() => {
    // ...listeyi localStorage'a kaydet:
    localStorage.todos = JSON.stringify(todos)
    // (kaydedilmiş todo'ları görmek için sayfayı yenilemeyi deneyin!)
  }, [todos])

  function toggle(id) {
    setTodos(todos => {
      return todos.map(todo => {
        // eşleşen todo öğesini, done'ı değiştirilmiş bir versiyonla değiştir
        if (todo.id === id) {
          todo = { ...todo, done: !todo.done }
        }
        return todo
      })
    })
  }

  function addTodo(e) {
    e.preventDefault()
    const form = e.target
    const text = form.todo.value
    // 'todos' durum ayarlayıcısına bir geri çağırma geçirin
    setTodos(todos => {
      const id = todos.length + 1
      const newTodo = { id, text, done: false }
      return todos.concat(newTodo)
    })
    form.reset()
  }

  return (
    <div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id}>
            <label style={{ display: 'block' }}>
              <input type="checkbox" checked={todo.done} onClick={() => toggle(todo.id)} />
              {' ' + todo.text}
            </label>
          </li>
        ))}
      </ul>
      <form onSubmit={addTodo}>
        <input name="todo" placeholder="ToDo Ekle [enter]" />
      </form>
    </div>
  )
}

render(<ToDos />, document.getElementById("app"));
```