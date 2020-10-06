//creating modules and understanding the features of module before proceeding to the Budget controller app
// var budgetcontroller =(function (){
// 	x=5
// 	function add(b){
// 		return x+b;
// 	}
// 	return {
// 		publicState: function(b){
// 			return add(b);
// 		}
// 	}



// })();

// var controller =(function(bud){
// 	var z=bud.publicState(7);
// 	return {
// 		another: function(){
// 			console.log(z)
// 		}
// 	}


// 		}
//  )(budgetcontroller);
 


var budgetcontroller=(function(){
	var Expense=function(id,description,value){
		this.id=id
		this.description=description
		this.value=value
		this.percentage=-1
	};
	var Income=function(id,description,value){
		this.id=id
		this.description=description
		this.value=value

	};
	Expense.prototype.calculatepercentage=function(totalincome){
		if(totalincome>0){
		this.percentage=Math.round((this.value/totalincome)*100)
		}
		else{
			this.percentage=-1
		}

	};
	Expense.prototype.getpercentage=function(){
		return this.percentage;
	}
	function calculatetotal(type){
		var sum=0;
		data.allitems[type].forEach( function(curr) {
			sum+=curr.value;
			// statements
		});
		data.total[type]=sum;
	}
	var data={
		allitems:{
			inc:[],
			exp:[]
		},
		total:{
			inc:0,
			exp:0
		},
		budget:0,
		percentage:-1
	};
	return {
		addItem:function(type,des,val){
			var newItem, ID;
			//create new ID 
			if (data.allitems[type].length>0){
			ID=data.allitems[type][data.allitems[type].length-1].id+1;
		  }  
		else {
			ID=0;
		} 

    		//create new item based on 'inc' or'exp' type
			if (type==='exp'){
				newItem=new Expense(ID,des,val)

			}
			else if(type=='inc'){
				newItem=new Income(ID,des,val)
			}
			//push it into out data structures
			data.allitems[type].push(newItem);
			//return the new element
			return newItem;
		},
		calculatebudget: function(){  

			//total of budget 
			calculatetotal('inc');
			calculatetotal('exp');


			//store total budget inc-exp
			data.budget=data.total.inc-data.total.exp;

			//percentage of budget
			if(data.total.inc>0)
			{
			data.percentage=Math.round((data.total.exp/data.total.inc)*100);
			}
			else{
				percentage=-1;
			}

		},
		calculatepercentage:function(){
			data.allitems.exp.forEach( function(current) {
				current.calculatepercentage(data.total.inc);
				// statements
			});
		},
		getpercentage:function(){
			el=data.allitems.exp.map(function(current){
				return current.getpercentage();

			});
			return el;
		},
		getbudget: function(){
			return{
			budget:data.budget,  
			totalinc:data.total.inc,
			totalexp:data.total.exp,
			percentage:data.percentage
		}
		},
		 deleteItem: function(type, id) {
            var ids, index;
            
            // id = 6
            //data.allItems[type][id];
            // ids = [1 2 4  8]
            //index = 3
            
            ids = data.allitems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allitems[type].splice(index, 1);
            }
            
        },
        
		testing:function(){
			console.log(data);
		}
	};







})();
var UIcontroller = (function(){
	var DOMstring={
		input:'.add__type',
		description:'.add__description',
		value:'.add__value',
		button:'.add__btn',
		incomeContainer:'.income__list',
		expenseContainer:'.expenses__list',
		budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container:'.container',
        expercenLabel:'.item__percentage',
        displaydate:'.budget__title--month'
	}
		function formatNumber(num,type){
			var tosplit,int,dec;
			num=Math.abs(num);
			num=num.toFixed(2);
			tosplit=num.split('.')
			int=tosplit[0];
			if(int.length>3){
				int=int.substr(0,int.length-3) + ' , ' +int.substr(int.length-3,3);
			}
			dec=tosplit[1];

			return (type==='exp'?'-':'+')+ ' ' + int +'.'+ dec;
			
		}
			function nodeListForEach(list,callback){
				for (i=0;i<list.length;i++){
					callback(list[i],i);
				}
			};




	return{
		getinput: function()
		{
		return{
		type: document.querySelector(DOMstring.input).value,//will be either inc or exp
		description: document.querySelector(DOMstring.description).value,
		value:parseFloat(document.querySelector(DOMstring.value).value)
		}	
	},
	
		addlistitem: function(obj,type){
			var html
			//create html string with placeholder
			if(type==='inc'){
				element=DOMstring.incomeContainer;


			html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}
			else if(type==='exp'){
				element=DOMstring.expenseContainer;
			html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			//replace the placeholder text with some actual data
			newhtml=html.replace('%id%',obj.id);
			newhtml=newhtml.replace('%description%',obj.description);
			newhtml=newhtml.replace('%value%',formatNumber(obj.value,type));
			//Insert the html into dom 
			document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);




		},
		deletelistItem: function(selectId){
			el=document.getElementById(selectId);
			el.parentNode.removeChild(el);
		},
		clearfields:function(){
			var fields ,newfields;
			fields=document.querySelectorAll(DOMstring.description + ', ' + DOMstring.value);
			newfields=Array.prototype.slice.call(fields);
			newfields.forEach(function(current, index, array){
				current.value="";
			});
			newfields[0].focus();


		},
		displaybudget: function(obj){
			var type;
			obj.budget>0?type='inc':type='exp';
			document.querySelector(DOMstring.budgetLabel).textContent = formatNumber(obj.budget,type);
			document.querySelector(DOMstring.incomeLabel).textContent =  formatNumber(obj.totalinc,'inc');
			document.querySelector(DOMstring.expensesLabel).textContent =  formatNumber(obj.totalexp,'exp');

				if(obj.percentage>0)
				{
				document.querySelector(DOMstring.percentageLabel).textContent = obj.percentage + '%';
				}
				else{
					document.querySelector(DOMstring.percentageLabel).textContent = '---';

				}


			

		},
		displayDate: function(){
			var now,year,month,months;
			now =new Date();
			months=['january','february','march','april','may','june','july','august','september','october','november','december'];
			month=now.getMonth();
			year=now.getFullYear();
			
			document.querySelector(DOMstring.displaydate).textContent=months[month] + ' ' + year;


		},
		changedtype: function(){
			fields =document.querySelectorAll(
				DOMstring.input +','+ DOMstring.description + ',' +DOMstring.value);

			nodeListForEach(fields,function(current){
				current.classList.toggle('red-focus')
			});
			document.querySelector(DOMstring.button).classList.toggle('red');

		},
		displayPercentage: function(percentage){
			var fields=document.querySelectorAll(DOMstring.expercenLabel);

		


			nodeListForEach(fields,function(current,index){
				if(percentage[index]>0){


				current.textContent=percentage[index] +'%';

				}
				else{
					current.textContent='---';
				}


			});

		},

		getdata: function(){
	
		return DOMstring;

		}

	};



})();
// function addctrl(){
// 	//1.get the filled input data
// 		//2. add the item to the budget controller
// 		//3.add the item to the UI
// 		//4. Calculate the budget
// 		//5. Display the budget on the UI
// 		console.log('its clicked')

