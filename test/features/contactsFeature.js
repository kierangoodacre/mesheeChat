// describe("Contacts", function() {

//   it('should display a list of contacts', function() {
//     casper.start('http://localhost:3001/contacts');
//     casper.then(function() {
//       expect('#contact-name').to.contain.text('clint');
//     });
//   });

//   it('should enable creation of contacts', function() {
//     casper.start('http://localhost:3001/newcontact');
//       casper.then(function() {

//         this.fill('form[id="add-user"]',{
//           user: 'Jake',
//           ip: ''
//         }, true);

//         this.click('input[id="join"]');
//           setTimeout(function() {
//             expect('body').to.contain.text('Clint');
//           }
//         }, 1000);
//       });
//     });
//   });

// });