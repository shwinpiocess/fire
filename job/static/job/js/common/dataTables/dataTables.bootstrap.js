/*! DataTables Bootstrap 3 integration
 * ©2011-2014 SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for Bootstrap 3. This requires Bootstrap 3 and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
 * for further information.
 */
(function(window, document, undefined){

var factory = function( $, DataTable ) {
"use strict";


/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	dom:
		"<'row'<'col-sm-6'l><'col-sm-6'f>>" +
		"<'row'<'col-sm-12'tr>>" +
		"<'row'<'col-sm-5'i><'col-sm-7'p>>",
	renderer: 'bootstrap'
} );


/* Default class modification */
$.extend( DataTable.ext.classes, {
	sWrapper:      "dataTables_wrapper form-inline dt-bootstrap",
	sFilterInput:  "form-control input-sm",
	sLengthSelect: "form-control input-sm"
} );


/* Bootstrap paging button renderer */
DataTable.ext.renderer.pageButton.bootstrap = function ( settings, host, idx, buttons, page, pages ) {
	var api     = new DataTable.Api( settings );
	var classes = settings.oClasses;
	var lang    = settings.oLanguage.oPaginate;
	var btnDisplay, btnClass, counter=0;

	var attach = function( container, buttons ) {
		var i, ien, node, button, clip;
		var clickHandler = function ( e ) {
			e.preventDefault();
			if ( !$(e.currentTarget).hasClass('disabled') ) {
				api.page( e.data.action ).draw( false );
			}
		};

		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( $.isArray( button ) ) {
				attach( container, button );
			}
			else {
				btnDisplay = '';
				btnClass = '';

				switch ( button ) {
					case 'ellipsis':
						btnDisplay = '&hellip;';
						btnClass = 'disabled';
						break;

					case 'first':
						btnDisplay = lang.sFirst;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'previous':
						btnDisplay = lang.sPrevious;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'next':
						btnDisplay = lang.sNext;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					case 'last':
						btnDisplay = lang.sLast;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;
						
					case 'input':
						btnDisplay = '<input type="text" class="d-go-input" style="width:30px;height:24px;text-align:center;"/>';
						break;
						
					case 'copy':
						btnDisplay = lang.copy;
						break;
						
					default:
						btnDisplay = button + 1;
						btnClass = page === button ?
							'active' : '';
						break;
				}
				if ( btnDisplay ) {
					if (button == 'input'){
						node = $('<li>', {
								'class': classes.sPageButton+' '+btnClass,
								'id': idx === 0 && typeof button === 'string' ?
									settings.sTableId +'_'+ button :
									null
							}).append( $('<span>', {
								'class' : 'd-go',
								'style' : 'padding:3px 12px;'
							}).html(btnDisplay)).appendTo( container );
						$(node).find('.d-go-input').val(page+1);
						$(node).on('blur','.d-go-input',function(e){
							$(e.currentTarget).val(page+1);
						})
						$(node).on('keyup','.d-go-input',function(e){
							var value = $(e.currentTarget).val();
							if(!/^[1-9]*[1-9][0-9]*$/.test(value)){
								$(e.currentTarget).val(page+1);
								return ;
							}
							if(e.keyCode === 13 && parseInt(value)!== page+1 ){
								if(parseInt(value)>pages){
									value = pages;
								}
								api.page(value-1).draw( false );
							}
						})
						counter++;
					}else{
						node = $('<li>', {
							'class': classes.sPageButton+' '+btnClass,
							'id': idx === 0 && typeof button === 'string' ?
								settings.sTableId +'_'+ button :
								null
						} )
						.append( $('<a>', {
								'href': '#',
								'aria-controls': settings.sTableId,
								'data-dt-idx': counter,
								'tabindex': settings.iTabIndex
							} )
							.html( btnDisplay )
						)
						.appendTo( container );
						if(button === 'copy'){
							//混入复制Ip组件
							ZeroClipboard.config({ moviePath: './js/common/ux/ZeroClipboard/ZeroClipboard.swf'});
							clip = new ZeroClipboard($(node).find('a'));
							clip.on('mousedown',function(){
	//							$.trigger('copyIp',[api.data(),clip])
								var data = api.data(), ips =[];
								for(var i=0,len = data.length; i< len ; i++){
									if(data[i].ip){
										ips.push(data[i].ip);
									}
								}
								if(ips.length>0){
									clip.setText(ips.join('\n'));
									printMsg('复制成功！',1);
								}
							});
						}else{
							settings.oApi._fnBindAction(
									node, {action: button}, clickHandler
							);
						}
						counter++;
					}
				}
			}
		}
	};

	// IE9 throws an 'unknown error' if document.activeElement is used
	// inside an iframe or frame. 
	var activeEl;

	try {
		// Because this approach is destroying and recreating the paging
		// elements, focus is lost on the select button which is bad for
		// accessibility. So we want to restore focus once the draw has
		// completed
		activeEl = $(document.activeElement).data('dt-idx');
	}
	catch (e) {}

	attach(
		$(host).empty().html('<ul class="pagination"/>').children('ul'),
		buttons
	);

	if ( activeEl ) {
		$(host).find( '[data-dt-idx='+activeEl+']' ).focus();
	}
};


/*
 * TableTools Bootstrap compatibility
 * Required TableTools 2.1+
 */
if ( DataTable.TableTools ) {
	// Set the classes that TableTools uses to something suitable for Bootstrap
	$.extend( true, DataTable.TableTools.classes, {
		"container": "DTTT btn-group",
		"buttons": {
			"normal": "btn btn-default",
			"disabled": "disabled"
		},
		"collection": {
			"container": "DTTT_dropdown dropdown-menu",
			"buttons": {
				"normal": "",
				"disabled": "disabled"
			}
		},
		"print": {
			"info": "DTTT_print_info"
		},
		"select": {
			"row": "active"
		}
	} );

	// Have the collection use a bootstrap compatible drop down
	$.extend( true, DataTable.TableTools.DEFAULTS.oTags, {
		"collection": {
			"container": "ul",
			"button": "li",
			"liner": "a"
		}
	} );
}

}; // /factory


// Define as an AMD module if possible
if ( typeof define === 'function' && define.amd ) {
	define( ['jquery', 'datatables'], factory );
}
else if ( typeof exports === 'object' ) {
    // Node/CommonJS
    factory( require('jquery'), require('datatables') );
}
else if ( jQuery ) {
	// Otherwise simply initialise as normal, stopping multiple evaluation
	factory( jQuery, jQuery.fn.dataTable );
}


})(window, document);

