---
sidebar_position: 2
---

# Sanal Makine (VM) Oluşturma

## Giriş

Camino'nun temel özelliklerinden biri,  (VM'ler) tarafından tanımlanan yeni, özel blok zincirleri oluşturma yeteneğidir.

Bu eğitimde, çok basit bir VM oluşturacağız. VM tarafından tanımlanan blok zinciri, bir  dir. Blok zincirindeki her blok, oluşturulduğu zamanın damgasını ve 32 baytlık bir veri parçasını (yük) içerir. Her blok, ana bloğunun damgasından sonra oluşturulmuştur.

Böyle bir sunucu, bir verinin, blok oluşturulduğu anda mevcut olduğunu kanıtlamak için kullanılabilir. Diyelim ki bir kitap taslağınız var ve gelecekte bu taslağın bugün var olduğunu kanıtlamak istiyorsunuz. Bu blok zincirine, yükü taslağınızın bir hash'i olan bir blok ekleyebilirsiniz. Gelecekte, bu bloğun yükünde kitabınızın hash'inin bulunduğunu göstererek o taslağın bugün var olduğunu kanıtlayabilirsiniz (bu, bir hash'in ön görüntüsünü bulmanın imkansız olmasından kaynaklanmaktadır).

Bir blok zinciri, Camino-Node'dan ayrı bir süreç olarak çalışabilir ve gRPC üzerinden Camino-Node ile iletişim kurabilir. Bu,  adında, başka bir VM uygulamasını saran özel bir VM tarafından sağlanmaktadır ve `go-plugin` kullanmaktadır.

Bir VM'nin uygulanmasına geçmeden önce, bir VM'nin Camino-Node'un konsensüs motoru ile uyumlu olması için uygulaması gereken arayüze bakacağız. Tüm kodu parçalar halinde göstereceğiz ve açıklayacağız. Tüm kodu tek bir yerde görmek isterseniz,  bakabilirsiniz.

---

**NOTLAR**

- Blok zincirleri, Alt ağlar, İşlemler ve Adreslerin kimlikleri her çalışma/ağ için farklı olabilir. Bu, bu eğitimdeki bazı girişlerin, uç noktaların vb. denediğinizde farklı olabileceği anlamına gelir.
- Bu eğitimde, Camino-Node v0.2.1-rc2 ve TimestampVM v1.2.1 kullandık. En son sürüm/dallardaki kodlar, bu sayfada sunulanlardan farklı olabilir.

---

## Arabirimler

### `block.ChainVM`

Lineer blok zincirlerinde (DAG blok zincirlerinin aksine) konsensüsü sağlamak için Camino, Snowman konsensüs motorunu kullanır. Snowman ile uyumlu olabilmesi için, bir VM'nin `block.ChainVM` arayüzünü uygulaması gerekir; bu arayüze  erişilebilir.

Arayüz oldukça geniş, ancak endişelenmeyin; her yöntemi açıklayacağız ve bir uygulama örneğini göreceğiz. Her detayı hemen anlamanız önemli değildir. Kod içindeki yorumlar, arayüz metodları hakkında daha fazla ayrıntı sağlar.

```go title="/snow/engine/snowman/block/vm.go"
// ChainVM, bir Snowman VM'sinin gerektirdiği işlevselliği tanımlar.
//
// Bir Snowman VM'si, durumun temsili, bu duruma uygulanan işlemlerin temsili,
// bu durum üzerindeki işlemlerin uygulanması ve işlemlerin oluşturulması için
// sorumludur. Konsensüs, işlemin yürütülüp yürütülmeyeceğine ve işlemlerin hangi sırayla
// yürütüleceğine karar verecektir.
//
// Örneğin, ağ tarafından üzerinde anlaşılan artan bir sayıyı izleyen bir VM'ye
// sahip olduğumuzu varsayın. Durum tek bir sayıdır. İşlem, sayıyı yeni
// ve daha büyük bir değere ayarlamadır. İşlemin uygulanması, veritabanına yeni
// değeri kaydedecektir. VM, istediği zaman daha büyük bir değer için yeni bir sayı
// sağlamaya çalışabilir. Konsensüs, her blok yüksekliğinde ağın bu sayıyı
// onaylamasını sağlayacaktır.
type ChainVM interface {
	common.VM
	Getter
	Parser

	// VM'de yer alan verilere dayalı olarak yeni bir blok oluşturmaya çalışır.
	//
	// Eğer VM yeni bir blok oluşturmak istemiyorsa, bir hata
	// döndürülmelidir.
	BuildBlock() (snowman.Block, error)

	// VM'yi şu anda tercih edilen blok hakkında bilgilendirir.
	//
	// Bu, konsensüs tarafından bilinen çocukları olmayan bir blok olmalıdır.
	SetPreference(ids.ID) error

	// LastAccepted, son kabul edilen bloğun kimliğini döndürür.
	//
	// Eğer konsensüs tarafından henüz hiçbir blok kabul edilmediyse, kabul edilmiş
	// bir tanım bloğu olduğu varsayılarak, Genesis bloğu döndürülecektir.
	LastAccepted() (ids.ID, error)
}

// Getter, bir bloğu kimliğine göre alma işlevselliğini tanımlar.
type Getter interface {
	// Bir bloğu yüklemeye çalışır.
	//
	// Eğer blok mevcut değilse, bir hata döndürülmelidir.
	//
	GetBlock(ids.ID) (snowman.Block, error)
}

// Parser, bir bloğu byte olarak alma işlevselliğini tanımlar.
type Parser interface {
	// Bir byte akışından bir blok oluşturmaya çalışır.
	//
	// Blok, ekstra byte olmadan tam byte dizisi ile temsil edilmelidir.
	ParseBlock([]byte) (snowman.Block, error)
}
```

### `common.VM`

`common.VM`, her `VM`'nin, ister DAG ister lineer bir zincir olsun, uygulaması gereken bir türdür.

Tam dosyayı  görebilirsiniz.

```go title="/snow/engine/common/vm.go"
// VM, tüm konsensüs VM'lerinin uygulaması gereken arayüzü tanımlar
type VM interface {
    // VM'den VM'ye özgü mesajlar için işleyicileri içerir
	AppHandler

	// VM sağlıklıysa nil döndü.
	// Düğümün Sağlık API'si aracılığıyla periyodik olarak çağrılır ve rapor edilir.
	health.Checkable

	// Bağlayıcı, bağlantı bağlanma/ayrılma durumunda çağrılan bir işleyiciyi temsil eder.
	validators.Connector

	// Bu VM'yi başlatır.
	// [ctx]: Bu VM hakkında metadata.
	//     [ctx.networkID]: Bu VM'nin zincirinin çalıştığı ağın kimliği.
	//     [ctx.chainID]: Bu VM'nin çalıştığı zincirin benzersiz kimliği.
	//     [ctx.Log]: Mesajları günlüğe kaydetmek için kullanılır.
	//     [ctx.NodeID]: Bu düğümün benzersiz staker kimliği.
	//     [ctx.Lock]: Bu VM ile konsensüs motoru arasında paylaşılan bir Okuma/Yazma kilidi.
	//                 Konsensüs motoru, VM'yi her çağırdığında yazma kilidi tutulur.
	// [dbManager]: Bu VM'nin veri kalıcı hale getireceği veritabanasının yöneticisi.
	// [genesisBytes]: Bu VM'nin durumu başlatmak için kullandığı genesis bilgilerinin byte kodlaması.
	//                 Örneğin, eğer bu VM bir hesap bazlı ödeme sistemi olsaydı,
	//                 `genesisBytes`, bazı hesaplara coin veren bir genesis işlemine sahip olurdu
	//                 ve bu işlem genesis blokta olurdu.
	// [toEngine]: Konsensüs motoruna mesaj göndermek için kullanılan kanal.
	// [fxs]: Bu VM'ye eklenen özellik uzantıları.
	Initialize(
		ctx *snow.Context,
		dbManager manager.Manager,
		genesisBytes []byte,
		upgradeBytes []byte,
		configBytes []byte,
		toEngine chan= time.Now().Add(time.Hour).Unix() {
		return errTimestampTooLate
	}

	// Bu bloğu hafızanın doğrulanmış bloklarına ekle
	b.vm.verifiedBlocks[b.ID()] = b

	return nil
}
```

#### Kabul Et

`Accept`, bu bloğun kabul edildiğini belirtmek için konsensüs tarafından çağrılır.

```go title="/timestampvm/block.go"
// Accept, bu bloğun durumunu Accepted olarak ayarlar ve lastAccepted'i bu
// bloğun ID'sine ayarlar ve bu bilgiyi b.vm.DB'ye kaydeder
func (b *Block) Accept() error {
	b.SetStatus(choices.Accepted) // bu bloğun durumunu değiştir
	blkID := b.ID()

	// Verileri kalıcı hale getir
	if err := b.vm.state.PutBlock(b); err != nil {
		return err
	}

	// Son kabul edilen ID'yi bu blok ID'sine ayarla
	if err := b.vm.state.SetLastAccepted(blkID); err != nil {
		return err
	}

	// Bu bloğu kabul edildiği için doğrulanmış bloklardan sil
	delete(b.vm.verifiedBlocks, b.ID())

	// Değişiklikleri veritabanına kaydet
	return b.vm.state.Commit()
}
```

#### Reddet

`Reject`, bu bloğun reddedildiğini belirtmek için konsensüs tarafından çağrılır.

```go title="/timestampvm/block.go"
// Reject, bu bloğun durumunu Rejected olarak ayarlar ve durumu state'e kaydeder
// b.vm.DB.Commit()'in veritabanına kalıcı hale getirilmesi gerektiğini unutmayın
func (b *Block) Reject() error {
	b.SetStatus(choices.Rejected) // bu bloğun durumunu değiştir
	if err := b.vm.state.PutBlock(b); err != nil {
		return err
	}
	// Bu bloğu reddedildiği için doğrulanmış bloklardan sil
	delete(b.vm.verifiedBlocks, b.ID())
	// Değişiklikleri veritabanına kaydet
	return b.vm.state.Commit()
}
```

#### Blok Alan Yöntemleri

Bu yöntemler, `snowman.Block` arayüzünün gereksinimleridir.

```go title="/timestampvm/block.go"
// ID, bu bloğun ID'sini döndürür
func (b *Block) ID() ids.ID { return b.id }

// ParentID, [b]'nin ebeveyninin ID'sini döndürür
func (b *Block) Parent() ids.ID { return b.PrntID }

// Height, bu bloğun yüksekliğini döndürür. Genesis bloğu 0 yüksekliktedir.
func (b *Block) Height() uint64 { return b.Hght }

// Timestamp, bu bloğun zamanını döndürür. Genesis bloğu 0 zamanına sahiptir.
func (b *Block) Timestamp() time.Time { return time.Unix(b.Tmstmp, 0) }

// Status, bu bloğun durumunu döndürür
func (b *Block) Status() choices.Status { return b.status }

// Bytes, bu blok için byte temsilini döndürür
func (b *Block) Bytes() []byte { return b.bytes }
```

#### Yardımcı Fonksiyonlar

Bu yöntemler, bloklar için yardımcı yöntemlerdir, bunlar blok arayüzünün bir parçası değildir.

```go
// Initialize, [b.bytes] 'i [bytes]' e, [b.id] 'yi hash([b.bytes])' e,
// [b.status] 'ı [status]' e ve [b.vm] 'yi [vm]' e ayarlar
func (b *Block) Initialize(bytes []byte, status choices.Status, vm *VM) {
	b.bytes = bytes
	b.id = hashing.ComputeHash256Array(b.bytes)
	b.status = status
	b.vm = vm
}

// SetStatus, bu bloğun durumunu ayarlar
func (b *Block) SetStatus(status choices.Status) { b.status = status }
```

### Sanal Makine

Şimdi, `block.ChainVM` arayüzünü uygulayan zaman damgası VM'ye bakalım.

Beyan şu şekildedir:

```go title="/timestampvm/vm.go"
// Bu Sanal Makine, bir zaman damgası sunucusu olarak hareket eden bir blok zincirini tanımlar
// Her blok bir veri (yük) ve oluşturulduğu zaman damgasını içerir

const (
  dataLen = 32
	Name    = "timestampvm"
)

// VM, snowman.VM arayüzünü uygular
// Bu zincirdeki her blok Unix zaman damgası ve bir veri parçası (bir string) içerir
type VM struct {
	// Bu vm'nin bağlamı
	ctx       *snow.Context
	dbManager manager.Manager

	// Bu VM'nin durumu
	state State

	// Tercih edilen bloğun ID'si
	preferred ids.ID

	// konsensüs motoruna mesaj göndermek için kanal
	toEngine chan Blok
	// Her eleman, doğrulamadan geçmiş ama henüz kabul edilmemiş/reddedilmemiş bir bloktur
	verifiedBlocks map[ids.ID]*Block
}
```

#### Başlat

Bu yöntem, VM'nin yeni bir örneği başlatıldığında çağrılır. Genesis bloğu bu yöntem altında oluşturulur.

```go title="/timestampvm/vm.go"
// Bu vm'yi başlatır
// [ctx], bu vm'nin bağlamıdır
// [dbManager], bu vm'nin veritabanı yöneticisidir
// [toEngine], konsensüs motoruna yeni blokların eklenmeye hazır olduğunu bildirmek için kullanılır
// Genesis bloğundaki veri [genesisData]'dır
func (vm *VM) Initialize(
	ctx *snow.Context,
	dbManager manager.Manager,
	genesisData []byte,
	upgradeData []byte,
	configData []byte,
	toEngine chan dataLen {
		return errBadGenesisBytes
	}

	// genesisData bir byte dilimidir ama her blok bir byte dizisi içerir
	// genesisData'dan ilk [dataLen] byte'ı al ve bir dizide yerleştir
	var genesisDataArr [dataLen]byte
	copy(genesisDataArr[:], genesisData)

	// genesis bloğunu oluştur
	// Genesis bloğunun zaman damgası 0'dır. Ebeveyni yoktur.
	genesisBlock, err := vm.NewBlock(ids.Empty, 0, genesisDataArr, time.Unix(0, 0))
	if err != nil {
		log.Error("genesis bloğu oluştururken hata: %v", err)
		return err
	}

	// Genesis bloğunu duruma koy
	if err := vm.state.PutBlock(genesisBlock); err != nil {
		log.Error("genesis bloğunu kaydederken hata: %v", err)
		return err
	}

	// Genesis bloğunu kabul et
	// [vm.lastAccepted] ve [vm.preferred]'i ayarlar
	if err := genesisBlock.Accept(); err != nil {
		return fmt.Errorf("genesis bloğunu kabul etme hatası: %w", err)
	}

	// Bu vm'nin durumunu başlatılmış olarak işaretle, böylece ilerleyen yeniden başlatmalarda initGenesis'i atlayabiliriz
	if err := vm.state.SetInitialized(); err != nil {
		return fmt.Errorf("veritabanını başlatılmış olarak ayarlarken hata: %w", err)
	}

	// VM'nin veritabanasını altta yatan veritabanasına temizle
	return vm.state.Commit()
}
```

#### CreateHandlers

`Service` içinde tanımlanan kayıtlı işleyicileri oluşturur. API'ler hakkında daha fazla bilgi için  bakın.

```go title="/timestampvm/vm.go"
// CreateHandlers, bir harita döndürür:
// Anahtarlar: Bu blok zincirinin API'si için yol uzantısı (bu durumda boş)
// Değerler: API için işleyici
// Bu durumda, blok zincirimiz yalnızca "timestamp" adlı bir API'ye sahiptir
// ve yol uzantısı yoktur, bu nedenle API uç noktası:
// [Düğüm IP]/ext/bc/[bu blok zincirinin ID'si]
// API bölümü için belgede daha fazla bilgiye bakın
func (vm *VM) CreateHandlers() (map[string]*common.HTTPHandler, error) {
	server := rpc.NewServer()
	server.RegisterCodec(json.NewCodec(), "application/json")
	server.RegisterCodec(json.NewCodec(), "application/json;charset=UTF-8")
    // Adı "timestampvm"
	if err := server.RegisterService(&Service{vm: vm}, Name); err != nil {
		return nil, err
	}

	return map[string]*common.HTTPHandler{
		"": {
			Handler: server,
		},
	}, nil
}
```

#### CreateStaticHandlers

`StaticService` içinde tanımlanan statik işleyicileri oluşturur. Statik API'ler hakkında daha fazla bilgi için  bakın.

```go title="/timestampvm/vm.go"
// CreateStaticHandlers, bir harita döndürür:
// Anahtarlar: Bu VM'nin statik API'si için yol uzantısı
// Değerler: O statik API için işleyici
func (vm *VM) CreateStaticHandlers() (map[string]*common.HTTPHandler, error) {
	server := rpc.NewServer()
	server.RegisterCodec(json.NewCodec(), "application/json")
	server.RegisterCodec(json.NewCodec(), "application/json;charset=UTF-8")
	if err := server.RegisterService(&StaticService{}, Name); err != nil {
		return nil, err
	}

	return map[string]*common.HTTPHandler{
		"": {
			LockOptions: common.NoLock,
			Handler:     server,
		},
	}, nil
}
```

#### BuildBlock

`BuildBlock`, yeni bir blok oluşturur ve döndürür. Bu, esasen konsensüs motoru tarafından talep edilir.

```go title="/timestampvm/vm.go"
// BuildBlock, konsensüse eklemek istediği bir bloğu döndürür
func (vm *VM) BuildBlock() (snowman.Block, error) {
	if len(vm.mempool) == 0 { // Oluşturulacak blok yok
		return nil, errNoPendingBlocks
	}

	// Yeni blokta kullanılacak değeri al
	value := vm.mempool[0]
	vm.mempool = vm.mempool[1:]

	// Konsensüs motoruna, bu blok oluşturulduktan sonra daha fazla bekleyen veri olduğunu bildirin
	// (varsa) işlemi tamamlandığında
	if len(vm.mempool) > 0 {
		defer vm.NotifyBlockReady()
	}

	// Tercih edilen Bloğu al
	preferredBlock, err := vm.getBlock(vm.preferred)
	if err != nil {
		return nil, fmt.Errorf("tercih edilen bloğu almak mümkün olmadı: %w", err)
	}
	preferredHeight := preferredBlock.Height()

	// Bloku tercih edilen yükseklik ile oluştur
	newBlock, err := vm.NewBlock(vm.preferred, preferredHeight+1, value, time.Now())
	if err != nil {
		return nil, fmt.Errorf("bloğu inşa etmek mümkün olmadı: %w", err)
	}

	// Bloğu doğrula
	if err := newBlock.Verify(); err != nil {
		return nil, err
	}
	return newBlock, nil
}
```

#### NotifyBlockReady

`NotifyBlockReady`, bir yeni blok oluşturulmaya hazır olduğunda konsensüs motoruna mesaj gönderebilir.

```go title="/timestampvm/vm.go"
// NotifyBlockReady, bir yeni bloğun oluşturulmaya hazır olduğunu 
// konsensüs motoruna bildirir
func (vm *VM) NotifyBlockReady() {
	select {
	case vm.toEngine  0 {
        argBytes = make([]byte, args.Length)
        copy(argBytes, args.Data)
    } else {
        argBytes = []byte(args.Data)
    }

    bytes, err := formatting.EncodeWithChecksum(args.Encoding, argBytes)
    if err != nil {
        return fmt.Errorf("couldn't encode data as string: %s", err)
    }
    reply.Bytes = bytes
    reply.Encoding = args.Encoding
    return nil
}
```

#### Decode

Bu API metodu, `Encode`'in tersidir.

```go title="/timestampvm/static_service.go"
// DecoderArgs, Decode için argümanlardır
type DecoderArgs struct {
    Bytes    string              `json:"bytes"`
    Encoding formatting.Encoding `json:"encoding"`
}

// DecoderReply, Decoder'dan dönen yanıttır
type DecoderReply struct {
    Data     string              `json:"data"`
    Encoding formatting.Encoding `json:"encoding"`
}

// Decoder, decode edilmiş veriyi döner
func (ss *StaticService) Decode(_ *http.Request, args *DecoderArgs, reply *DecoderReply) error {
    bytes, err := formatting.Decode(args.Encoding, args.Bytes)
    if err != nil {
        return fmt.Errorf("couldn't Decode data as string: %s", err)
    }
    reply.Data = string(bytes)
    reply.Encoding = args.Encoding
    return nil
}
```

### API

Bir VM aynı zamanda statik olmayan bir HTTP API'sine sahip olabilir; bu, istemcilerin blockchain'in durumunu sorgulamasına ve güncellemesine olanak tanır.

`Service`'in bildirimi:

```go title="/timestampvm/service.go"
// Service, bu VM için API servisidir
type Service struct{ vm *VM }
```

Bu yapının, durumu sorgulamak ve güncelleyebilmesi için bir referansı vardır.

Bu VM'nin API'si iki metoda sahiptir. Birisi bir istemcinin bir bloğu ID'si ile almasına olanak tanırken, diğeri istemcinin bu blockchain'in bir sonraki bloğunu önermesine olanak tanır. Uç noktadaki blockchain ID'si değişir, çünkü her blockchain'in kendine ait benzersiz bir ID'si vardır.

#### timestampvm.getBlock

Bir bloğu ID'si ile alın. Eğer bir ID verilmemişse, en son bloğu alır.

**İmza**

```sh
timestampvm.getBlock({id: string}) ->
    {
        id: string,
        data: string,
        timestamp: int,
        parentID: string
    }
```

- `id`, alınan bloğun ID'sidir. Eğer argümanlardan çıkarılırsa, en son bloğu alır.
- `data`, bloğun 32 byte yükünün base 58 (checksum ile) temsilidir.
- `timestamp`, bu bloğun oluşturulduğu Unix zaman damgasıdır.
- `parentID`, bloğun ebeveynidir.

**Örnek Çağrı**

```bash
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "timestampvm.getBlock",
    "params":{
        "id":"xqQV1jDnCXDxhfnNT7tDBcXeoH2jC3Hh7Pyv4GXE1z1hfup5K"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/sw813hGSWH8pdU9uzaYy9fCtYFfY7AjDd2c9rm64SbApnvjmk
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "timestamp": "1581717416",
    "data": "11111111111111111111111111111111LpoYY",
    "id": "xqQV1jDnCXDxhfnNT7tDBcXeoH2jC3Hh7Pyv4GXE1z1hfup5K",
    "parentID": "22XLgiM5dfCwTY9iZnVk8ZPuPe3aSrdVr5Dfrbxd3ejpJd7oef"
  },
  "id": 1
}
```

**Uygulama**

```go title="/timestampvm/service.go"
// GetBlockArgs, GetBlock için argümanlardır
type GetBlockArgs struct {
	// Alınan bloğun ID'si.
	// Eğer boş bırakılırsa, en son bloğu alır.
	ID *ids.ID `json:"id"`
}

// GetBlockReply, GetBlock'dan dönen yanıttır
type GetBlockReply struct {
	Timestamp json.Uint64 `json:"timestamp"` // En son bloğun zaman damgası
	Data      string      `json:"data"`      // En son bloktaki veri. 5 byte'ın base 58 temsilidir.
	ID        ids.ID      `json:"id"`        // En son bloğun ID'sinin string temsilidir
	ParentID  ids.ID      `json:"parentID"`  // En son bloğun ebeveyninin ID'sinin string temsilidir
}

// GetBlock, [args.ID]'nin ID'sine sahip olan bloğu alır
// Eğer [args.ID] boşsa, en son bloğu alır
func (s *Service) GetBlock(_ *http.Request, args *GetBlockArgs, reply *GetBlockReply) error {
	// Eğer bir ID verilmişse, string temsilini ids.ID'ye parse eder
	// Eğer hiç ID verilmemişse, ID son kabul edilen bloğun ID'si olur
	var (
		id  ids.ID
		err error
	)

	if args.ID == nil {
		id, err = s.vm.state.GetLastAccepted()
		if err != nil {
			return errCannotGetLastAccepted
		}
	} else {
		id = *args.ID
	}

	// Veritabanından bloğu al
	block, err := s.vm.getBlock(id)
	if err != nil {
		return errNoSuchBlock
	}

	// Yanıtı bloğun verileri ile doldur
	reply.ID = block.ID()
	reply.Timestamp = json.Uint64(block.Timestamp().Unix())
	reply.ParentID = block.Parent()
	data := block.Data()
	reply.Data, err = formatting.EncodeWithChecksum(formatting.CB58, data[:])

	return err
}
```

#### timestampvm.proposeBlock

Bu blockchain'de bir sonraki bloğu öner.

**İmza**

```sh
timestampvm.proposeBlock({data: string}) -> {success: bool}
```

- `data`, önerilen bloğun 32 byte yükünün base 58 (checksum ile) temsilidir.

**Örnek Çağrı**

```bash
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "timestampvm.proposeBlock",
    "params":{
        "data":"SkB92YpWm4Q2iPnLGCuDPZPgUQMxajqQQuz91oi3xD984f8r"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/sw813hGSWH8pdU9uzaYy9fCtYFfY7AjDd2c9rm64SbApnvjmk
```

**Örnek Yanıt**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "Success": true
  },
  "id": 1
}
```

**Uygulama**

```go title="/timestampvm/service.go"
// ProposeBlockArgs, ProposeValue için argümanlardır
type ProposeBlockArgs struct {
    // Yeni blok için veri. 32 byte'ın base 58 kodlaması (checksum ile) olmalıdır.
    Data string
}

