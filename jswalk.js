module.exports = class JsWalk{
	
	constructor(){
		this.stack = []
	}

	onNode(node){

	}

	walk(node) {
		if(this.onNode(node, this.stack)) return true
		this.stack.push(node)
		var ret = this[node.type](node)
		this.stack.pop()
		return ret
	}

	Program(node) {
		var body = node.body
		for(var i = 0;i < body.length;i++){
			var statement = body[i]
			if(this.walk(statement)) return true
		}
	}
		
	BlockStatement(node) {
		var body = node.body
		var bodylen = body.length - 1
		for(var i = 0; i <= bodylen; i++){
			var statement = body[i]
			if(this.walk(statement)) return true
		}
	}

	ArrayExpression(node) {
		var elems = node.elements
		var elemslen = elems.length - 1
		for(var i = 0; i <= elemslen; i++){
			var elem = elems[i]
			if(elem) {
				if(this.walk(elem)) return true
			}
		}
	}

	ObjectExpression(node) {
		var props = node.properties
		var propslen = props.length - 1

		for(var i = 0; i <= propslen; i++){
			
			var prop = props[i]
			var key = prop.key
			
			if(key.type === 'Identifier') {
			}
			else if(this.walk(key)) return true
			
			if(!prop.shorthand) {
				var value = prop.value
				if(this.walk(value)) return true
			}
		}
	}

	ClassBody(node) {
		var body = node.body
		var bodylen = body.length - 1
		for(var i = 0;i <= bodylen;i++){
			var method = body[i]
			if(this.walk(method)) return true
		}
	}

	EmptyStatement(node) {
	}
	
	ExpressionStatement(node) {
		return this.walk(node.expression)
	}

	SequenceExpression(node) {
		var exps = node.expressions
		var expslength = exps.length - 1
		for(var i = 0;i <= expslength;i++){
			var exp = exps[i]
			if(exp) if(this.walk(exp)) return true
		}
	}

	ParenthesizedExpression(node) {
		var exp = node.expression
		return this.walk(exp)
	}

	//Literal:{raw:0, value:0},
	Literal(node) {
	}
	
	//Identifier:{name:0},
	Identifier(node) {
	}
	
	//ThisExpression:{},
	ThisExpression(node) {
	}
	
	//MemberExpression:{object:1, property:1, computed:0},
	MemberExpression(node) {
		var obj = node.object
		if(this.walk(obj)) return true
		var prop = node.property
		if(this.walk(prop)) return true
	}
	
	//CallExpression:{callee:1, arguments:2},
	CallExpression(node) {
		var callee = node.callee				
		if(this.walk(callee)) return true
		var args = node.arguments
		var argslen = args.length - 1
		for(var i = 0;i <= argslen;i++){
			var arg = args[i]
			if(this.walk(arg)) return true
		}
	}
	
	//NewExpression:{callee:1, arguments:2},
	NewExpression(node) {
		var callee = node.callee				
		if(this.walk(callee)) return true
		var args = node.arguments
		var argslen = args.length - 1
		for(var i = 0;i <= argslen;i++){
			var arg = args[i]
			if(this.walk(arg)) return true
		}
	}
	
	//ReturnStatement:{argument:1},
	ReturnStatement(node) {
		var arg = node.argument
		if(arg) {
			if(this.walk(arg)) return true
		}
	}
	
	//FunctionExpression:{id:1, params:2, generator:0, expression:0, body:1},
	FunctionExpression(node) {
		return this.FunctionDeclaration(node)
	}
	
	//FunctionDeclaration: {id:1, params:2, expression:0, body:1},
	FunctionDeclaration(node) {
		var id = node.id
		if(id) {
			if(this.walk(id)) return true
		}
		
		var params = node.params
		var paramslen = params.length - 1
		for(var i = 0;i <= paramslen;i++){
			var param = params[i]
			if(this.walk(param)) return true
		}

		var body = node.body
		return this.walk(body)
	}
	
	//VariableDeclaration:{declarations:2, kind:0},
	VariableDeclaration(node) {
		var decls = node.declarations
		var declslen = decls.length - 1
		for(var i = 0;i <= declslen;i++){
			var decl = decls[i]
			if(this.walk(decl)) return true
		}
	}
	
	//VariableDeclarator:{id:1, init:1},
	VariableDeclarator(node) {
		var id = node.id
		if(this.walk(id)) return true
		var init = node.init
		if(init) {
			if(this.walk(init)) return true
		}
	}
	
	//LogicalExpression:{left:1, right:1, operator:0},
	LogicalExpression(node) {
		var left = node.left
		var right = node.right
		return this.walk(left) || this.walk(right)
	}
	
	//BinaryExpression:{left:1, right:1, operator:0},
	BinaryExpression(node) {
		var left = node.left
		var right = node.right
		return this.walk(left) || this.walk(right)
	}
	
	//AssignmentExpression: {left:1, operator:0, right:1},
	AssignmentExpression(node) {
		var left = node.left
		var right = node.right
		return this.walk(left) || this.walk(right)
	}
	
	//ConditionalExpression:{test:1, consequent:1, alternate:1},
	ConditionalExpression(node) {
		var test = node.test
		var consequent = node.consequent
		var alternate = node.alternate
		return  this.walk(test) || this.walk(consequent) || this.walk(alternate)
	}
	
	//UnaryExpression:{operator:0, prefix:0, argument:1},
	UnaryExpression(node) {
		var arg = node.argument
		return this.walk(arg)
	}
	
	//UpdateExpression:{operator:0, prefix:0, argument:1},
	UpdateExpression(node) {
		var arg = node.argument
		return this.walk(arg)
	}
	
	//IfStatement:{test:1, consequent:1, alternate:1},
	IfStatement(node) {
		var test = node.test
		var consequent = node.consequent
		var alternate = node.alternate
		return  this.walk(test) || this.walk(consequent)|| alternate && this.walk(alternate)
	}
	
	//ForStatement:{init:1, test:1, update:1, body:1},
	ForStatement(node) {
		var init = node.init
		var test = node.test
		var update = node.update
		var body = node.body

		return init && this.walk(init) || 
			test && this.walk(test) || 
			update && this.walk(update) || 
			this.walk(body)
	}
	
	//ForInStatement:{left:1, right:1, body:1},
	ForInStatement(node) {
		var left = node.left
		var right = node.right
		var body = node.body
		return this.walk(left) || this.walk(right) || this.walk(body)
	}
	
	//ForOfStatement:{left:1, right:1, body:1},
	ForOfStatement(node) {
		var left = node.left
		var right = node.right
		var body = node.body
		return this.walk(left) || this.walk(right) || this.walk(body)
	}
	
	//WhileStatement:{body:1, test:1},
	WhileStatement(node) {
		var test = node.test
		var body = node.body
		return this.walk(test) || this.walk(body)
	}
	
	//DoWhileStatement:{body:1, test:1},
	DoWhileStatement(node) {
		var body = node.body
		var test = node.test
		return this.walk(body) || this.walk(test)
	}
	
	//BreakStatement:{label:1},
	BreakStatement(node) {
		if(node.label) {
			var label = node.label
			return this.walk(label)
		}
	}
	
	//ContinueStatement:{label:1},
	ContinueStatement(node) {
		if(node.label) {
			var label = node.label
			return this.walk(label)
		}
	}
	
	//YieldExpression:{argument:1, delegate:0}
	YieldExpression(node) {
		var arg = node.argument
		if(arg) {
			return this.walk(arg)
		}
	}
	
	//ThrowStatement:{argument:1},
	ThrowStatement(node) {
		var arg = node.argument
		if(arg) {
			return this.walk(arg)
		}
	}
	
	//TryStatement:{block:1, handler:1, finalizer:1},
	TryStatement(node) {
		var block = node.block

		return this.walk(block) ||
			handler &&  this.walk(handler) || 
			finalizer && this.walk(finalizer)
	}
	
	//CatchClause:{param:1, body:1},
	CatchClause(node) {
		var param = node.param
		var body = node.body
		return this.walk(param) || this.walk(body)
	}
	
	//SpreadElement
	SpreadElement(node) {
		var arg = node.argument
		return this.walk(arg)
	}
	
	//RestElement:{argument:1}
	RestElement(node) {
		var arg = node.argument
		return this.walk(arg)
	}
	
	//Super:{},
	Super(node) {
	}
	
	//AwaitExpression:{argument:1},
	AwaitExpression(node) {
		return this.walk(node.argument)
	}
	
	//MetaProperty:{meta:1, property:1},
	MetaProperty(node) {
		return this.walk(node.meta) || 
		this.walk(node.property)
	}
	
	//ObjectPattern:{properties:3},
	ObjectPattern(node) {
		var props = node.properties
		var propslen = props.length - 1

		for(var i = 0; i <= propslen; i++){
			
			var prop = props[i]
			var key = prop.key
			
			if(key.type === 'Identifier') {
			}
			else if(this.walk(key)) return true
			
			if(!prop.shorthand) {
				var value = prop.value
				if(this.walk(value)) return true
			}
		}
	}
	
	//ObjectPattern:{properties:3},
	ArrayPattern(node) {
		var elems = node.elements
		var elemslen = elems.length - 1
		for(var i = 0; i <= elemslen; i++){
			var elem = elems[i]
			if(elem) {
				if(this.walk(elem)) return true
			}
		}
	}
	
	// AssignmentPattern
	AssignmentPattern(node) {
		var left = node.left
		var right = node.right
		return this.walk(left) || this.walk(right)
	}
	
	
	//ArrowFunctionExpression:{params:2, expression:0, body:1},
	ArrowFunctionExpression(node) {
		var params = node.params
		var paramslen = params.length - 1
		for(var i = 0;i <= paramslen;i++){
			var param = params[i]
			if(this.walk(param)) return true
		}
		var body = node.body
		return this.walk(body)
	}
	
	//SwitchStatement:{discriminant:1, cases:2},
	SwitchStatement(node) {
		var disc = node.discriminant
		if(this.walk(disc)) return true

		var cases = node.cases
		var caseslen = cases.length
		for(var i = 0;i < caseslen;i++){
			var cas = cases[i]
			if(this.walk(cas)) return true
		}
	}
	
	//SwitchCase:{test:1, consequent:2},
	SwitchCase(node) {
		var test = node.test
		if(test){
			if(this.walk(test)) return true
		}

		var cqs = node.consequent
		var cqlen = cqs.length
		for(var i = 0;i < cqlen;i++){
			var cq = cqs[i]
			if(cq && this.walk(cq)) return true
		}
	}
	
	//TaggedTemplateExpression:{tag:1, quasi:1},
	TaggedTemplateExpression(node) {
		var tag = node.tag
		var quasi = node.quasi
		return this.walk(tag) || this.walk(quasi)
	}
	
	//TemplateElement:{tail:0, value:0},
	TemplateElement(node) {
		return this.walk(node.tail) || this.walk(node.value)
	}
	
	//TemplateLiteral:{expressions:2, quasis:2},
	TemplateLiteral(node) {
		var expr = node.expressions
		var quasis = node.quasis
		var qlen = quasis.length - 1
		for(var i = 0;i <= qlen;i++){
			if(i !== qlen) {
				var exp = expr[i]
				if(this.walk(exp)) return true
			}
		}
	}
	
	//ClassDeclaration:{id:1,superClass:1},
	ClassDeclaration(node) {
		var id = node.id
		var base = node.superClass
		var body = node.body

		return id && this.walk(id) || 
			 base && this.walk(base) || 
			 this.walk(body)
	}
	
	//ClassExpression:{id:1,superClass:1},
	ClassExpression(node) {
		var id = node.id
		var base = node.superClass
		var body = node.body

		return id && this.walk(id) || 
			 base && this.walk(base) || 
			 this.walk(body)
	}
	
	//MethodDefinition:{value:1, kind:0, static:0},
	MethodDefinition(node) {
		var value = node.value
		return this.walk(value)
	}
	
	//ExportAllDeclaration:{source:1},
	ExportAllDeclaration(node) {
	}
	
	//ExportDefaultDeclaration:{declaration:1},
	ExportDefaultDeclaration(node) {
		return this.walk(node.declaration)
	}
	//ExportNamedDeclaration:{declaration:1, source:1, specifiers:2},
	ExportNamedDeclaration(node) {
		return this.walk(node.declaration) || this.walk(node.source)
	}
	//ExportSpecifier:{local:1, exported:1},
	ExportSpecifier(node) {
		return this.walk(node.exported)
	}
	//ImportDeclaration:{specifiers:2, source:1},
	ImportDeclaration(node) {
		return this.walk(node.source)
	}
	//ImportDefaultSpecifier:{local:1},
	ImportDefaultSpecifier(node) {
	//	this.walk(node.local)
	}
	//ImportNamespaceSpecifier:{local:1},
	ImportNamespaceSpecifier(node) {
	//	this.walk(node.local)
	}
	//ImportSpecifier:{imported:1, local:1},
	ImportSpecifier(node) {
		return this.walk(node.imported)
	}

	//DebuggerStatement:{},
	DebuggerStatement(node) {
	}

	//LabeledStatement:{label:1, body:1},
	LabeledStatement(node) {
		var label = node.label
		var body = node.body
		return this.walk(label) || this.walk(body)
	}

	// WithStatement:{object:1, body:1}
	WithStatement(node) {
		return this.walk(node.object) || this.walk(node.body)
	}
}