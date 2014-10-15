var seneca = require('seneca')();
var http = require('http');
var https = require('https');

var app_id="6cc86462";
var app_key="8b5d542992886977103ac6987daf16a9";

/* 
* http://localhost:3000/v1/request?q=jjj

* https://api.dandelion.eu/datatxt/nex/v1/?min_confidence=0.1&social.parse_hashtag=False&text=The+Mona+Lisa+is+a+16th+century+oil+painting+created+by+Leonardo.+It%27s+held+at+the+Louvre+in+Paris.&include=image%2Cabstract%2Ctypes%2Ccategories%2Clod&country=-1&$app_id=YOUR_APP_ID&$app_key=YOUR_APP_KEY

* https://api.dandelion.eu/datatxt/nex/v1/?min_confidence=0.1&social.parse_hashtag=False&text=500+g+de+penne%0D%0A50+g+de+tomates+s%C3%A9ch%C3%A9es%0D%0A1+cube+de+bouillon+de+l%C3%A9gumes%0D%0A2+c.+%C3%A0+soupe+de+vinaigre+balsamique%0D%0APour+le+pesto+%3A%0D%0A12+feuilles+de+basilic%0D%0A20+g+de+pignons+de+pin%0D%0A20+g+de+parmesan+r%C3%A2p%C3%A9%0D%0A1+gousse+d%27ail%0D%0A8+c.+%C3%A0+soupe+d%27huile+d%27olive%0D%0Aolives+violettes%0D%0Asel%2C+poivre&include=image%2Cabstract%2Ctypes%2Ccategories%2Clod&country=-1&$app_id=6cc86462&$app_key=8b5d542992886977103ac6987daf16a9
* */	
   
seneca.add('role:v1,cmd:request',function(args,done){

  var url_dandelion = "https://api.dandelion.eu/datatxt/nex/v1/?min_confidence=0.1&social.parse_hashtag=False&text=classement%20"+args.q+"&include=image%2Cabstract%2Ctypes%2Ccategories%2Clod&country=-1&$app_id="+app_id+"&$app_key="+app_key;
  //var url_dandelion = "https://api.dandelion.eu/datatxt/nex/v1/?min_confidence=0.1&social.parse_hashtag=False&text=tennis&include=image%2Cabstract%2Ctypes%2Ccategories%2Clod&country=-1&$app_id=6cc86462&$app_key=8b5d542992886977103ac6987daf16a9";
	
  https.get(url_dandelion, function(res) {
	  
	  //console.log("Got response: " + res.statusCode);
	  //console.log("res: ",res);	  
	  
	  var body = '';

      res.on('data', function(chunk) {
        body += chunk;
      });

      res.on('end', function() {
        var json = JSON.parse(body);
		var string = "";
        //console.log("Got json: ", json);
		var string2 = body;
		
		for(var attr1 in json){
		  //console.log(':::: '+attr1+": "+json[attr1]);
		  
		  if (attr1==="annotations") {
		  
			var tab = json[attr1];
			
			for(var attr2 in tab){
			  console.log("On identifie : "+tab[attr2].uri);
			  //string += "  " + tab[attr2].uri;
			  string += "  " + tab[attr2].lod.dbpedia;
			}
			
		  }
		  
		}
		
		
		done(null,{request:args.q+' : '+string,json:body});
		
      });	  

	  //console.log("body: ",body);
	  
	  //TODO: si la requete n' existe pas
	  
	  	//TODO: on fait req json dandelion
	  
	  	//TODO : on interroge en SPARQL
	  
	  	//TODO : on stocke la requete
	  
	  //TODO: si existe , on sort la requete
	  
	  
	  
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	  done(null,{request:'error'});
	});
    
})

seneca.act('role:web',{use:{
  prefix:'/v1',
  pin:{role:'v1',cmd:'*'},
  map:{
    zig: true,
    bar: {GET:true},
    request: {GET:true},	
    qaz: {GET:true,HEAD:true}
  }
}})

seneca.listen()


var connect = require('connect')
var app = connect()
app.use( connect.query() )
app.use( seneca.export('web') )
app.listen(3000)


/*
{
start: 220,
end: 225,
spot: "soupe",
confidence: 0.7866,
id: 2716,
title: "Soupe",
uri: "http://fr.wikipedia.org/wiki/Soupe",
abstract: "La soupe, ou potage, est un aliment liquide, froid ou chaud, qui est généralement servi au début du repas. La plupart des soupes traditionnelles sont composées de légumes cuits, auxquels on ajoute parfois diverses viandes ou poissons et matières grasses (lard, beurre, huile, crème fraîche…) et même des fruits. Il existe une grande variété de soupes dans la gastronomie mondiale.",
label: "Soupe",
categories: [
"Soupe"
],
types: [ ],
image: {
full: "https://upload.wikimedia.org/wikipedia/commons/a/ab/William-Adolphe_Bouguereau_(1825-1905)_-_Soup_(1865).jpg",
thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/William-Adolphe_Bouguereau_(1825-1905)_-_Soup_(1865).jpg/200px-William-Adolphe_Bouguereau_(1825-1905)_-_Soup_(1865).jpg"
},
lod: {
wikipedia: "http://fr.wikipedia.org/wiki/Soupe",
dbpedia: "http://fr.dbpedia.org/resource/Soupe"
}
}
*/