// }

var controller =(function(budget,UIctrl){
	var data=UIctrl.getdata();

	var setupeventListner = function(){
		document.querySelector(data.button).addEventListener('click',addctrl);
		
	
	document.addEventListener('keypress',function(event){
		if(event.keypress===13||event.which===13){
			addctrl();
		}
		
			
	});
	document.querySelector(data.container).addEventListener('click',deletectrl);
	
	document.querySelector(data.input).addEventListener('change',UIctrl.changedtype); 

	};
	function budgetupdate(){


		//4. Calculate the budget
		budget.calculatebudget();
		//return the budget6
		Budget=budget.getbudget();
		//diplay the budget on the UI
		UIctrl.displaybudget(Budget);
	}
	function deletectrl(event){
		var ItemId, splitId,Id,type;
		ItemId=event.target.parentNode.parentNode.parentNode.parentNode.id;
		if(ItemId)
		{
		splitId =ItemId.split('-');
		type=splitId[0];
		Id=parseInt(splitId[1]);
		// 1. delete the item from the data structure
		budget.deleteItem(type,Id);
		 // 2. Delete the item from the UI

		UIctrl.deletelistItem(ItemId);
		 // 3. Update and show the new budget

		budgetupdate();
	}
	}
	function updatepercentages(){

		//1.calculate percentages
		budget.calculatepercentage();

		//.read percentages from the budget controller.
		var getpercent=budget.getpercentage();

		//3.update the ui with the new percentages
		UIctrl.displayPercentage(getpercent);
	}


	function addctrl(){
		var input, newitem;

	//1.get the filled input data
	
	    input=UIctrl.getinput();
	    if (input.description !== '' && input.value>0)
	{

		//2. add the item to the budget controller
		newitem=budget.addItem(input.type,input.description,input.value);
		//3.add the item to the UI
		UIctrl.addlistitem(newitem,input.type);
		//clear the fields
		UIctrl.clearfields();
		//5. Display the budget on the UI
		budgetupdate();
		
		updatepercentages();
		
	}	
	}
	

	return {
		init: function(){
		console.log('application got started')
		UIctrl.displayDate();
		budgetupdate({
			budget:0,
			totalinc:0,
			totalexp:0,
			percentage:0

		});

			setupeventListner();
		}
	}



})(budgetcontroller,UIcontroller);



controller.init();





// function init() {
//   var name = 'Mozilla'; // name is a local variable created by init
//   function displayName() { // displayName() is the inner function, a closure
//     alert(name); // use variable declared in the parent function
//   }
//   displayName();
// }
// init();










