 

    function random(seed) {
	   var x = Math.sin(seed++) * 10000;
	   return x - Math.floor(x);
	}

	function Vector3(x, y, z) {
	  this.x = 0;
	  this.y = 0;
	  this.z = 0;
	  this.set(x, y, z);
	}
	Vector3.prototype = {
	  set : function(x, y, z) {
		 if (x !== undefined) this.x = x;
		 if (y !== undefined) this.y = y;
		 if (z !== undefined) this.z = z;
	  },
	}
    
    function perspectiveTransform(pt, f) {
      //pt.z =4
     
      var newpt = new Vector3(f * pt.x / pt.z, f * pt.y / pt.z, f / pt.z);
      return newpt;
    }

    function viewPointTransform(pt, canvas) {
      var newpt = new Vector3(canvas.width/2 + pt.x*canvas.width/2, canvas.height/2 + pt.y*canvas.height/2, pt.z);
      return newpt;
    }

	var startTime = (new Date()).getTime() / 1000, time = startTime;
	var canvases = [];
	function initCanvas(id) {
	   var canvas = document.getElementById(id);
	   canvas.setCursor = function(x, y, z) {
		  var r = this.getBoundingClientRect();
	      this.cursor.set(x - r.left, y - r.top, z);
	   }
	   canvas.cursor = new Vector3(0, 0, 0);
	   canvas.onmousedown = function(e) { this.setCursor(e.clientX, e.clientY, 1); }
	   canvas.onmousemove = function(e) { this.setCursor(e.clientX, e.clientY   ); }
	   canvas.onmouseup   = function(e) { this.setCursor(e.clientX, e.clientY, 0); }
	   canvases.push(canvas);
	   return canvas;
	}

	function tick() {
	   time = (new Date()).getTime() / 1000 - startTime;
	   for (var i = 0 ; i < canvases.length ; i++)
		  if (canvases[i].update !== undefined) {
		 var canvas = canvases[i];
		    var g = canvas.getContext('2d');
		    g.clearRect(0, 0, canvas.width, canvas.height);
		    canvas.update(g);
		  }
	   setTimeout(tick, 1000 / 60);
	}
	tick();

	function Matrix () {
        this.M = [[1,0,0,0],
                  [0,1,0,0],
                  [0,0,1,0],
                  [0,0,0,1]]; 
	}
	Matrix.prototype = {
	  multiplyMatrices : function(m1, m2) {
			var result = [];
			for (var i = 0; i < m1.length; i++) {
				result[i] = [];
				for (var j = 0; j < m2[0].length; j++) {
				    var sum = 0;
				    for (var k = 0; k < m1[0].length; k++) {
				        sum += m1[i][k] * m2[k][j];
				    }
				    result[i][j] = sum;
				}
			}
			return result;
      },
	  translate : function(x, y, z) {
         T = [[1,0,0,x],
		      [0,1,0,y],
		      [0,0,1,z],
		      [0,0,0,1]];
         this.M = this.multiplyMatrices(this.M,T);
         return;
	  },
	  rotateX : function(theta) { 
         R = [[1,0,0,0],
		      [0,Math.cos(theta),-Math.sin(theta),0],
		      [0,Math.sin(theta),Math.cos(theta),0],
		      [0,0,0,1]];
         this.M = this.multiplyMatrices(this.M,R);
         return;
	  },
	  rotateY : function(theta) {
         R = [[Math.cos(theta),0,Math.sin(theta),0],
		      [0,1,0,0],
		      [-Math.sin(theta),0,Math.cos(theta),0],
		      [0,0,0,1]];
         this.M = this.multiplyMatrices(this.M,R);
         return;
	  },
	  rotateZ : function(theta) {
         R = [[Math.cos(theta),-Math.sin(theta),0,0],
		      [Math.sin(theta),Math.cos(theta),0,0],
		      [0,0,1,0],
		      [0,0,0,1]];
         this.M = this.multiplyMatrices(this.M,R);
         return;
	  },
	  scale : function(x, y, z) {
         S = [[1*x,0,0,0],
		      [0,1*y,0,0],
		      [0,0,1*z,0],
		      [0,0,0,1]];
         this.M = this.multiplyMatrices(this.M,S);
         return;
	  },
      perspective : function(x, y, z) {
         S = [[1,0,0,0],
		      [0,1,0,0],
		      [0,0,1,0],
		      [x,y,z,1]];
         this.M = this.multiplyMatrices(this.M,S);
         return;
	  },
      cameraFly : function(Cinv) {
          this.M = this.multiplyMatrices(Cinv,this.M); //adjust for camera view
      },
	  transform : function(src) {
         srclst = [[src.x],[src.y],[src.z],[1]];
	     dstlst = this.multiplyMatrices(this.M,srclst);
         dst = new Vector3(dstlst[0],dstlst[1],dstlst[2]);
		 return dst;
	  },
	  identity : function() {
		 this.M = [[1,0,0,0],
		           [0,1,0,0],
		           [0,0,1,0],
		           [0,0,0,1]];      
		 return;
	  },
	  draw : function(g) {
		       
		   g.beginPath();
		   g.moveTo(this.v[this.e[0]].x, this.v[this.e[0]].y);
		   for (i = 1; i < this.e.length; i++) { 
		       g.lineTo(this.v[this.e[i]].x, this.v[this.e[i]].y);
		   }
		   g.fill();
		   g.closePath();
	  },
	}
