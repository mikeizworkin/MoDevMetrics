/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */



String.join = function(list, seperator){
	var output = "";

	for(var i = 0; i < list.length; i++){
		if (output != "") output += seperator;
		output += list[i];
	}//for
	return output;
};

//RETURN THE STRING BETWEEN THE start AND end
//IF end IS UNDEFINED, THEN GRABS TO END OF STRING
String.prototype.between=function(start, end){
	var s=this.indexOf(start);
	if (s==-1) return null;
	s+=start.length;
	if (end===undefined) return this.substring(s);

	var e=this.indexOf(end, s);
	if (e==-1) return null;
	return this.substring(s, e);
};


String.prototype.indent=function(numTabs){
	var indent="\t\t\t\t\t\t".left(numTabs);
	return indent+this.toString().replaceAll("\n", "\n"+indent);
};

String.prototype.rtrim=function(value){
	if (value===undefined) value=" ";

	var i=this.length-1;
	for(;i>=0;i--) if (this.charAt(i)!=value) break;

	return this.substring(0, i+1);
};

String.prototype.startsWith=function(value){
	return this.substring(0, value.length)==value;
};


/// REPLACE ALL INSTANCES OF find WITH REPLACE, ONLY ONCE
String.prototype.replaceAll = function(find, replace){
	return this.split(find).join(replace);
};//method



String.prototype.deformat = function(){
	var output=[];
	for(var i=0;i<this.length;i++){
		var c=this.charAt(i);
		if ((c>='a' && c<='z') || (c>='0' && c<='9')){
			output.push(c);
		}else if (c>='A' && c<='Z'){
			output.push(String.fromCharCode(c.charCodeAt(0)+32));
		}//endif
	}//for
	return output.join("");
};//method



///
/// EXPECTING AN OBJECT WITH KEY VALUE PAIRS
String.prototype.replaceVars = function(values){
	var output = Map.jsonCopy(this);

	while(true){
		var s = output.indexOf('{');
		if (s < 0) return output;
		var e = output.indexOf('}', s);
		if (e < 0) return output;
		var key = output.substring(s + 1, e);
		if (output.substring(s + 1, e) in values){
			output = output.replace(output.substring(s, e + 1), values[key]);
		}//endif
	}//while
};//method

String.prototype.left = function(amount){
	return this.substring(0, aMath.min(this.length, amount));
};//method

String.prototype.right = function(amount){
	return this.substring(this.length - amount);
};//method

String.prototype.leftBut = function(amount){
	return this.substring(0, this.length - amount);
};//method

String.prototype.rightBut = function(amount){
	return this.substring(amount, this.length);
};//method

String.prototype.endsWith=function(value){
	return this.substring(this.length - value.length)==value;
};//method