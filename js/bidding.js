(function(){

/*	if(urlMoveFlag == "B"){
		if(url == keywordUrl){
			intervalBiddingFunction = setInterval("dataPickRank()", 1000);
		}
	}*/
	biddingFlag = 0;
	rankPickFlag =0;
	rankModalOpenFlag = "CLOSE";

	$("#btnBiddingStart").click(function(){ //입찰 시작 버튼
		$("#btnBiddingStart").hide();
		$("#btnBiddingStop").show();
		
		groupGrid.setFocus(0);
		
		var url = chkVar[0].groupUrl;
		gBiddingUrl =url;
		
		urlMove(url,"BIDDING");
	});

	biddingFunction = function(){//Rank Data
		var keyWordList = $("#ifrView").contents().find('table tr[id]');

		if(keyWordList.length > 0){
			clearInterval(intervalBiddingFunction);

			rankPickFlag =0;
			intervalBSubFunction = setInterval("dataPickRank()", 3300);
		}
	}

	dataPickRank = function(){//Rank Data
		var arKeyRank =$("#ifrView").contents().find('table tr[id] a.show-preview-cnt');//보기 버튼
		var modalRank = $("#ifrView").contents().find('div.modal-body div.scroll-wrap div a.lnk_url.ng-binding');//순위표 
		var modalCloseBtn = $("#ifrView").contents().find('div.modal-footer button');//닫기 버튼

		if(modalRank.length > 0){
			for(var i=0 ; i<modalRank.length;i++){
				if(modalRank[i].innerText == keyArData[biddingFlag][rankPickFlag].markettingUrl){	//순위 확인
					keyArData[biddingFlag][rankPickFlag].nowRank = i;
					keywordGrid.setList(keyArData[biddingFlag], null, "reload");
					keywordGrid.setFocus(rankPickFlag);
					break;
				}else{
					keyArData[biddingFlag][rankPickFlag].nowRank = "0";
					keywordGrid.setList(keyArData[biddingFlag], null, "reload");
					keywordGrid.setFocus(rankPickFlag);
				}
			}
			modalCloseBtn.click();//모달 close


			rankPickFlag++;
			
		}else{
			if(keyArData[biddingFlag].length == rankPickFlag){
				rankPickFlag = 0;
				moneyChangeFlag="N";
				clearInterval(intervalBSubFunction);//순위 조회 종료
				intervalBiddingMoneyFunction = setInterval("biddingMoney()", 1000);//금액 변경 진행
			}else{
				arKeyRank[rankPickFlag].click();//모달 오픈
				rankModalOpenFlag = "OPEN";
			}
		}
	}

	moneyChangeFlag="N";
	biddingChangeFlag =0;

	biddingMoney = function(){
		var moneyPopup = $("#ifrView").contents().find('div.popover-content');//금액 팝업
		var moneyModal = $("#ifrView").contents().find('div.modal-body');//변경 완료 후 modal
		var moneyModalBtn = $("#ifrView").contents().find('div.modal-footer button');//변경 완료 후 modal

		var moneyTag = $("#ifrView").contents().find('td.cell-bid-amt.text-right.txt-r a');//금액 태그
		var moneyTagText = $("#ifrView").contents().find('div.popover-content div.form-inline div span input');//금액 태그
		var moneyTagButton = $("#ifrView").contents().find('div.popover-content div.form-inline div button.btn.btn-primary.editable-submit');//금액 변경 버튼
		var moneyTagCloseButton = $("#ifrView").contents().find('div.popover-content div.form-inline div button.btn.btn-default.editable-cancel');//금액 취소 버튼
		
		if(moneyModal.length > 0){//변경 완료 모달 오픈 시
			moneyModalBtn.click();//닫기 버튼 클릭
			if(biddingChangeFlag == rankPickFlag){
				clearInterval(intervalBiddingMoneyFunction);
				console.log("The end");
			}
		}

		if(moneyChangeFlag == "Y"){//금액 변경하면
			moneyTagButton[0].click();//금액 변경 버튼 클릭
			rankPickFlag++;
			biddingChangeFlag++;
			
			moneyChangeFlag = "N";
		}else{
			if(moneyPopup.length > 0){
				if(keyArData[biddingFlag][rankPickFlag].nowRank == keyArData[biddingFlag][rankPickFlag].wantRank ){//목표순위 일때
				
				}else{
					moneyTagText.val( Number( moneyTagText.val() ) + keyArData[biddingFlag][rankPickFlag].biddingPay);
					moneyTagText.trigger('input');
					moneyChangeFlag = "Y";
				}
				
			}else{//팝업 없을때
				moneyTag[rankPickFlag].click();//입찰가 오픈
			}
		}
	}

}());