// 챔피언 목록 (.jpg)
const champ = ["가렌","갈리오","갱플랭크","그라가스","그레이브즈","그웬","나르","나미","나서스","노틸러스","녹턴","누누와 윌럼프","니달리","니코","닐라","다리우스","다이애나","드레이븐","라이즈"
,"라칸","람머스","럭스","럼블","레나타 글라스크","레넥톤","레오나","렉사이","렐","렝가","루시안","룰루","르블랑","리 신","리븐","리산드라","릴리아","마스터 이","마오카이","말자하","말파이트"
,"모데카이저","모르가나","문도 박사","미스 포츈","밀리오","바드","바루스","바이","베이가","베인","벡스","벨베스","벨코즈","볼리베어","브라움","브랜드","블라디미르","블리츠크랭크","비에고"
,"빅토르","뽀삐","사미라","사이온","사일러스","샤코","세나","세라핀","세주아니","세트","소나","소라카","쉔","쉬바나","스웨인","스카너","시비르","신 짜오","신드라","신지드","쓰레쉬","아리"
,"아무무","아우렐리온 솔","아이번","아지르","아칼리","아크샨","아트록스","아펠리오스","알리스타","애니","애니비아","애쉬","야스오","에코","엘리스","오공","오른","오리아나","올라프","요네"
,"요릭","우디르","우르곳","워윅","유미","이렐리아","이블린","이즈리얼","일라오이","자르반","자야","자이라","자크","잔나","잭스","제드","제라스","제리","제이스","조이","직스","진","질리언"
,"징크스","초가스","카르마","카밀","카사딘","카서스","카시오페아","카이사","카직스","카타리나","칼리스타","케넨","케이틀린","케인","케일","코그모","코르키","퀸","크산테","클레드","키아나"
,"킨드레드","타릭","탈론","탈리야","탐 켄치","트런들","트리스타나","트린다미어","트위스티드 페이트","트위치","티모","파이크","판테온","피들스틱","피오라","피즈","하이머딩거","헤카림"];
const ban122 = [0, 5, 6, 1, 2, 7, 8, 3, 4, 9]; // 122 밴 인덱스 (1팀 1밴 -> 2팀 2밴 -> 1팀 2밴 ...)
const ban111 = [0, 5, 1, 6, 2, 7, 3, 8, 4, 9]; // 111 밴 인덱스 (1팀 1밴 -> 2팀 1밴 -> 1팀 1밴 ...)

const BLUE = 1;
const RED = 2;

let banType = 1; // 1 -> 122, 2 -> 111
let champType = 1; // 1 -> 15, 2 -> 10, 3 -> 5

let oldPick = []; // 새로고침을 누르기 전에 있었던 픽들
let newPick = []; // 새로고침을 눌러서 나온 픽들
let ban = []; // 밴한 챔피언들

function changeChamp(id, textid, index) { // 챔피언을 랜덤으로 골라주는 기본 함수
    while (true) { // 조건을 충족하는 챔피언이 나올 때까지 무한반복
        let rand = Math.floor(Math.random() * 163); // 랜덤 인덱스

        // (새로고침을 누르기 전에 있던 챔피언 || 새로고침을 눌러서 나온 챔피언 || 밴한 챔피언) 중에 하나라도 겹치면 continue
        if (oldPick.includes(champ[rand])
            || newPick.includes(champ[rand])
            || ban.includes(champ[rand])) continue;
        else { // 겹치는 챔피언이 아니라면
            let circle = document.getElementById(id); // 원 가져오기
            let imgUrl = champ[rand]; // 챔피언 이름

            newPick[index] = (champ[rand]); // 챔피언 이름을 newBan 배열에 push

            circle.src = `Champions/${imgUrl}.jpg`; // 원 이미지 변경
            changeText(textid, champ[rand]) // 텍스트 변경
            break;
        }
    }

}

function changeText(id, string) { // 텍스트 변경하는 함수
    const text = document.getElementById(id); // 텍스트 엘리먼트 가져오기
    text.textContent = string; // 텍스트 변경
}

