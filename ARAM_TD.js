// 챔피언 목록 (.jpg)
const champ = ["가렌","갈리오","갱플랭크","그라가스","그레이브즈","그웬","나르","나미","나서스","노틸러스","녹턴","누누와 윌럼프","니달리","니코","닐라","다리우스","다이애나","드레이븐","라이즈"
,"라칸","람머스","럭스","럼블","레나타 글라스크","레넥톤","레오나","렉사이","렐","렝가","루시안","룰루","르블랑","리 신","리븐","리산드라","릴리아","마스터 이","마오카이","말자하","말파이트"
,"모데카이저","모르가나","문도 박사","미스 포츈","밀리오","바드","바루스","바이","베이가","베인","벡스","벨베스","벨코즈","볼리베어","브라움","브라이어","브랜드","블라디미르","블리츠크랭크"
,"비에고","빅토르","뽀삐","사미라","사이온","사일러스","샤코","세나","세라핀","세주아니","세트","소나","소라카","쉔","쉬바나","스웨인","스카너","시비르","신 짜오","신드라","신지드","쓰레쉬","아리"
,"아무무","아우렐리온 솔","아이번","아지르","아칼리","아크샨","아트록스","아펠리오스","알리스타","애니","애니비아","애쉬","야스오","에코","엘리스","오공","오른","오리아나","올라프","요네"
,"요릭","우디르","우르곳","워윅","유미","이렐리아","이블린","이즈리얼","일라오이","자르반","자야","자이라","자크","잔나","잭스","제드","제라스","제리","제이스","조이","직스","진","질리언"
,"징크스","초가스","카르마","카밀","카사딘","카서스","카시오페아","카이사","카직스","카타리나","칼리스타","케넨","케이틀린","케인","케일","코그모","코르키","퀸","크산테","클레드","키아나"
,"킨드레드","타릭","탈론","탈리야","탐 켄치","트런들","트리스타나","트린다미어","트위스티드 페이트","트위치","티모","파이크","판테온","피들스틱","피오라","피즈","하이머딩거","헤카림","흐웨이"];
const ban122 = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4]; // 122 밴 인덱스 (블루팀 1밴 -> 레드팀 2밴 -> 블루팀 2밴 ...)

const ORIGINAL_IMAGE = document.getElementsByClassName(`기본`)[0].src;

const MAX_CHAMP = 165;

const BLUE = 1;
const RED = 2;

const MAX_RAND_CHAMPS = 15;
const MAX_PICK_CHAMPS = 5;
const MAX_BAN_CHAMPS = 5;

const TEAM_BLUE_RAND = `team${BLUE}r`;
const TEAM_RED_RAND = `team${RED}r`;

const TEAM_BLUE_PICK = `team${BLUE}p`;
const TEAM_RED_PICK = `team${RED}p`;

const TEAM_BLUE_BAN = `team${BLUE}b`;
const TEAM_RED_BAN = `team${RED}b`;

let connection = new signalR.HubConnectionBuilder().configureLogging(signalR.LogLevel.None);
let connectionLock = false;

let leagueType = "all"; // all, team
let leagueToggle = false;

let inputToggle = false;
let inputLock = false;
let inputText;

let buttonToggle = false;
let buttonLock = false;
let buttonText;

let isMain = false;

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
            changeText(`${circleID}t`, champ[randChamp]); // 텍스트 변경
            break;
        }
    }
}

function changeText(textID, string) { // 텍스트 변경하는 함수
    const text = document.getElementById(textID); // 텍스트 엘리먼트 가져오기
    text.textContent = string; // 텍스트 변경
}

function getTeamRandomChampionsArray(team) { // 랜덤으로 뽑은 챔프들 이름을 클립보드로 복사하는 함수
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
    let randChampsList = getTeamRandomChampionsArray(team); // 배열

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
    for (let i = 0; i < MAX_RAND_CHAMPS; i++) {
        changeChampion(TEAM_BLUE_RAND + i, i);
        changeChampion(TEAM_RED_RAND + i, i + 15);
    }

    const audio = new Audio('Sound/메뉴.wav');
    audio.play();
    oldPick = newPick.slice(); // 챔피언들을 모두 뽑고 나서 oldPick(새로고침 이전 챔피언들) 배열에 newPick(새로고침 이후 챔피언들) 배열을 복사
}

