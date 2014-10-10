var seneca = require('seneca')();
var http = require('http');


seneca.add('role:foo,cmd:bar',function(args,done){
	
  /* 
   * https://dandelion.eu/products/datatxt/nex/demo/?text=The+Mona+Lisa+is+a+16th+century+oil+painting+created+by+Leonardo.+It%27s+held+at+the+Louvre+in+Paris.&lang=auto&min_confidence=0.6&exec=true#results
   * 
   * */	
	
  http.get("http://www.cuisineaz.com", function(res) {
	  console.log("Got response: " + res.statusCode+"   args:"+args.q);
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
  
	
  done(null,{bar:args.q+'b ok'})
  
})

seneca.add('role:foo,cmd:qaz',function(args,done){
  done(null,{qaz:args.zoo+' zaaa'})
})


seneca.act('role:web',{use:{
  prefix:'/foo',
  pin:{role:'foo',cmd:'*'},
  map:{
    zig: true,
    bar: {GET:true},
    qaz: {GET:true,HEAD:true}
  }
}})

seneca.listen()


var connect = require('connect')
var app = connect()
app.use( connect.query() )
app.use( seneca.export('web') )
app.listen(3000)

// run: node test/example.js --seneca.log=type:act
// try http://localhost:3000/foo/bar?zoo=a
// returns {"bar":"ab"}
