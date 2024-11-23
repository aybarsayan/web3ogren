# ZCFMint Objesi

**** tarafından dijital varlıklar ihraç etmek için kullanılan bir nesnedir. **** nesnesine oldukça benzer, ancak daha sınırlı bir yöntem setine sahiptir.

**ZCFMints**, **Zoe Contract Facet'in** **** metodu ile oluşturulur ve döndürülür.

## aZCFMint.getIssuerRecord()

- **Döndürülen:** **IssuerRecord**

**zcfMint** ile ilişkili **** ve **** içeren bir **IssuerRecord** döndürür.

## aZCFMint.mintGains(gains, zcfSeat?)

- **gains:** ****
- **zcfSeat:** **** - Opsiyonel.
- **Döndürülen:** **ZCFSeat**

_gains_ içindeki tüm **miktarlar** bu **ZCFMint**'in ****'ına ait olmalı ve _gains_'in ****, _zcfSeat_'in katıldığı sözleşme örneği tarafından tanımlanmış olmalıdır. _zcfSeat_ sağlanmazsa, yeni bir **koltuk** kullanılır. _gains_ **Miktar**'ını varlıklar olarak ihraç eder ve bunları _zcfSeat_'in ****'na ekler, ardından _zcfSeat_'i döndürür.

## aZCFMint.burnLosses(losses, zcfSeat)

- **losses:** ****
- **zcfSeat:** ****
- **Döndürülen:** Yok

_losses_ içindeki tüm **miktarlar** bu **ZCFMint**'in ****'ına ait olmalı ve _losses_'in ****, _zcfSeat_'in katıldığı sözleşme örneği tarafından tanımlanmış olmalıdır. _losses_ miktarını _zcfSeat_'in ****'ndan çıkarır ve ardından bu sözleşme örneği için Zoe tarafından güvence altına alınan varlıklardan bu **miktarı** yakar.