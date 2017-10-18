/*
  CONGRATULATIONS on creating your first Botpress bot!

  This is the programmatic entry point of your bot.
  Your bot's logic resides here.
  
  Here's the next steps for you:
  1. Read this file to understand how this simple bot works
  2. Read the `content.yml` file to understand how messages are sent
  3. Install a connector module (Facebook Messenger and/or Slack)
  4. Customize your bot!

  Happy bot building!

  The Botpress Team
  ----
  Getting Started (Youtube Video): https://www.youtube.com/watch?v=HTpUmDz9kRY
  Documentation: https://botpress.io/docs
  Our Slack Community: https://slack.botpress.io
*/

var util = require('util');
var http = require('http-request');

module.exports = function (bp) {

  // Listens for a first message (this is a Regex)
  // GET_STARTED is the first message you get on Facebook Messenger
  bp.hear(/GET_STARTED|hello|hi|test|hey|holla/i, (event, next) => {

    event.reply('#welcome') // See the file `content.yml` to see the block
  })

  bp.hear(/catalog|service/i, (event, next) => {
    http.get('http://localhost:8005/v2/catalog', function (err, res) {
      if (err) {
        console.error(err);
        return;
      }
      var service = util.inspect(JSON.parse(res.buffer).services[0])
      console.log('Service object is:', service)
    });

    event.reply('#catalog')
  })

  bp.hear(/create instance|create serviceinstance/i, (event, next) => {
    var planId = ''

    http.get('http://localhost:8005/v2/catalog', function (err, res) {
      if (err) {
        console.error(err);
        return;
      }
      var service = util.inspect(JSON.parse(res.buffer).services[0])
      for (plan in service.plans) {
        if (plan.name === 'silver') {
          planId = plan.id
        }
      }
    });

    var body = JSON.stringify({'plan_id': planId})
    http.put({
      url: 'http://localhost:8005/v2/service_instances/123',
      reqBody: new Buffer(body),
      headers: {
        'content-type': 'application/json'
      }
    }, function (err, res) {
      if (err) {
        console.error(err);
        return;
      }
      
      console.log(res.code, res.buffer.toString());
    });

    event.reply('#create_instance')
  })

  bp.hear(/delete instance|delete serviceinstance/i, (event, next) => {
    http.delete('http://localhost:8005/v2/service_instances/123', function (err, res) {
      if (err) {
        console.error(err);
        return;
      }
      
      console.log(res.code, res.buffer.toString());
    });

    event.reply('#delete_instance')
  })

  bp.hear(/bind instance|bind serviceinstance/i, (event, next) => {
    http.put({
      url: 'http://localhost:8005/v2/service_instances/123/service_bindings/1',
      reqBody: new Buffer(''),
      headers: {
        'content-type': 'application/json'
      }
    }, function (err, res) {
      if (err) {
        console.error(err);
        return;
      }
      
      console.log(res.code, res.buffer.toString());
    });

    event.reply('#bind_instance')
  })

  bp.hear(/unbind instance|unbind serviceinstance/i, (event, next) => {
    http.delete('http://localhost:8005/v2/service_instances/123/service_bindings/1', function (err, res) {
      if (err) {
        console.error(err);
        return;
      }
      
      console.log(res.code, res.buffer.toString());
    });

    event.reply('#delete_instance')
  })

  // Say good-bye!
  bp.hear({
    type: /message|text/i,
    text: /exit|bye|goodbye|quit|done|leave|stop/i
  }, (event, next) => {
    event.reply('#goodbye', {
      // You can pass data to the UMM bloc!
      reason: 'unknown'
    })
  })
}
