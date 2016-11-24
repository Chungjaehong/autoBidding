	fs = require('fs');

	content = "";

    //파일쓰기------------------------
    writeFile = function(content,filepathCustom){
        var filepath = "./";
        filepath = filepath + filepathCustom;

        fs.writeFile(filepath, content, function (err) {
            if(err){
                console.log(err);
                return;
            }

        }); 
    }

    ////파일읽기------------------------
    readFile = function(filepathCustom,actionName){
        var filepath = "./";
        filepath = filepath + filepathCustom; 
        
        fs.readFile(filepath, 'utf-8', function (err, data) {
            if(err){
                console.log(err);
                return;
            }
            
            if(actionName == "myInfo"){
                var txtData = data.split(/\r\n/g);
                g_licenseKey=txtData[0].replace(/(^\s*)|(\s*$)/gi, "");
	            g_secretKey= txtData[1].replace(/(^\s*)|(\s*$)/gi, "");
	            g_customerId= txtData[2].replace(/(^\s*)|(\s*$)/gi, "");
                //campArData = JSON.parse(data)
                //usergrid.setList(JSON.parse(data), null, "reload");
            }
            
            if(actionName == "usergrid"){
                campArData = JSON.parse(data);
                usergrid.setList(JSON.parse(data), null, "reload");
            }

        });
    }
