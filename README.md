# mesheeChat

## Cryptography

### Motivation

"What if you could communicate with anyone, anywhere, without going over an inch of corporate or government cable?"

Meshed network vs Internet Service Provider (ISP)

1. Centralised authority control-freed
2. Robustness in natural disaster
3. Politically free
4. No more monitoring from oppresive regimes

### Security

*Resources*
* [ChatSafe]
* [FireChat]
* [Encrypted Chat]
* [Cryptocat]

[ChatSafe]: https://github.com/DavidTimms/ChatSafe
[FireChat]: https://firechat.firebaseapp.com
[Encrypted Chat]: http://www.pubnub.com/blog/sending-encrypted-chat-messages-tutorial/
[Cryptocat]: https://github.com/cryptocat/cryptocat/

Maybe a chat room structure is better than a p2p encryption?
Chat rooms only allow people with the key to access.
Other people cannot access the chat room unless they have got the key.

### Two types of security

1. A communication channel that the server don't allow outsider to see.
2. A communication channel that the server itself cannot see.

*Resources*
* [Private Socket room]
* [Candy]

[Private Socket room]: https://www.npmjs.com/package/innkeeper-socket.io
[Candy]: https://candy-chat.github.io/candy/

### Settlement

Since we would like the government to have no way to decipher the message, we want that even the server cannot see the content. HTTPS may do the trick, but it is too complex to start working on that. A simpler approach is to find a Node way of encrypting chat messages. And this, has lead us to [Cryptalk]. This is a npm that only allow messaging when all party in the chatroom have the key.

[Cryptalk]: https://www.npmjs.com/package/cryptalk

At one stage, we almost used [FreeStep], but then we realised that the code is maintained by only one single developer, and there are parts missing in the documentation (gitignored ssl folder), which forced us to look into other modules and eventually selected Cryptalk as our settlement.

[FreeStep]: https://freestep.net

### Cryptalk Reverse Engineering

The core module in the Cryptalk is [cryptojs]

[cryptojs]: http://cryptojs.altervista.org/api/#.VO4Oy8bHJRE

A glimpse of what this module does can be seen from my [Cryptography] repository.
This uses Advanced Encryption Standard (AES) for encryption, and can be how we implement the security layer of Meshee.

[Cryptography]: https://github.com/jindai1783/Cryptography

### Secure Chat

A simple integration of Socket.io chat with client-side encryption can be find at the repository [Secure Chat]. It uses AES encrytion, and only when the cipher key and decipher key matches you can see the message, otherwise you will only see 'null'.

[Secure Chat]: https://github.com/jindai1783/Secure_Chat

### Glossary

* Ad hoc networking: a system of network elements that combine to form a network requiring little or no planning.
* NSA: National Security Agent
