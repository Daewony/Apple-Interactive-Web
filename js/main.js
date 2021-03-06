// (() => {

// })();
// == (function() {})();

// 전역변수 충돌방지를 위함, 함수로 지역변수 강제 사용
(() => {

    let yOffset = 0; // window.pageYOffset 대신 쓸 변수
    let prevScrollHeight = 0; // 현재 스크롤 위치 (yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene =0; // 현재 활성하된(눈 앞에 보고있는) 씬(scroll-section)
    let enterNewScene = false; // 새로운 scene이 시작된 순간 true

    const sceneInfo = [
        // 스크롤 구간 -> 스크롤 높이 필요

        // 스크롤 높이
        {
            // 0
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0.main-message.a'),
                messageB: document.querySelector('#scroll-section-0.main-message.b'),
                messageC: document.querySelector('#scroll-section-0.main-message.c'),
                messageD: document.querySelector('#scroll-section-0.main-message.d'),
            },
            values: {
                // 스크롤 비율 설정
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }], // 10~20% 
                // messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }], // 30~40%
                messageA_translateY_in: [20,0,{start:0.1,end:0.2}],
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }], // 30~40%
                messageA_translateY_out: [0,-20,{start:0.1,end:0.2}],
            }
        },
        {
            // 1
            type: 'normal',
            heightNum: 5, 
            scrollHeight: 0,
            objs: {
                container:document.querySelector('#scroll-section-1')
            }
        },
        {
            // 2
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container:document.querySelector('#scroll-section-2')
            }
        },
        {
            // 3
            type: 'sticky',
            heightNum: 5, 
            scrollHeight: 0,
            objs: {
                container:document.querySelector('#scroll-section-3')
            }
        },
    ];

    function setLayout() {
        // 각 스크롤 섹션의 높이 세팅
        for(let i =0;i<sceneInfo.length;i++){
            if(sceneInfo[i].type === 'sticky'){
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if (sceneInfo[i].type === 'normal'){
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }

        yOffset = window.pageYOffset;
        // 새로고침해도 헤당 위치에 설정
       let totalScrollHeight = 0;
       for(let i=0;i<sceneInfo.length; i++) {
           totalScrollHeight += sceneInfo[i].scrollHeight;
           if(totalScrollHeight >= pageYOffset) {
               currentScene = i;
               break;
           }
       }
    }

    function calcValues(values, currentYOffset) {
        let rv;
        // 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;
        if(values.length === 3){
            // start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;


            if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            } else if (currentYOffset < partScrollStart){
                rv = values[0];
            } else if (currentYOffset > partScrollEnd) {
                rv = values[1];
            }
            
        } else {
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }
        

        return rv;
    }

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        switch (currentScene) {
            case 0:
                // console.log('0 play');
                const messageA_opacity_in = calcValues(values.messageA_opacity_in, currentYOffset);
                const messageA_opacity_out = calcValues(values.messageA_opacity_out, currentYOffset);
                const messageA_translateY_in = calcValues(values.messageA_translateY_out, currentYOffset);
                const messageA_translateY_out = calcValues(values.messageA_translateY_out, currentYOffset);

                if(scrollRatio <= 0.22) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translateY(${messageA_translateY_in}%)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translateY(${messageA_translateY_out}%)`;
                }   
                break;

            case 1:
                console.log('1 play');
                break;

            case 2:
                console.log('2 play');
                break;

            case 3:
                console.log('3 play');
                break;
        }
    }

    
    function scrollLoop() {
        prevScrollHeight =0;
        for(let i=0;i<currentScene;i++){
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        
        if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            currentScene++;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }

        if(yOffset < prevScrollHeight){
            if(currentScene===0) return; // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
            enterNewScene = true;
            currentScene--;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }

        if(enterNewScene) return;

        playAnimation();

    }

    
    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
    });
    // window.addEventListener('DOMcontentLoaded',setLayout);
    window.addEventListener('load',setLayout);
    window.addEventListener('resize',setLayout);

    setLayout();
})();