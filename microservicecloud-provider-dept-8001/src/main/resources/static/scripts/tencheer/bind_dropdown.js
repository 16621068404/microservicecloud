/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function bind_dropdown(id,name,para,filter,column,grid,rowid)
{
    if ($("#" + id).attr("editable") == "false") return;
    $("#"+id).wrap('<div  class="input-group"></div>');
    $("#"+id).parent().append('<span class="fa fa-caret-down form-control-feedback" style="font-size:12px;" aria-hidden="true"></span>');
    $("#"+id).parent().append('<div  class="input-group-btn"  id="'+id+'_dropdown"><ul  style="position:absolute;z-index:9999999999" class="dropdown-menu dropdown-menu-right bs-suggest-container" role="menu"></ul></div>');
    $("#"+id).parent().parent().css("overflow","visible");
    var new_keyword='';
    var old_keyword='';
    switch(name)
    {
        case "货物信息":
            $("#"+id).bsSuggest({
                url: "/goods_manage/goods_base/GetGoodsDropdownList",
                effectiveFields: ["goods_name","goods_spec","goods_unitname","goods_shortcut","goods_type_name","heavy_cargo"],
                effectiveFieldsAlias:{goods_name: "货物名称",goods_spec:"规格",goods_unitname:"单位","goods_shortcut":"简称","goods_type_name":"货物类型","heavy_cargo":"重泡货类型"},
                ignorecase: true,
                showHeader: true,
                showBtn: false,     //不显示下拉按钮
                delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
                idField: "goods_no",
                keyField: "goods_name",
                allowNoKeyword: true,
                getDataMethod: "url",
                clearable: false,
                autoDropup:false,
                inputWarnColor:'white',
//                listStyle:{'height':'200px','transition': '0.3s'},
                fnPreprocessKeyword: function(keyword) {
                    //请求数据前，对输入关键字作预处理
                    var custom_no=$("#custom_no").val();
                    return 'search=goods_name&keyword=' + keyword+"&page="+filter+"&custom_no="+custom_no;
                 }
            }).on('onDataRequestSuccess', function (e, result) {

            }).on('onSetSelectValue', function (e, keyword, data) {
                if (grid==undefined)
                {
                    if (column!=undefined){column.forEach(function(i){$("#"+i).val(data[i]);})}
                }
                else
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var formcolumn=i;
                            var tocolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                formcolumn=colarray[0];
                                tocolumn=colarray[1];
                            }
                            $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+tocolumn+'"]').html(data[formcolumn]);
                        })
                    }
                }
                
            }).on('onUnsetSelectValue', function () {
                if (grid==undefined)
                {
                    if (column!=undefined)
                    {
                        column.forEach(function(i){
                            $("#"+i).val('');
                        })
                    }
                }
                else
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var tocolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                tocolumn=colarray[1];
                            }
                            $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+tocolumn+'"]').html('');
                        })
                    }
                }
            });
          break;
        case "货主信息":
              //货主下拉框
            $("#"+id).bsSuggest({
                url: "/base_manage/custom_manage/GetCustomDropdownList",
                effectiveFields: ["custom_name","custom_user","custom_tel","custom_address"],
                effectiveFieldsAlias:{custom_name: "供应商/货主",custom_user:"供应商/货主",custom_tel:"货主电话",custom_address:"货主地址"},
                ignorecase: true,
                showHeader: true,
                showBtn: false,     //不显示下拉按钮
                delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
                idField: "custom_no",
                keyField: "custom_name",
                allowNoKeyword: true,
                getDataMethod: "url",
                clearable: false,
                autoDropup:true,
                inputWarnColor:'white',
                fnPreprocessKeyword: function(keyword) {
                    //请求数据前，对输入关键字作预处理
                    return 'search=custom_name&keyword=' + keyword+"&page="+filter;
                 }
            }).on('onDataRequestSuccess', function (e, result) {

            }).on('onSetSelectValue', function (e, keyword, data) {
                if (grid==undefined)
                {
                    if (column!=undefined){column.forEach(function(i){$("#"+i).val(data[i]);})}
                }
                else
                {
                    
                }
                
            }).on('onUnsetSelectValue', function () {
                if (grid==undefined)
                {
                    if (column!=undefined)
                    {
                        column.forEach(function(i){
                            $("#"+tocolumn).val('');
                        })
                    }
                }
                else
                {
                    
                }
            });
          break;
          case "供应商信息":
            //货主下拉框
            $("#" + id).bsSuggest({
                url: "/base_manage/supplier_manage/GetSupplierDropdownList",
                effectiveFields: ["supplier_name", "supplier_user", "supplier_tel", "supplier_address"],
                effectiveFieldsAlias: { supplier_name: "供应商名称", supplier_user: "供应商人员", supplier_tel: "供应商电话", supplier_address: "供应商地址" },
                ignorecase: true,
                showHeader: true,
                showBtn: false,     //不显示下拉按钮
                delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
                idField: "supplier_no",
                keyField: "supplier_name",
                allowNoKeyword: true,
                getDataMethod: "url",
                clearable: false,
                autoDropup: true,
                inputWarnColor: 'white',
                listStyle: { 'height': '300px', 'transition': '0.3s' },
                fnPreprocessKeyword: function (keyword) {
                    //请求数据前，对输入关键字作预处理
                    return 'search=supplier_name&keyword=' + keyword + "&page=" + filter;
                }
            }).on('onDataRequestSuccess', function (e, result) {

            }).on('onSetSelectValue', function (e, keyword, data) {
                if (grid == undefined) {
                    if (column != undefined) { column.forEach(function (i) { $("#" + i).val(data[i]); }) }
                }
                else {
                    
                }

            }).on('onUnsetSelectValue', function () {
                if (grid == undefined) {
                    if (column != undefined) {
                        column.forEach(function (i) {
                            $("#" + tocolumn).val('');
                        })
                    }
                }
                else {

                }
            });
            break;
          // 添加 合同号 zj 2018/01/25
          case "合同号":
            $("#"+id).bsSuggest({
                url: "/base_manage/custom_manage/GetContractNoList",
                effectiveFields: ["contract_no"],
                effectiveFieldsAlias:{contract_no: "合同号"},
                ignorecase: true,
                showHeader: false,
                showBtn: false,     //不显示下拉按钮
                delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
                idField: "contract_no",
                keyField: "contract_no",
                allowNoKeyword: true,
                getDataMethod: "url",
                clearable: false,
                autoDropup:true,
                inputWarnColor:'white',
                fnPreprocessKeyword: function(keyword) {
                    //请求数据前，对输入关键字作预处理
                    var custom_no=$("#custom_no").val();
                    return 'search=contract_no&keyword=' + keyword+"&page="+filter+"&custom_no="+custom_no;
                 }
            }).on('onDataRequestSuccess', function (e, result) {

            }).on('onSetSelectValue', function (e, keyword, data) {
                if (grid==undefined)
                {
                    if (column!=undefined){column.forEach(function(i){$("#"+i).val(data[i]);})}
                }
                else
                {
                    
                }
                
            }).on('onUnsetSelectValue', function () {
                if (grid==undefined)
                {
                    if (column!=undefined)
                    {
                        column.forEach(function(i){
                            $("#"+tocolumn).val('');
                        })
                    }
                }
                else
                {
                    
                }
            });
          break;
          // 站点信息
        case "站点信息":
            $("#"+id).bsSuggest({
                url: "/warehouse_manage/warehouse_transfer_out/GetCustomDropdownList",
                effectiveFields: ["branch_name","branch_address","branch_manager","branch_tel"],
                effectiveFieldsAlias:{branch_name:"站点名称",branch_address:"目的地址",branch_manager:"联系人员",branch_tel:"联系电话"},
                ignorecase: true,
                showHeader: true,
                showBtn: false,     //不显示下拉按钮
                delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
                idField: "branch_no",
                keyField: "branch_name",
                allowNoKeyword: true,
                getDataMethod: "url",
                clearable: false,
                autoDropup:true,
                inputWarnColor:'white',
                fnPreprocessKeyword: function(keyword) {
                    //请求数据前，对输入关键字作预处理
                    return 'search=custom_name&keyword=' + keyword;
                 }
            }).on('onDataRequestSuccess', function (e, result) {

            }).on('onSetSelectValue', function (e, keyword, data) {
                if (grid==undefined)
                {
                    if (column!=undefined){column.forEach(function(i){
                            var tocolumn=i;
                            var fromcolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                fromcolumn=colarray[0];
                                tocolumn=colarray[1];
                            }
                            $("#"+tocolumn).val(data[fromcolumn]);
                    })}
                }
                else
                {
                    
                }
                
            }).on('onUnsetSelectValue', function () {
                if (grid==undefined)
                {
                    if (column!=undefined)
                    {
                        column.forEach(function(i){
                            $("#"+i).val('');
                        })
                    }
                }
                else
                {
                    
                }
            });
          break;

        case "货主人员信息":
            $("#"+id).bsSuggest({
               url: "/base_manage/base_contancts_manage/GetContactsDropdownList",
               effectiveFields: ["contacts_name","contacts_dept_name","contact_tel","contacts_email"],
               effectiveFieldsAlias:{contacts_name:"联系人员",contacts_dept_name:"联系部门",contact_tel:"联系电话",contacts_email:"联系邮箱"},
               ignorecase: true,
               showHeader: true,
               showBtn: false,     //不显示下拉按钮
               delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
               idField: "contacts_name",
               keyField: "contacts_name",
               allowNoKeyword: true,
               getDataMethod: "url",
               clearable: false,
               autoDropup:true,
               inputWarnColor:'white',
               fnPreprocessKeyword: function(keyword) {
                   //请求数据前，对输入关键字作预处理
                       return 'search=contancts_name&keyword=' + keyword+"&custom_no="+$("#custom_no").val();
                   }
           }).on('onDataRequestSuccess', function (e, result) {
               
           }).on('onSetSelectValue', function (e, keyword, data) {
                if (grid==undefined)
                {
                    if (column!=undefined){column.forEach(function(i){$("#"+i).val(data[i]);})}
                }
                else
                {
                    if (column!=undefined){column.forEach(function(i){
                        $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+i+'"]').html(data[i]);
                    })}
                }
            }).on('onUnsetSelectValue', function () {
                if (grid==undefined)
                {
                    if (column!=undefined){column.forEach(function(i){$("#"+i).val();})}
                }
                else
                {
                    if (column!=undefined){column.forEach(function(i){
                        $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+i+'"]').html('');
                    })}
                }
            });
          break;          
        case "人员信息":
            $("#"+id).bsSuggest({
               url: "/base_manage/user_manage/GetUserDropdownList",
               effectiveFields: ["user_name"],
               effectiveFieldsAlias:{user_name:"名称"},
               ignorecase: true,
               showHeader: false,
               showBtn: false,     //不显示下拉按钮
               delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
               idField: "user_no",
               keyField: "user_name",
               allowNoKeyword: true,
               getDataMethod: "url",
               clearable: false,
               autoDropup:true,
               inputWarnColor:'white',
               fnPreprocessKeyword: function(keyword) {
                   //请求数据前，对输入关键字作预处理
                       return 'search=user_name&keyword=' + keyword;
                   }
           }).on('onDataRequestSuccess', function (e, result) {
               
           }).on('onSetSelectValue', function (e, keyword, data) {
                if (grid==undefined)
                {
                    if (column!=undefined){column.forEach(function(i){$("#"+i).val(data[i]);})}
                }
                else
                {
                    if (column!=undefined){column.forEach(function(i){
                        $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+i+'"]').html(data[i]);
                    })}
                }
            }).on('onUnsetSelectValue', function () {
                if (grid==undefined)
                {
                    if (column!=undefined){column.forEach(function(i){$("#"+i).val();})}
                }
                else
                {
                    if (column!=undefined){column.forEach(function(i){
                        $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+i+'"]').html('');
                    })}
                }
            });
          break;
        case "仓库信息":
            $("#"+id).bsSuggest({
               url: "/base_manage/warehouse_manage/GetWarehouseDropdownList",
               effectiveFields: ["warehouse_name"],
               effectiveFieldsAlias:{user_name:"名称"},
               ignorecase: true,
               showHeader: false,
               showBtn: false,     //不显示下拉按钮
               delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
               idField: "warehouse_no",
               keyField: "warehouse_name",
               allowNoKeyword: true,
               getDataMethod: "url",
               clearable: false,
               autoDropup:false,
               inputWarnColor:'white',
               fnPreprocessKeyword: function(keyword) {
                   //请求数据前，对输入关键字作预处理
                       return 'search=warehouse_name&keyword=' + keyword;
                   }
           }).on('onDataRequestSuccess', function (e, result) {
               
            }).on('onSetSelectValue', function (e, keyword, data) {
                if (grid==undefined)
                {
                    if (column!=undefined){column.forEach(function(i){$("#"+i).val(data[i]);})}
                }
                else
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var formcolumn=i;
                            var tocolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                formcolumn=colarray[0];
                                tocolumn=colarray[1];
                            }
//                            console.log("rowid:"+rowid+"   formcolumn:"+formcolumn+"   tocolumn:"+tocolumn+"  value:"+data[formcolumn]+"   "+'td[aria-describedby="'+grid+'_'+tocolumn+'"]');
                            $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+tocolumn+'"]').html(data[formcolumn]);
                        })
                    }
                }
            }).on('onUnsetSelectValue', function () {
                if (grid==undefined)
                {
                    if (column!=undefined){column.forEach(function(i){$("#"+i).val();})}
                }
                else
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var tocolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                tocolumn=colarray[1];
                            }
                            $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+tocolumn+'"]').html('');
                        })
                    }
                }
            });
          break;
        case "库位信息":
            $("#"+id).bsSuggest({
               url: "/base_manage/location_manage/GetLocationDropdownList",
               effectiveFields: ["location_name"],
               effectiveFieldsAlias:{user_name:"名称"},
               ignorecase: true,
               showHeader: false,
               showBtn: false,     //不显示下拉按钮
               delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
               idField: "location_no",
               keyField: "location_name",
               allowNoKeyword: true,
               getDataMethod: "url",
               clearable: false,
               autoDropup:false,
               inputWarnColor:'white',
               listStyle:{'height':'160px','transition': '0.3s'},
               fnPreprocessKeyword: function(keyword) {
                   //请求数据前，对输入关键字作预处理
                       return 'search=location_name&keyword=' + keyword+'&warehouse_no='+filter;
                   }
           }).on('onDataRequestSuccess', function (e, result) {
           }).on('onSetSelectValue', function (e, keyword, data) {
                if (grid==undefined)
                {
                    if (column!=undefined){column.forEach(function(i){$("#"+i).val(data[i]);})}
                }
                else
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var formcolumn=i;
                            var tocolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                formcolumn=colarray[0];
                                tocolumn=colarray[1];
                            }
                            console.log("rowid:"+rowid+"   formcolumn:"+formcolumn+"   tocolumn:"+tocolumn+"  value:"+data[formcolumn]+"   "+'td[aria-describedby="'+grid+'_'+tocolumn+'"]');
                            $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+tocolumn+'"]').html(data[formcolumn]);
                        })
                    }
                }
            }).on('onUnsetSelectValue', function () {
                if (grid==undefined)
                {
                    if (column!=undefined){column.forEach(function(i){$("#"+i).val();})}
                }
                else
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var tocolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                tocolumn=colarray[1];
                            }
                            $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+tocolumn+'"]').html('');
                        })
                    }
                }
            });
          break;
        case "学校信息":
                $("#"+id).bsSuggest({
                   url: "/base_manage/school_manage/GetSchoolDropdownList",
                   effectiveFields: ["school_name"],
                   effectiveFieldsAlias:{school_name:"名称"},
                   ignorecase: true,
                   showHeader: false,
                   showBtn: false,     //不显示下拉按钮
                   delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
                   idField: "school_no",
                   keyField: "school_name",
                   allowNoKeyword: true,
                   getDataMethod: "url",
                   clearable: false,
                   autoDropup:false,
                   inputWarnColor:'white',
                   listStyle:{'height':'160px','transition': '0.3s'},
                   fnPreprocessKeyword: function(keyword) {
                       //请求数据前，对输入关键字作预处理
                           return 'search=school_name&keyword=' + keyword;
                       }
               }).on('onDataRequestSuccess', function (e, result) {
               }).on('onSetSelectValue', function (e, keyword, data) {
                    if (grid==undefined)
                    {
                        if (column!=undefined){column.forEach(function(i){$("#"+i).val(data[i]);})}
                    }
                    else
                    {
                        console.log(column);
                        if (column!=undefined){
                            column.forEach(function(i){
                                var formcolumn=i;
                                var tocolumn=i;
                                var colarray=i.split(":");
                                if (colarray.length>1){
                                    formcolumn=colarray[0];
                                    tocolumn=colarray[1];
                                }
                                console.log("rowid:"+rowid+"   formcolumn:"+formcolumn+"   tocolumn:"+tocolumn+"  value:"+data[formcolumn]+"   "+'td[aria-describedby="'+grid+'_'+tocolumn+'"]');
                                $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+tocolumn+'"]').html(data[formcolumn]);
                            })
                        }
                    }
                }).on('onUnsetSelectValue', function () {
                    if (grid==undefined)
                    {
                        if (column!=undefined){column.forEach(function(i){$("#"+i).val();})}
                    }
                    else
                    {
                        if (column!=undefined){
                            column.forEach(function(i){
                                var tocolumn=i;
                                var colarray=i.split(":");
                                if (colarray.length>1){
                                    tocolumn=colarray[1];
                                }
                                $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+tocolumn+'"]').html('');
                            })
                        }
                    }
                });
              break;

          case "网点信息":
            $("#"+id).bsSuggest({
               url: "/check_manage/partner_check/GetDonDotpdownList",
               effectiveFields: ["carrier_name","branch_name","branch_manager","branch_address"],
               effectiveFieldsAlias:{carrier_name:"公司名称",branch_name:"分站名称",branch_manager:"联系人",branch_address:"分站地址"},
               ignorecase: true,
               showHeader: true,
               showBtn: false,     //不显示下拉按钮
               delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
               idField: "carrier_no",
               keyField: "carrier_name",
               allowNoKeyword: true,
               getDataMethod: "url",
               clearable: false,
               autoDropup:false,
               inputWarnColor:'white',
               fnPreprocessKeyword: function(keyword) {
                   //请求数据前，对输入关键字作预处理
                       // return 'search=warehouse_name&keyword=' + keyword;
                       return 'types='+filter+'&keyword=' + keyword;
                   }
           }).on('onDataRequestSuccess', function (e, result) {
                if ((result.value).length <= 0 || old_keyword != new_keyword ) {
                    if (grid==undefined)
                    {
                        if (column!=undefined)
                        {
                            column.forEach(function(i){
                                var tocolumn=i;
                                var fromcolumn=i;
                                var colarray=i.split(":");
                                if (colarray.length>1){
                                    fromcolumn=colarray[0];
                                    tocolumn=colarray[1];
                                }
                                if(tocolumn!=id){
                                    $("#"+tocolumn).val('');
                                }
                            });
                        }
                    }
                };
                old_keyword = new_keyword;

            }).on('onSetSelectValue', function (e, keyword, data) {

                if (grid==undefined)
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var formcolumn=i;
                            var tocolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                formcolumn=colarray[0];
                                tocolumn=colarray[1];
                                $("#"+tocolumn).val(data[formcolumn]);
                                console.log(tocolumn+'   '+data[formcolumn]);
                            }else{
                                $("#"+i).val(data[i]);
                            }
                        });
                        

                    }
                }
                else
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var formcolumn=i;
                            var tocolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                formcolumn=colarray[0];
                                tocolumn=colarray[1];
                            }
                            $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+tocolumn+'"]').html(data[formcolumn]);
                        })
                    }
                }
            }).on('onUnsetSelectValue', function () {
                if (grid==undefined)
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var tocolumn=i;
                            var fromcolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                fromcolumn=colarray[0];
                                tocolumn=colarray[1];
                            }
                            if(tocolumn!=id){
                                $("#"+tocolumn).val('');
                            }
                        });
                     

                    }
                }
                else
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var tocolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                tocolumn=colarray[1];
                            }
                            $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+tocolumn+'"]').html('');
                        })
                    }
                }
            });
          break;

        case "承运方信息":
           $("#"+id).bsSuggest({
                url: "/ts_manage/carrier_manage/GetCarrierDropdownList",
                effectiveFields: ["carrier_name","carrier_user","carrier_tel","carrier_type"],
                effectiveFieldsAlias:{carrier_name: "承运方名称",carrier_user: "联系人员",carrier_tel: "联系电话",carrier_type:"类型"},
                ignorecase: true,
                showHeader: true,
                showBtn: false,     //不显示下拉按钮
                delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
                idField: "carrier_no",
                keyField: "carrier_name",
                allowNoKeyword: true,
                getDataMethod: "url",
                clearable: false,
                autoDropup:true,
                fnPreprocessKeyword: function(keyword) {
                    new_keyword = keyword;
                    //请求数据前，对输入关键字作预处理
                    return 'search=carrier_name&carrier_type='+filter+'&keyword=' + keyword;
                }
            }).on('onDataRequestSuccess', function (e, result) {

                if ((result.value).length <= 0 || old_keyword != new_keyword ) {
                    if (grid==undefined)
                    {
                        if (column!=undefined)
                        {
                            column.forEach(function(i){
                                var tocolumn=i;
                                var fromcolumn=i;
                                var colarray=i.split(":");
                                if (colarray.length>1){
                                    fromcolumn=colarray[0];
                                    tocolumn=colarray[1];
                                }
                                if(tocolumn!=id){
                                    $("#"+tocolumn).val('');
                                }
                            });
                        }
                    }
                };
                old_keyword = new_keyword;

            }).on('onSetSelectValue', function (e, keyword, data) {
                if (grid==undefined)
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var formcolumn=i;
                            var tocolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                formcolumn=colarray[0];
                                tocolumn=colarray[1];
                                $("#"+tocolumn).val(data[formcolumn]);
                            }else{
                                $("#"+i).val(data[i]);
                            }
                        });
                        

                    }
                }
                else
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var formcolumn=i;
                            var tocolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                formcolumn=colarray[0];
                                tocolumn=colarray[1];
                            }
                            $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+tocolumn+'"]').html(data[formcolumn]);
                        })
                    }
                }
            }).on('onUnsetSelectValue', function () {
                if (grid==undefined)
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var tocolumn=i;
                            var fromcolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                fromcolumn=colarray[0];
                                tocolumn=colarray[1];
                            }
                            if(tocolumn!=id){
                                $("#"+tocolumn).val('');
                            }
                        });
                     

                    }
                }
                else
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var tocolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                tocolumn=colarray[1];
                            }
                            $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+tocolumn+'"]').html('');
                        })
                    }
                }
            });
            break;
        case "收货单位":
           $("#"+id).bsSuggest({
                url: "/base_manage/receiver_manage/GetAllReceiverDropdownList",
                effectiveFields: ["receiver_name","receiver_user","receiver_tel","receiver_address"],
                effectiveFieldsAlias:{receiver_name: "收货方",receiver_tel:"收货电话",receiver_user:"收货人",receiver_address:"收货地址"},
                ignorecase: true,
                showHeader: true,
                showBtn: false,     //不显示下拉按钮
                delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
                idField: "receiver_no",
                keyField: "receiver_name",
                allowNoKeyword: true,
                getDataMethod: "url",
                clearable: false,
                autoDropup:true,
                fnPreprocessKeyword: function(keyword) {
                    //请求数据前，对输入关键字作预处理
                    return 'search=receiver_name&custom_no='+$("#custom_no").val()+'&keyword=' + keyword;
                }
            }).on('onSetSelectValue', function (e, keyword, data) {
                if (grid==undefined)
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var formcolumn=i;
                            var tocolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                formcolumn=colarray[0];
                                tocolumn=colarray[1];
                                $("#"+tocolumn).val(data[formcolumn]);
                            }else{
                                $("#"+i).val(data[i]);
                            }
                        });
                        

                    }
                }
                else
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var formcolumn=i;
                            var tocolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                formcolumn=colarray[0];
                                tocolumn=colarray[1];
                            }
                            $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+tocolumn+'"]').html(data[formcolumn]);
                        })
                    }
                }
                
            }).on('onUnsetSelectValue', function () {
                if (grid==undefined)
                {
                    if (column!=undefined)
                    {
                        column.forEach(function(i){
                            $("#"+i).val('');
                        })
                    }
                }
                else
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var tocolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                tocolumn=colarray[1];
                            }
                            $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+tocolumn+'"]').html('');
                        })
                    }
                }
            });
            break;
        case "发货方信息":
            $("#"+id).bsSuggest({
                url: "/base_manage/custom_manage/GetCustomDropdownList",
                effectiveFields: ["custom_name","custom_user","custom_tel","custom_address"],
                effectiveFieldsAlias:{custom_name: "发货方",custom_user:"发货人",custom_tel:"发货电话",custom_address:"发货地址"},
                ignorecase: true,
                showHeader: true,
                showBtn: false,     //不显示下拉按钮
                delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
                idField: "custom_no",
                keyField: "custom_name",
                allowNoKeyword: true,
                getDataMethod: "url",
                clearable: false,
                autoDropup:true,
                inputWarnColor:'white',
                fnPreprocessKeyword: function(keyword) {
                    //请求数据前，对输入关键字作预处理
                    $(".bs-suggest-container").each(function(){$(this).css("display",""); });
                        return 'search=custom_name&keyword=' + keyword;
                    }
            }).on('onDataRequestSuccess', function (e, result) {

            }).on('onSetSelectValue', function (e, keyword, data) {
                $("#custom_no").val(data.custom_no);
                $("#custom_user").val(data.custom_user);
                $("#custom_tel").val(data.custom_tel);
                $("#custom_address").val(data.custom_address);
            }).on('onUnsetSelectValue', function () {
                $("#custom_no").val('');
            });
            break;
        case "发货人员":
            $("#"+id).bsSuggest({
                url: "/base_manage/custom_manage/GetCustomDropdownList",
                effectiveFields: ["custom_name","custom_user","custom_tel","custom_address"],
                effectiveFieldsAlias:{custom_name: "发货方",custom_user:"发货人",custom_tel:"发货电话",custom_address:"发货地址"},
                ignorecase: true,
                showHeader: true,
                showBtn: false,     //不显示下拉按钮
                delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
                idField: "custom_user",
                keyField: "custom_user",
                allowNoKeyword: true,
                getDataMethod: "url",
                clearable: false,
                autoDropup:true,
                inputWarnColor:'white',
                fnPreprocessKeyword: function(keyword) {
                    //请求数据前，对输入关键字作预处理
                   $(".bs-suggest-container").each(function(){$(this).css("display",""); });
                        return 'search=custom_user&custom_no='+$("#custom_no").val()+'&keyword=' + keyword;
                    }
            }).on('onDataRequestSuccess', function (e, result) {
                 $(".bs-suggest-container").each(function(){  });
            });
            break;
        case "发货电话":
            $("#"+id).bsSuggest({
                url: "/base_manage/custom_manage/GetCustomDropdownList",
                effectiveFields: ["custom_name","custom_user","custom_tel","custom_address"],
                effectiveFieldsAlias:{custom_name: "发货方",custom_user:"发货人",custom_tel:"发货电话",custom_address:"发货地址"},
                ignorecase: true,
                showHeader: true,
                showBtn: false,     //不显示下拉按钮
                delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
                idField: "custom_tel",
                keyField: "custom_tel",
                allowNoKeyword: true,
                getDataMethod: "url",
                clearable: false,
                autoDropup:true,
                inputWarnColor:'white',
                fnPreprocessKeyword: function(keyword) {
                    //请求数据前，对输入关键字作预处理
                    $(".bs-suggest-container").each(function(){$(this).css("display",""); });
                    return 'search=custom_tel&custom_no='+$("#custom_no").val()+'&keyword=' + keyword;
                }
            }).on('onDataRequestSuccess', function (e, result) {
            });
            break;
        case "发货地址":
            $("#"+id).bsSuggest({
               url: "/base_manage/custom_manage/GetCustomDropdownList",
               effectiveFields: ["custom_name","custom_user","custom_tel","custom_address"],
               effectiveFieldsAlias:{custom_name: "发货方",custom_user:"发货人",custom_tel:"发货电话",custom_address:"发货地址"},
               ignorecase: true,
               showHeader: true,
               showBtn: false,     //不显示下拉按钮
               idField: "custom_address",
               keyField: "custom_address",
               allowNoKeyword: true,
               getDataMethod: "url",
               clearable: false,
               autoDropup:true,
               inputWarnColor:'white',
               fnPreprocessKeyword: function(keyword) {
                   //请求数据前，对输入关键字作预处理
                      $(".bs-suggest-container").each(function(){$(this).css("display",""); });
                   return 'search=custom_address&custom_no='+$("#custom_no").val()+'&keyword=' + keyword;
                   }
           }).on('onDataRequestSuccess', function (e, result) {

           });
            break;
        case "收货方信息":
           $("#"+id).bsSuggest({
                url: "/base_manage/receiver_manage/GetReceiverDropdownList",
                effectiveFields: ["receiver_name","receiver_user","receiver_tel","receiver_address"],
                effectiveFieldsAlias:{receiver_name: "收货方",receiver_tel:"收货电话",receiver_user:"收货人",receiver_address:"收货地址"},
                ignorecase: true,
                showHeader: true,
                showBtn: false,     //不显示下拉按钮
                delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
                idField: "receiver_no",
                keyField: "receiver_name",
                allowNoKeyword: true,
                getDataMethod: "url",
                clearable: false,
                autoDropup:true,
                fnPreprocessKeyword: function(keyword) {
                    //请求数据前，对输入关键字作预处理
                    return 'search=receiver_name&custom_no='+$("#custom_no").val()+'&keyword=' + keyword;
                }
            }).on('onSetSelectValue', function (e, keyword, data) {
                if (grid==undefined)
                {
                    if (column!=undefined){column.forEach(function(i){$("#"+i).val(data[i]);})}
                    $("#receiver_no").val(data.receiver_no);
                    $("#carrier_no").val(data.carrier_no);
                    $("#receiver_user").val(data.receiver_user);
                    $("#receiver_tel").val(data.receiver_tel);
                    $("#receiver_address").val(data.receiver_address);
                }
                else
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var formcolumn=i;
                            var tocolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                formcolumn=colarray[0];
                                tocolumn=colarray[1];
                            }
                            $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+tocolumn+'"]').html(data[formcolumn]);
                        })
                    }
                }
                
            }).on('onUnsetSelectValue', function () {
                if (grid==undefined)
                {
                    if (column!=undefined)
                    {
                        column.forEach(function(i){
                            $("#"+i).val('');
                        })
                    }
                    $("#receiver_no").val('');
                }
                else
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var tocolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                tocolumn=colarray[1];
                            }
                            $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+tocolumn+'"]').html('');
                        })
                    }
                }
            });
            break;
        case "收货人员":
            $("#"+id).bsSuggest({
                url: "/base_manage/receiver_manage/GetReceiverDropdownList",
                effectiveFields: ["receiver_name","receiver_user","receiver_tel","receiver_address"],
                effectiveFieldsAlias:{receiver_name: "收货方",receiver_tel:"收货电话",receiver_user:"收货人",receiver_address:"收货地址"},
                ignorecase: true,
                showHeader: true,
                showBtn: false,     //不显示下拉按钮
                delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
                idField: "receiver_no",
                keyField: "receiver_user",
                allowNoKeyword: true,
                getDataMethod: "url",
                clearable: false,
                autoDropup:true,
                inputWarnColor:'white',
                fnPreprocessKeyword: function(keyword) {
                    //请求数据前，对输入关键字作预处理
                    $(".bs-suggest-container").each(function(){$(this).css("display",""); });
                    return 'search=receiver_user&custom_no='+$("#custom_no").val()+'&receiver_no='+$("#receiver_no").val()+'&keyword=' + keyword;
                }
            });
            break;
        case "收货电话":
            $("#"+id).bsSuggest({
                url: "/base_manage/receiver_manage/GetReceiverDropdownList",
                effectiveFields: ["receiver_name","receiver_user","receiver_tel","receiver_address"],
                effectiveFieldsAlias:{receiver_name: "收货方",receiver_tel:"收货电话",receiver_user:"收货人",receiver_address:"收货地址"},
                ignorecase: true,
                showHeader: true,
                showBtn: false,     //不显示下拉按钮
                delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
                idField: "receiver_no",
                keyField: "receiver_tel",
                allowNoKeyword: true,
                getDataMethod: "url",
                clearable: false,
                autoDropup:true,
                inputWarnColor:'white',
                fnPreprocessKeyword: function(keyword) {
                    //请求数据前，对输入关键字作预处理
                       $(".bs-suggest-container").each(function(){

                           $(this).css("display","");
                       });
                        return 'search=custom_tel&custom_no='+$("#custom_no").val()+'receiver_no='+$("#receiver_no").val()+'&keyword=' + keyword;
                    }
            });
            break;
        case "收货地址":
            $("#"+id).bsSuggest({
               url: "/base_manage/receiver_manage/GetReceiverDropdownList",
               effectiveFields: ["receiver_name","receiver_user","receiver_tel","receiver_address"],
               effectiveFieldsAlias:{receiver_name: "收货方",receiver_tel:"收货电话",receiver_user:"收货人",receiver_address:"收货地址"},
               ignorecase: true,
               showHeader: true,
               showBtn: false,     //不显示下拉按钮
               delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
               idField: "receiver_no",
               keyField: "receiver_address",
               allowNoKeyword: true,
               getDataMethod: "url",
               clearable: false,
               autoDropup:true,
               inputWarnColor:'white',
               fnPreprocessKeyword: function(keyword) {
                   //请求数据前，对输入关键字作预处理
                       $(".bs-suggest-container").each(function(){
                           $(this).css("display",""); });
                       return 'search=receiver_address&custom_no='+$("#custom_no").val()+'receiver_no='+$('#receiver_no').val()+'&keyword=' + keyword;
                   }
           });
            break;
        case "通用字典":
            $("#"+id).attr("readonly","true");
            $("#"+id).bsSuggest({
                url: "/base_manage/dataitem_manage/GetItemDropdownList",
                effectiveFields: ["detail_name"],
                effectiveFieldsAlias:{detail_name: "名称"},
                ignorecase: true,
                showHeader: false,
                showBtn: false,     //不显示下拉按钮
                delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
                idField: "detail_no",
                keyField: "detail_name",
                allowNoKeyword: true,
                getDataMethod: "url",
                clearable: false,
                autoDropup:true,
                fnPreprocessKeyword: function(keyword) {
                    //请求数据前，对输入关键字作预处理
                        return 'keyword='+para;
                    }
            }).on('onSetSelectValue', function (e, keyword, data) {
                if (grid==undefined)
                {
                    if (typeof FeeCompute==="function")
                    {
                        FeeCompute();
                    }
                    if (typeof Ts_Banlance_Owed==="function")
                    {
                        Ts_Banlance_Owed();
                    }
                    if (column != undefined) {
                        column.forEach(function (i) {
                            var tocolumn = i;
                            var colarray = i.split(":");
                            if (colarray.length > 1) {
                                var fromcolumn = colarray[0];
                                tocolumn = colarray[1];
                                $("#" + tocolumn).val(data[fromcolumn]);
                            }
                            else {
                                $("#" + tocolumn).val(data[i]);
                            }
                            
                        })
                    }
                }
                else
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var formcolumn=i;
                            var tocolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                formcolumn=colarray[0];
                                tocolumn=colarray[1];
                            }
                            $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+tocolumn+'"]').html(data[formcolumn]);
                        })
                    }
                }
                
            }).on('onUnsetSelectValue', function () {
                if (grid==undefined)
                {
                   if (column != undefined) {
                        column.forEach(function (i) {
                            var tocolumn = i;
                            var colarray = i.split(":");
                            if (colarray.length > 1) {
                                tocolumn = colarray[1];
                                $("#" + tocolumn).val('');
                            }
                            else {
                                $("#" + tocolumn).val('');
                            }
                            
                        })
                    }
                }
                else
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var tocolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                tocolumn=colarray[1];
                            }
                            $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+tocolumn+'"]').html('');
                        })
                    }
                }
            });
            break;
        case "批量修改":
                $("#"+id).bsSuggest({
                    url: "/system_manage/system_config/GetUpdateDropdownList",
                    effectiveFields: ["detail_name"],
                    effectiveFieldsAlias:{detail_name: "名称"},
                    ignorecase: true,
                    showHeader: false,
                    showBtn: false,     //不显示下拉按钮
                    delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
                    idField: "detail_no",
                    keyField: "detail_name",
                    allowNoKeyword: true,
                    getDataMethod: "url",
                    clearable: false,
                    autoDropup:true,
                    fnPreprocessKeyword: function(keyword) {
                        //请求数据前，对输入关键字作预处理
                        var filter=$("#update_name").val();
                            return 'keyword='+para+'&filter='+filter;
                        }
                }).on('onSetSelectValue', function (e, keyword, data) {
                       if (id=="update_name"){$("#update_value").val("");}   
                });
                break;
        case "结算单位":
                $("#"+id).bsSuggest({
                    url: "/system_manage/system_config/GetUpdateDropdownList",
                    effectiveFields: ["detail_name"],
                    effectiveFieldsAlias:{detail_name: "名称"},
                    ignorecase: true,
                    showHeader: false,
                    showBtn: false,     //不显示下拉按钮
                    delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
                    idField: "detail_no",
                    keyField: "detail_name",
                    allowNoKeyword: true,
                    getDataMethod: "url",
                    clearable: false,
                    autoDropup:true,
                    fnPreprocessKeyword: function(keyword) {
                        //请求数据前，对输入关键字作预处理
                        var filter=$("#update_name").val();
                            return 'keyword='+para+'&filter='+filter;
                        }
                }).on('onSetSelectValue', function (e, keyword, data) {
                      $("#check_object_no").val(data.check_object_no); 
                });
                break;
        case "数据导入":
                $("#"+id).bsSuggest({
                    url: "/system_manage/system_config/GetImportDropdownList",
                    effectiveFields: ["grid_name"],
                    effectiveFieldsAlias:{detail_name: "导入名称"},
                    ignorecase: true,
                    showHeader: false,
                    showBtn: false,     //不显示下拉按钮
                    delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
                    idField: "grid_id",
                    keyField: "grid_name",
                    allowNoKeyword: true,
                    getDataMethod: "url",
                    clearable: false,
                    autoDropup:true,
                    fnPreprocessKeyword: function(keyword) {
                        //请求数据前，对输入关键字作预处理
                            return 'keyword='+para+'&filter='+filter;
                        }
                }).on('onSetSelectValue', function (e, keyword, data) {
                    grid_id=data.grid_id;
                    $("#grid_id").val(data.grid_id);   
                    $("#table_name").val(data.table_name);   
                    InitControl(data.grid_code);
                });
                break;
        case '报价信息':
            $("#"+id).bsSuggest({
                url: "/n_dispatch_manage/n_dispatch_push/GetLineDropdownList?ts_no="+filter,
                effectiveFields: ["cust_id","car_no","car_tel","grab_price",'grab_at','car_id'],
                effectiveFieldsAlias:{cust_id: "司机编号",car_no:"车牌号",car_tel:"联系电话",grab_price:"报价金额",grab_at:'报价时间',car_id:'车源编号'},
                ignorecase: true,
                showHeader: true,
                showBtn: false,     //不显示下拉按钮
                delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
                idField: "cust_id",
                keyField: "car_id",
                allowNoKeyword: true,
                getDataMethod: "url",
                clearable: false,
                autoDropup:true,
                inputWarnColor:'#f4fddd',
                fnPreprocessKeyword: function(keyword) {
                    //请求数据前，对输入关键字作预处理
                    return 'keyword=' + keyword;
                }
            }).on('onSetSelectValue', function (e, keyword, data) {
                $("#gridTable tr[id='"+filter+"']").find('td[aria-describedby="gridTable_driver"]').html(data.car_no);
                $("#gridTable tr[id='"+filter+"']").find('td[aria-describedby="gridTable_grab_price"]').html(data.grab_price);
                $("#gridTable tr[id='"+filter+"']").find('td[aria-describedby="gridTable_car_tel"]').html(data.car_tel);
                $("#gridTable tr[id='"+filter+"']").find('td[aria-describedby="gridTable_grab_at"]').html(data.grab_at);
                $("#gridTable tr[id='"+filter+"']").find('td[aria-describedby="gridTable_cust_id"]').html(data.cust_id);
                $("#gridTable tr[id='"+filter+"']").find('td[aria-describedby="gridTable_car_id"]').html(data.car_id);
                $("#gridTable tr[id='"+filter+"']").find('input[id="'+this.id+'"]').val(data.cust_id);

            });
            break;
        case "运输站点":
                $("#"+id).bsSuggest({
                    url: "/base_manage/branch_manage/GetBranchDropdownList",
                    effectiveFields: ["branch_name"],
                    effectiveFieldsAlias:{branch_name: "站点名称"},
                    ignorecase: true,
                    showHeader: false,
                    showBtn: false,     //不显示下拉按钮
                    delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
                    idField: "branch_no",
                    keyField: "branch_name",
                    allowNoKeyword: true,
                    getDataMethod: "url",
                    listAlign:"left",
                    clearable: false,
                    autoDropup:true,
                    inputWarnColor:'white',
                    fnPreprocessKeyword: function(keyword) {
                        //请求数据前，对输入关键字作预处理
                        $(".bs-suggest-container").each(function(){$(this).css("display",""); });
                            return 'search=branch_name&keyword=' + keyword;
                        },
                    fnprocessData: function(json){

                        return data;
                    }
                }).on('onSetSelectValue', function (e, keyword, data) {
                if (grid==undefined)
                {
                    if (column != undefined) {
                        column.forEach(function (i) {
                            var tocolumn = i;
                            var colarray = i.split(":");
                            if (colarray.length > 1) {
                                var fromcolumn = colarray[0];
                                tocolumn = colarray[1];
                                $("#" + tocolumn).val(data[fromcolumn]);
                            }
                            else {
                                $("#" + tocolumn).val(data[i]);
                            }
                            
                        })
                    }
                }
                else
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var formcolumn=i;
                            var tocolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                formcolumn=colarray[0];
                                tocolumn=colarray[1];
                            }
                            $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+tocolumn+'"]').html(data[formcolumn]);
                        })
                    }
                }
                
            }).on('onUnsetSelectValue', function () {
                if (grid==undefined)
                {
                    if (column != undefined) {
                        column.forEach(function (i) {
                            var tocolumn = i;
                            var colarray = i.split(":");
                            if (colarray.length > 1) {
                                tocolumn = colarray[1];
                                $("#" + tocolumn).val('');
                            }
                            else {
                                $("#" + tocolumn).val('');
                            }
                            
                        })
                    }
                }
                else
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var tocolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                tocolumn=colarray[1];
                            }
                            $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+tocolumn+'"]').html('');
                        })
                    }
                }
            });
            break;
        case "收发省份":
                $("#"+id).bsSuggest({
                   url: "/base_manage/logistics_manage/GetProvinceDropdownList?limit=10",
                   effectiveFields: ["name"],
                   effectiveFieldsAlias:{name:"名称"},
                   ignorecase: true,
                   showHeader: false,
                   showBtn: false,     //不显示下拉按钮
                   delayUntilKeyup: true, //获取数据的方式为 firstByUrl 时，延迟到有输入/获取到焦点时才请求数据
                   idField: "id",
                   keyField: "name",
                   allowNoKeyword: true,
                   getDataMethod: "url",
                   clearable: false,
                   autoDropup:true,
                   inputWarnColor:'white',
                   fnPreprocessKeyword: function(keyword) {
                       //请求数据前，对输入关键字作预处理
                           return 'search=user_name&keyword=' + keyword;
                       }
               }).on('onSetSelectValue', function (e, keyword, data) {
                if (grid==undefined)
                {
                    if (column != undefined) {
                        column.forEach(function (i) {
                            var tocolumn = i;
                            var colarray = i.split(":");
                            if (colarray.length > 1) {
                                var fromcolumn = colarray[0];
                                tocolumn = colarray[1];
                                $("#" + tocolumn).val(data[fromcolumn]);
                            }
                            else {
                                $("#" + tocolumn).val(data[i]);
                            }
                            
                        })
                    }
                }
                else
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var formcolumn=i;
                            var tocolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                formcolumn=colarray[0];
                                tocolumn=colarray[1];
                            }
                            $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+tocolumn+'"]').html(data[formcolumn]);
                        })
                    }
                }
                
            }).on('onUnsetSelectValue', function () {
                if (grid==undefined)
                {
                    if (column != undefined) {
                        column.forEach(function (i) {
                            var tocolumn = i;
                            var colarray = i.split(":");
                            if (colarray.length > 1) {
                                tocolumn = colarray[1];
                                $("#" + tocolumn).val('');
                            }
                            else {
                                $("#" + tocolumn).val('');
                            }
                            
                        })
                    }
                }
                else
                {
                    if (column!=undefined){
                        column.forEach(function(i){
                            var tocolumn=i;
                            var colarray=i.split(":");
                            if (colarray.length>1){
                                tocolumn=colarray[1];
                            }
                            $("#"+grid+" tr[id='"+rowid+"']").find('td[aria-describedby="'+grid+'_'+tocolumn+'"]').html('');
                        })
                    }
                }
            });
            break;
        default:
          break;
    }
}
