        // 전역 변수
        let particles = [];
        let particleCount = 50;
        let isDarkMode = false;
        let keywords = ["CREATIVE", "INTERACTION", "DREAM", "DESIGN", "FUN", "PIXEL", "STUDY", "CREATIVE", "FOUNTAIN PEN", "SELF-DISCOVERY", "SENSORY EXPERIENCE","AGENCY", "INDEPENDENCE", "TECH & EMOTION", "FORWARD-THINKING", "FASHION MODEL"];
        let fallingTexts = [];
        let sparkleParticles = [];
        let bgColor;
        let textColor;
        
        // SparkleParticle 클래스
        class SparkleParticle {
            constructor(x, y, particleColor) {
                this.x = x;
                this.y = y;
                this.vx = random(-3, 3);
                this.vy = random(-3, 3);
                this.size = random(1, 3);
                this.color = particleColor;
                this.life = 255;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life -= 3;
                this.size *= 0.98;
            }
            
            display() {
                push();
                fill(red(this.color), green(this.color), blue(this.color), this.life);
                noStroke();
                ellipse(this.x, this.y, this.size);
                pop();
            }
            
            isDead() {
                return this.life <= 10 || this.size <= 10;
            }
        }

        function setup() {
            pixelDensity(1);
            let canvas = createCanvas(windowWidth, windowHeight);
            canvas.parent('p5Canvas');
            canvas.style('display', 'block');
            
            //배경색
            bgColor = color(245);
            textColor = color('blue');
            textColor3 = color('black')
            // 파티클 초기화
            for (let i = 0; i < particleCount; i++) {
                addParticle(random(width), random(height));
            }
        }

        function draw() {
            // 배경색 설정
            background(isDarkMode ? color('red') : bgColor);
            
            
            // 메인 텍스트
            // FontFace('ArialRoundedBold.woff2')
            fill(isDarkMode ? color('white') : textColor);
            textAlign(CENTER, CENTER);
            textSize(min(width * 0.05, 60));
            text("WHAT KIND OF DESIGNER IS", width / 2, height / 4);
            text("NAYEON(NINA) KO?", width / 2, height / 4 + 60);
            
            
            // 클릭 안내 텍스트
            
            textSize(15);
            fill(isDarkMode ? color('white') : textColor3);
            text("( Click here! )", width / 2, height / 6);
            
            text("( ! )", width / 2, height / 7);

            text("Based in Singapore  ", width /10 , height /1.05 );
            
            // 떨어지는 텍스트 처리
for (let i = fallingTexts.length - 1; i >= 0; i--) {
    let ft = fallingTexts[i];

    if (!ft.stopped) {
        ft.vy += ft.gravity;
        ft.y += ft.vy;

        ft.rotation += ft.rotationVelocity;
        ft.rotationVelocity *= 0.97; // 회전 점점 느려짐

        if (ft.y >= height - 50) {
            ft.y = height - 50;
            ft.vy *= -ft.damping;

            if (abs(ft.vy) < 1) {
                ft.vy = 0;
                ft.stopped = true;
                ft.stopTime = millis();
                ft.rotationVelocity = 0; // 바닥 닿으면 회전 멈춤
            }
        }
    } else {
        if (millis() - ft.stopTime > 2500) {
            fallingTexts.splice(i, 1);
            continue;
        }
    }3

// 박스 버튼 그리기
push();
translate(ft.x, ft.y);           // 기준점을 해당 위치로 이동
rotate(ft.rotation);             // 회전 적용
rectMode(CENTER);
textAlign(CENTER, CENTER);
textSize(ft.size);

let w = textWidth(ft.txt) + 20;
let h = ft.size + 10;

// 회색 테두리
stroke(180); // 회색
strokeWeight(1);
fill(ft.color);
rect(0, 0, w, h, 20);            // (0,0) 기준으로 그리기

noStroke();
fill(255);
text(ft.txt, 0, 1);              // 텍스트도 (0,0) 기준
pop();

}
            // 스파클 파티클 업데이트
            for (let i = sparkleParticles.length - 1; i >= 0; i--) {
                let sp = sparkleParticles[i];
                sp.update();
                sp.display();
                
                if (sp.isDead()) {
                    sparkleParticles.splice(i, 1);
                }
            }
            
            // 얼굴 그리기
            drawFace(width / 2, height / 2);
            
            // 파티클 시스템
            if (particles.length < particleCount) {
                addParticle(random(width), random(-50, 0));
            }
            
            for (let i = particles.length - 1; i >= 0; i--) {
                let p = particles[i];
                updateParticle(p);
                displayParticle(p);
                
                if (p.y > height + 50) {
                    particles.splice(i, 1);
                }
            }
        }