// ProposeBlockReply, ProposeBlock fonksiyonunun yanıtıdır
type ProposeBlockReply struct{
    // İşlem başarılıysa true
    Success bool
}

// ProposeBlock, [args].Data'nın verisine sahip yeni bir bloğu önermek için bir API metodudur.
// [args].Data, 32 byte uzunluğundaki bir dizinin string temsilidir.
func (s *Service) ProposeBlock(_ *http.Request, args *ProposeBlockArgs, reply *ProposeBlockReply) error {
	bytes, err := formatting.Decode(formatting.CB58, args.Data)
	if err != nil || len(bytes) != dataLen {
		return errBadData
	}

	var data [dataLen]byte         // Veriyi byte dizisi olarak sakla
	copy(data[:], bytes[:dataLen]) // dataSlice'daki byte'ları data'ya kopyala

	s.vm.proposeBlock(data)
	reply.Success = true
	return nil
}
```

### Eklenti

Bu VM'yi `go-plugin` ile uyumlu hale getirmek için bir `main` paketi ve metodunu tanımlamamız gerekiyor. Bu, Camino-Node'un metodlarını çağırmasına olanak tanıyan gRPC üzerinden VM'mizi sunar.

`main.go` dosyasının içeriği:

```go title="/main/main.go"
func main() {
    log.Root().SetHandler(log.LvlFilterHandler(log.LvlDebug, log.StreamHandler(os.Stderr, log.TerminalFormat())))
    plugin.Serve(&plugin.ServeConfig{
        HandshakeConfig: rpcchainvm.Handshake,
        Plugins: map[string]plugin.Plugin{
            "vm": rpcchainvm.New(&timestampvm.VM{}),
        },

        // Burada bir değer olması, bu eklenti için gRPC sunumu sağlar...
        GRPCServer: plugin.DefaultGRPCServer,
    })
}
```

Artık Camino-Node'un `rpcchainvm`'si bu eklentiye bağlanabilir ve metodlarını çağırabilir.

### Çalıştırılabilir İkili

Bu VM'nin  vardır ve bu, çalıştırıldığında yukarıdaki `main` metodunu çalıştıran bir çalıştırılabilir oluşturur.

Çalıştırılabilirin yolu ve adı, derleme betiğine bağımsız olarak belirtilir. Örneğin:

```text
./scripts/build.sh ../caminogo/build/plugins timestampvm
```

Hiçbir argüman verilmezse, yol varsayılan bir binary ile adlandırılır: `$GOPATH/src/github.com/chain4travel/camino-node/build/plugins/tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH`

Bu isim, VM'nin CB58 kodlanmış 32 byte tanımlayıcısıdır. TimestampVM için, bu dize "timestampvm" ifadesinin 32 byte dizide sıfırla doldurulmuş hali olup, CB58 ile kodlanmıştır.

### VM Takma Adları

Her VM'nin önceden tanımlanmış, statik bir ID'si vardır. Örneğin, TimestampVM'nin varsayılan ID'si: `tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH`dir.

Bu ID'ler için bir takma ad vermek mümkündür. Örneğin, `TimestampVM`'yi takma adlandırmak için `~/.caminogo/configs/vms/aliases.json` dizininde bir JSON dosyası oluşturulabilir:

```json
{
  "tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH": [
    "timestampvm",
    "timestamp"
  ]
}
```

### Bir VM'nin Kurulumu

Camino-Node, eklentileri  arar ve kaydeder.

Sanala makineyi düğümünüze kurmak için, oluşturulan sanal makine binary'sini bu dizine taşımanız gerekir. Sanal makine çalıştırılabilir adları ya tam sanal makine ID'si (CB58 kodlaması ile), ya da bir VM takma adı olmalıdır.

Binary'i eklenti dizinine kopyalayın.

```bash
cp -n  $GOPATH/src/github.com/chain4travel/camino-node/build/plugins/
```

#### Düğüm henüz çalışmıyor

Eğer düğümünüz henüz çalışmıyorsa, düğümü başlatarak tüm sanal makineleri `plugin` dizininiz altına yükleyebilirsiniz.

#### Düğüm zaten çalışıyor

Binary'i `loadVMs` API'si ile yükleyin.

```bash
curl -sX POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"admin.loadVMs",
    "params" :{}
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/admin
```

`loadVMs` yanıtının yeni yüklenen sanal makineyi `tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH` içerdiğini onaylayın. Bu sanal makineyi yanıtın içinde göreceksiniz; bu yanıt daha önce yüklenmemiş olan diğer sanal makinelerle birlikte dönecektir.

```json
{
  "jsonrpc": "2.0",
  "result": {
    "newVMs": {
      "tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH": [
        "timestampvm",
        "timestamp"
      ],
      "spdxUxVJQbX85MGxMHbKw1sHxMnSqJ3QBzDyDYEP3h6TLuxqQ": []
    }
  },
  "id": 1
}
```

Artık bu VM'nin statik API'sine, uç noktalar `/ext/vm/timestampvm` ve `/ext/vm/timestamp` ile erişilebilir. VM yapılandırmaları hakkında daha fazla bilgi için  bakabilirsiniz.

Bu öğreticinin sonunda, süreci basitleştirmek için çalıştırılabilir adının VM'nin ID'si olarak kullanıldığı unutulmamalıdır. Ancak, Camino-Node ayrıca önceki adımda kayıtlı takma adlar olan `timestampvm` veya `timestamp` değerlerini de kabul eder.

## Sonuç

İşte bu kadar! Bu, blockchain tabanlı bir zaman damgası sunucusunu tanımlayan bir VM'nin tamamı uygulamasıdır.

Bu öğreticide, şunları öğrendik:

- Tüm VM'lerin uygulaması gereken `block.ChainVM` arayüzü
- Tüm blokların uygulaması gereken `snowman.Block` arayüzü
- Blok zincirlerinin kendi süreçlerinde çalışmasına olanak tanıyan `rpcchainvm` türü.
- `block.ChainVM` ve `snowman.Block` için gerçek bir uygulama.