/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 27);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(setImmediate, global) {;(function() {
"use strict"
function Vnode(tag, key, attrs0, children, text, dom) {
	return {tag: tag, key: key, attrs: attrs0, children: children, text: text, dom: dom, domSize: undefined, state: undefined, _state: undefined, events: undefined, instance: undefined, skip: false}
}
Vnode.normalize = function(node) {
	if (Array.isArray(node)) return Vnode("[", undefined, undefined, Vnode.normalizeChildren(node), undefined, undefined)
	if (node != null && typeof node !== "object") return Vnode("#", undefined, undefined, node === false ? "" : node, undefined, undefined)
	return node
}
Vnode.normalizeChildren = function normalizeChildren(children) {
	for (var i = 0; i < children.length; i++) {
		children[i] = Vnode.normalize(children[i])
	}
	return children
}
var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g
var selectorCache = {}
var hasOwn = {}.hasOwnProperty
function isEmpty(object) {
	for (var key in object) if (hasOwn.call(object, key)) return false
	return true
}
function compileSelector(selector) {
	var match, tag = "div", classes = [], attrs = {}
	while (match = selectorParser.exec(selector)) {
		var type = match[1], value = match[2]
		if (type === "" && value !== "") tag = value
		else if (type === "#") attrs.id = value
		else if (type === ".") classes.push(value)
		else if (match[3][0] === "[") {
			var attrValue = match[6]
			if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\")
			if (match[4] === "class") classes.push(attrValue)
			else attrs[match[4]] = attrValue === "" ? attrValue : attrValue || true
		}
	}
	if (classes.length > 0) attrs.className = classes.join(" ")
	return selectorCache[selector] = {tag: tag, attrs: attrs}
}
function execSelector(state, attrs, children) {
	var hasAttrs = false, childList, text
	var className = attrs.className || attrs.class
	if (!isEmpty(state.attrs) && !isEmpty(attrs)) {
		var newAttrs = {}
		for(var key in attrs) {
			if (hasOwn.call(attrs, key)) {
				newAttrs[key] = attrs[key]
			}
		}
		attrs = newAttrs
	}
	for (var key in state.attrs) {
		if (hasOwn.call(state.attrs, key)) {
			attrs[key] = state.attrs[key]
		}
	}
	if (className !== undefined) {
		if (attrs.class !== undefined) {
			attrs.class = undefined
			attrs.className = className
		}
		if (state.attrs.className != null) {
			attrs.className = state.attrs.className + " " + className
		}
	}
	for (var key in attrs) {
		if (hasOwn.call(attrs, key) && key !== "key") {
			hasAttrs = true
			break
		}
	}
	if (Array.isArray(children) && children.length === 1 && children[0] != null && children[0].tag === "#") {
		text = children[0].children
	} else {
		childList = children
	}
	return Vnode(state.tag, attrs.key, hasAttrs ? attrs : undefined, childList, text)
}
function hyperscript(selector) {
	// Because sloppy mode sucks
	var attrs = arguments[1], start = 2, children
	if (selector == null || typeof selector !== "string" && typeof selector !== "function" && typeof selector.view !== "function") {
		throw Error("The selector must be either a string or a component.");
	}
	if (typeof selector === "string") {
		var cached = selectorCache[selector] || compileSelector(selector)
	}
	if (attrs == null) {
		attrs = {}
	} else if (typeof attrs !== "object" || attrs.tag != null || Array.isArray(attrs)) {
		attrs = {}
		start = 1
	}
	if (arguments.length === start + 1) {
		children = arguments[start]
		if (!Array.isArray(children)) children = [children]
	} else {
		children = []
		while (start < arguments.length) children.push(arguments[start++])
	}
	var normalized = Vnode.normalizeChildren(children)
	if (typeof selector === "string") {
		return execSelector(cached, attrs, normalized)
	} else {
		return Vnode(selector, attrs.key, attrs, normalized)
	}
}
hyperscript.trust = function(html) {
	if (html == null) html = ""
	return Vnode("<", undefined, undefined, html, undefined, undefined)
}
hyperscript.fragment = function(attrs1, children) {
	return Vnode("[", attrs1.key, attrs1, Vnode.normalizeChildren(children), undefined, undefined)
}
var m = hyperscript
/** @constructor */
var PromisePolyfill = function(executor) {
	if (!(this instanceof PromisePolyfill)) throw new Error("Promise must be called with `new`")
	if (typeof executor !== "function") throw new TypeError("executor must be a function")
	var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false)
	var instance = self._instance = {resolvers: resolvers, rejectors: rejectors}
	var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout
	function handler(list, shouldAbsorb) {
		return function execute(value) {
			var then
			try {
				if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
					if (value === self) throw new TypeError("Promise can't be resolved w/ itself")
					executeOnce(then.bind(value))
				}
				else {
					callAsync(function() {
						if (!shouldAbsorb && list.length === 0) console.error("Possible unhandled promise rejection:", value)
						for (var i = 0; i < list.length; i++) list[i](value)
						resolvers.length = 0, rejectors.length = 0
						instance.state = shouldAbsorb
						instance.retry = function() {execute(value)}
					})
				}
			}
			catch (e) {
				rejectCurrent(e)
			}
		}
	}
	function executeOnce(then) {
		var runs = 0
		function run(fn) {
			return function(value) {
				if (runs++ > 0) return
				fn(value)
			}
		}
		var onerror = run(rejectCurrent)
		try {then(run(resolveCurrent), onerror)} catch (e) {onerror(e)}
	}
	executeOnce(executor)
}
PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
	var self = this, instance = self._instance
	function handle(callback, list, next, state) {
		list.push(function(value) {
			if (typeof callback !== "function") next(value)
			else try {resolveNext(callback(value))} catch (e) {if (rejectNext) rejectNext(e)}
		})
		if (typeof instance.retry === "function" && state === instance.state) instance.retry()
	}
	var resolveNext, rejectNext
	var promise = new PromisePolyfill(function(resolve, reject) {resolveNext = resolve, rejectNext = reject})
	handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false)
	return promise
}
PromisePolyfill.prototype.catch = function(onRejection) {
	return this.then(null, onRejection)
}
PromisePolyfill.resolve = function(value) {
	if (value instanceof PromisePolyfill) return value
	return new PromisePolyfill(function(resolve) {resolve(value)})
}
PromisePolyfill.reject = function(value) {
	return new PromisePolyfill(function(resolve, reject) {reject(value)})
}
PromisePolyfill.all = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		var total = list.length, count = 0, values = []
		if (list.length === 0) resolve([])
		else for (var i = 0; i < list.length; i++) {
			(function(i) {
				function consume(value) {
					count++
					values[i] = value
					if (count === total) resolve(values)
				}
				if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
					list[i].then(consume, reject)
				}
				else consume(list[i])
			})(i)
		}
	})
}
PromisePolyfill.race = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		for (var i = 0; i < list.length; i++) {
			list[i].then(resolve, reject)
		}
	})
}
if (typeof window !== "undefined") {
	if (typeof window.Promise === "undefined") window.Promise = PromisePolyfill
	var PromisePolyfill = window.Promise
} else if (typeof global !== "undefined") {
	if (typeof global.Promise === "undefined") global.Promise = PromisePolyfill
	var PromisePolyfill = global.Promise
} else {
}
var buildQueryString = function(object) {
	if (Object.prototype.toString.call(object) !== "[object Object]") return ""
	var args = []
	for (var key0 in object) {
		destructure(key0, object[key0])
	}
	return args.join("&")
	function destructure(key0, value) {
		if (Array.isArray(value)) {
			for (var i = 0; i < value.length; i++) {
				destructure(key0 + "[" + i + "]", value[i])
			}
		}
		else if (Object.prototype.toString.call(value) === "[object Object]") {
			for (var i in value) {
				destructure(key0 + "[" + i + "]", value[i])
			}
		}
		else args.push(encodeURIComponent(key0) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""))
	}
}
var FILE_PROTOCOL_REGEX = new RegExp("^file://", "i")
var _8 = function($window, Promise) {
	var callbackCount = 0
	var oncompletion
	function setCompletionCallback(callback) {oncompletion = callback}
	function finalizer() {
		var count = 0
		function complete() {if (--count === 0 && typeof oncompletion === "function") oncompletion()}
		return function finalize(promise0) {
			var then0 = promise0.then
			promise0.then = function() {
				count++
				var next = then0.apply(promise0, arguments)
				next.then(complete, function(e) {
					complete()
					if (count === 0) throw e
				})
				return finalize(next)
			}
			return promise0
		}
	}
	function normalize(args, extra) {
		if (typeof args === "string") {
			var url = args
			args = extra || {}
			if (args.url == null) args.url = url
		}
		return args
	}
	function request(args, extra) {
		var finalize = finalizer()
		args = normalize(args, extra)
		var promise0 = new Promise(function(resolve, reject) {
			if (args.method == null) args.method = "GET"
			args.method = args.method.toUpperCase()
			var useBody = (args.method === "GET" || args.method === "TRACE") ? false : (typeof args.useBody === "boolean" ? args.useBody : true)
			if (typeof args.serialize !== "function") args.serialize = typeof FormData !== "undefined" && args.data instanceof FormData ? function(value) {return value} : JSON.stringify
			if (typeof args.deserialize !== "function") args.deserialize = deserialize
			if (typeof args.extract !== "function") args.extract = extract
			args.url = interpolate(args.url, args.data)
			if (useBody) args.data = args.serialize(args.data)
			else args.url = assemble(args.url, args.data)
			var xhr = new $window.XMLHttpRequest(),
				aborted = false,
				_abort = xhr.abort
			xhr.abort = function abort() {
				aborted = true
				_abort.call(xhr)
			}
			xhr.open(args.method, args.url, typeof args.async === "boolean" ? args.async : true, typeof args.user === "string" ? args.user : undefined, typeof args.password === "string" ? args.password : undefined)
			if (args.serialize === JSON.stringify && useBody && !(args.headers && args.headers.hasOwnProperty("Content-Type"))) {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
			}
			if (args.deserialize === deserialize && !(args.headers && args.headers.hasOwnProperty("Accept"))) {
				xhr.setRequestHeader("Accept", "application/json, text/*")
			}
			if (args.withCredentials) xhr.withCredentials = args.withCredentials
			for (var key in args.headers) if ({}.hasOwnProperty.call(args.headers, key)) {
				xhr.setRequestHeader(key, args.headers[key])
			}
			if (typeof args.config === "function") xhr = args.config(xhr, args) || xhr
			xhr.onreadystatechange = function() {
				// Don't throw errors on xhr.abort().
				if(aborted) return
				if (xhr.readyState === 4) {
					try {
						var response = (args.extract !== extract) ? args.extract(xhr, args) : args.deserialize(args.extract(xhr, args))
						if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || FILE_PROTOCOL_REGEX.test(args.url)) {
							resolve(cast(args.type, response))
						}
						else {
							var error = new Error(xhr.responseText)
							for (var key in response) error[key] = response[key]
							reject(error)
						}
					}
					catch (e) {
						reject(e)
					}
				}
			}
			if (useBody && (args.data != null)) xhr.send(args.data)
			else xhr.send()
		})
		return args.background === true ? promise0 : finalize(promise0)
	}
	function jsonp(args, extra) {
		var finalize = finalizer()
		args = normalize(args, extra)
		var promise0 = new Promise(function(resolve, reject) {
			var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + callbackCount++
			var script = $window.document.createElement("script")
			$window[callbackName] = function(data) {
				script.parentNode.removeChild(script)
				resolve(cast(args.type, data))
				delete $window[callbackName]
			}
			script.onerror = function() {
				script.parentNode.removeChild(script)
				reject(new Error("JSONP request failed"))
				delete $window[callbackName]
			}
			if (args.data == null) args.data = {}
			args.url = interpolate(args.url, args.data)
			args.data[args.callbackKey || "callback"] = callbackName
			script.src = assemble(args.url, args.data)
			$window.document.documentElement.appendChild(script)
		})
		return args.background === true? promise0 : finalize(promise0)
	}
	function interpolate(url, data) {
		if (data == null) return url
		var tokens = url.match(/:[^\/]+/gi) || []
		for (var i = 0; i < tokens.length; i++) {
			var key = tokens[i].slice(1)
			if (data[key] != null) {
				url = url.replace(tokens[i], data[key])
			}
		}
		return url
	}
	function assemble(url, data) {
		var querystring = buildQueryString(data)
		if (querystring !== "") {
			var prefix = url.indexOf("?") < 0 ? "?" : "&"
			url += prefix + querystring
		}
		return url
	}
	function deserialize(data) {
		try {return data !== "" ? JSON.parse(data) : null}
		catch (e) {throw new Error(data)}
	}
	function extract(xhr) {return xhr.responseText}
	function cast(type0, data) {
		if (typeof type0 === "function") {
			if (Array.isArray(data)) {
				for (var i = 0; i < data.length; i++) {
					data[i] = new type0(data[i])
				}
			}
			else return new type0(data)
		}
		return data
	}
	return {request: request, jsonp: jsonp, setCompletionCallback: setCompletionCallback}
}
var requestService = _8(window, PromisePolyfill)
var coreRenderer = function($window) {
	var $doc = $window.document
	var $emptyFragment = $doc.createDocumentFragment()
	var nameSpace = {
		svg: "http://www.w3.org/2000/svg",
		math: "http://www.w3.org/1998/Math/MathML"
	}
	var onevent
	function setEventCallback(callback) {return onevent = callback}
	function getNameSpace(vnode) {
		return vnode.attrs && vnode.attrs.xmlns || nameSpace[vnode.tag]
	}
	//create
	function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				createNode(parent, vnode, hooks, ns, nextSibling)
			}
		}
	}
	function createNode(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		if (typeof tag === "string") {
			vnode.state = {}
			if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
			switch (tag) {
				case "#": return createText(parent, vnode, nextSibling)
				case "<": return createHTML(parent, vnode, nextSibling)
				case "[": return createFragment(parent, vnode, hooks, ns, nextSibling)
				default: return createElement(parent, vnode, hooks, ns, nextSibling)
			}
		}
		else return createComponent(parent, vnode, hooks, ns, nextSibling)
	}
	function createText(parent, vnode, nextSibling) {
		vnode.dom = $doc.createTextNode(vnode.children)
		insertNode(parent, vnode.dom, nextSibling)
		return vnode.dom
	}
	function createHTML(parent, vnode, nextSibling) {
		var match1 = vnode.children.match(/^\s*?<(\w+)/im) || []
		var parent1 = {caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup"}[match1[1]] || "div"
		var temp = $doc.createElement(parent1)
		temp.innerHTML = vnode.children
		vnode.dom = temp.firstChild
		vnode.domSize = temp.childNodes.length
		var fragment = $doc.createDocumentFragment()
		var child
		while (child = temp.firstChild) {
			fragment.appendChild(child)
		}
		insertNode(parent, fragment, nextSibling)
		return fragment
	}
	function createFragment(parent, vnode, hooks, ns, nextSibling) {
		var fragment = $doc.createDocumentFragment()
		if (vnode.children != null) {
			var children = vnode.children
			createNodes(fragment, children, 0, children.length, hooks, null, ns)
		}
		vnode.dom = fragment.firstChild
		vnode.domSize = fragment.childNodes.length
		insertNode(parent, fragment, nextSibling)
		return fragment
	}
	function createElement(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		var attrs2 = vnode.attrs
		var is = attrs2 && attrs2.is
		ns = getNameSpace(vnode) || ns
		var element = ns ?
			is ? $doc.createElementNS(ns, tag, {is: is}) : $doc.createElementNS(ns, tag) :
			is ? $doc.createElement(tag, {is: is}) : $doc.createElement(tag)
		vnode.dom = element
		if (attrs2 != null) {
			setAttrs(vnode, attrs2, ns)
		}
		insertNode(parent, element, nextSibling)
		if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
			setContentEditable(vnode)
		}
		else {
			if (vnode.text != null) {
				if (vnode.text !== "") element.textContent = vnode.text
				else vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
			}
			if (vnode.children != null) {
				var children = vnode.children
				createNodes(element, children, 0, children.length, hooks, null, ns)
				setLateAttrs(vnode)
			}
		}
		return element
	}
	function initComponent(vnode, hooks) {
		var sentinel
		if (typeof vnode.tag.view === "function") {
			vnode.state = Object.create(vnode.tag)
			sentinel = vnode.state.view
			if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
			sentinel.$$reentrantLock$$ = true
		} else {
			vnode.state = void 0
			sentinel = vnode.tag
			if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
			sentinel.$$reentrantLock$$ = true
			vnode.state = (vnode.tag.prototype != null && typeof vnode.tag.prototype.view === "function") ? new vnode.tag(vnode) : vnode.tag(vnode)
		}
		vnode._state = vnode.state
		if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
		initLifecycle(vnode._state, vnode, hooks)
		vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode))
		if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
		sentinel.$$reentrantLock$$ = null
	}
	function createComponent(parent, vnode, hooks, ns, nextSibling) {
		initComponent(vnode, hooks)
		if (vnode.instance != null) {
			var element = createNode(parent, vnode.instance, hooks, ns, nextSibling)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.dom != null ? vnode.instance.domSize : 0
			insertNode(parent, element, nextSibling)
			return element
		}
		else {
			vnode.domSize = 0
			return $emptyFragment
		}
	}
	//update
	function updateNodes(parent, old, vnodes, recycling, hooks, nextSibling, ns) {
		if (old === vnodes || old == null && vnodes == null) return
		else if (old == null) createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, ns)
		else if (vnodes == null) removeNodes(old, 0, old.length, vnodes)
		else {
			if (old.length === vnodes.length) {
				var isUnkeyed = false
				for (var i = 0; i < vnodes.length; i++) {
					if (vnodes[i] != null && old[i] != null) {
						isUnkeyed = vnodes[i].key == null && old[i].key == null
						break
					}
				}
				if (isUnkeyed) {
					for (var i = 0; i < old.length; i++) {
						if (old[i] === vnodes[i]) continue
						else if (old[i] == null && vnodes[i] != null) createNode(parent, vnodes[i], hooks, ns, getNextSibling(old, i + 1, nextSibling))
						else if (vnodes[i] == null) removeNodes(old, i, i + 1, vnodes)
						else updateNode(parent, old[i], vnodes[i], hooks, getNextSibling(old, i + 1, nextSibling), recycling, ns)
					}
					return
				}
			}
			recycling = recycling || isRecyclable(old, vnodes)
			if (recycling) {
				var pool = old.pool
				old = old.concat(old.pool)
			}
			var oldStart = 0, start = 0, oldEnd = old.length - 1, end = vnodes.length - 1, map
			while (oldEnd >= oldStart && end >= start) {
				var o = old[oldStart], v = vnodes[start]
				if (o === v && !recycling) oldStart++, start++
				else if (o == null) oldStart++
				else if (v == null) start++
				else if (o.key === v.key) {
					var shouldRecycle = (pool != null && oldStart >= old.length - pool.length) || ((pool == null) && recycling)
					oldStart++, start++
					updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), shouldRecycle, ns)
					if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling)
				}
				else {
					var o = old[oldEnd]
					if (o === v && !recycling) oldEnd--, start++
					else if (o == null) oldEnd--
					else if (v == null) start++
					else if (o.key === v.key) {
						var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling)
						updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns)
						if (recycling || start < end) insertNode(parent, toFragment(o), getNextSibling(old, oldStart, nextSibling))
						oldEnd--, start++
					}
					else break
				}
			}
			while (oldEnd >= oldStart && end >= start) {
				var o = old[oldEnd], v = vnodes[end]
				if (o === v && !recycling) oldEnd--, end--
				else if (o == null) oldEnd--
				else if (v == null) end--
				else if (o.key === v.key) {
					var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling)
					updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns)
					if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling)
					if (o.dom != null) nextSibling = o.dom
					oldEnd--, end--
				}
				else {
					if (!map) map = getKeyMap(old, oldEnd)
					if (v != null) {
						var oldIndex = map[v.key]
						if (oldIndex != null) {
							var movable = old[oldIndex]
							var shouldRecycle = (pool != null && oldIndex >= old.length - pool.length) || ((pool == null) && recycling)
							updateNode(parent, movable, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), recycling, ns)
							insertNode(parent, toFragment(movable), nextSibling)
							old[oldIndex].skip = true
							if (movable.dom != null) nextSibling = movable.dom
						}
						else {
							var dom = createNode(parent, v, hooks, ns, nextSibling)
							nextSibling = dom
						}
					}
					end--
				}
				if (end < start) break
			}
			createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns)
			removeNodes(old, oldStart, oldEnd + 1, vnodes)
		}
	}
	function updateNode(parent, old, vnode, hooks, nextSibling, recycling, ns) {
		var oldTag = old.tag, tag = vnode.tag
		if (oldTag === tag) {
			vnode.state = old.state
			vnode._state = old._state
			vnode.events = old.events
			if (!recycling && shouldNotUpdate(vnode, old)) return
			if (typeof oldTag === "string") {
				if (vnode.attrs != null) {
					if (recycling) {
						vnode.state = {}
						initLifecycle(vnode.attrs, vnode, hooks)
					}
					else updateLifecycle(vnode.attrs, vnode, hooks)
				}
				switch (oldTag) {
					case "#": updateText(old, vnode); break
					case "<": updateHTML(parent, old, vnode, nextSibling); break
					case "[": updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns); break
					default: updateElement(old, vnode, recycling, hooks, ns)
				}
			}
			else updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns)
		}
		else {
			removeNode(old, null)
			createNode(parent, vnode, hooks, ns, nextSibling)
		}
	}
	function updateText(old, vnode) {
		if (old.children.toString() !== vnode.children.toString()) {
			old.dom.nodeValue = vnode.children
		}
		vnode.dom = old.dom
	}
	function updateHTML(parent, old, vnode, nextSibling) {
		if (old.children !== vnode.children) {
			toFragment(old)
			createHTML(parent, vnode, nextSibling)
		}
		else vnode.dom = old.dom, vnode.domSize = old.domSize
	}
	function updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns) {
		updateNodes(parent, old.children, vnode.children, recycling, hooks, nextSibling, ns)
		var domSize = 0, children = vnode.children
		vnode.dom = null
		if (children != null) {
			for (var i = 0; i < children.length; i++) {
				var child = children[i]
				if (child != null && child.dom != null) {
					if (vnode.dom == null) vnode.dom = child.dom
					domSize += child.domSize || 1
				}
			}
			if (domSize !== 1) vnode.domSize = domSize
		}
	}
	function updateElement(old, vnode, recycling, hooks, ns) {
		var element = vnode.dom = old.dom
		ns = getNameSpace(vnode) || ns
		if (vnode.tag === "textarea") {
			if (vnode.attrs == null) vnode.attrs = {}
			if (vnode.text != null) {
				vnode.attrs.value = vnode.text //FIXME handle0 multiple children
				vnode.text = undefined
			}
		}
		updateAttrs(vnode, old.attrs, vnode.attrs, ns)
		if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
			setContentEditable(vnode)
		}
		else if (old.text != null && vnode.text != null && vnode.text !== "") {
			if (old.text.toString() !== vnode.text.toString()) old.dom.firstChild.nodeValue = vnode.text
		}
		else {
			if (old.text != null) old.children = [Vnode("#", undefined, undefined, old.text, undefined, old.dom.firstChild)]
			if (vnode.text != null) vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
			updateNodes(element, old.children, vnode.children, recycling, hooks, null, ns)
		}
	}
	function updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns) {
		if (recycling) {
			initComponent(vnode, hooks)
		} else {
			vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode))
			if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
			if (vnode.attrs != null) updateLifecycle(vnode.attrs, vnode, hooks)
			updateLifecycle(vnode._state, vnode, hooks)
		}
		if (vnode.instance != null) {
			if (old.instance == null) createNode(parent, vnode.instance, hooks, ns, nextSibling)
			else updateNode(parent, old.instance, vnode.instance, hooks, nextSibling, recycling, ns)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.instance.domSize
		}
		else if (old.instance != null) {
			removeNode(old.instance, null)
			vnode.dom = undefined
			vnode.domSize = 0
		}
		else {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
		}
	}
	function isRecyclable(old, vnodes) {
		if (old.pool != null && Math.abs(old.pool.length - vnodes.length) <= Math.abs(old.length - vnodes.length)) {
			var oldChildrenLength = old[0] && old[0].children && old[0].children.length || 0
			var poolChildrenLength = old.pool[0] && old.pool[0].children && old.pool[0].children.length || 0
			var vnodesChildrenLength = vnodes[0] && vnodes[0].children && vnodes[0].children.length || 0
			if (Math.abs(poolChildrenLength - vnodesChildrenLength) <= Math.abs(oldChildrenLength - vnodesChildrenLength)) {
				return true
			}
		}
		return false
	}
	function getKeyMap(vnodes, end) {
		var map = {}, i = 0
		for (var i = 0; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				var key2 = vnode.key
				if (key2 != null) map[key2] = i
			}
		}
		return map
	}
	function toFragment(vnode) {
		var count0 = vnode.domSize
		if (count0 != null || vnode.dom == null) {
			var fragment = $doc.createDocumentFragment()
			if (count0 > 0) {
				var dom = vnode.dom
				while (--count0) fragment.appendChild(dom.nextSibling)
				fragment.insertBefore(dom, fragment.firstChild)
			}
			return fragment
		}
		else return vnode.dom
	}
	function getNextSibling(vnodes, i, nextSibling) {
		for (; i < vnodes.length; i++) {
			if (vnodes[i] != null && vnodes[i].dom != null) return vnodes[i].dom
		}
		return nextSibling
	}
	function insertNode(parent, dom, nextSibling) {
		if (nextSibling && nextSibling.parentNode) parent.insertBefore(dom, nextSibling)
		else parent.appendChild(dom)
	}
	function setContentEditable(vnode) {
		var children = vnode.children
		if (children != null && children.length === 1 && children[0].tag === "<") {
			var content = children[0].children
			if (vnode.dom.innerHTML !== content) vnode.dom.innerHTML = content
		}
		else if (vnode.text != null || children != null && children.length !== 0) throw new Error("Child node of a contenteditable must be trusted")
	}
	//remove
	function removeNodes(vnodes, start, end, context) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				if (vnode.skip) vnode.skip = false
				else removeNode(vnode, context)
			}
		}
	}
	function removeNode(vnode, context) {
		var expected = 1, called = 0
		if (vnode.attrs && typeof vnode.attrs.onbeforeremove === "function") {
			var result = vnode.attrs.onbeforeremove.call(vnode.state, vnode)
			if (result != null && typeof result.then === "function") {
				expected++
				result.then(continuation, continuation)
			}
		}
		if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeremove === "function") {
			var result = vnode._state.onbeforeremove.call(vnode.state, vnode)
			if (result != null && typeof result.then === "function") {
				expected++
				result.then(continuation, continuation)
			}
		}
		continuation()
		function continuation() {
			if (++called === expected) {
				onremove(vnode)
				if (vnode.dom) {
					var count0 = vnode.domSize || 1
					if (count0 > 1) {
						var dom = vnode.dom
						while (--count0) {
							removeNodeFromDOM(dom.nextSibling)
						}
					}
					removeNodeFromDOM(vnode.dom)
					if (context != null && vnode.domSize == null && !hasIntegrationMethods(vnode.attrs) && typeof vnode.tag === "string") { //TODO test custom elements
						if (!context.pool) context.pool = [vnode]
						else context.pool.push(vnode)
					}
				}
			}
		}
	}
	function removeNodeFromDOM(node) {
		var parent = node.parentNode
		if (parent != null) parent.removeChild(node)
	}
	function onremove(vnode) {
		if (vnode.attrs && typeof vnode.attrs.onremove === "function") vnode.attrs.onremove.call(vnode.state, vnode)
		if (typeof vnode.tag !== "string") {
			if (typeof vnode._state.onremove === "function") vnode._state.onremove.call(vnode.state, vnode)
			if (vnode.instance != null) onremove(vnode.instance)
		} else {
			var children = vnode.children
			if (Array.isArray(children)) {
				for (var i = 0; i < children.length; i++) {
					var child = children[i]
					if (child != null) onremove(child)
				}
			}
		}
	}
	//attrs2
	function setAttrs(vnode, attrs2, ns) {
		for (var key2 in attrs2) {
			setAttr(vnode, key2, null, attrs2[key2], ns)
		}
	}
	function setAttr(vnode, key2, old, value, ns) {
		var element = vnode.dom
		if (key2 === "key" || key2 === "is" || (old === value && !isFormAttribute(vnode, key2)) && typeof value !== "object" || typeof value === "undefined" || isLifecycleMethod(key2)) return
		var nsLastIndex = key2.indexOf(":")
		if (nsLastIndex > -1 && key2.substr(0, nsLastIndex) === "xlink") {
			element.setAttributeNS("http://www.w3.org/1999/xlink", key2.slice(nsLastIndex + 1), value)
		}
		else if (key2[0] === "o" && key2[1] === "n" && typeof value === "function") updateEvent(vnode, key2, value)
		else if (key2 === "style") updateStyle(element, old, value)
		else if (key2 in element && !isAttribute(key2) && ns === undefined && !isCustomElement(vnode)) {
			if (key2 === "value") {
				var normalized0 = "" + value // eslint-disable-line no-implicit-coercion
				//setting input[value] to same value by typing on focused element moves cursor to end in Chrome
				if ((vnode.tag === "input" || vnode.tag === "textarea") && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
				//setting select[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "select") {
					if (value === null) {
						if (vnode.dom.selectedIndex === -1 && vnode.dom === $doc.activeElement) return
					} else {
						if (old !== null && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
					}
				}
				//setting option[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "option" && old != null && vnode.dom.value === normalized0) return
			}
			// If you assign an input type1 that is not supported by IE 11 with an assignment expression, an error0 will occur.
			if (vnode.tag === "input" && key2 === "type") {
				element.setAttribute(key2, value)
				return
			}
			element[key2] = value
		}
		else {
			if (typeof value === "boolean") {
				if (value) element.setAttribute(key2, "")
				else element.removeAttribute(key2)
			}
			else element.setAttribute(key2 === "className" ? "class" : key2, value)
		}
	}
	function setLateAttrs(vnode) {
		var attrs2 = vnode.attrs
		if (vnode.tag === "select" && attrs2 != null) {
			if ("value" in attrs2) setAttr(vnode, "value", null, attrs2.value, undefined)
			if ("selectedIndex" in attrs2) setAttr(vnode, "selectedIndex", null, attrs2.selectedIndex, undefined)
		}
	}
	function updateAttrs(vnode, old, attrs2, ns) {
		if (attrs2 != null) {
			for (var key2 in attrs2) {
				setAttr(vnode, key2, old && old[key2], attrs2[key2], ns)
			}
		}
		if (old != null) {
			for (var key2 in old) {
				if (attrs2 == null || !(key2 in attrs2)) {
					if (key2 === "className") key2 = "class"
					if (key2[0] === "o" && key2[1] === "n" && !isLifecycleMethod(key2)) updateEvent(vnode, key2, undefined)
					else if (key2 !== "key") vnode.dom.removeAttribute(key2)
				}
			}
		}
	}
	function isFormAttribute(vnode, attr) {
		return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode.dom === $doc.activeElement
	}
	function isLifecycleMethod(attr) {
		return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate"
	}
	function isAttribute(attr) {
		return attr === "href" || attr === "list" || attr === "form" || attr === "width" || attr === "height"// || attr === "type"
	}
	function isCustomElement(vnode){
		return vnode.attrs.is || vnode.tag.indexOf("-") > -1
	}
	function hasIntegrationMethods(source) {
		return source != null && (source.oncreate || source.onupdate || source.onbeforeremove || source.onremove)
	}
	//style
	function updateStyle(element, old, style) {
		if (old === style) element.style.cssText = "", old = null
		if (style == null) element.style.cssText = ""
		else if (typeof style === "string") element.style.cssText = style
		else {
			if (typeof old === "string") element.style.cssText = ""
			for (var key2 in style) {
				element.style[key2] = style[key2]
			}
			if (old != null && typeof old !== "string") {
				for (var key2 in old) {
					if (!(key2 in style)) element.style[key2] = ""
				}
			}
		}
	}
	//event
	function updateEvent(vnode, key2, value) {
		var element = vnode.dom
		var callback = typeof onevent !== "function" ? value : function(e) {
			var result = value.call(element, e)
			onevent.call(element, e)
			return result
		}
		if (key2 in element) element[key2] = typeof value === "function" ? callback : null
		else {
			var eventName = key2.slice(2)
			if (vnode.events === undefined) vnode.events = {}
			if (vnode.events[key2] === callback) return
			if (vnode.events[key2] != null) element.removeEventListener(eventName, vnode.events[key2], false)
			if (typeof value === "function") {
				vnode.events[key2] = callback
				element.addEventListener(eventName, vnode.events[key2], false)
			}
		}
	}
	//lifecycle
	function initLifecycle(source, vnode, hooks) {
		if (typeof source.oninit === "function") source.oninit.call(vnode.state, vnode)
		if (typeof source.oncreate === "function") hooks.push(source.oncreate.bind(vnode.state, vnode))
	}
	function updateLifecycle(source, vnode, hooks) {
		if (typeof source.onupdate === "function") hooks.push(source.onupdate.bind(vnode.state, vnode))
	}
	function shouldNotUpdate(vnode, old) {
		var forceVnodeUpdate, forceComponentUpdate
		if (vnode.attrs != null && typeof vnode.attrs.onbeforeupdate === "function") forceVnodeUpdate = vnode.attrs.onbeforeupdate.call(vnode.state, vnode, old)
		if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeupdate === "function") forceComponentUpdate = vnode._state.onbeforeupdate.call(vnode.state, vnode, old)
		if (!(forceVnodeUpdate === undefined && forceComponentUpdate === undefined) && !forceVnodeUpdate && !forceComponentUpdate) {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
			vnode.instance = old.instance
			return true
		}
		return false
	}
	function render(dom, vnodes) {
		if (!dom) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.")
		var hooks = []
		var active = $doc.activeElement
		var namespace = dom.namespaceURI
		// First time0 rendering into a node clears it out
		if (dom.vnodes == null) dom.textContent = ""
		if (!Array.isArray(vnodes)) vnodes = [vnodes]
		updateNodes(dom, dom.vnodes, Vnode.normalizeChildren(vnodes), false, hooks, null, namespace === "http://www.w3.org/1999/xhtml" ? undefined : namespace)
		dom.vnodes = vnodes
		// document.activeElement can return null in IE https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement
		if (active != null && $doc.activeElement !== active) active.focus()
		for (var i = 0; i < hooks.length; i++) hooks[i]()
	}
	return {render: render, setEventCallback: setEventCallback}
}
function throttle(callback) {
	//60fps translates to 16.6ms, round it down since setTimeout requires int
	var time = 16
	var last = 0, pending = null
	var timeout = typeof requestAnimationFrame === "function" ? requestAnimationFrame : setTimeout
	return function() {
		var now = Date.now()
		if (last === 0 || now - last >= time) {
			last = now
			callback()
		}
		else if (pending === null) {
			pending = timeout(function() {
				pending = null
				callback()
				last = Date.now()
			}, time - (now - last))
		}
	}
}
var _11 = function($window) {
	var renderService = coreRenderer($window)
	renderService.setEventCallback(function(e) {
		if (e.redraw === false) e.redraw = undefined
		else redraw()
	})
	var callbacks = []
	function subscribe(key1, callback) {
		unsubscribe(key1)
		callbacks.push(key1, throttle(callback))
	}
	function unsubscribe(key1) {
		var index = callbacks.indexOf(key1)
		if (index > -1) callbacks.splice(index, 2)
	}
	function redraw() {
		for (var i = 1; i < callbacks.length; i += 2) {
			callbacks[i]()
		}
	}
	return {subscribe: subscribe, unsubscribe: unsubscribe, redraw: redraw, render: renderService.render}
}
var redrawService = _11(window)
requestService.setCompletionCallback(redrawService.redraw)
var _16 = function(redrawService0) {
	return function(root, component) {
		if (component === null) {
			redrawService0.render(root, [])
			redrawService0.unsubscribe(root)
			return
		}
		
		if (component.view == null && typeof component !== "function") throw new Error("m.mount(element, component) expects a component, not a vnode")
		
		var run0 = function() {
			redrawService0.render(root, Vnode(component))
		}
		redrawService0.subscribe(root, run0)
		redrawService0.redraw()
	}
}
m.mount = _16(redrawService)
var Promise = PromisePolyfill
var parseQueryString = function(string) {
	if (string === "" || string == null) return {}
	if (string.charAt(0) === "?") string = string.slice(1)
	var entries = string.split("&"), data0 = {}, counters = {}
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i].split("=")
		var key5 = decodeURIComponent(entry[0])
		var value = entry.length === 2 ? decodeURIComponent(entry[1]) : ""
		if (value === "true") value = true
		else if (value === "false") value = false
		var levels = key5.split(/\]\[?|\[/)
		var cursor = data0
		if (key5.indexOf("[") > -1) levels.pop()
		for (var j = 0; j < levels.length; j++) {
			var level = levels[j], nextLevel = levels[j + 1]
			var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10))
			var isValue = j === levels.length - 1
			if (level === "") {
				var key5 = levels.slice(0, j).join()
				if (counters[key5] == null) counters[key5] = 0
				level = counters[key5]++
			}
			if (cursor[level] == null) {
				cursor[level] = isValue ? value : isNumber ? [] : {}
			}
			cursor = cursor[level]
		}
	}
	return data0
}
var coreRouter = function($window) {
	var supportsPushState = typeof $window.history.pushState === "function"
	var callAsync0 = typeof setImmediate === "function" ? setImmediate : setTimeout
	function normalize1(fragment0) {
		var data = $window.location[fragment0].replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent)
		if (fragment0 === "pathname" && data[0] !== "/") data = "/" + data
		return data
	}
	var asyncId
	function debounceAsync(callback0) {
		return function() {
			if (asyncId != null) return
			asyncId = callAsync0(function() {
				asyncId = null
				callback0()
			})
		}
	}
	function parsePath(path, queryData, hashData) {
		var queryIndex = path.indexOf("?")
		var hashIndex = path.indexOf("#")
		var pathEnd = queryIndex > -1 ? queryIndex : hashIndex > -1 ? hashIndex : path.length
		if (queryIndex > -1) {
			var queryEnd = hashIndex > -1 ? hashIndex : path.length
			var queryParams = parseQueryString(path.slice(queryIndex + 1, queryEnd))
			for (var key4 in queryParams) queryData[key4] = queryParams[key4]
		}
		if (hashIndex > -1) {
			var hashParams = parseQueryString(path.slice(hashIndex + 1))
			for (var key4 in hashParams) hashData[key4] = hashParams[key4]
		}
		return path.slice(0, pathEnd)
	}
	var router = {prefix: "#!"}
	router.getPath = function() {
		var type2 = router.prefix.charAt(0)
		switch (type2) {
			case "#": return normalize1("hash").slice(router.prefix.length)
			case "?": return normalize1("search").slice(router.prefix.length) + normalize1("hash")
			default: return normalize1("pathname").slice(router.prefix.length) + normalize1("search") + normalize1("hash")
		}
	}
	router.setPath = function(path, data, options) {
		var queryData = {}, hashData = {}
		path = parsePath(path, queryData, hashData)
		if (data != null) {
			for (var key4 in data) queryData[key4] = data[key4]
			path = path.replace(/:([^\/]+)/g, function(match2, token) {
				delete queryData[token]
				return data[token]
			})
		}
		var query = buildQueryString(queryData)
		if (query) path += "?" + query
		var hash = buildQueryString(hashData)
		if (hash) path += "#" + hash
		if (supportsPushState) {
			var state = options ? options.state : null
			var title = options ? options.title : null
			$window.onpopstate()
			if (options && options.replace) $window.history.replaceState(state, title, router.prefix + path)
			else $window.history.pushState(state, title, router.prefix + path)
		}
		else $window.location.href = router.prefix + path
	}
	router.defineRoutes = function(routes, resolve, reject) {
		function resolveRoute() {
			var path = router.getPath()
			var params = {}
			var pathname = parsePath(path, params, params)
			var state = $window.history.state
			if (state != null) {
				for (var k in state) params[k] = state[k]
			}
			for (var route0 in routes) {
				var matcher = new RegExp("^" + route0.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$")
				if (matcher.test(pathname)) {
					pathname.replace(matcher, function() {
						var keys = route0.match(/:[^\/]+/g) || []
						var values = [].slice.call(arguments, 1, -2)
						for (var i = 0; i < keys.length; i++) {
							params[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i])
						}
						resolve(routes[route0], params, path, route0)
					})
					return
				}
			}
			reject(path, params)
		}
		if (supportsPushState) $window.onpopstate = debounceAsync(resolveRoute)
		else if (router.prefix.charAt(0) === "#") $window.onhashchange = resolveRoute
		resolveRoute()
	}
	return router
}
var _20 = function($window, redrawService0) {
	var routeService = coreRouter($window)
	var identity = function(v) {return v}
	var render1, component, attrs3, currentPath, lastUpdate
	var route = function(root, defaultRoute, routes) {
		if (root == null) throw new Error("Ensure the DOM element that was passed to `m.route` is not undefined")
		var run1 = function() {
			if (render1 != null) redrawService0.render(root, render1(Vnode(component, attrs3.key, attrs3)))
		}
		var bail = function(path) {
			if (path !== defaultRoute) routeService.setPath(defaultRoute, null, {replace: true})
			else throw new Error("Could not resolve default route " + defaultRoute)
		}
		routeService.defineRoutes(routes, function(payload, params, path) {
			var update = lastUpdate = function(routeResolver, comp) {
				if (update !== lastUpdate) return
				component = comp != null && (typeof comp.view === "function" || typeof comp === "function")? comp : "div"
				attrs3 = params, currentPath = path, lastUpdate = null
				render1 = (routeResolver.render || identity).bind(routeResolver)
				run1()
			}
			if (payload.view || typeof payload === "function") update({}, payload)
			else {
				if (payload.onmatch) {
					Promise.resolve(payload.onmatch(params, path)).then(function(resolved) {
						update(payload, resolved)
					}, bail)
				}
				else update(payload, "div")
			}
		}, bail)
		redrawService0.subscribe(root, run1)
	}
	route.set = function(path, data, options) {
		if (lastUpdate != null) {
			options = options || {}
			options.replace = true
		}
		lastUpdate = null
		routeService.setPath(path, data, options)
	}
	route.get = function() {return currentPath}
	route.prefix = function(prefix0) {routeService.prefix = prefix0}
	route.link = function(vnode1) {
		vnode1.dom.setAttribute("href", routeService.prefix + vnode1.attrs.href)
		vnode1.dom.onclick = function(e) {
			if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) return
			e.preventDefault()
			e.redraw = false
			var href = this.getAttribute("href")
			if (href.indexOf(routeService.prefix) === 0) href = href.slice(routeService.prefix.length)
			route.set(href, undefined, undefined)
		}
	}
	route.param = function(key3) {
		if(typeof attrs3 !== "undefined" && typeof key3 !== "undefined") return attrs3[key3]
		return attrs3
	}
	return route
}
m.route = _20(window, redrawService)
m.withAttr = function(attrName, callback1, context) {
	return function(e) {
		callback1.call(context || this, attrName in e.currentTarget ? e.currentTarget[attrName] : e.currentTarget.getAttribute(attrName))
	}
}
var _28 = coreRenderer(window)
m.render = _28.render
m.redraw = redrawService.redraw
m.request = requestService.request
m.jsonp = requestService.jsonp
m.parseQueryString = parseQueryString
m.buildQueryString = buildQueryString
m.version = "1.1.6"
m.vnode = Vnode
if (true) module["exports"] = m
else window.m = m
}());
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(29).setImmediate, __webpack_require__(15)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function clone(obj) {
    var clonedObj;
    if (typeof obj === "object" && obj !== null) {
        if (Array.isArray(obj)) {
            clonedObj = [];
            obj.forEach(function (item) { return clonedObj.push(clone(item)); });
        }
        else {
            clonedObj = {};
            Object.keys(obj).forEach(function (key) { return clonedObj[key] = clone(obj[key]); });
        }
        return clonedObj;
    }
    return obj;
}
exports.clone = clone;
function cleanString() {
    var classNames = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        classNames[_i] = arguments[_i];
    }
    return classNames.filter(function (x) { return typeof x === "string"; }).map(function (x) { return x.trim(); }).join(" ");
}
exports.cleanString = cleanString;
function isFn(fn) {
    return typeof fn === "function";
}
exports.isFn = isFn;
function isObj(obj) {
    return obj !== null && typeof obj === "object";
}
exports.isObj = isObj;
function isPlainObj(obj) {
    return isObj(obj) && !isArr(obj) && !isFn(obj);
}
exports.isPlainObj = isPlainObj;
function isArr(arr) {
    return Array.isArray(arr);
}
exports.isArr = isArr;
function exec(fn) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (!isFn(fn)) {
        return;
    }
    return fn.apply(this, args);
}
exports.exec = exec;
function mapRange(value, source, target) {
    return target[0] + (value - source[0]) * (target[1] - target[0]) / (source[1] - source[0]);
}
exports.mapRange = mapRange;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(41);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(6);
exports.stopEvent = function (event, hard) {
    if (hard === void 0) { hard = false; }
    event.redraw = false;
    event.preventDefault();
    if (hard === true) {
        event.stopPropagation();
    }
    return true;
};
exports.getContainerElementByClassName = function (dom, className) {
    var container = dom.parentElement;
    while (container !== null && container.className.indexOf(className) === -1) {
        container = container.parentElement;
    }
    return container;
};
exports.getRectStyle = function (rect) {
    return helpers_1.rectKeys.reduce(function (obj, key) {
        if (rect[key] === undefined) {
            return obj;
        }
        obj[key] = rect[key] + "px";
        return obj;
    }, {});
};
exports.getInnerRect = function (dom) {
    return {
        top: parseInt(getComputedStyle(dom).paddingTop || "0", 10) + parseInt(getComputedStyle(dom).marginTop || "0", 10),
        left: parseInt(getComputedStyle(dom).paddingLeft || "0", 10) + parseInt(getComputedStyle(dom).marginLeft || "0", 10),
        width: parseInt(getComputedStyle(dom).width || "0", 10),
        height: parseInt(getComputedStyle(dom).height || "0", 10),
    };
};
exports.getOuterRect = function (dom) {
    var rect = dom.getBoundingClientRect();
    return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
    };
};
exports.isInViewport = function (rect) {
    var html = document.documentElement;
    return (rect.top >= 0 &&
        rect.left >= 0 &&
        rect.top + rect.height <= (window.innerHeight || html.clientHeight) &&
        rect.left + rect.width <= (window.innerWidth || html.clientWidth));
};
exports.getComputedStyleNumber = function (dom, property) {
    var style = getComputedStyle(dom)[property];
    return style ? parseFloat(style) : 0;
};
exports.getTransitionDuration = function (dom) {
    return (exports.getComputedStyleNumber(dom, "transitionDelay") +
        exports.getComputedStyleNumber(dom, "transitionDuration")) * 1000;
};
exports.setStyle = function (dom, style) { return Object.keys(style).forEach(function (k) { return dom.style[k] = String(style[k]); }); };
exports.getScaleFromFirstContainer = function (dom, containerClassName, original) {
    if (!dom) {
        return 1;
    }
    var container = dom.parentElement;
    var item = dom;
    while (container !== null && container.className.indexOf(containerClassName) === -1) {
        item = container;
        container = container.parentElement;
    }
    if (!container) {
        return 1;
    }
    var containerRect = container.getBoundingClientRect();
    var horizontal = containerRect.width > containerRect.height;
    return horizontal ? (item.offsetHeight / original.height) : (item.offsetWidth / original.width);
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.IMAGE = "image";
exports.TEXT = "text";
exports.SHAPE = "shape";


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.rectKeys = ["left", "top", "width", "height"];
exports.rectConstrainKeys = ["minWidth", "minHeight", "maxWidth", "maxHeight"];
exports.getScale = function (original, target, maximize) {
    var maxWidthScale = target.width / original.width;
    var maxHeightScale = target.height / original.height;
    if (maximize) {
        return maxHeightScale < maxWidthScale ? maxWidthScale : maxHeightScale;
    }
    else {
        return maxHeightScale > maxWidthScale ? maxWidthScale : maxHeightScale;
    }
};
exports.setScale = function (obj, scale) {
    return Object.keys(obj).reduce(function (scaled, key) {
        scaled[key] = obj[key] * scale;
        return scaled;
    }, {});
};
exports.round = function (obj) {
    return Object.keys(obj).reduce(function (rounded, key) {
        rounded[key] = Math.round(obj[key]);
        return rounded;
    }, {});
};
exports.rectIsEqual = function (prev, curr) {
    return prev.top === curr.top &&
        prev.left === curr.left &&
        prev.width === curr.width &&
        prev.height === curr.height;
};
exports.getRect = function (obj) {
    var rect = {};
    if (obj["left"] !== undefined) {
        rect.left = obj["left"];
    }
    if (obj["top"] !== undefined) {
        rect.top = obj["top"];
    }
    if (obj["width"] !== undefined) {
        rect.width = obj["width"];
    }
    if (obj["height"] !== undefined) {
        rect.height = obj["height"];
    }
    return rect;
};
exports.getConstrainedRect = function (rect, constrain) {
    if (constrain.minWidth && rect.width < constrain.minWidth) {
        rect.width = constrain.minWidth;
    }
    if (constrain.minHeight && rect.height < constrain.minHeight) {
        rect.height = constrain.minHeight;
    }
    if (constrain.maxWidth && rect.width > constrain.maxWidth) {
        rect.width = constrain.maxWidth;
    }
    if (constrain.maxHeight && rect.height > constrain.maxHeight) {
        rect.height = constrain.maxHeight;
    }
    if (rect.width <= 0) {
        rect.width = constrain.minWidth || 20;
    }
    if (rect.height <= 0) {
        rect.height = constrain.minHeight || 20;
    }
    return rect;
};
exports.pause = function (ms) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
}); }); };


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dependency = (function () {
    function Dependency(data, type) {
        this.data = undefined;
        this.subs = [];
        this.subId = 0;
        this.data = data;
        this.type = type;
    }
    Dependency.prototype.set = function (data, caller) {
        if (!caller || caller !== this.type) {
            throw new Error("Cannot manually call the set method");
        }
        var prevData = this.data;
        this.data = data;
        this.subs.forEach(function (sub) { return sub.method(data, prevData); });
    };
    Dependency.prototype.get = function () {
        return this.data;
    };
    Dependency.prototype.getType = function () {
        return this.type;
    };
    Dependency.prototype.onchange = function (method) {
        var _this = this;
        var id = this.subId++;
        this.subs.push({ method: method, id: id });
        var off = function () { return _this.subs = _this.subs.filter(function (sub) { return sub.id !== id; }); };
        return { off: off, id: id };
    };
    return Dependency;
}());
exports.Dependency = Dependency;
var DependencyInjector = (function () {
    function DependencyInjector(type) {
        this.deps = {};
        this.type = type;
    }
    DependencyInjector.getInstance = function (type) {
        if (type === void 0) { type = "main"; }
        if (DependencyInjector.instances[type] === undefined) {
            DependencyInjector.instances[type] = new DependencyInjector(type);
        }
        return DependencyInjector.instances[type];
    };
    DependencyInjector.prototype.register = function (key, dep) {
        var _this = this;
        if (typeof key === "string") {
            if (this.deps[key] === undefined) {
                this.deps[key] = new Dependency(dep, this.type);
            }
            else {
                this.deps[key].set(dep, this.type);
            }
        }
        else {
            Object.keys(key).forEach(function (k) { return _this.register(k, key[k]); });
        }
        return this;
    };
    DependencyInjector.prototype.requestRaw = function (deps) {
        var _this = this;
        return deps.map(function (key) { return _this.deps[key]; });
    };
    DependencyInjector.prototype.request = function (deps) {
        return this.requestRaw(deps).map(function (dep) { return dep ? dep.get() : undefined; });
    };
    DependencyInjector.prototype.resolveFrom = function (deps, method, scope, raw) {
        var _this = this;
        if (scope === void 0) { scope = null; }
        if (raw === void 0) { raw = false; }
        return function () {
            var otherArgs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                otherArgs[_i] = arguments[_i];
            }
            var args = _this[raw ? "requestRaw" : "request"](deps);
            return method.apply(scope, args.concat(otherArgs));
        };
    };
    DependencyInjector.prototype.resolveRawFrom = function (deps, method, scope) {
        if (scope === void 0) { scope = null; }
        return this.resolveFrom(deps, method, scope, true);
    };
    DependencyInjector.prototype.resolve = function (method, scope, raw) {
        if (scope === void 0) { scope = null; }
        if (raw === void 0) { raw = false; }
        var deps = [];
        var match = method.toString().match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m); //^[^\(]*\(\s*([^\)]*)\).*\=\>
        if (match && match[1]) {
            deps = match[1].replace(/ /g, "").split(",");
        }
        return this.resolveFrom(deps, method, scope, raw);
    };
    DependencyInjector.prototype.resolveRaw = function (method, scope) {
        if (scope === void 0) { scope = null; }
        return this.resolve(method, scope, true);
    };
    DependencyInjector.prototype.invokeFrom = function (deps, method, scope, raw) {
        if (scope === void 0) { scope = null; }
        if (raw === void 0) { raw = false; }
        var fn = this.resolveFrom(deps, method, scope, raw);
        return fn();
    };
    DependencyInjector.prototype.invokeRawFrom = function (deps, method, scope) {
        if (scope === void 0) { scope = null; }
        return this.invokeFrom(deps, method, scope, true);
    };
    DependencyInjector.prototype.invoke = function (method, scope, raw) {
        if (scope === void 0) { scope = null; }
        if (raw === void 0) { raw = false; }
        var fn = this.resolve(method, scope, raw);
        return fn();
    };
    DependencyInjector.prototype.invokeRaw = function (method, scope) {
        if (scope === void 0) { scope = null; }
        return this.invoke(method, scope, true);
    };
    DependencyInjector.instances = {};
    return DependencyInjector;
}());
exports.default = DependencyInjector;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventAggregator = (function () {
    function EventAggregator() {
        this.subs = {};
        this._id = 0;
    }
    EventAggregator.getInstance = function (type) {
        if (type === void 0) { type = "main"; }
        if (EventAggregator.instances[type] === undefined) {
            EventAggregator.instances[type] = new EventAggregator();
        }
        return EventAggregator.instances[type];
    };
    EventAggregator.prototype.on = function (event, fn, once) {
        var _this = this;
        if (once === void 0) { once = false; }
        if (Array.isArray(event)) {
            var subs_1 = event.map(function (e) { return _this.on(e, fn, once); });
            return {
                off: function () { return subs_1.forEach(function (sub) { return sub.off(); }); },
            };
        }
        else {
            return this.addSub(event, fn, once);
        }
    };
    EventAggregator.prototype.once = function (event, fn) {
        return this.on(event, fn, true);
    };
    EventAggregator.prototype.emit = function (event, data) {
        var _this = this;
        if (Array.isArray(event)) {
            event.forEach(function (e) { return _this.emit(e, data); });
        }
        else {
            this.emitSubs(event, data, event);
            this.emitSubs("*", data, event);
        }
        return this;
    };
    EventAggregator.prototype.off = function (event, id) {
        this.subs[event].splice(this.subs[event].findIndex(function (sub) { return sub._id === id; }), 1);
        return this;
    };
    EventAggregator.prototype.addSub = function (event, fn, once) {
        var _this = this;
        if (once === void 0) { once = false; }
        if (this.subs[event] === undefined) {
            this.subs[event] = [];
        }
        var id = this.getNextId();
        this.subs[event].push({ _id: id, _fn: fn, once: once });
        return { off: function () { return _this.off(event, id); } };
    };
    EventAggregator.prototype.emitSubs = function (event, data, originalEvent) {
        if (this.subs[event] !== undefined) {
            for (var i = 0; i < this.subs[event].length; i++) {
                var sub = this.subs[event][i];
                if (typeof sub._fn === "function") {
                    sub._fn(data, originalEvent);
                    if (sub.once === true) {
                        this.off(event, sub._id);
                        i--;
                    }
                }
                else {
                    this.off(event, sub._id);
                    i--;
                }
            }
        }
    };
    EventAggregator.prototype.getNextId = function () {
        return this._id++;
    };
    EventAggregator.instances = {};
    return EventAggregator;
}());
var debounce = function (fn, threshhold, scope) {
    if (threshhold === void 0) { threshhold = 100; }
    if (scope === void 0) { scope = null; }
    var deferTimer;
    return function () {
        var args = arguments;
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
            fn.apply(scope, args);
        }, threshhold);
    };
};
exports.debounce = debounce;
var throttle = function (fn, threshhold, scope) {
    if (threshhold === void 0) { threshhold = 100; }
    if (scope === void 0) { scope = null; }
    var last;
    var deferTimer;
    return function () {
        var now = Date.now();
        var args = arguments;
        if (last && now < last + threshhold) {
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                fn.apply(scope, args);
            }, threshhold);
        }
        else {
            last = now;
            fn.apply(scope, args);
        }
    };
};
exports.throttle = throttle;
exports.default = EventAggregator;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var DTI = __webpack_require__(34);
exports.createImage = function (imageData, maxWidth, maxHeight) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2, new Promise(function (resolve, reject) {
                var image = new Image();
                image.onload = function () {
                    var width = image.naturalWidth;
                    var height = image.naturalHeight;
                    var ratio = height / width;
                    if (ratio < 1) {
                        if (maxWidth && width > maxWidth) {
                            width = Math.floor(maxWidth);
                            height = Math.floor(ratio * maxWidth);
                        }
                        if (maxHeight && height > maxHeight) {
                            height = Math.floor(maxHeight);
                            width = Math.floor(ratio * maxHeight);
                        }
                    }
                    else {
                        if (maxHeight && height > maxHeight) {
                            height = Math.floor(maxHeight);
                            width = Math.floor(ratio * maxHeight);
                        }
                        if (maxWidth && width > maxWidth) {
                            width = Math.floor(maxWidth);
                            height = Math.floor(ratio * maxWidth);
                        }
                    }
                    resolve({ image: image, width: width, height: height });
                };
                image.onerror = function (err) { return reject(err); };
                image.src = imageData;
            })];
    });
}); };
exports.compress = function (imageData, quality, maxWidth, maxHeight, type, pixelated) {
    if (quality === void 0) { quality = 0.9; }
    if (type === void 0) { type = "jpeg"; }
    if (pixelated === void 0) { pixelated = false; }
    return __awaiter(_this, void 0, void 0, function () {
        var _a, image, width, height, canvas, ctx;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (type === undefined) {
                        type = exports.getImageType(imageData) || "jpeg";
                    }
                    return [4, exports.createImage(imageData, maxWidth, maxHeight)];
                case 1:
                    _a = _b.sent(), image = _a.image, width = _a.width, height = _a.height;
                    if (image.naturalWidth === width && image.naturalHeight === height && quality === 1) {
                        return [2, imageData];
                    }
                    canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    ctx = canvas.getContext("2d");
                    if (!ctx) {
                        throw new Error("canvas not initialized");
                    }
                    ctx.imageSmoothingEnabled = pixelated;
                    ctx.drawImage(image, 0, 0, width, height);
                    return [2, canvas.toDataURL("image/" + type, quality)];
            }
        });
    });
};
exports.getImageType = function (base64) {
    var match = base64.match(/data:image\/([a-zA-Z]*);base64/);
    if (match) {
        return match[1] || "jpeg";
    }
    return "jpeg";
};
exports.isBase64 = function (base64) {
    var match = base64.match(/data:image\/([a-zA-Z]*);base64/);
    return !!match;
};
exports.uploadImage = function (image, quality, maxWidth, maxHeight) {
    return new Promise(function (resolve) {
        var fReader = new FileReader();
        fReader.onload = function () { return exports.compress(fReader.result, quality, maxWidth, maxHeight)
            .then(function (compressed) { return resolve(compressed); })
            .catch(function (err) { return resolve(fReader.result); }); };
        fReader.readAsDataURL(image);
    });
};
exports.imageUrlToB64 = function (url, quality, maxWidth, maxHeight) {
    return new Promise(function (resolve) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () { return exports.compress(reader.result, quality, maxWidth, maxHeight)
                .then(function (compressed) { return resolve(compressed); })
                .catch(function (err) { return resolve(reader.result); }); };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.send();
    });
};
exports.domToImage = function (node) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2, DTI.toPng(node)];
}); }); };
exports.downloadImage = function (imageData, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = imageData;
    link.click();
};
exports.getThumb = function (original, quality, maxWidth, maxHeight, type, pixelated) {
    if (quality === void 0) { quality = .5; }
    if (maxWidth === void 0) { maxWidth = 128; }
    if (maxHeight === void 0) { maxHeight = 128; }
    if (type === void 0) { type = "jpeg"; }
    if (pixelated === void 0) { pixelated = false; }
    return exports.compress(original, quality, maxWidth, maxHeight, type, pixelated);
};
exports.modifyPixels = function (imageData, eachRow, pixelated) {
    if (pixelated === void 0) { pixelated = false; }
    return new Promise(function (resolve, reject) {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("canvas not initialized");
        }
        var image = new Image();
        image.onload = function () {
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            ctx.imageSmoothingEnabled = pixelated;
            ctx.drawImage(image, 0, 0);
            var buffer = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var data = buffer.data;
            var pixelsPerRow = canvas.width * 4;
            for (var h = 0; h < canvas.height; h++) {
                var offset = h * pixelsPerRow;
                var modified = eachRow(data.slice(offset, offset + pixelsPerRow), h);
                if (modified && modified.length === pixelsPerRow) {
                    for (var i = 0; i < pixelsPerRow; i++) {
                        data[offset + i] = modified[i];
                    }
                }
            }
            ctx.putImageData(buffer, 0, 0);
            resolve(canvas.toDataURL("png"));
        };
        image.onerror = function (err) { return reject(err); };
        image.src = imageData;
    });
};
exports.colorPicker = function (canvas, onhover, onclick) {
    var ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error("canvas not initialized");
    }
    var pick = function (event) {
        var x = event.layerX;
        var y = event.layerY;
        var pixel = ctx.getImageData(x, y, 1, 1);
        var data = pixel.data;
        return [data[0], data[1], data[2], data[3]];
    };
    canvas.addEventListener("mousemove", function (event) { return onhover.apply(void 0, pick(event)); });
    canvas.addEventListener("click", function (event) { return onclick.apply(void 0, pick(event)); });
};
exports.avgPixel = function (pixels) {
    var r = 0;
    var g = 0;
    var b = 0;
    var a = 0;
    for (var i = 0; i < pixels.length; i += 4) {
        if (pixels[i] !== undefined) {
            r += pixels[i];
            g += pixels[i + 1];
            b += pixels[i + 2];
            a += pixels[i + 3];
        }
    }
    var total = pixels.length / 4;
    return [r / total, g / total, b / total, a / total];
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (error) {
    if (window["debug"] === true) {
        console.error(error.message, error.stack);
    }
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(40);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/postcss-loader/lib/index.js!../../../../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/postcss-loader/lib/index.js!../../../../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var assign = make_assign()
var create = make_create()
var trim = make_trim()
var Global = (typeof window !== 'undefined' ? window : global)

module.exports = {
	assign: assign,
	create: create,
	trim: trim,
	bind: bind,
	slice: slice,
	each: each,
	map: map,
	pluck: pluck,
	isList: isList,
	isFunction: isFunction,
	isObject: isObject,
	Global: Global
}

function make_assign() {
	if (Object.assign) {
		return Object.assign
	} else {
		return function shimAssign(obj, props1, props2, etc) {
			for (var i = 1; i < arguments.length; i++) {
				each(Object(arguments[i]), function(val, key) {
					obj[key] = val
				})
			}			
			return obj
		}
	}
}

function make_create() {
	if (Object.create) {
		return function create(obj, assignProps1, assignProps2, etc) {
			var assignArgsList = slice(arguments, 1)
			return assign.apply(this, [Object.create(obj)].concat(assignArgsList))
		}
	} else {
		function F() {} // eslint-disable-line no-inner-declarations
		return function create(obj, assignProps1, assignProps2, etc) {
			var assignArgsList = slice(arguments, 1)
			F.prototype = obj
			return assign.apply(this, [new F()].concat(assignArgsList))
		}
	}
}

function make_trim() {
	if (String.prototype.trim) {
		return function trim(str) {
			return String.prototype.trim.call(str)
		}
	} else {
		return function trim(str) {
			return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
		}
	}
}

function bind(obj, fn) {
	return function() {
		return fn.apply(obj, Array.prototype.slice.call(arguments, 0))
	}
}

function slice(arr, index) {
	return Array.prototype.slice.call(arr, index || 0)
}

function each(obj, fn) {
	pluck(obj, function(val, key) {
		fn(val, key)
		return false
	})
}

function map(obj, fn) {
	var res = (isList(obj) ? [] : {})
	pluck(obj, function(v, k) {
		res[k] = fn(v, k)
		return false
	})
	return res
}

function pluck(obj, fn) {
	if (isList(obj)) {
		for (var i=0; i<obj.length; i++) {
			if (fn(obj[i], i)) {
				return obj[i]
			}
		}
	} else {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (fn(obj[key], key)) {
					return obj[key]
				}
			}
		}
	}
}

function isList(val) {
	return (val != null && typeof val != 'function' && typeof val.length == 'number')
}

function isFunction(val) {
	return val && {}.toString.call(val) === '[object Function]'
}

function isObject(val) {
	return val && {}.toString.call(val) === '[object Object]'
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var eventaggregator_1 = __webpack_require__(8);
var m = __webpack_require__(0);
var dom_1 = __webpack_require__(4);
var logger_1 = __webpack_require__(10);
var object_1 = __webpack_require__(1);
var Area_1 = __webpack_require__(17);
__webpack_require__(51);
var domEA = eventaggregator_1.default.getInstance("dom");
var mouseEventDelay = 200;
var DragItem = (function () {
    function DragItem() {
        this.staticPosition = {};
        this.initialPosition = {};
        this.position = {};
        this.constrain = { minWidth: 20, minHeight: 20 };
        this.dragStarted = false;
        this.resizeStarted = false;
        this.events = [];
        this.data = {};
        this.type = "main";
    }
    DragItem.prototype.getBoundingClientRect = function () {
        return dom_1.getOuterRect(this.dom);
    };
    DragItem.prototype.getData = function (key) {
        if (key) {
            return this.data[key];
        }
        return this.data;
    };
    DragItem.prototype.updatePosition = function (position) {
        this.setPosition(position);
        if (this.dragStarted || this.resizeStarted) {
            this.setDOMFixedPosition();
        }
        else {
            this.setDOMRelativePosition();
        }
    };
    DragItem.prototype.setStaticPosition = function (position) {
        this.staticPosition = position;
        if (this.dragStarted || this.resizeStarted) {
            this.setDOMFixedPosition(__assign({}, this.position, this.staticPosition));
        }
    };
    DragItem.prototype.getPosition = function (_a) {
        var snapToGrid = (_a === void 0 ? {} : _a).snapToGrid;
        var position = {
            width: this.position.width,
            height: this.position.height,
            top: this.position.top,
            left: this.position.left,
        };
        if (snapToGrid && this.targetArea) {
            var grid = this.targetArea.getConstraints().grid;
            if (grid) {
                return DragItem.snapToRelativeGrid(position, grid);
            }
        }
        return position;
    };
    DragItem.withinArea = function (position, area, margin) {
        if (margin) {
            if (position.left < area.left - margin) {
                return position;
            }
            if (position.top < area.top - margin) {
                return position;
            }
            if (position.left + position.width > area.left + area.width + margin) {
                return position;
            }
            if (position.top + position.height > area.top + area.height + margin) {
                return position;
            }
        }
        if (position.left < area.left) {
            position.left = area.left;
        }
        if (position.top < area.top) {
            position.top = area.top;
        }
        if (position.left + position.width > area.left + area.width) {
            position.left = area.left + area.width - position.width;
        }
        if (position.top + position.height > area.top + area.height) {
            position.top = area.top + area.height - position.height;
        }
        return position;
    };
    DragItem.snapToRelativeGrid = function (position, grid) {
        return {
            left: (Math.round(position.left / grid.width) * grid.width),
            top: (Math.round(position.top / grid.height) * grid.height),
            width: (Math.round(position.width / grid.width) * grid.width),
            height: (Math.round(position.height / grid.height) * grid.height),
        };
    };
    DragItem.snapToFixedGrid = function (position, areaRect, grid, withOffsets) {
        if (withOffsets === void 0) { withOffsets = false; }
        var offsets = withOffsets ? {
            left: areaRect.left % grid.width,
            top: areaRect.top % grid.height,
        } : { left: 0, top: 0 };
        return {
            left: (Math.round(position.left / grid.width) * grid.width) + offsets.left,
            top: (Math.round(position.top / grid.height) * grid.height) + offsets.top,
            width: (Math.round(position.width / grid.width) * grid.width),
            height: (Math.round(position.height / grid.height) * grid.height),
        };
    };
    DragItem.prototype.reset = function (hard) {
        if (hard) {
            this.previousFixedPosition = {};
            this.lastTargetArea = undefined;
            this.position = {};
            this.sourceArea = undefined;
            this.clearDOMPosition();
        }
        this.staticPosition = {};
        this.resizeSide = undefined;
        this.dragStarted = false;
        this.resizeStarted = false;
        this.targetArea = undefined;
        this.pressStamp = 0;
        this.dom.classList.remove("within-area", "dragging", "resizing");
        Area_1.getAreas(this.type).forEach(function (area) {
            area.setFocus(false);
            area.setDisabled(false);
        });
        if (this.placeholder) {
            dom_1.setStyle(this.placeholder, { display: "none" });
        }
    };
    DragItem.prototype.oninit = function (vnode) {
        this.setState(vnode.attrs);
    };
    DragItem.prototype.oncreate = function (vnode) {
        var _this = this;
        this.dom = vnode.dom;
        if (this.preventPosition === true) {
            this.clearDOMPosition();
        }
        else {
            this.setDOMRelativePosition(this.position);
        }
        this.events = [
            domEA.on(["mousemove", "touchmove"], function (event) { return _this.onMouseMove(event); }),
            domEA.on("contextmenu", function (event) {
                if (event.path.indexOf(_this.dom) !== -1) {
                    _this.reset(true);
                    m.redraw();
                }
            }),
            domEA.on(["mouseup", "touchend"], function (event) { return _this.onMouseUp(event); }),
        ];
    };
    DragItem.prototype.onbeforeupdate = function (vnode, old) {
        this.setState(vnode.attrs);
        return DragItem.attrsChanged(vnode.attrs, old.attrs);
    };
    DragItem.prototype.onupdate = function (vnode) {
        this.dom = vnode.dom;
        if (this.preventPosition === true) {
            this.clearDOMPosition();
        }
        else {
            this.setDOMRelativePosition(this.position);
        }
    };
    DragItem.prototype.onremove = function (vnode) {
        this.events.forEach(function (event) { return event.off(); });
    };
    DragItem.prototype.view = function (vnode) {
        var _this = this;
        return [
            m("div", { className: object_1.cleanString("component--drag", "drag-item", vnode.attrs.className, !vnode.attrs.dragHandle && "handle"), style: vnode.attrs.style, onmousedown: function (event) {
                    dom_1.stopEvent(event);
                    _this.pressStamp = Date.now();
                    if (!vnode.attrs.dragHandle && !vnode.attrs.preventMove) {
                        _this.onDrag(event);
                    }
                }, ontouchstart: function (event) {
                    dom_1.stopEvent(event);
                    _this.pressStamp = Date.now();
                    if (!vnode.attrs.dragHandle && !vnode.attrs.preventMove) {
                        _this.onDrag(event);
                    }
                }, onmouseup: function (event) {
                    dom_1.stopEvent(event);
                    _this.onClick(event);
                }, ontouchup: function (event) {
                    dom_1.stopEvent(event);
                    _this.onClick(event);
                } },
                vnode.attrs.dragHandle && !vnode.attrs.preventMove && this.getDragHandleView(vnode),
                !vnode.attrs.preventResize && this.getResizeBorderView(vnode),
                vnode.children),
            vnode.attrs.keepPlaceholder && this.getPlaceholderView(vnode),
        ];
    };
    DragItem.prototype.getDragHandleView = function (vnode) {
        var _this = this;
        return m("div", { className: "handle", onmousedown: function (event) {
                dom_1.stopEvent(event);
                _this.onDrag(event);
            } }, vnode.attrs.dragHandle === true ? null : vnode.attrs.dragHandle);
    };
    DragItem.prototype.getPlaceholderView = function (vnode) {
        var _this = this;
        return m("div", { oncreate: function (node) {
                _this.placeholder = node.dom;
                dom_1.setStyle(_this.placeholder, { position: "relative", display: "none", backgroundColor: "#aaa" });
            }, className: "component--drag placeholder" });
    };
    DragItem.prototype.getResizeBorderView = function (vnode) {
        var _this = this;
        return [
            m("div", { onmousedown: function (event) {
                    dom_1.stopEvent(event, true);
                    _this.onResize("left");
                }, className: "border left" }),
            m("div", { onmousedown: function (event) {
                    dom_1.stopEvent(event, true);
                    _this.onResize("right");
                }, className: "border right" }),
            m("div", { onmousedown: function (event) {
                    dom_1.stopEvent(event, true);
                    _this.onResize("top");
                }, className: "border top" }),
            m("div", { onmousedown: function (event) {
                    dom_1.stopEvent(event, true);
                    _this.onResize("bottom");
                }, className: "border bottom" }),
        ];
    };
    DragItem.attrsChanged = function (next, prev) {
        return (next.onitemmovestart !== prev.onitemmovestart ||
            next.onitemmove !== prev.onitemmove ||
            next.onitemmoveend !== prev.onitemmoveend ||
            next.onitemresizestart !== prev.onitemresizestart ||
            next.onitemresize !== prev.onitemresize ||
            next.onitemresizeend !== prev.onitemresizeend ||
            next.onclick !== prev.onclick ||
            next.dragHandle !== prev.dragHandle ||
            next.preventMove !== prev.preventMove ||
            next.preventResize !== prev.preventResize ||
            next.position !== prev.position ||
            next.preventPosition !== prev.preventPosition);
    };
    DragItem.prototype.setState = function (attrs) {
        var _this = this;
        Object.keys(attrs).forEach(function (key) { return _this[key] = attrs[key]; });
        this.initialPosition = attrs.position || {};
    };
    DragItem.prototype.setInitialPosition = function () {
        var _a = this.getBoundingClientRect(), width = _a.width, height = _a.height;
        this.position = __assign({}, this.position, { top: 0, left: 0, width: width, height: height });
        return this.position;
    };
    DragItem.prototype.getSourceArea = function () {
        var itemRect = this.getBoundingClientRect();
        return Area_1.getAreas(this.type).find(function (area) { return area.withinArea(itemRect); });
    };
    DragItem.prototype.getTargetArea = function () {
        var _this = this;
        var targetArea = undefined;
        Area_1.getAreas(this.type).forEach(function (area) {
            area.setDisabled(false);
            area.setFocus(false);
            if (targetArea === undefined && area.withinArea(_this.getBoundingClientRect())) {
                targetArea = area;
            }
        });
        return targetArea;
    };
    DragItem.prototype.getCursorOffset = function (x, y) {
        return {
            left: x + this.dragOffset.left,
            top: y + this.dragOffset.top,
        };
    };
    DragItem.prototype.setDOMFixedPosition = function (position) {
        if (position === void 0) { position = this.position; }
        if (this.sourceArea && this.sourceArea === this.targetArea) {
            dom_1.setStyle(this.dom, __assign({ position: "fixed" }, dom_1.getRectStyle(position)));
        }
        else {
            dom_1.setStyle(this.dom, __assign({ position: "fixed" }, dom_1.getRectStyle(position), { zIndex: 999 }));
        }
    };
    DragItem.prototype.setDOMRelativePosition = function (position) {
        if (position === void 0) { position = this.position; }
        var _a = dom_1.getRectStyle(position), top = _a.top, left = _a.left, width = _a.width, height = _a.height;
        dom_1.setStyle(this.dom, { position: "absolute", top: top, left: left, width: width, height: height, zIndex: 0 });
    };
    DragItem.prototype.clearDOMPosition = function () {
        dom_1.setStyle(this.dom, {
            position: "",
            top: this.initialPosition.top || "",
            left: this.initialPosition.left || "",
            width: this.initialPosition.width || "",
            height: this.initialPosition.height || "",
            zIndex: "",
        });
    };
    DragItem.prototype.getRelativePoints = function (area) {
        var itemRect = this.getBoundingClientRect();
        var areaRect = area.getBoundingClientRect();
        return {
            left: itemRect.left - areaRect.left,
            top: itemRect.top - areaRect.top,
        };
    };
    DragItem.prototype.setPosition = function (position) {
        this.position = __assign({}, this.position, position);
    };
    DragItem.getFixedOffset = function (position, x, y) {
        return {
            left: position.left - x,
            top: position.top - y,
        };
    };
    DragItem.prototype.getCalculatedPosition = function (position) {
        if (this.targetArea === undefined) {
            return position;
        }
        var _a = this.targetArea.getConstraints(), grid = _a.grid, constrain = _a.constrain;
        if (grid !== undefined && grid.width > 0 && grid.height > 0) {
            position = DragItem.snapToFixedGrid(position, this.targetArea.getBoundingClientRect(), grid, true);
        }
        if (constrain !== undefined) {
            var areaRect = this.targetArea.getBoundingClientRect();
            position = __assign({}, position, DragItem.withinArea(position, areaRect, typeof constrain === "object" ? constrain.margin : undefined));
        }
        return position;
    };
    DragItem.prototype.onClick = function (event) {
        if (event.which === 1 && Date.now() < this.pressStamp + mouseEventDelay) {
            object_1.exec(this.onclick, event, this);
        }
    };
    DragItem.prototype.onDrag = function (event) {
        this.dragStarted = true;
        this.setInitialPosition();
        this.previousFixedPosition = this.getBoundingClientRect();
        this.sourceArea = this.getSourceArea();
        if (this.placeholder) {
            if (!this.placeholderPosition) {
                var _a = this.previousFixedPosition, width = _a.width, height = _a.height;
                this.placeholderPosition = { width: width, height: height };
            }
            dom_1.setStyle(this.placeholder, dom_1.getRectStyle(this.placeholderPosition));
        }
        this.dragOffset = DragItem.getFixedOffset(this.previousFixedPosition, this.getClientX(event), this.getClientY(event));
        object_1.exec(this.onitemmovestart, event, this, this.sourceArea, this.targetArea);
        this.dom.classList.add("dragging");
    };
    DragItem.prototype.onDragMove = function (event) {
        var _this = this;
        console.log(event);
        this.lastTargetArea = this.targetArea;
        this.targetArea = this.getTargetArea();
        var disable = function (area) {
            area.setDisabled(true);
            area.setFocus(false);
            _this.preventDrop = true;
            _this.dom.classList.remove("within-area");
        };
        var enable = function (area) {
            area.setFocus(true);
            area.setDisabled(false);
            _this.preventDrop = false;
            _this.dom.classList.add("within-area");
        };
        if (this.targetArea) {
            try {
                var hoverResult = this.targetArea.onItemHover(event, this, this.sourceArea, (this.targetArea !== this.lastTargetArea && this.targetArea !== this.sourceArea));
                if (hoverResult === false) {
                    disable(this.targetArea);
                }
                else {
                    enable(this.targetArea);
                }
            }
            catch (err) {
                logger_1.default(err);
                disable(this.targetArea);
            }
        }
        var position = __assign({}, this.previousFixedPosition, this.staticPosition);
        position = __assign({}, position, this.getCursorOffset(this.getClientX(event), this.getClientY(event)));
        if (this.preventDrop !== true) {
            position = this.getCalculatedPosition(position);
        }
        this.setDOMFixedPosition(position);
        if (this.placeholder) {
            dom_1.setStyle(this.placeholder, { display: "" });
        }
        object_1.exec(this.onitemmove, event, this, this.sourceArea, this.targetArea);
    };
    DragItem.prototype.onDragUp = function (event) {
        this.dragStarted = false;
        Area_1.getAreas(this.type).forEach(function (area) {
            area.setFocus(false);
            area.setDisabled(false);
        });
        this.staticPosition = {};
        if (this.placeholder) {
            dom_1.setStyle(this.placeholder, { display: "none" });
        }
        if (this.targetArea && this.preventDrop === true) {
            this.preventDrop = false;
            if (this.sourceArea) {
                this.sourceArea.onItemRemove(event, this);
            }
            else {
                this.reset(true);
            }
            return;
        }
        var position = this.getBoundingClientRect();
        if (this.targetArea) {
            this.setPosition(__assign({}, position, this.getRelativePoints(this.targetArea), this.staticPosition));
            this.setDOMRelativePosition(this.position);
            object_1.exec(this.onitemmoveend, event, this, this.sourceArea, this.targetArea);
        }
        if (this.targetArea && this.targetArea !== this.sourceArea) {
            this.targetArea.onItemDrop(event, this, this.sourceArea);
        }
        if (this.sourceArea) {
            if (this.sourceArea !== this.targetArea) {
                this.sourceArea.onItemRemove(event, this);
            }
        }
        else {
            this.clearDOMPosition();
        }
        this.dom.classList.remove("dragging", "within-area");
    };
    DragItem.prototype.onResize = function (side) {
        this.resizeStarted = true;
        this.previousFixedPosition = this.getBoundingClientRect();
        this.sourceArea = this.targetArea = this.getSourceArea();
        this.resizeSide = side;
        object_1.exec(this.onitemresizestart, event, this, this.sourceArea);
        this.dom.classList.add("resizing");
    };
    DragItem.prototype.onResizeMove = function (x, y) {
        if (!this.sourceArea) {
            return;
        }
        var areaRect = this.sourceArea.getBoundingClientRect();
        var position = __assign({}, this.position);
        var diff = { left: 0, top: 0, right: 0, bottom: 0 };
        if (this.resizeSide === "left") {
            diff.left = x - this.previousFixedPosition.left;
            var diffLeft = this.position.left + diff.left;
            if (diffLeft < 0) {
                diff.left -= diffLeft;
            }
            position.left = this.position.left + diff.left;
            position.width = this.position.width - diff.left;
        }
        else if (this.resizeSide === "top") {
            diff.top = y - this.previousFixedPosition.top;
            var diffTop = this.position.top + diff.top;
            if (diffTop < 0) {
                diff.top -= diffTop;
            }
            position.top = this.position.top + diff.top;
            position.height = this.position.height - diff.top;
        }
        else if (this.resizeSide === "right") {
            diff.right = x - this.position.width - this.previousFixedPosition.left;
            var diffRight = position.left + this.position.width + diff.right;
            if (diffRight > areaRect.width) {
                diff.right += areaRect.width - diffRight;
            }
            position.width = this.position.width + diff.right;
        }
        else if (this.resizeSide === "bottom") {
            diff.bottom = y - this.position.height - this.previousFixedPosition.top;
            var diffBottom = position.top + this.position.height + diff.bottom;
            if (diffBottom > areaRect.height) {
                diff.bottom += areaRect.height - diffBottom;
            }
            position.height = this.position.height + diff.bottom;
        }
        var grid = this.sourceArea.getConstraints().grid;
        if (grid !== undefined && grid.width > 0 && grid.height > 0) {
            position = DragItem.snapToRelativeGrid(position, grid);
        }
        this.setDOMRelativePosition(position);
        object_1.exec(this.onitemresize, event, this, this.sourceArea);
    };
    DragItem.prototype.onResizeUp = function (event) {
        this.resizeStarted = false;
        var position = this.getBoundingClientRect();
        this.setPosition(__assign({}, position, (this.targetArea ? this.getRelativePoints(this.targetArea) : {})));
        object_1.exec(this.onitemresizeend, event, this, this.sourceArea);
        this.dom.classList.remove("resizing");
    };
    DragItem.prototype.onMouseUp = function (event) {
        if (!this.dragStarted && !this.resizeStarted) {
            return;
        }
        if (Date.now() < this.pressStamp + mouseEventDelay) {
            this.dragStarted = false;
            this.resizeStarted = false;
            return;
        }
        if (this.dragStarted === true) {
            this.onDragUp(event);
        }
        else if (this.resizeStarted === true) {
            this.onResizeUp(event);
        }
    };
    DragItem.prototype.onMouseMove = function (event) {
        if (Date.now() < this.pressStamp + mouseEventDelay) {
            return;
        }
        if (this.dragStarted) {
            this.onDragMove(event);
        }
        else if (this.resizeStarted) {
            this.onResizeMove(this.getClientX(event), this.getClientY(event));
        }
    };
    DragItem.prototype.getClientX = function (event) {
        if (event.clientX) {
            return event.clientX;
        }
        return event.touches[0].clientX;
    };
    DragItem.prototype.getClientY = function (event) {
        if (event.clientY) {
            return event.clientX;
        }
        return event.touches[0].clientY;
    };
    return DragItem;
}());
exports.default = DragItem;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var inject_1 = __webpack_require__(85);
var getComputedStyleNumber = function (dom, property) {
    var style = getComputedStyle(dom)[property];
    return style ? parseFloat(style) : 0;
};
var getTransitionDuration = function (dom) {
    return (getComputedStyleNumber(dom, "transitionDelay") +
        getComputedStyleNumber(dom, "transitionDuration")) * 1000;
};
exports.getTransitionDuration = getTransitionDuration;
var groups = {};
var getExecutionDelay = function (group, delay) {
    if (group === void 0) { group = "main"; }
    if (delay === void 0) { delay = 0; }
    var now = Date.now();
    if (groups[group] === undefined) {
        groups[group] = { i: -1, t: now };
    }
    var g = groups[group];
    if (g.t + 50 < now) {
        g.i = 0;
    }
    else {
        g.i++;
    }
    g.t = now;
    return g.i * delay;
};
var injectAttrs = function (v, attrs) {
    if (typeof attrs !== "object" || attrs === null) {
        throw new Error("Attrs must be an object");
    }
    if (!v.attrs) {
        v.attrs = {};
    }
    v.attrs = __assign({}, v.attrs, attrs);
};
var walkNodes = function (nodes, options, depth) {
    if (depth === void 0) { depth = -1; }
    depth++;
    var filtered = [];
    if (typeof options.deep === "number" && depth > options.deep) {
        return filtered;
    }
    if (typeof nodes !== "object" || nodes === null) {
        return filtered;
    }
    if (Array.isArray(nodes)) {
        nodes.forEach(function (child) {
            filtered = filtered.concat(walkNodes(child, options, depth));
        });
        return filtered;
    }
    if (nodes.attrs && nodes.attrs.transition) {
        filtered.push(nodes);
    }
    if (Array.isArray(nodes.children)) {
        nodes.children.forEach(function (child) {
            filtered = filtered.concat(walkNodes(child, options, depth));
        });
    }
    return filtered;
};
var getFullExecutionDelay = function (v, options) {
    if (typeof v.attrs.transitionorder === "number" && options.delay) {
        return (v.attrs.transitionorder * options.delay) + (options.pause || 0);
    }
    else {
        return getExecutionDelay(options.group + "before", options.delay) + (options.pause || 0);
    }
};
var mergeOptions = function (options, attrs) {
    var merged = __assign({}, options);
    if (attrs.transition) {
        merged.transition = attrs.transition;
    }
    if (attrs.transitiongroup) {
        merged.group = attrs.transitiongroup;
    }
    if (attrs.transitiondelay) {
        merged.delay = attrs.transitiondelay;
    }
    if (attrs.transitionbeforedelay) {
        merged.beforedelay = attrs.transitionbeforedelay;
    }
    return merged;
};
var oncreate = function (v, options, cb) {
    if (!v || !v.dom) {
        return;
    }
    var execDelay = getFullExecutionDelay(v, options);
    setTimeout(function () {
        v.dom.classList.remove("before");
        if (typeof cb === "function") {
            cb();
        }
    }, execDelay || 20);
};
var onbeforeremoveChildren = function (children) {
    if (!Array.isArray(children)) {
        return new Promise(function (resolve) { return resolve(); });
    }
    return Promise.all(children.map(function (child) {
        if (child && child.state && child.state.onbeforeremove) {
            return child.state.onbeforeremove.call(child.state, child);
        }
    }));
};
var onbeforeremove = function (v, options) {
    if (!v || !v.dom) {
        return;
    }
    var execDelay = getFullExecutionDelay(v, options);
    var childrenPromise = onbeforeremoveChildren(v.children);
    var promise = new Promise(function (resolve) { return setTimeout(function () {
        v.dom.classList.add("after");
        var duration = getTransitionDuration(v.dom);
        setTimeout(function () { return resolve(); }, duration + execDelay);
    }, execDelay); });
    return Promise.all([promise, childrenPromise]);
};
var applyClassNames = function (node, transition, initial) {
    if (Array.isArray(node)) {
        var className = node[0].attrs ? (node[0].attrs.className || "") : "";
        injectAttrs(node[0], { className: className + " " + transition + " " + (initial ? "before" : "") });
    }
    else {
        var className = node.attrs ? (node.attrs.className || "") : "";
        injectAttrs(node, { className: className + " " + transition + " " + (initial ? "before" : "") });
    }
};
var injectTransition = function (component, options, injector) {
    if (options === void 0) { options = {}; }
    if (injector === void 0) { injector = inject_1.injectClass; }
    if (typeof component !== "function") {
        throw new Error("Component Class is not a valid class (typeof function)");
    }
    if (options.deep === undefined) {
        options.deep = false;
    }
    if (options.beforedelay === undefined) {
        options.beforedelay = 0;
    }
    if (options.afterdelay === undefined) {
        options.afterdelay = 0;
    }
    if (options.delay === undefined) {
        options.delay = 0;
    }
    var lifeCycles = {
        view: function (original, v) {
            var node = original(v);
            if (options.deep) {
                walkNodes(node, options).forEach(function (tNode) {
                    var mergedOptions = mergeOptions(options, tNode.attrs);
                    injectAttrs(tNode, {
                        className: tNode.attrs.className + " " + mergedOptions.transition + " before",
                        oncreate: function (tNodeV) { return oncreate(tNodeV, mergedOptions); },
                        onbeforeremove: function (tNodeV) { return onbeforeremove(tNodeV, mergedOptions); },
                    });
                });
            }
            if (options.transition) {
                applyClassNames(node, options.transition, !v.state.created);
            }
            return node;
        },
        oncreate: function (original, v) {
            original(v);
            if (options.transition) {
                oncreate(v, options, function () {
                    v.state.created = true;
                });
            }
        },
        onbeforeremove: function (original, v) {
            return Promise.all([onbeforeremove(v, options), original(v)]);
        },
    };
    return injector(component, lifeCycles);
};
exports.default = injectTransition;


/***/ }),
/* 15 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var m = __webpack_require__(0);
var dom_1 = __webpack_require__(4);
var object_1 = __webpack_require__(1);
var HolderContent_1 = __webpack_require__(36);
var Holder = (function () {
    function Holder() {
    }
    Holder.prototype.view = function (v) {
        var h = v.attrs.holder;
        return m("div", { className: object_1.cleanString("holder", v.attrs.className), style: exports.getHolderStyle(h, v.attrs.position), onclick: function (event) { return dom_1.stopEvent(event) && object_1.exec(v.attrs.onclick, event); } },
            m(HolderContent_1.default, { holder: v.attrs.holder, thumb: v.attrs.thumb }));
    };
    return Holder;
}());
exports.default = Holder;
exports.getHolderStyle = function (h, position) {
    if (position === void 0) { position = h.position; }
    var style = __assign({}, dom_1.getRectStyle(position), { position: "absolute", overflow: "hidden", whiteSpace: "pre", display: "flex", alignItems: "center", backgroundColor: (h.content && h.content.backgroundColor) || "", opacity: (h.content && h.content.opacity) || "", imageRendering: (h.content && h.content.pixelated) ? "pixelated" : "" });
    return style;
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var m = __webpack_require__(0);
var dom_1 = __webpack_require__(4);
var object_1 = __webpack_require__(1);
var Item_1 = __webpack_require__(13);
__webpack_require__(53);
var areas = {};
exports.getAreas = function (type) { return areas[type] || []; };
var DragArea = (function () {
    function DragArea() {
        this.items = [];
        this.type = "main";
    }
    DragArea.prototype.getBoundingClientRect = function () {
        return dom_1.getOuterRect(this.dom);
    };
    DragArea.prototype.setFocus = function (focus) {
        return this.dom.classList[focus ? "add" : "remove"]("focus");
    };
    DragArea.prototype.setDisabled = function (disabled) {
        return this.dom.classList[disabled ? "add" : "remove"]("disabled");
    };
    DragArea.prototype.getItems = function () {
        return this.items;
    };
    DragArea.prototype.withinArea = function (itemRect, options) {
        if (options === void 0) { options = {}; }
        var areaRect = this.getBoundingClientRect();
        if (options.complete) {
            return (itemRect.left > areaRect.left &&
                itemRect.left + itemRect.width < areaRect.left + areaRect.width &&
                itemRect.top > areaRect.top &&
                itemRect.top + itemRect.height < areaRect.top + areaRect.height);
        }
        else if (options.margin) {
            return (itemRect.left + options.margin > areaRect.left &&
                itemRect.left + itemRect.width - options.margin < areaRect.left + areaRect.width &&
                itemRect.top + options.margin > areaRect.top &&
                itemRect.top + itemRect.height - options.margin < areaRect.top + areaRect.height);
        }
        else {
            return (itemRect.left + itemRect.width > areaRect.left &&
                itemRect.left < areaRect.left + areaRect.width &&
                itemRect.top + itemRect.height > areaRect.top &&
                itemRect.top < areaRect.top + areaRect.height);
        }
    };
    DragArea.prototype.getConstraints = function () {
        return {
            grid: this.grid,
            constrain: this.constrain,
        };
    };
    DragArea.prototype.onItemDrop = function (event, item, sourceArea) {
        return dom_1.stopEvent(event) && object_1.exec(this.onareadrop, event, item, sourceArea, this);
    };
    DragArea.prototype.onItemHover = function (event, item, sourceArea, initial) {
        return dom_1.stopEvent(event) && object_1.exec(this.onareahover, event, item, sourceArea, this, initial);
    };
    DragArea.prototype.onItemRemove = function (event, item) {
        return dom_1.stopEvent(event) && object_1.exec(this.onarearemove, event, item, this);
    };
    DragArea.prototype.onbeforeupdate = function (vnode, old) {
        return this.attrsChanged(vnode.attrs, old.attrs);
    };
    DragArea.prototype.onupdate = function (vnode) {
        this.setState(vnode.attrs);
        this.setItems(vnode.children);
    };
    DragArea.prototype.oninit = function (vnode) {
        this.setState(vnode.attrs);
        this.setItems(vnode.children);
    };
    DragArea.prototype.onremove = function (vnode) {
        var dragAreas = exports.getAreas(this.type);
        dragAreas.splice(dragAreas.indexOf(this), 1);
    };
    DragArea.prototype.oncreate = function (vnode) {
        this.dom = vnode.dom;
        if (areas[this.type] === undefined) {
            areas[this.type] = [];
        }
        areas[this.type].push(this);
    };
    DragArea.prototype.view = function (vnode) {
        var _this = this;
        return m("div", { className: "component--drag drag-area " + (vnode.attrs.className || ""), style: dom_1.getRectStyle(vnode.attrs.position || {}), onclick: function (event) { return dom_1.stopEvent(event) && object_1.exec(_this.onclick, event, _this); } }, vnode.children);
    };
    DragArea.prototype.attrsChanged = function (next, prev) {
        return (next.className !== prev.className ||
            next.onareadrop !== prev.onareadrop ||
            next.onareahover !== prev.onareahover ||
            next.onarearemove !== prev.onarearemove ||
            next.grid !== prev.grid ||
            next.constrain !== prev.constrain);
    };
    DragArea.prototype.setState = function (attrs) {
        var _this = this;
        Object.keys(attrs).forEach(function (key) { return _this[key] = attrs[key]; });
    };
    DragArea.prototype.setItems = function (children) {
        var _this = this;
        if (Array.isArray(children)) {
            this.items = [];
            children.forEach(function (v) {
                if (typeof v === "object" && v !== null && Array.isArray(v) === false && v["state"] instanceof Item_1.default) {
                    _this.items.push(v["state"]);
                }
            });
        }
    };
    return DragArea;
}());
exports.default = DragArea;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var m = __webpack_require__(0);
var dom_1 = __webpack_require__(4);
var object_1 = __webpack_require__(1);
var controller_1 = __webpack_require__(64);
__webpack_require__(65);
var Library = (function () {
    function Library() {
        this.c = new controller_1.default();
    }
    Library.prototype.oncreate = function (vnode) {
        this.c.construct();
        this.c.refresh();
        object_1.exec(vnode.attrs.oncontainercreate, this.c.container);
    };
    Library.prototype.onupdate = function (vnode) {
        this.c.refresh();
        object_1.exec(vnode.attrs.oncontainercreate, this.c.container);
    };
    Library.prototype.onremove = function (vnode) {
        this.c.destruct();
    };
    Library.prototype.view = function (vnode) {
        var _this = this;
        var children = vnode.children;
        return m("div", { className: object_1.cleanString("component--library", vnode.attrs.className) },
            m("div", { oncreate: function (node) { return _this.c.prev = node.dom; }, className: "nav prev", onclick: function (event) { return dom_1.stopEvent(event) && _this.c.navigate(-1); } }, "<"),
            m("div", { oncreate: function (node) { return _this.c.container = node.dom; }, className: "items" }, children.map(function (child, index) {
                return m("div", { className: "item", onclick: function (event) { return dom_1.stopEvent(event) && object_1.exec(vnode.attrs.onclick, event, index); } }, child);
            })),
            m("div", { oncreate: function (node) { return _this.c.next = node.dom; }, className: "nav next", onclick: function (event) { return dom_1.stopEvent(event) && _this.c.navigate(1); } }, ">"));
    };
    return Library;
}());
exports.default = Library;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var cache = {};
exports.spreadHexRange = function (start, end) {
    var list = [];
    for (var i = parseInt(start, 16); i <= parseInt(end, 16); i++) {
        list.push(i.toString(16));
    }
    return list;
};
exports.createStylesheet = function (id, content) {
    var styleElement = document.getElementById(id);
    if (styleElement) {
        document.getElementsByTagName("head")[0].removeChild(styleElement);
    }
    styleElement = document.createElement("style");
    styleElement.type = "text/css";
    styleElement.id = id;
    styleElement.innerHTML = content;
    document.getElementsByTagName("head")[0].appendChild(styleElement);
};
exports.generateIconStylesheet = function (unicodes) {
    var stylesheet = "";
    unicodes.forEach(function (unicode) {
        stylesheet += ".icon-" + unicode + ":before{content:'\\" + unicode + "'}";
    });
    return stylesheet;
};
exports.setIcons = function (font, range) {
    if (cache[font] === undefined) {
        cache[font] = exports.spreadHexRange(range[0], range[1]);
        exports.createStylesheet(font, exports.generateIconStylesheet(cache[font]));
    }
};
exports.getIconClassNames = function (font) { return cache[font].map(function (unicode) { return "icon-" + unicode; }); };
exports.getIcons = function (font) { return cache[font]; };


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var m = __webpack_require__(0);
var object_1 = __webpack_require__(1);
__webpack_require__(11);
var Checkbox = (function () {
    function Checkbox() {
    }
    Checkbox.prototype.view = function (v) {
        var _this = this;
        var id = Math.random().toString();
        return m("div", { className: "component--Checkbox" + (v.attrs.className || ""), style: v.attrs.style },
            m("input", { id: id, type: "checkbox", checked: v.attrs.defaultChecked, onclick: function (evt) { return _this.emitEvent(v.attrs.onclick, evt); } }),
            v.attrs.label && m("label", { htmlFor: id }, v.attrs.label));
    };
    Checkbox.prototype.emitEvent = function (eventCb, event) {
        event.redraw = false;
        object_1.exec(eventCb, event.target.checked, event, function (checked) { return event.target.checked = checked; });
    };
    return Checkbox;
}());
exports.default = Checkbox;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var m = __webpack_require__(0);
var object_1 = __webpack_require__(1);
__webpack_require__(11);
var Input = (function () {
    function Input() {
    }
    Input.prototype.oncreate = function (v) {
        if (v.attrs.autofocus) {
            setTimeout(function () { return v.dom.focus(); });
        }
    };
    Input.prototype.view = function (v) {
        var _this = this;
        var Tag = (v.attrs.multiline ? "textarea" : "input");
        var id = Math.random().toString();
        return m("div", { className: "component--Input" + (v.attrs.className || ""), style: v.attrs.style },
            m(Tag, { id: id, type: v.attrs.type, placeholder: v.attrs.placeholder || "", value: v.attrs.value || "", defaultValue: v.attrs.default || "", onchange: function (evt) { return _this.emitEvent(v.attrs.onchange, evt); }, oninput: function (evt) { return _this.emitEvent(v.attrs.oninput, evt); }, onkeypress: function (evt) {
                    _this.emitEvent(v.attrs.onkeypress, evt);
                    if (evt.key === "Enter") {
                        _this.emitEvent(v.attrs.onenter, evt);
                    }
                }, onblur: function (evt) { return _this.emitEvent(v.attrs.onblur, evt); }, onclick: function (evt) { return _this.emitEvent(v.attrs.onclick, evt); } }),
            v.attrs.label && m("label", { htmlFor: id }, v.attrs.label));
    };
    Input.prototype.emitEvent = function (eventCb, event) {
        event.redraw = false;
        object_1.exec(eventCb, event.target.value, event, function (value) { return event.target.value = value; });
    };
    return Input;
}());
exports.default = Input;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var m = __webpack_require__(0);
var object_1 = __webpack_require__(1);
__webpack_require__(46);
var Dialog = (function () {
    function Dialog() {
    }
    Dialog.prototype.view = function (v) {
        return m("div", { className: "component--Dialog " + v.attrs.className },
            m("div", { className: "container", onclick: function (event) { return object_1.exec(v.attrs.oncontainerclick, event); } }),
            m("div", { className: "dialog" }, v.children));
    };
    return Dialog;
}());
exports.default = Dialog;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var m = __webpack_require__(0);
var object_1 = __webpack_require__(1);
__webpack_require__(11);
var Slider = (function () {
    function Slider() {
    }
    Slider.prototype.view = function (v) {
        var _this = this;
        var id = Math.random().toString();
        return m("div", { className: "component--Slider" + (v.attrs.className || ""), style: v.attrs.style },
            m("input", { id: id, type: "range", value: v.attrs.value, defaultValue: v.attrs.default, min: v.attrs.min, max: v.attrs.max, step: v.attrs.step, onchange: function (evt) { return _this.emitEvent(v.attrs.onchange, evt); }, oninput: function (evt) { return _this.emitEvent(v.attrs.oninput, evt); } }),
            v.attrs.label && m("label", { htmlFor: id }, v.attrs.label));
    };
    Slider.prototype.emitEvent = function (eventCb, event) {
        event.redraw = false;
        object_1.exec(eventCb, event.target.value, event, function (value) { return event.target.value = value; });
    };
    return Slider;
}());
exports.default = Slider;


/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAq1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0NbREAAAAOHRSTlMA7J4Euq3SYlb62/UX50DWzfDge743MSvJMxMK2cY7B+SIJQ+jScKDHRp/RLaykHVmWU6oXm1SmERD0zUAAAQuSURBVGje7ZnpkqIwFEajtDjIjuwqoCzivtu8/5NNWUICBCE60jUz5ffLsoBTN+fmggI++eSTT96cbdBtOcEWKJ3WowAmaT0M6CStp/OB/LUQVlx/vT1rmi1ABntAvT3gQBcg4gG0kKNUgIzPoIVci5UM+uDPMtJ+9ffncAby+fVWyMjabRSW7dDd86wtiH8Qkywng2oFQu1kNGZZ0WkFcvGSfFShBYgmJcV8+2+HUAFTgojXt0NiMbPBZrTTuyGjq5KOwdMyw5mjN0P8HX+/x37POEtN12tGPQPRR42QZQq5AAC6d8jYegJCHXt7n7yS2Imer8TVvETpjxqcHDMnm+0gc+KSOxHGt9L3oD5cppvJuosJyLsrlO61XxooXTYphg6JIasoPUfZ16+YNSlBtiNCCOWY8CSvb1fP99RvXykwNhogg1BCfujxVbW4x3HPuH/c56fwRAeEEGdQnEZVymiGmXJph6EZ2Z1RhJDQLLvEKMebCT6luPolkDxeibZX4jtjiFSiWlyMcTt/ukjX1wgPh6uwIL7HW7B4ZgzbUzn7eWV0+rU8L16XEELpNJSoXnuQ4qG97wo0Er2MX4BoNGwVM3bjIMmC9v5KYhJEmXJPQwTkQ701o/GN2Q/V4vM0pJBCQrX8QDALkP2ze6sjz0D2ySEa6l3JySYg8qIcXFQqijyPySGUPoB9JRlofpwgRTw6IjyEl5GXmBhiIedSbuOC+AQv7CnwkGh28FCP2YQQISo6RzGCBMuXDkYXHo63ud0IUfYFoV8CKMY4lRnr26y1dwqkLO0myPgA9Ag510A58YYtMKR7qf4Q1tIZcg2QibAw4bqLOsCz6OUoDJ21hT2UkZdFPcScBvAatEFV3qO2uToMOC65HGXK1UJk1I6mBSozW0NGdFtOROlg9nFIMdGqmrHqybD1iofYQ9jJ3pIjgZhCJYJyJmityof4kALt4xBcKM4Q6w7xd7BKeck1QcRq50CbMLjzvJclouz8esjkgXPhCzLUnPNq+97QxyG4c5xRHv9VtfCIwj2G0A8YuoqPfzz2HNv7OIRRnGrn1gQ9Vljgcbg5C72kFAwysB44N6EPUXdBTRbDHMWugqhOjQ98fzTZ54c+DuEvDxi5WXIETeGQF2Vng/L/XfQVVMVSCevA7fM7m+iXFqVLyLkBSGIj+52LG5rNEF1Fzi0XECWeQgovaJtGiLOGDNMBpInnMtx463ETRNugcRMC8iymaH8zDRB9g/3QJKZA+0kthNInSdUoILVPBLHQbFc0FzyZeMkSQDS0B6UVeD6LudwIcZCPCPPxtP3qP58NVIe5Aq+Fm3p1EMqIGHg/n4FX4w/ZGoiV24MaeD32Vi5BWOnUS2MyaGB9B71Xcwo2LNFLGhbyXonM/Levm/L5VyE/8Vr2R14w/8yr8k8++eTvyG+Zid2kX/1F1AAAAABJRU5ErkJggg=="

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAolBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgESU6AAAANXRSTlMA2pemgfJvowX64yXVq3YdwJ6HTAnnkFpTQSkVC8euNe/r3s/LuXtcSC4Q9q9+bGHwizsysfQ9FrMAAAJeSURBVGje7djpkppAFIbhg5qRVQX3fd9GncyS7/5vLUUPDE6QpZtDqlLh+aU/5C3sloNQpVKp/B961nBw3dl2Z+ENLZ1KoJ+cNe70nTF3p90yEWMe2pxncbjgIePAdjZjG4m0MbFoIJVHDOrI4FBhHWSal90QOlSIg1wWpE6vIacWKZsu6s0v7g4pzsRjiBQ28XhCmuPfiPR79MCgJqGbGcFPegAyakkRzURgSw/8gIRGUmQ6RKhdVsQhMhF4KiliPBN1EdjxR6Ifuo3AtJTIinwTBM6lRLokNMO3/JFojjxHK88fmVCgBeFWQsT1j/JhEYXb+I0/YujiKGJevcPn8UdaweW//TWlD+yRjX+M2Suw919YAHBkj4zFlRwAluGrd+7IXoxn+DRxx28AFndErMT+bpK8YKUzRwbiHhmfLuRjv0Cuxazd3I80Oo44I9EXFJtXnBFTLDUic+5IuGlruHNij/wKp0hkwx4RE3COb27MEXEdHOE7o8caeSVfH39wWSPdzzEVM2GMbMXANRAzZ4ycE/+Andgibjg94lZcEWMW3c7FNJgi4jgjJJiyRMxg+yZYsETE9vWQ6KNw5AZbbF8k0wpHJt4kmLnJhsUioSXSrHWWiIZUA47ICzK0i0d6mZ+6Fo+8IdO4aMRCNq1opIMcWsUiS+RhqD/28JlIF5/Ebj0/ZxQ8JsrHImUz5NUhZS5yO5EiC/mtSdEWElqkpAsZlxmpMCGlTgoakLRU2L4GJG1JWhPSRiTpDHl9neTYUOCRlCOUyG3jFZQ4xVadf+3bfU3N5kqVSqXyD/oN91R/tmnlLNcAAAAASUVORK5CYII="

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = __webpack_require__(28);
var Main_1 = __webpack_require__(33);
var definition_1 = __webpack_require__(111);
window["debug"] =  true ? false : true;
var targetElement = document.getElementById("ojc_root");
var _a = base_1.default({ Main: Main_1.default, definition: definition_1.default, targetElement: targetElement }), deps = _a.deps, domEA = _a.domEA, productEA = _a.productEA;
productEA.on("submit", function (event) {
    window["onproductsubmit"](event);
});


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var easydeps_1 = __webpack_require__(7);
var eventaggregator_1 = __webpack_require__(8);
var m = __webpack_require__(0);
var productManager_1 = __webpack_require__(32);
var domEA = eventaggregator_1.default.getInstance("dom");
var productEA = eventaggregator_1.default.getInstance("product");
var deps = easydeps_1.default.getInstance();
window.addEventListener("mousemove", (function (event) {
    event.redraw = false;
    domEA.emit("mousemove", event);
}));
window.addEventListener("touchmove", (function (event) {
    event.redraw = false;
    domEA.emit("touchmove", event);
}));
window.addEventListener("mouseup", (function (event) {
    event.redraw = false;
    domEA.emit("mouseup", event);
}));
window.addEventListener("touchend", (function (event) {
    event.redraw = false;
    domEA.emit("touchend", event);
}));
window.addEventListener("resize", (function (event) {
    event.redraw = false;
    domEA.emit("resize", event);
}));
window.addEventListener("mousewheel", (function (event) {
    event.redraw = false;
    domEA.emit("scroll", event);
}));
window.addEventListener("click", (function (event) {
    event.redraw = false;
    domEA.emit("click", event);
}));
window.addEventListener("keydown", (function (event) {
    event.redraw = false;
    domEA.emit("keydown", event);
}));
window.addEventListener("keyup", (function (event) {
    event.redraw = false;
    domEA.emit("keyup", event);
}));
window.addEventListener("contextmenu", (function (event) {
    event.redraw = false;
    domEA.emit("contextmenu", event);
}));
productEA.on("change", function () {
    m.redraw();
});
exports.default = function (productConfigurator) {
    var productManager = new productManager_1.default(productConfigurator.definition);
    deps.register({ domEA: domEA, productEA: productEA, productManager: productManager });
    m.mount(productConfigurator.targetElement, productConfigurator.Main);
    return {
        deps: deps, domEA: domEA, productEA: productEA,
    };
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(30);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15), __webpack_require__(31)))

/***/ }),
/* 31 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var eventaggregator_1 = __webpack_require__(8);
var enums_1 = __webpack_require__(5);
var helpers_1 = __webpack_require__(6);
var object_1 = __webpack_require__(1);
var productEA = eventaggregator_1.default.getInstance("product");
var ProductManager = (function () {
    function ProductManager(product, defaults) {
        if (defaults === void 0) { defaults = product.defaults; }
        this.currentProductPartIndex = 0;
        this.nextHolder_id = 0;
        this.previewScale = 1;
        this.id = product.id;
        this.defaults = defaults;
        this.productParts = object_1.clone(product.productParts);
        var pp = this.getProductPart();
        if (pp !== undefined && pp.layout !== undefined) {
            this.currentLayoutId = pp.layout.id;
        }
    }
    ProductManager.prototype.getProductParts = function () {
        return this.productParts;
    };
    ProductManager.prototype.getProductPartById = function (productPartId) {
        var productPart = this.productParts.find(function (pp) { return pp.id === productPartId; });
        if (productPart === undefined) {
            throw new Error("ProductPart with id \"" + productPartId + "\" does not exist");
        }
        return productPart;
    };
    ProductManager.prototype.getProductPart = function (productPartIndex) {
        if (productPartIndex === void 0) { productPartIndex = this.currentProductPartIndex; }
        var pp = this.productParts[productPartIndex];
        if (pp === undefined) {
            throw new Error("ProductPart with index \"" + productPartIndex + "\" does not exist");
        }
        return pp;
    };
    ProductManager.prototype.getContentOptions = function (productPartIndex) {
        if (productPartIndex === void 0) { productPartIndex = this.currentProductPartIndex; }
        return this.productParts[productPartIndex].options;
    };
    ProductManager.prototype.getLayouts = function (productPartIndex) {
        if (productPartIndex === void 0) { productPartIndex = this.currentProductPartIndex; }
        return this.getProductPart(productPartIndex).layouts;
    };
    ProductManager.prototype.getLayout = function (layoutId, productPartIndex) {
        if (layoutId === void 0) { layoutId = this.currentLayoutId; }
        if (productPartIndex === void 0) { productPartIndex = this.currentProductPartIndex; }
        var layouts = this.getProductPart(productPartIndex).layouts || [];
        var layout = layouts.find(function (l) { return l.id === layoutId; });
        if (layout === undefined) {
            throw new Error("ProductPart with index \"" + productPartIndex + "\" has no layout with id \"" + layoutId + "\"");
        }
        return layout;
    };
    ProductManager.prototype.getHolders = function (productPartIndex) {
        if (productPartIndex === void 0) { productPartIndex = this.currentProductPartIndex; }
        return this.getProductPart(productPartIndex).layout.holders;
    };
    ProductManager.prototype.getHolder = function (holderId, productPartIndex) {
        if (holderId === void 0) { holderId = this.currentHolderId; }
        if (productPartIndex === void 0) { productPartIndex = this.currentProductPartIndex; }
        if (holderId === undefined) {
            throw new Error("HolderId is undefined. Initialize the current holder with setCurrentHolder(holderId: number)");
        }
        var holders = this.getHolders(productPartIndex);
        var holder = holders.find(function (h) { return h.id === holderId; });
        if (holder === undefined) {
            throw new Error("ProductPart with index \"" + productPartIndex + "\" has no holder with id \"" + holderId + "\"");
        }
        return holder;
    };
    ProductManager.prototype.getScaledHolder = function (holder, scale) {
        if (scale === void 0) { scale = this.previewScale; }
        return this.scaleHolder(object_1.clone(holder), scale);
    };
    ProductManager.prototype.getScaledLayout = function (layout, scale) {
        if (scale === void 0) { scale = this.previewScale; }
        return this.scaleLayout(object_1.clone(layout), scale);
    };
    ProductManager.prototype.addHolder = function (holder, productPartIndex) {
        if (productPartIndex === void 0) { productPartIndex = this.currentProductPartIndex; }
        var productPart = this.getProductPart(productPartIndex);
        var nextId = this.getNextHolderId(productPart.layout.holders);
        if (holder === undefined) {
            holder = {
                id: nextId,
                position: {
                    top: 0,
                    left: 0,
                    width: productPart.layout.position.width,
                    height: productPart.layout.position.height,
                },
                fixed: false,
                type: [enums_1.TEXT, enums_1.IMAGE, enums_1.SHAPE],
            };
        }
        else {
            holder.id = nextId;
        }
        productPart.layout.holders.push(holder);
        this.changed();
        return holder;
    };
    ProductManager.prototype.updateHolder = function (holder, productPartIndex) {
        if (productPartIndex === void 0) { productPartIndex = this.currentProductPartIndex; }
        var layout = this.getProductPart(productPartIndex).layout;
        var exitstingHolder = layout.holders.find(function (h) { return h.id === holder.id; });
        if (exitstingHolder === undefined) {
            throw new Error("Could not find an existing holder with id \"" + holder.id + "\"");
        }
        if (layout.fixed !== true) {
            if (exitstingHolder.fixed !== true) {
                if (holder.position !== undefined) {
                    this.updateHolderPosition(exitstingHolder, holder.position);
                }
            }
            if (holder.depth !== undefined) {
                this.updateHolderDepth(exitstingHolder, holder.depth, layout.holders);
            }
        }
        if (holder.content !== undefined) {
            this.updateHolderContent(exitstingHolder, holder.content);
        }
        this.changed();
        return exitstingHolder;
    };
    ProductManager.prototype.removeHolderContent = function (holderId, productPartIndex) {
        if (productPartIndex === void 0) { productPartIndex = this.currentProductPartIndex; }
        var holders = this.getProductPart(productPartIndex).layout.holders;
        var exitstingHolder = holders.find(function (h) { return h.id === holderId; });
        if (exitstingHolder === undefined) {
            throw new Error("Could not find an existing holder with id \"" + holderId + "\"");
        }
        if (exitstingHolder.fixed && exitstingHolder.content) {
            exitstingHolder.content = {};
        }
        else {
            exitstingHolder.content = undefined;
        }
        this.changed();
        return exitstingHolder;
    };
    ProductManager.prototype.removeHolder = function (holderId, productPartIndex) {
        if (productPartIndex === void 0) { productPartIndex = this.currentProductPartIndex; }
        var layout = this.getProductPart(productPartIndex).layout;
        var exitstingHolder = layout.holders.find(function (h) { return h.id === holderId; });
        if (exitstingHolder === undefined) {
            throw new Error("Could not find an existing holder with id \"" + holderId + "\"");
        }
        if (layout.fixed !== true && exitstingHolder.fixed !== true) {
            layout.holders = layout.holders.filter(function (holder) { return holder.id !== holderId; });
        }
        if (holderId === this.currentHolderId) {
            this.currentHolderId = -1;
            this.updateSelected();
        }
        this.changed();
    };
    ProductManager.prototype.setCurrentProductPart = function (productPartId) {
        this.currentProductPartIndex = this.productParts.findIndex(function (pp) { return pp.id === productPartId; });
        this.updateSelected();
        this.changed();
    };
    ProductManager.prototype.setCurrentHolder = function (holderId, productPartIndex) {
        if (productPartIndex === void 0) { productPartIndex = this.currentProductPartIndex; }
        if (this.currentHolderId === holderId) {
            holderId = undefined;
        }
        this.currentHolderId = holderId;
        this.updateSelected();
        this.changed();
    };
    ProductManager.prototype.setCurrentLayout = function (layoutId, productPartIndex) {
        if (productPartIndex === void 0) { productPartIndex = this.currentProductPartIndex; }
        var pp = this.getProductPart(productPartIndex);
        this.currentLayoutId = layoutId;
        var layout = this.getLayout(layoutId);
        pp.layout = object_1.clone(layout);
        this.updateSelected();
        this.changed();
    };
    ProductManager.prototype.addLayout = function (layout, productPartIndex) {
        if (productPartIndex === void 0) { productPartIndex = this.currentProductPartIndex; }
        var pp = this.getProductPart(productPartIndex);
        pp.layouts.push(layout);
        this.changed();
        return pp.layout;
    };
    ProductManager.prototype.setPreviewScale = function (scale) {
        this.previewScale = scale;
        this.changed();
    };
    ProductManager.prototype.getPreviewScale = function () {
        return this.previewScale;
    };
    ProductManager.prototype.submit = function (result, productPartIndex) {
        if (productPartIndex === void 0) { productPartIndex = this.currentProductPartIndex; }
        var productPart = this.getProductPart(productPartIndex);
        var productPartDefinition = {
            id: productPart.id,
            layout: {
                id: productPart.layout.id,
                position: productPart.layout.position,
                holders: [],
            },
        };
        productPartDefinition.layout.holders = productPart.layout.holders.map(function (h) {
            if (!h.content) {
                return null;
            }
            var holderResult = result.holders && result.holders.find(function (hr) { return hr.id === h.id; });
            var holderDefinition = {
                id: h.id,
                type: h.type.slice(),
                position: __assign({}, h.position),
                content: (function () {
                    if (holderResult && holderResult.image) {
                        return holderResult.image;
                    }
                    var cleanedContent = object_1.clone(h.content);
                    delete cleanedContent.fixed;
                    delete cleanedContent.originalValue;
                    delete cleanedContent.thumb;
                    return cleanedContent;
                })(),
            };
            return holderDefinition;
        });
        productEA.emit("submit", {
            result: result.result,
            definition: { id: this.id, productPart: productPartDefinition },
        });
        return {
            result: result.result,
            definition: { id: this.id, productPart: productPartDefinition },
        };
    };
    ProductManager.prototype.scale = function (position, scale) {
        if (scale === void 0) { scale = 1 / this.previewScale; }
        return scale * position;
    };
    ProductManager.prototype.scaleRect = function (position, scale) {
        if (scale === void 0) { scale = 1 / this.previewScale; }
        return helpers_1.round(helpers_1.setScale(position, scale));
    };
    ProductManager.prototype.updateHolderPosition = function (holder, position) {
        position = this.scaleRect(position, 1 / this.previewScale);
        holder.position = __assign({}, holder.position, position);
        return holder.position;
    };
    ProductManager.prototype.updateHolderContent = function (holder, content) {
        delete content.originalValue;
        if (holder.type.indexOf(enums_1.IMAGE) !== -1 && content.type === enums_1.IMAGE) {
            if (!holder.content || holder.content.originalValue === undefined) {
                content.originalValue = content.value;
            }
        }
        holder.content = __assign({}, this.defaults, holder.content, content);
        return holder.content;
    };
    ProductManager.prototype.updateHolderDepth = function (holder, direction, holders) {
        var holderIndex = holders.indexOf(holder);
        if (direction > 0) {
            var prevHolder = holders[holderIndex + 1];
            if (prevHolder) {
                holders[holderIndex + 1] = holder;
                holders[holderIndex] = prevHolder;
            }
        }
        else {
            var prevHolder = holders[holderIndex - 1];
            if (prevHolder) {
                holders[holderIndex - 1] = holder;
                holders[holderIndex] = prevHolder;
            }
        }
        return holders;
    };
    ProductManager.prototype.updateSelected = function () {
        var _this = this;
        this.productParts.forEach(function (pp, ppi) {
            pp.selected = ppi === _this.currentProductPartIndex;
            pp.layouts.forEach(function (t, ti) {
                t.selected = t.id === _this.currentLayoutId;
            });
            if (pp.layout !== undefined) {
                if (pp.layout.holders !== undefined) {
                    pp.layout.holders.forEach(function (h, hi) {
                        h.selected = h.id === _this.currentHolderId || h.id === _this.currentHolderId;
                    });
                }
            }
        });
    };
    ProductManager.prototype.changed = function () {
        var _this = this;
        if (this.debouncer === undefined) {
            this.debouncer = eventaggregator_1.debounce(function () { return productEA.emit("change", _this.getProductPart()); }, 50);
        }
        this.debouncer();
    };
    ProductManager.prototype.getNextHolderId = function (holders) {
        if (holders && holders.length > 0) {
            this.nextHolder_id = Math.max.apply(null, holders.map(function (holder) { return holder.id; })) + 1;
        }
        return this.nextHolder_id++;
    };
    ProductManager.prototype.scaleHolder = function (holder, scale) {
        holder.position = this.scaleRect(holder.position, scale);
        if (holder.content) {
            if (holder.content.fontSize) {
                holder.content.fontSize = this.scale(parseFloat(holder.content.fontSize), scale) + "px";
            }
        }
        return holder;
    };
    ProductManager.prototype.scaleLayout = function (layout, scale) {
        var _this = this;
        layout.position = this.scaleRect(layout.position, scale);
        layout.holders = layout.holders.map(function (holder) { return _this.scaleHolder(holder, scale); });
        return layout;
    };
    return ProductManager;
}());
exports.default = ProductManager;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var easydeps_1 = __webpack_require__(7);
var m = __webpack_require__(0);
var iconfont_1 = __webpack_require__(19);
var image_1 = __webpack_require__(9);
var productComponents_1 = __webpack_require__(35);
var index_1 = __webpack_require__(38);
var index_2 = __webpack_require__(63);
var index_3 = __webpack_require__(70);
var index_4 = __webpack_require__(88);
var index_5 = __webpack_require__(95);
var index_6 = __webpack_require__(98);
__webpack_require__(102);
__webpack_require__(105);
__webpack_require__(107);
__webpack_require__(109);
iconfont_1.setIcons("Material-Design-Iconic-Font", ["f101", "f409"]);
var submit = function (scale, individual, download) {
    if (scale === void 0) { scale = 1; }
    if (individual === void 0) { individual = false; }
    if (download === void 0) { download = true; }
    return __awaiter(_this, void 0, void 0, function () {
        var deps, productManager, result, _i, _a, holder;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    deps = easydeps_1.default.getInstance().request(["productManager"]);
                    productManager = deps[0];
                    return [4, productComponents_1.default(scale, { individual: individual })];
                case 1:
                    result = _b.sent();
                    if (!download) return [3, 6];
                    return [4, image_1.downloadImage(result.result, "product")];
                case 2:
                    _b.sent();
                    if (!result.holders) return [3, 6];
                    _i = 0, _a = result.holders;
                    _b.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3, 6];
                    holder = _a[_i];
                    return [4, image_1.downloadImage(holder.image, "holderId_" + holder.id)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3, 3];
                case 6:
                    productManager.submit(result);
                    return [2];
            }
        });
    });
};
var Main = (function () {
    function Main() {
    }
    Main.prototype.view = function (v) {
        return m("div", { className: "component--Main" },
            m("button", { onclick: function () { return submit(1, true); } }, "SAVE"),
            m("div", { className: "sideBySide" },
                m(index_4.default, null),
                m(index_2.default, null)),
            m("div", { className: "sideBySide" },
                m(index_3.default, null),
                m(index_5.default, null)),
            m("div", { className: "ProductPreview-wrapper" },
                m(index_6.default, null)),
            m(index_1.default, null));
    };
    return Main;
}());
exports.default = Main;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

(function (global) {
    'use strict';

    var util = newUtil();
    var inliner = newInliner();
    var fontFaces = newFontFaces();
    var images = newImages();

    // Default impl options
    var defaultOptions = {
        // Default is to fail on error, no placeholder
        imagePlaceholder: undefined,
        // Default cache bust is false, it will use the cache
        cacheBust: false
    };

    var domtoimage = {
        toSvg: toSvg,
        toPng: toPng,
        toJpeg: toJpeg,
        toBlob: toBlob,
        toPixelData: toPixelData,
        impl: {
            fontFaces: fontFaces,
            images: images,
            util: util,
            inliner: inliner,
            options: {}
        }
    };

    if (true)
        module.exports = domtoimage;
    else
        global.domtoimage = domtoimage;


    /**
     * @param {Node} node - The DOM Node object to render
     * @param {Object} options - Rendering options
     * @param {Function} options.filter - Should return true if passed node should be included in the output
     *          (excluding node means excluding it's children as well). Not called on the root node.
     * @param {String} options.bgcolor - color for the background, any valid CSS color value.
     * @param {Number} options.width - width to be applied to node before rendering.
     * @param {Number} options.height - height to be applied to node before rendering.
     * @param {Object} options.style - an object whose properties to be copied to node's style before rendering.
     * @param {Number} options.quality - a Number between 0 and 1 indicating image quality (applicable to JPEG only),
                defaults to 1.0.
     * @param {String} options.imagePlaceholder - dataURL to use as a placeholder for failed images, default behaviour is to fail fast on images we can't fetch
     * @param {Boolean} options.cacheBust - set to true to cache bust by appending the time to the request url
     * @return {Promise} - A promise that is fulfilled with a SVG image data URL
     * */
    function toSvg(node, options) {
        options = options || {};
        copyOptions(options);
        return Promise.resolve(node)
            .then(function (node) {
                return cloneNode(node, options.filter, true);
            })
            .then(embedFonts)
            .then(inlineImages)
            .then(applyOptions)
            .then(function (clone) {
                return makeSvgDataUri(clone,
                    options.width || util.width(node),
                    options.height || util.height(node)
                );
            });

        function applyOptions(clone) {
            if (options.bgcolor) clone.style.backgroundColor = options.bgcolor;

            if (options.width) clone.style.width = options.width + 'px';
            if (options.height) clone.style.height = options.height + 'px';

            if (options.style)
                Object.keys(options.style).forEach(function (property) {
                    clone.style[property] = options.style[property];
                });

            return clone;
        }
    }

    /**
     * @param {Node} node - The DOM Node object to render
     * @param {Object} options - Rendering options, @see {@link toSvg}
     * @return {Promise} - A promise that is fulfilled with a Uint8Array containing RGBA pixel data.
     * */
    function toPixelData(node, options) {
        return draw(node, options || {})
            .then(function (canvas) {
                return canvas.getContext('2d').getImageData(
                    0,
                    0,
                    util.width(node),
                    util.height(node)
                ).data;
            });
    }

    /**
     * @param {Node} node - The DOM Node object to render
     * @param {Object} options - Rendering options, @see {@link toSvg}
     * @return {Promise} - A promise that is fulfilled with a PNG image data URL
     * */
    function toPng(node, options) {
        return draw(node, options || {})
            .then(function (canvas) {
                return canvas.toDataURL();
            });
    }

    /**
     * @param {Node} node - The DOM Node object to render
     * @param {Object} options - Rendering options, @see {@link toSvg}
     * @return {Promise} - A promise that is fulfilled with a JPEG image data URL
     * */
    function toJpeg(node, options) {
        options = options || {};
        return draw(node, options)
            .then(function (canvas) {
                return canvas.toDataURL('image/jpeg', options.quality || 1.0);
            });
    }

    /**
     * @param {Node} node - The DOM Node object to render
     * @param {Object} options - Rendering options, @see {@link toSvg}
     * @return {Promise} - A promise that is fulfilled with a PNG image blob
     * */
    function toBlob(node, options) {
        return draw(node, options || {})
            .then(util.canvasToBlob);
    }

    function copyOptions(options) {
        // Copy options to impl options for use in impl
        if(typeof(options.imagePlaceholder) === 'undefined') {
            domtoimage.impl.options.imagePlaceholder = defaultOptions.imagePlaceholder;
        } else {
            domtoimage.impl.options.imagePlaceholder = options.imagePlaceholder;
        }

        if(typeof(options.cacheBust) === 'undefined') {
            domtoimage.impl.options.cacheBust = defaultOptions.cacheBust;
        } else {
            domtoimage.impl.options.cacheBust = options.cacheBust;
        }
    }

    function draw(domNode, options) {
        return toSvg(domNode, options)
            .then(util.makeImage)
            .then(util.delay(100))
            .then(function (image) {
                var canvas = newCanvas(domNode);
                canvas.getContext('2d').drawImage(image, 0, 0);
                return canvas;
            });

        function newCanvas(domNode) {
            var canvas = document.createElement('canvas');
            canvas.width = options.width || util.width(domNode);
            canvas.height = options.height || util.height(domNode);

            if (options.bgcolor) {
                var ctx = canvas.getContext('2d');
                ctx.fillStyle = options.bgcolor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            return canvas;
        }
    }

    function cloneNode(node, filter, root) {
        if (!root && filter && !filter(node)) return Promise.resolve();

        return Promise.resolve(node)
            .then(makeNodeCopy)
            .then(function (clone) {
                return cloneChildren(node, clone, filter);
            })
            .then(function (clone) {
                return processClone(node, clone);
            });

        function makeNodeCopy(node) {
            if (node instanceof HTMLCanvasElement) return util.makeImage(node.toDataURL());
            return node.cloneNode(false);
        }

        function cloneChildren(original, clone, filter) {
            var children = original.childNodes;
            if (children.length === 0) return Promise.resolve(clone);

            return cloneChildrenInOrder(clone, util.asArray(children), filter)
                .then(function () {
                    return clone;
                });

            function cloneChildrenInOrder(parent, children, filter) {
                var done = Promise.resolve();
                children.forEach(function (child) {
                    done = done
                        .then(function () {
                            return cloneNode(child, filter);
                        })
                        .then(function (childClone) {
                            if (childClone) parent.appendChild(childClone);
                        });
                });
                return done;
            }
        }

        function processClone(original, clone) {
            if (!(clone instanceof Element)) return clone;

            return Promise.resolve()
                .then(cloneStyle)
                .then(clonePseudoElements)
                .then(copyUserInput)
                .then(fixSvg)
                .then(function () {
                    return clone;
                });

            function cloneStyle() {
                copyStyle(window.getComputedStyle(original), clone.style);

                function copyStyle(source, target) {
                    if (source.cssText) target.cssText = source.cssText;
                    else copyProperties(source, target);

                    function copyProperties(source, target) {
                        util.asArray(source).forEach(function (name) {
                            target.setProperty(
                                name,
                                source.getPropertyValue(name),
                                source.getPropertyPriority(name)
                            );
                        });
                    }
                }
            }

            function clonePseudoElements() {
                [':before', ':after'].forEach(function (element) {
                    clonePseudoElement(element);
                });

                function clonePseudoElement(element) {
                    var style = window.getComputedStyle(original, element);
                    var content = style.getPropertyValue('content');

                    if (content === '' || content === 'none') return;

                    var className = util.uid();
                    clone.className = clone.className + ' ' + className;
                    var styleElement = document.createElement('style');
                    styleElement.appendChild(formatPseudoElementStyle(className, element, style));
                    clone.appendChild(styleElement);

                    function formatPseudoElementStyle(className, element, style) {
                        var selector = '.' + className + ':' + element;
                        var cssText = style.cssText ? formatCssText(style) : formatCssProperties(style);
                        return document.createTextNode(selector + '{' + cssText + '}');

                        function formatCssText(style) {
                            var content = style.getPropertyValue('content');
                            return style.cssText + ' content: ' + content + ';';
                        }

                        function formatCssProperties(style) {

                            return util.asArray(style)
                                .map(formatProperty)
                                .join('; ') + ';';

                            function formatProperty(name) {
                                return name + ': ' +
                                    style.getPropertyValue(name) +
                                    (style.getPropertyPriority(name) ? ' !important' : '');
                            }
                        }
                    }
                }
            }

            function copyUserInput() {
                if (original instanceof HTMLTextAreaElement) clone.innerHTML = original.value;
                if (original instanceof HTMLInputElement) clone.setAttribute("value", original.value);
            }

            function fixSvg() {
                if (!(clone instanceof SVGElement)) return;
                clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

                if (!(clone instanceof SVGRectElement)) return;
                ['width', 'height'].forEach(function (attribute) {
                    var value = clone.getAttribute(attribute);
                    if (!value) return;

                    clone.style.setProperty(attribute, value);
                });
            }
        }
    }

    function embedFonts(node) {
        return fontFaces.resolveAll()
            .then(function (cssText) {
                var styleNode = document.createElement('style');
                node.appendChild(styleNode);
                styleNode.appendChild(document.createTextNode(cssText));
                return node;
            });
    }

    function inlineImages(node) {
        return images.inlineAll(node)
            .then(function () {
                return node;
            });
    }

    function makeSvgDataUri(node, width, height) {
        return Promise.resolve(node)
            .then(function (node) {
                node.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
                return new XMLSerializer().serializeToString(node);
            })
            .then(util.escapeXhtml)
            .then(function (xhtml) {
                return '<foreignObject x="0" y="0" width="100%" height="100%">' + xhtml + '</foreignObject>';
            })
            .then(function (foreignObject) {
                return '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">' +
                    foreignObject + '</svg>';
            })
            .then(function (svg) {
                return 'data:image/svg+xml;charset=utf-8,' + svg;
            });
    }

    function newUtil() {
        return {
            escape: escape,
            parseExtension: parseExtension,
            mimeType: mimeType,
            dataAsUrl: dataAsUrl,
            isDataUrl: isDataUrl,
            canvasToBlob: canvasToBlob,
            resolveUrl: resolveUrl,
            getAndEncode: getAndEncode,
            uid: uid(),
            delay: delay,
            asArray: asArray,
            escapeXhtml: escapeXhtml,
            makeImage: makeImage,
            width: width,
            height: height
        };

        function mimes() {
            /*
             * Only WOFF and EOT mime types for fonts are 'real'
             * see http://www.iana.org/assignments/media-types/media-types.xhtml
             */
            var WOFF = 'application/font-woff';
            var JPEG = 'image/jpeg';

            return {
                'woff': WOFF,
                'woff2': WOFF,
                'ttf': 'application/font-truetype',
                'eot': 'application/vnd.ms-fontobject',
                'png': 'image/png',
                'jpg': JPEG,
                'jpeg': JPEG,
                'gif': 'image/gif',
                'tiff': 'image/tiff',
                'svg': 'image/svg+xml'
            };
        }

        function parseExtension(url) {
            var match = /\.([^\.\/]*?)$/g.exec(url);
            if (match) return match[1];
            else return '';
        }

        function mimeType(url) {
            var extension = parseExtension(url).toLowerCase();
            return mimes()[extension] || '';
        }

        function isDataUrl(url) {
            return url.search(/^(data:)/) !== -1;
        }

        function toBlob(canvas) {
            return new Promise(function (resolve) {
                var binaryString = window.atob(canvas.toDataURL().split(',')[1]);
                var length = binaryString.length;
                var binaryArray = new Uint8Array(length);

                for (var i = 0; i < length; i++)
                    binaryArray[i] = binaryString.charCodeAt(i);

                resolve(new Blob([binaryArray], {
                    type: 'image/png'
                }));
            });
        }

        function canvasToBlob(canvas) {
            if (canvas.toBlob)
                return new Promise(function (resolve) {
                    canvas.toBlob(resolve);
                });

            return toBlob(canvas);
        }

        function resolveUrl(url, baseUrl) {
            var doc = document.implementation.createHTMLDocument();
            var base = doc.createElement('base');
            doc.head.appendChild(base);
            var a = doc.createElement('a');
            doc.body.appendChild(a);
            base.href = baseUrl;
            a.href = url;
            return a.href;
        }

        function uid() {
            var index = 0;

            return function () {
                return 'u' + fourRandomChars() + index++;

                function fourRandomChars() {
                    /* see http://stackoverflow.com/a/6248722/2519373 */
                    return ('0000' + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
                }
            };
        }

        function makeImage(uri) {
            return new Promise(function (resolve, reject) {
                var image = new Image();
                image.onload = function () {
                    resolve(image);
                };
                image.onerror = reject;
                image.src = uri;
            });
        }

        function getAndEncode(url) {
            var TIMEOUT = 30000;
            if(domtoimage.impl.options.cacheBust) {
                // Cache bypass so we dont have CORS issues with cached images
                // Source: https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Bypassing_the_cache
                url += ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime();
            }

            return new Promise(function (resolve) {
                var request = new XMLHttpRequest();

                request.onreadystatechange = done;
                request.ontimeout = timeout;
                request.responseType = 'blob';
                request.timeout = TIMEOUT;
                request.open('GET', url, true);
                request.send();

                var placeholder;
                if(domtoimage.impl.options.imagePlaceholder) {
                    var split = domtoimage.impl.options.imagePlaceholder.split(/,/);
                    if(split && split[1]) {
                        placeholder = split[1];
                    }
                }

                function done() {
                    if (request.readyState !== 4) return;

                    if (request.status !== 200) {
                        if(placeholder) {
                            resolve(placeholder);
                        } else {
                            fail('cannot fetch resource: ' + url + ', status: ' + request.status);
                        }

                        return;
                    }

                    var encoder = new FileReader();
                    encoder.onloadend = function () {
                        var content = encoder.result.split(/,/)[1];
                        resolve(content);
                    };
                    encoder.readAsDataURL(request.response);
                }

                function timeout() {
                    if(placeholder) {
                        resolve(placeholder);
                    } else {
                        fail('timeout of ' + TIMEOUT + 'ms occured while fetching resource: ' + url);
                    }
                }

                function fail(message) {
                    console.error(message);
                    resolve('');
                }
            });
        }

        function dataAsUrl(content, type) {
            return 'data:' + type + ';base64,' + content;
        }

        function escape(string) {
            return string.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
        }

        function delay(ms) {
            return function (arg) {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve(arg);
                    }, ms);
                });
            };
        }

        function asArray(arrayLike) {
            var array = [];
            var length = arrayLike.length;
            for (var i = 0; i < length; i++) array.push(arrayLike[i]);
            return array;
        }

        function escapeXhtml(string) {
            return string.replace(/#/g, '%23').replace(/\n/g, '%0A');
        }

        function width(node) {
            var leftBorder = px(node, 'border-left-width');
            var rightBorder = px(node, 'border-right-width');
            return node.scrollWidth + leftBorder + rightBorder;
        }

        function height(node) {
            var topBorder = px(node, 'border-top-width');
            var bottomBorder = px(node, 'border-bottom-width');
            return node.scrollHeight + topBorder + bottomBorder;
        }

        function px(node, styleProperty) {
            var value = window.getComputedStyle(node).getPropertyValue(styleProperty);
            return parseFloat(value.replace('px', ''));
        }
    }

    function newInliner() {
        var URL_REGEX = /url\(['"]?([^'"]+?)['"]?\)/g;

        return {
            inlineAll: inlineAll,
            shouldProcess: shouldProcess,
            impl: {
                readUrls: readUrls,
                inline: inline
            }
        };

        function shouldProcess(string) {
            return string.search(URL_REGEX) !== -1;
        }

        function readUrls(string) {
            var result = [];
            var match;
            while ((match = URL_REGEX.exec(string)) !== null) {
                result.push(match[1]);
            }
            return result.filter(function (url) {
                return !util.isDataUrl(url);
            });
        }

        function inline(string, url, baseUrl, get) {
            return Promise.resolve(url)
                .then(function (url) {
                    return baseUrl ? util.resolveUrl(url, baseUrl) : url;
                })
                .then(get || util.getAndEncode)
                .then(function (data) {
                    return util.dataAsUrl(data, util.mimeType(url));
                })
                .then(function (dataUrl) {
                    return string.replace(urlAsRegex(url), '$1' + dataUrl + '$3');
                });

            function urlAsRegex(url) {
                return new RegExp('(url\\([\'"]?)(' + util.escape(url) + ')([\'"]?\\))', 'g');
            }
        }

        function inlineAll(string, baseUrl, get) {
            if (nothingToInline()) return Promise.resolve(string);

            return Promise.resolve(string)
                .then(readUrls)
                .then(function (urls) {
                    var done = Promise.resolve(string);
                    urls.forEach(function (url) {
                        done = done.then(function (string) {
                            return inline(string, url, baseUrl, get);
                        });
                    });
                    return done;
                });

            function nothingToInline() {
                return !shouldProcess(string);
            }
        }
    }

    function newFontFaces() {
        return {
            resolveAll: resolveAll,
            impl: {
                readAll: readAll
            }
        };

        function resolveAll() {
            return readAll(document)
                .then(function (webFonts) {
                    return Promise.all(
                        webFonts.map(function (webFont) {
                            return webFont.resolve();
                        })
                    );
                })
                .then(function (cssStrings) {
                    return cssStrings.join('\n');
                });
        }

        function readAll() {
            return Promise.resolve(util.asArray(document.styleSheets))
                .then(getCssRules)
                .then(selectWebFontRules)
                .then(function (rules) {
                    return rules.map(newWebFont);
                });

            function selectWebFontRules(cssRules) {
                return cssRules
                    .filter(function (rule) {
                        return rule.type === CSSRule.FONT_FACE_RULE;
                    })
                    .filter(function (rule) {
                        return inliner.shouldProcess(rule.style.getPropertyValue('src'));
                    });
            }

            function getCssRules(styleSheets) {
                var cssRules = [];
                styleSheets.forEach(function (sheet) {
                    try {
                        util.asArray(sheet.cssRules || []).forEach(cssRules.push.bind(cssRules));
                    } catch (e) {
                        console.log('Error while reading CSS rules from ' + sheet.href, e.toString());
                    }
                });
                return cssRules;
            }

            function newWebFont(webFontRule) {
                return {
                    resolve: function resolve() {
                        var baseUrl = (webFontRule.parentStyleSheet || {}).href;
                        return inliner.inlineAll(webFontRule.cssText, baseUrl);
                    },
                    src: function () {
                        return webFontRule.style.getPropertyValue('src');
                    }
                };
            }
        }
    }

    function newImages() {
        return {
            inlineAll: inlineAll,
            impl: {
                newImage: newImage
            }
        };

        function newImage(element) {
            return {
                inline: inline
            };

            function inline(get) {
                if (util.isDataUrl(element.src)) return Promise.resolve();

                return Promise.resolve(element.src)
                    .then(get || util.getAndEncode)
                    .then(function (data) {
                        return util.dataAsUrl(data, util.mimeType(element.src));
                    })
                    .then(function (dataUrl) {
                        return new Promise(function (resolve, reject) {
                            element.onload = resolve;
                            element.onerror = reject;
                            element.src = dataUrl;
                        });
                    });
            }
        }

        function inlineAll(node) {
            if (!(node instanceof Element)) return Promise.resolve(node);

            return inlineBackground(node)
                .then(function () {
                    if (node instanceof HTMLImageElement)
                        return newImage(node).inline();
                    else
                        return Promise.all(
                            util.asArray(node.childNodes).map(function (child) {
                                return inlineAll(child);
                            })
                        );
                });

            function inlineBackground(node) {
                var background = node.style.getPropertyValue('background');

                if (!background) return Promise.resolve(node);

                return inliner.inlineAll(background)
                    .then(function (inlined) {
                        node.style.setProperty(
                            'background',
                            inlined,
                            node.style.getPropertyPriority('background')
                        );
                    })
                    .then(function () {
                        return node;
                    });
            }
        }
    }
})(this);


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var easydeps_1 = __webpack_require__(7);
var m = __webpack_require__(0);
var image_1 = __webpack_require__(9);
var Holder_1 = __webpack_require__(16);
var Layout_1 = __webpack_require__(37);
var preview;
var initializePreview = function () {
    if (preview !== undefined) {
        return preview;
    }
    preview = document.createElement("div");
    preview.style.position = "fixed";
    preview.style.top = "0";
    preview.style.left = "0";
    preview.style.zIndex = "-100";
    preview.style.pointerEvents = "none";
    document.body.appendChild(preview);
    return preview;
};
var getProductManager = function () {
    return easydeps_1.default.getInstance().request(["productManager"])[0];
};
exports.default = function (scale, options) {
    if (scale === void 0) { scale = 1; }
    if (options === void 0) { options = {}; }
    return __awaiter(_this, void 0, void 0, function () {
        var manager, layout, holders, _i, _a, h, position, _b, _c, _d, result;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    manager = getProductManager();
                    initializePreview();
                    layout = manager.getProductPart().layout;
                    if (!layout) {
                        throw new Error("ProductPart is undefined or has no layout");
                    }
                    layout = manager.getScaledLayout(manager.getProductPart().layout, scale);
                    holders = undefined;
                    if (!options.individual) return [3, 4];
                    holders = [];
                    _i = 0, _a = layout.holders;
                    _e.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3, 4];
                    h = _a[_i];
                    position = { left: 0, top: 0, width: h.position.width, height: h.position.height };
                    m.render(preview, m(Holder_1.default, { holder: h, position: position }));
                    _c = (_b = holders).push;
                    _d = { id: h.id };
                    return [4, image_1.domToImage(preview)];
                case 2:
                    _c.apply(_b, [(_d.image = _e.sent(), _d)]);
                    _e.label = 3;
                case 3:
                    _i++;
                    return [3, 1];
                case 4:
                    m.render(preview, m(Layout_1.default, { layout: layout }, layout.holders.map(function (holder) { return m(Holder_1.default, { holder: holder }); })));
                    return [4, image_1.domToImage(preview)];
                case 5:
                    result = _e.sent();
                    m.render(preview, null);
                    return [2, { result: result, holders: holders }];
            }
        });
    });
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var m = __webpack_require__(0);
var enums_1 = __webpack_require__(5);
var HolderContent = (function () {
    function HolderContent() {
    }
    HolderContent.prototype.view = function (v) {
        var h = v.attrs.holder;
        if (!h || !h.content || !h.content.value) {
            return null;
        }
        if (h.content.type === enums_1.IMAGE) {
            return m("img", { style: exports.getHolderImgStyle(v.attrs.holder), src: v.attrs.thumb ? h.content.thumb : h.content.value });
        }
        else if (h.content.type === enums_1.TEXT) {
            return m("div", { style: exports.getHolderTextStyle(v.attrs.holder) }, h.content.value);
        }
        else if (h.content.type === enums_1.SHAPE) {
            return m("div", { style: __assign({}, exports.getHolderShapeStyle(v.attrs.holder), { fontFamily: h.content.fontFamily }), className: "icon-" + h.content.value });
        }
    };
    return HolderContent;
}());
exports.default = HolderContent;
var holderContentStyle = function (h) {
    if (!h.content) {
        return {};
    }
    var style = {
        width: "100%",
    };
    if (h.content.filter && h.content.filter.length > 0) {
        style = __assign({}, style, h.content.filter.reduce(function (s, f) {
            Object.keys(f).forEach(function (k) {
                if (s[k]) {
                    s[k] += " " + f[k];
                }
                else {
                    s[k] = f[k];
                }
            });
            return s;
        }, {}));
    }
    return style;
};
exports.getHolderImgStyle = function (h) {
    var style = __assign({}, holderContentStyle(h));
    if (!h.content) {
        return style;
    }
    style = __assign({}, style, { position: "absolute", objectFit: "cover", width: "100%", height: "100%" });
    return style;
};
exports.getHolderShapeStyle = function (h) {
    var style = __assign({}, holderContentStyle(h));
    if (!h.content) {
        return style;
    }
    var _a = h.content, color = _a.color, fontSize = _a.fontSize, fontWeight = _a.fontWeight, textDecoration = _a.textDecoration;
    style = __assign({}, style, { color: color,
        fontSize: fontSize, textAlign: (h.content && h.content.align) || "" });
    return style;
};
exports.getHolderTextStyle = function (h) {
    var style = __assign({}, holderContentStyle(h));
    if (!h.content) {
        return style;
    }
    var _a = h.content, color = _a.color, fontSize = _a.fontSize, fontFamily = _a.fontFamily, fontStyle = _a.fontStyle, fontWeight = _a.fontWeight, textDecoration = _a.textDecoration;
    style = __assign({}, style, { color: color,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontStyle: fontStyle,
        fontWeight: fontWeight,
        textDecoration: textDecoration, textAlign: (h.content && h.content.align) || "" });
    return style;
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var m = __webpack_require__(0);
var dom_1 = __webpack_require__(4);
var object_1 = __webpack_require__(1);
var Layout = (function () {
    function Layout() {
    }
    Layout.prototype.view = function (v) {
        return m("div", { className: object_1.cleanString("layout", v.attrs.className), style: exports.getLayoutStyle(v.attrs.layout) }, v.children);
    };
    return Layout;
}());
exports.default = Layout;
exports.getLayoutStyle = function (l) {
    var position = dom_1.getRectStyle(l.position);
    return __assign({}, position, { position: "relative", overflow: "hidden" });
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var m = __webpack_require__(0);
var image_1 = __webpack_require__(9);
var Editor_1 = __webpack_require__(39);
var controller_1 = __webpack_require__(60);
__webpack_require__(61);
var EditorDrawer = (function () {
    function EditorDrawer() {
        this.controller = new controller_1.default();
    }
    EditorDrawer.prototype.view = function (v) {
        var _this = this;
        var _a = this.controller.refresh(), holder = _a.holder, scale = _a.scale;
        if (holder === undefined) {
            return null;
        }
        return m("div", { className: "component--EditorDrawer " + (v.attrs.className || "") },
            m(Editor_1.default, { key: holder.id, holder: holder, scale: scale, options: this.controller.getEditorOptions(), contentoptions: this.controller.options, ondepthchange: function (change) {
                    return _this.controller.update({ depth: change || 0 });
                }, oncontentrotatechange: function (change) {
                    return _this.controller.update({ content: { rotate: change || 0 } });
                }, oncontentalignchange: function (change) {
                    return _this.controller.update({ content: { align: change || "" } });
                }, oncontentvaluechange: function (change) {
                    return _this.controller.update({ content: { value: change || "" } });
                }, oncontentfontsizechange: function (change) {
                    return _this.controller.update({ content: { fontSize: change || "" } });
                }, oncontentfontfamilychange: function (change) {
                    return _this.controller.update({ content: { fontFamily: change || "" } });
                }, oncontentfontstylechange: function (change) {
                    return _this.controller.update({ content: { fontStyle: change || "" } });
                }, oncontentfontweightchange: function (change) {
                    return _this.controller.update({ content: { fontWeight: change || "" } });
                }, oncontenttextdecorationchange: function (change) {
                    return _this.controller.update({ content: { textDecoration: change || "" } });
                }, oncontentcolorchange: function (change) {
                    return _this.controller.update({ content: { color: change || "" } });
                }, oncontentbackgroundcolorchange: function (change) {
                    return _this.controller.update({ content: { backgroundColor: change || "" } });
                }, oncontentopacitychange: function (change) {
                    return _this.controller.update({ content: { opacity: change || "" } });
                }, oncontentpixelatedchange: function (change) {
                    return _this.controller.update({ content: { pixelated: change || "" } });
                }, oncontentfilterchange: function (filter) {
                    if (!filter) {
                        return;
                    }
                    filter = [filter];
                    _this.controller.update({ content: { filter: filter } });
                }, oncontentimagechange: function (value) {
                    image_1.getThumb(value, undefined, undefined, undefined, image_1.getImageType(value))
                        .then(function (thumb) {
                        return _this.controller.update({ content: { value: value, thumb: thumb } });
                    });
                } }));
    };
    return EditorDrawer;
}());
exports.default = EditorDrawer;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var m = __webpack_require__(0);
var Checkbox_1 = __webpack_require__(20);
var ColorPicker_1 = __webpack_require__(42);
var IconPicker_1 = __webpack_require__(43);
var Input_1 = __webpack_require__(21);
var Select_1 = __webpack_require__(44);
var ImageBackgroundRemover_1 = __webpack_require__(45);
var ImageEditor_1 = __webpack_require__(50);
var enums_1 = __webpack_require__(5);
var dom_1 = __webpack_require__(4);
var helpers_1 = __webpack_require__(6);
var object_1 = __webpack_require__(1);
__webpack_require__(58);
var Editor = (function () {
    function Editor() {
        this.imageBackgroundRemover = false;
        this.imageEditor = false;
        this.imageEditorRotate = false;
    }
    Editor.prototype.view = function (v) {
        if (!v.attrs.holder) {
            return null;
        }
        return m("div", { className: object_1.cleanString("editor ", v.attrs.className) },
            v.attrs.options.type === enums_1.TEXT && this.getTextEditorOptions(v.attrs),
            v.attrs.options.type === enums_1.IMAGE && this.getImageEditorOptions(v.attrs),
            v.attrs.options.type === enums_1.SHAPE && this.getShapeEditorOptions(v.attrs),
            this.getSharedEditorOptions(v.attrs));
    };
    Editor.prototype.getSharedEditorOptions = function (attrs) {
        var options = [];
        options.push(m("div", { className: "option" },
            m("span", { className: "option-description" }, "Background color"),
            m("div", { className: "colorSelectPicker" },
                m(Select_1.default, { value: attrs.holder.content.backgroundColor || attrs.contentoptions.backgroundColor[0], oninput: function (value, event) { return dom_1.stopEvent(event) && object_1.exec(attrs.oncontentbackgroundcolorchange, value); } }, attrs.contentoptions.backgroundColor.map(function (backgroundColor) { return m("span", { "data-option": backgroundColor, style: { backgroundColor: backgroundColor } }, backgroundColor); })),
                m(ColorPicker_1.default, { onchange: function (value, event) { return dom_1.stopEvent(event) && object_1.exec(attrs.oncontentbackgroundcolorchange, value); } }))));
        options.push(m("div", { className: "option" },
            m("span", { className: "option-description" }, "Transparency"),
            m(Select_1.default, { value: attrs.holder.content.opacity, oninput: function (value, event) { return dom_1.stopEvent(event) && object_1.exec(attrs.oncontentopacitychange, value); } },
                m("span", { "data-option": 0, style: { opacity: 1 } }, "0%"),
                m("span", { "data-option": .9, style: { opacity: .9 } }, "10%"),
                m("span", { "data-option": .8, style: { opacity: .8 } }, "20%"),
                m("span", { "data-option": .7, style: { opacity: .7 } }, "30%"),
                m("span", { "data-option": .6, style: { opacity: .6 } }, "40%"),
                m("span", { "data-option": .5, style: { opacity: .5 } }, "50%"),
                m("span", { "data-option": .4, style: { opacity: .4 } }, "60%"),
                m("span", { "data-option": .3, style: { opacity: .3 } }, "70%"),
                m("span", { "data-option": .2, style: { opacity: .2 } }, "80%"),
                m("span", { "data-option": .1, style: { opacity: .1 } }, "90%"))));
        if (attrs.options.depth) {
            options.push(m("div", { className: "option" },
                m("span", { className: "option-description" }, "Depth"),
                m("button", { onclick: function (event) { return dom_1.stopEvent(event) && object_1.exec(attrs.ondepthchange, 1); } }, "+"),
                m("button", { onclick: function (event) { return dom_1.stopEvent(event) && object_1.exec(attrs.ondepthchange, -1); } }, "-")));
        }
        return options;
    };
    Editor.prototype.getTextEditorOptions = function (attrs) {
        var options = [];
        options.push(m("div", { className: "option" },
            m("span", { className: "option-description" }, "Content"),
            m(Input_1.default, { value: attrs.holder.content.value, multiline: true, autofocus: true, oninput: function (value, event) { return dom_1.stopEvent(event) && object_1.exec(attrs.oncontentvaluechange, value); } })));
        options.push(m("div", { className: "option" },
            m("span", { className: "option-description" }, "Font size"),
            m(Select_1.default, { value: attrs.holder.content.fontSize || attrs.contentoptions.fontSize[0], oninput: function (value, event) { return dom_1.stopEvent(event) && object_1.exec(attrs.oncontentfontsizechange, value); } }, attrs.contentoptions.fontSize.map(function (fontSize) { return m("span", { "data-option": fontSize }, fontSize); }))));
        options.push(m("div", { className: "option" },
            m("span", { className: "option-description" }, "Font family"),
            m(Select_1.default, { style: { width: "200px" }, value: attrs.holder.content.fontFamily || attrs.contentoptions.fontFamily[0], oninput: function (value, event) { return dom_1.stopEvent(event) && object_1.exec(attrs.oncontentfontfamilychange, value); } }, attrs.contentoptions.fontFamily.map(function (fontFamily) { return m("span", { "data-option": fontFamily, style: { fontFamily: fontFamily } }, fontFamily); }))));
        options.push(m("div", { className: "option" },
            m("span", { className: "option-description" }, "Font style"),
            m(Select_1.default, { value: attrs.holder.content.fontStyle || attrs.contentoptions.fontStyle[0], oninput: function (value, event) { return dom_1.stopEvent(event) && object_1.exec(attrs.oncontentfontstylechange, value); } }, attrs.contentoptions.fontStyle.map(function (fontStyle) { return m("span", { "data-option": fontStyle, style: { fontStyle: fontStyle } }, fontStyle); }))));
        options.push(m("div", { className: "option" },
            m("span", { className: "option-description" }, "Font weight"),
            m(Select_1.default, { value: attrs.holder.content.fontWeight || attrs.contentoptions.fontWeight[0], oninput: function (value, event) { return dom_1.stopEvent(event) && object_1.exec(attrs.oncontentfontweightchange, value); } }, attrs.contentoptions.fontWeight.map(function (fontWeight) { return m("span", { "data-option": fontWeight, style: { fontWeight: fontWeight } }, fontWeight); }))));
        options.push(m("div", { className: "option" },
            m("span", { className: "option-description" }, "Font decoration"),
            m(Select_1.default, { value: attrs.holder.content.textDecoration || attrs.contentoptions.textDecoration[0], oninput: function (value, event) { return dom_1.stopEvent(event) && object_1.exec(attrs.oncontenttextdecorationchange, value); } }, attrs.contentoptions.textDecoration.map(function (textDecoration) { return m("span", { "data-option": textDecoration, style: { textDecoration: textDecoration } }, textDecoration); }))));
        options.push(m("div", { className: "option" },
            m("span", { className: "option-description" }, "Font color"),
            m("div", { className: "colorSelectPicker" },
                m(Select_1.default, { value: attrs.holder.content.color || attrs.contentoptions.color[0], oninput: function (value, event) { return dom_1.stopEvent(event) && object_1.exec(attrs.oncontentcolorchange, value); } }, attrs.contentoptions.color.map(function (color) { return m("span", { "data-option": color, style: { color: color } }, color); })),
                m(ColorPicker_1.default, { onchange: function (value, event) { return dom_1.stopEvent(event) && object_1.exec(attrs.oncontentcolorchange, value); } }))));
        options.push(m("div", { className: "option" },
            m("span", { className: "option-description" }, "Text align"),
            m(Select_1.default, { value: attrs.holder.content.align || attrs.contentoptions.align[0], oninput: function (value, event) { return dom_1.stopEvent(event) && object_1.exec(attrs.oncontentalignchange, value); } }, attrs.contentoptions.align.map(function (align) { return m("span", { "data-option": align, style: { align: align } }, align); }))));
        options.push(m("div", { className: "option" },
            m("span", { className: "option-description" }, "Text filter"),
            m(Select_1.default, { className: "filterOptions", value: attrs.holder.content.textFilter || attrs.contentoptions.textFilter[0], oninput: function (value, event) { return dom_1.stopEvent(event) && object_1.exec(attrs.oncontentfilterchange, value); } }, attrs.contentoptions.textFilter.map(function (filter) {
                return m("span", { "data-option": filter.style },
                    filter.title,
                    m("div", { className: "image-wrapper" },
                        m("img", { src: attrs.holder.content.thumb, style: filter.style })));
            }))));
        options.push(m("div", { className: "option" },
            m("span", { className: "option-description" }, "Text shadow"),
            m(Select_1.default, { oninput: function (value, event) { return dom_1.stopEvent(event) && object_1.exec(attrs.oncontentfilterchange, value); } },
                m("span", { "data-option": {
                        textShadow: "2px 0 0 #000, -2px 0 0 #000, 0 2px 0 #000, 0 -2px 0 #000, 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 5px #000",
                    } }, "black border"),
                m("span", { "data-option": { textShadow: "1px 1px #fff, -1px 1px #fff, 1px -1px #fff, -1px -1px #fff, 1px 1px 5px #555" } }, "white border"),
                m("span", { "data-option": { textShadow: "-1px -1px 1px #fff, 1px 1px 1px #000" } }, "emboss"),
                m("span", { "data-option": { textShadow: "1px 2px 2px #fff, 0 0 0 #000, 1px 2px 2px #fff" } }, "inset"),
                m("span", { "data-option": { textShadow: "0 5px 10px black" } }, "small black bottom shadow"),
                m("span", { "data-option": { textShadow: "0 5px 10px white" } }, "small white bottom shadow"),
                m("span", { "data-option": { textShadow: "0 0 20px black" } }, "medium black shadow"),
                m("span", { "data-option": { textShadow: "0 0 20px white" } }, "medium white shadow"),
                m("span", { "data-option": { textShadow: "0 0 30px black" } }, "large black shadow"),
                m("span", { "data-option": { textShadow: "0 0 30px white" } }, "large white shadow"))));
        return options;
    };
    Editor.prototype.getImageEditorOptions = function (attrs) {
        var _this = this;
        var options = [];
        if (attrs.holder.content.originalValue) {
            options.push(m("div", { className: "option" },
                m("span", { className: "option-description" }, "Reset image"),
                m("button", { onclick: function (event) { return object_1.exec(attrs.oncontentimagechange, attrs.holder.content.originalValue); } }, "reset")));
        }
        if (attrs.holder && attrs.holder.content && attrs.holder.content.value && this.imageEditor) {
            options.push(m(ImageEditor_1.default, { position: helpers_1.setScale(attrs.holder.position, attrs.scale), src: attrs.holder.content.value, onclose: function (event) { return _this.imageEditor = false; }, onsubmit: function (changed, original) { return object_1.exec(attrs.oncontentimagechange, changed, original); } }));
        }
        options.push(m("div", { className: "option" },
            m("span", { className: "option-description" }, "Crop image"),
            m("button", { onclick: function (event) { return _this.imageEditor = true; } }, "Open cropping tool")));
        if (attrs.holder && attrs.holder.content && attrs.holder.content.value && this.imageBackgroundRemover) {
            options.push(m(ImageBackgroundRemover_1.default, { position: helpers_1.setScale(attrs.holder.position, attrs.scale), src: attrs.holder.content.value, onclose: function (event) { return _this.imageBackgroundRemover = false; }, onsubmit: function (changed, original) { return object_1.exec(attrs.oncontentimagechange, changed, original); } }));
        }
        options.push(m("div", { className: "option" },
            m("span", { className: "option-description" }, "Remove background color"),
            m("button", { onclick: function (event) { return _this.imageBackgroundRemover = true; } }, "Open background remover tool")));
        options.push(m("div", { className: "option" },
            m("span", { className: "option-description" }, "Image filter"),
            m(Select_1.default, { className: "filterOptions", value: attrs.holder.content.imageFilter || attrs.contentoptions.imageFilter[0], oninput: function (value, event) { return dom_1.stopEvent(event) && object_1.exec(attrs.oncontentfilterchange, value); } }, attrs.contentoptions.imageFilter.map(function (filter) {
                return m("span", { "data-option": filter.style },
                    filter.title,
                    m("div", { className: "image-wrapper" },
                        m("img", { src: attrs.holder.content.thumb, style: filter.style })));
            }))));
        options.push(m("div", { className: "option" },
            m("span", { className: "option-description" }, "Disable image smoothing"),
            m(Checkbox_1.default, { defaultChecked: attrs.holder.content.pixelated, onclick: function (value, event) { return dom_1.stopEvent(event) && object_1.exec(attrs.oncontentpixelatedchange, value); } })));
        return options;
    };
    Editor.prototype.getShapeEditorOptions = function (attrs) {
        var options = [];
        options.push(m("div", { className: "option" },
            m("span", { className: "option-description" }, "Icon"),
            m(IconPicker_1.default, { value: attrs.holder.content.value, font: attrs.holder.content.fontFamily, oninput: function (_a, event) {
                    var unicode = _a.unicode, font = _a.font;
                    dom_1.stopEvent(event);
                    object_1.exec(attrs.oncontentvaluechange, unicode);
                    object_1.exec(attrs.oncontentfontfamilychange, font);
                } })));
        options.push(m("div", { className: "option" },
            m("span", { className: "option-description" }, "Size"),
            m(Select_1.default, { value: attrs.holder.content.fontSize || attrs.contentoptions.fontSize[0], oninput: function (value, event) { return dom_1.stopEvent(event) && object_1.exec(attrs.oncontentfontsizechange, value); } }, attrs.contentoptions.fontSize.map(function (fontSize) { return m("span", { "data-option": fontSize }, fontSize); }))));
        options.push(m("div", { className: "option" },
            m("span", { className: "option-description" }, "Color"),
            m("div", { className: "colorSelectPicker" },
                m(Select_1.default, { value: attrs.holder.content.color || attrs.contentoptions.color[0], oninput: function (value, event) { return dom_1.stopEvent(event) && object_1.exec(attrs.oncontentcolorchange, value); } }, attrs.contentoptions.color.map(function (color) { return m("span", { "data-option": color, style: { color: color } }, color); })),
                m(ColorPicker_1.default, { onchange: function (value, event) { return dom_1.stopEvent(event) && object_1.exec(attrs.oncontentcolorchange, value); } }))));
        options.push(m("div", { className: "option" },
            m("span", { className: "option-description" }, "Align"),
            m(Select_1.default, { value: attrs.holder.content.align || attrs.contentoptions.align[0], oninput: function (value, event) { return dom_1.stopEvent(event) && object_1.exec(attrs.oncontentalignchange, value); } }, attrs.contentoptions.align.map(function (align) { return m("span", { "data-option": align, style: { align: align } }, align); }))));
        options.push(m("div", { className: "option" },
            m("span", { className: "option-description" }, "Filter"),
            m(Select_1.default, { className: "filterOptions", value: attrs.holder.content.shapeFilter || attrs.contentoptions.shapeFilter[0], oninput: function (value, event) { return dom_1.stopEvent(event) && object_1.exec(attrs.oncontentfilterchange, value); } }, attrs.contentoptions.shapeFilter.map(function (filter) {
                return m("span", { "data-option": filter.style },
                    filter.title,
                    m("div", { className: "image-wrapper" },
                        m("img", { src: attrs.holder.content.thumb, style: filter.style })));
            }))));
        options.push(m("div", { className: "option" },
            m("span", { className: "option-description" }, "Shadow"),
            m(Select_1.default, { oninput: function (value, event) { return dom_1.stopEvent(event) && object_1.exec(attrs.oncontentfilterchange, value); } },
                m("span", { "data-option": {
                        textShadow: "2px 0 0 #000, -2px 0 0 #000, 0 2px 0 #000, 0 -2px 0 #000, 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 5px #000",
                    } }, "black border"),
                m("span", { "data-option": { textShadow: "1px 1px #fff, -1px 1px #fff, 1px -1px #fff, -1px -1px #fff, 1px 1px 5px #555" } }, "white border"),
                m("span", { "data-option": { textShadow: "-1px -1px 1px #fff, 1px 1px 1px #000" } }, "emboss"),
                m("span", { "data-option": { textShadow: "1px 2px 2px #fff, 0 0 0 #000, 1px 2px 2px #fff" } }, "inset"),
                m("span", { "data-option": { textShadow: "0 5px 10px black" } }, "small black bottom shadow"),
                m("span", { "data-option": { textShadow: "0 5px 10px white" } }, "small white bottom shadow"),
                m("span", { "data-option": { textShadow: "0 0 20px black" } }, "medium black shadow"),
                m("span", { "data-option": { textShadow: "0 0 20px white" } }, "medium white shadow"),
                m("span", { "data-option": { textShadow: "0 0 30px black" } }, "large black shadow"),
                m("span", { "data-option": { textShadow: "0 0 30px white" } }, "large white shadow"))));
        return options;
    };
    return Editor;
}());
exports.default = Editor;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".component--Input {\n  position: relative;\n  min-height: 30px;\n  min-width: 100px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: reverse;\n      -ms-flex-direction: row-reverse;\n          flex-direction: row-reverse;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  font-family: sans-serif; }\n  .component--Input input,\n  .component--Input textarea {\n    border: none;\n    width: 100%;\n    line-height: 20px;\n    padding: 5px;\n    background-color: rgba(255, 255, 255, 0.6); }\n  .component--Input label {\n    padding: 0 10px; }\n\n.component--Slider {\n  position: relative;\n  min-height: 30px;\n  min-width: 100px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: reverse;\n      -ms-flex-direction: row-reverse;\n          flex-direction: row-reverse;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  font-family: sans-serif; }\n  .component--Slider input {\n    border: none;\n    width: 100%;\n    line-height: 20px;\n    padding: 5px;\n    background-color: rgba(255, 255, 255, 0.6); }\n  .component--Slider label {\n    padding: 0 10px; }\n\n.component--ColorPicker {\n  position: relative;\n  display: inline-block;\n  min-height: 30px;\n  min-width: 20px; }\n  .component--ColorPicker input {\n    border: none;\n    background-color: transparent;\n    position: absolute;\n    top: 0;\n    left: 0;\n    height: 100%;\n    padding: 0;\n    width: 100%;\n    margin: 0;\n    cursor: pointer; }\n\n.component--Checkbox {\n  position: relative;\n  display: inline-block;\n  min-height: 30px;\n  min-width: 100px; }\n  .component--Checkbox input,\n  .component--Checkbox textarea {\n    border: none;\n    line-height: 20px;\n    padding: 5px;\n    background-color: rgba(255, 255, 255, 0.6); }\n\n.component--Select {\n  border: none;\n  width: 100%;\n  line-height: 20px;\n  background-color: rgba(255, 255, 255, 0.6);\n  display: inline-block;\n  position: relative;\n  cursor: pointer; }\n  .component--Select .value {\n    width: 100%;\n    height: 100%; }\n    .component--Select .value span {\n      margin: 5px;\n      width: auto; }\n  .component--Select .options {\n    position: absolute;\n    top: calc(100% + 4px);\n    left: 0;\n    width: 100%;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    background-color: white;\n    display: none;\n    -webkit-box-shadow: 0 7px 20px -5px grey;\n            box-shadow: 0 7px 20px -5px grey;\n    max-height: 200px;\n    overflow: auto;\n    min-width: -webkit-max-content;\n    min-width: -moz-max-content;\n    min-width: max-content;\n    z-index: 1; }\n  .component--Select .option,\n  .component--Select .value {\n    margin: 0 !important; }\n    .component--Select .option > *,\n    .component--Select .value > * {\n      width: 100%;\n      height: 100%;\n      display: block; }\n    .component--Select .option img,\n    .component--Select .value img {\n      -o-object-fit: cover;\n         object-fit: cover;\n      width: 100%;\n      height: 100%; }\n  .component--Select .option {\n    display: block;\n    width: calc(100% - 10px);\n    margin: 0;\n    line-height: 20px;\n    padding: 5px;\n    background-color: rgba(255, 255, 255, 0.6);\n    position: relative;\n    cursor: pointer;\n    -webkit-box-flex: 0;\n        -ms-flex: 0 0 auto;\n            flex: 0 0 auto; }\n    .component--Select .option:hover {\n      background-color: #cccccc; }\n    .component--Select .option.selected {\n      background-color: #dedede; }\n  .component--Select.open .options {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex; }\n\n.component--IconPicker {\n  border: none;\n  width: 100%;\n  line-height: 20px;\n  padding: 5px;\n  background-color: rgba(255, 255, 255, 0.6);\n  display: inline-block;\n  position: relative;\n  cursor: pointer; }\n  .component--IconPicker .value {\n    width: 100%;\n    height: 100%;\n    text-align: center;\n    margin: 0;\n    font-size: 20px; }\n  .component--IconPicker .options {\n    position: absolute;\n    top: calc(100% + 4px);\n    left: 0;\n    width: 300px;\n    background-color: white;\n    display: none;\n    -webkit-box-shadow: 0 7px 20px -5px grey;\n            box-shadow: 0 7px 20px -5px grey;\n    max-height: 200px;\n    overflow: auto;\n    z-index: 1;\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap; }\n  .component--IconPicker .options > .option.selected {\n    background-color: #dedede; }\n  .component--IconPicker .options > .option {\n    display: block;\n    position: relative;\n    cursor: pointer;\n    width: 16.667%;\n    height: 30px;\n    font-size: 30px;\n    line-height: 30px;\n    text-align: center;\n    margin: 0; }\n    .component--IconPicker .options > .option:hover {\n      background-color: #cccccc; }\n  .component--IconPicker.open .options {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex; }\n", ""]);

// exports


/***/ }),
/* 41 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var m = __webpack_require__(0);
var object_1 = __webpack_require__(1);
__webpack_require__(11);
var ColorPicker = (function () {
    function ColorPicker() {
    }
    ColorPicker.prototype.view = function (v) {
        var _this = this;
        var id = Math.random().toString();
        return m("div", { className: "component--ColorPicker" + (v.attrs.className || ""), style: v.attrs.style },
            m("input", { id: id, type: "color", value: v.attrs.value, defaultValue: v.attrs.default, onchange: function (evt) { return _this.emitEvent(v.attrs.onchange, evt); }, oninput: function (evt) { return _this.emitEvent(v.attrs.oninput, evt); } }),
            v.attrs.label && m("label", { htmlFor: id }, v.attrs.label));
    };
    ColorPicker.prototype.emitEvent = function (eventCb, event) {
        event.redraw = false;
        object_1.exec(eventCb, event.target.value, event, function (value) { return event.target.value = value; });
    };
    return ColorPicker;
}());
exports.default = ColorPicker;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var m = __webpack_require__(0);
var iconfont_1 = __webpack_require__(19);
var object_1 = __webpack_require__(1);
__webpack_require__(11);
var cache = {};
var IconPicker = (function () {
    function IconPicker() {
        this.selectedOption = "";
        this.clicked = false;
    }
    IconPicker.prototype.oninit = function (v) {
        if (cache[v.attrs.font] === undefined) {
            cache[v.attrs.font] = iconfont_1.getIcons(v.attrs.font);
        }
        this.selectedOption = v.attrs.value || cache[v.attrs.font][0];
    };
    IconPicker.prototype.oncreate = function (v) {
        this.dom = v.dom;
    };
    IconPicker.prototype.onbeforeupdate = function (v, o) {
        return false;
    };
    IconPicker.prototype.view = function (v) {
        var _this = this;
        this.clicked = false;
        return m("div", { className: "component--IconPicker " + v.attrs.className, style: __assign({}, v.attrs.style, { fontFamily: v.attrs.font }), onclick: function (event) {
                if (_this.dom.classList.contains("open")) {
                    _this.dom.classList.remove("open");
                }
                else {
                    _this.dom.classList.add("open");
                }
            } },
            m("div", { className: "value", key: this.selectedOption },
                m("div", { className: "icon-" + this.selectedOption, oncreate: function (vnode) { return _this.valueDom = vnode.dom; } })),
            m("div", { className: "options" }, cache[v.attrs.font].map(function (unicode) {
                return m("div", { className: "option icon-" + unicode + " " + (unicode === _this.selectedOption ? "selected" : ""), onclick: function (event) {
                        event.stopPropagation();
                        _this.dom.classList.remove("open");
                        _this.selectedOption = unicode;
                        _this.valueDom.className = "icon-" + unicode;
                        _this.clicked = true;
                        object_1.exec(v.attrs.onchange, { font: v.attrs.font, unicode: _this.selectedOption }, event);
                    }, onmouseenter: function (event) {
                        event.stopPropagation();
                        object_1.exec(v.attrs.oninput, { font: v.attrs.font, unicode: unicode }, event);
                    }, onmouseleave: function (event) {
                        event.stopPropagation();
                        if (_this.clicked) {
                            event.redraw = false;
                            return;
                        }
                        object_1.exec(v.attrs.oninput, { font: v.attrs.font, unicode: _this.selectedOption }, event);
                    } });
            })));
    };
    IconPicker.prototype.getOption = function (item) {
        return typeof item === "object" && !Array.isArray(item) && item && item.attrs && item.attrs["data-option"];
    };
    IconPicker.prototype.isSelected = function (item, option) {
        if (option === undefined) {
            option = this.getOption(item);
        }
        return (option && option === this.selectedOption);
    };
    return IconPicker;
}());
exports.default = IconPicker;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var m = __webpack_require__(0);
var object_1 = __webpack_require__(1);
__webpack_require__(11);
var Select = (function () {
    function Select() {
    }
    Select.prototype.oncreate = function (v) {
        this.dom = v.dom;
    };
    Select.prototype.view = function (v) {
        var _this = this;
        var children = (Array.isArray(v.children) ? v.children : [v.children]);
        var value = v.attrs.value || children[0];
        return m("div", { className: "component--Select " + v.attrs.className, style: v.attrs.style, onclick: function (event) {
                if (_this.dom.classList.contains("open")) {
                    _this.dom.classList.remove("open");
                }
                else {
                    _this.dom.classList.add("open");
                }
            } },
            m("div", { className: "value", key: this.prevOption }, children.find(function (item) { return _this.isSelected(_this.prevOption, item); }) || children[0]),
            m("div", { className: "options" }, children.map(function (item, index) {
                if (!item) {
                    return null;
                }
                var option = _this.getOption(item);
                return m("div", { className: "option " + (_this.isSelected(_this.prevOption, item, option) ? "selected" : ""), onclick: function (event) {
                        event.stopPropagation();
                        _this.dom.classList.remove("open");
                        _this.prevOption = option;
                        if (_this.prevOption === _this.selectedOption) {
                            return;
                        }
                        object_1.exec(v.attrs.oninput, option, event);
                    }, onmouseenter: function (event) {
                        if (_this.prevOption === option) {
                            event.redraw = false;
                            return;
                        }
                        _this.selectedOption = option;
                        object_1.exec(v.attrs.oninput, option, event);
                    }, onmouseleave: function (event) {
                        if (_this.prevOption === option) {
                            event.redraw = false;
                            return;
                        }
                        _this.selectedOption = undefined;
                        object_1.exec(v.attrs.oninput, _this.prevOption, event);
                    } }, item);
            })));
    };
    Select.prototype.getOption = function (item) {
        return typeof item === "object" && !Array.isArray(item) && item && item.attrs && item.attrs["data-option"];
    };
    Select.prototype.isSelected = function (test, item, option) {
        if (option === undefined) {
            option = this.getOption(item);
        }
        return (option && option === test);
    };
    return Select;
}());
exports.default = Select;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var eventaggregator_1 = __webpack_require__(8);
var m = __webpack_require__(0);
var image_1 = __webpack_require__(9);
var object_1 = __webpack_require__(1);
var Dialog_1 = __webpack_require__(22);
var Slider_1 = __webpack_require__(23);
__webpack_require__(48);
var ImageBackgroundRemover = (function () {
    function ImageBackgroundRemover() {
        this.modified = false;
        this.margin = 100;
        this.compressed = false;
        this.changes = [];
    }
    ImageBackgroundRemover.prototype.oninit = function (v) {
        this.targetDimension = { width: v.attrs.position.width, height: v.attrs.position.height };
        this.src = v.attrs.src;
        this.domEA = eventaggregator_1.default.getInstance("dom");
    };
    ImageBackgroundRemover.prototype.onbeforeremove = function (v) {
        this.resizeEvent.off();
    };
    ImageBackgroundRemover.prototype.view = function (v) {
        var _this = this;
        return m(Dialog_1.default, { className: "component--ImageBackgroundRemover open" },
            m("div", { className: "color", oncreate: function (vnode) { return _this.colorElement = vnode.dom; } }),
            m("div", { className: "previews", oninit: function (vnode) { return _this.previewVnode = vnode; } },
                m("canvas", { className: "original", oncreate: function (vnode) { return _this.buildCanvas(vnode.dom); }, onupdate: function (vnode) { return _this.buildCanvas(vnode.dom); } }),
                m("img", { className: "modified pixelated", src: this.modifiedSrc })),
            m("div", { className: "options" },
                m(Slider_1.default, { label: "threshold", min: 0, max: 255, step: 1, value: this.margin, oninput: eventaggregator_1.debounce(function (value, event) {
                        _this.margin = parseInt(value, 10);
                        _this.modified = true;
                        _this.modifyImage().then(function (modified) {
                            _this.modifiedSrc = modified;
                            m.redraw();
                        });
                    }, 250) })),
            m("div", { className: "navigation" },
                m("button", { onclick: function (event) {
                        if (!_this.modifiedSrc) {
                            object_1.exec(v.attrs.onclose, event);
                            return;
                        }
                        if (_this.modified) {
                            _this.modified = false;
                            _this.changes.push({ color: _this.pickedColor, margin: _this.margin });
                        }
                        _this.applyModifications(v.attrs.src).then(function (modified) {
                            object_1.exec(v.attrs.onsubmit, modified, event);
                            object_1.exec(v.attrs.onclose, event);
                        });
                    } }, "save"),
                m("button", { onclick: function (event) {
                        event.redraw = false;
                        _this.modified = false;
                        if (!_this.modifiedSrc) {
                            return;
                        }
                        _this.src = _this.modifiedSrc;
                        _this.changes.push({ color: _this.pickedColor, margin: _this.margin });
                        _this.buildCanvas();
                    } }, "update"),
                m("button", { onclick: function (event) {
                        object_1.exec(v.attrs.onclose, event);
                    } }, "close")));
    };
    ImageBackgroundRemover.prototype.loadColorPicker = function (canvas) {
        var _this = this;
        image_1.colorPicker(canvas, function (r, g, b, a) {
            _this.colorElement.style.backgroundColor = a < 50 ? "white" : "rgb(" + r + "," + g + "," + b + ")";
        }, function (r, g, b, a) {
            _this.pickedColor = { r: r, g: g, b: b, a: a };
            _this.modified = true;
            _this.modifyImage().then(function (modified) {
                _this.modifiedSrc = modified;
                m.redraw();
            });
        });
    };
    ImageBackgroundRemover.prototype.modifyImage = function (src, color, margin) {
        if (src === void 0) { src = this.src; }
        if (color === void 0) { color = this.pickedColor; }
        if (margin === void 0) { margin = this.margin; }
        return __awaiter(this, void 0, void 0, function () {
            var image;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.applyModifications(src, [{ color: color, margin: margin }])];
                    case 1:
                        image = _a.sent();
                        return [2, image];
                }
            });
        });
    };
    ImageBackgroundRemover.prototype.applyModifications = function (src, modifications) {
        if (src === void 0) { src = this.src; }
        if (modifications === void 0) { modifications = this.changes; }
        return __awaiter(this, void 0, void 0, function () {
            var image;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isBusy === true) {
                            return [2, src];
                        }
                        this.isBusy = true;
                        return [4, image_1.modifyPixels(src, function (pixels, row) {
                                for (var i = 0; i < pixels.length; i += 4) {
                                    for (var mod = 0; mod < modifications.length; mod++) {
                                        var overlap = Math.abs(pixels[i] - modifications[mod].color.r) + Math.abs(pixels[i + 1] - modifications[mod].color.g) + Math.abs(pixels[i + 2] - modifications[mod].color.b);
                                        if (overlap < modifications[mod].margin) {
                                            pixels[i + 3] = 0;
                                        }
                                        else {
                                            var mapped = object_1.mapRange(overlap, [modifications[mod].margin, modifications[mod].margin * 1.5], [0, 255]);
                                            if (mapped < pixels[i + 3]) {
                                                pixels[i + 3] = mapped;
                                            }
                                        }
                                    }
                                }
                                return pixels;
                            })];
                    case 1:
                        image = _a.sent();
                        this.isBusy = false;
                        return [2, image];
                }
            });
        });
    };
    ImageBackgroundRemover.prototype.getImageDimension = function (previewRect, imageWidth, imageHeight) {
        var ratio = imageHeight / imageWidth;
        var width = previewRect.width / 2;
        return { width: width, height: width * ratio };
    };
    ImageBackgroundRemover.prototype.buildCanvas = function (canvasElement, src) {
        var _this = this;
        if (canvasElement === void 0) { canvasElement = this.canvasElement; }
        if (src === void 0) { src = this.src; }
        if (this.resizeEvent) {
            this.resizeEvent.off();
        }
        this.canvasElement = canvasElement;
        var previewRect = this.previewVnode.dom.getBoundingClientRect();
        var ctx = canvasElement.getContext("2d");
        if (!ctx) {
            throw new Error("canvas not initialized");
        }
        if (!src) {
            return;
        }
        if (this.compressed === false) {
            image_1.compress(src, 1, previewRect.width / 2, previewRect.height, "png", true).then(function (compressed) {
                _this.compressed = true;
                _this.src = compressed;
                _this.buildCanvas(canvasElement, src);
            });
            return;
        }
        var image = new Image();
        var resize = function () {
            var _a = _this.getImageDimension(_this.previewVnode.dom.getBoundingClientRect(), image.naturalWidth, image.naturalHeight), width = _a.width, height = _a.height;
            _this.canvasElement.width = width;
            _this.canvasElement.height = height;
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(image, 0, 0, width, height);
        };
        image.onload = function () {
            resize();
            _this.resizeEvent = _this.domEA.on("resize", function () { return resize(); });
            _this.loadColorPicker(_this.canvasElement);
        };
        image.src = src;
    };
    return ImageBackgroundRemover;
}());
exports.default = ImageBackgroundRemover;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(47);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/postcss-loader/lib/index.js!../../../../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/postcss-loader/lib/index.js!../../../../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".component--Dialog .dialog {\n  position: fixed;\n  top: 10vh;\n  left: 10vw;\n  width: 80vw;\n  height: 80vh;\n  display: none;\n  z-index: 999;\n  background-color: white;\n  -webkit-box-shadow: 0 7px 20px -5px black;\n          box-shadow: 0 7px 20px -5px black; }\n\n.component--Dialog .container {\n  background-color: rgba(0, 0, 0, 0.5);\n  content: \"\";\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  z-index: 99;\n  display: none; }\n\n.component--Dialog.open .dialog,\n.component--Dialog.open .container {\n  display: block; }\n", ""]);

// exports


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(49);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/postcss-loader/lib/index.js!../../../../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/postcss-loader/lib/index.js!../../../../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".component--ImageBackgroundRemover .dialog {\n  background-position: 0px 0px, 10px 10px;\n  background-size: 20px 20px;\n  background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%), linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%);\n  overflow-y: auto !important; }\n\n.component--ImageBackgroundRemover .color {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 40px;\n  -webkit-box-shadow: inset 0 -5px 5px -3px black;\n          box-shadow: inset 0 -5px 5px -3px black;\n  background-color: white; }\n\n.component--ImageBackgroundRemover .previews {\n  position: absolute;\n  left: 0;\n  top: 40px;\n  width: 100%;\n  height: calc(100% - 40px); }\n  .component--ImageBackgroundRemover .previews .modified {\n    position: absolute;\n    right: 0;\n    top: 0;\n    width: 50%; }\n\n.component--ImageBackgroundRemover .navigation {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 999;\n  background-color: white; }\n\n.component--ImageBackgroundRemover .options {\n  position: absolute;\n  top: 0;\n  right: 0;\n  z-index: 999;\n  background-color: white; }\n\n.component--ImageBackgroundRemover button {\n  min-width: 30px;\n  min-height: 30px;\n  border: none;\n  line-height: 20px;\n  padding: 5px;\n  background-color: rgba(255, 255, 255, 0.6);\n  cursor: pointer;\n  border: 1px solid black;\n  color: black; }\n\n.component--ImageBackgroundRemover button + button {\n  margin-left: 5px; }\n", ""]);

// exports


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var eventaggregator_1 = __webpack_require__(8);
var m = __webpack_require__(0);
var dom_1 = __webpack_require__(4);
var helpers_1 = __webpack_require__(6);
var image_1 = __webpack_require__(9);
var logger_1 = __webpack_require__(10);
var object_1 = __webpack_require__(1);
var Dialog_1 = __webpack_require__(22);
var Area_1 = __webpack_require__(17);
var Item_1 = __webpack_require__(13);
var Slider_1 = __webpack_require__(23);
var controller_1 = __webpack_require__(55);
__webpack_require__(56);
var ImageEditor = (function () {
    function ImageEditor() {
        this.initialized = false;
        this.scale = 1;
        this.rotateValue = 0;
        this.zoomLevel = 0;
    }
    ImageEditor.prototype.oninit = function (v) {
        this.domEA = eventaggregator_1.default.getInstance("dom");
        this.targetDimension = { width: v.attrs.position.width, height: v.attrs.position.height };
    };
    ImageEditor.prototype.oncreate = function (v) {
        var _this = this;
        this.resizeEvent = this.domEA.on("resize", function (event) {
            _this.updateScale();
            _this.updateImagePosition();
        });
        this.scrollEvent = this.domEA.on("scroll", function (event) {
            if (event.deltaY > 0) {
                _this.zoom(-1);
            }
            else if (event.deltaY < 0) {
                _this.zoom(1);
            }
        });
        this.initialize();
    };
    ImageEditor.prototype.onbeforeremove = function (v) {
        this.resizeEvent.off();
        this.scrollEvent.off();
    };
    ImageEditor.prototype.view = function (v) {
        var _this = this;
        var scaledAreaDimension = helpers_1.setScale(this.targetDimension, this.scale);
        return m(Dialog_1.default, { className: "component--ImageEditor open" },
            m("div", { className: "area", oninit: function (vnode) { return _this.containerVnode = vnode; } },
                m(Area_1.default, { type: "rotater" },
                    m(Item_1.default, { type: "rotater", oninit: function (vnode) { return _this.itemVnode = vnode; }, preventResize: true, onitemmove: function () { return _this.updateImagePosition(); } },
                        m("img", { className: "back", src: v.attrs.src, oninit: function (vnode) { return _this.backImageVnode = vnode; } }))),
                m("div", { className: "image-area", style: dom_1.getRectStyle(scaledAreaDimension), oninit: function (vnode) { return _this.imageAreaVnode = vnode; } },
                    m("img", { className: "front", src: v.attrs.src, oninit: function (vnode) { return _this.frontImageVnode = vnode; } }))),
            m("div", { className: "options" },
                m("button", { onclick: function (event) { return _this.zoom(1); } }, "zoom in"),
                m("button", { onclick: function (event) { return _this.zoom(-1); } }, "zoom out"),
                m(Slider_1.default, { label: "rotate", min: 0, max: 360, step: 1, value: 0, oninput: function (value, event) {
                        _this.rotateValue = value;
                        _this.updateImagePosition();
                    } })),
            m("div", { className: "navigation" },
                m("button", { onclick: function (event) { return _this.crop(scaledAreaDimension, _this.imagePosition, v.attrs.src, v.attrs.onsubmit, event).then(function () { return v.attrs.onclose(event); }); } }, "save"),
                m("button", { onclick: function (event) { return object_1.exec(v.attrs.onclose, event); } }, "close")));
    };
    ImageEditor.prototype.initialize = function () {
        var _this = this;
        if (this.initialized === true) {
            return;
        }
        setTimeout(function () {
            try {
                _this.updateScale();
                var containerRect = _this.containerVnode.dom.getBoundingClientRect();
                var areaRect = _this.imageAreaVnode.dom.getBoundingClientRect();
                var itemRect = _this.itemVnode.state.getBoundingClientRect();
                _this.updateDragItemPosition(controller_1.getScaledItemRect(containerRect, areaRect, itemRect));
                _this.updateImagePosition();
                _this.initialized = true;
            }
            catch (err) {
                logger_1.default(err);
                _this.initialize();
            }
        }, 25);
    };
    ImageEditor.prototype.updateScale = function () {
        var containerRect = this.containerVnode.dom.getBoundingClientRect();
        this.scale = controller_1.getAreaScale(this.targetDimension, containerRect);
        m.redraw();
    };
    ImageEditor.prototype.updateDragItemPosition = function (position) {
        this.itemVnode.state.updatePosition(position);
    };
    ImageEditor.prototype.updateImagePosition = function () {
        var areaRect = this.imageAreaVnode.dom.getBoundingClientRect();
        var itemRect = this.itemVnode.state.getBoundingClientRect();
        this.imagePosition = controller_1.getRelativePosition(itemRect, areaRect);
        dom_1.setStyle(this.backImageVnode.dom, { transform: controller_1.getRotateStyleProp(this.rotateValue) });
        dom_1.setStyle(this.frontImageVnode.dom, __assign({ transform: controller_1.getRotateStyleProp(this.rotateValue) }, dom_1.getRectStyle(this.imagePosition)));
    };
    ImageEditor.prototype.crop = function (areaDimension, imagePosition, src, onsubmit, event) {
        return __awaiter(this, void 0, void 0, function () {
            var previewNode, modifiedSrc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        previewNode = controller_1.initializePreview();
                        m.render(previewNode, m("div", { style: controller_1.getContainerStyle(areaDimension) },
                            m("img", { src: src, style: controller_1.getImgStyle(imagePosition, this.rotateValue) })));
                        return [4, image_1.domToImage(previewNode)];
                    case 1:
                        modifiedSrc = _a.sent();
                        m.render(previewNode, null);
                        object_1.exec(onsubmit, modifiedSrc, event);
                        return [2];
                }
            });
        });
    };
    ImageEditor.prototype.zoom = function (direction) {
        if (direction > 0) {
            this.zoomLevel++;
        }
        else {
            this.zoomLevel--;
        }
        if (this.zoomLevel >= 15) {
            this.zoomLevel = 15;
            return;
        }
        if (this.zoomLevel <= -15) {
            this.zoomLevel = -15;
            return;
        }
        var containerRect = this.containerVnode.dom.getBoundingClientRect();
        var itemRect = this.itemVnode.state.getBoundingClientRect();
        this.updateDragItemPosition(controller_1.zoom(containerRect, itemRect, direction));
        this.updateImagePosition();
    };
    ImageEditor.prototype.rotate = function (amount) {
        this.rotateValue = controller_1.rotate(this.rotateValue, amount);
        this.updateImagePosition();
    };
    return ImageEditor;
}());
exports.default = ImageEditor;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(52);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/postcss-loader/lib/index.js!../../../../../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/postcss-loader/lib/index.js!../../../../../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".component--drag.drag-item {\n  position: relative;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  overflow: hidden; }\n  .component--drag.drag-item.handle {\n    cursor: move; }\n  .component--drag.drag-item > .handle {\n    position: absolute;\n    left: 0;\n    top: 0;\n    width: 6px;\n    height: 6px;\n    cursor: move;\n    z-index: 1;\n    overflow: hidden;\n    background-color: rgba(0, 0, 0, 0.4); }\n  .component--drag.drag-item.focus {\n    -webkit-box-shadow: inset 0 0 0 2px black;\n            box-shadow: inset 0 0 0 2px black; }\n  .component--drag.drag-item > .border {\n    position: absolute;\n    z-index: 1;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none; }\n    .component--drag.drag-item > .border.left {\n      left: 0;\n      top: 4px;\n      height: calc(100% - 4px - 4px);\n      width: 4px;\n      cursor: w-resize; }\n    .component--drag.drag-item > .border.right {\n      right: 0;\n      top: 4px;\n      height: calc(100% - 4px - 4px);\n      width: 4px;\n      cursor: w-resize; }\n    .component--drag.drag-item > .border.top {\n      left: 4px;\n      top: 0;\n      width: calc(100% - 4px - 4px);\n      height: 4px;\n      cursor: n-resize; }\n    .component--drag.drag-item > .border.bottom {\n      left: 4px;\n      bottom: 0;\n      width: calc(100% - 4px - 4px);\n      height: 4px;\n      cursor: n-resize; }\n    .component--drag.drag-item > .border.top-left {\n      left: 0;\n      top: 0;\n      width: 4px;\n      height: 4px;\n      cursor: se-resize; }\n    .component--drag.drag-item > .border.top-right {\n      right: 0;\n      top: 0;\n      width: 4px;\n      height: 4px;\n      cursor: ne-resize; }\n    .component--drag.drag-item > .border.bottom-right {\n      bottom: 0;\n      right: 0;\n      width: 4px;\n      height: 4px;\n      cursor: se-resize; }\n    .component--drag.drag-item > .border.bottom-left {\n      bottom: 0;\n      left: 0;\n      width: 4px;\n      height: 4px;\n      cursor: ne-resize; }\n", ""]);

// exports


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(54);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/postcss-loader/lib/index.js!../../../../../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/postcss-loader/lib/index.js!../../../../../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".component--drag.drag-area {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  overflow: hidden; }\n", ""]);

// exports


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(4);
var helpers_1 = __webpack_require__(6);
var preview;
exports.initializePreview = function () {
    if (preview !== undefined) {
        return preview;
    }
    preview = document.createElement("div");
    preview.style.position = "fixed";
    preview.style.top = "0";
    preview.style.left = "0";
    preview.style.zIndex = "-100";
    preview.style.pointerEvents = "none";
    document.body.appendChild(preview);
    return preview;
};
exports.zoomIn = function (position) {
    var diffW = position.width * .2;
    var diffH = position.height * .2;
    position.left -= diffW / 2;
    position.top -= diffH / 2;
    position.width += diffW;
    position.height += diffH;
    return position;
};
exports.zoomOut = function (position) {
    var diffW = position.width * .2;
    var diffH = position.height * .2;
    position.top += diffH / 2;
    position.left += diffW / 2;
    position.width -= diffW;
    position.height -= diffH;
    return position;
};
exports.rotate = function (rotation, amount) {
    rotation += amount;
    if (rotation > 360) {
        rotation -= 360;
    }
    else if (rotation < 0) {
        rotation += 360;
    }
    return rotation;
};
exports.zoom = function (containerRect, itemRect, direction) {
    var nextPos = direction > 0 ? exports.zoomIn(itemRect) : exports.zoomOut(itemRect);
    var relPos = exports.getRelativePosition(nextPos, containerRect);
    return relPos;
};
exports.getRelativePosition = function (fixedPosition, parentPosition) {
    var position = __assign({}, fixedPosition);
    position.left -= parentPosition.left;
    position.top -= parentPosition.top;
    return position;
};
exports.getContainerStyle = function (areaDimension) { return ({
    position: "relative",
    width: areaDimension.width + "px",
    height: areaDimension.height + "px",
    overflow: "hidden",
}); };
exports.getImgStyle = function (imagePosition, rotation) { return (__assign({ position: "absolute", objectFit: "cover", width: "100%", height: "100%" }, dom_1.getRectStyle(imagePosition), { transform: exports.getRotateStyleProp(rotation) })); };
exports.getRotateStyleProp = function (rotation) { return "rotate(" + rotation + "deg)"; };
exports.getAreaScale = function (target, containerRect) { return helpers_1.getScale(target, { width: containerRect.width * .8, height: containerRect.height * .8 }); };
exports.getScaledItemRect = function (containerRect, areaRect, itemRect) {
    var leftOffset = areaRect.left - containerRect.left;
    var topOffset = areaRect.top - containerRect.top;
    var scale = helpers_1.getScale(itemRect, areaRect, true);
    var width = itemRect.width * scale;
    var height = itemRect.height * scale;
    var left = (width > areaRect.width ? ((areaRect.width - width) / 2) : 0) + leftOffset;
    var top = (height > areaRect.height ? ((areaRect.height - height) / 2) : 0) + topOffset;
    return { top: top, left: left, width: width, height: height };
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(57);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/postcss-loader/lib/index.js!../../../../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/postcss-loader/lib/index.js!../../../../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".component--ImageEditor .dialog {\n  overflow: hidden; }\n\n.component--ImageEditor .area {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  overflow: hidden; }\n\n.component--ImageEditor .drag-item {\n  overflow: visible !important; }\n\n.component--ImageEditor .back {\n  width: 100% !important;\n  height: 100% !important;\n  -o-object-fit: cover;\n     object-fit: cover;\n  -webkit-filter: grayscale(1) opacity(0.5);\n          filter: grayscale(1) opacity(0.5); }\n\n.component--ImageEditor .front {\n  position: absolute;\n  -o-object-fit: cover;\n     object-fit: cover;\n  z-index: 999; }\n\n.component--ImageEditor .image-area {\n  position: absolute;\n  pointer-events: none;\n  background-color: rgba(0, 0, 0, 0.5);\n  overflow: hidden; }\n  .component--ImageEditor .image-area:after {\n    content: \"\";\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    left: 0;\n    top: 0;\n    display: block; }\n\n.component--ImageEditor .border {\n  background-color: black; }\n\n.component--ImageEditor .navigation {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 999;\n  background-color: white; }\n\n.component--ImageEditor .options {\n  position: absolute;\n  top: 0;\n  right: 0;\n  z-index: 999;\n  background-color: white;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex; }\n\n.component--ImageEditor button {\n  min-width: 30px;\n  min-height: 30px;\n  border: none;\n  line-height: 20px;\n  padding: 5px;\n  background-color: rgba(255, 255, 255, 0.6);\n  cursor: pointer;\n  border: 1px solid black;\n  color: black; }\n\n.component--ImageEditor button + button {\n  margin-left: 5px; }\n", ""]);

// exports


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(59);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js!../../../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js!../../../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".editor {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap; }\n  .editor .option {\n    display: inline-block;\n    margin: 0 10px; }\n    .editor .option .option-description {\n      display: block;\n      font-family: \"Segoe UI\", monospace;\n      line-height: 24px;\n      color: white;\n      margin: 0 5px 0 0; }\n  .editor button {\n    min-width: 30px;\n    min-height: 30px;\n    border: none;\n    line-height: 20px;\n    padding: 5px;\n    background-color: rgba(255, 255, 255, 0.6);\n    cursor: pointer; }\n  .editor button + button {\n    margin-left: 5px; }\n  .editor .filterOptions {\n    width: 180px; }\n    .editor .filterOptions .option, .editor .filterOptions .value {\n      position: relative;\n      overflow: hidden; }\n      .editor .filterOptions .option .image-wrapper, .editor .filterOptions .value .image-wrapper {\n        position: absolute;\n        top: 0;\n        right: 0;\n        height: 30px;\n        width: 60px;\n        overflow: hidden; }\n  .editor .colorSelectPicker {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: horizontal;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: row;\n            flex-direction: row; }\n", ""]);

// exports


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var easydeps_1 = __webpack_require__(7);
var logger_1 = __webpack_require__(10);
var EditorDrawerController = (function () {
    function EditorDrawerController() {
        var _this = this;
        this.scale = 1;
        easydeps_1.default.getInstance().invoke(function (productManager) {
            _this.manager = productManager;
        });
    }
    EditorDrawerController.prototype.refresh = function () {
        try {
            this.holder = this.manager.getHolder();
            this.layout = this.manager.getLayout();
            this.options = this.manager.getContentOptions();
            this.scale = this.manager.getPreviewScale();
        }
        catch (err) {
            logger_1.default(err);
            this.holder = undefined;
            this.layout = undefined;
        }
        return { layout: this.layout, holder: this.holder, options: this.options, scale: this.scale };
    };
    EditorDrawerController.prototype.getEditorOptions = function () {
        return {
            depth: this.layout && this.layout.fixed !== true,
            type: this.holder && this.holder.content && this.holder.content.type,
        };
    };
    EditorDrawerController.prototype.update = function (update) {
        if (!this.holder) {
            logger_1.default(new Error("Cannot update the holder. this.holder is undefined"));
            return;
        }
        update.id = this.holder.id;
        this.manager.updateHolder(update);
    };
    return EditorDrawerController;
}());
exports.default = EditorDrawerController;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(62);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js!../../../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js!../../../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".component--EditorDrawer {\n  height: auto;\n  background-color: #7fb6b8;\n  padding: 10px 20px; }\n", ""]);

// exports


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var m = __webpack_require__(0);
var index_1 = __webpack_require__(18);
var dom_1 = __webpack_require__(4);
var helpers_1 = __webpack_require__(6);
var Holder_1 = __webpack_require__(16);
var controller_1 = __webpack_require__(67);
__webpack_require__(68);
var HolderDrawer = (function () {
    function HolderDrawer() {
        this.controller = new controller_1.default();
    }
    HolderDrawer.prototype.view = function (v) {
        var _this = this;
        var holders = this.controller.refresh().holders;
        return m("div", { className: "component--HolderDrawer " + (v.attrs.className || "") },
            m("span", { className: "element-description" }, "Used Holders"),
            m(index_1.default, { className: "defaultLib", oncontainercreate: function (container) { return _this.itemsContainer = container; } }, holders.map(function (holder, index) {
                var scale = _this.itemsContainer ? helpers_1.getScale(holder.position, dom_1.getInnerRect(_this.itemsContainer)) : 1;
                holder = _this.controller.getScaledHolder(holder, scale);
                return m("div", { key: holder.id, style: dom_1.getRectStyle({ width: holder.position.width, height: holder.position.height }) },
                    m(Holder_1.default, { className: holder.selected ? "selected" : "", holder: holder, onclick: function () { return _this.controller.setCurrentHolder(holder); }, thumb: true }));
            })));
    };
    return HolderDrawer;
}());
exports.default = HolderDrawer;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var eventaggregator_1 = __webpack_require__(8);
var Controller = (function () {
    function Controller() {
        this.events = [];
        this.page = 0;
        this.interval = null;
        this.domEA = eventaggregator_1.default.getInstance("dom");
    }
    Controller.prototype.construct = function () {
        var _this = this;
        this.events.push(this.domEA.on("resize", function (event) { return _this.refreshAll(); }));
    };
    Controller.prototype.destruct = function () {
        this.events.forEach(function (event) { return event.off(); });
    };
    Controller.prototype.refresh = function () {
        var _this = this;
        setTimeout(function () { return _this.refreshAll(); });
    };
    Controller.prototype.navigate = function (direction) {
        if (this.interval !== null) {
            return;
        }
        this.refreshAll();
        if (direction > 0) {
            this.nextPage();
        }
        else {
            this.prevPage();
        }
    };
    Controller.prototype.isHorizontal = function (rect) {
        return rect.width >= rect.height;
    };
    Controller.prototype.isContainerHorizontal = function () {
        return this.isHorizontal(this.container.getBoundingClientRect());
    };
    Controller.prototype.getContainerScrollSize = function () {
        var horizontal = this.isContainerHorizontal();
        return this.container["scroll" + (horizontal ? "Width" : "Height")];
    };
    Controller.prototype.getContainerSize = function () {
        var horizontal = this.isContainerHorizontal();
        return this.container.getBoundingClientRect()[(horizontal ? "width" : "height")];
    };
    Controller.prototype.getContainerScrollStart = function () {
        var horizontal = this.isContainerHorizontal();
        return this.container["scroll" + (horizontal ? "Left" : "Top")];
    };
    Controller.prototype.setContainerScrollStart = function (start) {
        var horizontal = this.isContainerHorizontal();
        this.container["scroll" + (horizontal ? "Left" : "Top")] = start;
    };
    Controller.prototype.nextPage = function () {
        var _this = this;
        this.page++;
        var maxPage = this.getMaxPage();
        if (this.page > maxPage) {
            this.page = maxPage;
        }
        var containerSize = this.getContainerSize();
        var containerScrollSize = this.getContainerScrollSize();
        this.interval = setInterval(function () { return _this.slideToNext(containerSize, containerScrollSize); }, requestAnimationFrame);
    };
    Controller.prototype.prevPage = function () {
        var _this = this;
        this.page--;
        if (this.page < 0) {
            this.page = 0;
        }
        var containerSize = this.getContainerSize();
        this.interval = setInterval(function () { return _this.slideToPrev(containerSize); }, requestAnimationFrame);
    };
    Controller.prototype.slideToNext = function (containerSize, containerScrollSize) {
        var containerScrollStart = this.getContainerScrollStart();
        var dest = containerSize * this.page;
        if (dest >= containerScrollSize - containerSize) {
            dest = containerScrollSize - containerSize;
            dest = Math.floor(dest);
        }
        if (containerScrollStart >= dest) {
            this.finishSlide(dest);
            return true;
        }
        this.setContainerScrollStart(containerScrollStart + this.getStepSize(dest, containerScrollStart));
        return false;
    };
    Controller.prototype.slideToPrev = function (containerSize) {
        var containerScrollStart = this.getContainerScrollStart();
        var dest = containerSize * this.page;
        dest = Math.ceil(dest);
        if (dest < 0) {
            dest = 0;
        }
        if (containerScrollStart <= dest) {
            this.finishSlide(dest);
            return true;
        }
        this.setContainerScrollStart(containerScrollStart - this.getStepSize(dest, containerScrollStart));
        return false;
    };
    Controller.prototype.finishSlide = function (dest) {
        this.setContainerScrollStart(dest);
        if (this.interval !== null) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.setNextState();
        this.setPrevState();
    };
    Controller.prototype.setPrevState = function () {
        this.hasPrev() ? this.prev.classList.remove("disabled") : this.prev.classList.add("disabled");
    };
    Controller.prototype.setNextState = function () {
        this.hasNext() ? this.next.classList.remove("disabled") : this.next.classList.add("disabled");
    };
    Controller.prototype.hasPrev = function () {
        return this.page > 0;
    };
    Controller.prototype.hasNext = function () {
        return this.page + 1 < Math.ceil(parseFloat((this.getContainerScrollSize() / this.getContainerSize()).toFixed(1)));
    };
    Controller.prototype.getMaxPage = function () {
        return Math.ceil(this.getContainerScrollSize() / this.getContainerSize());
    };
    Controller.prototype.fixPosition = function () {
        var containerSize = this.getContainerSize();
        var containerScrollSize = this.getContainerScrollSize();
        var dest = containerSize * this.page;
        if (dest < 0) {
            dest = 0;
        }
        if (dest >= containerScrollSize - containerSize) {
            dest = containerScrollSize - containerSize;
        }
        this.setContainerScrollStart(dest);
    };
    Controller.prototype.getStepSize = function (dest, scrollStart) {
        var step = 1;
        if (dest > scrollStart) {
            step = (dest - scrollStart) / 10;
        }
        else {
            step = (scrollStart - dest) / 10;
        }
        return step < 1 ? 1 : step;
    };
    Controller.prototype.refreshAll = function () {
        this.fixPosition();
        this.setPrevState();
        this.setNextState();
    };
    return Controller;
}());
exports.default = Controller;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(66);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/postcss-loader/lib/index.js!../../../../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/postcss-loader/lib/index.js!../../../../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".component--library {\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  position: relative; }\n  .component--library .prev, .component--library .next {\n    cursor: pointer; }\n    .component--library .prev.disabled, .component--library .next.disabled {\n      cursor: default;\n      pointer-events: none; }\n", ""]);

// exports


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var easydeps_1 = __webpack_require__(7);
var logger_1 = __webpack_require__(10);
var HolderDrawerUsedController = (function () {
    function HolderDrawerUsedController() {
        var _this = this;
        easydeps_1.default.getInstance().invoke(function (productManager) {
            _this.manager = productManager;
        });
    }
    HolderDrawerUsedController.prototype.refresh = function () {
        try {
            this.holders = this.manager.getHolders();
        }
        catch (err) {
            this.holders = [];
            logger_1.default(err);
        }
        return { holders: this.holders };
    };
    HolderDrawerUsedController.prototype.getScaledHolder = function (holder, scale) {
        return this.manager.getScaledHolder(holder, scale);
    };
    HolderDrawerUsedController.prototype.setCurrentHolder = function (holder) {
        this.manager.setCurrentHolder(holder.id);
    };
    return HolderDrawerUsedController;
}());
exports.default = HolderDrawerUsedController;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(69);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js!../../../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js!../../../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".component--HolderDrawer {\n  height: auto;\n  background-color: #7fb6b8;\n  padding: 10px 20px; }\n  .component--HolderDrawer .holder {\n    -webkit-box-shadow: inset 0 0 0 1px black;\n            box-shadow: inset 0 0 0 1px black;\n    background-color: rgba(0, 0, 0, 0.2);\n    top: 0 !important;\n    left: 0 !important; }\n    .component--HolderDrawer .holder.selected:after {\n      -webkit-box-shadow: inset 0 0 0 2px black;\n              box-shadow: inset 0 0 0 2px black;\n      display: block;\n      content: \"\";\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      position: absolute; }\n", ""]);

// exports


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var m = __webpack_require__(0);
var index_1 = __webpack_require__(13);
var Checkbox_1 = __webpack_require__(20);
var index_2 = __webpack_require__(71);
var ImageUploadUrl_1 = __webpack_require__(72);
var index_3 = __webpack_require__(18);
var enums_1 = __webpack_require__(5);
var LocalStorage = __webpack_require__(73);
var injectTransition_1 = __webpack_require__(14);
__webpack_require__(86);
var TDragItem = injectTransition_1.default(index_1.default, { group: "ImageDrawer", delay: 100, transition: "t--slide-down-bounce" });
var ImageDrawer = (function () {
    function ImageDrawer() {
        this.persistent = false;
        this.storedImages = [];
    }
    ImageDrawer.prototype.view = function (v) {
        var _this = this;
        return m("div", { className: "component--ImageDrawer " + (v.attrs.className || "") },
            m("span", { className: "element-description" }, "Images"),
            m(index_3.default, { className: "defaultLib pixelated", oncontainercreate: function (container) { return _this.itemsContainer = container; } }, this.storedImages.map(function (image) {
                var content = { value: image.src, type: enums_1.IMAGE, thumb: image.thumb };
                return m(TDragItem, { key: image.name, data: { content: content, imageName: image.name }, keepPlaceholder: true, preventPosition: true, preventResize: true },
                    m("img", { src: image.thumb, alt: image.name }));
            })),
            m(index_2.default, { preview: false, quality: .75, multiple: true, thumb: 256, max: 1400, onupload: function (event, images) {
                    _this.setStoredImages(LocalStorage.add("images", images, _this.persistent));
                } }),
            m("div", { style: { marginTop: "5px", width: "200px" } },
                m(ImageUploadUrl_1.default, { quality: 1, thumb: 256, max: 1400, onupload: function (event, image) {
                        _this.setStoredImages(LocalStorage.add("images", [image], _this.persistent));
                    } })),
            m(Checkbox_1.default, { defaultChecked: this.persistent, label: "Save images in LocalStorage", onclick: function (checked) {
                    _this.persistent = checked;
                    if (_this.persistent) {
                        _this.setStoredImages(LocalStorage.get("images", _this.persistent));
                    }
                } }));
    };
    ImageDrawer.prototype.setStoredImages = function (storedImages) {
        if (Array.isArray(storedImages)) {
            this.storedImages = storedImages;
            m.redraw();
        }
    };
    return ImageDrawer;
}());
exports.default = ImageDrawer;


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var m = __webpack_require__(0);
var dom_1 = __webpack_require__(4);
var image_1 = __webpack_require__(9);
var logger_1 = __webpack_require__(10);
var object_1 = __webpack_require__(1);
var ImageUploadController = (function () {
    function ImageUploadController(placeholderImage) {
        this.placeholderImage = placeholderImage;
    }
    ImageUploadController.prototype.onUpload = function (event, callback, quality, max, thumbmax, preview, multiple, progress) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var maxwidth, maxheight, thumbwidth, thumbheight, progressPercentage, upload, files, _a, _b, err_1, images, _i, files_1, file, _c, _d, err_2;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        dom_1.stopEvent(event);
                        maxwidth = max ? (typeof max === "number" ? max : max[0]) : undefined;
                        maxheight = max ? (typeof max === "number" ? max : max[1]) : undefined;
                        thumbwidth = thumbmax ? (typeof thumbmax === "number" ? thumbmax : thumbmax[0]) : undefined;
                        thumbheight = thumbmax ? (typeof thumbmax === "number" ? thumbmax : thumbmax[1]) : undefined;
                        progressPercentage = 0;
                        upload = function (file, totalFiles) {
                            if (totalFiles === void 0) { totalFiles = 1; }
                            return __awaiter(_this, void 0, void 0, function () {
                                var progressPercentageFraction, name, src, thumb;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            progressPercentageFraction = 100 / totalFiles / 6;
                                            name = file.name;
                                            progressPercentage += progressPercentageFraction;
                                            object_1.exec(progress, progressPercentage);
                                            return [4, image_1.uploadImage(file, quality, maxwidth, maxheight)];
                                        case 1:
                                            src = _a.sent();
                                            progressPercentage += thumbmax ? (progressPercentageFraction * 3) : (progressPercentageFraction * 5);
                                            object_1.exec(progress, progressPercentage);
                                            if (!thumbmax) return [3, 3];
                                            progressPercentage += progressPercentageFraction * 2;
                                            object_1.exec(progress, progressPercentage);
                                            return [4, image_1.getThumb(src, .5, thumbwidth, thumbheight)];
                                        case 2:
                                            thumb = _a.sent();
                                            _a.label = 3;
                                        case 3: return [2, { name: name, src: src, thumb: thumb }];
                                    }
                                });
                            });
                        };
                        files = event.target.files;
                        if (!(multiple === false)) return [3, 5];
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        _a = object_1.exec;
                        _b = [callback];
                        return [4, upload(files[0])];
                    case 2:
                        _a.apply(void 0, _b.concat([_e.sent()]));
                        return [3, 4];
                    case 3:
                        err_1 = _e.sent();
                        logger_1.default(err_1);
                        return [3, 4];
                    case 4: return [2];
                    case 5:
                        images = [];
                        _i = 0, files_1 = files;
                        _e.label = 6;
                    case 6:
                        if (!(_i < files_1.length)) return [3, 11];
                        file = files_1[_i];
                        _e.label = 7;
                    case 7:
                        _e.trys.push([7, 9, , 10]);
                        _d = (_c = images).push;
                        return [4, upload(file, files.length)];
                    case 8:
                        _d.apply(_c, [_e.sent()]);
                        return [3, 10];
                    case 9:
                        err_2 = _e.sent();
                        logger_1.default(err_2);
                        return [3, 10];
                    case 10:
                        _i++;
                        return [3, 6];
                    case 11:
                        object_1.exec(callback, images);
                        return [2];
                }
            });
        });
    };
    return ImageUploadController;
}());
var ImageUpload = (function () {
    function ImageUpload() {
        this.progress = 0;
        this.controller = new ImageUploadController();
    }
    ImageUpload.prototype.view = function (v) {
        var _this = this;
        return m("div", { className: "component--ImageUpload" },
            m("label", null,
                m("span", null,
                    "Upload",
                    this.progress > 0 ? "ing... " + this.progress.toFixed(2) + "%" : ""),
                m("input", { type: "file", multiple: v.attrs.multiple, accept: ".jpg, .jpeg, .png", onchange: function (event) {
                        return _this.controller.onUpload(event, function (images) {
                            object_1.exec(v.attrs.onupload, event, images);
                            _this.progress = 0;
                            m.redraw();
                        }, v.attrs.quality, v.attrs.max, v.attrs.thumb, v.attrs.preview, v.attrs.multiple, function (progress) {
                            object_1.exec(v.attrs.onprogress, progress);
                            _this.progress = progress;
                            m.redraw();
                        });
                    } })),
            v.attrs.preview && this.controller.src && m("img", { src: this.controller.src, alt: "preview" }));
    };
    return ImageUpload;
}());
exports.default = ImageUpload;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var m = __webpack_require__(0);
var dom_1 = __webpack_require__(4);
var image_1 = __webpack_require__(9);
var object_1 = __webpack_require__(1);
var Input_1 = __webpack_require__(21);
var ImageUploadUrl = (function () {
    function ImageUploadUrl() {
    }
    ImageUploadUrl.prototype.view = function (v) {
        var _this = this;
        return m("div", { className: "component--ImageUploadUrl" },
            m(Input_1.default, { label: v.attrs.label, placeholder: "paste an image url", onchange: function (value, event, setValue) { return __awaiter(_this, void 0, void 0, function () {
                    var maxwidth, maxheight, thumbwidth, thumbheight, src, thumbsrc;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                dom_1.stopEvent(event);
                                setValue("");
                                maxwidth = v.attrs.max ? (typeof v.attrs.max === "number" ? v.attrs.max : v.attrs.max[0]) : undefined;
                                maxheight = v.attrs.max ? (typeof v.attrs.max === "number" ? v.attrs.max : v.attrs.max[1]) : undefined;
                                thumbwidth = v.attrs.thumb ? (typeof v.attrs.thumb === "number" ? v.attrs.thumb : v.attrs.thumb[0]) : undefined;
                                thumbheight = v.attrs.thumb ? (typeof v.attrs.thumb === "number" ? v.attrs.thumb : v.attrs.thumb[1]) : undefined;
                                if (!image_1.isBase64(value)) return [3, 2];
                                return [4, image_1.compress(value, v.attrs.quality, maxwidth, maxheight)];
                            case 1:
                                src = _a.sent();
                                return [3, 4];
                            case 2: return [4, image_1.imageUrlToB64(value, v.attrs.quality, maxwidth, maxheight)];
                            case 3:
                                src = _a.sent();
                                _a.label = 4;
                            case 4:
                                if (!v.attrs.thumb) return [3, 6];
                                return [4, image_1.getThumb(src, .5, thumbwidth, thumbheight)];
                            case 5:
                                thumbsrc = _a.sent();
                                _a.label = 6;
                            case 6:
                                object_1.exec(v.attrs.onupload, event, { src: src, name: value, thumb: thumbsrc });
                                return [2];
                        }
                    });
                }); } }));
    };
    return ImageUploadUrl;
}());
exports.default = ImageUploadUrl;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Store = __webpack_require__(74);
var cached = {};
exports.get = function (key, sync) {
    if (sync === void 0) { sync = true; }
    if (key === undefined) {
        return cached;
    }
    if (!sync) {
        return cached[key];
    }
    if (cached[key] === undefined) {
        cached[key] = Store.get(key);
    }
    return cached[key];
};
exports.add = function (key, data, sync) {
    if (sync === void 0) { sync = true; }
    exports.get(key, sync);
    if (cached[key] === undefined) {
        exports.set(key, data, sync);
    }
    else if (Array.isArray(cached[key])) {
        if (Array.isArray(data)) {
            exports.set(key, cached[key].concat(data), data, sync);
        }
        else {
            exports.set(key, cached[key].concat([data]), [data], sync);
        }
    }
    else if (typeof cached[key] === "object" && cached[key] !== null) {
        if (typeof data === "object" && data !== null) {
            exports.set(key, __assign({}, cached[key], data), data, sync);
        }
        else {
            throw new Error("Cannot add primitive data on an object, please wrap it in an object first");
        }
    }
    else {
        throw new Error("Cannot use add on a primitive data type");
    }
    return cached[key];
};
exports.set = function (key, data, addition, sync) {
    if (sync === void 0) { sync = true; }
    cached[key] = data;
    if (!sync) {
        return cached[key];
    }
    try {
        Store.set(key, data);
    }
    catch (err) {
        var clear = confirm("LocalStorage is full. Do you want te clear all previously stored images so you can store new ones?\n        All previously stored images will still be available in this session.");
        if (clear === true) {
            Store.remove(key);
            if (addition !== undefined) {
                try {
                    Store.set(key, addition);
                }
                catch (err) {
                    alert("The data is to big to add to the LocalStorage. The data will not be persistent.");
                }
            }
        }
    }
    return cached[key];
};


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var engine = __webpack_require__(75)

var storages = __webpack_require__(76)
var plugins = [__webpack_require__(83)]

module.exports = engine.createStore(storages, plugins)


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var util = __webpack_require__(12)
var slice = util.slice
var pluck = util.pluck
var each = util.each
var bind = util.bind
var create = util.create
var isList = util.isList
var isFunction = util.isFunction
var isObject = util.isObject

module.exports = {
	createStore: createStore
}

var storeAPI = {
	version: '2.0.12',
	enabled: false,
	
	// get returns the value of the given key. If that value
	// is undefined, it returns optionalDefaultValue instead.
	get: function(key, optionalDefaultValue) {
		var data = this.storage.read(this._namespacePrefix + key)
		return this._deserialize(data, optionalDefaultValue)
	},

	// set will store the given value at key and returns value.
	// Calling set with value === undefined is equivalent to calling remove.
	set: function(key, value) {
		if (value === undefined) {
			return this.remove(key)
		}
		this.storage.write(this._namespacePrefix + key, this._serialize(value))
		return value
	},

	// remove deletes the key and value stored at the given key.
	remove: function(key) {
		this.storage.remove(this._namespacePrefix + key)
	},

	// each will call the given callback once for each key-value pair
	// in this store.
	each: function(callback) {
		var self = this
		this.storage.each(function(val, namespacedKey) {
			callback.call(self, self._deserialize(val), (namespacedKey || '').replace(self._namespaceRegexp, ''))
		})
	},

	// clearAll will remove all the stored key-value pairs in this store.
	clearAll: function() {
		this.storage.clearAll()
	},

	// additional functionality that can't live in plugins
	// ---------------------------------------------------

	// hasNamespace returns true if this store instance has the given namespace.
	hasNamespace: function(namespace) {
		return (this._namespacePrefix == '__storejs_'+namespace+'_')
	},

	// createStore creates a store.js instance with the first
	// functioning storage in the list of storage candidates,
	// and applies the the given mixins to the instance.
	createStore: function() {
		return createStore.apply(this, arguments)
	},
	
	addPlugin: function(plugin) {
		this._addPlugin(plugin)
	},
	
	namespace: function(namespace) {
		return createStore(this.storage, this.plugins, namespace)
	}
}

function _warn() {
	var _console = (typeof console == 'undefined' ? null : console)
	if (!_console) { return }
	var fn = (_console.warn ? _console.warn : _console.log)
	fn.apply(_console, arguments)
}

function createStore(storages, plugins, namespace) {
	if (!namespace) {
		namespace = ''
	}
	if (storages && !isList(storages)) {
		storages = [storages]
	}
	if (plugins && !isList(plugins)) {
		plugins = [plugins]
	}

	var namespacePrefix = (namespace ? '__storejs_'+namespace+'_' : '')
	var namespaceRegexp = (namespace ? new RegExp('^'+namespacePrefix) : null)
	var legalNamespaces = /^[a-zA-Z0-9_\-]*$/ // alpha-numeric + underscore and dash
	if (!legalNamespaces.test(namespace)) {
		throw new Error('store.js namespaces can only have alphanumerics + underscores and dashes')
	}
	
	var _privateStoreProps = {
		_namespacePrefix: namespacePrefix,
		_namespaceRegexp: namespaceRegexp,

		_testStorage: function(storage) {
			try {
				var testStr = '__storejs__test__'
				storage.write(testStr, testStr)
				var ok = (storage.read(testStr) === testStr)
				storage.remove(testStr)
				return ok
			} catch(e) {
				return false
			}
		},

		_assignPluginFnProp: function(pluginFnProp, propName) {
			var oldFn = this[propName]
			this[propName] = function pluginFn() {
				var args = slice(arguments, 0)
				var self = this

				// super_fn calls the old function which was overwritten by
				// this mixin.
				function super_fn() {
					if (!oldFn) { return }
					each(arguments, function(arg, i) {
						args[i] = arg
					})
					return oldFn.apply(self, args)
				}

				// Give mixing function access to super_fn by prefixing all mixin function
				// arguments with super_fn.
				var newFnArgs = [super_fn].concat(args)

				return pluginFnProp.apply(self, newFnArgs)
			}
		},

		_serialize: function(obj) {
			return JSON.stringify(obj)
		},

		_deserialize: function(strVal, defaultVal) {
			if (!strVal) { return defaultVal }
			// It is possible that a raw string value has been previously stored
			// in a storage without using store.js, meaning it will be a raw
			// string value instead of a JSON serialized string. By defaulting
			// to the raw string value in case of a JSON parse error, we allow
			// for past stored values to be forwards-compatible with store.js
			var val = ''
			try { val = JSON.parse(strVal) }
			catch(e) { val = strVal }

			return (val !== undefined ? val : defaultVal)
		},
		
		_addStorage: function(storage) {
			if (this.enabled) { return }
			if (this._testStorage(storage)) {
				this.storage = storage
				this.enabled = true
			}
		},

		_addPlugin: function(plugin) {
			var self = this

			// If the plugin is an array, then add all plugins in the array.
			// This allows for a plugin to depend on other plugins.
			if (isList(plugin)) {
				each(plugin, function(plugin) {
					self._addPlugin(plugin)
				})
				return
			}

			// Keep track of all plugins we've seen so far, so that we
			// don't add any of them twice.
			var seenPlugin = pluck(this.plugins, function(seenPlugin) {
				return (plugin === seenPlugin)
			})
			if (seenPlugin) {
				return
			}
			this.plugins.push(plugin)

			// Check that the plugin is properly formed
			if (!isFunction(plugin)) {
				throw new Error('Plugins must be function values that return objects')
			}

			var pluginProperties = plugin.call(this)
			if (!isObject(pluginProperties)) {
				throw new Error('Plugins must return an object of function properties')
			}

			// Add the plugin function properties to this store instance.
			each(pluginProperties, function(pluginFnProp, propName) {
				if (!isFunction(pluginFnProp)) {
					throw new Error('Bad plugin property: '+propName+' from plugin '+plugin.name+'. Plugins should only return functions.')
				}
				self._assignPluginFnProp(pluginFnProp, propName)
			})
		},
		
		// Put deprecated properties in the private API, so as to not expose it to accidential
		// discovery through inspection of the store object.
		
		// Deprecated: addStorage
		addStorage: function(storage) {
			_warn('store.addStorage(storage) is deprecated. Use createStore([storages])')
			this._addStorage(storage)
		}
	}

	var store = create(_privateStoreProps, storeAPI, {
		plugins: []
	})
	store.raw = {}
	each(store, function(prop, propName) {
		if (isFunction(prop)) {
			store.raw[propName] = bind(store, prop)			
		}
	})
	each(storages, function(storage) {
		store._addStorage(storage)
	})
	each(plugins, function(plugin) {
		store._addPlugin(plugin)
	})
	return store
}


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = [
	// Listed in order of usage preference
	__webpack_require__(77),
	__webpack_require__(78),
	__webpack_require__(79),
	__webpack_require__(80),
	__webpack_require__(81),
	__webpack_require__(82)
]


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

var util = __webpack_require__(12)
var Global = util.Global

module.exports = {
	name: 'localStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

function localStorage() {
	return Global.localStorage
}

function read(key) {
	return localStorage().getItem(key)
}

function write(key, data) {
	return localStorage().setItem(key, data)
}

function each(fn) {
	for (var i = localStorage().length - 1; i >= 0; i--) {
		var key = localStorage().key(i)
		fn(read(key), key)
	}
}

function remove(key) {
	return localStorage().removeItem(key)
}

function clearAll() {
	return localStorage().clear()
}


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

// oldFF-globalStorage provides storage for Firefox
// versions 6 and 7, where no localStorage, etc
// is available.

var util = __webpack_require__(12)
var Global = util.Global

module.exports = {
	name: 'oldFF-globalStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var globalStorage = Global.globalStorage

function read(key) {
	return globalStorage[key]
}

function write(key, data) {
	globalStorage[key] = data
}

function each(fn) {
	for (var i = globalStorage.length - 1; i >= 0; i--) {
		var key = globalStorage.key(i)
		fn(globalStorage[key], key)
	}
}

function remove(key) {
	return globalStorage.removeItem(key)
}

function clearAll() {
	each(function(key, _) {
		delete globalStorage[key]
	})
}


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

// oldIE-userDataStorage provides storage for Internet Explorer
// versions 6 and 7, where no localStorage, sessionStorage, etc
// is available.

var util = __webpack_require__(12)
var Global = util.Global

module.exports = {
	name: 'oldIE-userDataStorage',
	write: write,
	read: read,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var storageName = 'storejs'
var doc = Global.document
var _withStorageEl = _makeIEStorageElFunction()
var disable = (Global.navigator ? Global.navigator.userAgent : '').match(/ (MSIE 8|MSIE 9|MSIE 10)\./) // MSIE 9.x, MSIE 10.x

function write(unfixedKey, data) {
	if (disable) { return }
	var fixedKey = fixKey(unfixedKey)
	_withStorageEl(function(storageEl) {
		storageEl.setAttribute(fixedKey, data)
		storageEl.save(storageName)
	})
}

function read(unfixedKey) {
	if (disable) { return }
	var fixedKey = fixKey(unfixedKey)
	var res = null
	_withStorageEl(function(storageEl) {
		res = storageEl.getAttribute(fixedKey)
	})
	return res
}

function each(callback) {
	_withStorageEl(function(storageEl) {
		var attributes = storageEl.XMLDocument.documentElement.attributes
		for (var i=attributes.length-1; i>=0; i--) {
			var attr = attributes[i]
			callback(storageEl.getAttribute(attr.name), attr.name)
		}
	})
}

function remove(unfixedKey) {
	var fixedKey = fixKey(unfixedKey)
	_withStorageEl(function(storageEl) {
		storageEl.removeAttribute(fixedKey)
		storageEl.save(storageName)
	})
}

function clearAll() {
	_withStorageEl(function(storageEl) {
		var attributes = storageEl.XMLDocument.documentElement.attributes
		storageEl.load(storageName)
		for (var i=attributes.length-1; i>=0; i--) {
			storageEl.removeAttribute(attributes[i].name)
		}
		storageEl.save(storageName)
	})
}

// Helpers
//////////

// In IE7, keys cannot start with a digit or contain certain chars.
// See https://github.com/marcuswestin/store.js/issues/40
// See https://github.com/marcuswestin/store.js/issues/83
var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
function fixKey(key) {
	return key.replace(/^\d/, '___$&').replace(forbiddenCharsRegex, '___')
}

function _makeIEStorageElFunction() {
	if (!doc || !doc.documentElement || !doc.documentElement.addBehavior) {
		return null
	}
	var scriptTag = 'script',
		storageOwner,
		storageContainer,
		storageEl

	// Since #userData storage applies only to specific paths, we need to
	// somehow link our data to a specific path.  We choose /favicon.ico
	// as a pretty safe option, since all browsers already make a request to
	// this URL anyway and being a 404 will not hurt us here.  We wrap an
	// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
	// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
	// since the iframe access rules appear to allow direct access and
	// manipulation of the document element, even for a 404 page.  This
	// document can be used instead of the current document (which would
	// have been limited to the current path) to perform #userData storage.
	try {
		/* global ActiveXObject */
		storageContainer = new ActiveXObject('htmlfile')
		storageContainer.open()
		storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>')
		storageContainer.close()
		storageOwner = storageContainer.w.frames[0].document
		storageEl = storageOwner.createElement('div')
	} catch(e) {
		// somehow ActiveXObject instantiation failed (perhaps some special
		// security settings or otherwse), fall back to per-path storage
		storageEl = doc.createElement('div')
		storageOwner = doc.body
	}

	return function(storeFunction) {
		var args = [].slice.call(arguments, 0)
		args.unshift(storageEl)
		// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
		// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
		storageOwner.appendChild(storageEl)
		storageEl.addBehavior('#default#userData')
		storageEl.load(storageName)
		storeFunction.apply(this, args)
		storageOwner.removeChild(storageEl)
		return
	}
}


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

// cookieStorage is useful Safari private browser mode, where localStorage
// doesn't work but cookies do. This implementation is adopted from
// https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage

var util = __webpack_require__(12)
var Global = util.Global
var trim = util.trim

module.exports = {
	name: 'cookieStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var doc = Global.document

function read(key) {
	if (!key || !_has(key)) { return null }
	var regexpStr = "(?:^|.*;\\s*)" +
		escape(key).replace(/[\-\.\+\*]/g, "\\$&") +
		"\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"
	return unescape(doc.cookie.replace(new RegExp(regexpStr), "$1"))
}

function each(callback) {
	var cookies = doc.cookie.split(/; ?/g)
	for (var i = cookies.length - 1; i >= 0; i--) {
		if (!trim(cookies[i])) {
			continue
		}
		var kvp = cookies[i].split('=')
		var key = unescape(kvp[0])
		var val = unescape(kvp[1])
		callback(val, key)
	}
}

function write(key, data) {
	if(!key) { return }
	doc.cookie = escape(key) + "=" + escape(data) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/"
}

function remove(key) {
	if (!key || !_has(key)) {
		return
	}
	doc.cookie = escape(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"
}

function clearAll() {
	each(function(_, key) {
		remove(key)
	})
}

function _has(key) {
	return (new RegExp("(?:^|;\\s*)" + escape(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(doc.cookie)
}


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var util = __webpack_require__(12)
var Global = util.Global

module.exports = {
	name: 'sessionStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll
}

function sessionStorage() {
	return Global.sessionStorage
}

function read(key) {
	return sessionStorage().getItem(key)
}

function write(key, data) {
	return sessionStorage().setItem(key, data)
}

function each(fn) {
	for (var i = sessionStorage().length - 1; i >= 0; i--) {
		var key = sessionStorage().key(i)
		fn(read(key), key)
	}
}

function remove(key) {
	return sessionStorage().removeItem(key)
}

function clearAll() {
	return sessionStorage().clear()
}


/***/ }),
/* 82 */
/***/ (function(module, exports) {

// memoryStorage is a useful last fallback to ensure that the store
// is functions (meaning store.get(), store.set(), etc will all function).
// However, stored values will not persist when the browser navigates to
// a new page or reloads the current page.

module.exports = {
	name: 'memoryStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var memoryStorage = {}

function read(key) {
	return memoryStorage[key]
}

function write(key, data) {
	memoryStorage[key] = data
}

function each(callback) {
	for (var key in memoryStorage) {
		if (memoryStorage.hasOwnProperty(key)) {
			callback(memoryStorage[key], key)
		}
	}
}

function remove(key) {
	delete memoryStorage[key]
}

function clearAll(key) {
	memoryStorage = {}
}


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = json2Plugin

function json2Plugin() {
	__webpack_require__(84)
	return {}
}


/***/ }),
/* 84 */
/***/ (function(module, exports) {

/* eslint-disable */

//  json2.js
//  2016-10-28
//  Public Domain.
//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
//  See http://www.JSON.org/js.html
//  This code should be minified before deployment.
//  See http://javascript.crockford.com/jsmin.html

//  USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
//  NOT CONTROL.

//  This file creates a global JSON object containing two methods: stringify
//  and parse. This file provides the ES5 JSON capability to ES3 systems.
//  If a project might run on IE8 or earlier, then this file should be included.
//  This file does nothing on ES5 systems.

//      JSON.stringify(value, replacer, space)
//          value       any JavaScript value, usually an object or array.
//          replacer    an optional parameter that determines how object
//                      values are stringified for objects. It can be a
//                      function or an array of strings.
//          space       an optional parameter that specifies the indentation
//                      of nested structures. If it is omitted, the text will
//                      be packed without extra whitespace. If it is a number,
//                      it will specify the number of spaces to indent at each
//                      level. If it is a string (such as "\t" or "&nbsp;"),
//                      it contains the characters used to indent at each level.
//          This method produces a JSON text from a JavaScript value.
//          When an object value is found, if the object contains a toJSON
//          method, its toJSON method will be called and the result will be
//          stringified. A toJSON method does not serialize: it returns the
//          value represented by the name/value pair that should be serialized,
//          or undefined if nothing should be serialized. The toJSON method
//          will be passed the key associated with the value, and this will be
//          bound to the value.

//          For example, this would serialize Dates as ISO strings.

//              Date.prototype.toJSON = function (key) {
//                  function f(n) {
//                      // Format integers to have at least two digits.
//                      return (n < 10)
//                          ? "0" + n
//                          : n;
//                  }
//                  return this.getUTCFullYear()   + "-" +
//                       f(this.getUTCMonth() + 1) + "-" +
//                       f(this.getUTCDate())      + "T" +
//                       f(this.getUTCHours())     + ":" +
//                       f(this.getUTCMinutes())   + ":" +
//                       f(this.getUTCSeconds())   + "Z";
//              };

//          You can provide an optional replacer method. It will be passed the
//          key and value of each member, with this bound to the containing
//          object. The value that is returned from your method will be
//          serialized. If your method returns undefined, then the member will
//          be excluded from the serialization.

//          If the replacer parameter is an array of strings, then it will be
//          used to select the members to be serialized. It filters the results
//          such that only members with keys listed in the replacer array are
//          stringified.

//          Values that do not have JSON representations, such as undefined or
//          functions, will not be serialized. Such values in objects will be
//          dropped; in arrays they will be replaced with null. You can use
//          a replacer function to replace those with JSON values.

//          JSON.stringify(undefined) returns undefined.

//          The optional space parameter produces a stringification of the
//          value that is filled with line breaks and indentation to make it
//          easier to read.

//          If the space parameter is a non-empty string, then that string will
//          be used for indentation. If the space parameter is a number, then
//          the indentation will be that many spaces.

//          Example:

//          text = JSON.stringify(["e", {pluribus: "unum"}]);
//          // text is '["e",{"pluribus":"unum"}]'

//          text = JSON.stringify(["e", {pluribus: "unum"}], null, "\t");
//          // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

//          text = JSON.stringify([new Date()], function (key, value) {
//              return this[key] instanceof Date
//                  ? "Date(" + this[key] + ")"
//                  : value;
//          });
//          // text is '["Date(---current time---)"]'

//      JSON.parse(text, reviver)
//          This method parses a JSON text to produce an object or array.
//          It can throw a SyntaxError exception.

//          The optional reviver parameter is a function that can filter and
//          transform the results. It receives each of the keys and values,
//          and its return value is used instead of the original value.
//          If it returns what it received, then the structure is not modified.
//          If it returns undefined then the member is deleted.

//          Example:

//          // Parse the text. Values that look like ISO date strings will
//          // be converted to Date objects.

//          myData = JSON.parse(text, function (key, value) {
//              var a;
//              if (typeof value === "string") {
//                  a =
//   /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
//                  if (a) {
//                      return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
//                          +a[5], +a[6]));
//                  }
//              }
//              return value;
//          });

//          myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
//              var d;
//              if (typeof value === "string" &&
//                      value.slice(0, 5) === "Date(" &&
//                      value.slice(-1) === ")") {
//                  d = new Date(value.slice(5, -1));
//                  if (d) {
//                      return d;
//                  }
//              }
//              return value;
//          });

//  This is a reference implementation. You are free to copy, modify, or
//  redistribute.

/*jslint
    eval, for, this
*/

/*property
    JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== "object") {
    JSON = {};
}

(function () {
    "use strict";

    var rx_one = /^[\],:{}\s]*$/;
    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
    var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10
            ? "0" + n
            : n;
    }

    function this_value() {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== "function") {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear() + "-" +
                        f(this.getUTCMonth() + 1) + "-" +
                        f(this.getUTCDate()) + "T" +
                        f(this.getUTCHours()) + ":" +
                        f(this.getUTCMinutes()) + ":" +
                        f(this.getUTCSeconds()) + "Z"
                : null;
        };

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap;
    var indent;
    var meta;
    var rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string)
            ? "\"" + string.replace(rx_escapable, function (a) {
                var c = meta[a];
                return typeof c === "string"
                    ? c
                    : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + "\""
            : "\"" + string + "\"";
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i;          // The loop counter.
        var k;          // The member key.
        var v;          // The member value.
        var length;
        var mind = gap;
        var partial;
        var value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === "object" &&
                typeof value.toJSON === "function") {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case "string":
            return quote(value);

        case "number":

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value)
                ? String(value)
                : "null";

        case "boolean":
        case "null":

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce "null". The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is "object", we might be dealing with an object or an array or
// null.

        case "object":

// Due to a specification blunder in ECMAScript, typeof null is "object",
// so watch out for that case.

            if (!value) {
                return "null";
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === "[object Array]") {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || "null";
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? "[]"
                    : gap
                        ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]"
                        : "[" + partial.join(",") + "]";
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === "object") {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === "string") {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                gap
                                    ? ": "
                                    : ":"
                            ) + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                gap
                                    ? ": "
                                    : ":"
                            ) + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? "{}"
                : gap
                    ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
                    : "{" + partial.join(",") + "}";
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== "function") {
        meta = {    // table of character substitutions
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = "";
            indent = "";

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === "string") {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== "function" &&
                    (typeof replacer !== "object" ||
                    typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify");
            }

// Make a fake root object containing our value under the key of "".
// Return the result of stringifying the value.

            return str("", {"": value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== "function") {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k;
                var v;
                var value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function (a) {
                    return "\\u" +
                            ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with "()" and "new"
// because they can cause invocation, and "=" because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
// replace all simple value tokens with "]" characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or "]" or
// "," or ":" or "{" or "}". If that is so, then the text is safe for eval.

            if (
                rx_one.test(
                    text
                        .replace(rx_two, "@")
                        .replace(rx_three, "]")
                        .replace(rx_four, "")
                )
            ) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The "{" operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval("(" + text + ")");

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return (typeof reviver === "function")
                    ? walk({"": j}, "")
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError("JSON.parse");
        };
    }
}());

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.injectMethod = function (object, key, method) {
    var tmp = object[key];
    object[key] = function (v) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var original = function () {
            var oargs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                oargs[_i] = arguments[_i];
            }
            if (typeof tmp === "function") {
                return tmp.call.apply(tmp, [v.state].concat(oargs));
            }
        };
        return method.call.apply(method, [v.state, original, v].concat(args));
    };
};
exports.injectPrototype = function (component, data) {
    if (typeof component !== "function") {
        throw new Error("Component must be a function");
    }
    if (component.prototype.injected === true) {
        return;
    }
    component.prototype.injected = true;
    for (var key in data) {
        if (typeof data[key] === "function") {
            exports.injectMethod(component.prototype, key, data[key]);
        }
    }
    return component;
};
exports.injectInstance = function (instance, data) {
    if (typeof instance !== "object" || instance === null) {
        throw new Error("Instance must be a object");
    }
    if (instance.injected === true) {
        return;
    }
    instance.injected = true;
    for (var key in data) {
        if (typeof data[key] === "function") {
            exports.injectMethod(instance, key, data[key]);
        }
    }
    return instance;
};
exports.injectClass = function (parentClass, data) {
    var newClass = function () {
        var _loop_1 = function (key) {
            if (typeof data[key] === "function") {
                var tmp_1 = this_1[key];
                this_1[key] = function (v) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    var original = function () {
                        var oargs = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            oargs[_i] = arguments[_i];
                        }
                        if (typeof tmp_1 === "function") {
                            return tmp_1.call.apply(tmp_1, [v.state].concat(oargs));
                        }
                    };
                    return (_a = data[key]).call.apply(_a, [v.state, original, v].concat(args));
                    var _a;
                };
            }
        };
        var this_1 = this;
        for (var key in data) {
            _loop_1(key);
        }
    };
    newClass.prototype = new parentClass();
    return newClass;
};
exports.default = exports.injectInstance;


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(87);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js!../../../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js!../../../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".component--ImageDrawer {\n  height: auto;\n  background-color: #7fb6b8;\n  padding: 10px 20px; }\n  .component--ImageDrawer input[type=file] {\n    display: none; }\n  .component--ImageDrawer label > span {\n    padding: 5px;\n    cursor: pointer;\n    background-color: #cce2e3;\n    margin: 5px 0;\n    display: inline-block;\n    float: right; }\n", ""]);

// exports


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var m = __webpack_require__(0);
var index_1 = __webpack_require__(18);
var injectTransition_1 = __webpack_require__(14);
var Layout_1 = __webpack_require__(89);
var controller_1 = __webpack_require__(92);
__webpack_require__(93);
var TLayout = injectTransition_1.default(Layout_1.default, { group: "LayoutDrawer", delay: 100, transition: "t--slide-down-bounce" });
var LayoutDrawer = (function () {
    function LayoutDrawer() {
        this.controller = new controller_1.default();
    }
    LayoutDrawer.prototype.view = function (v) {
        var _this = this;
        var layouts = this.controller.refresh().layouts;
        return m("div", { className: "component--LayoutDrawer " + (v.attrs.className || "") },
            m("span", { className: "element-description" }, "Layouts"),
            m(index_1.default, { className: "defaultLib" }, layouts.map(function (layout, index) {
                return m(TLayout, { key: layout.id, position: layout.position, holders: layout.holders, selected: layout.selected, onclick: function () { return _this.controller.setCurrentLayout(layout.id); } });
            })));
    };
    return LayoutDrawer;
}());
exports.default = LayoutDrawer;


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var m = __webpack_require__(0);
var dom_1 = __webpack_require__(4);
var helpers_1 = __webpack_require__(6);
var object_1 = __webpack_require__(1);
var iconText = __webpack_require__(24);
var iconImage = __webpack_require__(25);
var iconShape = __webpack_require__(26);
var index_1 = __webpack_require__(5);
__webpack_require__(90);
var getPlaceholderContentIcon = function (holder) {
    var icons = [];
    if (holder.type.indexOf(index_1.IMAGE) !== -1) {
        icons.push(m("div", null,
            m("img", { src: iconImage, alt: "icon-image" })));
    }
    if (holder.type.indexOf(index_1.TEXT) !== -1) {
        icons.push(m("div", null,
            m("img", { src: iconText, alt: "icon-text" })));
    }
    if (holder.type.indexOf(index_1.SHAPE) !== -1) {
        icons.push(m("div", null,
            m("img", { src: iconShape, alt: "icon-shape" })));
    }
    return m("div", null, icons);
};
var Layout = (function () {
    function Layout() {
    }
    Layout.prototype.view = function (vnode) {
        return m("div", { className: object_1.cleanString("component--LibraryItemLayout", vnode.attrs.selected && "selected"), onclick: function (event) { return dom_1.stopEvent(event) && object_1.exec(vnode.attrs.onclick, event); } }, vnode.attrs.holders && vnode.attrs.holders.map(function (h) {
            return m("div", { className: "holder" }, getPlaceholderContentIcon(h));
        }));
    };
    Layout.prototype.oncreate = function (vnode) {
        this.updateScale(vnode.dom, vnode.attrs.position, vnode.attrs.holders);
    };
    Layout.prototype.onupdate = function (vnode) {
        this.updateScale(vnode.dom, vnode.attrs.position, vnode.attrs.holders);
    };
    Layout.prototype.updateScale = function (dom, position, holders) {
        var scale = dom_1.getScaleFromFirstContainer(dom, "items", position);
        var scaled = helpers_1.setScale(position, scale);
        var _a = dom_1.getRectStyle(scaled), width = _a.width, height = _a.height;
        dom_1.setStyle(dom, { width: width, height: height });
        var children = Array.from(dom.children);
        children.forEach(function (child, i) { return dom_1.setStyle(child, dom_1.getRectStyle(helpers_1.setScale(holders[i].position, scale))); });
    };
    return Layout;
}());
exports.default = Layout;


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(91);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js!../../../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js!../../../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".component--LibraryItemLayout {\n  background-color: white;\n  position: relative; }\n  .component--LibraryItemLayout .holder {\n    position: absolute;\n    background-color: rgba(0, 0, 0, 0.2);\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: horizontal;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: row;\n            flex-direction: row;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center; }\n    .component--LibraryItemLayout .holder > .type-image {\n      max-height: 80%;\n      max-width: 80%; }\n      .component--LibraryItemLayout .holder > .type-image + .type-image {\n        margin-left: 10%; }\n    .component--LibraryItemLayout .holder > div {\n      display: -webkit-box;\n      display: -ms-flexbox;\n      display: flex;\n      -webkit-box-orient: horizontal;\n      -webkit-box-direction: normal;\n          -ms-flex-direction: row;\n              flex-direction: row;\n      height: 100%; }\n      .component--LibraryItemLayout .holder > div > div {\n        -webkit-box-align: center;\n            -ms-flex-align: center;\n                align-items: center;\n        -webkit-box-pack: center;\n            -ms-flex-pack: center;\n                justify-content: center; }\n        .component--LibraryItemLayout .holder > div > div > img {\n          max-height: 100%;\n          max-width: 100%;\n          height: auto !important; }\n", ""]);

// exports


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var easydeps_1 = __webpack_require__(7);
var logger_1 = __webpack_require__(10);
var LayoutDrawerController = (function () {
    function LayoutDrawerController() {
        this.manager = easydeps_1.default.getInstance().request(["productManager"])[0];
    }
    LayoutDrawerController.prototype.refresh = function () {
        try {
            this.layouts = this.manager.getLayouts();
        }
        catch (err) {
            logger_1.default(err);
            this.layouts = [];
        }
        return { layouts: this.layouts };
    };
    LayoutDrawerController.prototype.setCurrentLayout = function (layoutId) {
        this.manager.setCurrentLayout(layoutId);
    };
    return LayoutDrawerController;
}());
exports.default = LayoutDrawerController;


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(94);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js!../../../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js!../../../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".component--LayoutDrawer {\n  height: auto;\n  background-color: #7fb6b8;\n  padding: 10px 20px; }\n  .component--LayoutDrawer .selected::after {\n    -webkit-box-shadow: inset 0 0 0 2px black;\n            box-shadow: inset 0 0 0 2px black;\n    width: 100%;\n    height: 100%;\n    position: absolute;\n    content: \"\";\n    left: 0;\n    top: 0; }\n", ""]);

// exports


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var m = __webpack_require__(0);
var index_1 = __webpack_require__(5);
var injectTransition_1 = __webpack_require__(14);
var iconText = __webpack_require__(24);
var iconImage = __webpack_require__(25);
var iconShape = __webpack_require__(26);
var Item_1 = __webpack_require__(13);
__webpack_require__(96);
var TDragItem = injectTransition_1.default(Item_1.default, { group: "OtherDrawer", delay: 100, transition: "t--slide-down-bounce" });
var OtherDrawer = (function () {
    function OtherDrawer() {
    }
    OtherDrawer.prototype.view = function (v) {
        return m("div", { className: "component--OtherDrawer" },
            m("span", { className: "element-description" }, "Text and shapes"),
            m("div", { className: "items" },
                m("div", { className: "item" },
                    m(TDragItem, { data: { content: { type: index_1.TEXT, value: "TEXT" } }, keepPlaceholder: true, preventPosition: true, preventResize: true },
                        m("img", { src: iconText, alt: "text" }))),
                m("div", { className: "item" },
                    m(TDragItem, { data: { content: { type: index_1.SHAPE, value: "f101", fontFamily: "Material-Design-Iconic-Font" } }, keepPlaceholder: true, preventPosition: true, preventResize: true },
                        m("img", { src: iconShape, alt: "shape" })))));
    };
    return OtherDrawer;
}());
exports.default = OtherDrawer;


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(97);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js!../../../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js!../../../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".component--OtherDrawer {\n  height: auto;\n  background-color: #7fb6b8;\n  padding: 10px 20px; }\n  .component--OtherDrawer .items .item {\n    width: 40px;\n    height: 40px;\n    display: inline-block; }\n    .component--OtherDrawer .items .item img {\n      width: 30px;\n      height: 30px;\n      padding: 5px; }\n", ""]);

// exports


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var eventaggregator_1 = __webpack_require__(8);
var m = __webpack_require__(0);
var Area_1 = __webpack_require__(17);
var Item_1 = __webpack_require__(13);
var dom_1 = __webpack_require__(4);
var helpers_1 = __webpack_require__(6);
var injectTransition_1 = __webpack_require__(14);
var Holder_1 = __webpack_require__(16);
var controller_1 = __webpack_require__(99);
__webpack_require__(100);
var TDragArea = injectTransition_1.default(Area_1.default, { group: "ProductPreview", delay: 200, transition: "t--slide-down-bounce" });
var ProductPreview = (function () {
    function ProductPreview() {
        this.controller = new controller_1.default();
    }
    ProductPreview.prototype.onremove = function (v) {
        this.controller.destruct();
    };
    ProductPreview.prototype.oncreate = function (v) {
        var _this = this;
        this.controller.addEvent("resize", eventaggregator_1.debounce(function () { return _this.updateScale(v.dom); }, 100));
        this.updateScale(v.dom);
    };
    ProductPreview.prototype.view = function (v) {
        var layout = this.controller.refresh().layout;
        if (!layout) {
            return null;
        }
        return m("div", { className: "component--ProductPreview", style: dom_1.getRectStyle(layout.position) }, this.getHolderViews(layout));
    };
    ProductPreview.prototype.getHolderViews = function (layout) {
        var _this = this;
        var holders = layout.holders;
        if (layout.fixed) {
            return holders.map(function (holder, index) {
                return m(TDragArea, { key: holder.id, transitionorder: index, position: holder.position, constrain: _this.controller.getDragAreaConstrainMargin(), onareahover: function (event, item, sourceArea, targetArea, initial) { return _this.controller.onHolderHover(item, sourceArea, targetArea, holder, initial); }, onareadrop: function (event, item) { return _this.controller.onHolderContentDrop(item, holder); }, onarearemove: function (event, item) { return _this.controller.onHolderContentRemove(item, holder); } },
                    m(Item_1.default, { data: { content: holder.content, holderId: holder.id }, preventResize: true, position: { left: 0, top: 0, width: holder.position.width, height: holder.position.height }, onclick: function () { return _this.controller.onHolderSelect(holder); } },
                        m(Holder_1.default, { holder: holder, className: holder.selected ? "selected" : "" })));
            });
        }
        return m(TDragArea, { key: -1, grid: helpers_1.setScale({ width: 5, height: 5 }, this.controller.scale), constrain: this.controller.getDragAreaConstrainMargin(), onareahover: function (event, item, sourceArea, targetArea, initial) { return _this.controller.onHolderHover(item, sourceArea, targetArea, undefined, initial); }, onareadrop: function (event, item) { return _this.controller.onHolderContentDrop(item); }, onarearemove: function (event, item) { return _this.controller.onHolderContentRemove(item); } }, holders.map(function (holder, index) {
            return m(Item_1.default, { key: holder.id, data: { content: holder.content, holderId: holder.id }, position: holder.position, onitemmoveend: function (event, item) { return _this.controller.onHolderPosition(item, holder); }, onitemresizeend: function (event, item) { return _this.controller.onHolderPosition(item, holder); }, onclick: function () { return _this.controller.onHolderSelect(holder); } },
                m(Holder_1.default, { holder: holder, className: holder.selected ? "selected" : "" }));
        }));
    };
    ProductPreview.prototype.updateScale = function (dom) {
        var newScale = this.calculateScale(dom);
        if (newScale !== this.controller.scale) {
            this.controller.updateProductPreviewScale(newScale);
        }
    };
    ProductPreview.prototype.calculateScale = function (dom) {
        if (!dom || !this.controller.actualLayoutRect) {
            return 1;
        }
        var container = dom.parentElement;
        if (container === null) {
            return 1;
        }
        return helpers_1.getScale(this.controller.actualLayoutRect, dom_1.getInnerRect(container));
    };
    return ProductPreview;
}());
exports.default = ProductPreview;


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var easydeps_1 = __webpack_require__(7);
var enums_1 = __webpack_require__(5);
var logger_1 = __webpack_require__(10);
var ProductPreviewController = (function () {
    function ProductPreviewController() {
        var _this = this;
        this.scale = 1;
        this.events = [];
        easydeps_1.default.getInstance().invoke(function (productManager, domEA) {
            _this.manager = productManager;
            _this.domEA = domEA;
        });
    }
    ProductPreviewController.prototype.refresh = function () {
        try {
            var productPart = this.manager.getProductPart();
            if (productPart) {
                this.actualLayoutRect = productPart.layout.position;
                this.layout = this.manager.getScaledLayout(productPart.layout);
            }
            else {
                this.layout = undefined;
            }
        }
        catch (err) {
            logger_1.default(err);
            this.layout = undefined;
        }
        return { layout: this.layout };
    };
    ProductPreviewController.prototype.destruct = function () {
        this.events.forEach(function (sub) { return sub.off(); });
        this.events = [];
    };
    ProductPreviewController.prototype.addEvent = function (event, callback) {
        this.events.push(this.domEA.on(event, callback));
    };
    ProductPreviewController.prototype.onHolderHover = function (item, sourceArea, targetArea, holder, initial) {
        var itemRect = item.getBoundingClientRect();
        var areaRect = targetArea.getBoundingClientRect();
        if (targetArea === sourceArea && !targetArea.withinArea(itemRect, this.getDragAreaConstrainMargin())) {
            return false;
        }
        var content = item.getData("content");
        if (holder === undefined) {
            if (initial && this.layout) {
                var position = item.getPosition();
                var targetHeight = this.layout.position.height;
                item.setStaticPosition({ height: targetHeight, width: position.width * (targetHeight / position.height) });
            }
            return true;
        }
        return (Array.isArray(holder.type) && holder.type.indexOf(content.type) !== -1);
    };
    ProductPreviewController.prototype.onHolderContentDrop = function (item, holder) {
        var content = { type: enums_1.TEXT };
        var position;
        if (item !== undefined) {
            content = item.getData("content");
        }
        if (holder === undefined) {
            holder = this.manager.addHolder();
            if (item !== undefined) {
                position = item.getPosition({ snapToGrid: true });
            }
        }
        this.manager.updateHolder({ id: holder.id, content: content, position: position });
        if (holder.selected !== true) {
            this.manager.setCurrentHolder(holder.id);
        }
    };
    ProductPreviewController.prototype.onHolderContentRemove = function (item, holder) {
        if (holder === undefined) {
            var holderId = item.getData("holderId");
            if (holderId !== undefined) {
                this.manager.removeHolder(holderId);
            }
        }
        else {
            this.manager.removeHolderContent(holder.id);
        }
        this.manager.setCurrentHolder();
    };
    ProductPreviewController.prototype.onHolderSelect = function (holder) {
        if (holder === undefined) {
            this.manager.setCurrentHolder();
        }
        else {
            this.manager.setCurrentHolder(holder.id);
        }
    };
    ProductPreviewController.prototype.onHolderPosition = function (item, holder) {
        var position = item.getPosition();
        this.manager.updateHolder({ id: holder.id, position: position });
        if (holder.selected !== true) {
            this.manager.setCurrentHolder(holder.id);
        }
    };
    ProductPreviewController.prototype.getDragAreaConstrainMargin = function () {
        return { margin: 50 * this.scale };
    };
    ProductPreviewController.prototype.updateProductPreviewScale = function (scale) {
        this.scale = scale;
        this.manager.setPreviewScale(scale);
    };
    ProductPreviewController.prototype.getScaledHolder = function (holder) {
        return this.manager.getScaledHolder(holder);
    };
    return ProductPreviewController;
}());
exports.default = ProductPreviewController;


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(101);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js!../../../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js!../../../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".component--ProductPreview {\n  position: relative;\n  margin: 0 auto;\n  background: white url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAC7UlEQVRIS42WS08qQRCFqxVUoiI+kShuFFzoxp3+/4U7V24Q3PCQp6ARHIJg33x9U5NmHNBKCDPd1fU6p6rHWGttr9eT3d1dWV1dlSAI5PPzU/b39wV5e3uTTCbjntE7ODhwz7VaTfL5vHtW4WwqlZJWq+XsTSYTMTh4fn6W8/PzUPH19dU5QGFtbW3OSLPZlFwuJ8PhUEajkWSz2bl9fdHAnAOUt7a2pNPpyMrKiotSox0MBjIejyWZTIbRqxP2iBTd6XQqx8fH8vT0JMViMXRqhsOh3dzclH6/L3t7e/L+/i47OzuhAu9kcnh4GK5RnvX1dTk6OnJrHx8fsr29PZcJTtPptJjpdGqpvS9gwBpGfCFDNerjEVcjrYorEbUkC5VGoyEnJyextfV1CEDLOZvNHB7YAmhKBn7OASkDXCKRWGg0GgSKcSRgHZLAPKrgHLBYr9fl9PQ0dACwGxsbPxw+Pj7K9fV1bCDqUMFHKXSwrB5ab/1XGnPm4eFBrq6uQryi2Jhms2mhVzTd7+9vR1kVPyrWaCrKpo0Hbghs83sndLAUUW9Tu9Xv8K+vL9cnKlpusP1RIm2ivzpUPXUcPWfq9borEbz1G0xrCd2Wscs3CDGI/uLiQuCOMUZMuVy2LKhour810l9IsZRFAEhEDL2XlxfXOGdnZ3N20dFu1yyjGZtut2uVCf6mpqgW2WMu0fGkHh0jqgf43W5XCoWCG+kOZCJkxmCAltd5o4d0rug7BnT4EQjzn0kQJ6bf71tGbpz4w0334TtGAfP29tYt+5T17bTb7Xma+pGpYrVadSMDhi0qi+rS4eCmg5LmDPtA74NKpeJohuEoqBiKm/3LGGVqtZrVIcdhomQKkjYMUoO/jXAajQogGhg2TKlUslzezHBEM+F5kdG40b0oCxMEgYXD/KIDjUMwCFCjVyIgw7boR4E6ur+/l7u7u/8YgPairwMOQGMM0S+lUkkuLy/dRc8Ff3NzE2bvZ8E+Jf4H0Db2NpBHhswAAAAASUVORK5CYII=\") repeat;\n  display: block; }\n  .component--ProductPreview .drag-area {\n    background-color: rgba(0, 0, 0, 0.2);\n    overflow: hidden; }\n    .component--ProductPreview .drag-area.disabled {\n      position: absolute;\n      top: 0;\n      left: 0;\n      display: block;\n      width: 100%;\n      height: 100%;\n      background-color: rgba(255, 0, 0, 0.5);\n      background-image: linear-gradient(to top left, transparent 0%, transparent calc(50% - 2px), black 50%, transparent calc(50% + 2px), transparent 100%), linear-gradient(to top right, transparent 0%, transparent calc(50% - 2px), black 50%, transparent calc(50% + 2px), transparent 100%); }\n    .component--ProductPreview .drag-area.focus:after {\n      -webkit-box-shadow: inset 0 0 0 2px black;\n              box-shadow: inset 0 0 0 2px black;\n      display: block;\n      content: \"\";\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      position: absolute; }\n  .component--ProductPreview .holder {\n    top: 0 !important;\n    left: 0 !important;\n    width: 100% !important;\n    height: 100% !important; }\n    .component--ProductPreview .holder.selected:after {\n      -webkit-box-shadow: inset 0 0 0 4px black;\n              box-shadow: inset 0 0 0 4px black;\n      display: block;\n      content: \"\";\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      position: absolute; }\n", ""]);

// exports


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(103);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/postcss-loader/lib/index.js!../node_modules/sass-loader/lib/loader.js!./fonts.scss", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/postcss-loader/lib/index.js!../node_modules/sass-loader/lib/loader.js!./fonts.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: 'Material-Design-Iconic-Font';\n  font-style: normal;\n  font-weight: 400;\n  src: url(" + __webpack_require__(104) + ") format(\"woff2\"); }\n\n.zmdi {\n  display: inline-block;\n  font: normal normal normal 14px/1 'Material-Design-Iconic-Font';\n  font-size: inherit;\n  text-rendering: auto;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n.zmdi-hc-lg {\n  font-size: 1.33333333em;\n  line-height: .75em;\n  vertical-align: -15%; }\n\n.zmdi-hc-2x {\n  font-size: 2em; }\n\n.zmdi-hc-3x {\n  font-size: 3em; }\n\n.zmdi-hc-4x {\n  font-size: 4em; }\n\n.zmdi-hc-5x {\n  font-size: 5em; }\n\n.zmdi-hc-fw {\n  width: 1.28571429em;\n  text-align: center; }\n\n.zmdi-hc-ul {\n  padding-left: 0;\n  margin-left: 2.14285714em;\n  list-style-type: none; }\n\n.zmdi-hc-ul > li {\n  position: relative; }\n\n.zmdi-hc-li {\n  position: absolute;\n  left: -2.14285714em;\n  width: 2.14285714em;\n  top: .14285714em;\n  text-align: center; }\n\n.zmdi-hc-li.zmdi-hc-lg {\n  left: -1.85714286em; }\n\n.zmdi-hc-border {\n  padding: .1em .25em;\n  border: solid .1em #9e9e9e;\n  border-radius: 2px; }\n\n.zmdi-hc-border-circle {\n  padding: .1em .25em;\n  border: solid .1em #9e9e9e;\n  border-radius: 50%; }\n\n.zmdi.pull-left {\n  float: left;\n  margin-right: .15em; }\n\n.zmdi.pull-right {\n  float: right;\n  margin-left: .15em; }\n\n.zmdi-hc-spin {\n  -webkit-animation: zmdi-spin 1.5s infinite linear;\n  animation: zmdi-spin 1.5s infinite linear; }\n\n.zmdi-hc-spin-reverse {\n  -webkit-animation: zmdi-spin-reverse 1.5s infinite linear;\n  animation: zmdi-spin-reverse 1.5s infinite linear; }\n\n@-webkit-keyframes zmdi-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(359deg);\n    transform: rotate(359deg); } }\n\n@keyframes zmdi-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(359deg);\n    transform: rotate(359deg); } }\n\n@-webkit-keyframes zmdi-spin-reverse {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(-359deg);\n    transform: rotate(-359deg); } }\n\n@keyframes zmdi-spin-reverse {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(-359deg);\n    transform: rotate(-359deg); } }\n\n.zmdi-hc-rotate-90 {\n  -webkit-transform: rotate(90deg);\n  transform: rotate(90deg); }\n\n.zmdi-hc-rotate-180 {\n  -webkit-transform: rotate(180deg);\n  transform: rotate(180deg); }\n\n.zmdi-hc-rotate-270 {\n  -webkit-transform: rotate(270deg);\n  transform: rotate(270deg); }\n\n.zmdi-hc-flip-horizontal {\n  -webkit-transform: scale(-1, 1);\n  transform: scale(-1, 1); }\n\n.zmdi-hc-flip-vertical {\n  -webkit-transform: scale(1, -1);\n  transform: scale(1, -1); }\n\n.zmdi-hc-stack {\n  position: relative;\n  display: inline-block;\n  width: 2em;\n  height: 2em;\n  line-height: 2em;\n  vertical-align: middle; }\n\n.zmdi-hc-stack-1x,\n.zmdi-hc-stack-2x {\n  position: absolute;\n  left: 0;\n  width: 100%;\n  text-align: center; }\n\n.zmdi-hc-stack-1x {\n  line-height: inherit; }\n\n.zmdi-hc-stack-2x {\n  font-size: 2em; }\n\n.zmdi-hc-inverse {\n  color: #fff; }\n\n.zmdi-3d-rotation:before {\n  content: '\\F101'; }\n\n.zmdi-airplane-off:before {\n  content: '\\F102'; }\n\n.zmdi-airplane:before {\n  content: '\\F103'; }\n\n.zmdi-album:before {\n  content: '\\F104'; }\n\n.zmdi-archive:before {\n  content: '\\F105'; }\n\n.zmdi-assignment-account:before {\n  content: '\\F106'; }\n\n.zmdi-assignment-alert:before {\n  content: '\\F107'; }\n\n.zmdi-assignment-check:before {\n  content: '\\F108'; }\n\n.zmdi-assignment-o:before {\n  content: '\\F109'; }\n\n.zmdi-assignment-return:before {\n  content: '\\F10A'; }\n\n.zmdi-assignment-returned:before {\n  content: '\\F10B'; }\n\n.zmdi-assignment:before {\n  content: '\\F10C'; }\n\n.zmdi-attachment-alt:before {\n  content: '\\F10D'; }\n\n.zmdi-attachment:before {\n  content: '\\F10E'; }\n\n.zmdi-audio:before {\n  content: '\\F10F'; }\n\n.zmdi-badge-check:before {\n  content: '\\F110'; }\n\n.zmdi-balance-wallet:before {\n  content: '\\F111'; }\n\n.zmdi-balance:before {\n  content: '\\F112'; }\n\n.zmdi-battery-alert:before {\n  content: '\\F113'; }\n\n.zmdi-battery-flash:before {\n  content: '\\F114'; }\n\n.zmdi-battery-unknown:before {\n  content: '\\F115'; }\n\n.zmdi-battery:before {\n  content: '\\F116'; }\n\n.zmdi-bike:before {\n  content: '\\F117'; }\n\n.zmdi-block-alt:before {\n  content: '\\F118'; }\n\n.zmdi-block:before {\n  content: '\\F119'; }\n\n.zmdi-boat:before {\n  content: '\\F11A'; }\n\n.zmdi-book-image:before {\n  content: '\\F11B'; }\n\n.zmdi-book:before {\n  content: '\\F11C'; }\n\n.zmdi-bookmark-outline:before {\n  content: '\\F11D'; }\n\n.zmdi-bookmark:before {\n  content: '\\F11E'; }\n\n.zmdi-brush:before {\n  content: '\\F11F'; }\n\n.zmdi-bug:before {\n  content: '\\F120'; }\n\n.zmdi-bus:before {\n  content: '\\F121'; }\n\n.zmdi-cake:before {\n  content: '\\F122'; }\n\n.zmdi-car-taxi:before {\n  content: '\\F123'; }\n\n.zmdi-car-wash:before {\n  content: '\\F124'; }\n\n.zmdi-car:before {\n  content: '\\F125'; }\n\n.zmdi-card-giftcard:before {\n  content: '\\F126'; }\n\n.zmdi-card-membership:before {\n  content: '\\F127'; }\n\n.zmdi-card-travel:before {\n  content: '\\F128'; }\n\n.zmdi-card:before {\n  content: '\\F129'; }\n\n.zmdi-case-check:before {\n  content: '\\F12A'; }\n\n.zmdi-case-download:before {\n  content: '\\F12B'; }\n\n.zmdi-case-play:before {\n  content: '\\F12C'; }\n\n.zmdi-case:before {\n  content: '\\F12D'; }\n\n.zmdi-cast-connected:before {\n  content: '\\F12E'; }\n\n.zmdi-cast:before {\n  content: '\\F12F'; }\n\n.zmdi-chart-donut:before {\n  content: '\\F130'; }\n\n.zmdi-chart:before {\n  content: '\\F131'; }\n\n.zmdi-city-alt:before {\n  content: '\\F132'; }\n\n.zmdi-city:before {\n  content: '\\F133'; }\n\n.zmdi-close-circle-o:before {\n  content: '\\F134'; }\n\n.zmdi-close-circle:before {\n  content: '\\F135'; }\n\n.zmdi-close:before {\n  content: '\\F136'; }\n\n.zmdi-cocktail:before {\n  content: '\\F137'; }\n\n.zmdi-code-setting:before {\n  content: '\\F138'; }\n\n.zmdi-code-smartphone:before {\n  content: '\\F139'; }\n\n.zmdi-code:before {\n  content: '\\F13A'; }\n\n.zmdi-coffee:before {\n  content: '\\F13B'; }\n\n.zmdi-collection-bookmark:before {\n  content: '\\F13C'; }\n\n.zmdi-collection-case-play:before {\n  content: '\\F13D'; }\n\n.zmdi-collection-folder-image:before {\n  content: '\\F13E'; }\n\n.zmdi-collection-image-o:before {\n  content: '\\F13F'; }\n\n.zmdi-collection-image:before {\n  content: '\\F140'; }\n\n.zmdi-collection-item-1:before {\n  content: '\\F141'; }\n\n.zmdi-collection-item-2:before {\n  content: '\\F142'; }\n\n.zmdi-collection-item-3:before {\n  content: '\\F143'; }\n\n.zmdi-collection-item-4:before {\n  content: '\\F144'; }\n\n.zmdi-collection-item-5:before {\n  content: '\\F145'; }\n\n.zmdi-collection-item-6:before {\n  content: '\\F146'; }\n\n.zmdi-collection-item-7:before {\n  content: '\\F147'; }\n\n.zmdi-collection-item-8:before {\n  content: '\\F148'; }\n\n.zmdi-collection-item-9-plus:before {\n  content: '\\F149'; }\n\n.zmdi-collection-item-9:before {\n  content: '\\F14A'; }\n\n.zmdi-collection-item:before {\n  content: '\\F14B'; }\n\n.zmdi-collection-music:before {\n  content: '\\F14C'; }\n\n.zmdi-collection-pdf:before {\n  content: '\\F14D'; }\n\n.zmdi-collection-plus:before {\n  content: '\\F14E'; }\n\n.zmdi-collection-speaker:before {\n  content: '\\F14F'; }\n\n.zmdi-collection-text:before {\n  content: '\\F150'; }\n\n.zmdi-collection-video:before {\n  content: '\\F151'; }\n\n.zmdi-compass:before {\n  content: '\\F152'; }\n\n.zmdi-cutlery:before {\n  content: '\\F153'; }\n\n.zmdi-delete:before {\n  content: '\\F154'; }\n\n.zmdi-dialpad:before {\n  content: '\\F155'; }\n\n.zmdi-dns:before {\n  content: '\\F156'; }\n\n.zmdi-drink:before {\n  content: '\\F157'; }\n\n.zmdi-edit:before {\n  content: '\\F158'; }\n\n.zmdi-email-open:before {\n  content: '\\F159'; }\n\n.zmdi-email:before {\n  content: '\\F15A'; }\n\n.zmdi-eye-off:before {\n  content: '\\F15B'; }\n\n.zmdi-eye:before {\n  content: '\\F15C'; }\n\n.zmdi-eyedropper:before {\n  content: '\\F15D'; }\n\n.zmdi-favorite-outline:before {\n  content: '\\F15E'; }\n\n.zmdi-favorite:before {\n  content: '\\F15F'; }\n\n.zmdi-filter-list:before {\n  content: '\\F160'; }\n\n.zmdi-fire:before {\n  content: '\\F161'; }\n\n.zmdi-flag:before {\n  content: '\\F162'; }\n\n.zmdi-flare:before {\n  content: '\\F163'; }\n\n.zmdi-flash-auto:before {\n  content: '\\F164'; }\n\n.zmdi-flash-off:before {\n  content: '\\F165'; }\n\n.zmdi-flash:before {\n  content: '\\F166'; }\n\n.zmdi-flip:before {\n  content: '\\F167'; }\n\n.zmdi-flower-alt:before {\n  content: '\\F168'; }\n\n.zmdi-flower:before {\n  content: '\\F169'; }\n\n.zmdi-font:before {\n  content: '\\F16A'; }\n\n.zmdi-fullscreen-alt:before {\n  content: '\\F16B'; }\n\n.zmdi-fullscreen-exit:before {\n  content: '\\F16C'; }\n\n.zmdi-fullscreen:before {\n  content: '\\F16D'; }\n\n.zmdi-functions:before {\n  content: '\\F16E'; }\n\n.zmdi-gas-station:before {\n  content: '\\F16F'; }\n\n.zmdi-gesture:before {\n  content: '\\F170'; }\n\n.zmdi-globe-alt:before {\n  content: '\\F171'; }\n\n.zmdi-globe-lock:before {\n  content: '\\F172'; }\n\n.zmdi-globe:before {\n  content: '\\F173'; }\n\n.zmdi-graduation-cap:before {\n  content: '\\F174'; }\n\n.zmdi-home:before {\n  content: '\\F175'; }\n\n.zmdi-hospital-alt:before {\n  content: '\\F176'; }\n\n.zmdi-hospital:before {\n  content: '\\F177'; }\n\n.zmdi-hotel:before {\n  content: '\\F178'; }\n\n.zmdi-hourglass-alt:before {\n  content: '\\F179'; }\n\n.zmdi-hourglass-outline:before {\n  content: '\\F17A'; }\n\n.zmdi-hourglass:before {\n  content: '\\F17B'; }\n\n.zmdi-http:before {\n  content: '\\F17C'; }\n\n.zmdi-image-alt:before {\n  content: '\\F17D'; }\n\n.zmdi-image-o:before {\n  content: '\\F17E'; }\n\n.zmdi-image:before {\n  content: '\\F17F'; }\n\n.zmdi-inbox:before {\n  content: '\\F180'; }\n\n.zmdi-invert-colors-off:before {\n  content: '\\F181'; }\n\n.zmdi-invert-colors:before {\n  content: '\\F182'; }\n\n.zmdi-key:before {\n  content: '\\F183'; }\n\n.zmdi-label-alt-outline:before {\n  content: '\\F184'; }\n\n.zmdi-label-alt:before {\n  content: '\\F185'; }\n\n.zmdi-label-heart:before {\n  content: '\\F186'; }\n\n.zmdi-label:before {\n  content: '\\F187'; }\n\n.zmdi-labels:before {\n  content: '\\F188'; }\n\n.zmdi-lamp:before {\n  content: '\\F189'; }\n\n.zmdi-landscape:before {\n  content: '\\F18A'; }\n\n.zmdi-layers-off:before {\n  content: '\\F18B'; }\n\n.zmdi-layers:before {\n  content: '\\F18C'; }\n\n.zmdi-library:before {\n  content: '\\F18D'; }\n\n.zmdi-link:before {\n  content: '\\F18E'; }\n\n.zmdi-lock-open:before {\n  content: '\\F18F'; }\n\n.zmdi-lock-outline:before {\n  content: '\\F190'; }\n\n.zmdi-lock:before {\n  content: '\\F191'; }\n\n.zmdi-mail-reply-all:before {\n  content: '\\F192'; }\n\n.zmdi-mail-reply:before {\n  content: '\\F193'; }\n\n.zmdi-mail-send:before {\n  content: '\\F194'; }\n\n.zmdi-mall:before {\n  content: '\\F195'; }\n\n.zmdi-map:before {\n  content: '\\F196'; }\n\n.zmdi-menu:before {\n  content: '\\F197'; }\n\n.zmdi-money-box:before {\n  content: '\\F198'; }\n\n.zmdi-money-off:before {\n  content: '\\F199'; }\n\n.zmdi-money:before {\n  content: '\\F19A'; }\n\n.zmdi-more-vert:before {\n  content: '\\F19B'; }\n\n.zmdi-more:before {\n  content: '\\F19C'; }\n\n.zmdi-movie-alt:before {\n  content: '\\F19D'; }\n\n.zmdi-movie:before {\n  content: '\\F19E'; }\n\n.zmdi-nature-people:before {\n  content: '\\F19F'; }\n\n.zmdi-nature:before {\n  content: '\\F1A0'; }\n\n.zmdi-navigation:before {\n  content: '\\F1A1'; }\n\n.zmdi-open-in-browser:before {\n  content: '\\F1A2'; }\n\n.zmdi-open-in-new:before {\n  content: '\\F1A3'; }\n\n.zmdi-palette:before {\n  content: '\\F1A4'; }\n\n.zmdi-parking:before {\n  content: '\\F1A5'; }\n\n.zmdi-pin-account:before {\n  content: '\\F1A6'; }\n\n.zmdi-pin-assistant:before {\n  content: '\\F1A7'; }\n\n.zmdi-pin-drop:before {\n  content: '\\F1A8'; }\n\n.zmdi-pin-help:before {\n  content: '\\F1A9'; }\n\n.zmdi-pin-off:before {\n  content: '\\F1AA'; }\n\n.zmdi-pin:before {\n  content: '\\F1AB'; }\n\n.zmdi-pizza:before {\n  content: '\\F1AC'; }\n\n.zmdi-plaster:before {\n  content: '\\F1AD'; }\n\n.zmdi-power-setting:before {\n  content: '\\F1AE'; }\n\n.zmdi-power:before {\n  content: '\\F1AF'; }\n\n.zmdi-print:before {\n  content: '\\F1B0'; }\n\n.zmdi-puzzle-piece:before {\n  content: '\\F1B1'; }\n\n.zmdi-quote:before {\n  content: '\\F1B2'; }\n\n.zmdi-railway:before {\n  content: '\\F1B3'; }\n\n.zmdi-receipt:before {\n  content: '\\F1B4'; }\n\n.zmdi-refresh-alt:before {\n  content: '\\F1B5'; }\n\n.zmdi-refresh-sync-alert:before {\n  content: '\\F1B6'; }\n\n.zmdi-refresh-sync-off:before {\n  content: '\\F1B7'; }\n\n.zmdi-refresh-sync:before {\n  content: '\\F1B8'; }\n\n.zmdi-refresh:before {\n  content: '\\F1B9'; }\n\n.zmdi-roller:before {\n  content: '\\F1BA'; }\n\n.zmdi-ruler:before {\n  content: '\\F1BB'; }\n\n.zmdi-scissors:before {\n  content: '\\F1BC'; }\n\n.zmdi-screen-rotation-lock:before {\n  content: '\\F1BD'; }\n\n.zmdi-screen-rotation:before {\n  content: '\\F1BE'; }\n\n.zmdi-search-for:before {\n  content: '\\F1BF'; }\n\n.zmdi-search-in-file:before {\n  content: '\\F1C0'; }\n\n.zmdi-search-in-page:before {\n  content: '\\F1C1'; }\n\n.zmdi-search-replace:before {\n  content: '\\F1C2'; }\n\n.zmdi-search:before {\n  content: '\\F1C3'; }\n\n.zmdi-seat:before {\n  content: '\\F1C4'; }\n\n.zmdi-settings-square:before {\n  content: '\\F1C5'; }\n\n.zmdi-settings:before {\n  content: '\\F1C6'; }\n\n.zmdi-shield-check:before {\n  content: '\\F1C7'; }\n\n.zmdi-shield-security:before {\n  content: '\\F1C8'; }\n\n.zmdi-shopping-basket:before {\n  content: '\\F1C9'; }\n\n.zmdi-shopping-cart-plus:before {\n  content: '\\F1CA'; }\n\n.zmdi-shopping-cart:before {\n  content: '\\F1CB'; }\n\n.zmdi-sign-in:before {\n  content: '\\F1CC'; }\n\n.zmdi-sort-amount-asc:before {\n  content: '\\F1CD'; }\n\n.zmdi-sort-amount-desc:before {\n  content: '\\F1CE'; }\n\n.zmdi-sort-asc:before {\n  content: '\\F1CF'; }\n\n.zmdi-sort-desc:before {\n  content: '\\F1D0'; }\n\n.zmdi-spellcheck:before {\n  content: '\\F1D1'; }\n\n.zmdi-storage:before {\n  content: '\\F1D2'; }\n\n.zmdi-store-24:before {\n  content: '\\F1D3'; }\n\n.zmdi-store:before {\n  content: '\\F1D4'; }\n\n.zmdi-subway:before {\n  content: '\\F1D5'; }\n\n.zmdi-sun:before {\n  content: '\\F1D6'; }\n\n.zmdi-tab-unselected:before {\n  content: '\\F1D7'; }\n\n.zmdi-tab:before {\n  content: '\\F1D8'; }\n\n.zmdi-tag-close:before {\n  content: '\\F1D9'; }\n\n.zmdi-tag-more:before {\n  content: '\\F1DA'; }\n\n.zmdi-tag:before {\n  content: '\\F1DB'; }\n\n.zmdi-thumb-down:before {\n  content: '\\F1DC'; }\n\n.zmdi-thumb-up-down:before {\n  content: '\\F1DD'; }\n\n.zmdi-thumb-up:before {\n  content: '\\F1DE'; }\n\n.zmdi-ticket-star:before {\n  content: '\\F1DF'; }\n\n.zmdi-toll:before {\n  content: '\\F1E0'; }\n\n.zmdi-toys:before {\n  content: '\\F1E1'; }\n\n.zmdi-traffic:before {\n  content: '\\F1E2'; }\n\n.zmdi-translate:before {\n  content: '\\F1E3'; }\n\n.zmdi-triangle-down:before {\n  content: '\\F1E4'; }\n\n.zmdi-triangle-up:before {\n  content: '\\F1E5'; }\n\n.zmdi-truck:before {\n  content: '\\F1E6'; }\n\n.zmdi-turning-sign:before {\n  content: '\\F1E7'; }\n\n.zmdi-wallpaper:before {\n  content: '\\F1E8'; }\n\n.zmdi-washing-machine:before {\n  content: '\\F1E9'; }\n\n.zmdi-window-maximize:before {\n  content: '\\F1EA'; }\n\n.zmdi-window-minimize:before {\n  content: '\\F1EB'; }\n\n.zmdi-window-restore:before {\n  content: '\\F1EC'; }\n\n.zmdi-wrench:before {\n  content: '\\F1ED'; }\n\n.zmdi-zoom-in:before {\n  content: '\\F1EE'; }\n\n.zmdi-zoom-out:before {\n  content: '\\F1EF'; }\n\n.zmdi-alert-circle-o:before {\n  content: '\\F1F0'; }\n\n.zmdi-alert-circle:before {\n  content: '\\F1F1'; }\n\n.zmdi-alert-octagon:before {\n  content: '\\F1F2'; }\n\n.zmdi-alert-polygon:before {\n  content: '\\F1F3'; }\n\n.zmdi-alert-triangle:before {\n  content: '\\F1F4'; }\n\n.zmdi-help-outline:before {\n  content: '\\F1F5'; }\n\n.zmdi-help:before {\n  content: '\\F1F6'; }\n\n.zmdi-info-outline:before {\n  content: '\\F1F7'; }\n\n.zmdi-info:before {\n  content: '\\F1F8'; }\n\n.zmdi-notifications-active:before {\n  content: '\\F1F9'; }\n\n.zmdi-notifications-add:before {\n  content: '\\F1FA'; }\n\n.zmdi-notifications-none:before {\n  content: '\\F1FB'; }\n\n.zmdi-notifications-off:before {\n  content: '\\F1FC'; }\n\n.zmdi-notifications-paused:before {\n  content: '\\F1FD'; }\n\n.zmdi-notifications:before {\n  content: '\\F1FE'; }\n\n.zmdi-account-add:before {\n  content: '\\F1FF'; }\n\n.zmdi-account-box-mail:before {\n  content: '\\F200'; }\n\n.zmdi-account-box-o:before {\n  content: '\\F201'; }\n\n.zmdi-account-box-phone:before {\n  content: '\\F202'; }\n\n.zmdi-account-box:before {\n  content: '\\F203'; }\n\n.zmdi-account-calendar:before {\n  content: '\\F204'; }\n\n.zmdi-account-circle:before {\n  content: '\\F205'; }\n\n.zmdi-account-o:before {\n  content: '\\F206'; }\n\n.zmdi-account:before {\n  content: '\\F207'; }\n\n.zmdi-accounts-add:before {\n  content: '\\F208'; }\n\n.zmdi-accounts-alt:before {\n  content: '\\F209'; }\n\n.zmdi-accounts-list-alt:before {\n  content: '\\F20A'; }\n\n.zmdi-accounts-list:before {\n  content: '\\F20B'; }\n\n.zmdi-accounts-outline:before {\n  content: '\\F20C'; }\n\n.zmdi-accounts:before {\n  content: '\\F20D'; }\n\n.zmdi-face:before {\n  content: '\\F20E'; }\n\n.zmdi-female:before {\n  content: '\\F20F'; }\n\n.zmdi-male-alt:before {\n  content: '\\F210'; }\n\n.zmdi-male-female:before {\n  content: '\\F211'; }\n\n.zmdi-male:before {\n  content: '\\F212'; }\n\n.zmdi-mood-bad:before {\n  content: '\\F213'; }\n\n.zmdi-mood:before {\n  content: '\\F214'; }\n\n.zmdi-run:before {\n  content: '\\F215'; }\n\n.zmdi-walk:before {\n  content: '\\F216'; }\n\n.zmdi-cloud-box:before {\n  content: '\\F217'; }\n\n.zmdi-cloud-circle:before {\n  content: '\\F218'; }\n\n.zmdi-cloud-done:before {\n  content: '\\F219'; }\n\n.zmdi-cloud-download:before {\n  content: '\\F21A'; }\n\n.zmdi-cloud-off:before {\n  content: '\\F21B'; }\n\n.zmdi-cloud-outline-alt:before {\n  content: '\\F21C'; }\n\n.zmdi-cloud-outline:before {\n  content: '\\F21D'; }\n\n.zmdi-cloud-upload:before {\n  content: '\\F21E'; }\n\n.zmdi-cloud:before {\n  content: '\\F21F'; }\n\n.zmdi-download:before {\n  content: '\\F220'; }\n\n.zmdi-file-plus:before {\n  content: '\\F221'; }\n\n.zmdi-file-text:before {\n  content: '\\F222'; }\n\n.zmdi-file:before {\n  content: '\\F223'; }\n\n.zmdi-folder-outline:before {\n  content: '\\F224'; }\n\n.zmdi-folder-person:before {\n  content: '\\F225'; }\n\n.zmdi-folder-star-alt:before {\n  content: '\\F226'; }\n\n.zmdi-folder-star:before {\n  content: '\\F227'; }\n\n.zmdi-folder:before {\n  content: '\\F228'; }\n\n.zmdi-gif:before {\n  content: '\\F229'; }\n\n.zmdi-upload:before {\n  content: '\\F22A'; }\n\n.zmdi-border-all:before {\n  content: '\\F22B'; }\n\n.zmdi-border-bottom:before {\n  content: '\\F22C'; }\n\n.zmdi-border-clear:before {\n  content: '\\F22D'; }\n\n.zmdi-border-color:before {\n  content: '\\F22E'; }\n\n.zmdi-border-horizontal:before {\n  content: '\\F22F'; }\n\n.zmdi-border-inner:before {\n  content: '\\F230'; }\n\n.zmdi-border-left:before {\n  content: '\\F231'; }\n\n.zmdi-border-outer:before {\n  content: '\\F232'; }\n\n.zmdi-border-right:before {\n  content: '\\F233'; }\n\n.zmdi-border-style:before {\n  content: '\\F234'; }\n\n.zmdi-border-top:before {\n  content: '\\F235'; }\n\n.zmdi-border-vertical:before {\n  content: '\\F236'; }\n\n.zmdi-copy:before {\n  content: '\\F237'; }\n\n.zmdi-crop:before {\n  content: '\\F238'; }\n\n.zmdi-format-align-center:before {\n  content: '\\F239'; }\n\n.zmdi-format-align-justify:before {\n  content: '\\F23A'; }\n\n.zmdi-format-align-left:before {\n  content: '\\F23B'; }\n\n.zmdi-format-align-right:before {\n  content: '\\F23C'; }\n\n.zmdi-format-bold:before {\n  content: '\\F23D'; }\n\n.zmdi-format-clear-all:before {\n  content: '\\F23E'; }\n\n.zmdi-format-clear:before {\n  content: '\\F23F'; }\n\n.zmdi-format-color-fill:before {\n  content: '\\F240'; }\n\n.zmdi-format-color-reset:before {\n  content: '\\F241'; }\n\n.zmdi-format-color-text:before {\n  content: '\\F242'; }\n\n.zmdi-format-indent-decrease:before {\n  content: '\\F243'; }\n\n.zmdi-format-indent-increase:before {\n  content: '\\F244'; }\n\n.zmdi-format-italic:before {\n  content: '\\F245'; }\n\n.zmdi-format-line-spacing:before {\n  content: '\\F246'; }\n\n.zmdi-format-list-bulleted:before {\n  content: '\\F247'; }\n\n.zmdi-format-list-numbered:before {\n  content: '\\F248'; }\n\n.zmdi-format-ltr:before {\n  content: '\\F249'; }\n\n.zmdi-format-rtl:before {\n  content: '\\F24A'; }\n\n.zmdi-format-size:before {\n  content: '\\F24B'; }\n\n.zmdi-format-strikethrough-s:before {\n  content: '\\F24C'; }\n\n.zmdi-format-strikethrough:before {\n  content: '\\F24D'; }\n\n.zmdi-format-subject:before {\n  content: '\\F24E'; }\n\n.zmdi-format-underlined:before {\n  content: '\\F24F'; }\n\n.zmdi-format-valign-bottom:before {\n  content: '\\F250'; }\n\n.zmdi-format-valign-center:before {\n  content: '\\F251'; }\n\n.zmdi-format-valign-top:before {\n  content: '\\F252'; }\n\n.zmdi-redo:before {\n  content: '\\F253'; }\n\n.zmdi-select-all:before {\n  content: '\\F254'; }\n\n.zmdi-space-bar:before {\n  content: '\\F255'; }\n\n.zmdi-text-format:before {\n  content: '\\F256'; }\n\n.zmdi-transform:before {\n  content: '\\F257'; }\n\n.zmdi-undo:before {\n  content: '\\F258'; }\n\n.zmdi-wrap-text:before {\n  content: '\\F259'; }\n\n.zmdi-comment-alert:before {\n  content: '\\F25A'; }\n\n.zmdi-comment-alt-text:before {\n  content: '\\F25B'; }\n\n.zmdi-comment-alt:before {\n  content: '\\F25C'; }\n\n.zmdi-comment-edit:before {\n  content: '\\F25D'; }\n\n.zmdi-comment-image:before {\n  content: '\\F25E'; }\n\n.zmdi-comment-list:before {\n  content: '\\F25F'; }\n\n.zmdi-comment-more:before {\n  content: '\\F260'; }\n\n.zmdi-comment-outline:before {\n  content: '\\F261'; }\n\n.zmdi-comment-text-alt:before {\n  content: '\\F262'; }\n\n.zmdi-comment-text:before {\n  content: '\\F263'; }\n\n.zmdi-comment-video:before {\n  content: '\\F264'; }\n\n.zmdi-comment:before {\n  content: '\\F265'; }\n\n.zmdi-comments:before {\n  content: '\\F266'; }\n\n.zmdi-check-all:before {\n  content: '\\F267'; }\n\n.zmdi-check-circle-u:before {\n  content: '\\F268'; }\n\n.zmdi-check-circle:before {\n  content: '\\F269'; }\n\n.zmdi-check-square:before {\n  content: '\\F26A'; }\n\n.zmdi-check:before {\n  content: '\\F26B'; }\n\n.zmdi-circle-o:before {\n  content: '\\F26C'; }\n\n.zmdi-circle:before {\n  content: '\\F26D'; }\n\n.zmdi-dot-circle-alt:before {\n  content: '\\F26E'; }\n\n.zmdi-dot-circle:before {\n  content: '\\F26F'; }\n\n.zmdi-minus-circle-outline:before {\n  content: '\\F270'; }\n\n.zmdi-minus-circle:before {\n  content: '\\F271'; }\n\n.zmdi-minus-square:before {\n  content: '\\F272'; }\n\n.zmdi-minus:before {\n  content: '\\F273'; }\n\n.zmdi-plus-circle-o-duplicate:before {\n  content: '\\F274'; }\n\n.zmdi-plus-circle-o:before {\n  content: '\\F275'; }\n\n.zmdi-plus-circle:before {\n  content: '\\F276'; }\n\n.zmdi-plus-square:before {\n  content: '\\F277'; }\n\n.zmdi-plus:before {\n  content: '\\F278'; }\n\n.zmdi-square-o:before {\n  content: '\\F279'; }\n\n.zmdi-star-circle:before {\n  content: '\\F27A'; }\n\n.zmdi-star-half:before {\n  content: '\\F27B'; }\n\n.zmdi-star-outline:before {\n  content: '\\F27C'; }\n\n.zmdi-star:before {\n  content: '\\F27D'; }\n\n.zmdi-bluetooth-connected:before {\n  content: '\\F27E'; }\n\n.zmdi-bluetooth-off:before {\n  content: '\\F27F'; }\n\n.zmdi-bluetooth-search:before {\n  content: '\\F280'; }\n\n.zmdi-bluetooth-setting:before {\n  content: '\\F281'; }\n\n.zmdi-bluetooth:before {\n  content: '\\F282'; }\n\n.zmdi-camera-add:before {\n  content: '\\F283'; }\n\n.zmdi-camera-alt:before {\n  content: '\\F284'; }\n\n.zmdi-camera-bw:before {\n  content: '\\F285'; }\n\n.zmdi-camera-front:before {\n  content: '\\F286'; }\n\n.zmdi-camera-mic:before {\n  content: '\\F287'; }\n\n.zmdi-camera-party-mode:before {\n  content: '\\F288'; }\n\n.zmdi-camera-rear:before {\n  content: '\\F289'; }\n\n.zmdi-camera-roll:before {\n  content: '\\F28A'; }\n\n.zmdi-camera-switch:before {\n  content: '\\F28B'; }\n\n.zmdi-camera:before {\n  content: '\\F28C'; }\n\n.zmdi-card-alert:before {\n  content: '\\F28D'; }\n\n.zmdi-card-off:before {\n  content: '\\F28E'; }\n\n.zmdi-card-sd:before {\n  content: '\\F28F'; }\n\n.zmdi-card-sim:before {\n  content: '\\F290'; }\n\n.zmdi-desktop-mac:before {\n  content: '\\F291'; }\n\n.zmdi-desktop-windows:before {\n  content: '\\F292'; }\n\n.zmdi-device-hub:before {\n  content: '\\F293'; }\n\n.zmdi-devices-off:before {\n  content: '\\F294'; }\n\n.zmdi-devices:before {\n  content: '\\F295'; }\n\n.zmdi-dock:before {\n  content: '\\F296'; }\n\n.zmdi-floppy:before {\n  content: '\\F297'; }\n\n.zmdi-gamepad:before {\n  content: '\\F298'; }\n\n.zmdi-gps-dot:before {\n  content: '\\F299'; }\n\n.zmdi-gps-off:before {\n  content: '\\F29A'; }\n\n.zmdi-gps:before {\n  content: '\\F29B'; }\n\n.zmdi-headset-mic:before {\n  content: '\\F29C'; }\n\n.zmdi-headset:before {\n  content: '\\F29D'; }\n\n.zmdi-input-antenna:before {\n  content: '\\F29E'; }\n\n.zmdi-input-composite:before {\n  content: '\\F29F'; }\n\n.zmdi-input-hdmi:before {\n  content: '\\F2A0'; }\n\n.zmdi-input-power:before {\n  content: '\\F2A1'; }\n\n.zmdi-input-svideo:before {\n  content: '\\F2A2'; }\n\n.zmdi-keyboard-hide:before {\n  content: '\\F2A3'; }\n\n.zmdi-keyboard:before {\n  content: '\\F2A4'; }\n\n.zmdi-laptop-chromebook:before {\n  content: '\\F2A5'; }\n\n.zmdi-laptop-mac:before {\n  content: '\\F2A6'; }\n\n.zmdi-laptop:before {\n  content: '\\F2A7'; }\n\n.zmdi-mic-off:before {\n  content: '\\F2A8'; }\n\n.zmdi-mic-outline:before {\n  content: '\\F2A9'; }\n\n.zmdi-mic-setting:before {\n  content: '\\F2AA'; }\n\n.zmdi-mic:before {\n  content: '\\F2AB'; }\n\n.zmdi-mouse:before {\n  content: '\\F2AC'; }\n\n.zmdi-network-alert:before {\n  content: '\\F2AD'; }\n\n.zmdi-network-locked:before {\n  content: '\\F2AE'; }\n\n.zmdi-network-off:before {\n  content: '\\F2AF'; }\n\n.zmdi-network-outline:before {\n  content: '\\F2B0'; }\n\n.zmdi-network-setting:before {\n  content: '\\F2B1'; }\n\n.zmdi-network:before {\n  content: '\\F2B2'; }\n\n.zmdi-phone-bluetooth:before {\n  content: '\\F2B3'; }\n\n.zmdi-phone-end:before {\n  content: '\\F2B4'; }\n\n.zmdi-phone-forwarded:before {\n  content: '\\F2B5'; }\n\n.zmdi-phone-in-talk:before {\n  content: '\\F2B6'; }\n\n.zmdi-phone-locked:before {\n  content: '\\F2B7'; }\n\n.zmdi-phone-missed:before {\n  content: '\\F2B8'; }\n\n.zmdi-phone-msg:before {\n  content: '\\F2B9'; }\n\n.zmdi-phone-paused:before {\n  content: '\\F2BA'; }\n\n.zmdi-phone-ring:before {\n  content: '\\F2BB'; }\n\n.zmdi-phone-setting:before {\n  content: '\\F2BC'; }\n\n.zmdi-phone-sip:before {\n  content: '\\F2BD'; }\n\n.zmdi-phone:before {\n  content: '\\F2BE'; }\n\n.zmdi-portable-wifi-changes:before {\n  content: '\\F2BF'; }\n\n.zmdi-portable-wifi-off:before {\n  content: '\\F2C0'; }\n\n.zmdi-portable-wifi:before {\n  content: '\\F2C1'; }\n\n.zmdi-radio:before {\n  content: '\\F2C2'; }\n\n.zmdi-reader:before {\n  content: '\\F2C3'; }\n\n.zmdi-remote-control-alt:before {\n  content: '\\F2C4'; }\n\n.zmdi-remote-control:before {\n  content: '\\F2C5'; }\n\n.zmdi-router:before {\n  content: '\\F2C6'; }\n\n.zmdi-scanner:before {\n  content: '\\F2C7'; }\n\n.zmdi-smartphone-android:before {\n  content: '\\F2C8'; }\n\n.zmdi-smartphone-download:before {\n  content: '\\F2C9'; }\n\n.zmdi-smartphone-erase:before {\n  content: '\\F2CA'; }\n\n.zmdi-smartphone-info:before {\n  content: '\\F2CB'; }\n\n.zmdi-smartphone-iphone:before {\n  content: '\\F2CC'; }\n\n.zmdi-smartphone-landscape-lock:before {\n  content: '\\F2CD'; }\n\n.zmdi-smartphone-landscape:before {\n  content: '\\F2CE'; }\n\n.zmdi-smartphone-lock:before {\n  content: '\\F2CF'; }\n\n.zmdi-smartphone-portrait-lock:before {\n  content: '\\F2D0'; }\n\n.zmdi-smartphone-ring:before {\n  content: '\\F2D1'; }\n\n.zmdi-smartphone-setting:before {\n  content: '\\F2D2'; }\n\n.zmdi-smartphone-setup:before {\n  content: '\\F2D3'; }\n\n.zmdi-smartphone:before {\n  content: '\\F2D4'; }\n\n.zmdi-speaker:before {\n  content: '\\F2D5'; }\n\n.zmdi-tablet-android:before {\n  content: '\\F2D6'; }\n\n.zmdi-tablet-mac:before {\n  content: '\\F2D7'; }\n\n.zmdi-tablet:before {\n  content: '\\F2D8'; }\n\n.zmdi-tv-alt-play:before {\n  content: '\\F2D9'; }\n\n.zmdi-tv-list:before {\n  content: '\\F2DA'; }\n\n.zmdi-tv-play:before {\n  content: '\\F2DB'; }\n\n.zmdi-tv:before {\n  content: '\\F2DC'; }\n\n.zmdi-usb:before {\n  content: '\\F2DD'; }\n\n.zmdi-videocam-off:before {\n  content: '\\F2DE'; }\n\n.zmdi-videocam-switch:before {\n  content: '\\F2DF'; }\n\n.zmdi-videocam:before {\n  content: '\\F2E0'; }\n\n.zmdi-watch:before {\n  content: '\\F2E1'; }\n\n.zmdi-wifi-alt-2:before {\n  content: '\\F2E2'; }\n\n.zmdi-wifi-alt:before {\n  content: '\\F2E3'; }\n\n.zmdi-wifi-info:before {\n  content: '\\F2E4'; }\n\n.zmdi-wifi-lock:before {\n  content: '\\F2E5'; }\n\n.zmdi-wifi-off:before {\n  content: '\\F2E6'; }\n\n.zmdi-wifi-outline:before {\n  content: '\\F2E7'; }\n\n.zmdi-wifi:before {\n  content: '\\F2E8'; }\n\n.zmdi-arrow-left-bottom:before {\n  content: '\\F2E9'; }\n\n.zmdi-arrow-left:before {\n  content: '\\F2EA'; }\n\n.zmdi-arrow-merge:before {\n  content: '\\F2EB'; }\n\n.zmdi-arrow-missed:before {\n  content: '\\F2EC'; }\n\n.zmdi-arrow-right-top:before {\n  content: '\\F2ED'; }\n\n.zmdi-arrow-right:before {\n  content: '\\F2EE'; }\n\n.zmdi-arrow-split:before {\n  content: '\\F2EF'; }\n\n.zmdi-arrows:before {\n  content: '\\F2F0'; }\n\n.zmdi-caret-down-circle:before {\n  content: '\\F2F1'; }\n\n.zmdi-caret-down:before {\n  content: '\\F2F2'; }\n\n.zmdi-caret-left-circle:before {\n  content: '\\F2F3'; }\n\n.zmdi-caret-left:before {\n  content: '\\F2F4'; }\n\n.zmdi-caret-right-circle:before {\n  content: '\\F2F5'; }\n\n.zmdi-caret-right:before {\n  content: '\\F2F6'; }\n\n.zmdi-caret-up-circle:before {\n  content: '\\F2F7'; }\n\n.zmdi-caret-up:before {\n  content: '\\F2F8'; }\n\n.zmdi-chevron-down:before {\n  content: '\\F2F9'; }\n\n.zmdi-chevron-left:before {\n  content: '\\F2FA'; }\n\n.zmdi-chevron-right:before {\n  content: '\\F2FB'; }\n\n.zmdi-chevron-up:before {\n  content: '\\F2FC'; }\n\n.zmdi-forward:before {\n  content: '\\F2FD'; }\n\n.zmdi-long-arrow-down:before {\n  content: '\\F2FE'; }\n\n.zmdi-long-arrow-left:before {\n  content: '\\F2FF'; }\n\n.zmdi-long-arrow-return:before {\n  content: '\\F300'; }\n\n.zmdi-long-arrow-right:before {\n  content: '\\F301'; }\n\n.zmdi-long-arrow-tab:before {\n  content: '\\F302'; }\n\n.zmdi-long-arrow-up:before {\n  content: '\\F303'; }\n\n.zmdi-rotate-ccw:before {\n  content: '\\F304'; }\n\n.zmdi-rotate-cw:before {\n  content: '\\F305'; }\n\n.zmdi-rotate-left:before {\n  content: '\\F306'; }\n\n.zmdi-rotate-right:before {\n  content: '\\F307'; }\n\n.zmdi-square-down:before {\n  content: '\\F308'; }\n\n.zmdi-square-right:before {\n  content: '\\F309'; }\n\n.zmdi-swap-alt:before {\n  content: '\\F30A'; }\n\n.zmdi-swap-vertical-circle:before {\n  content: '\\F30B'; }\n\n.zmdi-swap-vertical:before {\n  content: '\\F30C'; }\n\n.zmdi-swap:before {\n  content: '\\F30D'; }\n\n.zmdi-trending-down:before {\n  content: '\\F30E'; }\n\n.zmdi-trending-flat:before {\n  content: '\\F30F'; }\n\n.zmdi-trending-up:before {\n  content: '\\F310'; }\n\n.zmdi-unfold-less:before {\n  content: '\\F311'; }\n\n.zmdi-unfold-more:before {\n  content: '\\F312'; }\n\n.zmdi-apps:before {\n  content: '\\F313'; }\n\n.zmdi-grid-off:before {\n  content: '\\F314'; }\n\n.zmdi-grid:before {\n  content: '\\F315'; }\n\n.zmdi-view-agenda:before {\n  content: '\\F316'; }\n\n.zmdi-view-array:before {\n  content: '\\F317'; }\n\n.zmdi-view-carousel:before {\n  content: '\\F318'; }\n\n.zmdi-view-column:before {\n  content: '\\F319'; }\n\n.zmdi-view-comfy:before {\n  content: '\\F31A'; }\n\n.zmdi-view-compact:before {\n  content: '\\F31B'; }\n\n.zmdi-view-dashboard:before {\n  content: '\\F31C'; }\n\n.zmdi-view-day:before {\n  content: '\\F31D'; }\n\n.zmdi-view-headline:before {\n  content: '\\F31E'; }\n\n.zmdi-view-list-alt:before {\n  content: '\\F31F'; }\n\n.zmdi-view-list:before {\n  content: '\\F320'; }\n\n.zmdi-view-module:before {\n  content: '\\F321'; }\n\n.zmdi-view-quilt:before {\n  content: '\\F322'; }\n\n.zmdi-view-stream:before {\n  content: '\\F323'; }\n\n.zmdi-view-subtitles:before {\n  content: '\\F324'; }\n\n.zmdi-view-toc:before {\n  content: '\\F325'; }\n\n.zmdi-view-web:before {\n  content: '\\F326'; }\n\n.zmdi-view-week:before {\n  content: '\\F327'; }\n\n.zmdi-widgets:before {\n  content: '\\F328'; }\n\n.zmdi-alarm-check:before {\n  content: '\\F329'; }\n\n.zmdi-alarm-off:before {\n  content: '\\F32A'; }\n\n.zmdi-alarm-plus:before {\n  content: '\\F32B'; }\n\n.zmdi-alarm-snooze:before {\n  content: '\\F32C'; }\n\n.zmdi-alarm:before {\n  content: '\\F32D'; }\n\n.zmdi-calendar-alt:before {\n  content: '\\F32E'; }\n\n.zmdi-calendar-check:before {\n  content: '\\F32F'; }\n\n.zmdi-calendar-close:before {\n  content: '\\F330'; }\n\n.zmdi-calendar-note:before {\n  content: '\\F331'; }\n\n.zmdi-calendar:before {\n  content: '\\F332'; }\n\n.zmdi-time-countdown:before {\n  content: '\\F333'; }\n\n.zmdi-time-interval:before {\n  content: '\\F334'; }\n\n.zmdi-time-restore-setting:before {\n  content: '\\F335'; }\n\n.zmdi-time-restore:before {\n  content: '\\F336'; }\n\n.zmdi-time:before {\n  content: '\\F337'; }\n\n.zmdi-timer-off:before {\n  content: '\\F338'; }\n\n.zmdi-timer:before {\n  content: '\\F339'; }\n\n.zmdi-android-alt:before {\n  content: '\\F33A'; }\n\n.zmdi-android:before {\n  content: '\\F33B'; }\n\n.zmdi-apple:before {\n  content: '\\F33C'; }\n\n.zmdi-behance:before {\n  content: '\\F33D'; }\n\n.zmdi-codepen:before {\n  content: '\\F33E'; }\n\n.zmdi-dribbble:before {\n  content: '\\F33F'; }\n\n.zmdi-dropbox:before {\n  content: '\\F340'; }\n\n.zmdi-evernote:before {\n  content: '\\F341'; }\n\n.zmdi-facebook-box:before {\n  content: '\\F342'; }\n\n.zmdi-facebook:before {\n  content: '\\F343'; }\n\n.zmdi-github-box:before {\n  content: '\\F344'; }\n\n.zmdi-github:before {\n  content: '\\F345'; }\n\n.zmdi-google-drive:before {\n  content: '\\F346'; }\n\n.zmdi-google-earth:before {\n  content: '\\F347'; }\n\n.zmdi-google-glass:before {\n  content: '\\F348'; }\n\n.zmdi-google-maps:before {\n  content: '\\F349'; }\n\n.zmdi-google-pages:before {\n  content: '\\F34A'; }\n\n.zmdi-google-play:before {\n  content: '\\F34B'; }\n\n.zmdi-google-plus-box:before {\n  content: '\\F34C'; }\n\n.zmdi-google-plus:before {\n  content: '\\F34D'; }\n\n.zmdi-google:before {\n  content: '\\F34E'; }\n\n.zmdi-instagram:before {\n  content: '\\F34F'; }\n\n.zmdi-language-css3:before {\n  content: '\\F350'; }\n\n.zmdi-language-html5:before {\n  content: '\\F351'; }\n\n.zmdi-language-javascript:before {\n  content: '\\F352'; }\n\n.zmdi-language-python-alt:before {\n  content: '\\F353'; }\n\n.zmdi-language-python:before {\n  content: '\\F354'; }\n\n.zmdi-lastfm:before {\n  content: '\\F355'; }\n\n.zmdi-linkedin-box:before {\n  content: '\\F356'; }\n\n.zmdi-paypal:before {\n  content: '\\F357'; }\n\n.zmdi-pinterest-box:before {\n  content: '\\F358'; }\n\n.zmdi-pocket:before {\n  content: '\\F359'; }\n\n.zmdi-polymer:before {\n  content: '\\F35A'; }\n\n.zmdi-share:before {\n  content: '\\F35B'; }\n\n.zmdi-stackoverflow:before {\n  content: '\\F35C'; }\n\n.zmdi-steam-square:before {\n  content: '\\F35D'; }\n\n.zmdi-steam:before {\n  content: '\\F35E'; }\n\n.zmdi-twitter-box:before {\n  content: '\\F35F'; }\n\n.zmdi-twitter:before {\n  content: '\\F360'; }\n\n.zmdi-vk:before {\n  content: '\\F361'; }\n\n.zmdi-wikipedia:before {\n  content: '\\F362'; }\n\n.zmdi-windows:before {\n  content: '\\F363'; }\n\n.zmdi-aspect-ratio-alt:before {\n  content: '\\F364'; }\n\n.zmdi-aspect-ratio:before {\n  content: '\\F365'; }\n\n.zmdi-blur-circular:before {\n  content: '\\F366'; }\n\n.zmdi-blur-linear:before {\n  content: '\\F367'; }\n\n.zmdi-blur-off:before {\n  content: '\\F368'; }\n\n.zmdi-blur:before {\n  content: '\\F369'; }\n\n.zmdi-brightness-2:before {\n  content: '\\F36A'; }\n\n.zmdi-brightness-3:before {\n  content: '\\F36B'; }\n\n.zmdi-brightness-4:before {\n  content: '\\F36C'; }\n\n.zmdi-brightness-5:before {\n  content: '\\F36D'; }\n\n.zmdi-brightness-6:before {\n  content: '\\F36E'; }\n\n.zmdi-brightness-7:before {\n  content: '\\F36F'; }\n\n.zmdi-brightness-auto:before {\n  content: '\\F370'; }\n\n.zmdi-brightness-setting:before {\n  content: '\\F371'; }\n\n.zmdi-broken-image:before {\n  content: '\\F372'; }\n\n.zmdi-center-focus-strong:before {\n  content: '\\F373'; }\n\n.zmdi-center-focus-weak:before {\n  content: '\\F374'; }\n\n.zmdi-compare:before {\n  content: '\\F375'; }\n\n.zmdi-crop-16-9:before {\n  content: '\\F376'; }\n\n.zmdi-crop-3-2:before {\n  content: '\\F377'; }\n\n.zmdi-crop-5-4:before {\n  content: '\\F378'; }\n\n.zmdi-crop-7-5:before {\n  content: '\\F379'; }\n\n.zmdi-crop-din:before {\n  content: '\\F37A'; }\n\n.zmdi-crop-free:before {\n  content: '\\F37B'; }\n\n.zmdi-crop-landscape:before {\n  content: '\\F37C'; }\n\n.zmdi-crop-portrait:before {\n  content: '\\F37D'; }\n\n.zmdi-crop-square:before {\n  content: '\\F37E'; }\n\n.zmdi-exposure-alt:before {\n  content: '\\F37F'; }\n\n.zmdi-exposure:before {\n  content: '\\F380'; }\n\n.zmdi-filter-b-and-w:before {\n  content: '\\F381'; }\n\n.zmdi-filter-center-focus:before {\n  content: '\\F382'; }\n\n.zmdi-filter-frames:before {\n  content: '\\F383'; }\n\n.zmdi-filter-tilt-shift:before {\n  content: '\\F384'; }\n\n.zmdi-gradient:before {\n  content: '\\F385'; }\n\n.zmdi-grain:before {\n  content: '\\F386'; }\n\n.zmdi-graphic-eq:before {\n  content: '\\F387'; }\n\n.zmdi-hdr-off:before {\n  content: '\\F388'; }\n\n.zmdi-hdr-strong:before {\n  content: '\\F389'; }\n\n.zmdi-hdr-weak:before {\n  content: '\\F38A'; }\n\n.zmdi-hdr:before {\n  content: '\\F38B'; }\n\n.zmdi-iridescent:before {\n  content: '\\F38C'; }\n\n.zmdi-leak-off:before {\n  content: '\\F38D'; }\n\n.zmdi-leak:before {\n  content: '\\F38E'; }\n\n.zmdi-looks:before {\n  content: '\\F38F'; }\n\n.zmdi-loupe:before {\n  content: '\\F390'; }\n\n.zmdi-panorama-horizontal:before {\n  content: '\\F391'; }\n\n.zmdi-panorama-vertical:before {\n  content: '\\F392'; }\n\n.zmdi-panorama-wide-angle:before {\n  content: '\\F393'; }\n\n.zmdi-photo-size-select-large:before {\n  content: '\\F394'; }\n\n.zmdi-photo-size-select-small:before {\n  content: '\\F395'; }\n\n.zmdi-picture-in-picture:before {\n  content: '\\F396'; }\n\n.zmdi-slideshow:before {\n  content: '\\F397'; }\n\n.zmdi-texture:before {\n  content: '\\F398'; }\n\n.zmdi-tonality:before {\n  content: '\\F399'; }\n\n.zmdi-vignette:before {\n  content: '\\F39A'; }\n\n.zmdi-wb-auto:before {\n  content: '\\F39B'; }\n\n.zmdi-eject-alt:before {\n  content: '\\F39C'; }\n\n.zmdi-eject:before {\n  content: '\\F39D'; }\n\n.zmdi-equalizer:before {\n  content: '\\F39E'; }\n\n.zmdi-fast-forward:before {\n  content: '\\F39F'; }\n\n.zmdi-fast-rewind:before {\n  content: '\\F3A0'; }\n\n.zmdi-forward-10:before {\n  content: '\\F3A1'; }\n\n.zmdi-forward-30:before {\n  content: '\\F3A2'; }\n\n.zmdi-forward-5:before {\n  content: '\\F3A3'; }\n\n.zmdi-hearing:before {\n  content: '\\F3A4'; }\n\n.zmdi-pause-circle-outline:before {\n  content: '\\F3A5'; }\n\n.zmdi-pause-circle:before {\n  content: '\\F3A6'; }\n\n.zmdi-pause:before {\n  content: '\\F3A7'; }\n\n.zmdi-play-circle-outline:before {\n  content: '\\F3A8'; }\n\n.zmdi-play-circle:before {\n  content: '\\F3A9'; }\n\n.zmdi-play:before {\n  content: '\\F3AA'; }\n\n.zmdi-playlist-audio:before {\n  content: '\\F3AB'; }\n\n.zmdi-playlist-plus:before {\n  content: '\\F3AC'; }\n\n.zmdi-repeat-one:before {\n  content: '\\F3AD'; }\n\n.zmdi-repeat:before {\n  content: '\\F3AE'; }\n\n.zmdi-replay-10:before {\n  content: '\\F3AF'; }\n\n.zmdi-replay-30:before {\n  content: '\\F3B0'; }\n\n.zmdi-replay-5:before {\n  content: '\\F3B1'; }\n\n.zmdi-replay:before {\n  content: '\\F3B2'; }\n\n.zmdi-shuffle:before {\n  content: '\\F3B3'; }\n\n.zmdi-skip-next:before {\n  content: '\\F3B4'; }\n\n.zmdi-skip-previous:before {\n  content: '\\F3B5'; }\n\n.zmdi-stop:before {\n  content: '\\F3B6'; }\n\n.zmdi-surround-sound:before {\n  content: '\\F3B7'; }\n\n.zmdi-tune:before {\n  content: '\\F3B8'; }\n\n.zmdi-volume-down:before {\n  content: '\\F3B9'; }\n\n.zmdi-volume-mute:before {\n  content: '\\F3BA'; }\n\n.zmdi-volume-off:before {\n  content: '\\F3BB'; }\n\n.zmdi-volume-up:before {\n  content: '\\F3BC'; }\n\n.zmdi-n-1-square:before {\n  content: '\\F3BD'; }\n\n.zmdi-n-2-square:before {\n  content: '\\F3BE'; }\n\n.zmdi-n-3-square:before {\n  content: '\\F3BF'; }\n\n.zmdi-n-4-square:before {\n  content: '\\F3C0'; }\n\n.zmdi-n-5-square:before {\n  content: '\\F3C1'; }\n\n.zmdi-n-6-square:before {\n  content: '\\F3C2'; }\n\n.zmdi-neg-1:before {\n  content: '\\F3C3'; }\n\n.zmdi-neg-2:before {\n  content: '\\F3C4'; }\n\n.zmdi-plus-1:before {\n  content: '\\F3C5'; }\n\n.zmdi-plus-2:before {\n  content: '\\F3C6'; }\n\n.zmdi-sec-10:before {\n  content: '\\F3C7'; }\n\n.zmdi-sec-3:before {\n  content: '\\F3C8'; }\n\n.zmdi-zero:before {\n  content: '\\F3C9'; }\n\n.zmdi-airline-seat-flat-angled:before {\n  content: '\\F3CA'; }\n\n.zmdi-airline-seat-flat:before {\n  content: '\\F3CB'; }\n\n.zmdi-airline-seat-individual-suite:before {\n  content: '\\F3CC'; }\n\n.zmdi-airline-seat-legroom-extra:before {\n  content: '\\F3CD'; }\n\n.zmdi-airline-seat-legroom-normal:before {\n  content: '\\F3CE'; }\n\n.zmdi-airline-seat-legroom-reduced:before {\n  content: '\\F3CF'; }\n\n.zmdi-airline-seat-recline-extra:before {\n  content: '\\F3D0'; }\n\n.zmdi-airline-seat-recline-normal:before {\n  content: '\\F3D1'; }\n\n.zmdi-airplay:before {\n  content: '\\F3D2'; }\n\n.zmdi-closed-caption:before {\n  content: '\\F3D3'; }\n\n.zmdi-confirmation-number:before {\n  content: '\\F3D4'; }\n\n.zmdi-developer-board:before {\n  content: '\\F3D5'; }\n\n.zmdi-disc-full:before {\n  content: '\\F3D6'; }\n\n.zmdi-explicit:before {\n  content: '\\F3D7'; }\n\n.zmdi-flight-land:before {\n  content: '\\F3D8'; }\n\n.zmdi-flight-takeoff:before {\n  content: '\\F3D9'; }\n\n.zmdi-flip-to-back:before {\n  content: '\\F3DA'; }\n\n.zmdi-flip-to-front:before {\n  content: '\\F3DB'; }\n\n.zmdi-group-work:before {\n  content: '\\F3DC'; }\n\n.zmdi-hd:before {\n  content: '\\F3DD'; }\n\n.zmdi-hq:before {\n  content: '\\F3DE'; }\n\n.zmdi-markunread-mailbox:before {\n  content: '\\F3DF'; }\n\n.zmdi-memory:before {\n  content: '\\F3E0'; }\n\n.zmdi-nfc:before {\n  content: '\\F3E1'; }\n\n.zmdi-play-for-work:before {\n  content: '\\F3E2'; }\n\n.zmdi-power-input:before {\n  content: '\\F3E3'; }\n\n.zmdi-present-to-all:before {\n  content: '\\F3E4'; }\n\n.zmdi-satellite:before {\n  content: '\\F3E5'; }\n\n.zmdi-tap-and-play:before {\n  content: '\\F3E6'; }\n\n.zmdi-vibration:before {\n  content: '\\F3E7'; }\n\n.zmdi-voicemail:before {\n  content: '\\F3E8'; }\n\n.zmdi-group:before {\n  content: '\\F3E9'; }\n\n.zmdi-rss:before {\n  content: '\\F3EA'; }\n\n.zmdi-shape:before {\n  content: '\\F3EB'; }\n\n.zmdi-spinner:before {\n  content: '\\F3EC'; }\n\n.zmdi-ungroup:before {\n  content: '\\F3ED'; }\n\n.zmdi-500px:before {\n  content: '\\F3EE'; }\n\n.zmdi-8tracks:before {\n  content: '\\F3EF'; }\n\n.zmdi-amazon:before {\n  content: '\\F3F0'; }\n\n.zmdi-blogger:before {\n  content: '\\F3F1'; }\n\n.zmdi-delicious:before {\n  content: '\\F3F2'; }\n\n.zmdi-disqus:before {\n  content: '\\F3F3'; }\n\n.zmdi-flattr:before {\n  content: '\\F3F4'; }\n\n.zmdi-flickr:before {\n  content: '\\F3F5'; }\n\n.zmdi-github-alt:before {\n  content: '\\F3F6'; }\n\n.zmdi-google-old:before {\n  content: '\\F3F7'; }\n\n.zmdi-linkedin:before {\n  content: '\\F3F8'; }\n\n.zmdi-odnoklassniki:before {\n  content: '\\F3F9'; }\n\n.zmdi-outlook:before {\n  content: '\\F3FA'; }\n\n.zmdi-paypal-alt:before {\n  content: '\\F3FB'; }\n\n.zmdi-pinterest:before {\n  content: '\\F3FC'; }\n\n.zmdi-playstation:before {\n  content: '\\F3FD'; }\n\n.zmdi-reddit:before {\n  content: '\\F3FE'; }\n\n.zmdi-skype:before {\n  content: '\\F3FF'; }\n\n.zmdi-slideshare:before {\n  content: '\\F400'; }\n\n.zmdi-soundcloud:before {\n  content: '\\F401'; }\n\n.zmdi-tumblr:before {\n  content: '\\F402'; }\n\n.zmdi-twitch:before {\n  content: '\\F403'; }\n\n.zmdi-vimeo:before {\n  content: '\\F404'; }\n\n.zmdi-whatsapp:before {\n  content: '\\F405'; }\n\n.zmdi-xbox:before {\n  content: '\\F406'; }\n\n.zmdi-yahoo:before {\n  content: '\\F407'; }\n\n.zmdi-youtube-play:before {\n  content: '\\F408'; }\n\n.zmdi-youtube:before {\n  content: '\\F409'; }\n\n.zmdi-3d-rotation:before {\n  content: '\\F101'; }\n\n.zmdi-airplane-off:before {\n  content: '\\F102'; }\n\n.zmdi-airplane:before {\n  content: '\\F103'; }\n\n.zmdi-album:before {\n  content: '\\F104'; }\n\n.zmdi-archive:before {\n  content: '\\F105'; }\n\n.zmdi-assignment-account:before {\n  content: '\\F106'; }\n\n.zmdi-assignment-alert:before {\n  content: '\\F107'; }\n\n.zmdi-assignment-check:before {\n  content: '\\F108'; }\n\n.zmdi-assignment-o:before {\n  content: '\\F109'; }\n\n.zmdi-assignment-return:before {\n  content: '\\F10A'; }\n\n.zmdi-assignment-returned:before {\n  content: '\\F10B'; }\n\n.zmdi-assignment:before {\n  content: '\\F10C'; }\n\n.zmdi-attachment-alt:before {\n  content: '\\F10D'; }\n\n.zmdi-attachment:before {\n  content: '\\F10E'; }\n\n.zmdi-audio:before {\n  content: '\\F10F'; }\n\n.zmdi-badge-check:before {\n  content: '\\F110'; }\n\n.zmdi-balance-wallet:before {\n  content: '\\F111'; }\n\n.zmdi-balance:before {\n  content: '\\F112'; }\n\n.zmdi-battery-alert:before {\n  content: '\\F113'; }\n\n.zmdi-battery-flash:before {\n  content: '\\F114'; }\n\n.zmdi-battery-unknown:before {\n  content: '\\F115'; }\n\n.zmdi-battery:before {\n  content: '\\F116'; }\n\n.zmdi-bike:before {\n  content: '\\F117'; }\n\n.zmdi-block-alt:before {\n  content: '\\F118'; }\n\n.zmdi-block:before {\n  content: '\\F119'; }\n\n.zmdi-boat:before {\n  content: '\\F11A'; }\n\n.zmdi-book-image:before {\n  content: '\\F11B'; }\n\n.zmdi-book:before {\n  content: '\\F11C'; }\n\n.zmdi-bookmark-outline:before {\n  content: '\\F11D'; }\n\n.zmdi-bookmark:before {\n  content: '\\F11E'; }\n\n.zmdi-brush:before {\n  content: '\\F11F'; }\n\n.zmdi-bug:before {\n  content: '\\F120'; }\n\n.zmdi-bus:before {\n  content: '\\F121'; }\n\n.zmdi-cake:before {\n  content: '\\F122'; }\n\n.zmdi-car-taxi:before {\n  content: '\\F123'; }\n\n.zmdi-car-wash:before {\n  content: '\\F124'; }\n\n.zmdi-car:before {\n  content: '\\F125'; }\n\n.zmdi-card-giftcard:before {\n  content: '\\F126'; }\n\n.zmdi-card-membership:before {\n  content: '\\F127'; }\n\n.zmdi-card-travel:before {\n  content: '\\F128'; }\n\n.zmdi-card:before {\n  content: '\\F129'; }\n\n.zmdi-case-check:before {\n  content: '\\F12A'; }\n\n.zmdi-case-download:before {\n  content: '\\F12B'; }\n\n.zmdi-case-play:before {\n  content: '\\F12C'; }\n\n.zmdi-case:before {\n  content: '\\F12D'; }\n\n.zmdi-cast-connected:before {\n  content: '\\F12E'; }\n\n.zmdi-cast:before {\n  content: '\\F12F'; }\n\n.zmdi-chart-donut:before {\n  content: '\\F130'; }\n\n.zmdi-chart:before {\n  content: '\\F131'; }\n\n.zmdi-city-alt:before {\n  content: '\\F132'; }\n\n.zmdi-city:before {\n  content: '\\F133'; }\n\n.zmdi-close-circle-o:before {\n  content: '\\F134'; }\n\n.zmdi-close-circle:before {\n  content: '\\F135'; }\n\n.zmdi-close:before {\n  content: '\\F136'; }\n\n.zmdi-cocktail:before {\n  content: '\\F137'; }\n\n.zmdi-code-setting:before {\n  content: '\\F138'; }\n\n.zmdi-code-smartphone:before {\n  content: '\\F139'; }\n\n.zmdi-code:before {\n  content: '\\F13A'; }\n\n.zmdi-coffee:before {\n  content: '\\F13B'; }\n\n.zmdi-collection-bookmark:before {\n  content: '\\F13C'; }\n\n.zmdi-collection-case-play:before {\n  content: '\\F13D'; }\n\n.zmdi-collection-folder-image:before {\n  content: '\\F13E'; }\n\n.zmdi-collection-image-o:before {\n  content: '\\F13F'; }\n\n.zmdi-collection-image:before {\n  content: '\\F140'; }\n\n.zmdi-collection-item-1:before {\n  content: '\\F141'; }\n\n.zmdi-collection-item-2:before {\n  content: '\\F142'; }\n\n.zmdi-collection-item-3:before {\n  content: '\\F143'; }\n\n.zmdi-collection-item-4:before {\n  content: '\\F144'; }\n\n.zmdi-collection-item-5:before {\n  content: '\\F145'; }\n\n.zmdi-collection-item-6:before {\n  content: '\\F146'; }\n\n.zmdi-collection-item-7:before {\n  content: '\\F147'; }\n\n.zmdi-collection-item-8:before {\n  content: '\\F148'; }\n\n.zmdi-collection-item-9-plus:before {\n  content: '\\F149'; }\n\n.zmdi-collection-item-9:before {\n  content: '\\F14A'; }\n\n.zmdi-collection-item:before {\n  content: '\\F14B'; }\n\n.zmdi-collection-music:before {\n  content: '\\F14C'; }\n\n.zmdi-collection-pdf:before {\n  content: '\\F14D'; }\n\n.zmdi-collection-plus:before {\n  content: '\\F14E'; }\n\n.zmdi-collection-speaker:before {\n  content: '\\F14F'; }\n\n.zmdi-collection-text:before {\n  content: '\\F150'; }\n\n.zmdi-collection-video:before {\n  content: '\\F151'; }\n\n.zmdi-compass:before {\n  content: '\\F152'; }\n\n.zmdi-cutlery:before {\n  content: '\\F153'; }\n\n.zmdi-delete:before {\n  content: '\\F154'; }\n\n.zmdi-dialpad:before {\n  content: '\\F155'; }\n\n.zmdi-dns:before {\n  content: '\\F156'; }\n\n.zmdi-drink:before {\n  content: '\\F157'; }\n\n.zmdi-edit:before {\n  content: '\\F158'; }\n\n.zmdi-email-open:before {\n  content: '\\F159'; }\n\n.zmdi-email:before {\n  content: '\\F15A'; }\n\n.zmdi-eye-off:before {\n  content: '\\F15B'; }\n\n.zmdi-eye:before {\n  content: '\\F15C'; }\n\n.zmdi-eyedropper:before {\n  content: '\\F15D'; }\n\n.zmdi-favorite-outline:before {\n  content: '\\F15E'; }\n\n.zmdi-favorite:before {\n  content: '\\F15F'; }\n\n.zmdi-filter-list:before {\n  content: '\\F160'; }\n\n.zmdi-fire:before {\n  content: '\\F161'; }\n\n.zmdi-flag:before {\n  content: '\\F162'; }\n\n.zmdi-flare:before {\n  content: '\\F163'; }\n\n.zmdi-flash-auto:before {\n  content: '\\F164'; }\n\n.zmdi-flash-off:before {\n  content: '\\F165'; }\n\n.zmdi-flash:before {\n  content: '\\F166'; }\n\n.zmdi-flip:before {\n  content: '\\F167'; }\n\n.zmdi-flower-alt:before {\n  content: '\\F168'; }\n\n.zmdi-flower:before {\n  content: '\\F169'; }\n\n.zmdi-font:before {\n  content: '\\F16A'; }\n\n.zmdi-fullscreen-alt:before {\n  content: '\\F16B'; }\n\n.zmdi-fullscreen-exit:before {\n  content: '\\F16C'; }\n\n.zmdi-fullscreen:before {\n  content: '\\F16D'; }\n\n.zmdi-functions:before {\n  content: '\\F16E'; }\n\n.zmdi-gas-station:before {\n  content: '\\F16F'; }\n\n.zmdi-gesture:before {\n  content: '\\F170'; }\n\n.zmdi-globe-alt:before {\n  content: '\\F171'; }\n\n.zmdi-globe-lock:before {\n  content: '\\F172'; }\n\n.zmdi-globe:before {\n  content: '\\F173'; }\n\n.zmdi-graduation-cap:before {\n  content: '\\F174'; }\n\n.zmdi-home:before {\n  content: '\\F175'; }\n\n.zmdi-hospital-alt:before {\n  content: '\\F176'; }\n\n.zmdi-hospital:before {\n  content: '\\F177'; }\n\n.zmdi-hotel:before {\n  content: '\\F178'; }\n\n.zmdi-hourglass-alt:before {\n  content: '\\F179'; }\n\n.zmdi-hourglass-outline:before {\n  content: '\\F17A'; }\n\n.zmdi-hourglass:before {\n  content: '\\F17B'; }\n\n.zmdi-http:before {\n  content: '\\F17C'; }\n\n.zmdi-image-alt:before {\n  content: '\\F17D'; }\n\n.zmdi-image-o:before {\n  content: '\\F17E'; }\n\n.zmdi-image:before {\n  content: '\\F17F'; }\n\n.zmdi-inbox:before {\n  content: '\\F180'; }\n\n.zmdi-invert-colors-off:before {\n  content: '\\F181'; }\n\n.zmdi-invert-colors:before {\n  content: '\\F182'; }\n\n.zmdi-key:before {\n  content: '\\F183'; }\n\n.zmdi-label-alt-outline:before {\n  content: '\\F184'; }\n\n.zmdi-label-alt:before {\n  content: '\\F185'; }\n\n.zmdi-label-heart:before {\n  content: '\\F186'; }\n\n.zmdi-label:before {\n  content: '\\F187'; }\n\n.zmdi-labels:before {\n  content: '\\F188'; }\n\n.zmdi-lamp:before {\n  content: '\\F189'; }\n\n.zmdi-landscape:before {\n  content: '\\F18A'; }\n\n.zmdi-layers-off:before {\n  content: '\\F18B'; }\n\n.zmdi-layers:before {\n  content: '\\F18C'; }\n\n.zmdi-library:before {\n  content: '\\F18D'; }\n\n.zmdi-link:before {\n  content: '\\F18E'; }\n\n.zmdi-lock-open:before {\n  content: '\\F18F'; }\n\n.zmdi-lock-outline:before {\n  content: '\\F190'; }\n\n.zmdi-lock:before {\n  content: '\\F191'; }\n\n.zmdi-mail-reply-all:before {\n  content: '\\F192'; }\n\n.zmdi-mail-reply:before {\n  content: '\\F193'; }\n\n.zmdi-mail-send:before {\n  content: '\\F194'; }\n\n.zmdi-mall:before {\n  content: '\\F195'; }\n\n.zmdi-map:before {\n  content: '\\F196'; }\n\n.zmdi-menu:before {\n  content: '\\F197'; }\n\n.zmdi-money-box:before {\n  content: '\\F198'; }\n\n.zmdi-money-off:before {\n  content: '\\F199'; }\n\n.zmdi-money:before {\n  content: '\\F19A'; }\n\n.zmdi-more-vert:before {\n  content: '\\F19B'; }\n\n.zmdi-more:before {\n  content: '\\F19C'; }\n\n.zmdi-movie-alt:before {\n  content: '\\F19D'; }\n\n.zmdi-movie:before {\n  content: '\\F19E'; }\n\n.zmdi-nature-people:before {\n  content: '\\F19F'; }\n\n.zmdi-nature:before {\n  content: '\\F1A0'; }\n\n.zmdi-navigation:before {\n  content: '\\F1A1'; }\n\n.zmdi-open-in-browser:before {\n  content: '\\F1A2'; }\n\n.zmdi-open-in-new:before {\n  content: '\\F1A3'; }\n\n.zmdi-palette:before {\n  content: '\\F1A4'; }\n\n.zmdi-parking:before {\n  content: '\\F1A5'; }\n\n.zmdi-pin-account:before {\n  content: '\\F1A6'; }\n\n.zmdi-pin-assistant:before {\n  content: '\\F1A7'; }\n\n.zmdi-pin-drop:before {\n  content: '\\F1A8'; }\n\n.zmdi-pin-help:before {\n  content: '\\F1A9'; }\n\n.zmdi-pin-off:before {\n  content: '\\F1AA'; }\n\n.zmdi-pin:before {\n  content: '\\F1AB'; }\n\n.zmdi-pizza:before {\n  content: '\\F1AC'; }\n\n.zmdi-plaster:before {\n  content: '\\F1AD'; }\n\n.zmdi-power-setting:before {\n  content: '\\F1AE'; }\n\n.zmdi-power:before {\n  content: '\\F1AF'; }\n\n.zmdi-print:before {\n  content: '\\F1B0'; }\n\n.zmdi-puzzle-piece:before {\n  content: '\\F1B1'; }\n\n.zmdi-quote:before {\n  content: '\\F1B2'; }\n\n.zmdi-railway:before {\n  content: '\\F1B3'; }\n\n.zmdi-receipt:before {\n  content: '\\F1B4'; }\n\n.zmdi-refresh-alt:before {\n  content: '\\F1B5'; }\n\n.zmdi-refresh-sync-alert:before {\n  content: '\\F1B6'; }\n\n.zmdi-refresh-sync-off:before {\n  content: '\\F1B7'; }\n\n.zmdi-refresh-sync:before {\n  content: '\\F1B8'; }\n\n.zmdi-refresh:before {\n  content: '\\F1B9'; }\n\n.zmdi-roller:before {\n  content: '\\F1BA'; }\n\n.zmdi-ruler:before {\n  content: '\\F1BB'; }\n\n.zmdi-scissors:before {\n  content: '\\F1BC'; }\n\n.zmdi-screen-rotation-lock:before {\n  content: '\\F1BD'; }\n\n.zmdi-screen-rotation:before {\n  content: '\\F1BE'; }\n\n.zmdi-search-for:before {\n  content: '\\F1BF'; }\n\n.zmdi-search-in-file:before {\n  content: '\\F1C0'; }\n\n.zmdi-search-in-page:before {\n  content: '\\F1C1'; }\n\n.zmdi-search-replace:before {\n  content: '\\F1C2'; }\n\n.zmdi-search:before {\n  content: '\\F1C3'; }\n\n.zmdi-seat:before {\n  content: '\\F1C4'; }\n\n.zmdi-settings-square:before {\n  content: '\\F1C5'; }\n\n.zmdi-settings:before {\n  content: '\\F1C6'; }\n\n.zmdi-shield-check:before {\n  content: '\\F1C7'; }\n\n.zmdi-shield-security:before {\n  content: '\\F1C8'; }\n\n.zmdi-shopping-basket:before {\n  content: '\\F1C9'; }\n\n.zmdi-shopping-cart-plus:before {\n  content: '\\F1CA'; }\n\n.zmdi-shopping-cart:before {\n  content: '\\F1CB'; }\n\n.zmdi-sign-in:before {\n  content: '\\F1CC'; }\n\n.zmdi-sort-amount-asc:before {\n  content: '\\F1CD'; }\n\n.zmdi-sort-amount-desc:before {\n  content: '\\F1CE'; }\n\n.zmdi-sort-asc:before {\n  content: '\\F1CF'; }\n\n.zmdi-sort-desc:before {\n  content: '\\F1D0'; }\n\n.zmdi-spellcheck:before {\n  content: '\\F1D1'; }\n\n.zmdi-storage:before {\n  content: '\\F1D2'; }\n\n.zmdi-store-24:before {\n  content: '\\F1D3'; }\n\n.zmdi-store:before {\n  content: '\\F1D4'; }\n\n.zmdi-subway:before {\n  content: '\\F1D5'; }\n\n.zmdi-sun:before {\n  content: '\\F1D6'; }\n\n.zmdi-tab-unselected:before {\n  content: '\\F1D7'; }\n\n.zmdi-tab:before {\n  content: '\\F1D8'; }\n\n.zmdi-tag-close:before {\n  content: '\\F1D9'; }\n\n.zmdi-tag-more:before {\n  content: '\\F1DA'; }\n\n.zmdi-tag:before {\n  content: '\\F1DB'; }\n\n.zmdi-thumb-down:before {\n  content: '\\F1DC'; }\n\n.zmdi-thumb-up-down:before {\n  content: '\\F1DD'; }\n\n.zmdi-thumb-up:before {\n  content: '\\F1DE'; }\n\n.zmdi-ticket-star:before {\n  content: '\\F1DF'; }\n\n.zmdi-toll:before {\n  content: '\\F1E0'; }\n\n.zmdi-toys:before {\n  content: '\\F1E1'; }\n\n.zmdi-traffic:before {\n  content: '\\F1E2'; }\n\n.zmdi-translate:before {\n  content: '\\F1E3'; }\n\n.zmdi-triangle-down:before {\n  content: '\\F1E4'; }\n\n.zmdi-triangle-up:before {\n  content: '\\F1E5'; }\n\n.zmdi-truck:before {\n  content: '\\F1E6'; }\n\n.zmdi-turning-sign:before {\n  content: '\\F1E7'; }\n\n.zmdi-wallpaper:before {\n  content: '\\F1E8'; }\n\n.zmdi-washing-machine:before {\n  content: '\\F1E9'; }\n\n.zmdi-window-maximize:before {\n  content: '\\F1EA'; }\n\n.zmdi-window-minimize:before {\n  content: '\\F1EB'; }\n\n.zmdi-window-restore:before {\n  content: '\\F1EC'; }\n\n.zmdi-wrench:before {\n  content: '\\F1ED'; }\n\n.zmdi-zoom-in:before {\n  content: '\\F1EE'; }\n\n.zmdi-zoom-out:before {\n  content: '\\F1EF'; }\n\n.zmdi-alert-circle-o:before {\n  content: '\\F1F0'; }\n\n.zmdi-alert-circle:before {\n  content: '\\F1F1'; }\n\n.zmdi-alert-octagon:before {\n  content: '\\F1F2'; }\n\n.zmdi-alert-polygon:before {\n  content: '\\F1F3'; }\n\n.zmdi-alert-triangle:before {\n  content: '\\F1F4'; }\n\n.zmdi-help-outline:before {\n  content: '\\F1F5'; }\n\n.zmdi-help:before {\n  content: '\\F1F6'; }\n\n.zmdi-info-outline:before {\n  content: '\\F1F7'; }\n\n.zmdi-info:before {\n  content: '\\F1F8'; }\n\n.zmdi-notifications-active:before {\n  content: '\\F1F9'; }\n\n.zmdi-notifications-add:before {\n  content: '\\F1FA'; }\n\n.zmdi-notifications-none:before {\n  content: '\\F1FB'; }\n\n.zmdi-notifications-off:before {\n  content: '\\F1FC'; }\n\n.zmdi-notifications-paused:before {\n  content: '\\F1FD'; }\n\n.zmdi-notifications:before {\n  content: '\\F1FE'; }\n\n.zmdi-account-add:before {\n  content: '\\F1FF'; }\n\n.zmdi-account-box-mail:before {\n  content: '\\F200'; }\n\n.zmdi-account-box-o:before {\n  content: '\\F201'; }\n\n.zmdi-account-box-phone:before {\n  content: '\\F202'; }\n\n.zmdi-account-box:before {\n  content: '\\F203'; }\n\n.zmdi-account-calendar:before {\n  content: '\\F204'; }\n\n.zmdi-account-circle:before {\n  content: '\\F205'; }\n\n.zmdi-account-o:before {\n  content: '\\F206'; }\n\n.zmdi-account:before {\n  content: '\\F207'; }\n\n.zmdi-accounts-add:before {\n  content: '\\F208'; }\n\n.zmdi-accounts-alt:before {\n  content: '\\F209'; }\n\n.zmdi-accounts-list-alt:before {\n  content: '\\F20A'; }\n\n.zmdi-accounts-list:before {\n  content: '\\F20B'; }\n\n.zmdi-accounts-outline:before {\n  content: '\\F20C'; }\n\n.zmdi-accounts:before {\n  content: '\\F20D'; }\n\n.zmdi-face:before {\n  content: '\\F20E'; }\n\n.zmdi-female:before {\n  content: '\\F20F'; }\n\n.zmdi-male-alt:before {\n  content: '\\F210'; }\n\n.zmdi-male-female:before {\n  content: '\\F211'; }\n\n.zmdi-male:before {\n  content: '\\F212'; }\n\n.zmdi-mood-bad:before {\n  content: '\\F213'; }\n\n.zmdi-mood:before {\n  content: '\\F214'; }\n\n.zmdi-run:before {\n  content: '\\F215'; }\n\n.zmdi-walk:before {\n  content: '\\F216'; }\n\n.zmdi-cloud-box:before {\n  content: '\\F217'; }\n\n.zmdi-cloud-circle:before {\n  content: '\\F218'; }\n\n.zmdi-cloud-done:before {\n  content: '\\F219'; }\n\n.zmdi-cloud-download:before {\n  content: '\\F21A'; }\n\n.zmdi-cloud-off:before {\n  content: '\\F21B'; }\n\n.zmdi-cloud-outline-alt:before {\n  content: '\\F21C'; }\n\n.zmdi-cloud-outline:before {\n  content: '\\F21D'; }\n\n.zmdi-cloud-upload:before {\n  content: '\\F21E'; }\n\n.zmdi-cloud:before {\n  content: '\\F21F'; }\n\n.zmdi-download:before {\n  content: '\\F220'; }\n\n.zmdi-file-plus:before {\n  content: '\\F221'; }\n\n.zmdi-file-text:before {\n  content: '\\F222'; }\n\n.zmdi-file:before {\n  content: '\\F223'; }\n\n.zmdi-folder-outline:before {\n  content: '\\F224'; }\n\n.zmdi-folder-person:before {\n  content: '\\F225'; }\n\n.zmdi-folder-star-alt:before {\n  content: '\\F226'; }\n\n.zmdi-folder-star:before {\n  content: '\\F227'; }\n\n.zmdi-folder:before {\n  content: '\\F228'; }\n\n.zmdi-gif:before {\n  content: '\\F229'; }\n\n.zmdi-upload:before {\n  content: '\\F22A'; }\n\n.zmdi-border-all:before {\n  content: '\\F22B'; }\n\n.zmdi-border-bottom:before {\n  content: '\\F22C'; }\n\n.zmdi-border-clear:before {\n  content: '\\F22D'; }\n\n.zmdi-border-color:before {\n  content: '\\F22E'; }\n\n.zmdi-border-horizontal:before {\n  content: '\\F22F'; }\n\n.zmdi-border-inner:before {\n  content: '\\F230'; }\n\n.zmdi-border-left:before {\n  content: '\\F231'; }\n\n.zmdi-border-outer:before {\n  content: '\\F232'; }\n\n.zmdi-border-right:before {\n  content: '\\F233'; }\n\n.zmdi-border-style:before {\n  content: '\\F234'; }\n\n.zmdi-border-top:before {\n  content: '\\F235'; }\n\n.zmdi-border-vertical:before {\n  content: '\\F236'; }\n\n.zmdi-copy:before {\n  content: '\\F237'; }\n\n.zmdi-crop:before {\n  content: '\\F238'; }\n\n.zmdi-format-align-center:before {\n  content: '\\F239'; }\n\n.zmdi-format-align-justify:before {\n  content: '\\F23A'; }\n\n.zmdi-format-align-left:before {\n  content: '\\F23B'; }\n\n.zmdi-format-align-right:before {\n  content: '\\F23C'; }\n\n.zmdi-format-bold:before {\n  content: '\\F23D'; }\n\n.zmdi-format-clear-all:before {\n  content: '\\F23E'; }\n\n.zmdi-format-clear:before {\n  content: '\\F23F'; }\n\n.zmdi-format-color-fill:before {\n  content: '\\F240'; }\n\n.zmdi-format-color-reset:before {\n  content: '\\F241'; }\n\n.zmdi-format-color-text:before {\n  content: '\\F242'; }\n\n.zmdi-format-indent-decrease:before {\n  content: '\\F243'; }\n\n.zmdi-format-indent-increase:before {\n  content: '\\F244'; }\n\n.zmdi-format-italic:before {\n  content: '\\F245'; }\n\n.zmdi-format-line-spacing:before {\n  content: '\\F246'; }\n\n.zmdi-format-list-bulleted:before {\n  content: '\\F247'; }\n\n.zmdi-format-list-numbered:before {\n  content: '\\F248'; }\n\n.zmdi-format-ltr:before {\n  content: '\\F249'; }\n\n.zmdi-format-rtl:before {\n  content: '\\F24A'; }\n\n.zmdi-format-size:before {\n  content: '\\F24B'; }\n\n.zmdi-format-strikethrough-s:before {\n  content: '\\F24C'; }\n\n.zmdi-format-strikethrough:before {\n  content: '\\F24D'; }\n\n.zmdi-format-subject:before {\n  content: '\\F24E'; }\n\n.zmdi-format-underlined:before {\n  content: '\\F24F'; }\n\n.zmdi-format-valign-bottom:before {\n  content: '\\F250'; }\n\n.zmdi-format-valign-center:before {\n  content: '\\F251'; }\n\n.zmdi-format-valign-top:before {\n  content: '\\F252'; }\n\n.zmdi-redo:before {\n  content: '\\F253'; }\n\n.zmdi-select-all:before {\n  content: '\\F254'; }\n\n.zmdi-space-bar:before {\n  content: '\\F255'; }\n\n.zmdi-text-format:before {\n  content: '\\F256'; }\n\n.zmdi-transform:before {\n  content: '\\F257'; }\n\n.zmdi-undo:before {\n  content: '\\F258'; }\n\n.zmdi-wrap-text:before {\n  content: '\\F259'; }\n\n.zmdi-comment-alert:before {\n  content: '\\F25A'; }\n\n.zmdi-comment-alt-text:before {\n  content: '\\F25B'; }\n\n.zmdi-comment-alt:before {\n  content: '\\F25C'; }\n\n.zmdi-comment-edit:before {\n  content: '\\F25D'; }\n\n.zmdi-comment-image:before {\n  content: '\\F25E'; }\n\n.zmdi-comment-list:before {\n  content: '\\F25F'; }\n\n.zmdi-comment-more:before {\n  content: '\\F260'; }\n\n.zmdi-comment-outline:before {\n  content: '\\F261'; }\n\n.zmdi-comment-text-alt:before {\n  content: '\\F262'; }\n\n.zmdi-comment-text:before {\n  content: '\\F263'; }\n\n.zmdi-comment-video:before {\n  content: '\\F264'; }\n\n.zmdi-comment:before {\n  content: '\\F265'; }\n\n.zmdi-comments:before {\n  content: '\\F266'; }\n\n.zmdi-check-all:before {\n  content: '\\F267'; }\n\n.zmdi-check-circle-u:before {\n  content: '\\F268'; }\n\n.zmdi-check-circle:before {\n  content: '\\F269'; }\n\n.zmdi-check-square:before {\n  content: '\\F26A'; }\n\n.zmdi-check:before {\n  content: '\\F26B'; }\n\n.zmdi-circle-o:before {\n  content: '\\F26C'; }\n\n.zmdi-circle:before {\n  content: '\\F26D'; }\n\n.zmdi-dot-circle-alt:before {\n  content: '\\F26E'; }\n\n.zmdi-dot-circle:before {\n  content: '\\F26F'; }\n\n.zmdi-minus-circle-outline:before {\n  content: '\\F270'; }\n\n.zmdi-minus-circle:before {\n  content: '\\F271'; }\n\n.zmdi-minus-square:before {\n  content: '\\F272'; }\n\n.zmdi-minus:before {\n  content: '\\F273'; }\n\n.zmdi-plus-circle-o-duplicate:before {\n  content: '\\F274'; }\n\n.zmdi-plus-circle-o:before {\n  content: '\\F275'; }\n\n.zmdi-plus-circle:before {\n  content: '\\F276'; }\n\n.zmdi-plus-square:before {\n  content: '\\F277'; }\n\n.zmdi-plus:before {\n  content: '\\F278'; }\n\n.zmdi-square-o:before {\n  content: '\\F279'; }\n\n.zmdi-star-circle:before {\n  content: '\\F27A'; }\n\n.zmdi-star-half:before {\n  content: '\\F27B'; }\n\n.zmdi-star-outline:before {\n  content: '\\F27C'; }\n\n.zmdi-star:before {\n  content: '\\F27D'; }\n\n.zmdi-bluetooth-connected:before {\n  content: '\\F27E'; }\n\n.zmdi-bluetooth-off:before {\n  content: '\\F27F'; }\n\n.zmdi-bluetooth-search:before {\n  content: '\\F280'; }\n\n.zmdi-bluetooth-setting:before {\n  content: '\\F281'; }\n\n.zmdi-bluetooth:before {\n  content: '\\F282'; }\n\n.zmdi-camera-add:before {\n  content: '\\F283'; }\n\n.zmdi-camera-alt:before {\n  content: '\\F284'; }\n\n.zmdi-camera-bw:before {\n  content: '\\F285'; }\n\n.zmdi-camera-front:before {\n  content: '\\F286'; }\n\n.zmdi-camera-mic:before {\n  content: '\\F287'; }\n\n.zmdi-camera-party-mode:before {\n  content: '\\F288'; }\n\n.zmdi-camera-rear:before {\n  content: '\\F289'; }\n\n.zmdi-camera-roll:before {\n  content: '\\F28A'; }\n\n.zmdi-camera-switch:before {\n  content: '\\F28B'; }\n\n.zmdi-camera:before {\n  content: '\\F28C'; }\n\n.zmdi-card-alert:before {\n  content: '\\F28D'; }\n\n.zmdi-card-off:before {\n  content: '\\F28E'; }\n\n.zmdi-card-sd:before {\n  content: '\\F28F'; }\n\n.zmdi-card-sim:before {\n  content: '\\F290'; }\n\n.zmdi-desktop-mac:before {\n  content: '\\F291'; }\n\n.zmdi-desktop-windows:before {\n  content: '\\F292'; }\n\n.zmdi-device-hub:before {\n  content: '\\F293'; }\n\n.zmdi-devices-off:before {\n  content: '\\F294'; }\n\n.zmdi-devices:before {\n  content: '\\F295'; }\n\n.zmdi-dock:before {\n  content: '\\F296'; }\n\n.zmdi-floppy:before {\n  content: '\\F297'; }\n\n.zmdi-gamepad:before {\n  content: '\\F298'; }\n\n.zmdi-gps-dot:before {\n  content: '\\F299'; }\n\n.zmdi-gps-off:before {\n  content: '\\F29A'; }\n\n.zmdi-gps:before {\n  content: '\\F29B'; }\n\n.zmdi-headset-mic:before {\n  content: '\\F29C'; }\n\n.zmdi-headset:before {\n  content: '\\F29D'; }\n\n.zmdi-input-antenna:before {\n  content: '\\F29E'; }\n\n.zmdi-input-composite:before {\n  content: '\\F29F'; }\n\n.zmdi-input-hdmi:before {\n  content: '\\F2A0'; }\n\n.zmdi-input-power:before {\n  content: '\\F2A1'; }\n\n.zmdi-input-svideo:before {\n  content: '\\F2A2'; }\n\n.zmdi-keyboard-hide:before {\n  content: '\\F2A3'; }\n\n.zmdi-keyboard:before {\n  content: '\\F2A4'; }\n\n.zmdi-laptop-chromebook:before {\n  content: '\\F2A5'; }\n\n.zmdi-laptop-mac:before {\n  content: '\\F2A6'; }\n\n.zmdi-laptop:before {\n  content: '\\F2A7'; }\n\n.zmdi-mic-off:before {\n  content: '\\F2A8'; }\n\n.zmdi-mic-outline:before {\n  content: '\\F2A9'; }\n\n.zmdi-mic-setting:before {\n  content: '\\F2AA'; }\n\n.zmdi-mic:before {\n  content: '\\F2AB'; }\n\n.zmdi-mouse:before {\n  content: '\\F2AC'; }\n\n.zmdi-network-alert:before {\n  content: '\\F2AD'; }\n\n.zmdi-network-locked:before {\n  content: '\\F2AE'; }\n\n.zmdi-network-off:before {\n  content: '\\F2AF'; }\n\n.zmdi-network-outline:before {\n  content: '\\F2B0'; }\n\n.zmdi-network-setting:before {\n  content: '\\F2B1'; }\n\n.zmdi-network:before {\n  content: '\\F2B2'; }\n\n.zmdi-phone-bluetooth:before {\n  content: '\\F2B3'; }\n\n.zmdi-phone-end:before {\n  content: '\\F2B4'; }\n\n.zmdi-phone-forwarded:before {\n  content: '\\F2B5'; }\n\n.zmdi-phone-in-talk:before {\n  content: '\\F2B6'; }\n\n.zmdi-phone-locked:before {\n  content: '\\F2B7'; }\n\n.zmdi-phone-missed:before {\n  content: '\\F2B8'; }\n\n.zmdi-phone-msg:before {\n  content: '\\F2B9'; }\n\n.zmdi-phone-paused:before {\n  content: '\\F2BA'; }\n\n.zmdi-phone-ring:before {\n  content: '\\F2BB'; }\n\n.zmdi-phone-setting:before {\n  content: '\\F2BC'; }\n\n.zmdi-phone-sip:before {\n  content: '\\F2BD'; }\n\n.zmdi-phone:before {\n  content: '\\F2BE'; }\n\n.zmdi-portable-wifi-changes:before {\n  content: '\\F2BF'; }\n\n.zmdi-portable-wifi-off:before {\n  content: '\\F2C0'; }\n\n.zmdi-portable-wifi:before {\n  content: '\\F2C1'; }\n\n.zmdi-radio:before {\n  content: '\\F2C2'; }\n\n.zmdi-reader:before {\n  content: '\\F2C3'; }\n\n.zmdi-remote-control-alt:before {\n  content: '\\F2C4'; }\n\n.zmdi-remote-control:before {\n  content: '\\F2C5'; }\n\n.zmdi-router:before {\n  content: '\\F2C6'; }\n\n.zmdi-scanner:before {\n  content: '\\F2C7'; }\n\n.zmdi-smartphone-android:before {\n  content: '\\F2C8'; }\n\n.zmdi-smartphone-download:before {\n  content: '\\F2C9'; }\n\n.zmdi-smartphone-erase:before {\n  content: '\\F2CA'; }\n\n.zmdi-smartphone-info:before {\n  content: '\\F2CB'; }\n\n.zmdi-smartphone-iphone:before {\n  content: '\\F2CC'; }\n\n.zmdi-smartphone-landscape-lock:before {\n  content: '\\F2CD'; }\n\n.zmdi-smartphone-landscape:before {\n  content: '\\F2CE'; }\n\n.zmdi-smartphone-lock:before {\n  content: '\\F2CF'; }\n\n.zmdi-smartphone-portrait-lock:before {\n  content: '\\F2D0'; }\n\n.zmdi-smartphone-ring:before {\n  content: '\\F2D1'; }\n\n.zmdi-smartphone-setting:before {\n  content: '\\F2D2'; }\n\n.zmdi-smartphone-setup:before {\n  content: '\\F2D3'; }\n\n.zmdi-smartphone:before {\n  content: '\\F2D4'; }\n\n.zmdi-speaker:before {\n  content: '\\F2D5'; }\n\n.zmdi-tablet-android:before {\n  content: '\\F2D6'; }\n\n.zmdi-tablet-mac:before {\n  content: '\\F2D7'; }\n\n.zmdi-tablet:before {\n  content: '\\F2D8'; }\n\n.zmdi-tv-alt-play:before {\n  content: '\\F2D9'; }\n\n.zmdi-tv-list:before {\n  content: '\\F2DA'; }\n\n.zmdi-tv-play:before {\n  content: '\\F2DB'; }\n\n.zmdi-tv:before {\n  content: '\\F2DC'; }\n\n.zmdi-usb:before {\n  content: '\\F2DD'; }\n\n.zmdi-videocam-off:before {\n  content: '\\F2DE'; }\n\n.zmdi-videocam-switch:before {\n  content: '\\F2DF'; }\n\n.zmdi-videocam:before {\n  content: '\\F2E0'; }\n\n.zmdi-watch:before {\n  content: '\\F2E1'; }\n\n.zmdi-wifi-alt-2:before {\n  content: '\\F2E2'; }\n\n.zmdi-wifi-alt:before {\n  content: '\\F2E3'; }\n\n.zmdi-wifi-info:before {\n  content: '\\F2E4'; }\n\n.zmdi-wifi-lock:before {\n  content: '\\F2E5'; }\n\n.zmdi-wifi-off:before {\n  content: '\\F2E6'; }\n\n.zmdi-wifi-outline:before {\n  content: '\\F2E7'; }\n\n.zmdi-wifi:before {\n  content: '\\F2E8'; }\n\n.zmdi-arrow-left-bottom:before {\n  content: '\\F2E9'; }\n\n.zmdi-arrow-left:before {\n  content: '\\F2EA'; }\n\n.zmdi-arrow-merge:before {\n  content: '\\F2EB'; }\n\n.zmdi-arrow-missed:before {\n  content: '\\F2EC'; }\n\n.zmdi-arrow-right-top:before {\n  content: '\\F2ED'; }\n\n.zmdi-arrow-right:before {\n  content: '\\F2EE'; }\n\n.zmdi-arrow-split:before {\n  content: '\\F2EF'; }\n\n.zmdi-arrows:before {\n  content: '\\F2F0'; }\n\n.zmdi-caret-down-circle:before {\n  content: '\\F2F1'; }\n\n.zmdi-caret-down:before {\n  content: '\\F2F2'; }\n\n.zmdi-caret-left-circle:before {\n  content: '\\F2F3'; }\n\n.zmdi-caret-left:before {\n  content: '\\F2F4'; }\n\n.zmdi-caret-right-circle:before {\n  content: '\\F2F5'; }\n\n.zmdi-caret-right:before {\n  content: '\\F2F6'; }\n\n.zmdi-caret-up-circle:before {\n  content: '\\F2F7'; }\n\n.zmdi-caret-up:before {\n  content: '\\F2F8'; }\n\n.zmdi-chevron-down:before {\n  content: '\\F2F9'; }\n\n.zmdi-chevron-left:before {\n  content: '\\F2FA'; }\n\n.zmdi-chevron-right:before {\n  content: '\\F2FB'; }\n\n.zmdi-chevron-up:before {\n  content: '\\F2FC'; }\n\n.zmdi-forward:before {\n  content: '\\F2FD'; }\n\n.zmdi-long-arrow-down:before {\n  content: '\\F2FE'; }\n\n.zmdi-long-arrow-left:before {\n  content: '\\F2FF'; }\n\n.zmdi-long-arrow-return:before {\n  content: '\\F300'; }\n\n.zmdi-long-arrow-right:before {\n  content: '\\F301'; }\n\n.zmdi-long-arrow-tab:before {\n  content: '\\F302'; }\n\n.zmdi-long-arrow-up:before {\n  content: '\\F303'; }\n\n.zmdi-rotate-ccw:before {\n  content: '\\F304'; }\n\n.zmdi-rotate-cw:before {\n  content: '\\F305'; }\n\n.zmdi-rotate-left:before {\n  content: '\\F306'; }\n\n.zmdi-rotate-right:before {\n  content: '\\F307'; }\n\n.zmdi-square-down:before {\n  content: '\\F308'; }\n\n.zmdi-square-right:before {\n  content: '\\F309'; }\n\n.zmdi-swap-alt:before {\n  content: '\\F30A'; }\n\n.zmdi-swap-vertical-circle:before {\n  content: '\\F30B'; }\n\n.zmdi-swap-vertical:before {\n  content: '\\F30C'; }\n\n.zmdi-swap:before {\n  content: '\\F30D'; }\n\n.zmdi-trending-down:before {\n  content: '\\F30E'; }\n\n.zmdi-trending-flat:before {\n  content: '\\F30F'; }\n\n.zmdi-trending-up:before {\n  content: '\\F310'; }\n\n.zmdi-unfold-less:before {\n  content: '\\F311'; }\n\n.zmdi-unfold-more:before {\n  content: '\\F312'; }\n\n.zmdi-apps:before {\n  content: '\\F313'; }\n\n.zmdi-grid-off:before {\n  content: '\\F314'; }\n\n.zmdi-grid:before {\n  content: '\\F315'; }\n\n.zmdi-view-agenda:before {\n  content: '\\F316'; }\n\n.zmdi-view-array:before {\n  content: '\\F317'; }\n\n.zmdi-view-carousel:before {\n  content: '\\F318'; }\n\n.zmdi-view-column:before {\n  content: '\\F319'; }\n\n.zmdi-view-comfy:before {\n  content: '\\F31A'; }\n\n.zmdi-view-compact:before {\n  content: '\\F31B'; }\n\n.zmdi-view-dashboard:before {\n  content: '\\F31C'; }\n\n.zmdi-view-day:before {\n  content: '\\F31D'; }\n\n.zmdi-view-headline:before {\n  content: '\\F31E'; }\n\n.zmdi-view-list-alt:before {\n  content: '\\F31F'; }\n\n.zmdi-view-list:before {\n  content: '\\F320'; }\n\n.zmdi-view-module:before {\n  content: '\\F321'; }\n\n.zmdi-view-quilt:before {\n  content: '\\F322'; }\n\n.zmdi-view-stream:before {\n  content: '\\F323'; }\n\n.zmdi-view-subtitles:before {\n  content: '\\F324'; }\n\n.zmdi-view-toc:before {\n  content: '\\F325'; }\n\n.zmdi-view-web:before {\n  content: '\\F326'; }\n\n.zmdi-view-week:before {\n  content: '\\F327'; }\n\n.zmdi-widgets:before {\n  content: '\\F328'; }\n\n.zmdi-alarm-check:before {\n  content: '\\F329'; }\n\n.zmdi-alarm-off:before {\n  content: '\\F32A'; }\n\n.zmdi-alarm-plus:before {\n  content: '\\F32B'; }\n\n.zmdi-alarm-snooze:before {\n  content: '\\F32C'; }\n\n.zmdi-alarm:before {\n  content: '\\F32D'; }\n\n.zmdi-calendar-alt:before {\n  content: '\\F32E'; }\n\n.zmdi-calendar-check:before {\n  content: '\\F32F'; }\n\n.zmdi-calendar-close:before {\n  content: '\\F330'; }\n\n.zmdi-calendar-note:before {\n  content: '\\F331'; }\n\n.zmdi-calendar:before {\n  content: '\\F332'; }\n\n.zmdi-time-countdown:before {\n  content: '\\F333'; }\n\n.zmdi-time-interval:before {\n  content: '\\F334'; }\n\n.zmdi-time-restore-setting:before {\n  content: '\\F335'; }\n\n.zmdi-time-restore:before {\n  content: '\\F336'; }\n\n.zmdi-time:before {\n  content: '\\F337'; }\n\n.zmdi-timer-off:before {\n  content: '\\F338'; }\n\n.zmdi-timer:before {\n  content: '\\F339'; }\n\n.zmdi-android-alt:before {\n  content: '\\F33A'; }\n\n.zmdi-android:before {\n  content: '\\F33B'; }\n\n.zmdi-apple:before {\n  content: '\\F33C'; }\n\n.zmdi-behance:before {\n  content: '\\F33D'; }\n\n.zmdi-codepen:before {\n  content: '\\F33E'; }\n\n.zmdi-dribbble:before {\n  content: '\\F33F'; }\n\n.zmdi-dropbox:before {\n  content: '\\F340'; }\n\n.zmdi-evernote:before {\n  content: '\\F341'; }\n\n.zmdi-facebook-box:before {\n  content: '\\F342'; }\n\n.zmdi-facebook:before {\n  content: '\\F343'; }\n\n.zmdi-github-box:before {\n  content: '\\F344'; }\n\n.zmdi-github:before {\n  content: '\\F345'; }\n\n.zmdi-google-drive:before {\n  content: '\\F346'; }\n\n.zmdi-google-earth:before {\n  content: '\\F347'; }\n\n.zmdi-google-glass:before {\n  content: '\\F348'; }\n\n.zmdi-google-maps:before {\n  content: '\\F349'; }\n\n.zmdi-google-pages:before {\n  content: '\\F34A'; }\n\n.zmdi-google-play:before {\n  content: '\\F34B'; }\n\n.zmdi-google-plus-box:before {\n  content: '\\F34C'; }\n\n.zmdi-google-plus:before {\n  content: '\\F34D'; }\n\n.zmdi-google:before {\n  content: '\\F34E'; }\n\n.zmdi-instagram:before {\n  content: '\\F34F'; }\n\n.zmdi-language-css3:before {\n  content: '\\F350'; }\n\n.zmdi-language-html5:before {\n  content: '\\F351'; }\n\n.zmdi-language-javascript:before {\n  content: '\\F352'; }\n\n.zmdi-language-python-alt:before {\n  content: '\\F353'; }\n\n.zmdi-language-python:before {\n  content: '\\F354'; }\n\n.zmdi-lastfm:before {\n  content: '\\F355'; }\n\n.zmdi-linkedin-box:before {\n  content: '\\F356'; }\n\n.zmdi-paypal:before {\n  content: '\\F357'; }\n\n.zmdi-pinterest-box:before {\n  content: '\\F358'; }\n\n.zmdi-pocket:before {\n  content: '\\F359'; }\n\n.zmdi-polymer:before {\n  content: '\\F35A'; }\n\n.zmdi-share:before {\n  content: '\\F35B'; }\n\n.zmdi-stackoverflow:before {\n  content: '\\F35C'; }\n\n.zmdi-steam-square:before {\n  content: '\\F35D'; }\n\n.zmdi-steam:before {\n  content: '\\F35E'; }\n\n.zmdi-twitter-box:before {\n  content: '\\F35F'; }\n\n.zmdi-twitter:before {\n  content: '\\F360'; }\n\n.zmdi-vk:before {\n  content: '\\F361'; }\n\n.zmdi-wikipedia:before {\n  content: '\\F362'; }\n\n.zmdi-windows:before {\n  content: '\\F363'; }\n\n.zmdi-aspect-ratio-alt:before {\n  content: '\\F364'; }\n\n.zmdi-aspect-ratio:before {\n  content: '\\F365'; }\n\n.zmdi-blur-circular:before {\n  content: '\\F366'; }\n\n.zmdi-blur-linear:before {\n  content: '\\F367'; }\n\n.zmdi-blur-off:before {\n  content: '\\F368'; }\n\n.zmdi-blur:before {\n  content: '\\F369'; }\n\n.zmdi-brightness-2:before {\n  content: '\\F36A'; }\n\n.zmdi-brightness-3:before {\n  content: '\\F36B'; }\n\n.zmdi-brightness-4:before {\n  content: '\\F36C'; }\n\n.zmdi-brightness-5:before {\n  content: '\\F36D'; }\n\n.zmdi-brightness-6:before {\n  content: '\\F36E'; }\n\n.zmdi-brightness-7:before {\n  content: '\\F36F'; }\n\n.zmdi-brightness-auto:before {\n  content: '\\F370'; }\n\n.zmdi-brightness-setting:before {\n  content: '\\F371'; }\n\n.zmdi-broken-image:before {\n  content: '\\F372'; }\n\n.zmdi-center-focus-strong:before {\n  content: '\\F373'; }\n\n.zmdi-center-focus-weak:before {\n  content: '\\F374'; }\n\n.zmdi-compare:before {\n  content: '\\F375'; }\n\n.zmdi-crop-16-9:before {\n  content: '\\F376'; }\n\n.zmdi-crop-3-2:before {\n  content: '\\F377'; }\n\n.zmdi-crop-5-4:before {\n  content: '\\F378'; }\n\n.zmdi-crop-7-5:before {\n  content: '\\F379'; }\n\n.zmdi-crop-din:before {\n  content: '\\F37A'; }\n\n.zmdi-crop-free:before {\n  content: '\\F37B'; }\n\n.zmdi-crop-landscape:before {\n  content: '\\F37C'; }\n\n.zmdi-crop-portrait:before {\n  content: '\\F37D'; }\n\n.zmdi-crop-square:before {\n  content: '\\F37E'; }\n\n.zmdi-exposure-alt:before {\n  content: '\\F37F'; }\n\n.zmdi-exposure:before {\n  content: '\\F380'; }\n\n.zmdi-filter-b-and-w:before {\n  content: '\\F381'; }\n\n.zmdi-filter-center-focus:before {\n  content: '\\F382'; }\n\n.zmdi-filter-frames:before {\n  content: '\\F383'; }\n\n.zmdi-filter-tilt-shift:before {\n  content: '\\F384'; }\n\n.zmdi-gradient:before {\n  content: '\\F385'; }\n\n.zmdi-grain:before {\n  content: '\\F386'; }\n\n.zmdi-graphic-eq:before {\n  content: '\\F387'; }\n\n.zmdi-hdr-off:before {\n  content: '\\F388'; }\n\n.zmdi-hdr-strong:before {\n  content: '\\F389'; }\n\n.zmdi-hdr-weak:before {\n  content: '\\F38A'; }\n\n.zmdi-hdr:before {\n  content: '\\F38B'; }\n\n.zmdi-iridescent:before {\n  content: '\\F38C'; }\n\n.zmdi-leak-off:before {\n  content: '\\F38D'; }\n\n.zmdi-leak:before {\n  content: '\\F38E'; }\n\n.zmdi-looks:before {\n  content: '\\F38F'; }\n\n.zmdi-loupe:before {\n  content: '\\F390'; }\n\n.zmdi-panorama-horizontal:before {\n  content: '\\F391'; }\n\n.zmdi-panorama-vertical:before {\n  content: '\\F392'; }\n\n.zmdi-panorama-wide-angle:before {\n  content: '\\F393'; }\n\n.zmdi-photo-size-select-large:before {\n  content: '\\F394'; }\n\n.zmdi-photo-size-select-small:before {\n  content: '\\F395'; }\n\n.zmdi-picture-in-picture:before {\n  content: '\\F396'; }\n\n.zmdi-slideshow:before {\n  content: '\\F397'; }\n\n.zmdi-texture:before {\n  content: '\\F398'; }\n\n.zmdi-tonality:before {\n  content: '\\F399'; }\n\n.zmdi-vignette:before {\n  content: '\\F39A'; }\n\n.zmdi-wb-auto:before {\n  content: '\\F39B'; }\n\n.zmdi-eject-alt:before {\n  content: '\\F39C'; }\n\n.zmdi-eject:before {\n  content: '\\F39D'; }\n\n.zmdi-equalizer:before {\n  content: '\\F39E'; }\n\n.zmdi-fast-forward:before {\n  content: '\\F39F'; }\n\n.zmdi-fast-rewind:before {\n  content: '\\F3A0'; }\n\n.zmdi-forward-10:before {\n  content: '\\F3A1'; }\n\n.zmdi-forward-30:before {\n  content: '\\F3A2'; }\n\n.zmdi-forward-5:before {\n  content: '\\F3A3'; }\n\n.zmdi-hearing:before {\n  content: '\\F3A4'; }\n\n.zmdi-pause-circle-outline:before {\n  content: '\\F3A5'; }\n\n.zmdi-pause-circle:before {\n  content: '\\F3A6'; }\n\n.zmdi-pause:before {\n  content: '\\F3A7'; }\n\n.zmdi-play-circle-outline:before {\n  content: '\\F3A8'; }\n\n.zmdi-play-circle:before {\n  content: '\\F3A9'; }\n\n.zmdi-play:before {\n  content: '\\F3AA'; }\n\n.zmdi-playlist-audio:before {\n  content: '\\F3AB'; }\n\n.zmdi-playlist-plus:before {\n  content: '\\F3AC'; }\n\n.zmdi-repeat-one:before {\n  content: '\\F3AD'; }\n\n.zmdi-repeat:before {\n  content: '\\F3AE'; }\n\n.zmdi-replay-10:before {\n  content: '\\F3AF'; }\n\n.zmdi-replay-30:before {\n  content: '\\F3B0'; }\n\n.zmdi-replay-5:before {\n  content: '\\F3B1'; }\n\n.zmdi-replay:before {\n  content: '\\F3B2'; }\n\n.zmdi-shuffle:before {\n  content: '\\F3B3'; }\n\n.zmdi-skip-next:before {\n  content: '\\F3B4'; }\n\n.zmdi-skip-previous:before {\n  content: '\\F3B5'; }\n\n.zmdi-stop:before {\n  content: '\\F3B6'; }\n\n.zmdi-surround-sound:before {\n  content: '\\F3B7'; }\n\n.zmdi-tune:before {\n  content: '\\F3B8'; }\n\n.zmdi-volume-down:before {\n  content: '\\F3B9'; }\n\n.zmdi-volume-mute:before {\n  content: '\\F3BA'; }\n\n.zmdi-volume-off:before {\n  content: '\\F3BB'; }\n\n.zmdi-volume-up:before {\n  content: '\\F3BC'; }\n\n.zmdi-n-1-square:before {\n  content: '\\F3BD'; }\n\n.zmdi-n-2-square:before {\n  content: '\\F3BE'; }\n\n.zmdi-n-3-square:before {\n  content: '\\F3BF'; }\n\n.zmdi-n-4-square:before {\n  content: '\\F3C0'; }\n\n.zmdi-n-5-square:before {\n  content: '\\F3C1'; }\n\n.zmdi-n-6-square:before {\n  content: '\\F3C2'; }\n\n.zmdi-neg-1:before {\n  content: '\\F3C3'; }\n\n.zmdi-neg-2:before {\n  content: '\\F3C4'; }\n\n.zmdi-plus-1:before {\n  content: '\\F3C5'; }\n\n.zmdi-plus-2:before {\n  content: '\\F3C6'; }\n\n.zmdi-sec-10:before {\n  content: '\\F3C7'; }\n\n.zmdi-sec-3:before {\n  content: '\\F3C8'; }\n\n.zmdi-zero:before {\n  content: '\\F3C9'; }\n\n.zmdi-airline-seat-flat-angled:before {\n  content: '\\F3CA'; }\n\n.zmdi-airline-seat-flat:before {\n  content: '\\F3CB'; }\n\n.zmdi-airline-seat-individual-suite:before {\n  content: '\\F3CC'; }\n\n.zmdi-airline-seat-legroom-extra:before {\n  content: '\\F3CD'; }\n\n.zmdi-airline-seat-legroom-normal:before {\n  content: '\\F3CE'; }\n\n.zmdi-airline-seat-legroom-reduced:before {\n  content: '\\F3CF'; }\n\n.zmdi-airline-seat-recline-extra:before {\n  content: '\\F3D0'; }\n\n.zmdi-airline-seat-recline-normal:before {\n  content: '\\F3D1'; }\n\n.zmdi-airplay:before {\n  content: '\\F3D2'; }\n\n.zmdi-closed-caption:before {\n  content: '\\F3D3'; }\n\n.zmdi-confirmation-number:before {\n  content: '\\F3D4'; }\n\n.zmdi-developer-board:before {\n  content: '\\F3D5'; }\n\n.zmdi-disc-full:before {\n  content: '\\F3D6'; }\n\n.zmdi-explicit:before {\n  content: '\\F3D7'; }\n\n.zmdi-flight-land:before {\n  content: '\\F3D8'; }\n\n.zmdi-flight-takeoff:before {\n  content: '\\F3D9'; }\n\n.zmdi-flip-to-back:before {\n  content: '\\F3DA'; }\n\n.zmdi-flip-to-front:before {\n  content: '\\F3DB'; }\n\n.zmdi-group-work:before {\n  content: '\\F3DC'; }\n\n.zmdi-hd:before {\n  content: '\\F3DD'; }\n\n.zmdi-hq:before {\n  content: '\\F3DE'; }\n\n.zmdi-markunread-mailbox:before {\n  content: '\\F3DF'; }\n\n.zmdi-memory:before {\n  content: '\\F3E0'; }\n\n.zmdi-nfc:before {\n  content: '\\F3E1'; }\n\n.zmdi-play-for-work:before {\n  content: '\\F3E2'; }\n\n.zmdi-power-input:before {\n  content: '\\F3E3'; }\n\n.zmdi-present-to-all:before {\n  content: '\\F3E4'; }\n\n.zmdi-satellite:before {\n  content: '\\F3E5'; }\n\n.zmdi-tap-and-play:before {\n  content: '\\F3E6'; }\n\n.zmdi-vibration:before {\n  content: '\\F3E7'; }\n\n.zmdi-voicemail:before {\n  content: '\\F3E8'; }\n\n.zmdi-group:before {\n  content: '\\F3E9'; }\n\n.zmdi-rss:before {\n  content: '\\F3EA'; }\n\n.zmdi-shape:before {\n  content: '\\F3EB'; }\n\n.zmdi-spinner:before {\n  content: '\\F3EC'; }\n\n.zmdi-ungroup:before {\n  content: '\\F3ED'; }\n\n.zmdi-500px:before {\n  content: '\\F3EE'; }\n\n.zmdi-8tracks:before {\n  content: '\\F3EF'; }\n\n.zmdi-amazon:before {\n  content: '\\F3F0'; }\n\n.zmdi-blogger:before {\n  content: '\\F3F1'; }\n\n.zmdi-delicious:before {\n  content: '\\F3F2'; }\n\n.zmdi-disqus:before {\n  content: '\\F3F3'; }\n\n.zmdi-flattr:before {\n  content: '\\F3F4'; }\n\n.zmdi-flickr:before {\n  content: '\\F3F5'; }\n\n.zmdi-github-alt:before {\n  content: '\\F3F6'; }\n\n.zmdi-google-old:before {\n  content: '\\F3F7'; }\n\n.zmdi-linkedin:before {\n  content: '\\F3F8'; }\n\n.zmdi-odnoklassniki:before {\n  content: '\\F3F9'; }\n\n.zmdi-outlook:before {\n  content: '\\F3FA'; }\n\n.zmdi-paypal-alt:before {\n  content: '\\F3FB'; }\n\n.zmdi-pinterest:before {\n  content: '\\F3FC'; }\n\n.zmdi-playstation:before {\n  content: '\\F3FD'; }\n\n.zmdi-reddit:before {\n  content: '\\F3FE'; }\n\n.zmdi-skype:before {\n  content: '\\F3FF'; }\n\n.zmdi-slideshare:before {\n  content: '\\F400'; }\n\n.zmdi-soundcloud:before {\n  content: '\\F401'; }\n\n.zmdi-tumblr:before {\n  content: '\\F402'; }\n\n.zmdi-twitch:before {\n  content: '\\F403'; }\n\n.zmdi-vimeo:before {\n  content: '\\F404'; }\n\n.zmdi-whatsapp:before {\n  content: '\\F405'; }\n\n.zmdi-xbox:before {\n  content: '\\F406'; }\n\n.zmdi-yahoo:before {\n  content: '\\F407'; }\n\n.zmdi-youtube-play:before {\n  content: '\\F408'; }\n\n.zmdi-youtube:before {\n  content: '\\F409'; }\n\n.zmdi-import-export:before {\n  content: '\\F30C'; }\n\n.zmdi-swap-vertical-:before {\n  content: '\\F30C'; }\n\n.zmdi-airplanemode-inactive:before {\n  content: '\\F102'; }\n\n.zmdi-airplanemode-active:before {\n  content: '\\F103'; }\n\n.zmdi-rate-review:before {\n  content: '\\F103'; }\n\n.zmdi-comment-sign:before {\n  content: '\\F25A'; }\n\n.zmdi-network-warning:before {\n  content: '\\F2AD'; }\n\n.zmdi-shopping-cart-add:before {\n  content: '\\F1CA'; }\n\n.zmdi-file-add:before {\n  content: '\\F221'; }\n\n.zmdi-network-wifi-scan:before {\n  content: '\\F2E4'; }\n\n.zmdi-collection-add:before {\n  content: '\\F14E'; }\n\n.zmdi-format-playlist-add:before {\n  content: '\\F3AC'; }\n\n.zmdi-format-queue-music:before {\n  content: '\\F3AB'; }\n\n.zmdi-plus-box:before {\n  content: '\\F277'; }\n\n.zmdi-tag-backspace:before {\n  content: '\\F1D9'; }\n\n.zmdi-alarm-add:before {\n  content: '\\F32B'; }\n\n.zmdi-battery-charging:before {\n  content: '\\F114'; }\n\n.zmdi-daydream-setting:before {\n  content: '\\F217'; }\n\n.zmdi-more-horiz:before {\n  content: '\\F19C'; }\n\n.zmdi-book-photo:before {\n  content: '\\F11B'; }\n\n.zmdi-incandescent:before {\n  content: '\\F189'; }\n\n.zmdi-wb-iridescent:before {\n  content: '\\F38C'; }\n\n.zmdi-calendar-remove:before {\n  content: '\\F330'; }\n\n.zmdi-refresh-sync-disabled:before {\n  content: '\\F1B7'; }\n\n.zmdi-refresh-sync-problem:before {\n  content: '\\F1B6'; }\n\n.zmdi-crop-original:before {\n  content: '\\F17E'; }\n\n.zmdi-power-off:before {\n  content: '\\F1AF'; }\n\n.zmdi-power-off-setting:before {\n  content: '\\F1AE'; }\n\n.zmdi-leak-remove:before {\n  content: '\\F38D'; }\n\n.zmdi-star-border:before {\n  content: '\\F27C'; }\n\n.zmdi-brightness-low:before {\n  content: '\\F36D'; }\n\n.zmdi-brightness-medium:before {\n  content: '\\F36E'; }\n\n.zmdi-brightness-high:before {\n  content: '\\F36F'; }\n\n.zmdi-smartphone-portrait:before {\n  content: '\\F2D4'; }\n\n.zmdi-live-tv:before {\n  content: '\\F2D9'; }\n\n.zmdi-format-textdirection-l-to-r:before {\n  content: '\\F249'; }\n\n.zmdi-format-textdirection-r-to-l:before {\n  content: '\\F24A'; }\n\n.zmdi-arrow-back:before {\n  content: '\\F2EA'; }\n\n.zmdi-arrow-forward:before {\n  content: '\\F2EE'; }\n\n.zmdi-arrow-in:before {\n  content: '\\F2E9'; }\n\n.zmdi-arrow-out:before {\n  content: '\\F2ED'; }\n\n.zmdi-rotate-90-degrees-ccw:before {\n  content: '\\F304'; }\n\n.zmdi-adb:before {\n  content: '\\F33A'; }\n\n.zmdi-network-wifi:before {\n  content: '\\F2E8'; }\n\n.zmdi-network-wifi-alt:before {\n  content: '\\F2E3'; }\n\n.zmdi-network-wifi-lock:before {\n  content: '\\F2E5'; }\n\n.zmdi-network-wifi-off:before {\n  content: '\\F2E6'; }\n\n.zmdi-network-wifi-outline:before {\n  content: '\\F2E7'; }\n\n.zmdi-network-wifi-info:before {\n  content: '\\F2E4'; }\n\n.zmdi-layers-clear:before {\n  content: '\\F18B'; }\n\n.zmdi-colorize:before {\n  content: '\\F15D'; }\n\n.zmdi-format-paint:before {\n  content: '\\F1BA'; }\n\n.zmdi-format-quote:before {\n  content: '\\F1B2'; }\n\n.zmdi-camera-monochrome-photos:before {\n  content: '\\F285'; }\n\n.zmdi-sort-by-alpha:before {\n  content: '\\F1CF'; }\n\n.zmdi-folder-shared:before {\n  content: '\\F225'; }\n\n.zmdi-folder-special:before {\n  content: '\\F226'; }\n\n.zmdi-comment-dots:before {\n  content: '\\F260'; }\n\n.zmdi-reorder:before {\n  content: '\\F31E'; }\n\n.zmdi-dehaze:before {\n  content: '\\F197'; }\n\n.zmdi-sort:before {\n  content: '\\F1CE'; }\n\n.zmdi-pages:before {\n  content: '\\F34A'; }\n\n.zmdi-stack-overflow:before {\n  content: '\\F35C'; }\n\n.zmdi-calendar-account:before {\n  content: '\\F204'; }\n\n.zmdi-paste:before {\n  content: '\\F109'; }\n\n.zmdi-cut:before {\n  content: '\\F1BC'; }\n\n.zmdi-save:before {\n  content: '\\F297'; }\n\n.zmdi-smartphone-code:before {\n  content: '\\F139'; }\n\n.zmdi-directions-bike:before {\n  content: '\\F117'; }\n\n.zmdi-directions-boat:before {\n  content: '\\F11A'; }\n\n.zmdi-directions-bus:before {\n  content: '\\F121'; }\n\n.zmdi-directions-car:before {\n  content: '\\F125'; }\n\n.zmdi-directions-railway:before {\n  content: '\\F1B3'; }\n\n.zmdi-directions-run:before {\n  content: '\\F215'; }\n\n.zmdi-directions-subway:before {\n  content: '\\F1D5'; }\n\n.zmdi-directions-walk:before {\n  content: '\\F216'; }\n\n.zmdi-local-hotel:before {\n  content: '\\F178'; }\n\n.zmdi-local-activity:before {\n  content: '\\F1DF'; }\n\n.zmdi-local-play:before {\n  content: '\\F1DF'; }\n\n.zmdi-local-airport:before {\n  content: '\\F103'; }\n\n.zmdi-local-atm:before {\n  content: '\\F198'; }\n\n.zmdi-local-bar:before {\n  content: '\\F137'; }\n\n.zmdi-local-cafe:before {\n  content: '\\F13B'; }\n\n.zmdi-local-car-wash:before {\n  content: '\\F124'; }\n\n.zmdi-local-convenience-store:before {\n  content: '\\F1D3'; }\n\n.zmdi-local-dining:before {\n  content: '\\F153'; }\n\n.zmdi-local-drink:before {\n  content: '\\F157'; }\n\n.zmdi-local-florist:before {\n  content: '\\F168'; }\n\n.zmdi-local-gas-station:before {\n  content: '\\F16F'; }\n\n.zmdi-local-grocery-store:before {\n  content: '\\F1CB'; }\n\n.zmdi-local-hospital:before {\n  content: '\\F177'; }\n\n.zmdi-local-laundry-service:before {\n  content: '\\F1E9'; }\n\n.zmdi-local-library:before {\n  content: '\\F18D'; }\n\n.zmdi-local-mall:before {\n  content: '\\F195'; }\n\n.zmdi-local-movies:before {\n  content: '\\F19D'; }\n\n.zmdi-local-offer:before {\n  content: '\\F187'; }\n\n.zmdi-local-parking:before {\n  content: '\\F1A5'; }\n\n.zmdi-local-parking:before {\n  content: '\\F1A5'; }\n\n.zmdi-local-pharmacy:before {\n  content: '\\F176'; }\n\n.zmdi-local-phone:before {\n  content: '\\F2BE'; }\n\n.zmdi-local-pizza:before {\n  content: '\\F1AC'; }\n\n.zmdi-local-post-office:before {\n  content: '\\F15A'; }\n\n.zmdi-local-printshop:before {\n  content: '\\F1B0'; }\n\n.zmdi-local-see:before {\n  content: '\\F28C'; }\n\n.zmdi-local-shipping:before {\n  content: '\\F1E6'; }\n\n.zmdi-local-store:before {\n  content: '\\F1D4'; }\n\n.zmdi-local-taxi:before {\n  content: '\\F123'; }\n\n.zmdi-local-wc:before {\n  content: '\\F211'; }\n\n.zmdi-my-location:before {\n  content: '\\F299'; }\n\n.zmdi-directions:before {\n  content: '\\F1E7'; }\n\n/* cyrillic */\n@font-face {\n  font-family: 'Amatic SC';\n  font-style: normal;\n  font-weight: 400;\n  src: local(\"Amatic SC Regular\"), local(\"AmaticSC-Regular\"), url(https://fonts.gstatic.com/s/amaticsc/v11/BvkGNM5i0n2wywBsmOxcFhJtnKITppOI_IvcXXDNrsc.woff2) format(\"woff2\");\n  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }\n\n/* hebrew */\n@font-face {\n  font-family: 'Amatic SC';\n  font-style: normal;\n  font-weight: 400;\n  src: local(\"Amatic SC Regular\"), local(\"AmaticSC-Regular\"), url(https://fonts.gstatic.com/s/amaticsc/v11/OpbFR1Tmt2r4Z48lwWGNORJtnKITppOI_IvcXXDNrsc.woff2) format(\"woff2\");\n  unicode-range: U+0590-05FF, U+20AA, U+25CC, U+FB1D-FB4F; }\n\n/* vietnamese */\n@font-face {\n  font-family: 'Amatic SC';\n  font-style: normal;\n  font-weight: 400;\n  src: local(\"Amatic SC Regular\"), local(\"AmaticSC-Regular\"), url(https://fonts.gstatic.com/s/amaticsc/v11/6oAC5EqjVnFivtPX-TgvlRJtnKITppOI_IvcXXDNrsc.woff2) format(\"woff2\");\n  unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB; }\n\n/* latin-ext */\n@font-face {\n  font-family: 'Amatic SC';\n  font-style: normal;\n  font-weight: 400;\n  src: local(\"Amatic SC Regular\"), local(\"AmaticSC-Regular\"), url(https://fonts.gstatic.com/s/amaticsc/v11/6UByihrsVPWtZ99tNMIgMBJtnKITppOI_IvcXXDNrsc.woff2) format(\"woff2\");\n  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF; }\n\n/* latin */\n@font-face {\n  font-family: 'Amatic SC';\n  font-style: normal;\n  font-weight: 400;\n  src: local(\"Amatic SC Regular\"), local(\"AmaticSC-Regular\"), url(https://fonts.gstatic.com/s/amaticsc/v11/DPPfSFKxRTXvae2bKDzp5FtXRa8TVwTICgirnJhmVJw.woff2) format(\"woff2\");\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2212, U+2215; }\n\n/* vietnamese */\n@font-face {\n  font-family: 'Bungee';\n  font-style: normal;\n  font-weight: 400;\n  src: local(\"Bungee\"), local(\"Bungee-Regular\"), url(https://fonts.gstatic.com/s/bungee/v3/Qo62XTKf8oE8gIaZK99LEvesZW2xOQ-xsNqO47m55DA.woff2) format(\"woff2\");\n  unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB; }\n\n/* latin-ext */\n@font-face {\n  font-family: 'Bungee';\n  font-style: normal;\n  font-weight: 400;\n  src: local(\"Bungee\"), local(\"Bungee-Regular\"), url(https://fonts.gstatic.com/s/bungee/v3/Qsxm5yuwoKZ9H2cnA897TPesZW2xOQ-xsNqO47m55DA.woff2) format(\"woff2\");\n  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF; }\n\n/* latin */\n@font-face {\n  font-family: 'Bungee';\n  font-style: normal;\n  font-weight: 400;\n  src: local(\"Bungee\"), local(\"Bungee-Regular\"), url(https://fonts.gstatic.com/s/bungee/v3/86NbnFpNqZ2MU9Gl0ca2YQ.woff2) format(\"woff2\");\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2212, U+2215; }\n\n/* latin */\n@font-face {\n  font-family: 'Indie Flower';\n  font-style: normal;\n  font-weight: 400;\n  src: local(\"Indie Flower\"), local(\"IndieFlower\"), url(https://fonts.gstatic.com/s/indieflower/v9/10JVD_humAd5zP2yrFqw6ugdm0LZdjqr5-oayXSOefg.woff2) format(\"woff2\");\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2212, U+2215; }\n\n/* cyrillic-ext */\n@font-face {\n  font-family: 'Lobster';\n  font-style: normal;\n  font-weight: 400;\n  src: local(\"Lobster Regular\"), local(\"Lobster-Regular\"), url(https://fonts.gstatic.com/s/lobster/v20/lHpQDMs3kBv7PKZOlbpwifY6323mHUZFJMgTvxaG2iE.woff2) format(\"woff2\");\n  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F; }\n\n/* cyrillic */\n@font-face {\n  font-family: 'Lobster';\n  font-style: normal;\n  font-weight: 400;\n  src: local(\"Lobster Regular\"), local(\"Lobster-Regular\"), url(https://fonts.gstatic.com/s/lobster/v20/c28rH3kclCLEuIsGhOg7evY6323mHUZFJMgTvxaG2iE.woff2) format(\"woff2\");\n  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }\n\n/* vietnamese */\n@font-face {\n  font-family: 'Lobster';\n  font-style: normal;\n  font-weight: 400;\n  src: local(\"Lobster Regular\"), local(\"Lobster-Regular\"), url(https://fonts.gstatic.com/s/lobster/v20/RdfS2KomDWXvet4_dZQehvY6323mHUZFJMgTvxaG2iE.woff2) format(\"woff2\");\n  unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB; }\n\n/* latin-ext */\n@font-face {\n  font-family: 'Lobster';\n  font-style: normal;\n  font-weight: 400;\n  src: local(\"Lobster Regular\"), local(\"Lobster-Regular\"), url(https://fonts.gstatic.com/s/lobster/v20/9NqNYV_LP7zlAF8jHr7f1vY6323mHUZFJMgTvxaG2iE.woff2) format(\"woff2\");\n  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF; }\n\n/* latin */\n@font-face {\n  font-family: 'Lobster';\n  font-style: normal;\n  font-weight: 400;\n  src: local(\"Lobster Regular\"), local(\"Lobster-Regular\"), url(https://fonts.gstatic.com/s/lobster/v20/cycBf3mfbGkh66G5NhszPQ.woff2) format(\"woff2\");\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2212, U+2215; }\n\n/* cyrillic-ext */\n@font-face {\n  font-family: 'Open Sans Condensed';\n  font-style: normal;\n  font-weight: 300;\n  src: local(\"Open Sans Condensed Light\"), local(\"OpenSansCondensed-Light\"), url(https://fonts.gstatic.com/s/opensanscondensed/v12/gk5FxslNkTTHtojXrkp-xJwNa6kgmw9HIHjUBPkzL2f3rGVtsTkPsbDajuO5ueQw.woff2) format(\"woff2\");\n  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F; }\n\n/* cyrillic */\n@font-face {\n  font-family: 'Open Sans Condensed';\n  font-style: normal;\n  font-weight: 300;\n  src: local(\"Open Sans Condensed Light\"), local(\"OpenSansCondensed-Light\"), url(https://fonts.gstatic.com/s/opensanscondensed/v12/gk5FxslNkTTHtojXrkp-xKdGPpWTn2kPFru4k7T0T-v3rGVtsTkPsbDajuO5ueQw.woff2) format(\"woff2\");\n  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }\n\n/* greek-ext */\n@font-face {\n  font-family: 'Open Sans Condensed';\n  font-style: normal;\n  font-weight: 300;\n  src: local(\"Open Sans Condensed Light\"), local(\"OpenSansCondensed-Light\"), url(https://fonts.gstatic.com/s/opensanscondensed/v12/gk5FxslNkTTHtojXrkp-xN9i7v7U2vZkHC55NWxtqfn3rGVtsTkPsbDajuO5ueQw.woff2) format(\"woff2\");\n  unicode-range: U+1F00-1FFF; }\n\n/* greek */\n@font-face {\n  font-family: 'Open Sans Condensed';\n  font-style: normal;\n  font-weight: 300;\n  src: local(\"Open Sans Condensed Light\"), local(\"OpenSansCondensed-Light\"), url(https://fonts.gstatic.com/s/opensanscondensed/v12/gk5FxslNkTTHtojXrkp-xK1ueDcgZDcfV3TWANvdPLj3rGVtsTkPsbDajuO5ueQw.woff2) format(\"woff2\");\n  unicode-range: U+0370-03FF; }\n\n/* vietnamese */\n@font-face {\n  font-family: 'Open Sans Condensed';\n  font-style: normal;\n  font-weight: 300;\n  src: local(\"Open Sans Condensed Light\"), local(\"OpenSansCondensed-Light\"), url(https://fonts.gstatic.com/s/opensanscondensed/v12/gk5FxslNkTTHtojXrkp-xC3qj1XlvLGj0jktnJzWu233rGVtsTkPsbDajuO5ueQw.woff2) format(\"woff2\");\n  unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB; }\n\n/* latin-ext */\n@font-face {\n  font-family: 'Open Sans Condensed';\n  font-style: normal;\n  font-weight: 300;\n  src: local(\"Open Sans Condensed Light\"), local(\"OpenSansCondensed-Light\"), url(https://fonts.gstatic.com/s/opensanscondensed/v12/gk5FxslNkTTHtojXrkp-xC8hAQ4ocbp44gFQt8tMfcH3rGVtsTkPsbDajuO5ueQw.woff2) format(\"woff2\");\n  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF; }\n\n/* latin */\n@font-face {\n  font-family: 'Open Sans Condensed';\n  font-style: normal;\n  font-weight: 300;\n  src: local(\"Open Sans Condensed Light\"), local(\"OpenSansCondensed-Light\"), url(https://fonts.gstatic.com/s/opensanscondensed/v12/gk5FxslNkTTHtojXrkp-xBEur64QvLD-0IbiAdTUNXE.woff2) format(\"woff2\");\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2212, U+2215; }\n\n/* latin */\n@font-face {\n  font-family: 'Schoolbell';\n  font-style: normal;\n  font-weight: 400;\n  src: local(\"Schoolbell Regular\"), local(\"Schoolbell-Regular\"), url(https://fonts.gstatic.com/s/schoolbell/v8/BSqn7FernLolrt-MFco9Wvk_vArhqVIZ0nv9q090hN8.woff2) format(\"woff2\");\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2212, U+2215; }\n\n/* latin */\n@font-face {\n  font-family: 'Shadows Into Light';\n  font-style: normal;\n  font-weight: 400;\n  src: local(\"Shadows Into Light\"), local(\"ShadowsIntoLight\"), url(https://fonts.gstatic.com/s/shadowsintolight/v7/clhLqOv7MXn459PTh0gXYFK2TSYBz0eNcHnp4YqE4Ts.woff2) format(\"woff2\");\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2212, U+2215; }\n", ""]);

// exports


/***/ }),
/* 104 */
/***/ (function(module, exports) {

module.exports = "data:application/font-woff2;base64,d09GMgABAAAAAJXwAA4AAAABg4wAAJWQAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP0ZGVE0cBmAAgkIIBBEICoWZPISVYwE2AiQDmDALjBoABCAFhUEHvQI/d2ViZgZbnzqRQsXFdor7Ckjn2DYtERAP8fIYhbgd2KrffledHWhh4wAGz7dj9v/////nJo0x1m3ABiCqWdVX3z+R7HBUQaukw1iix4A+xdZOO2lo3KLGRoeYQnyE6J5NtB9wQcWpKzqxgZS/OhpWsBooyUpelGd1XEJniNnmFtFNJgKBFAqBSIfzDo9GFOpiVqIVEpVSbWNVTVF1JivtKXCIq4V/cGv3qGjB/XGBF9QKO86mvsCcnU14rng5wnCGj/V98wdevjJFZ68YtGZb+f6h52P/sF6y9jOtlrNQjTHGiDWWsp1X+X7pnHPOuMEo2jOPyzkS3lQqP77l/xXrjX3jP3nNtcK4hRdSMte+/tN+/Y7cubPzVjz975A3olpphEIyi2JRUyLkT4akpeMNiHDbPTA2BuvUYAkGSzA1QzGauvDfq/rVmcZF4QEsgfVJiII0ao3xPlpnknyTZAe22zsSITCw3dg7Ej9Pufl/2ATCOiEJkYCERSD3hk0IKlsGCAQIQoCZsCgCLlgmKrSyqeiMSzUue0IVF6xtrUxs1V+7Qhtqu4tdE7pGu/4+scYu7m2dBgio/x8BQzRnzUo2u9lsshIlgShSNFq8JQTzGFrkIBUjcFCh7QltoT1rqVE16kd71t4/NdHz6p3/X5nz/16zuwW7DpqRQA4zGRxFyO89p4y7u4DZIMb+Ovu/2FRtq87bdZjRIJxmMkIOkBXAKSp08DMbhx86AECAp/9kmvrerqr3Z1SylNqccQql8nHm/wNGko0bmtu02BbbmueQcxdSeQEy2TnCP/2lf2bxbnAB04ACUjq+CXfxs5poBSwf4Y/n+Nqsr4LbK/gKyai0jPlCrxqBEjK9zs5yucKVviJjlviuZzRZV+Sr6H+zNqHup+PgFoqHQniEbLuX2ttYYhMlcfrUzT1FQ1kNR4YMjoL6wblRctwVuLn+3zt7vSHYd9aKpITXCeveAO1LWJPwOkD3TssbII9aDvBM2AWWguxRke2TfhFIDnVLIBd5Fk9xpjkXX0M+eP7/vd59Hlho5rvgpEZW+yXl1kiNW2NS4xbQl7+SCkgHAMT+1xu6TsczbUrJLWVwXsgjDiIGQiZmgub/dPl+u3AUrqgotwoWJXBVUFGuRneuMju6O4/Wji3LPsl7vGGYGa1zrkZ6OQ9o7RCsHfhEXPWEVcrqw/ynqnUFnSgjpczY06q2J9vKPS+nrYd7u1zw/wdAfoAA+QGCIlhkFkkWSNEmWDQiZTlsylKUMk+WlHmK47dPU6q977lMJs15DyAtrSjFeSSVIqU7md5PcdnS621Ot70d9zh727kcloo8x3OLjwHySqGghURT1UnIrw+SWolsowPom1/1teYd9x7FIEMRerNFyEoQEREJoeiP37fL2HTio418K20dBfOLzNUV0P0KBKyLo0ALW1nKEkQcv+fH3P8fu3tYv9tLFFJypFkKMnb++9jWP7wqLzEAJUppi1hya+bnLwSAAHxMDX8APjVe3+l7k5e/kIFHKeDi4xv+xtULJCv+ZJPy8+FSx/kr2PvtV+Pe71nlvVNTJOrtinzQejs/xu8/7LqwDQiB8Kv9P3znnBszHML+n304LADkT2fS/yVwn2nOASwB5T+VFwDkhu6GqzJ4rH08ZPKBlT1fuRAxC0EPNCv4l9apjSuUV4Xok44jr6LHGv7KUgQJA93D8Nl4BCbCXw8sQiocudWpcI5Fuk7xfrqInKYRMFPGhHuEODY2o2LyZy6eIuS7JbAQIvkTSCM2xQ8vV2712YRBjmCwANuXl9E8Y+2UZ9GMf6AO6MSxPMg6KIbSQ7bacocsAS9BUl4UL00wmhKQqsjSVZUb9y2mlvymhke7tnt9oA1/wXT0apwoyFGFnCs08xlEQkXVUhMyLHOrDKljO8rWpYCxRQr/VkJlgRNHLSsxDDrf76mGBmaKz1xztT87wsAvKuPQvRIiWRAEHl34DOw8owxvVUeYCIJMGMHV8hTLUB7+WeML0v4y3QwzCJFOhHBQPleLu1bcuKL2wCQJm1G+TZoCnpoaZscyTWWpw2jCEPCp/tfKZgrGAsLQGowzEFzopE1LGHihS7959rno1qZRg6dxK7EgGSqUh1YCnxVET5JQEk9P6DdhsQA62WNgwRVKtqhz6JleeAMuo6CJApMKnCwGe09np88sjfZfNtoSL5wljcIhtQN0yHR3p3NFaQC8/XasdgMakgcMG5yH8Kyrj1dyZORY3Li3j+FViWU+f8R0wzeAge2VD9bpDDfwgAM7KIN0I6to37PkewCGfcCh8hSW5CCM37r5eLuAClsOUttyrkHkWi2+EM6Rdq3trFG3PT8QLsEhD6iDiKNF9BreGpWkPyQqgae7SRK2Nbk4vMfUTuS2EhY9rEk78zqB86kBOxNQlKoV6Bkg27uy75VCyXpZYPn+PvqVUM7+M5Jb1qHXFy1XK0v3cK090XPuLjmRg7J+jlaeVKs2rXndFKXX9g8u0EHk1awpCD2YFU3JlsUO8w3g5aCf3+ktAXvy9aHNZtmrFkebdrX2xJ/EzozxpCK9ISQBTBgd8XEZED5ua7shK3Y5rSYvx3gukWfjOWtBe+UmRV/3TRWa4uuv1azVa5JLz3VXnQCVFLVQVer1g9wbnUPmxiqUkH0AKO2OsNVXSevkcmHem+SQ+FDSVclm6RAKr1lVHosfmCRjbvLt0UwCiQHpED3E3KFvo6PZ8MRlfbHHZHmzUEPKJS1AnqoQKS3W/CQ3Y4GQQnXVsLm6LaTL83RRe2SovbteHIH23fYyXfvcx15qa7qnDqmnjU3amhXjaLT9loAl54Z5szruz9A4Zg3qE/i7tGla17Rw6iiRLBR5vWliIm4NWIuHpXe+0b0eFIofYM1HJuIGhZXSpa6wd0BT6L3Scy8TBugJAVGvdi1DmCzM5KITjo3TNWPi4U6oNUujRk+JuiRrKc8zAMOQSi5oS6O5FRR63UfvhdAd1z0a49SheNUdAgeTK572U0DQRbZ1TR1bOPa4+eYQ3PxsJMsUwIz09OwIJhrYcnMPHMIjK0P2Q6mk1L5RMzt8vFweD+lxaHnlkXnwCmSSh4Ubj8cXEa/qmLvEs2dh3B61GSK6Q/j+4jMmobD/UDAhBFVCO4EvNFmCCghiF9Kw+ZFu/wPFaKOr5ZplcMjNs5dSK3WptRi4e5WSjw0ABmx1KpwReJPXNSdjzvKqiutYjA2u4m6vtJTIWUlHHQHcMhg+Ak5QpmTBk7IOHKQGJk2wiccAQBDQXW4nl4tJNuAkWKVN0tdZN3hLXHt/fUnT4Pz8j2inpkWO7CcG519TIO/3pV5DC2np/mq13SU5PW7+lT/3P8CTiMzp9VN99VEf+m4XcXn6Jt5+r7+pMdlwf7vpou3V+OT/tzxmv6AEJycnF9MAPQNgEw9vzIgon12QuUmDUl/vYaPCQkpJLmG9q7rjpZ56YMN39jHZEx6kKCSevayLknrzQABzejIfnnp2nH3BQC6xO7UxS8pyyFa93eTHasFsFyp57eAp0wphBRk5+3ooXXQhiQC4q+96ff7JeOz79+9UrQlZkCTNAVFwjPahV/eyu7+9v7zvlJIgEU1N6gTX9os/JTMPi3Nco8VGDMrneKdj8U/N/V/u+XKRrLAWHx49XH5hlVuaMecdWEyaIoXzxAbZDpFra8TQxsMIb4QPJnxMcC0+e8JZAXjO8/M5h8RwmVSneZLb+OUI/Ytb31zXj9tFiZNO7ZPPpZ9R+Atvq7/5tkJ6r4bj26sv/fSTPlLX/W+4PrhhdbQ/muDVdf02vK9/RPPqcf3fn7fX5nlDRhyNNjiNqqHkWqnHvpJwbfdQodUNqWhLZHtu1D1KNtoQg8z2lzCL2SHYBm8Bo2MCfAWORrb4Y4vIXQ7JRrkcGRIquAKHCraI+sdyPklc+mr6SkVNwBXniR5BCU95Cs+DM76IjGHywuA/irh/1omIVSoTvSO31abIdCB8FcqFDlS7IY37MQ6zvbfH+mJWzVGQZx/I1BmLcB1PGD93V9/OtZQvAh3JRK2KNb0hm/i+uPON+uoWQKtXUYgAH+hxyDcNiXfCWQu47OFHz6UFcSuGy53lolgEy0I/Op0T23gY+BtBjQAZd/QWIGapMT4BjQExj9VQhr6ld3ClakdGwbIlNqn2Y3kyJAt87pnI8Z5NsQXg7II+v0neljssxUbECqzTDt6oYqV6NdjzvT8xlRJFzLFq+Sth6WooOEGBXjDDk7yNQGJL2rKGfKo9GiEN2qicf3zmWIijoIdaV6tQG1VEGN5sNmudkP9/e0Ex/0frQbtwYiSAqaHg94PoXZRdmRr3qjjH2j4KBhTcUH3Qc8lpXQYHfAOVkk/kdeo2Ttr75NjVGeoUr+whtD92y0eThhy/DdpF7Z7VnVgb3josv9gJDHb7U8vobdAOYmBc4oZXH8eTrPMDuXz7ojhrZWVaQ7xGfvUa6HlnvpNPJqhmRxhctp4266BbAIOwy1lW3/5J/VJzaGeIaA9nW/9cOQqLZDn3+oWpHPfMZuS88uO3+uvvlwHhQddCBnumfvdbnYtJYuSYcEeN5TV48P4OKHMsZcpdo/EbLPXQnwux1XISYlZZUaENmeQxYt5Q0cAksl0pU+Oc+ur9Udm3ell3/4927PHXp0TF+5xEXGVRb8KJcjAZwbRAWubPWpGWan58gelCzX0/fl3pON6d0Nd49ZgGHp940IE7p+CMEiGcKRZOEI1C+GXYA6McFQrKDpYqJQSOqMgNZ7olRx6OWZhctLVXLqRojto4yLU1LmsQLglk3qYj6KfpK1ieqZRtaHrRxgTxzHJ9n7HmFsH2V3U3SMBdz5xDpS+cTZ59ejEmp6iMwx9jcNAFyQ0KFpy40ZBGO5lNIcxWXz0GoKKPVQsC1zvC6xNVB6LVJ7804ZVLQaUcTgxnjDf+j85kquKZRZnXZXU7wr5JncVTDkxDMVPMKGBIpbnTUSZmOaYmaPXgS5IlfMI07hznrGiGMY09NZ/phnazVOuCMz5RUdFAQ2vCZtuILQo3MKOlMpQFFeod1573vGGQe3i5E+6uIbQK8scEtkl0Vn9WL3PWS1oTF/drJZud02noq4wqPAUrkac1/Mi2KBoac+MmOQt1DciZdkLdRGS8FDBFYiAZ4r2vHk2sLs+K4FdAMInlDcfpJQlFI97AAkaG7S7UtGqhKNv6QbxVShlpnW3azRZExfWMPWZ5WTo+WvWoC1voC5hRDHXTMP0GZ85DMdITRBeXkFxmHlPBaPjYuUw4+gb/Zhxf6Y6Na63vM6Mo/JiHTeNRZd91GMnfON4njKQWXsqQNflQQwoyGcTyxpR/Rspy8c46b8ym87Iu4tGR1c9+XF/I1uLK7FdPpLOVOvcCJNqD5I/0SAzVWP4e31Qi/s07ifFmvWxRL432NZMApvnBOWLscS4LoNiuftKuzIfDGukN1Gf5Ne3hPdAsUzGE3VTQe3vanOiIBWEskbLJ1PktzPVzrLOiUONWIbrJkrifvFY+h9q+eFfSbXnsFjn1Pn9zTE6DP7GUozZ5veWn07IGzZK48Wiel119y5pYVeuNhcFFL2DHCMLiTZRWtcjff/QJ+NaVzdUTXvD++vbVz1AZy8kPzv6wsbOCWiffmnJn75BXwde31k7mBcbFdi00NHgWqZa7np8ScT5NPNdYY7Hx2D+yqskOat+ic/0KuNIg6B4HGi1ADC8K8dRaCO4Vgq7qq7th0dP2m7WgYbRCBdXFiXGdMyaPO2lAN4X+8n2KVlL1TEOA85SmsKcmTNxETtI2VBEAdK9lQdsN3WbGPmNPlqeRWY2p3JGI0FS3TYGzZEshSX6SPM4GwPlxkgQuw+boPrz7ta7VAT+szH+BstvGrKo1v6z37K717YZfWbVjdhHQ3dBcz15IqqDjKsa981a5iQ2FP460cSf0JMX3u/r0Uwpvy30PEOIs0iD+7KoC/ttrAaArcDXHB1MDVSYkhuLUkbRGBI0UEn0zahfiYVfTxI5CYRQWRZM0oug/HsaRvg22pq5MtdpMT3eemPzKcn8vA8Wbp6KevSgxFLsntbq/1Roa3doY5fsrnQ5OrPCcXpm9AFwB17Ctz15Z3utdmWGXHXZWTlNLuJ++fHUfvv/Ed0+6/+uIlngHZZ5aYM790UqXODt37GoPxB5i+s3ZVRgTuKwDRdOoKYoHgE0Gc9CC6Z5Zj/gE5eB+jHBPXQP5qOhfwr9cz3Jsty2NuBgUjQXEouaoEIYwNEGRjj1WjseZ6WjR8C4Cd3NQ63JDrwmebAHEBI2kBmMGiwB207X+qoxW/vlUwNxQeBCiv7EEZiCgFRvbWRI6XxYUuJNdu4oMno92zvQR43tMsH6MKK5Yg7Tqea+8TD7zfvps23GLvgijL4LFlcZTgclKsl/rPz2kvWOpsSwbOnlNZX3+NhimnzeJye8K4dM0Tb83x9RhG0mKybaytPsqmTuS+d5GNnI9S8c5BPOClF/vLtoGvXPJ6hzkvHbtZtl6LLn+IMh1sLr9+B3aFHUQKwKG5uV/WUeqBJXKq4u6ZGJw8h6tBaGvT+mz8kqp1VjvEQsKesLU7LgGTFeXYzZibc9DwqJPiKxMrDFCkwExDMYZGhCZdmcPePEwsc3C1Rb4WMEZo8ocXNULgXFKQ2poYPeLK6oqSK5znLxoExos4CafJdL2Dml/IztlZH8Ft4YgVAjaY9oc6x2ssh6oZCGhMRisnGuNGtsmVkUHMuMU6HhScK3sYA+SJtNwRKAK4fkfbMsIemUkfGMl5y56p7xodg7EX67vowss0zrExZZ+BpcBa0xQ40ND1MbhPOhkWWjugQhxU0m9v0WJwQUaFFlmRAOYS1G1ihVSOA5V8qtYb8TPyU6CGgxPFMwj/HOKQXqTP3oepduT7h7sN87llMckUIosrzY0T9hMr1Z2NERZhIZGqpfsmhueH2mckA4sYTHk7utlpgMuBg78IqaTdVajnAv7n/dumZOsStNZDPFQZlNlFqk34nv3jFx3/MUXDRNi9ntaY3U2i5QHmRblBaxbGaOaADdglNWx49aUiiwNWWdQY1c8Pb3qcl+aZkxrKPk/t91wfG9qFYBrFlgnT1ZPfvDzvrlnpSkkBNOIISQBadv3a3raFGAl9o0lSceUB/RD3IrFDGxzxQnFa9wIsd4WovzZcf9msuFAZ6gvalU0NCvuOsT9b2+z36gnawCdKcIG781piTES+J4rPVRKCTN2GZmapSOsvsMuBghc0fIU+i01n93TMr1C4oOtdVMZ7tATK07S94cfr0gF3mOsi9vF5GPhFEuGJStKc8Zy1Jsmx22HZvDzPli8F3T9Z2lFK/0EBUDGXz2aFArSTHprG8FMmVvE8esF7Nn1NQMdRT1REwK7gnO36BRGfxA9iqdYGWNszxP+acuGisHV3huojBny1tMGaXhIyBX5OsE4eDujOP8j9yWgprV70xX3NamdAnnpDOhjC3ZYzEq5TXtenxDbcq7/jKjxUnFCiaYl8ZWT6O4mvIjFovAlq0mpyCNCAKMLGD0ZWvB03Lmheu89XfnagXOmPImhQdP1FK8tk2sZgcRRCV6yE7CQr+kwOrHYYqlLmzoJ/enJu6ooX11OeYVQaWF2Sy/Hrc0Zd+2eAWYQGnTaLXLW3JzenWP5dZbOV8OZUq9QId/ikIPPYm5LvRN0Ct4sJb2qPW+b6p/SqkfW06ExF1r7QiJlzPjGodB40jervjArq/OnAvtwYO4NGNP2bGQfDOxnIqvWPBnEVNx6pVt4OM0N1qP90kt+cSb26TE5Fc5amS8Pyo9FjGnzkV7x1ahgJ40Tgeh3Rmxm390QyHDSFFHtLsWbk7GA4R8Zb9JvxWlXFLiLSDrM3n1M/oeBxIhrcFJWYY17DUbMN5J9UB3t4d2SJ9t7/AZIegjCf54ezp2KOcBMgJf+2133UHG041CYZY7AkHWVycEgsF2R8h3URicX1RwyyfeQuCfcvj4RSCCY5BvZC5SPYy2mtZOMl33WUKb114Jxo6JsclPm/tGYi9nSSW5V0NWBCRK3wyvAyEoode+QJUSsittzPi7XuN1z2phTO3G1pSaY6snJAbIBOdOSYga8OWEtAUACah458mWi3naKTzjbhvpEaDf0cmBDFYzYZWxtkbzauTgpNp2WSZ7L9zRbDoYhRJk5Drr4YCRd42wbJbsNamcBXALh3vgdaJiWwIUXw2s3Rn7qDitGf4uRvhQxdwkOtKBina7nsdlHGQNxZiqSg/DnlKwLNrT5WClI3p5vjOl0bKwWwBSO2pJvrs+KFhzvg7LLiiBcLPN1D4re+P2n6fXqJ88MoKGLtww7Fx+JMblZZn0y2zi7mcxMAtwn+kEHYse8r+lga7uiwJDjVSdNQXsfYDTD9SSiyIOSOQyt0ERzpwE6PRC7FZ3/OlWEzYlNxa3W+3atcBr2hrv6kAIye4a5QGiDoAVLgqLCUO0q/U58L63Np09IRe8m1blkhpjWcB3mHA1BfNb5WcsRUVbnb7cPTBEozjH+KGhAfUovCbP6B6mVK2omQMui7mObVMH3SIbbRfNZzeiYVTpkXhlMcH57yLzHaoS7ipigvmxl/e1W3BQ9rOMvX0yPhbeTRxhehsQjbGaHmekG1wdn1Ri5M04X2ozpKfH0nhdXfp3ARo0XLlFn4YV4oFRUJHMf+IydIjiI5IlyO6bKnS/DLQpWwKhs50+gUMUFxfmPNo12qZOfgd2cf1147Rl861k728oK4XubKAkw4IKE7Wm7ASphAX05a9LeaPnh0yJ35eS9e3QG3EL4ZZbJNe1ARi+LTyT1rH+BlzuWYgYc+k1n9bvQ1NwDA11UqBjcdf3uCue6Qcw6yRVv1fD2aoJty1pA1XqMt2Hl8Gbu0vcAcU51gmw3J7NZwGUUxf6VFL9cXuxfswVIvIsZYycxdQOIT9ewqQPT2LBJAqc/bF3ahrIooWbydU1zvmU5etdJwntwLnmuA6T1ENOd6iWbPX9L8ZW96UJzRZH3WE8PX1YfD66k7lD56+T08b7jg+Ko6A1YT1pI3FVbDFSRL3vbEG4DZrdcYhKLDwQT1XUCAKV6dwZzUcuz+X55+ue97hJCjvplH51/EDU6qxvFDoEYSa/O2rvPfM/a/oFNRRBX2c+hU6UognG19SOG/Q/5PWfJPk1gfNZa66iNMp27y7KWI6mq4hDhKuScV4TT523y6tTYBWtkx6Ut8EdGPi3CGW9mLIljv66YiLpBqE9Dx4K7KKuFU3LhBszg0IASOVT1xZOeMJUwSK6KB2wpJ5Zs0AhtOtdH9dOMgzlNhzkTgM6m4e+UShapifXaTi2PTPMUZkIAxBl0c7hLjvldQ92XDVoMoHjMHOsH9R2Qx86lvJWYXqa0i+nu46c3Pfv0lmc1Th7HVgS58WWGGZ6dex71INHGjAR9MJqy6WRjhttGSet7yGNcoyFfFUGdctS1+urjSIM7LsSWJYDiiiSUOouoIidKjqJiI0Z8jfaIiR1DrFR3vftr3E0TBKEI2lRNLFFoNutiIUCKsClYlfHEWDgjmCyUEOUmCvaEa2YwYWGVuFWNl6/hZi1uUe024JuyMaLWrm1TnhbUXeZJO0s83PCGrK2oRnnQ0F58AxaYMjqliOJKdJf0oFvjdiChgtnBTiVHaFuywNHI10cQsylQREKknSU7gVwmEWgwhSbRzvucuuK1q2H3BdjhZI9BvAJGiP5vg1PYSZCrgXLTMcsuQiKvwKmPI7qJEvlp/t2mlsFlqtGWLVAhdA/NhBQ5RQAzyy3fTx52ocbJVKKNrlwXvrPLIZPLig0rohX7pYt1tDcMPXeM453R/fuJ874KHCz1o57paAKzYKO1+A+EBBpOTd6EkeRGG0+tLCyUJI01goplraFrYEWJCtmbvWyzytqTxYRx1rrt42Sv8QQaoBK8wvEvEdQjwwPZpDD1M+Pk1CpjYiYAv0R9drjFWWjQqILX3UbXOouaPlefKc+wFKeqU7kzkPnF2CFrWhX8aSe4vVMU0C1hc6WvOl2ZLTTpcqkr9ebPBpA7z9p9U7rc88Z1W9OdHorDUcaeITRCJmZiP+rwDP0Hlc6Q8wdi/qUUL2IDziCL9dsWTO9YN5AfYsaTj4wyFi/B2jIGPAGnaG5utMbI1diuWY+eIqm7hEiMORj7+JQzA/uN7XJG1T2iTN3B3i3TyZ6t6xNuyD4SCogtSdzn3qkrM8Sx/oL7CyZuLTAhHFdO3prRwicVrwcpAthmuFtMjK/l06S60crlvGgUPSvqGiyol5LfRta5XI74+lepPaE8gmiLMkB4i1LvCDIImXJavRSVVr8cEDIvYLzlrze0xN04iszSWAISaziNcWBkBAIzl8clAU4IHojbwq6mvnowM2G8spntufxZMS0LErKggtCGfqAM1MuyjocTdMAz23w44u4ZtTLDPDGui3chkqPw91Rmr8KvRzqQ2gbKHK/KqM5qfOO5tqvvb3XKDFnBKPbKY8UcixqLsqmZbAGh7CaCYJ7A6FusEN1b4zzxWqFVOIIVRLEQxbBaRTi4Vx+9s5nxyXsjq5Qll8reBu8L3kQ9/siuYp26bDZby5pt2mY5tFKlUPynhqIz98ATTx7c//hjltMfWIri4nbihuGPeEnHeLc7i3qHqdxJ+RPyLbkkXWYeUXEyLfC2pB3GAkTeP1AssdxgbW/4XglFM+i2i7Vk6lQaTCb2fuJriIKvvAXUlclB0H5EDkyAt6YVq5HFrU0w73MrwlfgD51kB2W5Dqvkf1iE2v5Tt9upNCjJNpattYzOuhuDlUA4Vfg3NQWxCNpBanG+492cczGJb0G0Qh8Pc2+P2jU5Ao6hXDpkJckqinnIq4mLD16vgvi6o6UpkMBYndBLsdzmbHQg8JtX8Y73S4GLBZgyq+wrxZz79TI0znYkYGFDvt8xUVglG+0sqok+MPRwqMkjZxReRlLsHdtjdVJnhv+B+sLwZyqV0cpEybFWJkCNoOM/v/zs8wRdxA6IV6lHtEPG0XCZxNRBnMmOz1ecWGMXgoXDGYncN7/8XI6/lK+dFl0EByxNXDsf6ATOKymOgC4hZ5DR3MkoASZKY6wuulDfCt5leDbWQm33TxmCug81+mPnHOnA/BnHu1IqcG/NmunHAkG9fYFQpgEPzyX7EteCzLLMRWh+jTHOFhkuThS/lkCCMMtr09s/g/EVII9Db060uBbcS3aitOuTOuFu2piHqkpaWQixoKwXfNd/QeZHZlZA92S1L+pu89zxoaf8ArJRUW/T64l5x59T5MUhvQcX4SMVYOaEXnoTe7vNpTcPEPpD6OyfaEAbVqm4B6aC96En84cEG18n8gRM/v0N0JxJcA3TBBp6axMYwtHiZxLe1TP0L6T8XY7HmDGtv5ptqdRbMZh3de66fsfY1bZ2tI1VNltaa7rWtra1p2uHXWkH3Z/LSpjbe/ZaB94rV3fMndTueV7HFQu8bSPGKuXxCbT3CsWSY8CDHK4ug05Tutqp6ztGYeCe7plLvDUHu9z1SltZ5SACo3+7WnkQdMZ8qYv4pYR19KxcwK1oFq820zkDeB3fli1ArN4/ztmQifn6Kj2wg+wHTCUlaoREN9Mo4zI/T9C7dRDXMLbGreovPK/3DwWxDOlNTBsyjSb6CQp43kPge84Ej6FRNY18zO8cGATrlZbMGPENKTNRxuurMB9tRLVwJTRDOYzzNCBqeqYW9VDbZCOacZ8ntHUk+GbF72sRaenF6jXYKNcaI1anweO7XhqV60F5TV+9d1Lvs5EEmeU27lX23LUbsFDRTCepO+7+Sz/iZRlNxjyv0qit50l62GE6eROTkQIcOUcuZKd/v6Y1tA/0SW9eVYba9X5WbwWSBAarozBOn1Z44ZDM1zFFo/uMFtbVicBgUBi9erCgXV+yUw1FAJjunXbWYj/d6JvK8wMtWYOqFnrQfh2HeUM/KEJbZsKQUmalXXxiwzwIBhvlpkOjUF0U4S0WfTOEnyXhHseaEIbxslD5u0hykuOdHDPIU43gTL3rOtV+EVv82eTnBIbY7KsulFF6EF9qWhEnggVZ8+ZEGhytpunm8Ul0PcPmVQchPY1GoX3Tamq8PY1F0GrgfaNmx6+2w72XG6SB7PJkuOJY4oyyemyCWSve7cfQx8XyPEleDuEH1IVhjlDX2k6G0oyTlxoh/MqmKEnr0DfFp6VtYD7FHdNOmcRLo1bg0Qfncc1SDo4i1Sksrv1Vu4EHKn3Xn4gr7HwouVGd+0MopGnbbgydf37zYuY+O0z/7VZPps+z5O0TQ+XIgq6W9Bd9A9cxiRMyP4rl46dRfUqOeFBONnsN7+uSNxccvclytiDm5fDk3eNR+H9PW9hQJ8nIrOKmN8lcIqCNvDTSrrVaZ/10rAapXuYFhVXVxKEEhpPPGvKaGqKIRY1kmF0HP1BTtHRsgiWM7ptcQHCDLU+9zqK7s5sV9ouhlY0fwFli8O+EQNZMlylcxKYKRFsE26uiMZnxx1i9DrRUpLrSVffWaaVlmQ1hNJ3tN485aJCNB2CJU26toVRN7Sfx1o++cYzHmh+Wukmas+gvLBBlH/Nuvf6tzs78LBuzU+7SE3Km6r2xT8K5IvyyfcV4y0VkeggiuY/x57H/xZawus/Wwtedmbp/a84Wpun8fiOZ5VlCL3H7PMoEUeId5NwIM7G6OEi7bO+jzmVnc6N5Sy61YDbBaC5aTcGg4DHG5KAAg+C1PvL3isZixKQCukhi5sJ/zBpTsmFsKRynCnHbCdzlYtpMWCtzO2fpsJtxFbeyQA+t0K2UPDaOGhi7q6jhOSsBc9DhRa85qAr/umYPzMQs9eV11t5Libybd2G0obl/VfB0WmOBSGA+uibQwC+sBcc/DiJzgWiuUQdv5QPwWhmb8lGnH/q4qdpyQkhwGahdQpsynPq1g+SYwLL5zbBdaz74HOOErwJoLE8gbg6Nibq/vQ014STUN6+s8MwQUfrjdWGt79KQObAVox2YGHcTjVuFE0OtnDcp5ozkJf9yEb51MWQ+G3hBGJy6wD6N5fy2YGfOxC9T1O0XVawFrC6bQkQJpajQAYG6SrWGHEpVHhOBNaa2xz3UR100Q0CzeoXKDN+qUWo7r1QZB7IDBMX43wHKw8Apf7ivHxO+Ok9NgC82B1C87oI/EukLoEu7SSjSMRr//+OFT5m+VPxbvUegLPIb4W12x/ivOh+87j0TrlzjMSRzisOy6r/AuzU6+d5HKWt7k5AH2UdYXlc7pVfEmpR4ojyZHDew2F0Pro8QRNQo+XrYyf0hRAm7uNroPvBrzV/Wo3BiRhcrvhCJmKg8d7W3TSWSxc4C+zB9RDooXWB/tvK+g878ZoBWhJFZ9WykHgUGMb3x1P0E/LTYulfwSZX6pKZ25Np6PkN60ENk2r7JdDXwZH1yWFSGC4QsXkZKAcyEdlGwuCojw4LHwFloLyNyAVSAEG9SwwzWfptdCl4r9a1nR3GU79sR5cl42wxy7RcWmYny3U2HIx5z+DPNZQcsqK8p3MOdp81A3nwUxIcmDAkXaKE1BEofBRnoI62vhSSUIaIkidJClYS4AwjNZWlr4IyKqChdS6lRI59uC1dKUzJY4CowQKyJ5u5TDMdffTcIVeFTR5c/evqrE8OpNU+cnNQ3Xg2t2FEWv3ZvJmBMv/rZs6qw/NSPT6y7qy8FuQFDffCjY3C04ZqwKaWMsMgf1XuAPTzOWc8KhzxYaueW4pkP4hf6V6c7dxnc8kPDb43Yzc6+zrh07XFfCLgNC1/V1r3LdRabW8BoMbIHX+e0ZtcdMqgTd74KJsV7sIwYu7gntdstNRC6yRpwSLUA5lDMVtU+hYjSuvkrqtbJ94/0VaHfN6iVG2L180F/6tbjiyXl+9mCAzHZK0PDaJcyQg9vzpd8r7L1Q8dzXZeVss7uGimjRpIZ8cnJ+34/XAyt1OlWMrczfSM9dix1WuDeDtPfm8H1Xo/pwSAaOPqda6pU6rdyvUa27s84g53g15B74gsidmLZY/T/LPMZcU4o7AhmsB2EvItsFnzKsc7B+r0z48vubuOQ86KOuMVockH1UZYjxoIA7HoyYrrd1T/74ttWiNIeoLSYLeBTwJghzK7hr4b0BGUbKMtdJ47xbarzHicnfNMh7uDYsuw6003HrCOMl151JFLKihnL5Z/TZYJHw/lxsNaQqFDjmDbrY7d4qenuuWZLM5cqw7lrh/q1cf7qbMf+/NWbR3vVi6fx0AhL/UK34k+1cu3z83mWB/ZgWpGUTda1FYEUZNzL3n7r/Yd9d9KxaQGbRAoQjOl39ySIFIxfxG2CXRa/hfUOJ307jT085ThqtM7llrE9G3dzbcFtYLPksk3PvbCB3PPZqqO8Lkh2CiwMO1J5d9nPDJTjkhWyuIMzFRaF2X1FMxDKfWN+193s9vKHhaQgPgbPcLj9rdRxl1/x2NMeDQa2jc9D49Jw2O0SPR39FMu69tV4PAWUcpkkVolEwNiCGW80YUxvIDoKZCRC6ZkMyZDIivUDL6sw1yjRwOZrYcFHF8dSzoTpIDP3+v41UttPnfy895H2baZRHjr0DepXlkeeO4UIWCwioSkkrQyNapfpk3PwQbO5tBVDQ59cfjheDvmG4/elLRpRxNyOFfb7x4rhnBGDHa6HdpRqkAhI00fyItoqqT1IIHSqFgam6RhSoCiF36pp8xEDmrYgQLKa+uS1n9xx0S+Wy/tsUjLWsSM29+gEVesHOZEVFpTvxzaN8ExVT2NomfrtasC/0gzsSLZ3vh8wWnDZmVd1yonduNYlH0Fpe0f0UJWHKBnShFTNCYThDjiDzFmKzjMMxN113qfseXTfp+4ddef+lnfULfC2jsUtUn0rMHs3pzuXS6WI6WZP348vt6XJ5Wl+32ibvDnjKFIF75BSe5zO1O4Q02v/vyzU76IMmGb8AEJCYMp06Sfyev7/OUabX1BGsbd86Vop7FvLAlBdNye2XxhMdwvhjWtXcumZ1pIZWksH/c/Tu1a6fTjLeN7KcUx6GAOmT/fX8xvKbo4Se8U7KKfXkufDcnq0Oii3Kn2j4X+3Hd8YGr4ZVBn8oQxt7Pvk+H3LCsfjvpH9jVqgbxg+UffGaV4Yhlevpo+H0j5cWGc2HXfQnsZ2Owi0LVMj0smHizRySTFqyM/rM6tBIOAGgi1RcFTwysn0ZNZnMzs6jwKzcUVqyBhDi665lOR4mObDEjIz4C7Npz7HKCSLwdeNlvPpAR6WLBfYRrbokDruYorgYMDILmgTtL1HRIxzrTYgUHy8baX2yGpKibo/1UIlIJQ9mZLaTK+s+2hp7mm/iRmGgezLOmtFFoFI1c3PYhb+xRQK5nckSupOif4z5Dmp3YdiNXowdsLQsnxvG1L8VMzzxE8o2S+qB37TQp2HmdsRQCv3wUybZ/wuITyZMyZDM8GbZ1qovzLF0nszDhX+jTn/M1KDjyIqw9APIg1XlpjRBGFZZoVQ8br9Yeh3jicvJxQIhN7Lr/x4VaZD6s4sZT+JN6jmC8Kgoo5uaCF0MuDxqV1Yui/uzU01zZdR/0EH9Zl1OEjhsI9ECRLqaiKA4LH+jAu5K3QvCbx/e3wgRHrQJ7jfA90XGJQPemEIgnSibd6ZGAhefs9kGtc4Mh4oFFIiB3KwYW+u2NYldV/haMjbQzY4QjliHaPxjktPNOpZ6mbV/uSY0DJU4374FttCDRiH0tFeb9i1GwSclPT9PYSavmGO1gXj/PzWH8k7GNfpG7F+M4RC+Y1DzB7vC2gMiW7U2Q2D9x21944EP7zoencO4Wfu5cfDjx55ZfFjkinP8oUD3seP/rvpAb+8wpIu/4NvHve/fc4Lb/e+JTmDJFQDP3lXq4X3cobIdungzls1irg108K5ualU52kbKqABHIBhPELdPQAI1fy0sdvtcQij9IDxZjV92VPHB2AlKAt5+P/Kt+wpyl0C9f6GyfQ3G4VAWRa+0BAdK6tLzQaT/8zQmZCHZArCLwRVRwOJwa99oNekGtzrx42pqIeiv8ZZyPxE8KH6Q3m5T1jeDG4pdeM/yttEM6zt9Qel4FjcWCXYzj6QYan6Dm6a2WpSH+p5gzVplv8I/8wNdTNWhiLWLSaexU2PvtD3lOfws9eNE6h2ZGtIdtpkHGYWc8DCe/Mds0HjHmWPUF4XxfoC5vog05Xk7lL8v3Iui0cGml+Tj2ribl89EM6qbX2yt2ONZXDtzhG3RAFUG0PCZgEN+jKCfBxBG9sQvAm6SLEjZ4FdGkdzjmoCj8grWy9L5Khk+bTx9gdUbGsUiuj6wIK5TM13nSZGym2LTlO5V9uSekwFA/LnyXsuYJdrq/Zh903Ppf8Yi6QB9s0nwc4s/voRM2VnPdtBhakdblguIDVqlQxcW+zx7KdqVKt1dnhYwwx5dwoZTNvABC9zbA6yTU0sNUuAo6H1jXWG3MWKO6JzBTzMIAQxhpUMltiSFMQnrHkaZqjE2McQrVBRxYEA3MTamiCfXBzEUBL5CiAZeTkZPkjKALIt3sVBDG4JxiLt+U3LoiC2t7PE6aqY1JRZBprS7NXI7gPCEEzDRfFhxnyAh0a0rJBIGevQNPVkPGGTbN15OlwcKx6/ivI8srTaPhoEI3OpGJzXZL1dSSVPCKdZlcDeTbk240bJj46jCCNqXNN5MAIZdEGEApagVyCZPOq18wJy4gUmYn5PRmBYpCVwDmaz2HG2VREtyuzUjm5DX4bKB0xyOseJk8eCYXRhaDdVuTZ6LIlkSFrmiEj0QN8Yn8gi1Ucmen2LEgWHCgmw24IDPqkwdHuskJRhPMwWh7Cx59UZg9W7tQVH7gV32jsXmCmHKHGe6s2Xr6Ed68ina8UnZfyXh+5AOlNZA080LMxo/xDoHDXR2ON0JGTz4PSMBP79Ztdk7F1g9pBS+tuiJowzOLX8skxrVDjAvtHjnYuueKduzeGg7oF6lHeJQ+QQXrg3yVWOktkIoPIA8BcwEBtOHMDnop7gRokjdk4evYwv2PEHXPM14ULiDlsvsfAkzRO+hMaE6g+JbA58HqJitzqDySDrYWbv8RUXGaiROkg3mAsMkjcoBtwLYrDrmNiDL813bEQP3YRyArsCpgch4rtaXLIBZjfFQiuPmahUxLPyHhAPQATBGBjeg/yZsjDdmYTm0J4Tz1jIoEoVJ3ne6fDqUnoa9ceVkg4ehlFMFolQ23fyNqB9W4jiG3RvZAa3LffZSFsyarj6l6dxcWl4jVQpVU9/f3JTXx8twSh2SRFQK1miqoYC+l2bMxe5LH16cXZ+xgOH2a0frn5+9/vlJmSQ6a0LAhgL2epX5drh366hiIEs0pBjRz0Rwd4LWobjDZB9agamc2456tkBLozBlwMjoBlscH4zW1jSu+jj8Q/Glyc3R0vDc6+37/OY9JKJIR2B2rzfW1wpR+ey9ejaT/wvveH+mSg9bOjsMKvEBpC3/qHAPDD6vgytH2pALpcYPJc9hFtUdqa2QihRFZsabJ1OYKb6fCIAg0qh2VpnvxcsfBtzuoY2+a5coCZ90vxF8HoxGuxKQeKvJsTIt/aOYPEpFw+7bqfd6lreY4Stf7fTqq/7HMp75ZO8d2ye95iVUlJsvx5BvFEio864XNmyGF7E2cRnojqAMxQrG7a2to1OilPnoTsJCGWIR6UJ0krUTgYBOf0OZEgOloqpK7d4hHE9HXnuAbsuszbrXnQQRZIigKTCO5JBGPtJUFTHgK4TvPRQZleoDh9ObLK9weiH25mx+Q2YDYlQp90DKw0r40CAJVTtsd5AR8sEbKMmvYMA0KyhQZvUyxdOIV1+nO0i+GYpFjoig4fheDoDvcaehbpgICAWvmF/hY1RotGIf6pjDSD0hBVR34DgboiyXXTOKOzS8g+lOAFCYrnBdRu5qAHM3PwTt2O9UU4IGC8nORoWbqWPX82O4+LkKbiZHECnuzp16f7B67/Ovr/tOvTnzmm9lNFa/Fup94ees2NB0yR9cz1FTvHO4xbkaAA96Rjm8lcc2vaYqOnDzRge6udDy4f3XLd0Yx8LsG327Gjcnansdfr4MQabD6oy/BkBf8VeLsIIVw72qkE1sif2oDy4nVvaf2muWwtrkrQd1SOC+Bxdw4fbiI/MoKyno9CSnCX1CciWR6KskYdq5DmEyOjF8WYUGLd6d0oY9RAfKPjA8EN7JZxToT341quzCqZ8OhTa7/9ItUVzSsQBkQteE1aYH3aBNzc9PnAjRAW2mW5qYF8kxWAVxu5qKGDeL01IRDIk91ugDWczNxEHEDsKwkyed+TYGyjnsblNBaZ3mmImdgJqRYQbGHEZscgMwPEEdpNF9mA2Ykso7Y3T0pamRthdEMbmCd+gOaTMZnzAtKwYU4agYVzxIeLYMnRLZA36ylBGd8aHFzyDmKjmC+KTW9cKPVBApPrRV/1QsaxB7/MmbRb0THP51Y7dv3HnM5T1y7NBdL148/D1g4ObzFyeGf0RhX4Pbjx63D0tVTGKLGn4vim43kA5PqZIFW6BP58X9yeuMlLy0B1hghH/krQZd/kY5fS0UHyHsUI4qAf5Rhc0/15sxxVxljRhOjAF3OGP8UExWz2YciwcYeQ85IxLLgfVUOAGrcJwzg26e7qywjNvqTCdHe3Y9Ru1/qIdDYrBdWbq+qC3YHczKIpq4Aea2f6vx+u7iqCn21FD1KKtdDye0mwHyqukroDLrCGnoDwPi6bxZINBxxUnVqelClHaTEc2j+J2yhnKuj1nq2DDBvfEtHabyxV24mBjeDJgtEYePNtEwYKnaNS3+p/hwGbe/ZHl+7VPM/SDdMf6wGjtp49m+WIzGBaMV8oDDOfmXgJ7mR9DcISfH1LhPIqLh1+eNnna9qu4o4xu4o692Ax9wP7xYHJBasaLwM1GgaLJovrKv3JOgKA2OygNFmqMvuU5g8JIK/5Rr0XcKDTI0Vrom7HmuFeFdgz9pS6FpUwvUgOdVbZuHCfk6NgKS30XtQaZe7oiyrF/cXyD9YK/cpa6i73G/boaRFhCRSPVNabab43p8oPxunbcKDCuvJSkDEv9afERytASen64NHetts5/iA0jMxD3ILrg09/FaLdqAb2vb5qRqQMMzE4xuv4tJ2TuZ1ShQop4gumtvVFmZSEO7q7M9tnkXTtdZsfh+jVSN8aLiDSiEiHt4ntSx5BIC11nylIVmVQhSyH5A6di2yjVp+RK7W59o/ytmyhp+fL0+3w9GQR1zOGQ0s6bxwLwgOnw/G3iPjHld42u5DE3j+MYZT2PwSTYDuCkAoDNAXHakGzON4PG+E6/axjvrrrD8P1RuVV5bTX+5JJpfoF65/q8+EcUXb6anpr8aNtbzu2t5WXTjJUXRSsrOwtqzo8NH5rMaqjNqZBUTC9SD6ieWIo8lsXbSUvhN1Y+0tfLOmG3/ldGOzGjzL5BeU03TJsLS4DTMvxCN6ZKD8kYFyxa1mVE3mGMgSWx8nyPRteV6dgemE6K2uztXQJnfKM11Of4JtZWP7+47/Jjkd05rN1EAMGjPfP9XpABCSycU+GxFLNCxJVgJj3DBpORrJUSXePS3qB5k0ncJq0wH3g1pcgd85ikGANhpwUNKJHIO4PEUk6YHS4fzZbMoQa3TxRLSIbSfn/foisEbbBL6qinOlNyIgDbc8ASFEOU2LEBhAwXm0xDfdVUwI1CDDk1I7xQPps4Zzzdnnbab/XHriBOlpSca+zp4jdoq5y12QGR30/xEy3WNTgto/F5eotEwhP6PRTPYbLoJRxPLYiPb2qa97GQXNPjaQqQf570c8ZoszrLGlxOo0Em4ZM5CT/29AjJno/b2pqFKizBonc4dnVnDCtmca5o2OIlj52suc/Cqstx9f++l0s6OGFnp95jakCoLTwGhnZls651XnT+scG0MMqgYsnp09WhhCIu1GXka2r4tWtrRpQVkkqJ8lwvn43YGnhR+NU6mt37yJwAz/SSm/SOMjBovTA4eD4wip191djvGRryicviy4EF9NYMh4vEFjGynoQofPido2EQdrQ3paenEptwZYw1SQPAbCEHVk1L/FP8l2SJx4lx608kP31OqUaXo9Nov5kVcetE2olbEbPoV03SYoRVFIe4IAfrtERvro3heffuXR1uoKxiC2EiCFDCEQlj3v3HrjEhcopEJmn311+0h2Q6GYakIpI5BBptoo82RsTVChheMSNlRtvSGDyEXRSewi4aTSH4WKu8k6nTtae9TFEioScSf5A9Untkl5WXAyaZyYDHkKC+JctNhZ7KDF3JkmqR8UMiUUYkvizzUEVOKk8GtogEvswTeST7ISG3VcJlJbCsjaRveGUZZ6focJ2UMD9A8WKLWBKJz66xhiMlx9+iTq3D4X76aYPBDaxW+mtEOoEgeSeYd/G7sxXiKLEiPgpQRw6Rcunh4zvJRTqFrKNW+iMG2zC8xgT/EawPFoTHybBkIgQlIhpJENZxIMqMzbgzoaXpEdxHjSCHSFV2g9Iuj1RBaXQK5UA9A4rDWYmy+HAv4gQsrEyweK/JeabJ/RpDX8HYX8H3zvywFTG6vNclxPjYUYn4H4ugxuQ4VNdRlU6E5k7v3J89twpz9UuXThbFt9fnfol9JWrIK9j9ZV6ZPPrnFj37gMO6oXrrluY1Vtxm6nqmhVmfglL2JM+bu+m1pWILQZJc2hVbxEvPbGJTkvd4ZVQ0tVVUZKgkNKtyggZUEsbrJcCYLxt7TY29Uwt1K7W17xdpINiTgbZprVp6c2pOrdQl7UzLaQNqrBpKkUAkyqd+DnuFUyz9vYTpt97is+3lxHKgJEgdHShFGEkDFWqcH3ww61RwPk5VBEqxnn1pYHQqyr/OxrtvfhH7k9stZr8pGUU0oihMYzC7FJuVy2uWKzcrXNElSQGTuCxw2KfVOCENnMSTSt5TxGtwmFB8Lk7D2pVm8Ef1c22iRRzcWVjYGSzOuUnPilQvCbyMmwIuE0vUkbPojg5doa4je4NCp4gjLPFjbjef+MYV9xhBWIi4L2uYMcJQr8WsvTwVZJm1PYrtidRgDmsiQ68fDfEKseJfolRY+iO93oBiW6dhLivEIaK/Byb9LQvZII6Kf+BBPAcZV8swywfKGyakIM3y+Si2N3I6MnR6agCpoah/xSOFhWqbM8fpphhYrdging5EOrFMyxUpqKj4vBMv4vi2JkS5iJj01N3Bqeyc0wNddnIrx1IydYuq5ujkYyvZO7BlNOrNhaQZyTgzsnrnvUvAMQmxceKqeWBFvVHPRaMeeSRHJheaopDQobC6UkaNgBwmhFHKIdyQENhDK2PLyRPy4sni8cwPlt75zrU3vOGLaxQy5nOpTYYxd8nZnziyI9Go5/anYfBh8zDXW5ILIUIElJqetKqO1fpYbLPao2YdUwM1LS23Eyht+44d7djY1WXkHTN13hAeQhyJSbgD4NkvhyOtHBfHvV2YPmT0Xz1Qn6rq5hXzKuobpCnlH7R93ZSa3Tg42Fj/q9HoT64or5/HVeEfQlSaUXw7boYzp0lDgzOqXWsZpWS8/sEQy/P1bEBC9BABFoiE0NYbAGDntWOGPAiNax053OE+k7LIeCx0YBx4RreO1666KnsuXbt03ss+PbulvHvDdy296N3AqHTR0/InTncda81x2rjyNLqOAq6/+io71hqUxIT05Qav8Jgc1XVdQUDFIEzHKXzggFe/0bu3bHl72uLDSDiuLZEsky95+Au/ZVECckaayawgujMSwl3/7h43unbBBU1IA549z5d4oR0ABoQHX7NmEbCV71zgwBcHBNi9qtc+qT16u7vde3u0bBQpjskRYE4oQzTqkeVIBMM+F/RGUWjqol4FDHMZFsm5YdP94UNdQQbYwJEQhyv4ilzSHoduZFo02Ch4Mg29ayI3rjoarJ6V5nDsz067aH7k4ObnvyBSf1m8fIV6cpHsu0UhIvCmNiBZvdf5nIGH+Znd56jRg4As4b7HTY0orUFBRTRVVBRthFzRfiKNeotRgxUJvRwEGXgcjXqa3kvEBdbsletCo4XKotiIVtJxCLaC7bxFyvBr577T3LroZ4jFfdL1RpFQ378YjXrISMj2/kDiNTosYUp/IX4hZNd1ykK29byyLMmP3JJeyi+jUU+RStINTq4wOcW/ypK0rcQT7za6IyT0p92Hqg/LONIH5whwpread2PYRskAaNAMUa58MUr/sG+7c/Cq38RDpQKcNng4jYFIjusjbjXcSS2w6zRueR0hZ/QVwdHXK9M2Sb12kP+4wxUqUcNvUjchLSj6xxr294t68ZBFWfzE4iV4+NJFg0Jf7IxNs3sf7j+ZlfhRIy2NuukUi2cGZ5gctR5nCBfmPrZAttVGuDwV8b3ke5hHfkwK2/bZVvLiC8baF+HxU41NljKLzVov9Rw46A6tNm5+9umrguWmIdBDGDyWW1AJ5QdHI8IutkhrsZVBZ9bBYZRgSbTwasfh5U8q77gu79JVY9cdlkvyHPU7tjRg+HaKg+ugNUXTyxFqGttWqjZvSzRl2oHbBRuHtsb2hE+F98SujcrRKSLu//3Xirz8CMX77wbQyqSA8caNmpoeNq5VdezRDlpMEyRhVAJOMjfqkudPdPu+5Ts3nV91vuNcB9fwXNGYZ0YZPNoJ00iS7N6La9hGRZlZ7l4iUV/1ms+vW8vftLydATDu6zyi052WX3i63AyPz6iNrf1nrEaj6CgfONp6YqMlbXoqJ9hl5NSFxqtcnqexxqyhcqhuZ1uwVk+L6eJii9v91pvLl7/5lttteYDvo39Xb7Fb0iFk2zklJZnyjN5dy567MT3Us6tXKc+cm+YuWpRgCPq4qipSOVoerf3JlF77TOURZWS++eN/CHDOuLGgZ/2TcK7cArZ+GqxabMLTAoc5bScCBB9f+LtiHl02jX6Uylbqav3jrsQpN8RJlxSiPjyGUj/8uiTkvQczo/vgQ22/y7aj34bNE8A6EYde0LmvuDcuccd3jLtycuEJDnFbqWaR9T0m5I8YI77esh2wuSgHbRUmSErQOVTTumnVyvPpnyNfAFG2b6CLxkbD5gmyhmG0awNe2p3mokaZrxj1AZCISlAUlmKjHhqRCJ46LsCj7BSaYlkzaN2BahRhhHiMxRZwSGq6uo3tIcuvH8Tf9MTJBBnxkW9Jod+S+X5Da5rEeW7Gyx7JiA991Vaf79c0gRPr1ZTEqL7NlnR119j8IEDLK58p4iZK4MetvTNFCWhiAiWIZm5b84NuIj7q8zWHDvWk/YQ12zb5sQQm4hSf9Rw6NGosIz764cwI7lU33laNRDpOedQavVKakoeZyg4Qh25Qic8GgyD6lT/i6skunhQUFy06i6zs6/aFAgtDyisyBU5+o0SV6pQ+CliqraAjpakyeaA0KghGVcPeA6ryUS/eztqIoWa2ILt84rmPZGblSRfNiohNNhXalH3/8FpR4qyJ7kzSNdXP5TIcM6/v9C9fb43RzszbS7RsjEay9/HHOxxZOHH/1/vSNm3kTJ3NbuNlnNapZ6p0yTkjIJgfMfoxyS5a9fLHljXXDx5Got3M87deirUtm6WitYOvPqb4vSJctyPgd/3xvW73htO1t/+/LSfCGJGTFSFLI7Td16vvf3fw0Wl37ekCXwLLJjRGsGzEyLaSp+1lynK8EQiridYKHEzgOEEHjhHmzhqmSxJBpLfYJFAkzpxFh4nkvDoosKIcMIs1xl3PESQAi4YR58iKlIW25k8U+zt2IuI9ypYvzxIXUW3Vy3aAKrKIpS+tWr9InSjW5NJ/BRIWAuNOIsHYCxtuagTqtK3WWmuyGm3ebtp11o6sjsemWeAlZjvpdLgcpN3M0cBSCLHFjzm8MUdhs2hxZPEcByZJFPRTQVDfL5k20fTCCMN8jk5T2qOV72hOIBInEMk5ieMJfgieN2FKjHuxwHpt/eC8uHn7JngDnxI18NTL6myGTAsYOLGSU2qwBhlwq0jZppTVNjomI7HNLJYCRgxTKrKlSApO7fkrwgmWmr2zshW3sqNCk3wqCulivbW3ctn0fMNBYFHa3You5raiVrYil11wMgou7DIpdM1CWMJQtNtBpImEAe8V/BFXgZ5wz9jyEa9Xug2GJ7crW7F8+QGsoUqzs8PcRdUDAyaCaRk+AvEpsXfpkj1x7yW+b+cJTXNTqUajK4X709+bEG2iFzmL0lWaykoGt0Z1YoPrEi0f/TD3+EWb5bdl7e++KWJUJhUMDItNTyVvCMc/nEy4bLVdThhzOCaJoQI3LB472SJ7y1GXSqBfNY9uCZ5ImUcmE5qboTuHY3c/bc0anNjc3PXZ3WPkEwExRzqFuQHRRw7JwOjRyeUSuYXk7vbyC7GEBeq7U+fisrVY63iESYwaJ1QJDfpMSZj52Qqu00FiMrf/++VukOQOwcXyeTVaeb4R1rOeg+54Y/Lzz19zWNfy+/bxRmNnrcOKjq0z5N58+9hapNM0NYEj6+lHDqsRLtGjlSk4PjJWdk2vrjUYDUvtWql7bQEpL+aYomkVrfY0etT4kOgME7IjCbs5qujI6VAQgjGKcwjQp4kuRFomwOeLL2FFx1yTQsWcelWNpcIUeCEUQ3ikOI1Ur6QzeuPNWFFQOlb3azFWiayud6R7Vp7ei47BKqHEPtK6AUs1UGpNkbJ854KVxxt0RwarcBOGSoucY3M4gNIKbSIS4gTUSFKjzbH5nMJ8rvGmGkddw3+AUVgNPWxQUHrA4/0prPpxrFz7Hq//bxX8BwceeD7jXL/ifv78qyE4KBlGJhkZeJkAo1SGZQjRWnmMQDQLW6Umku0ADfAJtdj16DefNDL9Ho7OiL6cN3cuL8T50XXajNdB2ul5SV9WVtTL88rLoWfq26YU5ZPkLchGw9Pz82OfCiVGy5dGkjGHZ+RdMzg9OkvxqzjsIsiL+cO6xRzjIMi7p5uUpwKyiENYxI7VPg7vt2PsErQDyCzgElQWRm1YSTEm3CSDFNEkoll5crYRTcIL/8yvrO+rJ5GJkbY2bSSIJRM7VV5WN7fQ1DAYlVlm+rt74FfUcwgjLgUX2p0AI9aRJz37tXZ6TOqoFccw7UIubgRqf6NWlqJJDnEkUMiGbSQLLE2Qg7LZcNVnn7mjVYGjdWFYqlffVM/uiEWCJ64NLi1BW8NxMuoch+ZOrS2qT2RQrBBvRuIUdSvM3qqVHaxnJzmaO8ITlkQLUWpyNKBuCAkCTRYNZ0sziIxwSS99O0LiGea4Y48kAio8/ltDcgWysyF+YJDEipklTSVXrup8XpcpdIr9qaPxwvixtyCMcMSPZlCMfjYr2jLwjCGxJdEiJiaHLQlBSPbaFXBmR/5Z4nxTW9hgKsxI1FUtiI2UPdKf3Dvi9WV3C4eH6blzdMlkbG1seEZJCX/hQjyYrINsN4udZcS68R//yNILNz6hfiSZedSw3dq9RK13UMU7N0iNEJ3LVlDjoCkTQS9aRAcGeihRpsVHhDAJ16s3EaZFC8XloMyFCzuIjvci3COpk8Ta6KoFVQkt2Ngv9OAOAp40Ucv1zhtPwhuZQRBI9+V2uZLTlyVLqsBCtQOfpOzmhcD43vLHzzz/W8wiGJxszhnbn1oyv/Gou42NJ9W9Ul9oMg2mZaHeDIwkilJwJhpomov73OnrjJ350UrI8UukAOx0cq6tlSbCIq5VysMzQN6vFVuIwx4igwBGhFa2eAOCTMltpoKEEU1yGkS0eZmA3h8UW3Tk59qi+CGWjxWCIEjQvHEYxmOYH2TAjbSMAQcaAQq7lbmEF95L3oxgJRRF6s9azxz2vBg3jWrICTLJIYHS73n0ovIvFSby9As3qFvSilQa3SOOExN8IkaYl4qJMuBzRzk4xMFT84qeu9Xy5FORfHUNT7TY1EusZ+3fxWooD8fFx5VlHs4z/iqPbmxHgWfKfHrxEc8NrAk6StNmMnuZGihHHiX6gdeaxZU3Hh3JnBOSCqWyL+qPr4ykJVOkVWHs74AMabdPtOxARZp/4zItlQZOEtBFxbTeAR0T7giEiwrxOQAnxayTx/KK/WdDHk5F+/tLSZuV6BYnEPoBMmPE3bi4uxEJ+xV6IkEsLXPLHY5sk8qkIxdJqc02DN+e2xG1Y/u2HYodIIwUlu3blQsvuTk20P/HnwMTPW7fb93CxPVdKzRhChgngoR8MUjift5NO4MqgsLcs3SweAfqOF3r6yoAjPaVm3l+ugWBw5f64e0KtCXTKTBMON2WlfSXJ1mSMlDzdG9HhkaqlsqZb6ydn2s05mbJaKBijLUipdrdeLOmy4690LL41RAvV1FLMc+y17dqSjW0htLARaEYgwv1SOrpHWwqMzzN7f7/6BQ78GNOjl4NVm3SyaW4t65iXuHYGMfRj6oOdKx41OEfzCy0a8096uSRHqwDkXVkpxBMhA+ERFizSOZmzaCfcihPgHMkzZGkC592mhRhtIqXdB3BELwwLdwt5HiBC/0b1vd9kf+77MQvE2urX3vP5DcjZYafz3mmunb2F7Oz7vmDO4fX85eWz0UVc7fooiP7A0SeQHl/crBuc873xPJLQeKgl6v1a362PJAWBeQpxG8VFYwVjoEZOHgHzTWtOlgbYXqONHFWwd1cFtjaYR23Fq2zOU7VdvoXQZPQkR9MZtjfy28Pk4bV5r+Jl+987RWLdjVGNhp3cdoWIoARK05B9mA+lQOOhOGBhJtyopp2usXP7x1OmycT1HjR8DRGZfNz05fNtuUy63S11pejRuJhlXYHnV5VNj+vsET9jIYdhnV8dpNKtGUWMPTEik/QJyvcjDhjpLNhwRGR7J8CJIc5VwowawUEoHZY+E4YdPwPcmZxqKK84uSh8vKdn9emrA5NWHQnKZtJTIqO2xr/WjT7CpvwkgKCmkcl2+J/TiKTnbRvopNh13alrpSkxPJsZyPulW1yf/TxypV3CxMcBomutc1RP4STWtecoFRtP0YwqNJai65TpchbpVJKSKmE0gqLg3WikMAY0mTaJNQTxc1cQrHRmTSx4gRuKV2WNV8nxmTp608y1XXzOYITDV9XmOK71mZJFZ1e9/K1S9a2eYgUhe/nlH/1XFmTvY77gT7zq4rUDyvDfKCsDHfJAvcAyLiCtM4ExyiPLBNSwwSn/HX0eKW0zvPYC2NDu8sH0I1Go0WPUhvP+IpsVXZzxSHc1tIiNKraqEqiDJeeOOt9l6RCsI3G5bbbFKFcVxgZi7kWFX8FBz8RXyQNujQrYZQBBX6eXOKx3btNh0NmcO3bxBbCWxWQrLWNxkhpoEHIFTMkGd1rpPtvuH7Ld1E7Rj4GHSJfytkVcPluy78iAekADQuw01j80RNiH7718q7dHZbs7YQF2M8TiRX7Vbph0rc/0lQ2v9lXWe/n0+RbOl9mMmTAz4wba17v+8emGdtSl1bUot6gX9jHBFNh2pGh07UlljGdURrvutFXWgqNaCyBmp6V/6qcjCl4ZWZFDwd4J858pSCGlL+aP2vAHXLygkLPy6x5eZcGfXjlRkYj1m49Y/Dvxr+KHEyn28ysX4Zyrr3d6sE2hJENF0YuWAkv5LQKiO1g0XrOQmxZ8YvAucDyLbEdOSk7OGdu/4awIBdtB6tES5lRFK0pjeKuZXwjkwZN966drjlnczStpp0bzwee+WS5eLnDQYvp7wKFT2VFZaXG3JczCZM0IDOEJd9WSOIorD6jpWD6K0VcVFwu8NR1OkdHbMjKQhCH7Zi3GV0sWNU4MGDRE/pnKB8FtUUVCKMagpfzlOV9MBHMtIlGggtMKMneAFIxAcC/7oTAYbsdUxTHc/ApoiJ6oYMwvf12tTHcfSvMlNOyUFi4sLYh9JE73PjzBLTfGoOx9HN6iD/ooFlqBgeL79QpzOHi63ZRMn0J9SI6xkEYy2kyn4aSDLkQKYCcYWhfbcfpyPWvrgpPKdHPKp+VXFxFzKjOzZuxoCo8ueQZ1s9KKfns868++RyedOis161OLcdTw8W8Y7+EVVRl5G3v39hY5XfnhuPIjI2aUGJ6BAIn1FH/HWFk6jTAmyJ3AoZKuFp82YhlZ74HBxXgElZpcfus27DKHTCgRRau8wS9a/yT9XJMpDWszDstT9H73xyT2hBHiXp5qVnK92bmVX4bGnoJ0uOZe5FcuXM2YSHogOSt9RkwRIkHEgfGmclILnJyMFtbHRQmskZnhYaR57Dsb7Vz2vuSBAd3SLR2FBfLRDt3BT65dqGc4Luajz7y/zJd8/s1yc6dk6R088uW8ZgKqNAkc1J+Xrk6HbgQLHA4n+ZJZrDxh4tHbFoD8b8oTOOo/4FD8uCB7OFDCUVHRT5Wjmg1NBtROdpvpRJhT/qeWxLpKJvfY1++kTL2MTH98fCJcFnRzPwsmu2rxyuizlVj/KNUS/Wi3oQHw+d/phH98/nhByAFxYTXc3Qfl2KYkYI0vnU87fgtw6EuxRjzoC7TIkLv0TNN6XnxuG7laygNrSnVdATWFCfWSDx70/d6fGpgvGj2kY/VTjfSyuBI38jg54iukzV74qtfQdKkQrrSofN7FrXiPH66czclJVLR5qi4eLRZpNBpSs3C7ZZ1mgX1pawMkzj+ixhjQ0I0BrwTVDp4Xtrq64EIhrzlFcbYqIq9o6jnZO/htAybJnJpcRiwDkxjgHp23lh9M7cvUnPfUsrLY0qSIlcCTyGlmRBGjKprAkEIiAfxQ4nHThy93YYsHCr5mVeVslxXrkx5NWqOy5XQGiUqVVTEL4qy7c6dqAyyi6KYnsKxwjcK+cJ55axiwYsLt0LQ7DTtqZ/Obkx+c83corA1kRp8Er6AMPVFLc3jNPjEBOx4d4AhR5Ddku0NXS604eroLtTLV/TINQvTP/prc20EBmQDKyE5UvN0QVeot6h2QQ2QIU72Bfwdvn1S2etTsb9XeVJOVacMSHwlb2+IT29BjvSJmcB7Wg6tvmAt7sKn13NSzCEOSznMnUAlpCfmtTAqng1Jzxtq3r/86irOTHw7gfzq6mMVr0X+rjQclj5IloR+0hq9c4Uk7uziCrxsdZrP04jMWft+UAzWOz/96CTmXocLlTXscG17njo1iX+Dwyc//tSpRzHB75c6ZdxWV6ctw+WLgWcUOoXc93GfLVmy6C15XuGZc+i1LpXUVsk+i5QvSiQSY5xmpSJL0xRw7PrB3S8d8dL74sZzivS35xrS0nIbKsYvv051dKvG3JlKUm9YqodhIn3upx7v2aFqoAzKKNFlxux+NLCWa9OqP3n0obOM7LKKzCOzWcEsn2Gk9LbUNO8fVKXZpR6A26KDcgt3ZZeocaIsXV0tADscJmBKPf6Ua8+GJcDKHb2v3r59naTJlD4KKNis6qW5B3E6MMbgtLIsECNCzfU6VYwCqG/D1tvTkxmnsB3ziswwy9ujkr+RT1sNUJBZrWvony43zAsu2pWo1mpP5vuKDsgiTmtOR8gQTOOECFPx/Eb/uNr42nlRSuZLTFVqQIYbtsOZPWQ+IX1FPzd3XxXtIwLPZEXFsFN4LnQuVjSOB+UDrKjfp83HRcr80EGypBLsI/Xd+VAQUV2+1e/WThhAcx6VPjv2ZuNVBtgGCdWRPgyNrEdE64mo0XusWHvTkRwRMRsTlsO3io3RhgUiYUuO2H4JAJLQTjxA6H82s/VmKwptQ68DVhJRDj0QUStMsZaIPGGuXd42ToXrsG3PPrtnvXvx3rPOutcXYXTyShDQleSfEfnqpDqJbquoLt4xHuIrG49ObA6lptkXRCIsVcbcKIIgEd4BtF0xYusaP71j2zwv1HtE6h2zkribXdhZY9Y7cq54KdS8D1HyrVJjD97boM6+16EveCfonoC6YSbMKSRE0mQRdtajyNv4nmRxYhphgZNmDTmSI+PNxhW2dwTzzsmq0AmxjUAzngMRgRwpMBnEzKu7xUdQ4j2yzWdzC+4WYQS8E7sANZjZr4vbBOpr3RnGejEIzfcBduhcOVyv1rHlrw7oCYgoGkW5BEOJc/M61eXPCdjWHj0pWAfki4TbI2F2C0zSZzRjJhe1gEP8K1iuHepRok2YFYrSgiWgECDv0As8ZEZaXxQxKxRZffqFlTu22+2Hu95Ft9cPht3vO16phTotsCCa/J7FoAA9IrLoxc8PEezAnElWNj8woFxAZq+zHqKiMDkYV3P57+wxaIPDisM9PY81+3p7mq9aFX8zy3mlY7njyRejJQEtRGf/cPAx0ABYhqa++uoX7w6sLfV9Q6ooFjcN8/3ajMo4P+FiWZn9yDBIWZ7StAP1oIyubWxGA9MxZxuf4JlasobZszkstD3WMLbYJcixJ/uEqg6mHcymVkef4g9QvyawirPllZXBynKhB63IvwBB1jBYzguRwUKN3r+MbfNHefjIflUfCdEOEgonSqq0SmlLmTbYUjpRSUr6I6mKX7WXYjjRIiKAkC0V7uZUpNZIc5yTn0/ImRUgKLBAdMd7A8yiAaxJlLGcUFijpkpV/lqBy7sZOLn1SuXhQGnM9UXGiMUzWocu2qTykinRCxavQYKQwLGF4SmYLP/a8ceRUVXACwGtCkVvoNSxYJFR3Ln/qSNVV88NlLiUHml19r7FL0uiEN1ldkFEMp+SRi4gW+i19L+BxlA+fdcnOSqDMw1W5Ag6McaeZAAXcCMo8FUeFDGp19dL/tjPL9XLNomvICIInkVNVUvtxAoJMDoQJmnSJmOWFTC0YawRYaSrS48ve6C0+XR6xun/KDz85cdtqElOuEJWWJ1gKMyuDA3btLElJE+UM1alMfHkhZMsTdsXjXqBDNlHqK8Ninhfqj1ngAGdOBIAIaTVW/ff7+Kuf0m33/7L793bnA0+10QhkNAOw0cINTsCCmNyvVHk0MGP4pUrJD3hgA0bjzv8mH9URZ3uZ/87EDpsMhSMrSMNeiAcaO2btyP6OfqJ2QthUsEhEZLkYSeMzmYh25eUf78bjA3YjCNLdE1BJllYfv/7r7paLr1qvfeQTVf6TCUOARz1z0qkOET0ka+DJ5YMjXPy3+Uh1eFk8p7pvDy5Yo6RgdB9FZtcEhAbqoleVap4maZWyBqt+YQTa9U/6UqDMn86HFHC3UandIq2uxSZsRDi07un0avw0Kxt292xXOsWhL4+d2PjrVw3ToNB6/kNgwi+iH7hX2EXLqX27nV3dw+4helLwF9yOK4+/XSVwa26Kp0IbDMk+pb/9NOVwqtTHkoTS/ddgqBcb1e0jZQGzqBGj/T2XG0kzhR2JzNOF3IR+iRFu5Ialq28Ijj9VSkfw0BJ+Fzm00xIaUwrr01bo18yWH7MmrTaocoT3d2BTT8PWjwhWgbTyKv2KEzFnYdTthoc6uLYVB2vyfR5PUCe47CAfsJAUUhl9QylBa+b/lVkR7XusYCU1pS2x/xrdA+zJg3wt3qWxdu21JiehjXLDgfn7UG/RfuMGdLmsoJF/ok08A9T8W40uN+YHrkT6HnS0gJJMzhf5CPBdvKBcgzzfGjGQjFr7YD0VHv7rAV6PyunpBJj7cBrA7Xsizw/DI6SUt4sGxjQkm7xR9U5c93Q3Cyj/WvZ37d7tyO8fwBuOeCpmVFPaU/9lF/gY8lJTdMvx3ilNASslvPCHB8JfbKqme7KtVf1n+laY/+r/UYIVRSStLIcoxtRIk1etJJcSc7Lv9nobuxUDfOj8jo8HL/mtWDbSFVkz7F9n7wf4mfFZRElpdL63cvONa9D605qpHUbUj9N9P2QlrkPnKuS9UAANFeoha6ZY0pUYJepP5oLq6WMfZqlJsX0z++PSUrt3vYyj94RDYwECwI2o4mEzHKVvlvVHuht0RWr+AfNSc0PJWTaUt/P16ejOY9unH4Gp1JtjclgOCZvlOZK0E+FYOKdlHRynR1a9VW1KEo9P0hBRdEPs11qjzpYnnr8ljoFLarVQlpnZVyNvs9Jge2k3bVsI+HQMwqQtpJKxRaUhBFWORSKfTHGqGhVRZW0pDuVopbD5dy8gM3FhP3rLTssW+Vcpw5SzZWSjDIz/GLAslqzb7c0gxlop+D+n38SNsJS5tezxj5gC4r+wrf60XMQa8Im89dyoJhkcG6p140IIxdSgqVoTH8jLmkKi2hEA2+FHDd0TmqXnjsK784KU9xUyhtjjOwI4ztzFXAAaGizuYhqsqNoZ9M0pUvqlngK7rw7SQdO7UxeZ888sqaHJ9aR+EbYUX+Z/tdfzzsCLhOuRC7w/S92iO7im3rQDJT2xhSJKdDcL7H51cF1gE0uE52OIXoIeOyAS7ydTxf54BjDKHLxLjir+RRQGnUtFbS5AXuOdtEgWRKEXm7EqirWkbUu6eP6hD5eQW/MaKcsIkSN1DOKFy8u9ldjdZF/6+Ib2qLffBHKKfZfvPj276QUN8wanHGqEc4KE7bEfCyWnMULfyTAyH1VvSy3G3upr5CChrxbns8/+y3r1Rxhzo63XElaF3/yvelVp6JKFRy2SWk7jYNZpmLaTipKo4Zq0m1Ds5Jpyllq01J9tdGjxoX86rLy8kY2060vL3NFhc9HtkywhVzq3tGOjN1dIy/NTMDtQFlpzOnhYTpwnB2n5yAOSbtnN+Pm2W285A+Fhrr56wghMclMBtrhBbQQqOiKtt5uSJVxWpa0k2MTTkoSFrGdsBAuEqM5qOshTIILhfF0b2UlyZDEe8P5MK+6J0EjsH6lxwvHK55vqKuFkKFiBRFKhmy9JP6TwIJQQ5naERhWjrA+90jXVJPXagK9kQ12zfksa1aBWLVquSmJWYoPF55pq86oXNoYo6VoOxUTp/zNITZYtQijcyAxS/HBQp62eVGXTgMFYysYAyaSH9VKTVKX1mVyAX/hLuaBp7uirCsN4NwOybRp+iVVaBRk8WPA1j0um4sX7DejnIlxw1tl3uxG31Goc+Dzy7bcaGxsPPFOGSrrBbTSJKYVF6TNXBff7n9ZHBzOsnBup4ZSOBMtOUXjsa1BHqknaKtANduxa3ZOZa2+DJfpX7/RnMT0koKFxQVwDiPcPI3upcJ0DbMg2LR0OGfV0AxEo1vjQM96jCAcTGTiOHOPqi2yOVhagp4XaW7tGrUV0a3Aau3YbiT4o2bnRzkTgp3TKQPJM+piSKnV9jaXxYakC8oTGdf8dNZnhUIcogSe73r1lVMru7p4ft34+PbtwKbK5TMRy9vB+nFxS0txYPQ9noe7F0r5tvgIXQQ53Hso38cv0s8nZfO2YVJniG/zDULrjXvjM66x5vUlb7GJcfv/Da1UKxyl0XgFSOve9h7c9tjtHqgVTd52T4pqJQtTsiL0nciOha7XEGBYerqt7fTS7U4NgeN4ykv5Fk/aopZ0j+WdPBBClqc49OWfn6LFtI7zPbY0Pmi9amCgZ5vwckjxLdA2mt7bqP24sNvG9GTLRGXphS5yhS/D8filv+nuoibfCdDC5mTHdPILomA4epmJPbNKw0RgZ6VBSSOlobWVZXVW24OB8MPzyXz+2sXQYk9WI73/bQOAxbRL/F24WTSxgBMArQ3bGNFhjRdhG4YHC0tYylO3yn24mWsNlW6DYV8eg5j25yoqva/mG8ApcGy3kdlZinsn1okBWbPMXOmVMpFBJImx9JyMpUmvFfCS9EWLAlD1Da63a8e7eSmQw2A2eQRoOolG2XnDTD5Jk1elvouADO3JBItbpwmJjKfnl32FCxUznlrry8Rg2CeeMcNAJPpy7GNyGgvNTPYdVO8pzGvySs//y6NBbBrEnlReyCMny+in5ktsjsg8Q02ghKRqzz/z0lMXdFD/zm/PrfhoEt6x70waDU+I+kx3JrN0BpF5kr8a+VmQqXnz24N0HakL0n03UQHUP79SXiPMPDpk1c/nyx6qy7kWAkJ/SYt3b/morbQEuOB5tYlNadPYrJ02qXAJpcKJY6OY1UonpDBUt4MNYzc9TY8iRt7W6dz9I/3uH9eLbhKfCtyCdUBXi6uCQZeds8OvQkI6oPYRXC8EqKmssydS+NzYoPMbND4yrFhS8iSMNdvdOh2sLlqzbCmMD05mAkXqwF3La/o4+xAxNrRCMjFz7UpCoDkxXPLSY79cuDI9vjV+3a+OvJyskFqCzu8gO2ge1yUw1nX2ua1PJLk3px8ThHF0Z+SYE8TxxmKLJaMJizJkoFlkETkR+vjEPj4xxOVtiNBBriJqdUuXukvoW7CobbAa4Uc+/UNqQKxj9ZTJHIgp9niaEngO4u9xuRxmNDNJCDxJe2u1lwbIx0+w6SFpzUGAmGpdrjNiW5oR5L6OpnWC2S6RQBpEYWSb6I/dKlAQKGXatBqZQxkyS5FWjasMg50riynZHs3f8nKhRQ37I7hJ0cf0lF4xXu7Lzp5TGinXfgaTYzO5TFCj2YaiKhX6S+TjD8ooBTzAFy8uySJ0hB9/rLYy2xt7x3vltn/4YVx2iW9Em6wtua89N22GX17th2eEYaJtiUYuWpLk36NTxdFeBkLJ2FEsrVewVFO+7KDWmK3+UdBOFD/rQHcR4ta8U2qSvqelc2hodcg8siEk4kjdPh0eNMVRTJM08MzF5jXcJQweDJ63Ihw5SIqeKiv15LMH8JSWPo2AA9Zlpa1UaBpkSZqxHTNoPGuaoBzoBtKpD0ioeQVVwh6vxFope5YRXkC0SYqQNVl0LCZiLNkeEbO7iPzyqY9F382SxiKij6lJHmlpN8Q8iaRgzf7lpmdr6fmkEy+uXcuXlNT7QeAkPoVPEmGLAXWb9sho2hA4RmAbPsYHT+fHqpszR5FLAfQjipoONthQIGBHHnfBBKjfjHGlv0Wstbfd5JzTaLX8N/95nk7r3G8ZBXVznw0+PDq0OtvKOrdnS1dR97LvZwMEr3Ynt4Zran6srmHZYQMv2Gzfn/uer8A2BcFa+puF+UJuX9NxCYf8BI3wIxNwBad9xmbA9CGqlHlS2znrBidEJQQrK2PnVbbc1TxOBeUj+kFtWKob/kA9+7/77nW1ReFbUcGXldV1gNe9bPTSGA/tLV9QOW/+Pv67p2XpImlJ4v7X7mXD/ezX9usSFx9I4+umwmr/Waq28L31XroGXqA9/e693cjlwnt2PrAT+fT1u3nR4SYF/grW691N++16K/dEDBaWdT/xRD+0I7fDYbUuwXY7XtLXBwyVE7tdSQOeGeVH55ov8nWsOxmOg09bH8OTGdDdfRGfWroMOHAIJMkwnQxJdkpMe4qRO5EWjAnNk6BuJqlZkhn1+j3hjquzE00eXiyImfdk0BTD3IR58VQndenrB3FGdHa6wLnTxXTCjwE4E8vgeNyNGpObgInKSpZxN/ASU7IONtl5sLJpVQZ/9D4oDVgnSjNU6WlOAAxCXImyfCa4bPalwY9x63tGaR0MBgzmoPQdqp07dspK/oL5ukLO9pHt/TWZrz6aVBaaGtYTLixtbvJwaQ3MddXztf5Fv7G0iRdLn5+Z2MlHz2ca+/tHgAz0L8At7/oPGgLch1rIx692v4udjVW/0a2bc73f8Af5ZYtX/aC+fXF7G9ypqFtcvyFi282L33LhKn/3oT0TF7s9Blfd4qBWlS10q8JqSlNlJhNuPS7i0JHkxHO+hpAMEm5fp6nk3SxWLbZKGNiIqIrAEKo2j7OSfxCqUSTOWFqErVa3XRaS5ZXBw19bLyjXcxA69hG/i6pSfja4SwE36i68SzFbawr2jQBzuPwy5gcfXNs03nE7OCgnJi9WqHzOAdDt6NqDDzL/S4VDQEpoDTx52MoDF2CYQK30laUREi0ag4JbIGwRTxvxVrS4hWS3WYI3S+NBb9Qb3LeE5ml97RvvopXxniO++lXvLVN90y4tPfRQJ+sDMVPs4AsD3X4H3dLvx+JL5KNdHD76WnITtH6wvqVEBYgFjgAxze2T4gINCFDAByox6WKVnxFiHRpUrcqzucxDoecabJ4UyRx6yzhcAIgMbLToFLkTDZkYXV/MvNlGyuEKp7AnEU2LcKb4gao/sDwCVZltfVC3TvPe1Q4V3rbqDKAqFcflt+i6g9iV53JsKHNoWiyNUZDHSzS9NbOeCh/IWGtrZaiSDiMBqWCdSmI06DAUkJCBALSucKZUxOST7zS9scXFmYI9VPjKLC2euzkop0JsUXbUMK8mIWup3cDogW0x87gkvWq+fQa6Cn6Nv0Hp5DdGmcJmKlNgZkvrUbB/JkJLCaqimInKjQ6Nr+uEpAUSkGZ3fSX+/QGqvw3gS8+31zkux7bVOtpr80e6urO7a6S7f9Mvgw0NaGjq2e2Nfqyzg2VLSpbD99ooS9gadU13d416rrAjqtBkGvI72VDnyA7QrVnDexbre5iPQ/8rrLm6ZDwv7/PPVZrChobCnJ3LZt1Mg8H+XcjltftbwiX1nubzBwUnbgHnF4dagbmkqqYFmEte0Jicy2HD5m4q88GyZG4+7a9KRsh0CTWNplUO6YDLWvn9jRtLSjomV6yotLo0wDaqIytL3mVa+pG7zzRvP57CQljpjk40hADt/5jUNMZSRdDeK3wVBzbdR4K0UiOP8urGtBTjfK/9c9xrngjQjBVOmldev0KFrO0ieXRT/4pZBCFQ25YBNcZSuAZG5BCg7wr1qO3W4MeK5rrXpYcLH5gyd9gI51i7d6vZ7rEPXo+aaO+6Os4c76tsrlBfb86ZoOvu4oXu1nkPu5wcdC92Xz1Ukit45qSMYTyWlASPkFtSMbcTc1j10ixc4Tzhcj3zLF8q5J52VrkC/21uSuLly8UpYw0ETyMj6aRVcPehklwBuWA1Y0nl1X8/+xMPmhoipoOZxjQz0P3R/F3zbmiiDMsSQy/uAwgnCuEwuQ+mLQ0orQtc0sGCYQyKGDDujYqfLA287HBHxYXatH6baBCaU7DZd2ATVezVFAFZNtbn6ROO579wi/ftb5TpGwUnk8qgza/s/2bG3j69rjz1oTxcLw8R3ZQEyLdkJrdkafKN6VHNIiL8166QhKGx07HKvTs1SYNngZWbo8xjK5+YKdm46uvXJF9KWNFgMHXpw9MrF4klyL8nrIB4cig80FxXb9w0Yz6zS3Lm+YjiCtL/QOD03Nn+IbMUk2/Iwl79Rp52cCMbKyvhK5N17dPhfD0b/pEy+RzHi7RuEXF0hyTkvn1Gkh88ebLwatfJva0Pq23pJHovSDtpqsl+GNJqRu2jr1aJtKk6+2Gm92bYCwKwgQJ/ZIAZ/E6BZzcVBxU3qBXD//MW5ESCFefNfssGAbdEnt00dNoZ88z6QD/o4yOUlfUHFyfHArFhSl197BtvzQ+rX37//Orn8lfhM7aM+QuLJfUQQi46GPbNx0qRT9al954LT3jA7Qd9V6+dNzC3bY0c4g5L/OfwBYAL0wuwYatJ36DfYDTpnLKhtqHcVD7hOuwM2LCgUhu/Wloay8sVGyoHKxWNcP+DOSp+7LO6LS98mIRyYIltd03Sanp+UnZPpFRGnTT2yOLF4JKIH2QUv+lFhPuH7oQvTogIqO96tzbzE8Ab+UbrmmPe9U3ze+7+3FK6oQwYbU6sPVaDSdywOUhh3DA/dcxY7bwd9ktqLhVXFc/LqE9NXFLCyf4UZ1YFGooBlQ3/J2J1myR3yFU/7s5P0Pk2n5F2LEyYqTpRgv1vsU8XX71uMzvX2u+A0zzrn2yHJNue2FCjpHmsLz8Y3DeYk5FVOu7Necp7X7z+x0kmv0IfX/XyzPVX1qHOv6ldnVUOdvXkfPDJ6977tUJTuOe/AvFlJQD3rMDoUAGuHJFwXnj3UQ4U62hF/m4ng8++fKYYHmGLiMhNtKVPUIa9nBUujnzdczzrjSjYYl+TsMBbEH+qsL1r0dKv/4nvLJ86ZVysCZh27pFWtHb4yrXG8oqkNM9q58NePH2Wl1CSvWgqSOkbCDGV2SotNVE8kqcy15xBWXSHeO5nsDvm26GhQb///DPmYbvVrP5Oe+6XycuWX246jWVnR7TM//D5ymAny6QKRbIeIe/4Yj4RHDpJ0MennlLkMT75xNTkRvmNQlp0U9gdJfXTFEfz5Hxv8x+/k1EnUx4V03wzGz3zrpAkkcJkiUhSuA2CIqBloLDxDzI3wFYmqZ3Lz4vrK8JmPN6ye/eEyOMh35Ju999zHxhk65ibWc3lkQSYgSc4dXjML5W/xMTNjqOk/rAh2lvB6uEJw9Wq/x5MTkvVzN0hIj7yoPtrs7SxZ+7MRn68YkNpy/GKFbovAo675yaa2V7IAmynULvtfXBlyazZs8Zff/kTCx8blxQaig3Swfq4WH1s3ATyeQCX3dDxKEVNc0t1+ZSOLzs6KnzdXUAzuKBofEHhYM3Lbd8nagqbHUWSkZAoAT81T5pGkntiVMQ4ZS6pjN5Dnv5vMm4h96626scVJNV7Q5bmyCd+lbI8RVzsLBlmGGcQFbDCdPYTFnyZWakQzlqbsiXlvnDm0tzgYFsMlu2NbdKMmWvpsbDBfhU3DrkXrjyhmmLskHPUmnrKGKcSyGXDZ3fu7sWxblz8+eq/ExQnIn3lnfM7R2D4cVJ+GISdyhVe/fcz3BiZlS3/YaLD8u8kCz/HGKfEblqQQqTA2HDh2oL5SzPPqv+e/MXTVhxnDb/Kuvj8lQ/+TFIol4JVsUqrshQMi7HlvGrjdmJVkEFZojQENbMTZaLjL3GEWMyfiHEPw5SWoJIgi7KX/xlWZTTFVZTQgJvxV0Wi40+aE9NiMQcy9EnLjv9xzhGiDI80/BHE/OPve6H/eoXCNjohOSHNbvb98tvxGoM1SI7Jp1rDQFjRMF6MwRAk3/OEFCVkAAZN0uzViM9NCUobSAtQrEpPBW481DZp/dKpZv0xkDYwdGSmf+R+tBZjF1bK5vaa8W/59Ej+t3guNhFNnSXfjG/5IuV7X7uWJUkB7ZczYP30e+DFcntiZpytMG9sdJteXSm8U9guz75WZjDlpRlCBAbhr8LAMFqtEWUpcQ0Ch7UjoF1UwWmBqAr4cBmGHbH7/szuM4jkCmv4cpUy34lkouvKFt9TQomklRI9PhjAJWF5UlrZCGaqAhenlLsnFG1ZBvNmOPtAXx/t8rf36Y5deVzUB3V9C3U7Z5gefGft3as3u4Elywd2MrV9OLyJD27YRHnWQDGLb9hIgaEjgmxWmzKDMP5Cn1Y5iZam1C7wKrDV9u2ZKqVugU8hVCzyacDr4AP6fvmXvwJr2GjYiNZvFFvTz45ZE9PTb37/C29c/yZTffel9biNdtV6O2i4FSuOEcvlYyeflps0cnrH2MeHecGBkvOyEaWY3LCT1f/3KAfrRSMVPaqQr2Pqs6P2RkXuq2fbSwytQnjSILdupjV5wd/GyO9K7FYHTwRrUFRxhnSuYmxcmjJZifJyRpgynCbk6RbjS3VqvfZtTYHWccdxG/2XKl3Br98cjr0bn1OWY2LCgzx2D6i+X7rwMKsuS4K/d4ssGelI2Noz/1t1WLTty139nT/+W3z5fibsrTY/PjjfHE+TYbwYrTcluy46KffIHDL19cD+SQFcuPYyq4HAoLRRsYp+fnVcmVJg1BvDllw+sWLg1CQlMETWmx0jto+OyJ+dyUDQ9OteXJD8KzIHqgtNd83wIep6SOfPtVCoDAIekdax5eXBDr9u6VN3eB5fgkHALixGymiQLq35OT7+w2dvfo2bAJsbF4wKLBw8kkWyMsqepslfpfUkKBg+X0iRCCRQ55jptIX7lHOoC5CRhoAJKwUnf/YG4XJhNi2GxvLxATLynG3S3hjvWE3eupEDIj9VEvCiZ/dCkW+pkGpR4NOLsRmNiYX91U2UF4SWONbJw8zcFWf1F/SL/9AehYluVrFz+s0xl/e++c+xXgc/kDM9b7iSh4BtoxsxSTq1JN4uPs0KiAygjqlaotm1F2XF6DLqowKZqQbrF75sk1Sylv2yUX2UVS3KFr40/CuTylRWhBlYwqsXW9TkI7mJ6tXqPARzB3DFasECmrMaVG5OrMHRUvW3xWskMXyKWtBiR0a8fDZmi7goLrti5zAzKDVlR1Zsh/wAW2YjBP+hm7SZ5qc9gb6ksK4gQkWb7fAUfiS5zrug3tDEYMHjryRbDS73S3owfXi6mW9K3GiM8A7cTL8c4G0aE8UCwWQG39815uNNeBgONJaOBsbfzrXDCmLzkFidfqp1rUEi4xGhiN+VFBwLviifxR4T0vqY5rohDX4hMrIwHZyN5aVfIH6Znapxm6jGS3vbP1h7VpHKMy7MOBik2iDlbVBlpwJTF5mLCxYHOiwhYKzET8p8RfD89p6MBCtAu5ka978iSV3XXuil/w+OzigTX7lsWVkpUNF6d2lpmcqj+vlSRe8KPVFwInQXODrgBHDzk9hh76ocqH+yQVW5t3nXUBjqoh3kwJmBry9ELpAvOEB5SFkrqEocOHeUcl0nLQ8vLWMnqREETQ5cqVkn1spFUTkUsNRugaJFE9SS7a5D2mFh6RSbh+CYBHJwvnYJxi2zCGAn+gFEL0Vt/hIAso7UJddD9RYvAD5TqJVW5kQ0u88d5m5os1yXbaZDmxhCvar1YqDvljUePY6SiOr4DAEBmF+lB9OzMMMZ8IzLInh1PJl36ADkvCAxL0pXURq8zEpVO1ooWEY8RgBAQtpTD1BhEYD979+itU/00eyvtzHLQlb0C5hY4iRT6prWy30/Cx1Ocs2SoPebypXjyh8m8AmmEG7dOzMGZ4ciZ3MBPvjaKir1wW3DKgFagC8/5qy6Kb9zNM296F38a/1rC95zb+pqrn+vBbdu8jla865nU2tEOiPxls1n3qtSr960N85lcMt/PZZ2s8qJ74AXEjaCMKWST+L5m4UEPiEzKC5TQlkz0ItQnnDfSYRglWOi25u3Cqug7n7c2av2S6vs7Q69+atPz9aUFjAg5hHvHDVhk5M6bqjy2ITBxAb0dRrwCluJTraolUiukWLprgAh4vvaKqEixktof/rp8gqhE+2Q1okCenqWQ2x+yV93KlYtWRCPEGTGxkVjF1UNUfbjCLQjP1Zy+8W3g5t/PRBSkVxEBpiEaCVX0Spa3nrW2znM8SlYi/nAm03upv6d+YmImyZ3kZ/b4/ZPvDoagJWdxRMomIni6PsYTOI4lPXbzWdKsWluka5orgnrmj0bs1Dc/73QQEZ6mtLPRBJvxKBgc8vjJE63gdbiybtuwMhLGFl+QMXezOQg5yNwdnr941COSW+h7LP8eBW4uE+10U5YxPbGBxN2OlkuhRc01MmfZUvbXfKQEKEoSSREdTX6pqZqvRnR9iJmd2NTD+uAy1tmQlEyJURg/bDGRkZgREhdpTb9mXld4doe+D0RKIcuKqaetTwbjGqyNMHlFVvS2fTp7WTpFq/Y5XILrQ0Bz/5OgTEVGz4czk4n86pNwO9FvEqYDghYtQ2G8/sl0pDZg7lAPBJjV0mzRtcCTlZ+TlaNhuNlKUk+nlYYLNsRFzeKJAmLREpkFRUqCeNHSM4Pzu8zsIizcy6qHRa2ShjKizskZWA7rRt6VyxuOdXfj95oLXjwoACNo5JAYkseq2qXx38kLDQ+Dm6K617DAc/H/vp0VkgKPn0g22heu1ors8rVe7/8+9OC1aq15o2yvVq13Cqru1IGtHuWVjKB3+vBgQvyBZELiIFk7Jgdu8nxJHllbRawFsj2ifpabfjMbbHb4hO4Ni+lKbSpVDaYXqm4f6QhNqQxwlZhLx8DrGQKqqWdtvPT9A0aSLjIitiLkh8uan+gxg9wMecQb8K5bWLSVBo6Kys7DZVcQs/CHjXTcUxWprgKrqoKpbgxHhT+CCbMtEtLJ0tJMcVVN2304o4+WjsRIjnYyeKsczmi0g5M04DBmQwOBu0jBNaNokzxkwzvP+7SErrQv98EbFGl3cVzGJ+DUR5s6+QSUJwFdtqK7SSfAQFQDpbgDOrjCTCJF6Ym77K+OFozdZHwgIzbpd0OTmO1yTeJXDjEKjayMAwF88LWinYBIsHA6KDBLNNpZkLYH64N57AtWRk+ylg5mOJsZpgHM5bAy4tFyPSLcQJaWSdbZQV//Ls36zGkNdEbaVqLU92v3FvHhj2M+ug7Vc175jVvPfE2km3AcSlK1xhCH5i8L2wqjSd/fEbQy5MFcqD0FMQfpOWdiYFQUDK4X8GvTu3qhxr5FMV/BhrdJ11pJ8gB2biZwxptY0hNd8AcG7fDVs9A6GyWsdeyIoQtWxgYNYwc3Tw1W50hi33pp08kdhYwV571klchrziGU01YWlghqhDIycpyNjJXz2V7xWNh+WcMZvCBRNkyCefL4TybZ5SMI4FnneSVxiHzPUaOoipI5V+yjZyA7xV6MKyJx+KTr+BiisIml7WMwoUhYlEwxWFtGNbOE9GE5WDQ2p7NhRfB36yci0/9IsanHhXgVzr4LK+Jhw3H8Ql8zMKIAJyYDfCUxaAea2o3ojGh9RjY/c/NVavdl3r77EFBtzPBeKy42N7XOzbR+SrEymphUhEGlypRIJafJFy9xpfSaGg3odcTVEKDKV+hteOv6jSaUvOTtayP5pApF3EibIrtyM46MYcxjcAqkodFGisMsS/Nu7L+7HrvwMiDKA7SAIvzFDuZMcOavv6KYU5etVv9iBquS2/6g5///bPPOhz8mHpUvb2tuXk/08245cuWOfyaJ70psQvDI5HdNhyWXO+R2p1XvaySVNfpONCUCWP71qCTx602jFcC8WsowKKSmxeOKGmBFcwk9HsdZtO7u0RoCpuQCXO0ySLJYo6jfRNMoPuCgWcxwqzgqpYmttkX7ErezwItg3++k7gsYQZIL2ITX1M2tg3vXFGRI4ucERiRrCv7VRTcuoVuiEwRpUF1a/8MqUxy2+/w5jEiJM+wcnDXJ0fq0lw4DFjiQBOmkXu2pVfhG6+jXOt0dpY2JFcWBRHDDKsdLuOVV6NvNh252+QpY5ae2fFsa0ARoGg0uvLN1Ok3Dzv1FJVbOXPhxXcYyfHe7vXkIDzUnu6sK8VpkkQRzuKsb/ny5cWLbTPmKnLyQi4dpNlLl2YuWiCMRKVSi9PRIO636I0IEdYWaFn98J3dC2ecPbg1wx0yKMSdsXXbo1859s2jbVs8Ls2gYI879wXH3cDnDGaDo7Oz3xKilvd2RKsldok62pfzRCB4MicPHOezIhQEe3LTt49ui+lrgZoxbCQRFrY50CCQbO6TCMLDGzM+/ohU6pRkS0uGu5BgZy3miEvOjGo8Sjw6f/PmR07j0bLqGhaXyXyD2z3r+tvaToTGC0/wegtnXvyS4b5H7wIyArf38ZleDqECmz+4eKh3ZnYiKUyoDDl0kGEP3VGDzEIt1tIyeq3FIuHKDmbUfzz34Ze7Z84A5y9qT44WchLe221vNnm00Zp1yXBy9EntES42JsfX2iogu0l2eaU0URIbXZHz5ZDlPOTkxMRIwXd7n/oPi564x6G6e4R8On/u1Tadvq8O97+lxery4toG3olk3EQiwS+1Iw7bMccuLyXp7HIWCo7w2ZSGzqYxzCdzrik8xA8B4hUkmGs8LCfw/nTzjveqE8qttjdRU+wcZ4h69ToCc3GbiwYV2lBxlDi0zWbjWaX5DZkJi9gGnbPTksLaSAnFmRhV1lnBqfl7nL2ExvQnDOiCd+ryZ79bm39Bjp9K/r8O1WdY9VFygfwota5VqNUejFSXRW9IaJtz4NRBCv1SkXbvc6kJGrUdjuUWozMOBpXsamXlym+drpeMSbxE8ztNn3kP7E+PebimuIICmNiKal7yDx6qUYMDQelZlu8Zy7b6FV+iQvCEIMZT0/5WWNFWL8v0orZjzY4EvgOhK9GNn/wVCXH1axn40PUqVw0EkOQXM1nZQhfWaqVtNZBfYFk7Ddb4PsGECtrRz7z3vLl8rlz+XD1z20Mh6FdUbb13XXOIYtxT80jVrtlJA83BB46MHHNgEXDOeOLyfx97/2AguErR/zCUf4elP5szUuXrnd3T3Rx8sMhgEZIDCpWAFT8uxTCR4Ta4GmgQzAO5SBzVAlDuekNGehcx1zAi4lKD0yBlMjjcp68JslS0HdfS1oYy/AaJQ5vwVMn4vzrsK0FPnwo5sMwG158cXrFOF+mxllcVqcNe2zld/slYF7Z7sa/44uaTg8jTYTbnTQcojK6WyOQQ62ghcVdPkxUx+m0Ft5bWPP+DH9VwZfkyBN1ME/naqwMZ/PkDY5AwjFefxmMZMKcSNAFLKBCAVNWFCkKgtRRDQ2D+siImjMVIBkMMeNwOsmPeFSUvO7blqexb/04A/yoUBtg3Fakze83owngeR3dGZ3uDfY/erChp3WGXPBi9Fs6RG8xoNvTk6N9babXbLU6oky9S6BFekV8wNRE4MD1QgQ9T6CPnf4QO/PJ14FcRRcfWG7o+CihjKSRUklIqOsFEX/dxBjD6LsB4KqqeieBnvpPkyIHiLUlvJL8W/FmZPNS8cWNzIdncTI61HFvYfKylsOfUMz1QzT7753MQ1BSUe9V8/r0/rzx2YKFi2+mgpenMhJnCSzlTXKqGyaMC53qWB1YYpd+zzsSldGrTVPD24dAlxiWg93DRv0R99qLXz0p1w6XvMUEXMlZtVdu5xXWqURK7cYPRQeoMtTP+PIRKkrumdgWVmF2Od3qZ1CpSJWxPB6WTUGIYSZ211GAeTBW5iaJNKNGfGQTRJkX3PujWez3Y5Z8g0OGVb6rDhvIjEOD8O8M9K2Zyx6VNFsaII0HTN43XoakiBEbKIDj90bofAWagvLc9c4AX8uVAiNMbmhe8ifi1fqJU54JKhV+1WiCI/sna1X9xYSqCitlmjYs+CZTZGF8dt//eSQDuO/drPJ4h+4bu0+gigc58GCP7NXuHSFkafaTe5NzyNe8E60yl5U5FjSpmcnmJ3maujW91dSRlPvgn3oyo///G10enbv52ISbzjaLVOXKsNSArLdQPcuszE4wCCYWIYQfzOkv3178lxZsOeN2SqXQacz9mL56qIYZEigaELPj0r1ma4faiAvsWU36BbU1iYWFiZXRJUSxJ/ky9tAgJdC8oEtyV3BHknxT8KPlJsETwk+RHAehzXHHN27gCbvwV9YdS+UeQ3J+8rG/ipK357PDkz/GROrcixpviBmlH7UVnCgZfB5v3xx5QOLJEVrl9LwKdAt1PtACgVWvGBHYUgu/hzWu/qYtjgj2I/ufbEGu8M4Aqsp4jemYvA3ihC8JidikyckUGuaGkIQiFuNQt48bt1UGWajQAhIwUIEm+pQ/Rj5/VxXI46F5c0l3cVTKheGfC4qPUVQxYSMqcMmVNnEHmhD5BZBripcr4tNsHwzUP09M38euwnTWDM7f7wn9cM2WMJyzqzMDvyrd4nkE8zaQYP5Zfh587U7db0iAROf1OzFXuqsic6LkvWytvFOLCPVo94JWM9iEU9PgaLygkkxN5hK7315QQl8RprNYw9bNTF+7QSvfNHqirD4oqGJKZdEYftWi4E4UZrE48CNVHv0gMNGmLw7mf/ytjxNSPIOvca5mqNriH5+EVoE08EepH81AngkIQ7zuTfY/tK14TWkQcXXf3wh1s6rYGtYj0uIBaE6FeG6v7wdnxyl8qfq78ucJT1xx0k/X5tAvDVr02Gv1Sv75d4v/O9ssSwFfTXj3zatfiC9Py3EE3RlMD5qtBbiBKmotu5k9zw/B+zWoahQB9DX29OPikYFZgdhj1TCZ7KqJ+l0r/CPT+Gdf3Z9Yi7x863TNl0B8G7TsluBeht4n532A3IZjn5wnFC0Yf+ZhOevnASxE2EGfIbuCx/C4+HKXFj2tXP86nPDWZieodrR2Jrxy8xik/QXwjhh1B2A28XvTh7uzC/ZPBkj9VeyQMjxbEprrKopyfSgzRRQlRTZaEjCxLMOqRS2IlDaYl8/Sym9dWfmkwHO1qVOfn16dIdGOeR079milr1s5qBqMDCiiUfsUrw5ShyYdktZpXDXGHIChDGs5N/Rp52fz5x2vKGo2IInn141+6ul/fUW/ctMsnq5SDLGgyytqwywf580vnXajhfUQDCKrXbuScctB3KbpPIbCOy1me824VKGer2G6GO2MtgPXDw+rLOIhulVFWlZUS6UU0KCBCqoqgzLMSpntwmJKRtsIq57Va/BY2OprV+/WZ5jgs36RbvRIsP3hMYcpwmkOW6VlPe5tLYv1Tq/+/gX4/zLrb33fJWqqPKKXCZ9ftmW3WjwOtrTYbn/z6qky+YdG0SrdbKAQkeWTdFJVhVu9amWLgbHnO2/ecF9snCEUv/pjJjvT5CvKa2gSUmGT378/7X3RoH9gSEXky/ETkjfD5qsgT4Scjb4bviV24rPzgRmX5H3/+OxoGwWoQUNIRQRDCTzg7WV7yzYHGZTMtYD3RRUfT8cx6eMxK2QArkAzIVo2dbP71nh+CQFc9b+6vmR0goIOwEhInUUrQbmLYsNW3L6nBO3B6Mv4pLv2EWEDQ84nFhKQXX4B/3Phcup6Dr8Glq4kdxNJtPWAGthF18BhjmqUTUv4j+hN4mt81pMKUOsaf7h8X+v76axFa1LnveFTw6b8+CV4QB8J1rvb4eP8gVW4H4jhlplzx7X7jgdDxof7xfKRAhEqMafw+yAEhrhD3GG8gJVSZyTj+ZjNkvIOJwhPzHBIyhyxOp9JYyu6WGkHM/CkdO2JaDnKeN6uDx+xM9HXc9M7c4f4e9M2Z359r7bMzael0We+czumQvSF82kfMQ96h1mfXvt28ZPgImxFURykMXhwz4Qls6zDIyIUxwMoCT+Jh0Yk7Ddb/ZdpbyoCzOHDh/kdlZWtWfKltXXvxxwDBgRVZBu/l8pTrBmp3q4EzXPfGzbFzqvrPK5599thUcrP9ZqlKVVD0amFRxOLBf9aC46F+3/Y8RuXPrAKMiEg1JZiQkvewfIi0AM17VgDBCIYJeBRDDKprF2pDTRCtaW6W5wP/OFO6452zMYstchBe2oBqY/Cc82C9JF2vRTNSTt3uX50HKRTjgBj8duA3+3S+zKLXIsRX3TmwOvcrqLL/yztZlUlKeGHllZbkiWD0mrgIMonX7ClNV4THkdUbf+3wNjP7BYJ+2/QSFjeKhn4OaSbttcyYzg9S8FLwsGjZRjoDzJGukCLvtcv4BbjL5tBibr4MqUN4Q1+bZtA24VeDUYpE++/eZ5+5FepCpr06cCxVJvj/SL8G+Tj660CxPE+u6FJ2bToVn4yZtJZGQqjWC2QTZEJG36ZtPSJHkMa69REymJtrghhzITwEgbVABsEASpWnStFkOSLAEe757Bk5qIhEBSFC4b+RmChMkKQKyoNgiId0qjHIhqI2CDP/l7qPkS+DUBQKe6AhSJwP8yELxIMw/ipcXBMsQYX/NvMzwlMCEUv72qO1D397SRD+W3H1XKE2TJga9rjwlFZ97PGf3hLuCVC+fkbRwLUbhTcdwr079ofpA/nTyW8krn7HtvHatf9Yw3+l/4yz3q3Cb7fvPXL8EX/6oXmx8N+/3v5/PZizOPYf4T3/NjyAsOAZ2mCox7xMm/ihQ4F6jJxvQ6JpO9jxkpGO/ZymJoJXDlnHDdCWk9ER1Uow4dabgNSsipJ0JmgTulxYlyEFHAkkvWTDmiFJO4mxuMfl3ddAYqSwJwvq0dBQDa4Q/6PIa501q6G6uvXauC+zoQc8vQ2ZaKlF4GxegU4ttSHnaGNBtR9oxYyA6/VhtJTUerQUaQWZ4kWZhemIikAMu8MC3C5tRQPR03a/8qhaELAF7FnkzSSPw7HoSznsTtgWQh/YupFR+ESTnogYJypooUs7iYwZWSSaaMEu4LaGx6S4IP6DvYl2jPkeB2FQinaD2No70VEoz0Rcq2DVnhbCebmdBmQnOyvFFwG0DKNhRaTrohWWR/RsNQBnPg/XpDJoQUc0a7yjuDYnmrOEDV6hac+RjAsP6g5llst11UgGsKyECN59G1TP0f5skNIOnsQUafXIhFB2w1ZNKfg5yIsMMXOijFoQOuNdyPWw4lKqETNhS00K2ZErYgxcZZCWomgCmgzN9q6WvFXr0UQ1XkHHpcZd4WkZgyHnRiveKtuJ3XPpRFbGd/PGWvzEw/pAAbNX0boRHneSZdHKMst3EqO5ihi1WrpKRhnrL0Efh2CgH8Qq4m5rPcRdEf+Z5SMm5qO6eJUjVwUfRXYQC3baRLvS9j5S3YkFkCPrlRx4KBFuZq/tVhNFVxasYmdemW+tvgTSyBt2Gl6tq9qxs2VdAP80JfAd6DfEAgkJIpqqSAvNWg2ZpPr1qdqm1S+yUmcyiHeeadlELRsBz0TWa4O7i03kedo1OaC03HV8No2DWmazq/VPmp0/2dAzHWOvkjyL5Mpe3oC2og/ZO81dOf5d/U5n4Rt3Iymv/k76QNIBu7UkacMISHSlbePhBwltF2zEWyCqRWZnOAdSrTtG1axKit0Vp/rwuO3S9TI78zhq11WPsBdXTB/oaWKTNVKsdmymPoLRgatnvHdyiIy2vJsFjDd3RK8yo1wfsio3dnjcNmOGjf4tawdUf+DOO3NnWgu5jt11p9bGjF5YVGMUVTf2fuV1oaUIdT0aXaYvqccVHnRnv4cLYbV6uk3yyBGr2jvf3tvO9b1Xg/SEgtUGZRnVFtTp3TQ7e3ZRVtytYugj4EYynthvR4u0pxWdCderTz0RhKXtbFddPWvbY9fdVNIfKfT17lDAuWtZr0TlK6D8jl21MkTDZwBxdqH3Llh/emfUgruJ9UY7eVKb6B3ifbWDmShNJYEeBLIzQx5Fqmu+Uo2J1AE19X4Udvs8KE5osQx2d+XMK+o8RCJ55Ts0nHcQaWBcNHaSInsj6/XS2nmamZtpDoG7qaMpT5Y7ranUtix/UNrYKKleO2pHdGw6k45VpaXVzFeX6aL/emczpVvDrP7GeRltIIsYa3qWGFaZPZMuelahdI7usrVTxFjg7JofqtApb15Q6mP15V3Zpd/dc6a9F9vnf+qU/h+3zZC/l2br/SGAwOkHS61WcfUpMwH4jWXceimQ6gedC0jj3/65AnLu90pbof8joeDvBeNCiVk4gelTdwDyPxI/boQJoke86YkicuwI+DhKABEiJ7J4/Nk742AMRj43vc4IWTXd4/aNHZrA6HPlH14tTk3LZjZxdOC480y6l+z2nSuCuNalo5dfg7Z9ckA6QSYXh3CM/D48nPkOkFOcCHz4JsjpbHNIe0mOlbM6yNlr2tvzSZuDWwC9Seuu3UFK6nZk8AjUWSffaS+ZeY7liLz/LO7Kp6dxd/yjYQfqm14b7avbnQtaX+oOe8l8wP+nD4xbeexCTrTq/MzgMR3kLZUbiXV+oTPIXeKuDKbB66ubX18GPihnAeKcCNTSP9njaPceqWd1TpacHDsR8Eqd6GgQj/mReMYRasb1RwDkUJDZrScH6hzZoYNtMhzH6VplpRj66G3TEUVmw/XKyUtpL2aFsh9eu0tPjAVfoNleJ6mnnJlH8Vs5WHCN2ZF1o8G192g18tHZwv7pSbWXRcQfl9J9sll9SIN1w60TI02+p3dZkB3yQxN7jyHe/jhCKXt21oF8yiL9qPEgGylnLxZ7XQyhK3Pl6t/BmmMkjHDk4cq+C5ALJWrhXSdOlKT8HVwsCfJnbYy8IB6fg3ly1hCWkOGmVWfd/uiWHrgLMBZ8pW9NTA7P7U+uz8Po+iHr2mdmzNUFkg29hUG6hy5x8iGF3pRNmkCOwKEJhWSFfH1oGdmxq3tyHKffGnTA2ZPefR7avhZCe3Ib6p1flNlU5Rxb9BdwNu4v7hxOJhm4Dm+4m9Y55fJgX5Z3T63OEm7HMjP4QaU32BclXDlOtI/iuNM53oX22eA9UaezWwLufSGBj4PbgWxtb9yjw6XJyauNR7ns1+yN/UeFA+CDO05pAnjkwj9MKN+fRMApWJmfOvKuj0Fa92jN0Z7MPFyxg8A5d4W13Fb2FJOEodLoSX+RsDXM4apHB7gn+13u2U142wsHcqhXbOelSu5bfgd9AFDIZSGNdj/qAxYyiCCBx6kvJZzDXf0yyyncL1v3YTmKxHulHDdPwB7fpZ7QohWq1k1ATAr8wgO/CBFl/OkNJDWCRFJsh3S/TDtoGfTxBAGL/wkbEpKqDBO8YcEX6DJgGEMhVJh2c/Oee1RppKL/N6RHQYEx/4X+u0fYAEkAN0c0gwUhk5U9Nv5X0R9LDjnimBMAESaUcSGVNtb5IIziJM3yYujpM7Bu2q4fxmle1m0/zut+3u8HQAhGUAwnSIpmWI4XREnmf09V0w3Tsh3X84MwipM0y4uyqpu264dxmpd124/zuoF53u8HQAhGUAwnSIpmWI4XRElWVE03TMt2XM8PwihO0iwvSv5zsG7arh/GaV7WbT/O637e74dgBMXw7+9PkBTNsBwviNLA0jOkarphWrbjen4QRnGSZjlfVWVVN23XD+M0L+u2H+d1P68akWSFilJVPTV16mugoUYaawIgwoQyLqTSxjr/q4r+33MUJ2mWF2VVN23XD+M0L+u2H+d1P+/3AyAEIyiGEyRFMyzHC6IkK6qmG6ZlO67nB2EUJ2mWF2VVN23XD+M0L+u2H+d1P+/3AyAEIyiGEyRFMyzHC6IkK6qmG6ZlO67nB2EUJ2mWF2VVN23XD+M0L+u2H+d1P+/3QzCCYvj39yfYkRTNsBwviJKsqJpumJbtuJ4fhFGcpFlelFXdtF0/jNO8rNt+nNf9yOss2+HidHXPzZ37HnjokceeAIgwoYwLqbSxzgdhFCdplhdlVTdt1w/jNC/rth/ndT/v9wMgBCMohhMkRTMsxwuiJCuqphumZTuu5wdhFCdplhdlVTdt1w/jNC/rth/ndT/v9wMgBCMohhMkRTMsxwuiJCuqphumZTuu5wehQFGcpFlelFXdtF0/jNO8rNt+nNf9vN8PwQiK4d/fnyApmmE5XhAlWVE13TAt23E9PwijOEmzvCirumm7fhineVm3/Tiv+3nvaRCekYCMURCVVv70fv6HgN/P/xBIfRgwoYwLqbSxXjcEiDChjAuptLFeNwKIMKGMC6m0sV43BogwoYwLqbSxXjcBiDChjAuptLFeNwWIMKGMC6m0sV43A4gwoYwLqbSxXjcHiDChjAuptLFetwCIMKGMC6m0sV63BIgwoYwLqbSxXrcCiDChjAuptLFetwaIMKGMC6m0sV63AYgwoYwLqbSxXrcFiDChjAuptLFetwcQYUIZF1JpY71uBxBhQhkXUmljvXOXACDChDIupNLGet0QIMKEMi6k0sZ63QggwoQyLqTSxnrd2/QTHgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAcDDl+/P/NEHHwA="

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(106);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/postcss-loader/lib/index.js!../node_modules/sass-loader/lib/loader.js!./grid.scss", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/postcss-loader/lib/index.js!../node_modules/sass-loader/lib/loader.js!./grid.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".row:after {\n  display: block;\n  clear: both;\n  content: ''; }\n\n.row + .row {\n  margin-top: 0; }\n\n[class^=\"col-\"] {\n  float: left;\n  margin-right: 0;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box; }\n  [class^=\"col-\"]:last-child {\n    margin-right: 0%; }\n\n/*\r\n.col-1  { width:5.583333333333333%; }\r\n.col-2  { width:14.16666666666667%; }\r\n.col-3  { width:22.75%; }\r\n.col-4  { width:31.33333333333333%; }\r\n.col-5  { width:39.91666666666667%; }\r\n.col-6  { width:48.5%; }\r\n.col-7  { width:57.08333333333333%; }\r\n.col-8  { width:65.66666666666666%; }\r\n.col-9  { width:74.25%; }\r\n.col-10 { width:82.83333333333333%; }\r\n.col-11 { width:91.41666666666666%; }\r\n.col-12 { width:100%; }\r\n*/\n.col-1 {\n  width: 8.33333%; }\n\n.col-2 {\n  width: 16.66667%; }\n\n.col-3 {\n  width: 25%; }\n\n.col-4 {\n  width: 33.33333%; }\n\n.col-5 {\n  width: 41.66667%; }\n\n.col-6 {\n  width: 50%; }\n\n.col-7 {\n  width: 58.33333%; }\n\n.col-8 {\n  width: 66.66667%; }\n\n.col-9 {\n  width: 75%; }\n\n.col-10 {\n  width: 83.33333%; }\n\n.col-11 {\n  width: 91.66667%; }\n\n.col-12 {\n  width: 100%; }\n", ""]);

// exports


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(108);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js!../../../node_modules/sass-loader/lib/loader.js!./animations.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js!../../../node_modules/sass-loader/lib/loader.js!./animations.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, ".t--slide-right {\n  -webkit-transition: opacity 0.25s, -webkit-transform 0.5s;\n  transition: opacity 0.25s, -webkit-transform 0.5s;\n  transition: transform 0.5s, opacity 0.25s;\n  transition: transform 0.5s, opacity 0.25s, -webkit-transform 0.5s; }\n  .t--slide-right.before {\n    -webkit-transform: translate3d(-100vw, 0, 0);\n            transform: translate3d(-100vw, 0, 0);\n    opacity: 0;\n    -webkit-transition: opacity 0.25s 0.25s, -webkit-transform 0.5s;\n    transition: opacity 0.25s 0.25s, -webkit-transform 0.5s;\n    transition: transform 0.5s, opacity 0.25s 0.25s;\n    transition: transform 0.5s, opacity 0.25s 0.25s, -webkit-transform 0.5s; }\n  .t--slide-right.after {\n    -webkit-transform: translate3d(100vw, 0, 0);\n            transform: translate3d(100vw, 0, 0);\n    opacity: 0;\n    -webkit-transition: opacity 0.25s 0.25s, -webkit-transform 0.5s;\n    transition: opacity 0.25s 0.25s, -webkit-transform 0.5s;\n    transition: transform 0.5s, opacity 0.25s 0.25s;\n    transition: transform 0.5s, opacity 0.25s 0.25s, -webkit-transform 0.5s; }\n\n.t--slide-down {\n  -webkit-transition: opacity 0.25s 0.1s, -webkit-transform 0.5s 0.1s;\n  transition: opacity 0.25s 0.1s, -webkit-transform 0.5s 0.1s;\n  transition: transform 0.5s 0.1s, opacity 0.25s 0.1s;\n  transition: transform 0.5s 0.1s, opacity 0.25s 0.1s, -webkit-transform 0.5s 0.1s; }\n  .t--slide-down.before {\n    -webkit-transform: translate3d(0, -100px, 0);\n            transform: translate3d(0, -100px, 0);\n    opacity: 0;\n    -webkit-transition: opacity 0.25s 0.25s, -webkit-transform 0.5s;\n    transition: opacity 0.25s 0.25s, -webkit-transform 0.5s;\n    transition: transform 0.5s, opacity 0.25s 0.25s;\n    transition: transform 0.5s, opacity 0.25s 0.25s, -webkit-transform 0.5s; }\n  .t--slide-down.after {\n    -webkit-transform: translate3d(0, 100px, 0);\n            transform: translate3d(0, 100px, 0);\n    opacity: 0;\n    -webkit-transition: opacity 0.25s 0.25s, -webkit-transform 0.5s;\n    transition: opacity 0.25s 0.25s, -webkit-transform 0.5s;\n    transition: transform 0.5s, opacity 0.25s 0.25s;\n    transition: transform 0.5s, opacity 0.25s 0.25s, -webkit-transform 0.5s; }\n\n.t--slide-down-bounce {\n  -webkit-transition: opacity 0.25s 0.1s, -webkit-transform 0.5s 0.1s cubic-bezier(0.63, 0.44, 0.37, 1.72);\n  transition: opacity 0.25s 0.1s, -webkit-transform 0.5s 0.1s cubic-bezier(0.63, 0.44, 0.37, 1.72);\n  transition: transform 0.5s 0.1s cubic-bezier(0.63, 0.44, 0.37, 1.72), opacity 0.25s 0.1s;\n  transition: transform 0.5s 0.1s cubic-bezier(0.63, 0.44, 0.37, 1.72), opacity 0.25s 0.1s, -webkit-transform 0.5s 0.1s cubic-bezier(0.63, 0.44, 0.37, 1.72); }\n  .t--slide-down-bounce.before {\n    -webkit-transform: translate3d(0, -100px, 0);\n            transform: translate3d(0, -100px, 0);\n    opacity: 0;\n    -webkit-transition: opacity 0.25s 0.25s, -webkit-transform 0.5s cubic-bezier(0.63, 0.44, 0.37, 1.72);\n    transition: opacity 0.25s 0.25s, -webkit-transform 0.5s cubic-bezier(0.63, 0.44, 0.37, 1.72);\n    transition: transform 0.5s cubic-bezier(0.63, 0.44, 0.37, 1.72), opacity 0.25s 0.25s;\n    transition: transform 0.5s cubic-bezier(0.63, 0.44, 0.37, 1.72), opacity 0.25s 0.25s, -webkit-transform 0.5s cubic-bezier(0.63, 0.44, 0.37, 1.72); }\n  .t--slide-down-bounce.after {\n    -webkit-transform: translate3d(0, 100px, 0);\n            transform: translate3d(0, 100px, 0);\n    opacity: 0;\n    -webkit-transition: opacity 0.25s 0.25s, -webkit-transform 0.5s cubic-bezier(0.63, 0.44, 0.37, 1.72);\n    transition: opacity 0.25s 0.25s, -webkit-transform 0.5s cubic-bezier(0.63, 0.44, 0.37, 1.72);\n    transition: transform 0.5s cubic-bezier(0.63, 0.44, 0.37, 1.72), opacity 0.25s 0.25s;\n    transition: transform 0.5s cubic-bezier(0.63, 0.44, 0.37, 1.72), opacity 0.25s 0.25s, -webkit-transform 0.5s cubic-bezier(0.63, 0.44, 0.37, 1.72); }\n\n.t--slide-right-bounce {\n  -webkit-transition: opacity 0.25s 0.1s, -webkit-transform 0.5s 0.1s cubic-bezier(0.63, 0.44, 0.37, 1.72);\n  transition: opacity 0.25s 0.1s, -webkit-transform 0.5s 0.1s cubic-bezier(0.63, 0.44, 0.37, 1.72);\n  transition: transform 0.5s 0.1s cubic-bezier(0.63, 0.44, 0.37, 1.72), opacity 0.25s 0.1s;\n  transition: transform 0.5s 0.1s cubic-bezier(0.63, 0.44, 0.37, 1.72), opacity 0.25s 0.1s, -webkit-transform 0.5s 0.1s cubic-bezier(0.63, 0.44, 0.37, 1.72); }\n  .t--slide-right-bounce.before {\n    -webkit-transform: translate3d(-100px, 0, 0);\n            transform: translate3d(-100px, 0, 0);\n    opacity: 0;\n    -webkit-transition: opacity 0.25s 0.25s, -webkit-transform 0.5s cubic-bezier(0.63, 0.44, 0.37, 1.72);\n    transition: opacity 0.25s 0.25s, -webkit-transform 0.5s cubic-bezier(0.63, 0.44, 0.37, 1.72);\n    transition: transform 0.5s cubic-bezier(0.63, 0.44, 0.37, 1.72), opacity 0.25s 0.25s;\n    transition: transform 0.5s cubic-bezier(0.63, 0.44, 0.37, 1.72), opacity 0.25s 0.25s, -webkit-transform 0.5s cubic-bezier(0.63, 0.44, 0.37, 1.72); }\n  .t--slide-right-bounce.after {\n    -webkit-transform: translate3d(100px, 0, 0);\n            transform: translate3d(100px, 0, 0);\n    opacity: 0;\n    -webkit-transition: opacity 0.25s 0.25s, -webkit-transform 0.5s cubic-bezier(0.63, 0.44, 0.37, 1.72);\n    transition: opacity 0.25s 0.25s, -webkit-transform 0.5s cubic-bezier(0.63, 0.44, 0.37, 1.72);\n    transition: transform 0.5s cubic-bezier(0.63, 0.44, 0.37, 1.72), opacity 0.25s 0.25s;\n    transition: transform 0.5s cubic-bezier(0.63, 0.44, 0.37, 1.72), opacity 0.25s 0.25s, -webkit-transform 0.5s cubic-bezier(0.63, 0.44, 0.37, 1.72); }\n", ""]);

// exports


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(110);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js!../../../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js!../../../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, "body {\n  margin: 0; }\n\n* {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none; }\n\n.component--Main {\n  height: 100vh;\n  width: 100vw;\n  background-color: white; }\n  .component--Main .sideBySide {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: horizontal;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: row;\n            flex-direction: row; }\n    .component--Main .sideBySide > * {\n      -webkit-box-flex: 1;\n          -ms-flex: 1 0 auto;\n              flex: 1 0 auto; }\n  .component--Main .element-description {\n    font-family: \"Segoe UI\", monospace;\n    line-height: 24px;\n    color: white; }\n  .component--Main .defaultLib {\n    position: relative;\n    width: 100%;\n    height: 40px;\n    background-color: rgba(255, 255, 255, 0.6); }\n    .component--Main .defaultLib > .nav {\n      position: absolute;\n      top: 0;\n      height: 40px;\n      width: 20px;\n      text-align: center;\n      line-height: 40px;\n      background-color: cadetblue; }\n      .component--Main .defaultLib > .nav.prev {\n        left: 0; }\n      .component--Main .defaultLib > .nav.next {\n        right: 0; }\n    .component--Main .defaultLib > .items {\n      position: absolute;\n      left: 20px;\n      width: calc(100% - 40px);\n      height: calc(100% - 10px);\n      padding: 5px;\n      display: -webkit-box;\n      display: -ms-flexbox;\n      display: flex;\n      overflow: hidden; }\n      .component--Main .defaultLib > .items > .item {\n        display: inline-block;\n        position: relative; }\n        .component--Main .defaultLib > .items > .item > * {\n          height: 100%; }\n        .component--Main .defaultLib > .items > .item:not(:first-child) {\n          margin-left: 5px; }\n        .component--Main .defaultLib > .items > .item img {\n          height: 100%; }\n  .component--Main .ProductPreview-wrapper {\n    padding: 40px;\n    height: 10vw;\n    background-color: #cce2e3; }\n  .component--Main .drag-item {\n    overflow: hidden; }\n    .component--Main .drag-item.dragging.within-area img {\n      display: block;\n      height: 100%;\n      width: 100%;\n      -o-object-fit: cover;\n         object-fit: cover; }\n\nimg.pixelated, .pixelated img {\n  -ms-interpolation-mode: nearest-neighbor;\n      image-rendering: -webkit-optimize-contrast;\n      image-rendering: -moz-crisp-edges;\n      image-rendering: -o-pixelated;\n      image-rendering: pixelated; }\n", ""]);

// exports


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __webpack_require__(5);
var object_1 = __webpack_require__(1);
var layouts0 = {
    id: "0",
    position: {
        top: 0,
        left: 0,
        width: 300,
        height: 40,
    },
    holders: [{
            id: 0,
            position: {
                top: 5,
                left: 5,
                width: 90,
                height: 30,
            },
            content: {
                value: "text",
                fontFamily: "sans-serif",
                fontSize: "22",
                align: "center",
                type: index_1.TEXT,
            },
            type: [index_1.TEXT, index_1.SHAPE, index_1.IMAGE],
            fixed: true,
        }, {
            id: 1,
            position: {
                top: 5,
                left: 105,
                width: 90,
                height: 30,
            },
            content: {
                value: "text",
                fontFamily: "sans-serif",
                fontSize: "22",
                align: "center",
                type: index_1.TEXT,
            },
            type: [index_1.TEXT, index_1.SHAPE, index_1.IMAGE],
            fixed: true,
        }, {
            id: 2,
            position: {
                top: 5,
                left: 205,
                width: 90,
                height: 30,
            },
            content: {
                value: "text",
                fontFamily: "sans-serif",
                fontSize: "22",
                align: "center",
                type: index_1.TEXT,
            },
            type: [index_1.TEXT, index_1.SHAPE, index_1.IMAGE],
            fixed: true,
        }],
    fixed: true,
    selected: true,
};
var layouts1 = {
    id: "1",
    position: {
        top: 0,
        left: 0,
        width: 300,
        height: 40,
    },
    holders: [{
            id: 3,
            position: {
                top: 5,
                left: 5,
                width: 140,
                height: 30,
            },
            content: {
                value: "text",
                type: index_1.TEXT,
                fontFamily: "sans-serif",
                fontSize: "22",
                align: "center",
            },
            type: [index_1.TEXT],
            fixed: true,
        }, {
            id: 4,
            position: {
                top: 5,
                left: 150,
                width: 145,
                height: 30,
            },
            content: {
                type: index_1.IMAGE,
            },
            type: [index_1.IMAGE],
            fixed: true,
        }],
    fixed: true,
};
var layouts2 = {
    id: "2",
    position: {
        top: 0,
        left: 0,
        width: 300,
        height: 40,
    },
    holders: [{
            id: 5,
            position: {
                top: 5,
                left: 5,
                width: 30,
                height: 30,
            },
            content: {
                type: index_1.IMAGE,
            },
            type: [index_1.IMAGE, index_1.SHAPE],
            fixed: true,
        }, {
            id: 6,
            position: {
                top: 5,
                left: 40,
                width: 220,
                height: 30,
            },
            content: {
                type: index_1.IMAGE,
            },
            type: [index_1.IMAGE, index_1.SHAPE],
            fixed: true,
        }, {
            id: 7,
            position: {
                top: 5,
                left: 265,
                width: 30,
                height: 30,
            },
            content: {
                type: index_1.IMAGE,
            },
            type: [index_1.IMAGE, index_1.SHAPE],
            fixed: true,
        }],
    fixed: true,
};
var layouts3 = {
    id: "3",
    position: {
        top: 0,
        left: 0,
        width: 300,
        height: 40,
    },
    holders: [],
    fixed: false,
};
var layouts = [layouts0, layouts1, layouts2, layouts3];
var productParts = [{
        id: "default",
        layout: object_1.clone(layouts0),
        layouts: layouts,
        options: {
            fontFamily: [
                "sans-serif",
                "serif",
                "cursive",
                "fantasy",
                "monospace",
                "Schoolbell",
                "Bungee",
                "Open Sans Condensed",
                "Indie Flower",
                "Lobster",
                "Shadows Into Light",
                "Amatic SC",
            ],
            fontSize: [
                "6",
                "8",
                "10",
                "12",
                "16",
                "18",
                "22",
                "32",
                "42",
                "52",
            ],
            align: [
                "left",
                "center",
                "right",
            ],
            backgroundColor: [
                "transparent",
                "white",
                "black",
                "red",
                "blue",
                "green",
                "orange",
            ],
            color: [
                "black",
                "white",
                "red",
                "blue",
                "green",
                "orange",
            ],
            fontStyle: [
                "normal",
                "italic",
            ],
            textDecoration: [
                "none",
                "overline",
                "line-through",
                "underline",
            ],
            fontWeight: [
                "normal",
                "light",
                "bold",
            ],
            textFilter: [
                { title: "none", style: {} },
                { title: "light blur", style: { filter: "blur(2.5px)" } },
                { title: "medium blur", style: { filter: "blur(5px)" } },
                { title: "high blur", style: { filter: "blur(10px)" } },
                { title: "extreme blur", style: { filter: "blur(20px)" } },
            ],
            imageFilter: [
                { title: "none", style: {} },
                { title: "grayscale", style: { filter: "grayscale(1)" } },
                { title: "darken", style: { filter: "brightness(.5)" } },
                { title: "lighten", style: { filter: "brightness(2)" } },
                { title: "low contrast", style: { filter: "contrast(.5)" } },
                { title: "high contrast", style: { filter: "contrast(2)" } },
                {
                    title: "light blur",
                    style: {
                        filter: "blur(2.5px)", transform: "scale(1.1)",
                    },
                },
                {
                    title: "medium blur",
                    style: {
                        filter: "blur(10px)", transform: "scale(1.5)",
                    },
                },
                {
                    title: "high blur",
                    style: {
                        filter: "blur(20px)", transform: "scale(3)",
                    },
                },
                {
                    title: "extreme blur",
                    style: {
                        filter: "blur(80px)", transform: "scale(12)",
                    },
                },
            ],
            shapeFilter: [
                { title: "none", style: {} },
                { title: "light blur", style: { filter: "blur(2.5px)" } },
                { title: "medium blur", style: { filter: "blur(5px)" } },
                { title: "high blur", style: { filter: "blur(10px)" } },
                { title: "extreme blur", style: { filter: "blur(20px)" } },
            ],
        },
    }];
var product = {
    id: "0",
    productParts: productParts,
    defaults: {
        fontFamily: "sans-serif",
        fontSize: "22",
        align: "center",
    },
};
exports.default = product;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map