function showmenu(){
   var div = document.getElementById("main-menu");  
         if (div.style.display !== "flex") 
         {  
             div.style.display = "flex";  
         }  
         else
         {  
             div.style.display = "none";  
         }
      }  
function showwidthheight() {
        var w = window.outerWidth;
        var h = window.outerHeight;
        var txt = "Window size: width=" + w + ", height=" + h;
        document.getElementById("showwidthheight").innerHTML = txt;

       if(window.innerWidth>770){document.getElementById("main-menu").style.display="flex";} 
 }    

function btn(){
    var a=document.getElementById("name").value.length;
    var b=document.getElementById("email").value.length;
    var c=document.getElementById("msg").value.length;
    var method=document.getElementsByTagName("form")[0];
    var action=document.getElementsByTagName("form")[0];
    var key1=true;
    var key2=true;
    if(a==0 || b==0 || c==0){
        alert("Fill all the empty spaces to send the message");
       /* 
        Swal.fire({
            title: "Sorry...",
            text: "Fill all the empty spaces to send the message",
            icon: "warning",
          })*/
          key1=false;
        }
    else if(c>100){
        alert("You can't type more than 100 characters...");
        /* 
        Swal.fire({
            title: "Sorry...",
            text: "You can't type more than 100 characters...",
            icon: "warning",
          })*/
          key2=false;
    }   
    if(key1==true && key2==true){
        alert("Your message was sent successfully!!!");
        /*
        Swal.fire({
            title: "Good job!", 
            text: "Your message was sent successfully!!!", 
            icon: "success",
        });*/
        action.setAttribute("action","https://formsubmit.co/monaxios10@gmail.com");
        method.setAttribute("method","POST")
        
    } 
} 

/* RAY CASTING */
class Ray {
    constructor(pos, angle) {
        this.pos = pos;
        this.dir = p5.Vector.fromAngle(angle);
    }

    lookAt(x, y) {//calculate where ray is going to land
        this.dir.x = x - this.pos.x;
        this.dir.y = y - this.pos.y;
        this.dir.normalize();//if empty removes and joins the next cell
    }

    show() {
        stroke(255);
        push();
        translate(this.pos.x, this.pos.y);
        line(0, 0, this.dir.x * 10, this.dir.y * 10);
        pop();
    }

    cast(wall) {
        //if ray connects to a wall return the point of contact
        const x1 = wall.a.x;
        const y1 = wall.a.y;
        const x2 = wall.b.x;
        const y2 = wall.b.y;

        const x3 = this.pos.x;
        const y3 = this.pos.y;
        const x4 = this.pos.x + this.dir.x;
        const y4 = this.pos.y + this.dir.y;

        //form for detecting line collision(look wikipedia)
        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (den == 0) {
            return;
        }

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
        if (t > 0 && t < 1 && u > 0) {
            const pt = createVector();
            pt.x = x1 + t * (x2 - x1);
            pt.y = y1 + t * (y2 - y1);
            return pt;
        } else {
            return;
        }
    }
}

class Boundary {
    constructor(x1, y1, x2, y2) {
        this.a = createVector(x1, y1);
        this.b = createVector(x2, y2);

    }

    show() {
        stroke(255);
        line(this.a.x, this.a.y, this.b.x, this.b.y);
    }
}
let walls = [];
let ray;
let particle;

function setup() {
    var cnv = createCanvas(windowWidth / 2, 400);
    cnv.position((windowWidth - width) / 2, (windowHeight - height) / 2 + 50)
    for (let i = 0; i < 5; i++) {
        let x1 = random(width);
        let x2 = random(width);
        let y1 = random(height);
        let y2 = random(height);

        walls[i] = new Boundary(x1, y1, x2, y2);//create 5 random walls
    }
    walls.push(new Boundary(0, 0, width, 0));// make the outside edges,walls
    walls.push(new Boundary(width, 0, width, height));
    walls.push(new Boundary(width, height, 0, height));
    walls.push(new Boundary(0, height, 0, 0));
    particle = new Particle();//create a particle object
}

function draw() {
    background(0);
    for (let x of walls) {
        x.show();
    }//show everything in walls array
    particle.show();//sohw each line
    particle.updatePos(mouseX, mouseY);
    particle.look(walls);

}
class Particle {

    constructor() {
        angleMode(degrees);
        this.pos = createVector(width / 2, height / 2);//starting pos of particle
        this.rays = [];
        for (let i = 0; i <= 360; i += 0.2) {
            this.rays.push(new Ray(this.pos, degrees(i)));
        }//rays towards all directions
    }

    updatePos(x, y) {
        this.pos.set(x, y);
    }//update pos to mouse pos(look at sketch.js)

    show() {//create a circle and rays 
        fill(255);
        ellipse(this.pos.x, this.pos.y, 20);
        for (let x of this.rays) {
            x.show();
        }
    }

    look(walls) {
        for (let i = 0; i < this.rays.length; i++) {
            const ray = this.rays[i];
            let closest = null;
            let record = Infinity;
            for (let x of walls) {
                const pt = ray.cast(x);//if there is a point returns and makes it closest
                if (pt) {
                    const d = p5.Vector.dist(this.pos, pt);
                    if (d < record) {
                        record = d;
                        closest = pt;
                    }
                }
            }
            if (closest) {
                stroke(255, 100);
                line(this.pos.x, this.pos.y, closest.x, closest.y);
            }//if there is a closest draw line to it
        }
    }
}