---
id: attester
title: Attester 🛡️
---
# Attester

Under this heading, we will learn about the operations that the attester individual will perform.

![alternative text](../../../static/img/kilt/attester.gif "Welcome")

1. **Creating a Payment Account:** First, we will create an account to make payments for attestation transactions. 💳
2. **Creating a DID Identity:** In the second step, we will create a DID. This DID will be our identity used for attestation transactions. 🆔

:::tip DID and Accounts are not Directly Connected! 
On the chain, we can perform deposit and transaction fees with a different wallet address, but since our DID is our source of trust, this address will remain constant.
:::

3. **Defining CTYPE:** Before we start attesting, we will need a CTYPE that specifies what and how we will attest. 📋
4. **Starting Attestation Transactions:** After determining a payment method for transaction fees and deposits and finding a suitable CTYPE, we can start attestation transactions. 🚀

## File Architecture 🗂️

Below, you can see the files that can be added inside the attester folder. Each file represents a different Attester function.

```bash
└─ kilt-rocks/ # project folder 📁
  └─ attester/ # all attester codes 👩‍💻👨‍💻
     ├─ attestCredential.ts # code to approve attestations ✅
     ├─ ctypeSchema.ts # creating a CTYPE schema locally 📑
     ├─ generateAccount.ts # creating an attester account and DID 🌐
     ├─ generateCtype.ts # saving the CTYPE to the chain 📊
     ├─ generateDid.ts # creating the registered DID of the Attester on the chain 🆔
     └─ generateKeypairs.ts # creating keys for the Attester 🔐
```
