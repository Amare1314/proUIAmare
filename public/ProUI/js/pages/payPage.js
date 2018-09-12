var ctx = $("#ctx").val();
var appid = $("#appid").val();
var type = $("#type").val();
var commonUrl_ajax = $("#commonUrl_ajax").val();

var pay_campusid = "";
var all_businessmodel;

$(document).ready(
	function() {
		generate_pay_table();
		
		$("#campus-chosen").change(function(){
			generate_pay_table();
		});
		
		$("#queryPayBtn").click(function(){
			generate_pay_table();
		});
		
		$("#bj-chosen").change(function(){
			generate_setting_table();
		});
		
		$("#state-chosen").change(function(){
			generate_setting_table();
		});
		
		$("#paytype-chosen").change(function(){
			generate_setting_table();
		});
		
		$("#binding-chosen").change(function(){
			generate_setting_table();
		});
		
		$("#queryBtn").click(function(){
			generate_setting_table();
		});
		
		$("#xsjb_xm").keyup(function(){
			generate_setting_table();
		});
		
		$("#addBatchBtn").click(function(){
			addBatchPay();
		});
		
		$("#closeBatchBtn").click(function(){
			closeBatchPay();
		});
		
		$("#exportServiceSetting").click(function(){
			exportExcel();
		});
		
		$("#payConfigSubmit").click(function(){
			savePayConfig();
		});
		
		$("#stuids").click(function(){
			$("input[name='stuids']").prop("checked", $("#stuids").prop("checked"));
		});
		
		$("#prodictList").change(function(){
			var url=ctx+"/base/findTransformCityByProvince";
			var submitData = {
				dictcode: $("#prodictList").val()
			}; 
			$.post(url,
				submitData,
		      	function(data){
					var datas = eval(data);
					$("#cityList option").remove();//user为要绑定的select，先清除数据   
			        for(var i=0;i<datas.length;i++){
			        		$("#cityList").append("<option value=" + datas[i][0]+" >"
				        			+ datas[i][1] + "</option>");
			        	
			        };
			        $("#cityList").find("option[index='0']").attr("selected",'selected');
			        $("#cityList").trigger("chosen:updated");
			        
			        generate_pay_table();
		    });
		});
		
		$("#cityList").change(function() {
			generate_pay_table();
		});
		
		$("#saveRemarkBtn").click(function(){
			saveRemark();
		});
		
		$("#openAllBatchBtn").click(function(){
			setBatchPay(1);
		});
		
		$("#closeAllBatchBtn").click(function(){
			setBatchPay(0);
		});
		
		$("#paymentReminders").click(function(){
			remindPaymentInfo();
		});
		
});

function generate_pay_table() {
	GHBB.prompt("正在加载~");
	App.datatables();
	var sAjaxSource = ctx+"/payref/ajax_query_pay";
	var param = "search_campusName=" + $("#search_campusname").val();
	param = param + "&search_xqbm=" + $("#search_xqbm").val();
	param = param + "&search_type=" + type;
	if(type == 'main'){
		param = param + "&search_city=" + $("#cityList").val();
	}	
	sAjaxSource = sAjaxSource + "?" + param;
	
	var aoColumns;
	if(type == 'dls'){
		aoColumns = [{
			"sTitle" : "学校名称",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "1"
		},{
			"sTitle" : "服务时段",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "2"
		}, {
			"sTitle" : "学期",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "11"
		}, {
			"sTitle" : "学生总数",
			"sWidth" : "120px",
			"sClass" : "text-center",
			"mDataProp" : "5"
		}, {
			"sTitle" : "服务开通人数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "6"
		}, {
			"sTitle" : "收费单价",
			"sWidth" : "120px",
			"sClass" : "text-center",
			"mDataProp" : "7"
		}, {
			"sTitle" : "线上收费总额",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "8"
		}, {
			"sTitle" : "线下收费总额",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "9"
		}, {
			"sTitle" : "收费总额",
			"sWidth" : "120px",
			"sClass" : "text-center",
			"mDataProp" : "0"
		},{
			"sTitle" : "操作",
			"sWidth" : "180px",
			"sClass" : "text-center",
			"mDataProp" : "0"
		}];
	}else{
		aoColumns = [{
			"sTitle" : "学校名称",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "1"
		},{
			"sTitle" : "代理商",
			"sWidth" : "120px",
			"sClass" : "text-center",
			"mDataProp" : "2"
		}, {
			"sTitle" : "学期",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "11"
		}, {
			"sTitle" : "学生总数",
			"sWidth" : "120px",
			"sClass" : "text-center",
			"mDataProp" : "5"
		}, {
			"sTitle" : "开通服务人数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "6"
		}, {
			"sTitle" : "线上支付人数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "7"
		}, {
			"sTitle" : "线上进账总额",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "8"
		}, {
			"sTitle" : "操作",
			"sWidth" : "180px",
			"sClass" : "text-center",
			"mDataProp" : "0"
		}];
	}
	
	$('#pay-datatable').dataTable({
		"iDisplayLength" : 50,
		"aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"sAjaxSource" :sAjaxSource,
		"sAjaxDataProp":"aaData",
		"bServerSide" : true,
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			if(type == "dls"){
        		// 服务时段
				if(aaData[2] != '' &&  aaData[3] != '' && iDisplayIndex != 0){
					$('td:eq(1)', nRow).html(aaData[2]+"到"+aaData[3]);
				}else{
					$('td:eq(1)', nRow).html("-");
				}
				
				// 学期
				if(aaData[11] != '' && aaData[11] != null){
					$('td:eq(2)', nRow).html(aaData[11]);
				}else{
					$('td:eq(2)', nRow).html("-");
				}
				
				// 学生人数
				if(aaData[5] != '' && aaData[5] != 0 && aaData[5] != null){
					$('td:eq(3)', nRow).html(aaData[5]);
				}else{
					$('td:eq(3)', nRow).html("-");
				}
				// 服务开通人数
				if(aaData[6] != '' && aaData[6] != 0 && aaData[6] != null){
					$('td:eq(4)', nRow).html(aaData[6]);
				}else{
					$('td:eq(4)', nRow).html("-");
				}
				// 收费单价
				if(aaData[7] != null && aaData[7] != '' && aaData[7] != 0){
					$('td:eq(5)', nRow).html(aaData[7]);
				}else{
					$('td:eq(5)', nRow).html("-");
				}
				// 在线收费总额
				var onlinefee = 0;
				if(aaData[8] != null && aaData[8] != '' && aaData[8] != 0){
					$('td:eq(6)', nRow).html(aaData[8]);
					onlinefee = parseInt(aaData[8]);
				}else{
					$('td:eq(6)', nRow).html("-");
				}
				// 线下收费总额
				var offlinefee = 0;
				if(aaData[9] != null && aaData[9] != '' && aaData[9] != 0){
					$('td:eq(7)', nRow).html(aaData[9]);
					offlinefee = parseInt(aaData[9]);
				}else{
					$('td:eq(7)', nRow).html("-");
				}
				// 收费总额
				var total = onlinefee+offlinefee;
				if(total != null && total != '' && total != 0){
					$('td:eq(8)', nRow).html(total);
				}else{
					$('td:eq(8)', nRow).html("-");
				}
				
				// 设置服务
				var editHtml = "-";
				if(aaData[12] == '1'){
					editHtml = '<div class="btn-group btn-group-xs"><a href="javascript:openSetChargeModal('
						+ aaData[0] + ',\''+aaData[1]+'\',\''+aaData[2]+'\',\''+aaData[3]+'\',\''+aaData[7]+'\',\''+aaData[8]+'\',\''+aaData[9]+'\','+total+',\''+aaData[4]+'\',\''+aaData[11]+'\');">费用设置</a>&nbsp;&nbsp;'
						+'<a href="javascript:openSetModal(' + aaData[0] + ',\''+aaData[1]+'\',\''+aaData[4]+'\',\''+aaData[11]+'\',\'' + aaData[10] + '\',\'' + aaData[13] + '\',\'' + aaData[14] + '\');">服务设置</a></div>';
				}
				$('td:eq(9)', nRow).html(editHtml);
			}else{
				// 学期
				if(aaData[3] != '' && aaData[3] != null){
					$('td:eq(2)', nRow).html(aaData[3]);
				}else{
					$('td:eq(2)', nRow).html("-");
				}
				
				// 学生人数
				if(aaData[5] != '' && aaData[5] != 0 && aaData[5] != null){
					$('td:eq(3)', nRow).html(aaData[5]);
				}else{
					$('td:eq(3)', nRow).html("-");
				}
				
				// 线下收费人数
				if(aaData[6] != null && aaData[6] != '' && aaData[6] != 0){
					$('td:eq(4)', nRow).html(aaData[6]);
				}else{
					$('td:eq(4)', nRow).html("-");
				}
				
				// 线上收费人数
				if(aaData[7] != null && aaData[7] != '' && aaData[7] != 0){
					$('td:eq(5)', nRow).html(aaData[7]);
				}else{
					$('td:eq(5)', nRow).html("-");
				}
				
				// 线上收费总额
				if(aaData[8] != null && aaData[8] != '' && aaData[8] != 0){
					$('td:eq(6)', nRow).html(aaData[8]);
				}else{
					$('td:eq(6)', nRow).html("-");
				}
				
				// 设置服务
				var editHtml = "-";
				if(aaData[12] == '1'){
					editHtml = '<div class="btn-group btn-group-xs"><a href="javascript:openSetModal(' + aaData[0] + ',\''+aaData[1]+'\',\''+aaData[4]+'\',\''+aaData[11]+'\',\'' + aaData[10] + '\',\'' + aaData[13] + '\');">服务设置</a>&nbsp;&nbsp;'
					+'<a href="javascript:setRemark(' + aaData[0] + ',\''+aaData[9]+'\');">备注</a></div>';
				}
				$('td:eq(7)', nRow).html(editHtml);
			}
			
			return nRow;
		},
		"aoColumns" :aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});
}

