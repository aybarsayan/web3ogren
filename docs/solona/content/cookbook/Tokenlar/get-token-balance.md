---
title: Bir token hesabının bakiyesini nasıl alırsınız
sidebarSortOrder: 5
description:
  "Tek bir çağrı ile hızlıca bir Solana token hesabının bakiyesini nasıl alacağınızı öğrenin. Hem TypeScript hem de Rust'ta kod örneklerini içerir."
---

Token hesabı, tek bir çağrı ile alınabilen token bakiyesine sahiptir.

```typescript filename="get-token-balance.ts"
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

(async () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const tokenAccount = new PublicKey(
    "FWZedVtyKQtP4CXhT7XDnLidRADrJknmZGA2qNjpTPg8",
  );

  let tokenAmount = await connection.getTokenAccountBalance(tokenAccount);
  console.log(`amount: ${tokenAmount.value.amount}`);
  console.log(`decimals: ${tokenAmount.value.decimals}`);
})();
```

```rust filename="get-token-balance.rs"
use solana_client::rpc_client::RpcClient;
use solana_program::pubkey::Pubkey;
use solana_sdk::commitment_config::CommitmentConfig;
use std::str::FromStr;

fn main() {
    let rpc_url = String::from("https://api.devnet.solana.com");
    let connection = RpcClient::new_with_commitment(rpc_url, CommitmentConfig::confirmed());

    let token_account = Pubkey::from_str("FWZedVtyKQtP4CXhT7XDnLidRADrJknmZGA2qNjpTPg8").unwrap();
    let balance = connection
        .get_token_account_balance(&token_account)
        .unwrap();

    println!("amount: {}, decimals: {}", balance.amount, balance.decimals);
}
```

> **Bilgilendirme:** 
> Bir token hesabı yalnızca bir tür mint tutabilir. **Bir token hesabı belirttiğinizde, aynı zamanda bir mint de belirtirsiniz.** 

:::tip
Token bakiyesini almak için `getTokenAccountBalance` yöntemini kullanarak hesabın bilgilerine erişebilirsiniz.
:::

---

### Önemli Bilgiler

- **Token hesabı bilgilerinin doğruluğu, belirttiğiniz `PublicKey` ile doğrudan ilişkilidir.**
- Bir token hesabının bakiyesi, mint'e göre düzenlenmiştir.

:::warning
Herhangi bir hata yapmamak için, **token hesabınıza ait `PublicKey`'yi doğru girdiğinizden emin olun.**
:::

:::note
Solana ağı, farklı mint türleri destekler; bu nedenle daha fazla bilgi edinmek için [Solana dokümantasyonunu](https://docs.solana.com/) incelemeniz önerilir.
::: 


Detaylı Bilgi

Token hesabı, Solana ekosisteminde kullanıcıların belirli bir mint ile ilişkili token'ları tutmasına olanak tanır. Her token hesabı için yalnızca bir mint türü tanımlanabilir. Bu, kullanıcıların farklı mint'lere ait varlıklarını yönetmelerini kolaylaştırır.

