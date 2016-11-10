	fs = require('fs');

	content = "";

    //파일쓰기------------------------
    writeFile = function(content,filepathCustom){
        var filepath = "C:/";
        filepath = filepath + filepathCustom;

        fs.writeFile(filepath, content, function (err) {
            if(err){
                console.log(err);
                return;
            }

        }); 
    }

    ////파일읽기------------------------
    readFile = function(filepathCustom,gridName){
        var filepath = "C:/";
        filepath = filepath + filepathCustom; 
        
        fs.readFile(filepath, 'utf-8', function (err, data) {
            if(err){
                console.log(err);
                return;
            }
            
            if(gridName == "usergrid"){
                campArData = JSON.parse(data)
                usergrid.setList(JSON.parse(data), null, "reload");
            }

        });
    }
