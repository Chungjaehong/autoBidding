(function(){
	g_licenseKey= "";//라이선스키
	g_secretKey= "";//비밀키

	g_customerId= "";//커스터머 아이디

	campArData = new Array();//바른속기1 바른속기2 --> 계정정보
	grpArData = new Array();//캠페인 안에 그룹   --> 계정정보
	chkVar = new Array();	//선택된 그룹 --> 자동입찰 상위
	keyArData = new Array();//그룹 안에 키워드 --> 자동입찰 하위
	
	groupGridIndex = 0;
	keywordGridIndex = 0;

	clickGridGroupIndex = 0;

	//bidding.js
	biddingFlag = 0;
	rankPickFlag =0;

	ajaxPick = function(pType, pUrl, pQuery,pCallback){
		var baseUrl = "https://api.naver.com";
		var sendUrl = baseUrl + pUrl;	
		var QueryUrl = sendUrl+pQuery

		var timeStamp = new Date().getTime();//타임 스탬프
		var strSign = timeStamp + "." + pType + "."+ pUrl; //암호화 스트링
		
		var hash = CryptoJS.HmacSHA256(strSign, g_secretKey);//비밀키

		var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
		console.log("요청URL>>"+pUrl);
		console.log("쿼리스트링>>>"+pQuery);
		
		console.log("타임스탬프>>>"+timeStamp);
		console.log("암호화 스트링>>>"+strSign);
		console.log("비밀키>>"+g_secretKey);
		console.log("라이선스키>>"+g_licenseKey);
		console.log("암호화 한것>>"+hashInBase64);
		console.log("커스토머아이디>>"+g_customerId);

		$.ajax({
			type: pType,
			dataType: 'json',
			url : QueryUrl,
			async: false,
			beforeSend: function(xhr, settings){
				xhr.setRequestHeader("X-Timestamp", timeStamp);//타임스탬프
				xhr.setRequestHeader("X-API-KEY", g_licenseKey);//라이선스키
				xhr.setRequestHeader("X-Customer", g_customerId);//내 아이디
				xhr.setRequestHeader("X-Signature", hashInBase64);//sha256
			},
			success: pCallback,
			error:function(XMLHttpRequest, textStatus, errorThrows){ // erreur durant la requete
      			alert("ERROR >>"+XMLHttpRequest.responseJSON.title);
      		}
		});
	}

	ajaxBidding = function(pType, pUrl, pQuery, pData,pCallback){
			var rp = require('request-promise');
			
			var baseUrl = "https://api.naver.com";
			var sendUrl = baseUrl + pUrl;	
			var QueryUrl = sendUrl+pQuery

			var timeStamp = new Date().getTime();//타임 스탬프
			var strSign = timeStamp + "." + pType + "."+ pUrl; //암호화 스트링
			
			var hash = CryptoJS.HmacSHA256(strSign, g_secretKey);//비밀키

			var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);	
			
			var options = {
				method: pType,
				"rejectUnauthorized": false,
				uri: QueryUrl,
				headers: {
					'User-Agent': 'User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.113 Electron/1.4.0 Safari/537.36',
					"X-Timestamp": timeStamp,
					"X-API-KEY": g_licenseKey,
					"X-Customer": g_customerId,
					"X-Signature": hashInBase64//sha256
				},
				body:pData,
				json: true // Automatically parses the JSON string in the response 
			};
			
			rp(options)
				.then(pCallback)
				.catch(function (err) {
					alert.log('입찰 에러');
				});
	}





	$("#btnUser").click(function(){//계정 동기화
		progressFunction(30,"계정 동기화");
		//-------------------캠페인 정보---------------
		ajaxPick("GET" , "/ncc/campaigns" , "" , function(data){
			campArData = new Array();

			if(data.length > 0){
				for (var i = 0; i < data.length; i++) {
					if(data[i].campaignTp != "SHOPPING"){
						campArData.push(data[i]);
					}

				}
				//campArData = data;
				grpArData = new Array();//캠페인 안에 그룹   --> 계정정보

				for(var i=0; i < campArData.length ; i++){
					//---------------그룹 정보---------------
					ajaxPick("GET" , "/ncc/adgroups" , "?nccCampaignId=" + campArData[i].nccCampaignId , function(data){
						for(var i=0; i < data.length ; i++){
							grpArData.push(data[i]);
						}
						usergrid.setList(grpArData, null, "reload");
					});
				}
			}
		});

		progressFunction(100,"계정 동기화");
	});

	$("#btnGroup").click(function(){//그룹 동기화 버튼
		//유저정보
		//usrSecret();

		idCheckFunction(function(flag){
			if(!flag){
				return;
			}
			//그룹동기화
			progressFunction(10,"그룹 동기화");

			$("#groupDataMenu").click();
			$(".nav-tabs a").click();
			fnObj.groupGrid.bind();
			fnObj.keywordGrid.bind();

			chkVar =usergrid.getCheckedList(2);
			
			keyArData = new Array();

			for(var i=0; i < chkVar.length ; i++){
				ajaxPick("GET" , "/ncc/keywords" , "?nccAdgroupId=" + chkVar[i].nccAdgroupId + "&recordSize=1000" , function(data){
					chkVar[i].keyCout = data.length;
					for(var j=0; j < data.length ; j++){
						//data[j].NudeKeyword = data[j].managedKeyword.pCPLMaxDepth;
						data[j].nowRank = 0;
						data[j].maxPay = 10000;
						data[j].biddingPay = 100;
						data[j].wantRank = 1;
						data[j].___checked = {"0":true};
						if(data[j].status == "ELIGIBLE"){
							data[j].status = "ON";
						}else{
							data[j].status = "OFF";
						}
					}
					keyArData.push(data);
				});
			}
			groupGrid.setList(chkVar, null, "reload");
			keywordGrid.setList(keyArData[0], null, "reload");
			
			groupGrid.setFocus(groupGridIndex);

			writeFile(JSON.stringify(usergrid.getList()),"usergrid.json");
			
			progressFunction(100,"그룹 동기화");
			pickBizmoney();
		});

	});

	pickBizmoney = function(){//비즈잔액 조회
		ajaxPick("GET" , "/billing/bizmoney" , "" , function(data){
			myBizMoney=numberWithCommas(data.bizmoney);
			$("#myMoney").text("비즈잔액 : "+ myBizMoney +"원");
		});
	}

	 numberWithCommas = function(x) {
	    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	rankpickCallFlag = 0;

	rankPickCallFunction =function(){
		
		chkKeyWordIndex = keywordGrid.getCheckedListWithIndex(0);
		if(chkKeyWordIndex.length > rankpickCallFlag){
			keyArDataIndex =keyArData[groupGridIndex][chkKeyWordIndex[rankpickCallFlag].index];
			//rankPickFunction(encodeURI(keyArDataIndex.keyword) , "www.dainsg.com", chkKeyWordIndex[rankpickCallFlag].index); //Test
			rankPickFunction(keyArDataIndex.keyword,encodeURI(keyArDataIndex.keyword) , chkVar[groupGridIndex].pcChannelKey, chkKeyWordIndex[rankpickCallFlag].index); //Product
			
			rankpickCallFlag++;
		}else{
			clearInterval(timerId);
			if(chkVar.length > groupGridIndex+1){
				groupGridIndex++;
				groupGrid.setFocus(groupGridIndex);
				keywordGrid.setList(keyArData[groupGridIndex], null, "reload");

				rankpickCallFlag = 0;
				timerId = setInterval("rankPickCallFunction()", 5000);

			}else{
				groupGridIndex = 0;
				groupGrid.setFocus(groupGridIndex);
				keywordGrid.setList(keyArData[groupGridIndex], null, "reload");
				
				progressFunction(0,"네이버 적용 대기 중...");
				
				var naverWaitTime = $("#txtInterval").val();
				naverWaitTime = naverWaitTime * 1000;
				
				rankpickCallFlag = 0;
				timerId = setInterval("rankPickCallFunction()", naverWaitTime);
				
			}
		}

		pickBizmoney();
	}

	rankPickFunction = function(pKeyword,pUrl, markUrl, index){//순위 정보 크롤링
		
		$.ajax({
			type: "GET",
			dataType: 'html',
			url : "https://search.naver.com/search.naver?ie=UTF-8&query="+pUrl,
			async: false,
			beforeSend: function(xhr, settings){
			},
			success: function(data){
				//console.log(data);
				naverRank = data.match(/<a class=\"lnk_url\".*?>(.*?)<\/a>/g);
				for(var i=0; i < naverRank.length ; i++){
					keyArData[groupGridIndex][index].nowRank = 0;
					if(naverRank[i].indexOf(markUrl) > -1){
						keyArData[groupGridIndex][index].nowRank = i+1;
						break;
					}
				}
				

				biddingFunction(groupGridIndex,index);

				progressFunction(100,"["+pKeyword+"] 입찰 중...");
				
				keywordGrid.setList(keyArData[groupGridIndex], null, "reload");
				keywordGrid.setFocus(index);
			},
			error:function(XMLHttpRequest, textStatus, errorThrows){ // erreur durant la requete
      			alert("ERROR >>");
      		}
		});
	}


	

}());