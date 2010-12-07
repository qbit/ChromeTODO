var Options = {

	config: {
		debug: 1,
		save_status_div: "status",
		check_boxes: [
			group1 = {
				dest_div : "debug_opts_div",
				buttons: [
					debug = [ "debug" ]
				]
			}
		]
	},


	init: function() {
		Options.make_check( Options.config.check_boxes );
	},

	save: function( name, val ) {
		if ( Options.debug ) {
			console.log( "Saving %s in %s", val, name );
		}
		localStorage[ name ] = val;

		chrome.extension.getBackgroundPage().reload();

		var stat = document.getElementById( Options.config.save_status_div );
		stat.style.display = 'block';

		window.setTimeout( function() {
			stat.style.display = 'none';
		}, 2000 );
	},

	make_radio: function( config ) {
		for ( var i = 0; i < config.length; i++ ) {
			for ( var j = 0; j < config[i].buttons.length; j++ ) {
				var radio_div = document.createElement( "div" );
				var div_text = document.createTextNode( config[i].buttons[j] );

				var radio = document.createElement( "input" );
				radio.id = config[i].buttons[j].toLowerCase();
				radio.value = config[i].buttons[j];
				radio.type = 'radio';
				radio.name = 'group' + i;

				radio.onchange = function() {
					for ( var i = 0; i < config.length; i++ ) {
						for ( var j = 0; j < config[i].buttons.length; j++ ) {
							var cb = config[i].buttons[j].toLowerCase();
							var item = document.getElementById( cb );
							Options.save( item.id, item.checked );
						}
					}
				};

				if ( j === 0 ) {
					radio.checked = 'selected';
				}

				if ( localStorage[ radio.id ] + '' == 'true' ) {
					radio.checked = localStorage[ radio.id ];
					has_setting = true;
				}

				radio_div.appendChild( radio );
				radio_div.appendChild( div_text );
				document.getElementById( config[i].dest_div ).appendChild( radio_div );
			}
		}
	},

	make_check: function( config ) {
		for ( var i = 0; i < config.length; i++ ) {
			for ( var j = 0; j < config[i].buttons.length; j++ ) {
				var check = document.createElement( "input" );
				check.id = config[i].buttons[j];
				check.type = "checkbox";
				check.name = config[i].buttons[j];

				check.onchange = function() {
					var current = this;
					Options.save( current.name, current.checked );
				};

				if ( localStorage[ check.name ] + '' == 'true' ) {
					check.checked = localStorage[ check.name ];
				}

				document.getElementById( config[i].dest_div ).appendChild( check );
			}
		}
	},

	make_select: function( config ) {
		select = document.createElement( "select" );
		select.name = config.select_name;
		select.id = config.select_name;

		select.onchange = function() {
			var current = this.options[ this.selectedIndex ];
			Options.save( config.select_name, current.value );
		};

		for ( var i = 0; i < config.options.length; i++ ) {
			var t = document.createElement( "option" );
			value = config.options[i].toLowerCase().replace( ' ', '_' );

			t.value = value;
			t.text = config.options[i];


			var save_name = config.select_name;
			if ( localStorage[ save_name ] && value == localStorage[ save_name ] ) {
				t.selected = "selected";
			}

			select.appendChild( t );
		}

		document.getElementById( config.dest_div ).appendChild( select );
	}
};