function setRemark(campusid,remark){
	if(remark==null || remark == "null"){
		remark = "";
	}
	$("#remark_campusid").val(campusid);
	$("#remark").val(remark);
	$('#modal-remark-page').modal('show');
}

function openSetChargeModal(id,campus,starttime,endtime,charge,online,offline,total,xqid,xqmc){
	$("#campusid").val(id);
	$("#campus").val(campus);
	$("#servicestartrq").val(starttime);
	$("#serviceendrq").val(endtime);
	$("#xqbm").html('<option value='+xqid+' selected="selected">'+xqmc+'</option>');
	$("#xqbm").trigger("chosen:updated");
	if(charge =="null" || charge =='' || charge==undefined){
		$("#charge").val("0");
	}else{
		$("#charge").val(charge);
	}
	
	if(online =="null" || online ==''  || online==undefined){
		$("#online_charge").val("0");
	}else{
		$("#online_charge").val(online);
	}
	
	if(offline =="null" || offline =='' || offline==undefined){
		$("#offline_charge").val("0");
	}else{
		$("#offline_charge").val(offline);
	}
	
	$("#total").val(total);
	$('#modal-charge-page').modal('show');
}

function openSetModal(campusid,campus,xqbm,xqmc,orgcode,coststate,businessmodel){
	pay_campusid = campusid;
	$("#title").html(" 服务设置"+campus+xqmc);
	$("#pay_orgcode").val(orgcode);
	$("#pay_campusid").val(campusid);
	$("#pay_xqbm").val(xqbm);
	findBjsjByCampusid();
	$('#state-chosen option').eq(0).attr("selected",true);
	$('#state-chosen').trigger("chosen:updated");
	$("#xsjb_xm").val("");
	$("#pay_coststate").val(coststate);
	all_businessmodel = businessmodel;
	if(coststate>1  && type == 'dls' && businessmodel==1){
		$("#addBatchBtn").attr("disabled", true); 
		$("#closeBatchBtn").attr("disabled", true); 
		$("#openAllBatchBtn").attr("disabled", true); 
		$("#closeAllBatchBtn").attr("disabled", true); 
	}else{
		$("#addBatchBtn").attr("disabled", false); 
		$("#closeBatchBtn").attr("disabled", false);
		$("#openAllBatchBtn").attr("disabled", false); 
		$("#closeAllBatchBtn").attr("disabled", false);
	}
	$('#modal-querydetail').modal('show');
}

function findBjsjByCampusid(){
	var url=ctx+"/payref/findBjByCampusid";
	var submitData = {
		campusid: pay_campusid
	}; 
	$.post(url,
		submitData,
      	function(data){
			var datas = eval(data);
			$("#bj-chosen option").remove();//user为要绑定的select，先清除数据   
	        for(var i=0;i<datas.length;i++){
	        		$("#bj-chosen").append("<option value=" + datas[i][0]+" >"
		        			+ datas[i][1] + "</option>");
	        };
	        $("#bj-chosen").find("option[index='0']").attr("selected",'selected');
	        $("#bj-chosen").trigger("chosen:updated");
	        
	        generate_setting_table();
    });
}