async function connectAsMain(button) {
    if (connectionLock) return;
    
    connectionLock = true;

    const audio = new Audio('Sound/메뉴.wav');
    audio.play();

    if (connection.state === signalR.HubConnectionState.Connected) {
        await connection.stop();
        switchLeagueModeForMain();
        leagueToggle = false;
    }

    leagueType = (button == document.getElementById("league-all")) ? "all" : "team";

    switchInputValue(button);

    connection = new signalR.HubConnectionBuilder()
    .configureLogging(signalR.LogLevel.None)
    .withUrl("http://localhost:5100/myhub")
    .build();
    
    await connection.start()
    .then(() => {
            connection.invoke("InitMainConnection", leagueType)
            connection.on("ReceiveAllCode", (all) => {
                switchLeagueModeForMain(all);
                isMain = true;
            });
            connection.on("ReceiveTeamCode", (blue, red) => {
                switchLeagueModeForMain(blue, red);
                isMain = true;
            })
        })
    .catch(async () => {  
        switchInputValue(button);
    });
    
    connectionLock = false;
}

async function switchInputValue(button) {
    if (buttonLock) return;

    buttonLock = true;

    if (!buttonToggle) {
        buttonText = button.textContent;
        button.textContent = "연결 중.."
        
        buttonToggle = true;
    }
    else {
        button.textContent = "연결 실패";
        await delay(500);
        button.textContent = buttonText;

        buttonToggle = false;
    }

    buttonLock = false;
}

async function connectAsSub(input) {
    if (connectionLock) return;
    
    connectionLock = true;

    const audio = new Audio('Sound/메뉴.wav');
    audio.play();

    if (connection.state === signalR.HubConnectionState.Connected) {
        await connection.stop();
        leagueToggle = false;
    }

    let team;

    const code = input.value;

    team = (input == blueCodeInput) ? "blue" : "red";
 
    switchInputValue(input);

    connection = new signalR.HubConnectionBuilder()
    //.configureLogging(signalR.LogLevel.None)
    .withUrl("http://localhost:5100/myhub")
    .build();

    await connection.start()
        .then(() => {
            connection.invoke(`AddSubConnection`, code, team)
            .then(() => {
                switchLeagueModeForSub(team);
                isMain = false;
            })
            .catch(async () => {
                switchInputValue(input);
            });

            connection.on("ReceiveChampions", (champions) => {
                newPick = champions;
                updateRandomChampionsFromMain();
            });

            connection.on("Disconnected", (message) => {
                clearButton();
            });
        })
        .catch(async () => {  
            switchInputValue(input);
        })
        


    connectionLock = false;
}

async function switchInputValue(input) {
    if (inputLock) return;

    inputLock = true;

    if (!inputToggle) {
        inputText = input.value;
        input.value = "....";
        input.readOnly = true;
        
        inputToggle = true;
    }
    else {
        input.value = "실패";
        await delay(500);
        input.readOnly = false;
        input.value = inputText;

        inputToggle = false;
    }

    inputLock = false;
}

function switchLeagueModeForSub(team) {
    let mid = document.querySelectorAll(".main-menu *");
    let bottom = document.querySelector(".bottom-container");
    let clear = document.getElementById("clear");

    if (!leagueToggle) {
        mid.forEach(function (element) {
            element.style.opacity = "0";
            element.style.pointerEvents = "none";
        });

        bottom.style.opacity = "0";
        bottom.style.pointerEvents = "none";

        clear.style.opacity = "1";
        clear.style.pointerEvents = "auto";
        clear.textContent = "해제";
        
        if (team == "blue")
            redCodeInput.value = "";
        else if (team == "red") {
            blueCodeInput.value = "";
        }

        blueCodeInput.disabled = true;
        redCodeInput.disabled = true;

        leagueToggle = true;
    }
    else {
        mid.forEach(function (element) {
            if (element.className !== "기본") {
            element.style.opacity = "1";
            element.style.pointerEvents = "auto";
            }
        });
    
        bottom.style.opacity = "1";
        bottom.style.pointerEvents = "auto";
    
        clear.textContent = "초기화";

        blueCodeInput.value = "";
        redCodeInput.value = "";

        blueCodeInput.disabled = false;
        redCodeInput.disabled = false;
    }
}