async function copyTeam(team) { // 랜덤으로 뽑은 챔프들 복사하는 함수
    let pickList = []; // 임시로 챔프들을 저장할 배열

    if (team == 1) { // 만약 team이 1이면
        for (let i = 0; i < 15; i++) { // newPick 0 ~ 14 까지 복사
            if (newPick[i] == undefined) break; // 만약 undefined가 나오면 중지
            pickList[i] = " " + newPick[i]; // pickList에 순차적으로 저장
        }
    }
    else if (team == 2) { // 만약 team이 2면
        for (let i = 15; i < 30; i++) { // newPick 15 ~ 29 까지 복사
            if (newPick[i] == undefined) break; // 만약 undefined가 나오면 중지
            pickList[i - 15] = " " + newPick[i]; // pickList에 순차적으로 저장
        }
    }

    try {
        if (team == 1) // 만약 team이 1이면
            await navigator.clipboard.writeText("1팀:" + pickList); // 접두어를 1팀으로
        else if (team == 2) // 만약 team이 2면
            await navigator.clipboard.writeText("2팀:" + pickList); // 접두어를 2팀으로
    }
    catch (err) { // 에러 리턴
        return;
    }
    const audio = new Audio('Sound/메뉴.wav');
    audio.play();
}

function rollChamp() { // 새로고침을 눌렀을 때 반복문을 돌면서 changeChamp 함수를 실행하는 함수
    newPick = []; // 복사하기 전에 초기화
    if (champType == 1) { // 팀당 챔피언 15개
        for (let i = 1; i <= 2; i++) {
            for (let j = 1; j <= 15; j++) { // 팀1 - 팀2, 팀당 15개 챔피언
                changeChamp(`team${i}p${j}`, `team${i}p${j}t`, j + ((i - 1) * 15) - 1); // 팀1, 15개 챔피언 뽑기 (이미지 + 텍스트)
            }
        }
    }
    else if (champType == 2) { // 팀당 챔피언 10개
        for (let i = 1; i <= 2; i++) {
            for (let j = 1; j <= 10; j++) { // 팀1 - 팀2, 팀당 10개 챔피언
                changeChamp(`team${i}p${j}`, `team${i}p${j}t`, j + ((i - 1) * 15) - 1); // 팀당 10개 챔피언 뽑기 (이미지 + 텍스트)
            }
        }
        for (let i = 1; i <= 2; i++) {
            for (let j = 11; j <= 15; j++) { // 팀1 - 팀2, 나머지 엘리먼트 초기화
                clearRoll(`team${i}p${j}`, `team${i}p${j}t`, j + ((i - 1) * 15) - 1); // 초기화
            }
        }
    }
    else if (champType == 3) { // 팀당 챔피언 5개
        for (let i = 1; i <= 2; i++) {
            for (let j = 1; j <= 5; j++) { // 팀1 - 팀2, 팀당 5개 챔피언
                changeChamp(`team${i}p${j}`, `team${i}p${j}t`, j + ((i - 1) * 15) - 1); // 팀당 5개 챔피언 뽑기 (이미지 + 텍스트)
            }
        }
        for (let i = 1; i <= 2; i++) {
            for (let j = 6; j <= 15; j++) { // 팀1 - 팀2, 나머지 엘리먼트 초기화
                clearRoll(`team${i}p${j}`, `team${i}p${j}t`, j + ((i - 1) * 15) - 1); // 초기화
            }
        }
    }
    const audio = new Audio('Sound/메뉴.wav');
    audio.play();
    oldPick = newPick.slice(); // 챔피언들을 모두 뽑고 나서 oldPick(새로고침 이전 챔피언들) 배열에 newPick(새로고침 이후 챔피언들) 배열을 복사
}

function changeChampType() { // 밴 타입을 변경하는 함수 (1 - 122, 2 - 111)
    changeChampFont(); // 타입 변경 버튼 텍스트 조정
    if (champType == 1) champType = 2;
    else if (champType == 2) champType = 3;
    else champType = 1;
    const audio = new Audio('Sound/메뉴.wav');
    audio.play();
}

function changeChampFont() { // (챔프 타입 변경 버튼) 텍스트의 굵기를 조정하는 함수 (bold, normal)
    const champ15 = document.getElementById("champ-15"); // <span class="champ-15"> 15
    const champ10 = document.getElementById("champ-10"); // <span class="champ-10"> 10
    const champ5 = document.getElementById("champ-5"); // <span class="champ-5"> 5
    if (champType == 1) { // 1 -> 2, 122는 normal, 111은 bold로 조정
        champ15.classList.remove("bold");
        champ15.classList.add("normal");
        champ10.classList.remove("normal");
        champ10.classList.add("bold");
    }
    else if (champType == 2) { // 2 -> 1, 122는 bold, 111은 normal로 조정
        champ10.classList.remove("bold");
        champ10.classList.add("normal");
        champ5.classList.remove("normal");
        champ5.classList.add("bold");
    }
    else if (champType == 3) {
        champ5.classList.remove("bold");
        champ5.classList.add("normal");
        champ15.classList.remove("normal");
        champ15.classList.add("bold");
    }
}

