(function(){

	$("#btnBiddingStart").click(function(){ //입찰 시작 버튼
		$("#btnBiddingStart").hide();
		$("#btnBiddingStop").show();
		
		progressFunction(10);
		
		groupGridIndex = 0;
		keywordGridIndex = 0;

		groupGrid.setFocus(groupGridIndex);

		chkKeyWord =keywordGrid.getCheckedList(0);
		chkKeyWordIndex = keywordGrid.getCheckedListWithIndex(0);

		rankpickCallFlag = 0;
		timerId = setInterval("rankPickCallFunction()", 5000); 
		keywordGrid.setFocus(0);
	});

	biddingFunction = function(groupGridIndex,index){//Rank Data
		if(keyArData[groupGridIndex][index].nowRank == keyArData[groupGridIndex][index].wantRank ){//목표순위 일때
			return;
		}
		// 3 < 1 false
		// 4 < 1 false
		// 4 < 5 true
		// 0 < 5 true 
		if(keyArData[groupGridIndex][index].nowRank < keyArData[groupGridIndex][index].wantRank ){
			varBidAmt = keyArData[groupGridIndex][index].bidAmt - keyArData[groupGridIndex][index].biddingPay;
			querString = "?fields=bidAmt";

			var sendData = {
				bidAmt: keyArData[groupGridIndex][index].bidAmt,
				useGroupBidAmt: keyArData[groupGridIndex][index].useGroupBidAmt,
				nccAdgroupId:keyArData[groupGridIndex][index].nccAdgroupId
			};

			ajaxBidding("PUT" , "/ncc/keywords/"+keyArData[groupGridIndex][index].nccKeywordId , querString , sendData, function(data){
				console.log("입찰 완료");
			});	
			return;		
		}
		// 3 > 1 true
		// 2 > 1 true
		if(keyArData[groupGridIndex][index].nowRank > keyArData[groupGridIndex][index].wantRank ){
			varBidAmt = keyArData[groupGridIndex][index].bidAmt + keyArData[groupGridIndex][index].biddingPay;
			
			if(varBidAmt > keyArData[groupGridIndex][index].maxPay){//한도
				varBidAmt = keyArData[groupGridIndex][index].maxPay;
			}

			var sendData = {
				bidAmt: keyArData[groupGridIndex][index].bidAmt,
				useGroupBidAmt: keyArData[groupGridIndex][index].useGroupBidAmt,
				nccAdgroupId:keyArData[groupGridIndex][index].nccAdgroupId
			};

			ajaxBidding("PUT" , "/ncc/keywords/"+keyArData[groupGridIndex][index].nccKeywordId , querString , sendData, function(data){
				console.log("입찰 완료");
			});	
			return;		
		}

	}

}());