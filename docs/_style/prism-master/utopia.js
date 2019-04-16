/**
 * Utopia: A JavaScript util library that assumes modern standards support and doesn't fix any browser bugs
 * @author Lea Verou (http://lea.verou.me)
 * MIT license (http://www.opensource.org/licenses/mit-license.php)
 * Last update: 2012-4-29
 */
 
function $(expr, con) {
	return typeof expr === 'string'? (con || document).querySelector(expr) : expr;
}

function $$(expr, con) {
	var elements = (con || document).querySelectorAll(expr);
	
	try {
		return Array.prototype.slice.call(elements);
	}
	catch(e) {
		var arr = Array(elements.length);
	    
	    for (var i = elements.length; i-- > 0;) {
			arr[i] = elements[i];
		}
		
		return arr;
	}
}

if (!Array.prototype.forEach) {
	Array.prototype.forEach = function(fn, scope) {
		for (var i = 0, len = this.length; i < len; ++i) {
			fn.call(scope || this, this[i], i, this);
		}
	}
}

// Make each ID a global variable
// Many browsers do this anyway (it’s in the HTML5 spec), so it ensures consistency
$$('[id]').forEach(function(element) { window[element.id] = element; });

// Array#splice but for strings
String.prototype.splice = function(i, remove, add) {
	remove = +remove || 0;
	add = add || '';
	
	return this.slice(0,i) + add + this.slice(i + remove);
};