function clearButton() {
    if (!leagueToggle || isMain) {
        clearAll();
        sendChampions();
        if (!isMain) {
            document.getElementById("blueCodeInput").value = "";
            document.getElementById("redCodeInput").value = "";
        }
    }
    else {
        switchLeagueModeForSub();
        disconnect();
        leagueToggle = false;
    }

}

function switchLeagueModeForMain(code1, code2) {
    let allButton = document.getElementById("league-all");
    let teamButton = document.getElementById("league-team");
    
    if (!leagueToggle) {
        if (leagueType == "all") {
            allButton.textContent = "해제";
            allButton.onclick = disconnect;

            blueCodeInput.value = code1;
            blueCodeInput.disabled = true;

            redCodeInput.value = code1;
            redCodeInput.disabled = true;
        }
        else if (leagueType == "team") {
            teamButton.textContent = "해제";
            teamButton.onclick = disconnect;
            
            blueCodeInput.value = code1;
            blueCodeInput.disabled = true;

            redCodeInput.value = code2;
            redCodeInput.disabled = true;
        }

        leagueToggle = true;
    } 
    else {
        if (leagueType == "all" && teamButton.textContent == "해제") {
            teamButton.textContent = "대회 팀 모드";
            teamButton.onclick = function () {
                connectAsMain(teamButton);
            };
            leagueToggle = false;
            switchLeagueModeForMain(code1, code2);
        }
        else if (leagueType == "team" && allButton.textContent == "해제") {
            allButton.textContent = "대회 전체 모드";
            allButton.onclick = function () {
                connectAsMain(allButton);
            };
            leagueToggle = false;
            switchLeagueModeForMain(code1, code2);
        }
        else {
            allButton.textContent = "대회 전체 모드";
            allButton.onclick = function () {
                connectAsMain(allButton);
            };
            teamButton.textContent = "대회 팀 모드";
            teamButton.onclick = function () {
                connectAsMain(teamButton);
            };
            
            let inputs = document.querySelectorAll(".code-container *");
            inputs.forEach((element) => {
                element.value = "";
                element.disabled = false;
            })
            
            leagueToggle = false;
        }
    }
}

function disconnect() {
    connection.stop();
    switchLeagueModeForMain();
    const audio = new Audio('Sound/메뉴.wav');
    audio.play();
}

const blueCodeInput = document.getElementById("blueCodeInput");

blueCodeInput.addEventListener("keydown", function (event) {
    if (event.key == "Enter") {
        connectAsSub(blueCodeInput);
    }
});

const redCodeInput = document.getElementById("redCodeInput");

redCodeInput.addEventListener("keydown", function (event) {
    if (event.key == "Enter") {
        connectAsSub(redCodeInput);
    }
});

function sendChampions() {
    if (connection.state === signalR.HubConnectionState.Connected) {
        connection.invoke("SendChampionsToSub", newPick, leagueType)
    }
}

function updateRandomChampionsFromMain() {
    let circle, text;

    for (let i = 0; i < 30; i++) {
        if (i < 15) {
            circle = document.getElementById(`team1r${i}`);
            text = document.getElementById(`team1r${i}t`);
        }
        else {
            circle = document.getElementById(`team2r${i - 15}`);
            text = document.getElementById(`team2r${i - 15}t`);
        }

        if (newPick[i] == null) {
            circle.src = ORIGINAL_IMAGE;
            text.textContent = "";
        }
        else {
            circle.src = `Champions/${newPick[i]}.jpg`;
            text.textContent = newPick[i];
        }
    }

    oldPick = [];

    const audio = new Audio('Sound/메뉴.wav');
    audio.play();
}

function clearCard(cardID) { // 엘리먼트의 이미지를 초기화하는 함수
    const image = document.getElementById(cardID);
    image.src = ORIGINAL_IMAGE;
}

function clearCircle(circleID, arrIndex) { // 엘리먼트의 이미지와 텍스트를 초기화하는 함수
    newPick[arrIndex] = undefined; // newPick[arrIndex] 값 초기화

    const circle = document.getElementById(circleID);
    const text = document.getElementById(`${circleID}t`);
    circle.src = ORIGINAL_IMAGE;
    text.textContent = "";
}