function clearPickBan(id) { // 해당 엘리먼트에 있는 이미지를 초기화하는 함수
    const image = document.getElementById(id);
    image.src = 'Champions/기본.jpg';
}

function clearRoll(id, textid, index) { // 해당 엘리먼트에 있는 이미지와 텍스트까지 초기화하는 함수
    newPick[index] = undefined;
    const circle = document.getElementById(id);
    const text = document.getElementById(textid);
    circle.src = `Champions/기본.jpg`;
    text.textContent = "";
}

function pickChamp(textid, team) { // 새로고침 챔피언을 누르면 픽 카드에 챔피언을 추가하는 함수
    const original = document.getElementById(`기본`);
    text = document.getElementById(textid);
    const index = champ.indexOf(text.textContent); // 새로고침 챔피언 옆에 있는 텍스트를 가져와서 champ 배열의 인덱스 탐색
    if (index == -1) return; // champ 배열에 없는 텍스트면 리턴 (예외)
    for (let i = 1; i <= 5; i++) { // 반복문 돌면서 비어있는 픽 카드 탐색
        let pick = document.getElementById(`team${team}pick${i}`); // 픽 카드 엘리먼트 가져오기
        if (pick.src == original.src) { // 픽 카드가 비어있으면 (기본.jpg)
            pick.src = `Champions/${champ[index]}.jpg`; // 픽 카드에 챔피언 이미지 넣기
            break;
        }
    }
    const audio = new Audio('Sound/선택.wav');
    audio.play();
}

function removePick(id) { // 픽 카드를 눌렀을 때 해당 엘리먼트를 초기화하는 함수
    const image = document.getElementById(id);
    const original = document.getElementById('기본');
    if (image.src == original.src) return; // 비어있으면 리턴
    image.src = 'Champions/기본.jpg'; // 해당 엘리먼트 이미지 초기화
    const audio = new Audio('Sound/제거.wav');
    audio.play();
}

function clearAll() { // 반복문을 돌면서 모든 엘리먼트들을 초기화하는 함수
    for (let i = 1; i <= 15; i++) {
        clearRoll(`team1p${i}`, `team1p${i}t`); // 팀1, 15개 엘리먼트 초기화 (이미지 + 텍스트)
        clearRoll(`team2p${i}`, `team2p${i}t`); // 팀2, 15개 엘리먼트 초기화 (이미지 + 텍스트)
    }
    for (let i = 1; i <= 2; i++) {
        for (let j = 1; j <= 5; j++) {
            clearPickBan(`team${i}pick${j}`); // 팀1 - 팀2, 픽한 챔피언들 초기화 (이미지)
        }
    }
    for (let i = 1; i <= 10; i++) {
        clearPickBan(`b${i}`); // 팀1 - 팀2, 밴한 챔피언들 초기화 (이미지)
    }
    const audio = new Audio('Sound/메뉴.wav');
    audio.play();
    oldPick = []; // 새로고침 이전 챔피언들 초기화
    newPick = []; // 새로고침 이후 챔피언들 초기화
    ban = []; // 밴 챔피언들 초기화
}

function createCircle() { // div 엘리먼트를 리턴하는 함수
    const circle = document.createElement('div');
    circle.classList.add('circle');
    return circle; // div 태그, circle 클래스를 가진 엘리먼트 리턴
}

function addCircle() { // 원을 동적 생성하는 함수 (챔피언 수만큼 163개 생성함)
    const container = document.getElementById('circleContainer'); // 챔피언 리스트 섹터에 있는 <div> 엘리먼트 갖고 옴
    for (let i = 0; i < 163; i++) { // 챔피언 수만큼 생성
        const circle = createCircle(); // div 태그, circle 클래스를 가진 엘리먼트를 리턴받음
        circle.style.textAlign = 'center'; // 텍스트 중앙정렬
        circle.style.marginTop = '10px';
        circle.id = i;

        const image = document.createElement('img'); // 이미지 엘리먼트 생성
        image.src = `Champions/${champ[i]}.jpg`; // champ 배열에 있는 이름으로 디렉터리 지정
        image.alt = 'Image';
        image.id = i; // 엘리먼트 배열에 따로 저장하는 대신 id에 인덱스를 붙임으로써 onclick 함수 사용을 원활하게 함
        image.onclick = function() {
            addBan(i); // 예컨데 0번째 원이면 가렌, 1번째 원이면 갈리오임을 알 수 있음 (매개변수로 넘겨주기)
        };
        circle.appendChild(image);
        
        const text = document.createElement('span'); // 텍스트
        text.textContent = champ[i];
        text.style.display = 'block';
        text.style.textAlign = 'center';
        text.style.marginBottom = '10px';
        text.style.fontWeight = 'bold';
        
        circle.appendChild(text);

        
        container.appendChild(circle);
        
        container.style.border = '3px solid black';
    }
}

