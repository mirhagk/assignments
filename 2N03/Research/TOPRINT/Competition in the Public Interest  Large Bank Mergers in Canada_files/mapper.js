
var txtFile = new XMLHttpRequest();
var mapper = {};
txtFile.open("GET",  "/Common/Parl/js/Map/mapping.txt", true);
txtFile.onreadystatechange = function() {

  if (txtFile.readyState === 4) {  // Makes sure the document is ready to parse.
    if (txtFile.status === 200) {  // Makes sure it's found the file.
 	 allText = txtFile.responseText; 
  	 loadMapper(allText);
	 map();
	 
    }
  }
}
txtFile.send(null);




function loadMapper(data) {
   var i, j, x = data.split('\n');
   for (i = 0; i < x.length; i++) {
      display_column(x[i], 1);
	  	  
   }
}


function display_column(str_line, n) {
var info =str_line.split(',');
  mapper[info[n-1].replace(/^\s+|\s+$/g,"")]=info[n].replace(/^\s+|\s+$/g,"");
 }



function map()
{

var cssMapper={};
cssMapper["ParlHomeLink1"]="Home";
cssMapper["ParlBusinessLink1"]="Parliamentary Business";
cssMapper["ParlSenatorsLink1"]="Senators and Members";
cssMapper["ParlAboutLink1"]="About Parliament";
cssMapper["ParlVisitorsLink1"]="Visitor Information";
cssMapper["ParlEmploymentLink1"]="Employment";
cssMapper["NoStyle"] = "None";
var url=document.URL;

					for (var key in mapper)
					{
					
					   if(url.toLowerCase().indexOf(key.toLowerCase()) !== -1)
					   {
							
							for(var cssKey in cssMapper)
							{
								if(cssMapper[cssKey].toLowerCase()==mapper[key].toLowerCase())
								  {

								      if (cssKey == "ParlHomeLink1") {
								          if ((url.toLowerCase().indexOf('?language=f') != -1) || (url.toLowerCase().indexOf('&language=f') != -1)) {
								              document.getElementById(cssKey).className = "mainLinksActiveHomeFr";
								              break;
								          }
								          else if (url.toLowerCase().indexOf('tpid=3212effa-dd76-4677-8010-99a4d699f914') != -1) {
								              document.getElementById(cssKey).className = "mainLinksActiveHomeFr";
								              break;
								          }
								          else if ((url.toLowerCase().indexOf('-f.htm') != -1) || (url.toLowerCase().indexOf('-f.html') != -1) || (url.toLowerCase().indexOf('-f.asp') != -1)) {
								              document.getElementById(cssKey).className = "mainLinksActiveHomeFr";
								              break;
								          }
								          else {
								              document.getElementById(cssKey).className = "mainLinksActiveHome";
								              break;
								          }
								      }
								      else if (cssKey == "ParlEmploymentLink1") {
								          if ((url.toLowerCase().indexOf('?language=f') != -1) || (url.toLowerCase().indexOf('&language=f') != -1)) {

								              document.getElementById(cssKey).className = "mainLinksActiveEmploymentFr";
								              break;
								          }
								          else if (url.toLowerCase().indexOf('tpid=3212effa-dd76-4677-8010-99a4d699f914') != -1) {
								              document.getElementById(cssKey).className = "mainLinksActiveEmploymentFr";
								              break;
								          }
								          else if ((url.toLowerCase().indexOf('-f.htm') != -1) || (url.toLowerCase().indexOf('-f.html') != -1) || (url.toLowerCase().indexOf('-f.asp') != -1)) {
								              document.getElementById(cssKey).className = "mainLinksActiveEmploymentFr";
								              break;
								          }
								          else {
								              document.getElementById(cssKey).className = "mainLinksActiveEmployment";
								              break;
								          }

								      }
								      else if (cssKey == "NoStyle") {
								      break;
								      }
								      else {

								          document.getElementById(cssKey).className = "mainLinksActive";
								          break;
								      }
								
								  }

							 }
							break;
					   }
					}
}
