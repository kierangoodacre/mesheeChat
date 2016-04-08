![meshee logo]
(https://github.com/kierangoodacre/mesheeChat/blob/master/logo.png)

# mesheeChat

### Motivation

All around the world internet freedoms are being eroded by governments, restricting communications. For example, in Venezuala in 2014 the internet was turned off and modes of communcation were blocked. We wanted to create a secure, decentralised communications network that would enable secure conversations to take place without the internet.

mesheeChat is a 2 week project which uses the mesh networking tool CJDNS in combination with Node.js to provide secure chat over a mesh network. We prototyped the network using Raspberry Pis and tested using Mocha and Webdriver.io.

##Why?

Meshed network vs Internet Service Provider (ISP)

1. Centralised authority control-freed 
2. Robustness in natural disaster
3. Politically free
4. No more monitoring from oppresive regimes

##Process

Firstly, since we only had two weeks to build the project, we had to narrow down how we were going to provide communications without the internet. 

We settled on mesh networking to provide this functionaltiy. Mesh networking enables data trasfer throughout a network whereby each device in the network is connected to all others. 

We decided to use CJDNS to provide this functionality becaise a) it is decentralised, b) it provides secure data transfer and c) it is the most widely adopted secure mesh tool.

Secondly, we wanted to be able to prototype how the network would work and we wanted a network which we could control in a test environment. We used Raspberry Pis to emulate the network. Each Pi was running CJDNS which enabled each Pi to connect to the other via WIFI.

Then we wanted users on the network to communicate. We selected Node.js as its async nature means that a lot of requests are able to be handled by a single node in the mesh network. We then used websockets to push the messages to devices connected to the network.

We tested using Mocha, Chai, Webdriver.io and Should using TDD and BDD throughout the process.

### Security

![meshee logo]
(https://github.com/kierangoodacre/mesheeChat/blob/master/Screen%20Shot%202016-04-08%20at%2018.46.36.png)

##How To Run

In the command line

`git clone https://github.com/kierangoodacre/mesheeChat.git`

`npm install`

`nodemon`



