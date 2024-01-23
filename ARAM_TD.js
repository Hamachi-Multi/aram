// 챔피언 목록 (.jpg)
const champ = ["가렌","갈리오","갱플랭크","그라가스","그레이브즈","그웬","나르","나미","나서스","노틸러스","녹턴","누누와 윌럼프","니달리","니코","닐라","다리우스","다이애나","드레이븐","라이즈"
,"라칸","람머스","럭스","럼블","레나타 글라스크","레넥톤","레오나","렉사이","렐","렝가","루시안","룰루","르블랑","리 신","리븐","리산드라","릴리아","마스터 이","마오카이","말자하","말파이트"
,"모데카이저","모르가나","문도 박사","미스 포츈","밀리오","바드","바루스","바이","베이가","베인","벡스","벨베스","벨코즈","볼리베어","브라움","브라이어","브랜드","블라디미르","블리츠크랭크"
,"비에고","빅토르","뽀삐","사미라","사이온","사일러스","샤코","세나","세라핀","세주아니","세트","소나","소라카","쉔","쉬바나","스웨인","스카너","시비르","신 짜오","신드라","신지드","쓰레쉬","아리"
,"아무무","아우렐리온 솔","아이번","아지르","아칼리","아크샨","아트록스","아펠리오스","알리스타","애니","애니비아","애쉬","야스오","에코","엘리스","오공","오른","오리아나","올라프","요네"
,"요릭","우디르","우르곳","워윅","유미","이렐리아","이블린","이즈리얼","일라오이","자르반","자야","자이라","자크","잔나","잭스","제드","제라스","제리","제이스","조이","직스","진","질리언"
,"징크스","초가스","카르마","카밀","카사딘","카서스","카시오페아","카이사","카직스","카타리나","칼리스타","케넨","케이틀린","케인","케일","코그모","코르키","퀸","크산테","클레드","키아나"
,"킨드레드","타릭","탈론","탈리야","탐 켄치","트런들","트리스타나","트린다미어","트위스티드 페이트","트위치","티모","파이크","판테온","피들스틱","피오라","피즈","하이머딩거","헤카림","흐웨이"];
const ban122 = [0, 5, 6, 1, 2, 7, 8, 3, 4, 9]; // 122 밴 인덱스 (블루팀 1밴 -> 레드팀 2밴 -> 블루팀 2밴 ...)
const ban111 = [0, 5, 1, 6, 2, 7, 3, 8, 4, 9]; // 111 밴 인덱스 (블루팀 1밴 -> 레드팀 1밴 -> 블루팀 1밴 ...)

const ORIGINAL = document.getElementById(`기본`);

const MAX_CHAMP = 165;

const BLUE = 1;
const RED = 2;

const RANDTYPE_15 = 15;
const RANDTYPE_10 = 10;
const RANDTYPE_5 = 5;

const BANTYPE_122 = 1;
const BANTYPE_111 = 2;

const MAX_RAND_CHAMPS = 15;
const MAX_PICK_CHAMPS = 5;
const MAX_BAN_CHAMPS = 10;

const TEAM_BLUE_RAND = `team${BLUE}r`;
const TEAM_RED_RAND = `team${RED}r`;

const TEAM_BLUE_PICK = `team${BLUE}p`;
const TEAM_RED_PICK = `team${RED}p`;

const BAN = `b`;

let banType = 1; // 1 -> 122, 2 -> 111
let randType = 15; // 1 -> 15, 2 -> 10, 3 -> 5

let oldPick = []; // 새로고침을 누르기 전에 있었던 픽들
let newPick = []; // 새로고침을 눌러서 나온 픽들
let ban = []; // 밴한 챔피언들

function changeChampion(circleID, newPickIndex) { // 챔피언을 랜덤으로 골라주는 함수
    while (true) { // 조건을 충족하는 챔피언이 나올 때까지 반복
        let randChamp = Math.floor(Math.random() * MAX_CHAMP); // 랜덤 인덱스

        // (새로고침을 누르기 전에 있던 챔피언 || 새로고침을 눌러서 나온 챔피언 || 밴한 챔피언) 중에 하나라도 겹치면 continue
        if (oldPick.includes(champ[randChamp])
            || newPick.includes(champ[randChamp])
            || ban.includes(champ[randChamp])) continue;
        
        else { // 겹치는 챔피언이 아니라면
            let circle = document.getElementById(circleID); // 원 가져오기
            let imgUrl = champ[randChamp]; // 챔피언 이름

            newPick[newPickIndex] = (champ[randChamp]); // 챔피언 이름을 newBan 배열에 push

            circle.src = `Champions/${imgUrl}.jpg`; // 원 이미지 변경
            changeText(`${circleID}t`, champ[randChamp]) // 텍스트 변경
            break;
        }
    }
}