function generate_setting_table(){
	GHBB.prompt("正在加载~");
	App.datatables();
	var sAjaxSource = ctx+"/payref/ajax_pay_setting";
	var param = "search_campusid=" + pay_campusid;
	param = param + "&search_bjids=" + $("#bj-chosen").val();
	param = param + "&search_payment=" + $("#state-chosen").val();
	param = param + "&search_paytype=" + $("#paytype-chosen").val();
	param = param + "&search_xm=" + $("#xsjb_xm").val();
	param = param + "&search_xqbm=" + $("#pay_xqbm").val();
	param = param + "&search_bindingstate="+$("#binding-chosen").val();
	sAjaxSource = sAjaxSource + "?" + param;
	var aoColumns = [{
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "0"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "1"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "11"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "10"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "2"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "5"
	},{
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "6"
	},{
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "3"
	}];
	
	$('#pay_detail_datatable').dataTable({			
		"iDisplayLength" : 8,
		"aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"sAjaxSource" :sAjaxSource,
		"bSort" : false,
		"sAjaxDataProp":"aaData",
		"bServerSide" : true,
        "fnRowCallback": function( nRow, aaData, iDisplayIndex ) {

			var checkBox = '<input name="stuids" type="checkbox" value="'+aaData[0]+'" />';
        	$('td:eq(0)', nRow).html(checkBox);
        	
        	var binding = $("#binding-chosen").val();
        	var bindingHtml = "";
        	if(binding == ""){
        		slaveuser  =  aaData[10];
        		if(slaveuser != undefined && slaveuser != null && slaveuser != "null" && slaveuser != ''){
        			bindingHtml = "已绑定";
        		}else{
        			bindingHtml = "未绑定";
        		}
        	}else if(binding == "0"){
        		bindingHtml = "未绑定";
        	}else if(binding == "1"){
        		bindingHtml = "已绑定";
        	}
        	$('td:eq(3)', nRow).html(bindingHtml);
        	
        	var disableClass = "";
        	if($("#pay_coststate").val()>1 && type == 'dls' && all_businessmodel==1){
        		disableClass = " disabled='disabled' ";
        	}
        	
        	var state;
			if(aaData[2] == 0){
				state="<label class='switch switch-primary'><input type='checkbox' "+disableClass+" onclick='updatePayment("+aaData[0]+","+aaData[7]+",this);'><span></span></label>";
			}else if(aaData[2] == 1){
				state="<label class='switch switch-primary'><input type='checkbox' "+disableClass+" checked onclick='updatePayment("+aaData[0]+","+aaData[7]+",this);'><span></span></label>";
			}else{
				state = "无效状态";
			}
			$('td:eq(4)', nRow).html(state);
			
			var totalHtml = "";
			if(aaData[5]>0){
				totalHtml = '<div style="text-align:center"><a href="javascript:openDetailRecord(\''
									+ aaData[0] + '\',\'' + aaData[1] + '\');">'
									+ aaData[5]
									+ '天</a></div>';
			}else{
				totalHtml = "-";
			}
			$('td:eq(5)', nRow).html(totalHtml);
			
			if(aaData[6] == 1){
				$('td:eq(6)', nRow).html("线下支付");
				$('td:eq(7)', nRow).html("-");
			}else if(aaData[6] == 2){
				var totlefee = aaData[12]/100;
				$('td:eq(6)', nRow).html("线上支付  "+totlefee+"元");
				$('td:eq(7)', nRow).html(aaData[3]);
			}else{
				$('td:eq(6)', nRow).html("-");
				$('td:eq(7)', nRow).html("-");
			}
			
			return nRow;
		},
		"aoColumns" :aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});
}

function exportExcel(){
	GHBB.prompt("数据导出中~")
	var url = ctx+"/payref/expectStuServiceSetting";
	var submitData = {
			search_campusid	:	pay_campusid,
			search_bjids	:	$("#bj-chosen").val(),
			search_payment	:	$("#state-chosen").val(),
			search_paytype	:	$("#paytype-chosen").val(),
			search_xm		:	$("#xsjb_xm").val(),
			search_xqbm		:	$("#pay_xqbm").val()
	}; 
	$.post(url,
		submitData,
      	function(data){
		GHBB.hide();
			location.href=ctx + data; 
    	});
}

