---
description: This page provides a concise overview of the essential methods available in the EventEmitter2 API, including event handling techniques such as 'on', 'once', 'many', 'off', 'removeAllListeners', and 'emit'.
keywords: [EventEmitter2, grunt, event handling, listeners, JavaScript, API, node.js]
---

# Grunt Event Dosyası

*Not edin, Grunt henüz herhangi bir olay yaymıyor, ancak yine de kendi görevlerinizde yararlı olabilir.*

[ee2]: https://github.com/hij1nx/EventEmitter2

### grunt.event.on
Verilen olay için dinleyiciler dizisine dinleyici ekler.

```js
grunt.event.on(event, listener)
```

### grunt.event.once
Olay için **tek seferlik** bir dinleyici ekler. Dinleyici, olay ilk kez tetiklendiğinde çağrılır ve sonrasında kaldırılır.

```js
grunt.event.once(event, listener)
```

### grunt.event.many
Olay için düşecek dinleyicinin **n kez** çalışacak şekilde eklenmesini sağlar ve sonrasında kaldırılır.

```js
grunt.event.many(event, timesToListen, listener)
```

### grunt.event.off
Verilen olay için dinleyiciler dizisinden bir dinleyiciyi kaldırır.

```js
grunt.event.off(event, listener)
```

### grunt.event.removeAllListeners
Tüm dinleyicileri veya belirtilen olayın dinleyicilerini kaldırır.

```js
grunt.event.removeAllListeners([event])
```

### grunt.event.emit
Belirtilen olay adı için dinleyebilecek her bir dinleyiciyi, argümanlar listesi ile sırayla yürütür.

```js
grunt.event.emit(event, [arg1], [arg2], [...])
```