function changeText(textID, string) { // 텍스트 변경하는 함수
    const text = document.getElementById(textID); // 텍스트 엘리먼트 가져오기
    text.textContent = string; // 텍스트 변경
}

function getRandomChampionsArray(team) { // 랜덤으로 뽑은 챔프들 이름을 클립보드로 복사하는 함수
    let randChampsList = []; // 임시로 챔프들을 저장할 배열

    if (team == BLUE) { // 만약 블루팀이면
        for (let i = 0; i < MAX_RAND_CHAMPS; i++) { // newPick 0 ~ 14 까지 복사
            if (newPick[i] == undefined) break; // 만약 undefined가 나오면 중지 (새로고침 챔피언을 5개, 10개로 설정했을 때)
            randChampsList[i] = ' ' + newPick[i]; // randChampsList에 순차적으로 저장
        }
    }
    else if (team == RED) { // 만약 레드팀이면
        for (let i = MAX_RAND_CHAMPS; i < (MAX_RAND_CHAMPS * 2); i++) { // newPick 15 ~ 29 까지 복사
            if (newPick[i] == undefined) break; // 만약 undefined가 나오면 중지 (새로고침 챔피언을 5개, 10개로 설정했을 때)
            randChampsList[i - 15] = ' ' + newPick[i]; // randChampsList에 순차적으로 저장
        }
    }

    return randChampsList;
}

async function copyRandomChampionsToClipboard(team) {
    let randChampsList = getRandomChampionsArray(team); // 배열

    try {
        if (team == BLUE) // 만약 블루팀이면
            await navigator.clipboard.writeText("1팀:" + randChampsList); // 접두어를 1팀으로
        else if (team == RED) // 만약 레드팀이면
            await navigator.clipboard.writeText("2팀:" + randChampsList); // 접두어를 2팀으로
    }
    catch (err) { // 에러 리턴
        return;
    }

    const audio = new Audio('Sound/메뉴.wav');
    audio.play();
}

function rollChampions() { // 새로고침을 눌렀을 때 반복문을 돌면서 changeChamp 함수를 실행하는 함수
    newPick = []; // 복사하기 전에 초기화
    if (randType == RANDTYPE_15) { // 랜덤 챔피언 15개
        for (let i = 0; i < RANDTYPE_15; i++) {
            changeChampion(`${TEAM_BLUE_RAND}${i + 1}`, i);
            changeChampion(`${TEAM_RED_RAND}${i + 1}`, i + 15);
        }
    }

    else if (randType == RANDTYPE_10) { // 랜덤 챔피언 10개
       for (let i = 0; i < RANDTYPE_10; i++) { // 랜덤 챔피언 10개 뽑기
            changeChampion(`${TEAM_BLUE_RAND}${i + 1}`, i);
            changeChampion(`${TEAM_RED_RAND}${i + 1}`, i + 15);
       }
       for (let i = RANDTYPE_10; i < MAX_RAND_CHAMPS; i++) { // 남은 5칸 초기화
            clearCircle(`${TEAM_BLUE_RAND}${i + 1}`, i);
            clearCircle(`${TEAM_RED_RAND}${i + 1}`, i + 15);
       }
    }
    
    else if (randType == RANDTYPE_5) { // 팀당 챔피언 5개
        for (let i = 0; i < RANDTYPE_5; i++) { // 랜덤 챔피언 5개 뽑기
             changeChampion(`${TEAM_BLUE_RAND}${i + 1}`, i);
             changeChampion(`${TEAM_RED_RAND}${i + 1}`, i + 15);
        }
        for (let i = RANDTYPE_5; i < MAX_RAND_CHAMPS; i++) { // 남은 10칸 초기화
             clearCircle(`${TEAM_BLUE_RAND}${i + 1}`, i);
             clearCircle(`${TEAM_RED_RAND}${i + 1}`, i + 15);
        }
    }
    
    const audio = new Audio('Sound/메뉴.wav');
    audio.play();
    oldPick = newPick.slice(); // 챔피언들을 모두 뽑고 나서 oldPick(새로고침 이전 챔피언들) 배열에 newPick(새로고침 이후 챔피언들) 배열을 복사
}

function connectToServer() {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5100/myhub", { withCredentials: true }) // 서버의 허브 엔드포인트를 지정
        .build();

    connection.on("ReceiveMessage", (user, message) => {
        console.log(`Received message from ${user}: ${message}`);
    })

    connection.start()
        .then(() => {
            connection.invoke("SendMessage", "John", "Hello!");
        })
        .catch(err => console.error(err));
}