function settingPay(stuid,stuxm,bjid,bjmc,payid,payment){
	if(payment == 1){
		if(payid==null){
			payid=0;
		}
		delPay(stuid,payid);
	}else if(payment == 0){
		savePay(stuid,stuxm,bjid,bjmc);
	}
	
}

function updatePayment(stuid,recordid,obj){
//	var title;
	var payment;
	if(obj.checked){		
		title="开通";
		payment = 1;
	}else{
		title="关闭";
		payment = 0;
	}
	if(recordid == undefined || recordid ==null){
		recordid = 0;
	}
	
//	if (confirm("确认"+title+"该学生当前学期的服务?")) {
		var url = ctx+"/payref/delWxXxPay";
		var submitData = {
				recordid 	: 	recordid,
				stuid 		: 	stuid,
				payment		: 	payment,
				xqbm		:	$("#pay_xqbm").val()
				
		};
		$.post(url, submitData, function(data) {
			if (data == "success") {
				PromptBox.alert("设置成功!");
				//generate_setting_table();
			} else {
				PromptBox.alert(data);
			}
			return false;
		});
//	}
}

function openDetailRecord(stuid,xm){
	$("#payrecord_title").html(xm+"服务时长");
	$('#modal-recorde-page').modal('show');
	App.datatables();
	var sAjaxSource = ctx+"/payref/ajax_pay_record";
	var param = "search_stuid=" + stuid;
	param = param + "&search_xqbm=" + $("#pay_xqbm").val();
	sAjaxSource = sAjaxSource + "?" + param;
	var aoColumns = [{
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "starttime"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "endtime"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "totaltime"
	}];
	
	$('#pay_record_datatable').dataTable({			
		"iDisplayLength" : 5,
		"aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"sAjaxSource" :sAjaxSource,
		"bSort" : false,
		"sAjaxDataProp":"aaData",
		"bServerSide" : true,
        "fnRowCallback": function( nRow, aaData, iDisplayIndex ) {
			if(aaData.totaltime != 0 && aaData.totaltime != ''){
				$('td:eq(2)', nRow).html(aaData.totaltime+"分钟");
			}
			return nRow;
		},
		"aoColumns" :aoColumns
	});
}

function countTotalFee(){
	var onlinefee = $("#online_charge").val();
	if(onlinefee == null || offlinefee == ''){
		onlinefee = 0;
	}
	var offlinefee = $("#offline_charge").val();
	if(offlinefee == null || offlinefee == ''){
		offlinefee = 0;
	}
	$("#total").val( parseInt(onlinefee)+parseInt(offlinefee));
	
}

function delPay(stuid,payid){
	if (confirm("确认关闭该学生本学期的服务?")) {
		var url = ctx+"/payref/delWxXxPay";
		var submitData = {
				orgcode	:	$("#pay_orgcode").val(),
				payid 	: 	payid,
				stuid 	: 	stuid
		};
		$.post(url, submitData, function(data) {
			if (data == "success") {
				PromptBox.alert("设置成功!");
				generate_setting_table();
			} else {
				PromptBox.alert(data);
			}
			return false;
		});
	}
}

function savePay(stuid,stuxm,bjid,bjmc){
	if (confirm("确认开通该学生本学期的服务?")) {
		var url = ctx+"/payref/saveWxXxPay";
		var submitData = {
				orgcode	:	$("#pay_orgcode").val(),
				campusid	:	$("#pay_campusid").val(),
				xqbm	:	$("#pay_xqbm").val(),
				stuid 	: 	stuid,
				stuname : 	stuxm,
				bjid 	: 	bjid,
				bjmc 	: 	bjmc
				
		};
		$.post(url, submitData, function(data) {
			if (data == "success") {
				PromptBox.alert("设置成功!");
				generate_setting_table();
			} else {
				PromptBox.alert(data);
			}
			return false;
		});
	}
}

function setBatchPay(payment){
	$("#openAllBatchBtn").attr("disabled", true); 
	$("#closeAllBatchBtn").attr("disabled", true); 
	var title = "";
	if(payment == 1){
		title = "开通";
	}else{
		title = "关闭";
	}
	
	if (confirm("确认"+title+"该学校所有学生的服务?")) {
		var url = ctx+"/payref/setBatchPay";
		var submitData = {
				campusid	:	$("#pay_campusid").val(),
				xqbm		:	$("#pay_xqbm").val(),
				payment		:	payment
				
		};
		$.post(url, submitData, function(data) {
			if (data == "success") {
				PromptBox.alert("设置成功!");
				generate_setting_table();
			} else {
				PromptBox.alert(data);
			}
			$("#openAllBatchBtn").attr("disabled", false); 
			$("#closeAllBatchBtn").attr("disabled", false); 
			return false;
		});
	}else{
		$("#openAllBatchBtn").attr("disabled", false); 
		$("#closeAllBatchBtn").attr("disabled", false); 
	}
}