addCircle(); // 원 163개 생성하는 함수

const searchInput = document.getElementById('searchInput'); // 검색창 갖고오기
const gridItems = document.querySelectorAll(".circle"); // 밴 리스트에 생성되어있는 엘리먼트들 갖고오기

searchInput.addEventListener('input', function() { // 검색창 리스너
    let searchText = searchInput.value; // 검색창 텍스트
    searchText = searchText.replace(/\s+/g, ""); // 공백 제거

    gridItems.forEach(item => {
        let textContent = item.textContent; // 밴 리스트에 있는 각각의 엘리먼트 이름 갖고오기
        textContent = textContent.replace(/\s+/g, ""); // 공백 제거

        if (textContent.includes(searchText)) { // 비교
            item.style.display = "block"; // 포함되어 있으면 표시
        } else {
            item.style.display = "none"; // 아니면 투명
        }
    })
})

function updateBanCard(i) { // 밴 카드를 업데이트하는 함수
    const banCard = document.getElementById(`b${i + 1}`); // 밴 카드 엘리먼트의 id를 1 ~ 15로 지정했기 때문에 +1 
    if (ban[i] == undefined) // 밴 배열의 i번째 인덱스가 비어있으면 초기화
        banCard.src = `Champions/기본.jpg`;
    else // 밴 배열의 i번째 인덱스에 챔피언 이름이 있으면 업데이트
        banCard.src = `Champions/${ban[i]}.jpg`;
}

function updateBan() { // 반복문 돌면서 updateBanCard 함수 실행하는 함수
    for (let i = 0; i < 10; i++) // 인덱스 0 ~ 9까지 (밴 챔피언은 총 10개)
        updateBanCard(i);
}

function addBan(id) { // 챔피언 리스트에서 이미지 클릭할 때 밴 배열에 추가
    for (let i = 0; i < 10; i++) { // 처음부터 순서대로 밴 추가 (만약 중간에 비어있으면 들어가게끔)
        if (banType == 1) { // 122밴 방식
            if (ban[ban122[i]] == undefined) { // ban122 배열에 저장되어있는 인덱스 순서에 따라 탐색
                ban[ban122[i]] = champ[id]; // 해당 인덱스에 챔피언이 없으면 챔피언 이름 넣기
                break;
            }
        }
        else if (banType == 2) { // 111밴 방식
            if (ban[ban111[i]] == undefined) { // ban111 배열에 저장되어있는 인덱스 순서에 따라 탐색
                ban[ban111[i]] = champ[id];
                break;
            }
        }
    }
    updateBan(); // 밴 카드 업데이트
    const audio = new Audio('Sound/선택.wav');
    audio.play();
}

function removeBan(id) { // 밴 카드를 눌렀을 때 해당 엘리먼트 초기화
    const image = document.getElementById(id);
    const original = document.getElementById('기본');
    const index = id.slice(1) - 1; // 밴 카드의 id가 b1 ~ b10이므로 인덱스만 추출
    if (image.src == original.src) return; // 해당 엘리먼트에 챔피언이 없으면 리턴

    ban[index] = undefined; // 밴 배열에서 해당 인덱스 값 초기화
    updateBan(); // 밴 카드 업데이트
    const audio = new Audio('Sound/제거.wav');
    audio.play();
}

function changeBanType() { // 밴 타입을 변경하는 함수 (1 - 122, 2 - 111)
    changeBanFont(); // 타입 변경 버튼 텍스트 조정
    if (banType == 1) banType = 2; // 1 -> 2
    else banType = 1; // 2 -> 1
    const audio = new Audio('Sound/메뉴.wav');
    audio.play();
}

function changeBanFont() { // (밴 타입 변경 버튼) 텍스트의 굵기를 조정하는 함수 (bold, normal)
    const ban122 = document.getElementById("ban-122"); // <span class="ban-122"> 122
    const ban111 = document.getElementById("ban-111"); // <span class="ban-111"> 111
    if (banType == 1) { // 1 -> 2, 122는 normal, 111은 bold로 조정
        ban122.classList.remove("bold");
        ban122.classList.add("normal");
        ban111.classList.remove("normal");
        ban111.classList.add("bold");
    }
    else if (banType == 2) { // 2 -> 1, 122는 bold, 111은 normal로 조정
        ban122.classList.remove("normal");
        ban122.classList.add("bold");
        ban111.classList.remove("bold");
        ban111.classList.add("normal");
    }
}