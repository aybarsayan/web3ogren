---
title: XML'den JSON'a
description: Bu belgede, XML'den JSON'a veri dönüşümünü gerçekleştiren bir JavaScript kütüphanesi hakkında bilgiler bulacaksınız. Özellikle, hızlı bir XML ayrıştırma ve hata kontrolü için nasıl kullanılacağını ayrıntılı olarak ele alacağız.
keywords: [XML, JSON, JavaScript, fast-xml-parser, veri dönüşümü, hata kontrolü]
---

### XML'den JSON'a

```js
const jsonObj = parser.parse(xmlData [,options] );
```

```js
const parser = require('fast-xml-parser');
const he = require('he');

const options = {
    attributeNamePrefix : "@_",
    attrNodeName: "attr", //varsayılan 'false'
    textNodeName : "#text",
    ignoreAttributes : true,
    ignoreNameSpace : false,
    allowBooleanAttributes : false,
    parseNodeValue : true,
    parseAttributeValue : false,
    trimValues: true,
    cdataTagName: "__cdata", //varsayılan 'false'
    cdataPositionChar: "\\c",
    parseTrueNumberOnly: false,
    numParseOptions:{
      hex: true,
      leadingZeros: true,
      //skipLike: /\+[0-9]{10}/
    },
    arrayMode: false, //"strict"
    attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),//varsayılan a=>a
    tagValueProcessor : (val, tagName) => he.decode(val), //varsayılan a=>a
    stopNodes: ["parse-me-as-string"],
    alwaysCreateTextNode: false
};

if( parser.validate(xmlData) === true) { //isteğe bağlı (geçersizse bir nesne dönecektir)
    let jsonObj = parser.parse(xmlData,options);
}

// Ara nesne
const tObj = parser.getTraversalObj(xmlData,options);
let jsonObj = parser.convertToJson(tObj,options);

```

> Doğrulayıcı, `parser` içinde yer almadığını ve ayrı olarak çağrılması gerektiğini görebilirsiniz. Ancak, doğrulayıcıyı dahili olarak tetiklemek için `parser`'a 3. parametre olarak `true` veya doğrulama seçeneklerini geçebilirsiniz. Bu, yukarıdaki örnekle aynıdır.  
> — Döküman

```js
try{
  let jsonObj = parser.parse(xmlData,options, true);
}catch(error){
  console.log(error.message)
}
```

Doğrulayıcı, bir hata durumunda aşağıdaki nesneyi döndürür;
```js
{
  err: {
    code: code,
    msg: message,
    line: lineNumber,
  },
};
```

#### Not: [he](https://www.npmjs.com/package/he) kütüphanesi bu örnekte kullanılmıştır


	SEÇENEKLER :

* **parseNodeValue** : Metin düğümünün değerini float, tam sayı veya boolean olarak çözümle.
* **parseAttributeValue** : Bir niteliğin değerini float, tam sayı veya boolean olarak çözümle.
* **trimValues** : Bir niteliğin veya düğümün string değerlerini kes.
* **decodeHTMLchar** : Bu seçenek 3.3.4'ten çıkarılmıştır. Bunun yerine, tagValueProcessor ve attrValueProcessor kullanın. Yukarıdaki örneğe bakın.
* **cdataTagName** : Belirtilirse, parser CDATA'yı ana etiketine eklemek yerine iç içe bir etiket olarak çözümler.
* **cdataPositionChar** : JSON'un XML'e döndürülmesine yardımcı olurken CDATA konumunu kaybetmemek için kullanılır.
* **parseTrueNumberOnly**: Eğer true ise "+123" veya "0123" gibi değerler sayı olarak çözülmez.
* **arrayMode** : `false` olduğunda, tek bir kez meydana gelen bir etiket bir nesne olarak, çoklu durumlarda ise bir dizi olarak çözümlenir. `true` olduğunda, etiket her zaman dizi olarak çözümlenir, yaprak düğümler hariç. `strict` olduğunda, tüm etiketler yalnızca dizi olarak çözümlenir. `RegEx` örneği olduğunda, yalnızca regex ile eşleşen etiketler dizi olarak çözümlenir. `function` olduğunda, bir etiket adı callback'e geçilir ve kontrol edilebilir.
* **tagValueProcessor** : Dönüşüm sırasında etiket değerini işle. HTML çözümleme, kelime büyük harf yapma vb. String için geçerlidir.
* **attrValueProcessor** : Dönüşüm sırasında nitelik değerini işle. HTML çözümleme, kelime büyük harf yapma vb. String için geçerlidir.
* **stopNodes** : Çözümlemesi gerekmeyen etiket adlarının bir dizisi. Bunun yerine, değerleri string olarak çözümlenir.
* **alwaysCreateTextNode** : `true` olduğunda, parser'ın her zaman `textNodeName` için bir özellik döndürmesini zorlar, hatta hiç nitelik veya düğüm çocukları olmasa bile.



	komut satırından kullanmak için