function pickChampion(circle) { // 랜덤 챔피언을 누르면 픽 카드에 챔피언을 추가하는 함수
    if (circle.src == ORIGINAL_IMAGE) return;

    let team = ((String)(circle.id).startsWith(TEAM_BLUE_RAND)) ? BLUE : RED; // 해당 함수를 호출한 엘리먼트의 id를 비교해서 팀 설정
    let pickCard;

    for (let i = 0; i < 5; i++) { // 반복문 돌면서 비어있는 픽 카드 탐색
        // 블루팀 픽 카드 or 레드팀 픽 카드
        pickCard = (team == BLUE) ? document.getElementById(TEAM_BLUE_PICK + i) : document.getElementById(TEAM_RED_PICK + i);
        if (pickCard.src == ORIGINAL_IMAGE) {
            pickCard.src = circle.src;
            break;
        }
    }

    const audio = new Audio('Sound/선택.wav');
    audio.play();
}

function clearPick(circle) { // 픽 카드 초기화
    if (circle.src == ORIGINAL_IMAGE) return;

    circle.src = ORIGINAL_IMAGE;

    const audio = new Audio('Sound/제거.wav');
    audio.play();
}

function clearAll() { // 반복문을 돌면서 모든 엘리먼트들을 초기화하는 함수
    for (let i = 0; i < MAX_RAND_CHAMPS; i++) {
        clearCircle(TEAM_BLUE_RAND + i, i); // 블루팀 랜덤 챔피언 초기화
        clearCircle(TEAM_RED_RAND + i, i); // 레드팀 랜덤 챔피언 초기화
    }

    for (let i = 0; i < MAX_PICK_CHAMPS; i++) {
        clearCard(TEAM_BLUE_PICK + i); // 블루팀 픽 카드 초기화
        clearCard(TEAM_RED_PICK + i); // 레드팀 픽 카드 초기화
    }

    for (let i = 0; i < MAX_BAN_CHAMPS; i++) {
        clearCard(TEAM_BLUE_BAN + i); // 밴 초기화
        clearCard(TEAM_RED_BAN + i); // 밴 초기화
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
    for (let i = 0; i < 5; i++) {
        let banCard_blue = document.getElementById(TEAM_BLUE_BAN + i); // 밴 카드 엘리먼트
        let banCard_red = document.getElementById(TEAM_RED_BAN + i); // 밴 카드 엘리먼트

        banCard_blue.src = (ban[i] == undefined) ? ORIGINAL_IMAGE : `Champions/${ban[i]}.jpg`;
        banCard_red.src = (ban[i + 5] == undefined) ? ORIGINAL_IMAGE : `Champions/${ban[i + 5]}.jpg`;
    }
}

function addBan(champIndex) { // ban 배열에 챔피언 추가하는 함수    
    let ban_blue = 0;
    let ban_red = 0;
    let type = 1;

    while (!(ban_blue == ban_red == MAX_BAN_CHAMPS)) {
        if (ban_red < ban_blue) type = 2;
        else if (ban_blue < ban_red) type = 1;

        if (type == 1) {
            if (ban[ban_blue] == undefined) {
                ban[ban_blue] = champ[champIndex];
                break;
            }
            ban_blue++;
        }
        else if (type == 2) {
            if (ban[ban_red + 5] == undefined) {
                ban[ban_red + 5] = champ[champIndex];
                break;
            }
            ban_red++;
        }
    }

    if (ban_red == 5 && ban_blue == 5) return;
    
    updateBan(); // 밴 카드 업데이트
    const audio = new Audio('Sound/선택.wav');
    audio.play();
}

function removeBan(banCard) { // 밴 카드를 눌렀을 때 밴 취소하는 함수
    if (banCard.src == ORIGINAL_IMAGE) return;

    let matches = (banCard.id).match(/\d+/g);

    let index = parseInt(matches[1], 10);

    if (matches[0] == BLUE)
        ban[index] = undefined;

    else if (matches[0] == RED)
        ban[index + MAX_BAN_CHAMPS] = undefined;

    updateBan(); // 밴 카드 업데이트

    const audio = new Audio('Sound/제거.wav');
    audio.play();
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}