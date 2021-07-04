var vertexShaderText = 
[
'precision mediump float;',
'attribute vec2 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'',
'void main()',
'{',
'	fragColor = vertColor;',
'	gl_Position = vec4(vertPosition, 0.0, 1.0);',
'}',
].join('\n');

var fragmentShaderText = 
[
	'precision mediump float;',
	'',
'varying vec3 fragColor;',
'void main()',
'{',
'	gl_FragColor = vec4(fragColor, 1.0);',
'}',
].join('\n');

var InitDemo = function() {
	console.log("this is running");

	var canvas = document.getElementById('game-surface');

	gl = canvas.getContext('webgl');
	if (!gl) gl = canvas.getContext('experimental-webgl');

	if (!gl) alert('your browser does not support webgl');

	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader)); 

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS))
		console.error('ERROR linking program!', gl.getProgramInfo(program));
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
		console.error('ERROR validating program!', gl.getProgramInfo(program));

	var triangleVertices = [ // x y r g b
		0.0, 0.5, 	1.0, 1.0, 0.0,
		-0.5, -0.5, 	0.7, 0.0, 1.0,
		0.5, -0.5,	0.1, 1.0, 0.6
	];
	var triangleVertexBufferObject = gl.createBuffer();
	// bindBufer: create buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
	// new Float32: converts from Javascript 64-bit data type to 32-bit that GL expects
	// export data
	// static draw = unchanging data
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

	gl.vertexAttribPointer(
		positionAttribLocation, // attrib location
		2, // number of elements per attribute
		gl.FLOAT, // type of element
		gl.FALSE, // 
		5 * Float32Array.BYTES_PER_ELEMENT, // size of a vertex
		0 // no offset
	);
	gl.enableVertexAttribArray(positionAttribLocation);

	gl.vertexAttribPointer(
		colorAttribLocation, // attrib location
		3, // number of elements per attribute
		gl.FLOAT, // type of element
		gl.FALSE, // 
		5 * Float32Array.BYTES_PER_ELEMENT, // size of a vertex
		2 * Float32Array.BYTES_PER_ELEMENT // offset by 3
	);
	gl.enableVertexAttribArray(colorAttribLocation);

	// don't need to call continuously since we're drawing in one step
	gl.useProgram(program);
	// use the bound buffer that we recently pushed to GL state
	gl.drawArrays(gl.TRIANGLES, 0, 3);
}
