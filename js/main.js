// (() => {

// })();
// == (function() {})();

// 전역변수 충돌방지를 위함, 함수로 지역변수 강제 사용
(() => {

    let yOffset = 0; // window.pageYOffset 대신 쓸 변수
    let prevScrollHeight = 0; // 현재 스크롤 위치 (yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene =0; // 현재 활성하된(눈 앞에 보고있는) 씬(scroll-section)

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
                messageA_opacity: [0, 1],

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
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }
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

    }

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        switch (currentScene) {
            case 0:
                // console.log('0 play');
                let messageA_opacity = values.messageA_opacity[0];
                let messageA_opacity = values.messageA_opacity[1];
                calcValues(values.messageA_opacity,currentYOffset);
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
            currentScene++;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }

        if(yOffset < prevScrollHeight){
            if(currentScene===0) return; // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
            currentScene--;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }

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