var t=globalThis,e={},i={},r=t.parcelRequire94c2;null==r&&((r=function(t){if(t in e)return e[t].exports;if(t in i){var r=i[t];delete i[t];var s={id:t,exports:{}};return e[t]=s,r.call(s.exports,s,s.exports),s.exports}var a=Error("Cannot find module '"+t+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(t,e){i[t]=e},t.parcelRequire94c2=r),(0,r.register)("27Lyk",function(t,e){Object.defineProperty(t.exports,"register",{get:()=>i,set:t=>i=t,enumerable:!0,configurable:!0});var i,r=new Map;i=function(t,e){for(var i=0;i<e.length-1;i+=2)r.set(e[i],{baseUrl:t,path:e[i+1]})}}),r("27Lyk").register(new URL("",import.meta.url).toString(),JSON.parse('["1LzKV","index.7db0f0fd.js","7DGiY","mask.9b02a95e.png"]'));var s={};s=new URL("mask.9b02a95e.png",import.meta.url).toString();const a=document.getElementById("visual");new class{constructor(t){this.position={x:.2,y:-.2,dx:2,dy:2},this.fadeValue=0,this.fadeDirection=1,this.frameIndex=0,this.lastFrameTime=0,this.framesPerRow=4,this.framesPerColumn=1,this.totalFrames=4,this.frameDuration=100,this.animate=(t=0)=>{this.updateFrame(t),this.updatePosition(),this.updateFade(),this.render(t),requestAnimationFrame(this.animate)},this.gl=t.getContext("webgl"),this.program=this.createShaderProgram(),this.texture=this.createTexture(),this.positionBuffer=this.createBuffer(),this.loadImage()}createShaderProgram(){let t=this.gl.createShader(this.gl.VERTEX_SHADER);this.gl.shaderSource(t,`
            attribute vec4 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;
            uniform vec2 u_translation;
            uniform vec2 u_frame_offset;
            uniform vec2 u_frame_size;
            void main() {
                gl_Position = vec4(a_position.xy + u_translation, 0, 1);
                vec2 frameTexCoord = a_texCoord * u_frame_size + u_frame_offset;
                v_texCoord = vec2(frameTexCoord.x, 1.0 - frameTexCoord.y);
            }
        `),this.gl.compileShader(t);let e=this.gl.createShader(this.gl.FRAGMENT_SHADER);this.gl.shaderSource(e,`
            precision mediump float;
            uniform sampler2D u_image;
            uniform float u_time;
            uniform float u_fade;
            varying vec2 v_texCoord;

            float random(float seed) {
                return fract(543.2543 * sin(dot(vec2(seed, seed), vec2(3525.46, -54.3415))));
            }

            void main() {
                float shake_power = 0.03;
                float shake_rate = 0.2;
                float shake_speed = 5.0;
                float shake_block_size = 30.5;
                float shake_color_rate = 0.01;

                float enable_shift = float(
                    random(floor(u_time * shake_speed)) < shake_rate
                );

                vec2 fixed_uv = v_texCoord;
                fixed_uv.x += (
                    random(
                        (floor(v_texCoord.y * shake_block_size) / shake_block_size) + u_time
                    ) - 0.5
                ) * shake_power * enable_shift;

                vec4 pixel_color = texture2D(u_image, fixed_uv);
                pixel_color.r = mix(
                    pixel_color.r,
                    texture2D(u_image, fixed_uv + vec2(shake_color_rate, 0.0)).r,
                    enable_shift
                );
                pixel_color.b = mix(
                    pixel_color.b,
                    texture2D(u_image, fixed_uv + vec2(-shake_color_rate, 0.0)).b,
                    enable_shift
                );
                gl_FragColor = pixel_color * u_fade;
            }
        `),this.gl.compileShader(e);let i=this.gl.createProgram();return this.gl.attachShader(i,t),this.gl.attachShader(i,e),this.gl.linkProgram(i),i}createTexture(){let t=this.gl.createTexture();return this.gl.bindTexture(this.gl.TEXTURE_2D,t),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.NEAREST),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.NEAREST),t}createBuffer(){let t=this.gl.createBuffer();return this.gl.bindBuffer(this.gl.ARRAY_BUFFER,t),this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array([-.5,-.5,0,0,.5,-.5,1,0,-.5,.5,0,1,.5,.5,1,1]),this.gl.STATIC_DRAW),t}loadImage(){var t;let e=new Image;e.src=(t=s)&&t.__esModule?t.default:t,e.onload=()=>{this.gl.bindTexture(this.gl.TEXTURE_2D,this.texture),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,e),this.animate()}}updateFrame(t){t-this.lastFrameTime>this.frameDuration&&(this.frameIndex=(this.frameIndex+1)%this.totalFrames,this.lastFrameTime=t)}updatePosition(){this.position.x+=.001*this.position.dx,this.position.y+=.001*this.position.dy,this.position.x>.5&&(this.position.x=.5,this.position.dx=-Math.abs(this.position.dx)),this.position.x<-.5&&(this.position.x=-.5,this.position.dx=Math.abs(this.position.dx)),this.position.y>.5&&(this.position.y=.5,this.position.dy=-Math.abs(this.position.dy)),this.position.y<-.5&&(this.position.y=-.5,this.position.dy=Math.abs(this.position.dy))}updateFade(){this.fadeValue+=.005*this.fadeDirection,(this.fadeValue>=1||this.fadeValue<=0)&&(this.fadeValue<=0&&(this.position.x=Math.sign(Math.random()-.5)*Math.random(),this.position.y=Math.sign(Math.random()-.5)*Math.random(),this.position.dx=2*Math.sign(Math.random()-.5),this.position.dy=2*Math.sign(Math.random()-.5)),this.fadeDirection*=-1)}render(t){this.gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height),this.gl.clearColor(0,0,0,0),this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.gl.useProgram(this.program);let e=Math.floor(this.frameIndex/this.framesPerRow),i=this.frameIndex%this.framesPerRow/this.framesPerRow,r=e/this.framesPerColumn,s=1/this.framesPerRow,a=1/this.framesPerColumn,o=this.gl.getUniformLocation(this.program,"u_frame_offset");this.gl.uniform2f(o,i,r);let h=this.gl.getUniformLocation(this.program,"u_frame_size");this.gl.uniform2f(h,s,a);let l=this.gl.getAttribLocation(this.program,"a_position"),n=this.gl.getAttribLocation(this.program,"a_texCoord");this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.positionBuffer),this.gl.enableVertexAttribArray(l),this.gl.vertexAttribPointer(l,2,this.gl.FLOAT,!1,16,0),this.gl.enableVertexAttribArray(n),this.gl.vertexAttribPointer(n,2,this.gl.FLOAT,!1,16,8);let g=this.gl.getUniformLocation(this.program,"u_time");this.gl.uniform1f(g,t/1e3);let f=this.gl.getUniformLocation(this.program,"u_fade");this.gl.uniform1f(f,this.fadeValue);let m=this.gl.getUniformLocation(this.program,"u_translation");this.gl.uniform2f(m,this.position.x,this.position.y),this.gl.drawArrays(this.gl.TRIANGLE_STRIP,0,4)}}(a);
//# sourceMappingURL=index.7db0f0fd.js.map