function changeRandomChampionsType() { // 랜덤 챔피언 개수를 변경하는 함수
    if (randType == RANDTYPE_15) randType = RANDTYPE_10; // 현재 15가 선택되어있으면 10으로
    else if (randType == RANDTYPE_10) randType = RANDTYPE_5; // 10 -> 5
    else randType = RANDTYPE_15; // 5 -> 15

    changeRandomChampionsTypeFont(); // 타입 변경 버튼 텍스트 조정
    updateRollTitle();

    const audio = new Audio('Sound/메뉴.wav');
    audio.play();
}

function changeRandomChampionsTypeFont() { // (랜덤 챔피언 개수 변경 버튼) 텍스트 스타일을 변경하는 함수 (normal, bold)
    const champ15 = document.getElementById("rand-15"); // 버튼 엘리먼트 안에 span 태그를 사용해서 15 10 5 각각 씀, 15 / 10 / 5 이렇게 되어있음
    const champ10 = document.getElementById("rand-10");
    const champ5 = document.getElementById("rand-5");

    if (randType == RANDTYPE_15) { // 15 normal -> bold, 5 bold -> normal
        champ15.classList.remove("normal");
        champ15.classList.add("bold");
        champ5.classList.remove("bold");
        champ5.classList.add("normal");
    }

    else if (randType == RANDTYPE_10) { // 10 normal -> bold, 15 bold -> normal
        champ10.classList.remove("normal");
        champ10.classList.add("bold");
        champ15.classList.remove("bold");
        champ15.classList.add("normal");
    }

    else if (randType == RANDTYPE_5) { // 5 normal -> bold, 10 bold -> normal
        champ5.classList.remove("normal");
        champ5.classList.add("bold");
        champ10.classList.remove("bold");
        champ10.classList.add("normal");
    }
}

function updateRollTitle() {
    rollButton = document.getElementsByClassName("roll")[0];
    if (randType == RANDTYPE_15) {
        rollButton.title = "무작위 챔피언 15명을 뽑습니다.";
    } else if (randType == RANDTYPE_10) {
        rollButton.title = "무작위 챔피언 10명을 뽑습니다.";
    } else if (randType == RANDTYPE_5) {
        rollButton.title = "무작위 챔피언 5명을 뽑습니다.";
    }
}

function clearCard(cardID) { // 엘리먼트의 이미지를 초기화하는 함수
    const image = document.getElementById(cardID);
    image.src = ORIGINAL.src;
}

function clearCircle(circleID, arrIndex) { // 엘리먼트의 이미지와 텍스트를 초기화하는 함수
    newPick[arrIndex] = undefined; // newPick[arrIndex] 값 초기화
    const circle = document.getElementById(circleID);
    const text = document.getElementById(`${circleID}t`);
    circle.src = ORIGINAL.src;
    text.textContent = "";
}

function pickChampion(circle) { // 랜덤 챔피언을 누르면 픽 카드에 챔피언을 추가하는 함수
    if (circle.src == ORIGINAL.src) return;

    let team = ((String)(circle.id).startsWith(TEAM_BLUE_RAND)) ? BLUE : RED; // 해당 함수를 호출한 엘리먼트의 id를 비교해서 팀 설정
    let pickCard;

    for (let i = 0; i < 5; i++) { // 반복문 돌면서 비어있는 픽 카드 탐색
        // 블루팀 픽 카드 or 레드팀 픽 카드
        pickCard = (team == BLUE) ? document.getElementById(`${TEAM_BLUE_PICK}${i + 1}`) : document.getElementById(`${TEAM_RED_PICK}${i + 1}`);
        if (pickCard.src == ORIGINAL.src) {
            pickCard.src = circle.src;
            break;
        }
    }

    const audio = new Audio('Sound/선택.wav');
    audio.play();
}

function clearPick(circle) { // 픽 카드 초기화
    if (circle.src == ORIGINAL.src) return;

    circle.src = ORIGINAL.src;

    const audio = new Audio('Sound/제거.wav');
    audio.play();
}

