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

		if(keyArData[groupGridIndex][index].nowRank < keyArData[groupGridIndex][index].wantRank ){//원하는 순위가 더클때
			varBidAmt = keyArData[groupGridIndex][index].bidAmt - keyArData[groupGridIndex][index].biddingPay;
			querString = keyArData[groupGridIndex][index].nccKeywordId+"?nccAdgroupId="+ keyArData[groupGridIndex][index].nccAdgroupId+"&bidAmt=" + keyArData[groupGridIndex][index].bidAmt+"&useGroupBidAmt=false" ;
			ajaxPick("PUT" , "/ncc/keywords/" , querString , function(data){});	
			return;		
		}

		if(keyArData[groupGridIndex][index].nowRank > keyArData[groupGridIndex][index].wantRank ){//원하는 순위가 더클때
			varBidAmt = keyArData[groupGridIndex][index].bidAmt + keyArData[groupGridIndex][index].biddingPay;
			querString = keyArData[groupGridIndex][index].nccKeywordId+"?nccAdgroupId="+ keyArData[groupGridIndex][index].nccAdgroupId+"&bidAmt=" + keyArData[groupGridIndex][index].bidAmt+"&useGroupBidAmt=false" ;
			ajaxPick("PUT" , "/ncc/keywords/" , querString , function(data){

			});
			return;		
		}

	}

}());