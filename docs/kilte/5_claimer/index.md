---
id: claimer
title: Claimer 🦸‍♂️
---
# Claimer 

In this section, we will execute the Claimer individual's actions. 🚀

![Alt text](../../../static/img/kilt/claim.png)

:::info 🤔 Claimer? What's that? 🤔

- A Claimer is an individual or institution that makes a claim or statement about their identity or abilities. 🗣️ They can use their identity credentials to prove these claims, and third-party institutions can verify these credentials. 💪

- Anyone can be a Claimer! 🙌 All you need to do is complete a Ctype and create a claim. Then, you can send these claims to Attesters for verification. 📝🔒

- Claimers are the heroes of the Self-Sovereign Identity system! 🦸‍♀️ They have full control over their data and decide for themselves which pieces of data to share, where, and how. 🛡️🔐

- They store their identity credentials in their digital wallets, so they decide which information to provide to which service. 💼🔏

- You don't need to create a DID on the chain, meaning you are entirely independent! 🆓 Claimers can use their accounts without needing a chain connection. ⛓️🔓
:::

## 🗺️ Roadmap 🗺️

1. **Creating and Reviewing a Private DID:** In the first step, we will create a DID. 🆔 These DIDs will differ slightly from the DIDs we created for Attesters. We will examine them in detail. 🕵️‍♀️
2. **Preparing a Claim, Getting it Verified, and Creating a Credential:** Next, we will create a `Claim`, open a request to verify this claim, and create a `credential` based on the claim. 📜🔏
3. **Delivering the Documents to the Verifier:** We will deliver these documents to the Verifier individual. 🤝

## 📂 File Architecture 📂

We will create the files shown below inside the `Claimer` folder. 📁 These files will give us the perspective of the `Claimer`. 🎥

```bash
└─ kilt-rocks/ # project
  └─ claimer/ # all claimer codes
    ├─ createClaim.ts # creates a claim
    ├─ createPresentation.ts # creates a presentation for the verifiers
    ├─ generateCredential.ts # creates the identity credential object to be sent to the attester
    ├─ generateKeypairs.ts # creates key pairs for the light DID
    └─ generateLightDid.ts # creates a light DID for the claimer
```

:::caution 🚨 Attention! 🚨
Let's become a Claimer! 🎉🙌 
:::