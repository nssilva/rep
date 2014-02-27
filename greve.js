Ext.onReady(function(){

	 Ext.QuickTips.init();

	Ext.define("HAGreve",{
		extend:'Ext.data.Model',
		fields : [{
			name : 'Descricao',
			mapping : 'description'	
		},{
			name: 'Link',
			mapping:'source_link',
		},{
			name:'TodoDia',
			mapping:'all_day',
		},{
			name:'Cancelada',
			mapping:'canceled'
		},{
			name : 'Companhia',
			mapping : "company['name']"	
		},{
			name : 'Data_Início',
			mapping : 'start_date'
		},{
			name : 'Data_Fim',
			mapping : 'end_date'
		}],
	});
					
	var store = Ext.create("Ext.data.Store",{
		model:'HAGreve',
		proxy:{
			type:'jsonp',
			callbackKey: 'callback',
			url:'http://hagreve.com/api/v1/strikes',
			headers:{'Accept':'application/json'},
			reader: {
				type: 'json',
				root: 'root'
			}
		},
		listeners:{
			load:{
				fn:function(store, record, options){
					store.loaded=true;
					//log.log('store loaded');
				}
			}
		}
						
	}).load();
					
	var grid = Ext.create('Ext.grid.Panel',{
		store:store,
		//x:(window.innerWidth)/2-(950/2),
		//y:200,
		width:950,
		//height:150,
		//pageSize:2,
		//itemId:'gridHaGreve',
		columnLines:true,
		bbar:['<em>&copy; 2014 '+ Ext.String.format('<a href="http://www.vidalnelson.no.sapo.pt" target="_blank" title="Nelson Silva">Nelson Silva</a>')+'</em>', 
			{xtype:'tbfill'}],
		columns:[{
			text:'Empresa',
			dataIndex:'Companhia',
			flex:1,
			align:'left',
			style: 'text-align:center',
			renderer: function(value, meta) { 
				if (value === 'CP' || value === 'Refer') { 
					meta.tdCls = 'CP-cell'; 
				return 'CP/Refer'; 
				}else if(value === 'Fertagus'){
					meta.tdCls = 'CP-cell'
					return 'Fertagus';
				}
				meta.tdCls = 'Carris-cell'; 
					return 'Carris'; 
				}
		},{
			text:'Descrição', 
			dataIndex:'Descricao',
			flex:2,
			align:'left',
			style: 'text-align:center',
			renderer:addTooltip
		},{
			text:'Data Início', 
			dataIndex:'Data_Início',
			flex:1.5,
			align:'left',
			style: 'text-align:center',
		},{
			text:'Data de Fim', 
			dataIndex:'Data_Fim',
			flex:1.5,
			align:'left',
			style: 'text-align:center',
		},{
			text:'Fonte', 
			dataIndex:'Link',
			width: 200, 
			align:'left',
			style: 'text-align:center',
			renderer: function(value) {
				return Ext.String.format('<a href="{0}" target="_blank">{1}</a>', value, value)
			}
		},{
			text:'Duração', 
			dataIndex:'TodoDia',
			renderer:duration,
			flex:1,
			align:'left',
			style: 'text-align:center',
		},{
			text:'Cancelada',
			dataIndex:'Cancelada',
			flex:1,
			align:'left',
			style: 'text-align:center',
			renderer:canceled
		}],
	});
	
	//Ext.getCmp('gridHaGreve').getTopToolbar().getEl().dom.style.background = 'red';
	// override da classe window para fazer a animação.
	Ext.window.Window.override({
		animateTarget: Ext.getDoc(), //animate on show/close from top left of document
		maximize: function(){
			this.callParent([true]); //animate
		},
		restore: function(){
			this.callParent([true]); //animate
		}  
	});
	/////////fim da função override
				//var win = Ext.create	
	var win = Ext.create('Ext.window.Window',{
		layout:'fit',
		title:'Há Greve?',
		//maximizable:true,
		iconCls:'icon-greve',
		border:false,
		constrain: true,
		height:250,
		width:950,
		autoShow:true,
		draggable:true,
		resizable:false,
		x:(window.innerWidth)/2-(950/2),
		y:200,
		items:[grid],
		tools:[{
			type:'refresh',
			handler:function(event, toolEl, panelHeader){
				store.reload();
			}
		}],
		//renderTo:Ext.getBody().show();
	});
					
	/* Ext.EventManager.onWindowResize(function (){
		grid.setSize(undefined, undefined);
	}); */
	//store.load(function(records){
		//Ext.Array.each(records, function(arr, index) {
			/*console.log(arr.data.Descricao);
			console.log(arr.data.Link);
			if(arr.data.Cancelada == true){
				var cancelada = 'A greve foi cancelada'
			}else{
				var cancelada = 'A greve está em vigor'
			}
			if(arr.data.TodoDia == true){
				var todoodia = 'A greve dura o dia todo'
			}else{
				var todoodia = 'Não está prevista a duração do dia todo'
			}
			console.log(todoodia);
			console.log(cancelada);
			console.log(arr.data.Companhia['name']);
			console.log(arr.data.Data_Início);
			console.log(arr.data.Data_Fim);
		});*/
		//store.load();
		/* Ext.EventManager.onWindowResize(function () {
			var tmpHeight = Ext.getBody().getViewSize().height - 160;
			var height = Ext.getBody().getViewSize().height - 140;
			grid.setSize(width, height);

		});*/
});

	function addTooltip(value, metadata){ // função tooltip para a grid.
		metadata.tdAttr = 'data-qtip="' + value + '"';
    return value;
	}
	
	var canceled = function(value, metadata, record, rowIndex, colIndex, store, view){
		
		var valcolors = new Array();
						
		if(value == true){
			value = 'Sim';
			valcolors.push('sim');
							
		}else if(value == false){
			value = 'Não';
			valcolors.push('nao');
		}
		valcolors.forEach(function(val){
			if(val == 'nao'){
				metadata.tdAttr = 'style="background-color:red;color:black;"';
			}else if(val == 'sim'){
				metadata.tdAttr = 'style="background-color:green;color:black;"';
			}
		});
			return value;
	}
					
	var duration = function(value){
		if(value==true){
			value = "Todo o dia";
		}else{
			value = "Parcial";
		}
			return value;
	}
					
	var log ={
		log:function(msg){
			console.log(msg);
		}
	}
	var bug = {
		debug:function(){
			debugger;
		}
	}