(function(){

var _ = window.Utopia = {
	/**
	 * Returns the [[Class]] of an object in lowercase (eg. array, date, regexp, string etc)
	 * Caution: Results for DOM elements and collections aren't reliable.
	 * @param {Object} obj
	 *
	 * @return {String}
	 */
	type: function(obj) {
		if(obj === null) { return 'null'; }

		if(obj === undefined) { return 'undefined'; }

		var ret = Object.prototype.toString.call(obj).match(/^\[object\s+(.*?)\]$/)[1];

		ret = ret? ret.toLowerCase() : '';

		if(ret == 'number' && isNaN(obj)) {
			return 'NaN';
		}

		return ret;
	},

	/**
	 * Iterate over the properties of an object. Checks whether the properties actually belong to it.
	 * Can be stopped if the function explicitly returns a value that isn't null, undefined or NaN.
	 * 
	 * @param obj {Object} The object to iterate over
	 * @param func {Function} The function used in the iteration. Can accept 2 parameters: one of the
	 * 							value of the object and one for its name.
	 * @param context {Object} Context for the above function. Default is the object being iterated.
	 *
	 * @return {Object} Null or the return value of func, if it broke the loop at some point.
	 */
	each: function(obj, func, context) {
		if(!_.type(func) == 'function') {
			throw Error('The second argument in Utopia.each() must be a function');
		};

		context = context || obj;

		for (var i in obj) {
			if(obj.hasOwnProperty && obj.hasOwnProperty(i)) {
				var ret = func.call(context, obj[i], i);

				if(!!ret || ret === 0 || ret === '') {
					return ret;
				}
			}
		}

		return null;
	},

	/**
	 * Copies the properties of one object onto another.
	 * When there is a collision, the later one wins
	 *
	 * @return {Object} destination object
	 */
	merge: function(objects) {
		var ret = {};
		
		for(var i=0; i<arguments.length; i++) {
			var o = arguments[i];
			
			for(var j in o) {
				ret[j] = o[j];
			}
		}
		
		return ret;
	},
	
	/**
	 * Copies the properties of one or more objects onto the first one
	 * When there is a collision, the first object wins
	 */
	attach: function(object, objects) {
		for(var i=0; i<arguments.length; i++) {
			var o = arguments[i];
			
			for(var j in o) {
				if(!(j in object)) {
					object[j] = o[j];
				}
			}
		}
		
		return object;
	},
	
	element: {
		/**
		 * Creates a new DOM element
		 * @param options {Object} A set of key/value pairs for attributes, properties, contents, placement in the DOM etc
		 * @return The new DOM element
		 */
		create: function() {
			var options;

			if(_.type(arguments[0]) === 'string') {
				if(_.type(arguments[1]) === 'object') {
					// Utopia.element.create('div', { ... });
					options = arguments[1];
					options.tag = arguments[0];
				}
				else {
					// Utopia.element.create('div', ...);
					options = {
						tag: arguments[0]
					};
					
					// Utopia.element.create('div', [contents]);
					if(_.type(arguments[1]) === 'array') {
						options.contents = arguments[1];
					}
					// Utopia.element.create('div', 'Text contents');
					else if(_.type(arguments[1]) === 'string' || _.type(arguments[1]) === 'number') {
						options.contents = ['' + arguments[1]];
					}
				}
			}
			else {
				options = arguments[0];
			}
			
			var namespace = options.namespace || '', element;
			
			if(namespace) {
				element = document.createElementNS(namespace, options.tag);
			}
			else {
				element = document.createElement(options.tag);
			}
			
			if (options.className || options.id) {
				options.properties = options.properties || {};
				options.properties.className = options.className;
				options.properties.id = options.id;
			}
			
			// Set properties, attributes and contents
			_.element.set(element, options);
			
			// Place the element in the DOM (inside, before or after an existing element)
			// This could be a selector
			if(options.before) {
				var before = $(options.before);
				
				if (before && before.parentNode) {
					before.parentNode.insertBefore(element, before);
				}
			}
			
			if (options.after && element.parentNode === null) {
				var after = $(options.after);
				
				if (after && after.parentNode) {
					after.parentNode.insertBefore(element, after.nextSibling)
				}
			}
			
			if (options.inside && element.parentNode === null) {
				$(options.inside).appendChild(element);
			}
			
			return element;
		},
		
		set: function(element, options) {
			_.element.prop(element, options.properties || options.prop);
					
			_.element.attr(element, options.attributes || options.attr);
			
			_.element.contents(element, options.contents);
	
			return element;
		},
		
		prop: function (element, properties) {
			if (properties) {
				for (var prop in properties) {
					element[prop] = properties[prop];
				}
			}
			
			return element;
		},
		
		attr: function (element, attributes) {
			if (attributes) {
				for (attr in attributes) {
					element.setAttribute(attr, attributes[attr]);
				}
			}
			
			return element;
		},
		
		/**
		 * Sets an element’s contents
		 * Contents could be: One or multiple (as an array) of the following:
		 *			- An object literal that will be passed through Utopia.element.create
		 *			- A string or number, which will become a text node
		 *			- An existing DOM element
		 */
		contents: function (element, contents, where) {
			if(contents || contents === 0) {
				if (_.type(contents) !== 'array') {
					contents = [contents];
				}
				
				var firstChild = element.firstChild;
				
				for (var i=0; i<contents.length; i++) {
					var content = contents[i], child;
					
					switch(_.type(content)) {
						case 'string':
							if(content === '') {
								continue;
							}
							// fall through
						case 'number':
							child = document.createTextNode(content);
							break;
						case 'object':
							child = _.element.create(content);
							break;
						default:
							child = content;

					}
					
					if(child) {
						if (!where || where === 'end') {
							element.appendChild(child);
						}
						else if (where === 'start') {
							element.insertBefore(child, firstChild);
						}
					}
				}	
			}
			
			return element;
		}
	},
	
	elements: {
		// set, attr, prop, contents functions from Utopia.element, but for multiple elements
	},
	
	event: {
		/**
		 * Binds one or more events to one or more elements
		 */
		bind: function(target, event, callback, traditional) {
			if(_.type(target) === 'string' || _.type(target) === 'array') {
				var elements = _.type(target) === 'string'? $$(target) : target;
				
				elements.forEach(function(element) {
					_.event.bind(element, event, callback, traditional);
				});
			}
			else if(_.type(event) === 'string') {
				if(traditional) {
					target['on' + event] = callback;
				}
				else {
					target.addEventListener(event, callback, false);
				}
			}
			else if(_.type(event) === 'array') {
				for (var i=0; i<event.length; i++) {
					_.event.bind(target, event[i], callback, arguments[2]);
				}
			}
			else {
				for (var name in event) {
					_.event.bind(target, name, event[name], arguments[2]);
				}
			}
		},
		
		/**
		 * Fire a custom event
		 */
		fire: function(target, type, properties) {
			if(_.type(target) === 'string' || _.type(target) === 'array') {
				var elements = _.type(target) === 'string'? $$(target) : target;
				
				elements.forEach(function(element) {
					_.event.fire(element, type, properties);
				});
			}
			else if (document.createEvent) {
				var evt = document.createEvent("HTMLEvents");
		
				evt.initEvent(type, true, true );
				evt.custom = true;
		
				if(properties) {
					_.attach(evt, properties);
				}
		
				target.dispatchEvent(evt);
			}
		}
	},
	
	/**
	 * Helper for XHR requests
	 */
	xhr: function(o) {
		document.body.setAttribute('data-loading', '');
		
		var xhr = new XMLHttpRequest(),
			method = o.method || 'GET',
			data = o.data || '';
		
		xhr.open(method, o.url + (method === 'GET' && data? '?' + data : ''), true);
		
		o.headers = o.headers || {};
		
		if(method !== 'GET' && !o.headers['Content-type'] && !o.headers['Content-Type']) {
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		}
		
		for (var header in o.headers) {
			xhr.setRequestHeader(header, o.headers[header]);
		}
		
		xhr.onreadystatechange = function(){
			
			if(xhr.readyState === 4) {
				document.body.removeAttribute('data-loading');
				
				o.callback(xhr);
			}
		};
		
		xhr.send(method === 'GET'? null : data);
	
		return xhr;
	},
	
	/**
	 * Lazy loads an external script
	 */
	script: function(url, callback, doc) {
		doc = doc || document;
		
		return _.element.create({
			tag: 'script',
			properties: {
				src: url,
				async: true,
				onload: callback
			},
			inside: doc.documentElement
		});
	},
	
	/**
	 * Returns the absolute X, Y offsets for an element
	 */
	offset: function(element) {
	    var left = 0, top = 0, el = element;
	    
	    if (el.parentNode) {
			do {
				left += el.offsetLeft;
				top += el.offsetTop;
			} while ((el = el.offsetParent) && el.nodeType < 9);
			
			el = element;
			
			do {
				left -= el.scrollLeft;
				top -= el.scrollTop;
			} while ((el = el.parentNode) && !/body/i.test(el.nodeName));
		}
	
	    return {
			top: top,
	    	right: innerWidth - left - element.offsetWidth,
	    	bottom: innerHeight - top - element.offsetHeight,
	    	left: left,
	    };
	}
};

['set', 'prop', 'attr', 'contents'].forEach(function(method) {
	_.elements[method] = function(elements) {
		elements = _.type(elements) === 'string'? $$(elements) : Array.prototype.slice.call(elements);
		
		var args = Array.prototype.slice.call(arguments);
		args.shift(); // Remove the elements argument
		
		elements = elements.map(function(element) {
			return _.element[method](element, args);
		});
		
		return elements;
	}
});

})();

window.$u = window.$u || Utopia;