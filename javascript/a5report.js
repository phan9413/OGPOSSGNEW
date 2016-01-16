	
/*
Copyright (c) 2001, 2015 Alpha Software Corporation
All Rights Reserved.

This JavaScript library is licensed exclusively for use with Alpha Anywhere, Alpha Five,
Alpha Five Application Server, Alpha Anywhere Application Server,
Alpha Five Run Engine, and Alpha Anywhere Run Engine. It is specifically
not licensed for use on a server that does not have installed on it a
licensed copy of the Alpha Five Application Server or the Alpha Anywhere Application Server.
*/



var Report=Class.create();Report.prototype={initialize:function(reportId,templateId){this.reportId=reportId;this.templateId=templateId;this._prepareReport($(this.reportId));},populate:function(data){var rEle=false;for(var prop in data){if(data[prop].constructor==Array){var rEle=$(this.reportId+'.'+prop);this._addRows(this.templateId+'.'+prop,this.templateId+'.'+prop,rEle,data[prop],false);}else{$svs(this.reportId+'.'+prop,data[prop]);}}
var reportState=data['*state'];if(reportState)
this._setState(reportState);},_prepareReport:function(ele){for(var i=0;i<ele.childNodes.length;i++){if(ele.childNodes[i].getAttribute){if(ele.childNodes[i].getAttribute('A5ReportDataIndex')!=''&&ele.childNodes[i].getAttribute('A5ReportDataIndex')){ele.childNodes[i].id=this.reportId+'.'+ele.childNodes[i].getAttribute('A5ReportDataIndex');}}
if(ele.childNodes[i].childNodes){if(ele.childNodes[i].childNodes.length!=0)this._prepareReport(ele.childNodes[i]);}}},_addRows:function(templateId,nodeId,tEle,data,flatten){var ele=false;var fAttr=$(templateId).getAttribute('A5ReportFlatten');if(fAttr!=''&&fAttr){flatten=$u.s.toBool(fAttr);}
var prop='';for(var i=0;i<data.length;i++){if(!flatten){ele=document.getElementById(templateId).cloneNode(true);ele.id=nodeId+'['+i+']';tEle.appendChild(ele);this._fillRow(ele,data[i],nodeId+'['+i+']');}else{if($(templateId)){ele=document.getElementById(templateId).cloneNode(true);ele.id=nodeId+'['+i+']';tEle.appendChild(ele);this._fillRow(ele,data[i],nodeId+'['+i+']');}}
for(prop in data[i]){if(data[i][prop].constructor==Array){this._createGroup(templateId+'.'+prop,nodeId+'['+i+'].'+prop,ele,data[i][prop],flatten);}}
if(flatten){if($(templateId+'~')){ele=document.getElementById(templateId+'~').cloneNode(true);ele.id=nodeId+'['+i+']~';tEle.appendChild(ele);this._fillRow(ele,data[i],nodeId+'['+i+']');}}}},_createGroup:function(templateId,nodeId,ele,data,flatten){if(flatten){this._addRows(templateId,nodeId,ele.parentNode,data,flatten);return false;}
var tEles=ele.getElementsByTagName('table');var ttEle=false;for(var i=0;i<tEles.length;i++){if(tEles[i].getAttribute('A5ReportGroupIndex')==templateId){ttEle=tEles[i];break;}}
if(ttEle){ttEle.id=nodeId;this._addRows(templateId,nodeId,ttEle,data,flatten);}},_fillRow:function(ele,data,nodeId){for(var i=0;i<ele.childNodes.length;i++){if(ele.childNodes[i].getAttribute){if(ele.childNodes[i].getAttribute('A5ReportDataIndex')!=''&&ele.childNodes[i].getAttribute('A5ReportDataIndex')){if(ele.childNodes[i].tagName.toLowerCase()=='img')ele.childNodes[i].src=data[ele.childNodes[i].getAttribute('A5ReportDataIndex')];else ele.childNodes[i].innerHTML=data[ele.childNodes[i].getAttribute('A5ReportDataIndex')];}
if(ele.childNodes[i].getAttribute('A5ReportDataAttrib')!=''){ele.childNodes[i].setAttribute('A5ReportDataAttrib',data[ele.childNodes[i].getAttribute('A5ReportDataAttrib')]);}
if(ele.childNodes[i].getAttribute('A5ReportConditionIndex')!=''&&ele.childNodes[i].getAttribute('A5ReportConditionIndex')){if(!data[ele.childNodes[i].getAttribute('A5ReportConditionIndex')]){ele.childNodes[i].style.display='none';}}
if(ele.childNodes[i].getAttribute('A5ReportRecordReference')!=''&&ele.childNodes[i].getAttribute('A5ReportRecordReference')){if(ele.childNodes[i].getAttribute('A5ReportRecordReference')!='.')ele.childNodes[i].setAttribute('A5ReportRecordReference',nodeId+'.'+ele.childNodes[i].getAttribute('A5ReportRecordReference'));else ele.childNodes[i].setAttribute('A5ReportRecordReference',nodeId);}
if(ele.childNodes[i].getAttribute('A5ReportGeneratedId')!=''&&ele.childNodes[i].getAttribute('A5ReportGeneratedId')){ele.childNodes[i].id=nodeId+'.'+ele.childNodes[i].getAttribute('A5ReportGeneratedId');}
if(ele.childNodes[i].getAttribute('A5ReportClassNameIndex')!=''&&ele.childNodes[i].getAttribute('A5ReportClassNameIndex')){$acn(ele.childNodes[i],data[ele.childNodes[i].getAttribute('A5ReportClassNameIndex')]);}}
if(ele.childNodes[i].childNodes){if(ele.childNodes[i].childNodes.length!=0)this._fillRow(ele.childNodes[i],data,nodeId);}}},_toggleBranch:function(branchId){var idArr=branchId.split('.');var groupName=idArr.pop();idArr=idArr.join('.');var ele=$(branchId);if(ele.style.display=='none'){ele.style.display='';$acn(idArr,groupName+'_isOpen');}else{ele.style.display='none';$rcn(idArr,groupName+'_isOpen');}},_toggleRow:function(buttonPtr,branchId){var ele=$(branchId);if(ele.style.display=='none'){ele.style.display='';$acn(buttonPtr,'A5ReportButtonExpanded');}else{ele.style.display='none';$rcn(buttonPtr,'A5ReportButtonExpanded');}},_toggleColumn:function(buttonPtr,colGroup){var tblName=buttonPtr.getAttribute('A5ReportRecordReference');var tbl=$(tblName);var classList=tbl.className;if(classList&&classList.indexOf('hide'+colGroup)>-1){$rcn(tbl,'hide'+colGroup);$acn(buttonPtr,'A5ReportButtonExpanded');}else{$acn(tbl,'hide'+colGroup);$rcn(buttonPtr,'A5ReportButtonExpanded');}},_setCurrentRow:function(currentState,prefix){var name=currentState['name'];var offset=currentState['offset'];var child=currentState['child'];var branchId=prefix+name;var idArr=branchId.split('.');var tbl=$(branchId);if(tbl){if(tbl.style.display=='none'){tbl.style.display='';$acn(idArr,name+'_isOpen');}}else{alert('Could not find branch '+branchId);return;}
if(child){this._setCurrentRow(child,prefix+name+'['+(offset-1)+'].');}else{var rowName=prefix+name+'['+(offset-1)+']';var rowEle=$(rowName);if(rowEle){rowEle.focus();rowEle.scrollIntoView();}}},_setState:function(reportState){var currentRow=reportState['current_row'];if(currentRow){this._setCurrentRow(currentRow,this.templateId+'.');}}}