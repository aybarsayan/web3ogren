# Setup 🛠️

## Node.js 🟩

Node.js allows us to run JavaScript code locally. We need Node.js to run the KILT SDK code in our project locally! 🏃‍♀️

📥 Download Node.js [here](https://nodejs.org/en). Version 16.0 and above will do the job.

## Requirements 📋

Please create a new folder and name it `kilt-rocks`. 📂 Here, we will install the libraries:

- KILT SDK-JS 🌐 - For KILT operations
- dotenv 🔒 - To store secret information
- ts-node and TypeScript 🛡️ - To run TypeScript code

---
:::caution 🚨 Where Did TypeScript Come From?
TypeScript is like a big brother to JavaScript. It adds type safety and is developed by Microsoft. 🖥️ If you know JavaScript, you'll get used to TypeScript quickly! 🚀 For more about TypeScript you can check [this](https://www.typescriptlang.org/).

![alternative text](../../static/img/kilt/jsvsts.png "Overview")
:::

:::note 📝
We will use basic TypeScript in the project, so don't be afraid!
:::

---

## Package Installation 📦

You should run the following codes in the terminal. 🖥️

```javascript
npm init -y //🎉 Automatically creates a 'package.json' file.
npm install @kiltprotocol/sdk-js dotenv typescript ts-node //📦 Installs KILT SDK, dotenv, and TypeScript.
```

## Setting Up Project Folders 📁

Your folder structure should look like this:

```bash
└─ kilt-rocks/ # project folder
	├─ node_modules 
    ├─ attester/ # folder where all attester codes are located
    ├─ claimer/ # folder where all claimer codes are located
    ├─ verify.ts # all verifier codes
    ├─ .env # environment variables and secret info file
    ├─ package.json # automatically generated file 
    └─ yarn.lock # automatically generated file 2
```

## PILT Tokens 🪙

We will use the Peregrine Testnet, so we need PILT tokens. We can get them for free, so don't worry! 💦

## Blockchain Connection 🌐

We need to set up the SDK for the blockchain connection. We will connect to the Peregrine Testnet with the `Kilt.connect(address)` code. 🤝 

Add the extension for the Peregrine network to the `.env` file:

```dotenv title="dotenv"
WSS_ADDRESS=wss://peregrine.kilt.io
```

All settings are complete! 🎉 Now we can start! 🚀