function addBatchPay(){
	$("#addBatchBtn").attr("disabled", true); 
	var chk_value =[];
    $('input[name="stuids"]:checked').each(function(){
    	chk_value.push($(this).val());
    });
    if(chk_value.length == 0){
    	PromptBox.alert("未选中记录！");
    	return;
    }
	if(confirm("确定开通所选学生的服务?")){
		var url=ctx+"/payref/addBatchPay";
		var submitData = {
			stuids	: 	chk_value+"",
			xqbm	:	$("#pay_xqbm").val()
		}; 
		$.post(url,
			submitData,
	      	function(data){
				if(data=="success"){
					PromptBox.alert("开通成功!");
					$("#stuids").prop("checked", false);
					generate_setting_table();
				}else{
					PromptBox.alert(data);
				}
				$("#addBatchBtn").attr("disabled", false); 
	     });
	}		
}

function closeBatchPay(){
	$("#closeBatchBtn").attr("disabled", true); 
	var chk_value =[];
    $('input[name="stuids"]:checked').each(function(){
    	chk_value.push($(this).val());
    });
    if(chk_value.length == 0){
    	PromptBox.alert("未选中记录！");
    	$("#closeBatchBtn").attr("disabled", false);
    	return;
    }
	if(confirm("确定关闭所选学生的服务?")){
		var url=ctx+"/payref/closeBatchPay";
		var submitData = {
			stuids	: 	chk_value+"",
			xqbm	:	$("#pay_xqbm").val()
		}; 
		$.post(url,
			submitData,
	      	function(data){
				if(data=="success"){
					PromptBox.alert("关闭成功!");
					$("#stuids").prop("checked", false);
					generate_setting_table();
//					return false;
				}else{
					PromptBox.alert(data);
				}
				$("#closeBatchBtn").attr("disabled", false); 
	     });
	}		
}

function savePayConfig(){
	if(confirm("确定保存?")){
		var charge = $("#charge").val();
		if(charge == null || charge == '' || charge == 'null'){
			charge = 0;
		}
		GHBB.prompt("数据保存中~");
		var url=ctx+"/payref/savePayConfig";
		var submitData = {
			campusid	: 	$("#campusid").val(),
			xqbm		:	$("#xqbm").val(),
			charge		:	parseInt(charge)*100,
			offline_charge	:	$("#offline_charge").val()
		}; 
		$.post(url,
			submitData,
	      	function(data){
				if(data=="success"){
					GHBB.hide();
					PromptBox.alert("设置成功!");
					$('#modal-charge-page').modal('hide');
					generate_pay_table();
					return false;
				}else{
					PromptBox.alert(data);
				}
				
	    		
	     });
	}	
}

function saveRemark(){
	if(confirm("确定保存?")){
		var url=ctx+"/xtgl/campus/saveCampusRemark";
		var submitData = {
			campusid	: 	$("#remark_campusid").val(),
			remark		:	$("#remark").val()
		}; 
		$.post(url,
			submitData,
	      	function(data){
				if(data=="success"){
					PromptBox.alert("设置成功!");
					$('#modal-remark-page').modal('hide');
					generate_pay_table();
					return false;
				}else{
					PromptBox.alert(data);
				}
	     });
	}	
}

function remindPaymentInfo(){
	if(confirm("确认发送缴费提醒信息?")){
		var param = {
			campusid : pay_campusid,
			bjids : $("#bj-chosen").val(),
			paytype : $("#paytype-chosen").val(),
			xm : $("#xsjb_xm").val(),
			xqbm : $("#pay_xqbm").val(),
			bindingstate : $("#binding-chosen").val()
		};
		var submitData = {
			api : ApiParamUtil.SERVICE_PUSH_PAYMENT_SET_MSG,
			param : JSON.stringify(param)
		};
		$.post(commonUrl_ajax, submitData, function(json) {
			var result = typeof json == "object" ? json : JSON.parse(json);
			if(result.ret.code == 200){
				PromptBox.alert("发送成功！");
			}
		});
	}	

}