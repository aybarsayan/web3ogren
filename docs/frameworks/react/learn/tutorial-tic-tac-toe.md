---
title: Eğitim XOX
seoTitle: XOX Oyunu Eğitimi
sidebar_position: 1
description: Bu eğitimde React kullanarak etkileşimli bir XOX oyunu oluşturacaksınız. Hem temel kavramları öğrenecek hem de oyunu tamamlayacaksınız.
tags: 
  - React 
  - XOX 
  - Eğitim 
  - Bileşenler 
keywords: 
  - XOX 
  - React 
  - Eğitim 
  - Bileşenler 
---
Bu eğitimde küçük bir XOX oyunu oluşturacaksınız. Bu eğitim, mevcut bir React bilgisi varsaymamaktadır. Eğitimde öğreneceğiniz teknikler, herhangi bir React uygulaması oluşturmak için temel niteliğindedir ve bunları tam olarak anlamak, React hakkında derin bir kavrayış sağlayacaktır.




Bu eğitim, **pratik yaparak öğrenmeyi** tercih eden ve hızlı bir şekilde somut bir şey denemek isteyenler için tasarlanmıştır. Eğer her bir kavramı adım adım öğrenmeyi tercih ediyorsanız, `Kullanıcı Arayüzünü Tanımlama` ile başlayın.


Eğitim, birkaç bölüme ayrılmıştır:

- `Eğitim için Kurulum` eğitim boyunca takip edebilmeniz için **bir başlangıç noktası** sağlayacaktır.
- `Genel Bakış` React'ın **temel kavramlarını** öğretecektir: bileşenler, prop'lar ve durum.
- `Oyunu Tamamlama` React geliştirmedeki **en yaygın teknikleri** öğretecektir.
- `Zaman Yolculuğu Ekleme` React'ın benzersiz güçlü yönlerine **daha derin bir bakış** sağlayacaktır.

### Ne inşa ediyorsunuz? {/*what-are-you-building*/}

Bu eğitimde etkileşimli bir XOX oyunu inşa edeceksiniz.

Tamamlandığında nasıl görüneceğini burada görebilirsiniz:



```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Kazanan: ' + winner;
  } else {
    status = 'Sonraki oyuncu: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Hamle #' + move + ' git';
    } else {
      description = 'Oyun başlangıcına git';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```



Eğer kod henüz anlamlı gelmiyorsa veya kodun sözdizimiyle ilgili olarak tanıdık değilseniz endişelenmeyin! Bu eğitimin amacı, React'ı ve sözdizimini anlamanıza yardımcı olmaktır.

Tamamlanmış XOX oyunu ile oynamayı deneyin ve ardından ilerlemeye devam edin. Oyun tahtasının sağında numaralı bir liste olduğunu göreceksiniz. Bu liste, oyunda gerçekleşen tüm hamlelerin geçmişini verir ve oyun ilerledikçe güncellenir.

Tamamlanmış XOX oyunu ile oynadıktan sonra kaydırmaya devam edin. Bu eğitimde daha basit bir şablon ile başlayacaksınız. Bir sonraki adımımız, oyunu inşa etmeye başlayabilmeniz için sizi kurmak.

## Eğitim için Kurulum {/*setup-for-the-tutorial*/}

Aşağıdaki canlı kod editöründe, yukarıdaki sağ üst köşede **Fork** butonuna tıklayarak editörü yeni bir sekmede açın. CodeSandbox, tarayıcınızda kod yazmanıza ve oluşturduğunuz uygulamanın kullanıcıların nasıl göreceğini ön izleme yapmanıza olanak tanır. Yeni sekmede, bu eğitim için başlangıç kodunu ve boş bir kareyi görüntülemeniz gerekir.



```js src/App.js
export default function Square() {
  return <button className="square">X</button>;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```




Ayrıca bu eğitimi yerel geliştirme ortamınızı kullanarak da takip edebilirsiniz. Bunu yapmak için:

1. [Node.js](https://nodejs.org/en/) yükleyin
2. Önceki CodeSandbox sekmesinde, üst sol köşedeki butona basarak menüyü açın ve ardından menüden **Sandbox'ı İndir** seçeneğini seçin 
3. Arşivi açtıktan sonra, bir terminal açın ve açtığınız dizine `cd` komutunu kullanarak gidin
4. Bağımlılıkları `npm install` ile yükleyin
5. `npm start` komutunu çalıştırarak yerel bir sunucu başlatın ve tarayıcıda kodu görmeniz için istemleri takip edin

Takıldığınızda, bu sizi durdurmasın! Bunun yerine çevrimiçi takip edin ve biraz sonra yerel bir kurulum yapmayı deneyin.


## Genel Bakış {/*overview*/}

Artık ayarları yaptıysanız, gelin React hakkında bir genel bakış alalım!

### Başlangıç kodunu inceleme {/*inspecting-the-starter-code*/}

CodeSandbox'ta üç ana bölüm göreceksiniz:

![CodeSandbox başlangıç kodu](../../images/frameworks/react/public/images/tutorial/react-starter-code-codesandbox.png)

1. `App.js`, `index.js`, `styles.css` gibi dosyaların listesi bulunan _Dosyalar_ bölümü ve `public` adında bir klasör 
2. Seçili dosyanızın kaynak kodunu göreceğiniz _kod editörü_
3. Yazdığınız kodun nasıl görüntüleneceğini göreceğiniz _tarayıcı_ bölümü

`App.js` dosyası _Dosyalar_ bölümünde seçilmiş olmalıdır. O dosyanın içeriği _kod editöründe_ şöyle görünmelidir:

```jsx
export default function Square() {
  return <button className="square">X</button>;
}
```

_Tarayıcı_ bölümünde ise şöyle bir X içeren kare görünmelidir:

![x-doldurulmuş kare](../../images/frameworks/react/public/images/tutorial/x-filled-square.png)

Şimdi gelin başlangıç kodundaki dosyalara bir bakalım.

#### `App.js` {/*appjs*/}

`App.js` dosyasındaki kod bir _bileşen_ oluşturur. React'ta bir bileşen, bir kullanıcı arayüzünün bir parçasını temsil eden yeniden kullanılabilir bir kod parçasıdır. Bileşenler, uygulamanızdaki UI öğelerini oluşturmak, yönetmek ve güncellemek için kullanılır. Şimdi kodu satır satır inceleyelim:

```js {1}
export default function Square() {
  return <button className="square">X</button>;
}
```

İlk satır, `Square` adında bir fonksiyon tanımlar. `export` JavaScript anahtar kelimesi, bu fonksiyonu bu dosyanın dışından erişilebilir hale getirir. `default` anahtar kelimesi, kodunuzu kullanan diğer dosyalara, dosyanızdaki ana fonksiyonun bu olduğunu bildirir.

```js {2}
export default function Square() {
  return <button className="square">X</button>;
}
```

İkinci satır, bir buton döndürür. `return` JavaScript anahtar kelimesi, sonrasındaki her şeyin, fonksiyonun çağrısına bir değer olarak döndürüldüğünü belirtir. `` bir *JSX öğesidir*. JSX öğesi, neyi görüntülemek istediğinizi tanımlayan bir JavaScript kodu ve HTML etiketlerinin kombinasyonudur. `className="square"` butona hangi CSS stilinin uygulanacağını belirten bir özellik ya da *prop*'dır. `X`, butonun içindeki gösterilecek metindir ve `` JSX öğesini kapatır ve sonraki içeriğin butonun içine yerleştirilmemesi gerektiğini belirtir.

#### `styles.css` {/*stylescss*/}

CodeSandbox'ta _Dosyalar_ bölümündeki `styles.css` dosyasına tıklayın. Bu dosya, React uygulamanızın stillerini tanımlamaktadır. İlk iki _CSS seçici_ (`*` ve `body`), uygulamanızın büyük bölümlerinin stilini tanımlarken, `.square` seçici, `className` özelliği `square` olarak ayarlanmış herhangi bir bileşenin stilini tanımlar. Kodunuzda, bu, `App.js` dosyasındaki Square bileşenindeki buton ile eşleşir.

#### `index.js` {/*indexjs*/}

CodeSandbox'ta _Dosyalar_ bölümündeki `index.js` dosyasına tıklayın. Bu eğitim boyunca bu dosyayı düzenlemeyeceksiniz, ancak bu dosya, `App.js` dosyasında oluşturduğunuz bileşen ile web tarayıcısı arasında köprü görevi görür.

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';
```

1-5. satırlar, gerekli tüm parçaları bir araya getirir:

* React
* Web tarayıcıları ile iletişim kurmak için React'in kütüphanesi (React DOM)
* Bileşenlerinizin stilleri
* `App.js` dosyasında oluşturduğunuz bileşen.

Dosyanın geri kalanı, tüm parçaları bir araya getirir ve sonunda sonucu `public` klasöründeki `index.html` dosyasına yerleştirir.

### Tahtayı Oluşturma {/*building-the-board*/}

Şimdi `App.js` dosyasına geri dönelim. Burada bu eğitimin geri kalanı boyunca çalışacaksınız.

Şu anda tahta sadece tek bir kare, ancak dokuz tane olmalı! Eğer sadece karesinizi kopyalayıp yapıştırmaya çalışırsanız, şöyle:

```js {2}
export default function Square() {
  return <button className="square">X</button><button className="square">X</button>;
}
```

Bu hatayı alacaksınız:



/src/App.js: Yan yana JSX öğeleri, bir kapsayıcı etiket içine sarılmalıdır. Bir JSX Fragmentı `...` mi istediniz?



React bileşenleri, birden fazla yan yana JSX öğesi (örneğin, iki buton) döndürmemelidir. Bunu düzeltmek için, birden fazla yan yana JSX öğesini şöyle sarmalamak için *Fragment'ler* (`<>` ve ``) kullanabilirsiniz:

```js {3-6}
export default function Square() {
  return (
    <>
      <button className="square">X</button>
      <button className="square">X</button>
    </>
  );
}
```

Artık şöyle görünmelisiniz:

![iki x-doldurulmuş kare](../../images/frameworks/react/public/images/tutorial/two-x-filled-squares.png)

Harika! Şimdi sadece dokuz kare eklemek için kopyalayıp yapıştırmanız gerekiyor ve...

![bir satırda dokuz x-doldurulmuş kare](../../images/frameworks/react/public/images/tutorial/nine-x-filled-squares.png)

Ah hayır! Karelerin hepsi tek bir satırda, ihtiyacımız olan ızgara gibi değil. Bunu düzeltmek için, karelerinizi `div`'ler ile satırlara gruplandırmanız ve bazı CSS sınıfları eklemeniz gerekecek. Bu arada, her kareye bir numara vereceksiniz ki her karede nerede görüntüleneceğini bilebilesiniz.

`App.js` dosyasındaki `Square` bileşenini şu şekilde güncelleyerek görünümünü ayarlayın:

```js {3-19}
export default function Square() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

`styles.css` dosyasında tanımlanan CSS, `board-row` sınıfına sahip olan `div`lerin stilini belirler. Artık bileşenlerinizi `div`ler ile gruplandırdığınıza göre, XOX tahtanız hazır:

![1'den 9'a kadar sayılarla dolu XOX tahtası](../../images/frameworks/react/public/images/tutorial/number-filled-board.png)

Ancak şimdi bir sorununuz var. `Square` adındaki bileşeniniz aslında artık bir kare değil. Bunu düzeltmek için adını `Board` olarak değiştirelim:

```js {1}
export default function Board() {
  //...
}
```

Bu noktada kodlarınız şöyle görünmelidir:



```js
export default function Board() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```




Psssst... Bu kadar çok yazmak biraz zor! Bu sayfadan kod kopyalayıp yapmanız sorun değil. Bununla birlikte, küçük bir meydan okuma arıyorsanız, sadece daha önce manuel olarak en az bir kez yazdığınız kodları kopyalamanızı öneririz.


### Verileri prop'lar aracılığıyla iletme {/*passing-data-through-props*/}

Sonraki adımda, kullanıcı bir kareye tıkladığında, o karenin değerini boşluktan "X"e değiştirmek isteyeceksiniz. Şu anda tahtayı bu şekilde oluşturursanız, her bir karenin güncellenmesi için dokuz kez kopyalayıp yapıştırmanız gerekecek! Kopyalayarak yapıştırmak yerine, React'ın bileşen mimarisi, karmaşık, tekrar eden kodlardan kaçınmak için yeniden kullanılabilir bir bileşen oluşturmanıza olanak tanır.

Öncelikle, ilk karenizi tanımlayan satırı (`1`) `Board` bileşeninden yeni bir `Square` bileşenine kopyalayacaksınız:

```js {1-3}
function Square() {
  return <button className="square">1</button>;
}

export default function Board() {
  // ...
}
```

Ardından, `Board` bileşenini JSX sözdizimini kullanarak `Square` bileşenini oluşturacak şekilde güncelleyeceksiniz:

```js {5-19}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

Tarayıcı `div`'lerinizin aksine, kendi bileşenleriniz (`Board` ve `Square`) büyük harfle başlamalıdır.

Şimdi bakalım:

![bir dolu tahta](../../images/frameworks/react/public/images/tutorial/board-filled-with-ones.png)

Ah hayır! Daha önce sahip olduğunuz numaralı kareleri kaybettiniz. Şimdi her kare "1" diyor. Bunu düzeltmek için, *prop*'lar aracılığıyla her kare değeri, üst bileşenden (`Board`) alt bileşene (`Square`) geçmelidir.

`Square` bileşenini, `Board` bileşeninden geçireceğiniz `value` prop'unu okuyacak şekilde güncelleyin:

```js {1}
function Square({ value }) {
  return <button className="square">1</button>;
}
```

`function Square({ value })` ifadesi, `Square` bileşenine `value` adında bir prop geçebileceğini belirtir.

Şimdi her karede gösterilecek olan `value`'yu, `1` yerine görüntülemek isteyeceksiniz. İşte şöyle yapmayı deneyin:

```js {2}
function Square({ value }) {
  return <button className="square">value</button>;
}
```

Aman Tanrım, bu istediğiniz gibi değil:

![değer-doldurulmuş tahta](../../images/frameworks/react/public/images/tutorial/board-filled-with-value.png)

JavaScript değişkeni olan `value`'yu bileşeninizden değil, "value" kelimesini yazdırmak istiyorsunuz. JSX'den "JavaScript'e kaçmak" için, süslü parantezler kullanmalısınız. JSX'de `value`'nun etrafına süslü parantezler ekleyin:

```js {2}
function Square({ value }) {
  return <button className="square">{value}</button>;
}
```

Şu anda boş bir tahta görmelisiniz:

![boş tahta](../../images/frameworks/react/public/images/tutorial/empty-board.png)

Bu, `Board` bileşeninin henüz her `Square` bileşenine `value` prop'unu geçmediğindendir. Bunu düzeltmek için, `Board` bileşeninin her `Square` bileşenine geçireceği `value` prop'unu ekleyeceksiniz:

```js {5-7,10-12,15-17}
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

Artık tekrar bir sayı ızgarası görmelisiniz:

![1'den 9'a kadar sayılarla dolu XOX tahtası](../../images/frameworks/react/public/images/tutorial/number-filled-board.png)

Güncellenmiş kodlarınız şöyle görünmelidir:



```js src/App.js
function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```