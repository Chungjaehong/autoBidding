(function(){

	biddingFunction = function(groupGridIndex,index){//Rank Data
		if(keyArData[groupGridIndex][index].nowRank == keyArData[groupGridIndex][index].wantRank ){//목표순위 일때
			return;
		}
		// 3 < 1 false
		// 4 < 1 false
		// 4 < 5 true
		// 0 < 5 true 
		if(keyArData[groupGridIndex][index].nowRank < keyArData[groupGridIndex][index].wantRank ){
			if(keyArData[groupGridIndex][index].status == "OFF"){
				return;
			}
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
			if(keyArData[groupGridIndex][index].status == "OFF"){
				return;
			}
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