```bash
$xml2js [-ns|-a|-c|-v|-V] <filename> [-o outputfile.json]
$cat xmlfile.xml | xml2js [-ns|-a|-c|-v|-V] [-o outputfile.json]
```

* -ns : İsim alanlarını dahil etmek için (varsayılan olarak göz ardı edilir)
* -a : Nitelikleri göz ardı etmek için
* -c : Değer dönüşümünü göz ardı etmek için (örneğin "-3", sayı -3'e dönüştürülmez)
* -v : Çözümlemeden önce doğrulama yapmak için
* -V : yalnızca doğrulamak için



	web sayfasında kullanmak için

```js
const result = parser.validate(xmlData);
if (result !== true) console.log(result.err);
const jsonObj = parser.parse(xmlData);
```


### JSON / JS Nesnesinden XML'e

```js
const Parser = require("fast-xml-parser").j2xParser;
//varsayılan seçenekleri ayarlamak gerekmez
const defaultOptions = {
    attributeNamePrefix : "@_",
    attrNodeName: "@", //varsayılan false
    textNodeName : "#text",
    ignoreAttributes : true,
    cdataTagName: "__cdata", //varsayılan false
    cdataPositionChar: "\\c",
    format: false,
    indentBy: "  ",
    suppressEmptyNode: false,
    tagValueProcessor: a=> he.encode(a, { useNamedReferences: true}),// varsayılan a=>a
    attrValueProcessor: a=> he.encode(a, {isAttributeValue: isAttribute, useNamedReferences: true}),// varsayılan a=>a
    rootNodeName: "element"
};
const parser = new Parser(defaultOptions);
const xml = parser.parse(json_or_js_obj);
```


	SEÇENEKLER :

Doğru seçeneklerle, bilgileri kaybetmeden neredeyse orijinal XML'yi alabilirsiniz.

* **attributeNamePrefix** : Bu önekle nitelikleri tanımlayın, aksi takdirde bunları etiket olarak değerlendirin.
* **attrNodeName**: Nitelikleri tek bir özellik altında gruplanmışken tanımlamak için.
* **ignoreAttributes** : Niteliklere bakmayın. Her şeyi etiket olarak değerlendirin.
* **encodeHTMLchar** : Bu seçenek 3.3.4'ten çıkarılmıştır. Bunun yerine tagValueProcessor ve attrValueProcessor kullanın. Yukarıdaki örneğe bakın.
* **cdataTagName** : Belirtilirse, eşleşen etiketi CDATA olarak çözümle
* **cdataPositionChar** : CDATA etiketinin nerede yer alacağına dair bir konum belirleyin. Eğer boşsa, CDATA etiketin değerinin sonuna eklenecektir.
* **format** : Eğer `true` olarak ayarlandıysa, XML çıktısını biçimlendirin.
* **indentBy** : Biçimlendirme `true` olarak ayarlandığında bu karakterle girintileyin.
* **suppressEmptyNode** : Eğer `true` olarak ayarlandıysa, değeri olmayan etiketler (metin veya iç içe etiket) kendinden kapanan etiketler olarak yazılır.
* **tagValueProcessor** : Dönüşüm sırasında etiket değerini işlem. HTML kodlaması, kelime büyük harf yapma vb. String için geçerlidir.
* **attrValueProcessor** : Dönüşüm sırasında nitelik değerini işlem. HTML kodlaması, kelime büyük harf yapma vb. String için geçerlidir.
* **rootNodeName** : Giriş js nesnesi dizi olduğunda, parser varsayılan olarak dizi indeksini etiket adı olarak kullanır. Uygun bir yanıt için bu özelliği ayarlayabilirsiniz.
