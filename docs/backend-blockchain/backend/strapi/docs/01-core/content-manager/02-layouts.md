---
title: Düzenler
description: Düzenlerin Liste & Düzenleme görünümü ile nasıl çalıştığını ele alıyor. Bu yazıda, düzenlerin veri yapısı, bileşenleri ve özel render yöntemleri hakkında bilgi verilmektedir.
keywords: [düzen, içerik yönetimi, düzenleme görünümleri, liste görünümleri, bileşen yapısı]
---

Düzenler, CM'nin liste ve düzenleme görünümlerini nasıl render edeceği konusunda temeldir. Düzenleme görünümünün düzeni, `'Admin/CM/pages/EditView/mutate-edit-view-layout'` kancası aracılığıyla eklentilerle manipüle edilebilir. Bu arada, liste görünümüne şimdilik sadece tablo sütunları enjekte edilebilir.

## Düzen nedir?

Düzen, görünümleri oluşturmaya yönelik olarak üzerinde döngü kurduğumuz bir veri yapısıdır. Hem Liste hem de Düzenleme görünümü için yapıların açıkça benzer şekilde tasarlandığını görebilirsiniz:

```ts
interface ListLayout {
  layout: ListFieldLayout[];
  components?: never;
  metadatas: object;
  settings: object;
}

interface EditLayout {
  layout: Array<Array<EditFieldLayout[]>>;
  components: Record<string, Omit<EditLayout, 'metadatas' | 'components'>>;
  metadatas: object;
  settings: object;
}
```

> **Önemli Not:** Yukarıdaki türler açıklama amacıyla sadeleştirilmiştir, ancak `EditLayout`'in `components` özelliğinden, aslında ebeveyninin aynısı olduğu, sadece bileşen başına iç içe ve düzenli hale getirildiği açıktır. Bu tutarlılık, düzenler üzerinde kolayca döngü kurup genel düzen ve bileşen düzenleri için aynı bileşenleri kullanarak görünümleri render etmemizi sağlar.

---

## Nasıl yapılır?

Düzen, bir içerik türünün şeması ile konfigürasyon dosyasının bir kombinasyonudur; veri yapıları benzer olsa da, en kök arayüzlerinde farklıdır.

### Düzenleme Görünümü

Düzenleme Görünümü düzeninin en temel arayüzü `EditFieldLayout`'dir ve bu, esasen Form Bileşenlerimizden `InputProps`'tan türetilmiştir:

```ts
interface InputProps {
  disabled?: boolean;
  hint?: string;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type: Exclude<
    Attribute.Kind,
    'media' | 'blocks' | 'richtext' | 'uid' | 'dynamiczone' | 'component' | 'relation'
  >;
}

interface EditFieldSharedProps extends Omit<InputProps, 'type'> {
  mainField?: string;
  size: number;
  unique?: boolean;
  visible?: boolean;
}
```

:::info
Attribute Türleri üzerindeki tüm türlere harita oluşturun ve attribute türü özellik ve type özelliği altında yeni türlerin birleşimini oluşturmak için kullanın.
:::

```ts
type EditFieldLayout = {
  [K in Attribute.Kind]: EditFieldSharedProps & {
    attribute: Extract<Attribute.Any, { type: K }>;
    type: K;
  };
}[Attribute.Kind];
```

Dışlanan `type` değerleri, içerik yöneticisine özgüdür ve bu nedenle evrensel form girişi olarak render edilmesi beklenmez. Bu veri yapısı, herhangi bir form girişi render etmek için `InputRenderer` bileşenine aktarılır (önceden `GenericInputs` olarak biliniyordu). Bu girişlerin `value`, `onChange` veya `error` prop'larını almadığını unutmayın. Bu değerler, `useField(name)` kullanılarak `Form`'dan çıkarılır:

```ts
export const StringInput = forwardRef<HTMLInputElement, InputProps>(
  ({ disabled, label, hint, name, placeholder, required }, ref) => {
    const field = useField(name);

    return (
      <TextInput
        ref={ref}
        disabled={disabled}
        hint={hint}
        label={label}
        name={name}
        defaultValue={field.initialValue}
        onChange={field.onChange}
        placeholder={placeholder}
        required={required}
        value={field.value}
      />
    );
  }
);
```

:::tip
CM'ye özgü girişlerin işlenmesi için, Düzenleme Görünümü alanının kendi `InputRenderer` bileşeni vardır. Bu prensibi takip eder, ancak bu ayrıca özel alanlar gibi nitelikleri de işler.
:::

Düzenleme Görünümü, düzenin üzerinde "basitçe" render edilir, `InputRenderer`'a prop'lar geçirir. Eğer dinamik bir alan veya bileşen varsa, daha önce belirtildiği gibi, `EditLayout` veri yapısının `components` özelliğini kullanarak düzeni yineleyerek render ederiz; çünkü bu, ebeveyninin aynı yapısını takip eder, bu nedenle tam olarak aynı şekilde yineleyebiliriz ve gereksinim duyulan _herhangi bir alanı_ render edebiliriz, derinlemesine iç içe bileşenler ve dinamik alanlar dahil.

---

### Liste Görünümü

Liste görünümü esasen dev bir tablo olduğundan, veri yapısı düzenleme görünümünden oldukça daha basittir:

```ts
interface ListFieldLayout {
  /**
   * Alan için içerik türünün şemasından attribute verisi
   */
  attribute: Attribute.Any | { type: 'custom' }; // özel attribute'ların `cellFormatter` kullanması beklenir.
  /**
   * Genellikle eklentiler tarafından özel bir hücre render etmek için kullanılır
   */
  cellFormatter?: (
    data: { [key: string]: unknown },
    header: Omit<ListFieldLayout, 'cellFormatter'>
  ) => React.ReactNode;
  label: string | MessageDescriptor;
  /**
   * Gerçek ismi görüntülemek için kullandığımız attribute'un ismi. Örneğin, ilişkiler
   * yalnızca kimliklerdir, bu nedenle hedefin şemasına bakarak anlamlı bir şey
   * görüntülemek için mainField'i kullanırız.
   */
  mainField?: string;
  name: string;
  searchable?: boolean;
  sortable?: boolean;
}
```

:::warning
`cellFormatter` özelliği, eklenti geliştiricilerinin kendi sütunlarını enjekte edebilmesi için çok önemlidir; çünkü muhtemelen, eklentinin sağladığı verileri render etmek için gereken bileşenlere sahip olmayacağız.
:::

Bu nedenle, onlara tüm satır verisini ve `'Admin/CM/pages/ListView/inject-column-in-table'` kancası aracılığıyla enjekte ettikleri başlığı veririz.