function clearAll() { // 반복문을 돌면서 모든 엘리먼트들을 초기화하는 함수
    for (let i = 0; i < MAX_RAND_CHAMPS; i++) {
        clearCircle(`${TEAM_BLUE_RAND}${i + 1}`, i); // 블루팀 랜덤 챔피언 초기화
        clearCircle(`${TEAM_RED_RAND}${i + 1}`, i); // 레드팀 랜덤 챔피언 초기화
    }

    for (let i = 0; i < MAX_PICK_CHAMPS; i++) {
        clearCard(`${TEAM_BLUE_PICK}${i + 1}`); // 블루팀 픽 카드 초기화
        clearCard(`${TEAM_RED_PICK}${i + 1}`); // 레드팀 픽 카드 초기화
    }

    for (let i = 0; i < MAX_BAN_CHAMPS; i++) {
        clearCard(`${BAN}${i + 1}`); // 밴 초기화
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

function addCircle() { // 원을 동적 생성하는 함수 (챔피언 수만큼 생성함)
    const container = document.getElementById('circleContainer'); // 챔피언 
    for (let i = 0; i < MAX_CHAMP; i++) { // 챔피언 수만큼 생성
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
    }
    container.style.border = '3px solid black';
}

addCircle(); // 챔피언 수만큼 원을 생성하는 함수

const searchInput = document.getElementById('searchInput'); // 검색창 갖고오기
const gridItems = document.querySelectorAll(".circle"); // 밴 리스트에 생성되어있는 엘리먼트들 갖고오기

searchInput.addEventListener('input', function() { // 검색창 리스너
    let searchText = searchInput.value; // 검색창 텍스트
    searchText = searchText.replace(/\s+/g, ""); // 공백 제거

    gridItems.forEach(item => {
        let textContent = item.textContent; // 밴 리스트에 있는 각각의 엘리먼트 텍스트
        textContent = textContent.replace(/\s+/g, ""); // 공백 제거

        if (textContent.includes(searchText)) { // 비교
            item.style.display = "block"; // 포함되어 있으면 표시
        } else {
            item.style.display = "none"; // 아니면 투명
        }
    })
})

function updateBan() { // Ban 배열에 있는 챔피언들을 밴 카드에 나타내주는 함수
    for (let i = 0; i < 10; i++) {
        const banCard = document.getElementById(`${BAN}${i + 1}`); // 밴 카드 엘리먼트
        
        if (ban[i] == undefined) // 값이 비어있으면 기본 사진으로
            banCard.src = ORIGINAL.src;
    
        else // 값이 있으면 챔피언 사진으로
            banCard.src = `Champions/${ban[i]}.jpg`;
    }
}

function addBan(champIndex) { // ban 배열에 챔피언 추가하는 함수
    for (let i = 0; i < 10; i++) { // ban 배열에서 비어있는 인덱스에 챔피언 이름 넣음
        if (banType == BANTYPE_122) {
            if (ban[ban122[i]] == undefined) { // ban122 배열에 저장되어있는 인덱스 순서에 따라 탐색
                ban[ban122[i]] = champ[champIndex]; // ban 배열에 해당 챔피언 이름 넣음
                break;
            }
        }

        else if (banType == BANTYPE_111) {
            if (ban[ban111[i]] == undefined) { // ban111 배열에 저장되어있는 인덱스 순서에 따라 탐색
                ban[ban111[i]] = champ[champIndex];
                break;
            }
        }
    }

    updateBan(); // 밴 카드 업데이트
    const audio = new Audio('Sound/선택.wav');
    audio.play();
}

function removeBan(banCard) { // 밴 카드를 눌렀을 때 밴 취소하는 함수
    if (banCard.src == ORIGINAL.src) return;
    const banCardIndex = (banCard.id).slice(1) - 1;

    ban[banCardIndex] = undefined; // 밴 배열에서 해당 인덱스 값 초기화
    updateBan(); // 밴 카드 업데이트

    const audio = new Audio('Sound/제거.wav');
    audio.play();
}

function changeBanType() { // 밴 타입을 변경하는 함수
    if (banType == BANTYPE_122) banType = BANTYPE_111;
    else banType = BANTYPE_122;
    
    changeBanFont(); // 타입 변경 버튼 텍스트 조정

    const audio = new Audio('Sound/메뉴.wav');
    audio.play();
}

function changeBanFont() { // (밴 타입 변경 버튼) 텍스트의 굵기를 조정하는 함수 (bold, normal)
    const ban122 = document.getElementById("ban-122"); // <span class="ban-122"> 122
    const ban111 = document.getElementById("ban-111"); // <span class="ban-111"> 111

    if (banType == BANTYPE_122) { // 122 normal -> bold, 111 bold -> normal 
        ban122.classList.remove("normal");
        ban122.classList.add("bold");
        ban111.classList.remove("bold");
        ban111.classList.add("normal");
    }

    else if (banType == BANTYPE_111) {
        ban122.classList.remove("bold");
        ban122.classList.add("normal");
        ban111.classList.remove("normal");
        ban111.classList.add("bold");
    }
}