function mousePressed() {
    let newText = {
        txt: random(keywords),
        x: mouseX,
        y: mouseY,
        vy: 0,
        gravity: 0.5,
        damping: 0.6,
        stopped: false,
        stopTime: 0,
        color: color(random(4, 255), random(1, 255), 255),
        size: random(14, 20),
        rotation: random(-PI / 8, PI / 8),
        rotationVelocity: random(-0.03, 0.03) // 회전 속도
    };
    fallingTexts.push(newText);

    for (let i = 0; i < 20; i++) {
        let sparkleColor = color(random(200, 255), random(200, 255), 0);
        sparkleParticles.push(new SparkleParticle(mouseX, mouseY, sparkleColor));
    }
}

        function drawFace(x, y) {
            push();
            translate(x, y);
            
            // 마우스 위치에 따른 움직임
            let mouseOffset = createVector(mouseX - x, mouseY - y);
            mouseOffset.mult(0.01);
            
            // 얼굴 베이스
            fill('black');
            ellipse(0,0,300,300)
            
            // 귀
            ellipse(-150,0,60,60)
            ellipse(150,0,60,60)
            
            // 눈
            fill(255);
            if (mouseIsPressed) {
                // 눈 감기
                rectMode(CENTER);
                rect(-60 + mouseOffset.x , 5 + mouseOffset.y, 100, 10, 5)
                rect(60 + mouseOffset.x ,5 + mouseOffset.y ,100,10,5)
            } else {
                // 눈 뜨기
                ellipse(-60 + mouseOffset.x ,0 + mouseOffset.y ,100,100)
                ellipse(60 + mouseOffset.x ,0 + mouseOffset.y ,100,100)
                // 눈동자
                fill(0);
                rect(-110 + mouseOffset.x ,-60 + mouseOffset.y ,200,50)
                rect(10 + mouseOffset.x,-50 + mouseOffset.y ,100,40)
                ellipse(-60 + mouseOffset.x * 2, 0  + mouseOffset.y ,60 , 60)
                ellipse(60 + mouseOffset.x * 2 ,0 + mouseOffset.y ,60,60)
            }
            
            // 입
            noFill();
            stroke(255);
            strokeWeight(6);
            arc(0, 80 , 80, 30, 0, PI);
            
            // 뿔 (작은 악마 뿔)
            fill('black');
            noStroke();
            triangle(-90, -100, -120, -200, -20, -100);
            triangle(60, -120, 120, -200, 100, -50);
            
            pop();
        }

        function addParticle(x, y) {
            particles.push({
                x: x,
                y: y,
                vx: random(-1, 1),
                vy: random(1, 3),
                size: random(3, 8),
                color: color(random(100, 255), random(100, 255), random(200, 255)),
                alpha: 255
            });
        }

        function updateParticle(p) {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 1;
        }

        function displayParticle(p) {
            fill(red(p.color), green(p.color), blue(p.color), p.alpha);
            noStroke();
            ellipse(p.x, p.y, p.size);
        }

        function windowResized() {
            resizeCanvas(windowWidth, windowHeight);
        }
document.getElementById('scrollToWorksBtn').addEventListener('click', function () {
    const section = document.getElementById('selected-works');
    section.scrollIntoView({ behavior: 'smooth' });
});
        // 다크모드 토글
document.getElementById('modeToggle').addEventListener('click', function() {
    isDarkMode = !isDarkMode;
    document.body.style.background = isDarkMode ? '#1a1a1a' : '#ffffff';
    document.body.style.color = isDarkMode ? '#ffffff' : '#000000';
    });



        // 커스텀 커서
        document.addEventListener('DOMContentLoaded', function() {
            const cursor = document.getElementById('cursor');
            
            document.addEventListener('mousemove', function(e) {
                cursor.style.left = e.clientX - 10 + 'px';
                cursor.style.top = e.clientY - 10 + 'px';
            });
            
            const hoverElements = document.querySelectorAll('a, button, .portfolio-item');
            
            hoverElements.forEach(element => {
                element.addEventListener('mouseenter', function() {
                    cursor.classList.add('hover');
                    if (element.classList.contains('portfolio-item')) {
                        cursor.textContent = 'VIEW';
                    }
                });
                
                element.addEventListener('mouseleave', function() {
                    cursor.classList.remove('hover');
                    cursor.textContent = '';
                });
            });
        });

        // 스크롤 애니메이션
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });