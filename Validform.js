/*

	demo 1:
		//表单在提交时验证
		$('#check_form').Validform();	
		//调用这个方法是直接验证
		$('#check_form').Validform(1);

	demo 2:
		//自定义错误提示
		var v_alert = function(message){
			alert(message);
		}

		$('#check_form').Validform({
			auto : 1,	//1：直接进行验证，否：表单在提交时进行验证
			
			//验证前置方法
			before : function(response){
				
				return true;
			},
			//验证后置方法
			after : function(response){
				
				//return true;
			}
		});
		
		before,after方法可以放自定义验证，返回值为true时验证通过，否则将视为不通过
		response ：表单对象
		
*/


jQuery.fn.extend({
	
	Validform: function(param) {

		if(param === 1 || ( typeof param == 'object' && param.auto == 1)){
			return $(this).v_init(param);	
		}

		this.submit(function(){
			return $(this).v_init(param);
		});
  	},
	v_init : function(fn){
		
		if(  typeof fn == 'object' && fn.before ) {
			if( fn.before($(this)) != true ) return false;
		}
		if( $(this).v_null() != true ) return false;
		if( $(this).v_length() != true ) return false;
		if( $(this).v_mobile() != true ) return false;
		if( $(this).v_email() != true ) return false;
		if( $(this).v_phone() != true ) return false;
		if( $(this).v_repeat() != true ) return false;
		if( $(this).v_characters() != true ) return false;
		if( $(this).v_notcharacters() != true ) return false;
		if( $(this).v_figure() != true ) return false;
		if( typeof fn == 'object' && fn.after ) {
			if( fn.after($(this)) != true ) return false;
		}
		
		return true;
	},
	v_alert : function(sign){
		var message = $(this).attr(sign);
		if(typeof v_alert != 'undefined') {
			v_alert(message);
			return true;
		}
		if(typeof layer != 'undefined'){
			layer.msg(message, function(){
				//关闭后的操作
			});
		}else{
			alert(message);
		}
	},
	/*
		判断是否为空
	*/
	is_empty : function(){
		var value = this.val();
		if( (value != '') && ( value != 'undefined' ) ){
			return false;
		}else{
			return true;
		}
	},
	/*
		不能为空
		<input class="verify_notnull" notnull="不许为空" value="" />
	*/
	v_null : function(){
		var obj = $(this).find(".verify_notnull");
		for( i=0; i<=obj.length-1;i++){
			if(obj.eq(i).is_empty()){
				obj.eq(i).v_alert('notnull');
				return false;
			}
		}
		return true;
	},
	/*
		验证长度
		<input class="verify_length" lengthmsg="提示信息" length="3-9" />
	*/
	v_length : function (){
		var obj=$(this).find(".verify_length");
		for( i=0; i <= obj.length-1;i++){
			var rule=obj.eq(i).attr('length');
			if( rule ){
				rule = rule.split("-");	//分割
				var objlength=obj.eq(i).val().length;	//表单值的长度
				if( (objlength < rule[0]) || (objlength > rule[1]) ){
					obj.eq(i).v_alert('lengthmsg');
					return false;
				}
			}
		}
		return true;
	},
	/*
		手机号码验证 存在则验证
		<input mobilemsg="请输出正确的手机号码" class="verify_mobile" />
	*/
	v_mobile : function(){
		var obj=$(this).find('.verify_mobile');
		for( i=0; i <= obj.length-1;i++){
			var mobile=obj.eq(i).val();
			if(mobile){
				var re=/^(1[0-9]{10})$/;   
				if(!re.test(mobile)){      
					obj.eq(i).v_alert('mobilemsg');	
					return false;
				}
			}
		}
		return true;
	},
	/*
		邮箱验证  存在则验证
		<input type="text"  class="verify_email" emailmsg="邮箱输入有误"  />
	*/
	v_email : function(){
		var obj = $(this).find(".verify_email");
		for( i=0; i <= obj.length-1;i++){
			var email=obj.eq(i).val();
			if(email){
				var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
				if(!re.test(email)){
					obj.eq(i).v_alert('emailmsg');	 
					return false;
				}
			}
		}	
		return true;
	},
	/*
		电话号码认证
			验证规则：区号+号码，区号以0开头，3位或4位
		 	号码由7位或8位数字组成
		 	区号与号码之间可以无连接符，也可以“-”连接
		 	如01088888888,010-88888888,0955-7777777 
			
		<input type="text"  class="verify_phone" phonemsg="电话号码输入有误" value="" />
	*/
	v_phone : function(){
		var obj = $(this).find('.verify_phone');
		for( i=0; i <= obj.length-1;i++){
			var phone=obj.eq(i).val();
			if(phone){
				var re = /^0\d{2,3}-?\d{7,8}$/;
				if(!re.test(phone)){ 
					obj.eq(i).v_alert('phonemsg');		
					return false;
				}
			}
		}	
		return true;
	},
	/*
		重复验证
		<input type="text"  class="aa" /></br>
		<input type="text"  class="verify_repeat" verify_repeat=".aa" repeatmsg="两次输入不一致" value="" /></br>
	 */
	 v_repeat : function(){
		var obj = $(this).find('.verify_repeat');	//获取
		for( i=0; i <=obj.length-1; i++){
			var re_value=obj.eq(i).val();	//获取二次输入的值
			var recheck = obj.eq(i).attr('verify_repeat');	//获取要验证的对象
			if( (recheck != 'undefined') && (recheck != "") ){
				var value = $(recheck).val();
				if(value && value != re_value){
					obj.eq(i).v_alert('repeatmsg');			
					return false;
				}
			}	
		}
		return true;
	},
	
	/*
	 *	只允许为汉字 、
	 *		不能含有汉字	/[\u4e00-\u9fa5]+/
	 *		只允许汉字	/^[\u4e00-\u9fa5]+$/   汉字 true  非汉字 false
	 *		<input type="text"  class="verify_characters" charactersmsg="只允许为汉字" value="" />
	 */
	v_characters : function(){
		var obj = $(this).find(".verify_characters");
		for( i=0; i <= obj.length-1;i++){
			var re=/^[\u4e00-\u9fa5]+$/;
			if( !obj.eq(i).is_empty() && !re.test(obj.eq(i).val()) ){	
				obj.eq(i).v_alert('charactersmsg');			
				return false;
			}	
		}	 
		return true;
	},
	
	/*
	 *	不能含有汉字、
	 *		不能含有汉字	/[\u4e00-\u9fa5]+/
	 *		只允许汉字	/^[\u4e00-\u9fa5]+$/   汉字 true  非汉字 false
	 *		<input type="text"  class="verify_notcharacters" notcharactersmsg="不能含汉字" value="" />
	 */
	v_notcharacters : function(){
		var obj = $(this).find(".verify_notcharacters");
		for( i=0; i <= obj.length-1;i++){
			var re=	/[\u4e00-\u9fa5]+/;
			if( !obj.eq(i).is_empty() && re.test(obj.eq(i).val()) ){	
				obj.eq(i).v_alert('notcharactersmsg');			
				return false;
			}	
		}	 
		return true;
	},
	
	
	/*
	 *	不为空时，只允许为数字 
	 *
	 *	<input type="txt" class="verify_figure"   figuremsg="提示"  />
	 */
	v_figure : function(){
		var obj = $(this).find('.verify_figure');
		for( i=0; i <= obj.length-1;i++){
			var re=/^\d+$/;
			if( !obj.eq(i).is_empty() && !re.test(obj.eq(i).val()) ){	
				obj.eq(i).v_alert('figuremsg');		
				return false;
			}	
		}	 
		return true;
	}
	
	
	
	
	
	
  	
  
});







