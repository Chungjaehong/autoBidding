(function(){

	testPro = function(){
		myProgress = new AXProgress();
		myProgress.setConfig({
			theme: "AXCircleProgress",
			totalCount: 100,
			width: 400,
			top: 100,
			title: "계정정보 동기화 중입니다...",
			duration: 50 // 프로세스바의 애니메이션 속도 값 입니다.
		});

		mask.open();
		myProgress.start(function(){
			if(this.isEnd){
				myProgress.close();
				mask.close();
			}else{
				myProgress.update(); // 프로그레스의 다음 카운트를 시작합니다.
			}
		});
	}
	


	campArData = new Array();//바른속기1 바른속기2 --> 계정정보
	grpArData = new Array();//캠페인 안에 그룹   --> 계정정보
	
	chkVar = new Array();	//선택된 그룹 --> 자동입찰 상위
	keyArData = new Array();//그룹 안에 키워드 --> 자동입찰 하위
	

	
	grpUrl = "";
	cmpUrl = "";
	keywordUrl = "";
	gBiddingUrl = "";
	urlMoveFlag = "";
	
	gCampId ="";
	gCampName="";
	gGroupId = "";
	grpUrlMoveFlag =0;
	kewwordUrlMoveFlag =0;

	//948185
	$("#btnUser").click(function(){//계정 동기화 버튼
		//init variable
		campArData = new Array();
		grpArData = new Array();
		grpUrlMoveFlag = 0;

		var url = "https://manage.searchad.naver.com/customers/"+customerId+"/campaigns";
		cmpUrl = url; 
		urlMove(url,"CAMP");

		testPro();
	});

	$("#btnGroup").click(function(){//그룹 동기화 버튼
		writeFile(JSON.stringify(usergrid.getList()),"usergrid.json");
		$("#groupDataMenu").click();
		$(".nav-tabs a").click();
		fnObj.groupGrid.bind();
		fnObj.keywordGrid.bind();
		
		chkVar =usergrid.getCheckedList(2);
		//writeFile(JSON.stringify(usergrid.getCheckedList(2)),"usergridChk.json");

		var url = "https://manage.searchad.naver.com/customers/"+customerId+"/adgroups/"+chkVar[0].id;
		//https://manage.searchad.naver.com/customers/948185/adgroups/grp-m001-01-000001720231439
		
		keywordUrl = url;
		gGroupId = chkVar[0].id;
		keyArData = new Array();
		kewwordUrlMoveFlag = 0;

		urlMove(url,"KEYWORD");
		testPro();
	});

	dataPickKeyword = function(){//키워드 데이터
			var arKeyword	  =$("#ifrView").contents().find('table tr[id] span span');//키워드
			var arMoney		  =$("#ifrView").contents().find('table tr[id] td a.js-editable');//금액
			var arNudeKeyword =$("#ifrView").contents().find('table tr[id] td');//12개 단위
			var arKeyRank     =$("#ifrView").contents().find('table tr[id] a.show-preview-cnt');//보기 버튼

			var marketUrl= $("#ifrView").contents().find('div dd p.ng-binding');//마케팅 url

			if(arKeyword.length > 0){
					clearInterval(intervalKeywordFunction);
					
					var keywordInfoP = new Array();
					for(var i=0; i < arKeyword.length ; i++){
							var keywordInfo = new Object();
							

							keywordInfo.Name = arKeyword[i].innerText;
							keywordInfo.Money = arMoney[i].innerText; 
							keywordInfo.GroupId = gGroupId;
							keywordInfo.GroupUrl = "https://manage.searchad.naver.com/customers/"+customerId+"/adgroups/"+chkVar[kewwordUrlMoveFlag].id;
							keywordInfo.nowRank = 0;
							
							
							keywordInfo.wantRank = 1;//희망순위
							keywordInfo.biddingPay = 500;//가감액
							keywordInfo.maxPay = 500;//입찰 한도
							keywordInfo.markettingUrl = marketUrl[0].innerHTML;//광고 사이트 주소

							if(i == 0 ){//키워드 노출
								keywordInfo.OnOff =arNudeKeyword[i+2].innerText;//   On/Off상태
								keywordInfo.NudeKeyword =arNudeKeyword[i+11].innerText;//노출 가능 횟수
							}else{
								keywordInfo.OnOff =arNudeKeyword[(i*12)+2].innerText;//    On/Off상태
								keywordInfo.NudeKeyword =arNudeKeyword[(i*12)-1].innerText;//노출 가능 횟수
							}
							keywordInfoP.push(keywordInfo);
							
					}
					keyArData.push(keywordInfoP);

					kewwordUrlMoveFlag++;

					chkVar[kewwordUrlMoveFlag-1].keyCout = arKeyword.length;//키워드 수
					chkVar[kewwordUrlMoveFlag-1].groupUrl = "https://manage.searchad.naver.com/customers/"+customerId+"/adgroups/"+ gGroupId;

					if(chkVar.length == kewwordUrlMoveFlag){
						keywordGrid.setList(keyArData[0], null, "reload");
						groupGrid.setList(chkVar, null, "reload");
						groupGrid.setFocus(0);
					}
					

					if(chkVar.length > kewwordUrlMoveFlag){

						var url = "https://manage.searchad.naver.com/customers/"+customerId+"/adgroups/"+chkVar[kewwordUrlMoveFlag].id;
						keywordUrl = url;

						gGroupId = chkVar[kewwordUrlMoveFlag].id;
						urlMove(url,'KEYWORD');
					}
			}
	}


	dataPickCmp = function(){//camp data pick
			var arTable=$("#ifrView").contents().find('table tr[id]');
			var arCamp = $("#ifrView").contents().find('table tr td a.link');
			campArData = new Array();

			if(arTable.length >0){
					clearInterval(intervalCmpFunction);
					
					for(var i=0; i < arCamp.length ; i++){
							var campInfo = new Object();
							campInfo.name = arCamp[i].innerText;
							campInfo.id = arTable[i].id.replace("wgt-","");
							campInfo.flag = arCamp[i].parentElement.previousElementSibling.outerText;
							
							gCampId = campInfo.id;

							campArData.push(campInfo);
					}//캠페인 아이디 네임 가져오기

					for(var i=0 ; i<campArData.length;i++){
							
							if(campArData.length == grpUrlMoveFlag){
								usergrid.setList(grpArData, null, "reload");
								$("#userDataGrid_AX_checkAll_AX_0_AX_2").hide();
								break;
							}
							
							var url = "https://manage.searchad.naver.com/customers/"+customerId+"/campaigns/"+campArData[grpUrlMoveFlag].id+"?recordSize=1001";
							webview.loadURL(url);
							grpUrl = url;

							if(campArData.length > grpUrlMoveFlag){
								arCamp[grpUrlMoveFlag].click();
								urlMove(url,'GROUP');
							}
					}
			}
	}


	dataPickGrp = function(){//group data pick
			var grpList = $("#ifrView").contents().find('li.active.open-list ul li a');
			var urlList = $("#ifrView").contents().find('div table tbody tr td');

			if(grpList.length > 0){
					clearInterval(intervalGrpFunction);
					
					for(var i =0; i < grpList.length ; i++){
								var grpInfo = new Object();
								grpInfo.id = grpList[i].attributes[1].value;
								grpInfo.name = grpList[i].innerText;
								grpInfo.campId = gCampId;
								grpInfo.CampName = campArData[grpUrlMoveFlag].name;
								grpInfo.GroupUrl = "https://manage.searchad.naver.com/customers/"+customerId+"/adgroups/"+grpList[i].attributes[1].value;
					}

					var url = "https://manage.searchad.naver.com/customers/"+customerId+"/campaigns?recordSize=1001";
					cmpUrl = url;
					if(campArData.length < grpUrlMoveFlag){
										
					}else{
							urlMove(url,"CAMP");
							grpUrlMoveFlag++;
					}
			}
	}

	urlMove = function(url,flag){
		if(flag == "CAMP"){
			urlMoveFlag = "C"
		}

		if(flag == "GROUP"){
			urlMoveFlag = "G"
		}

		if(flag == "KEYWORD"){
			urlMoveFlag = "K"
		}

		if(flag == "BIDDING"){
			urlMoveFlag = "B"
		}

		$("#ifrView").attr("src",url);

	}//Url Move Func

}());