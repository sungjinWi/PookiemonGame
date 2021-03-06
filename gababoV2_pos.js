/*

*/

class Tile {
    constructor(left, top, right, bottom, color, mon) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.color = color;
        this.mon = mon;
    }

    draw(){
            context.rect(this.left, this.top, tileWidth, tileHeight); 
            context.fillStyle = this.color;
            
            context.fill();
    }
 
}

let canvas = document.getElementById("myCanvas");

const context = canvas.getContext("2d");

let rsp = document.getElementById("rspGame")

// 가위바위보 관련
let userWeapon = 0;
let monWeapon = 0;
let buttons = [];
buttons = [...(document.getElementsByClassName("Weapons"))] 
// getElementsByClassName은 array가 아니다 => Array.from 또는 ...으로 배열로 바꾸기 가능

// 지갑 및 HP
let myWallet = 0;
let hp = 5;


// monster 관련
let meetMon = false;

// player 관련
const arcRadius = 15;
let arcPosX = 20;
let arcPosY = 20;
let arcMvSpd = 40;

let player = {
    left : 0, right : 0, top : 0, bottom : 0
};

// 맵 관련
const tileWidth = 39; 
const tileHeight = 39; 
const tileColumn = 10;
const tileRow = 10;
let tiles; // 벽돌 전체

let exit;
let exitIndex=[];

let store;
let storeIndex=[];

let exitIndexX
let exitIndexY
let storeIndexX
let storeIndexY


// game start여부
let isMoving = true;

// 키처리 함수 추가
document.addEventListener("keydown", keyDownEventHandler);
document.addEventListener("keyup", keyUpEventHandler);

// 가위바위보 버튼 누를 시 // onclick 아니라 click
buttons.forEach((button)=> button.addEventListener("click", isRspWin))

// player position 변경
function setPlayerPos()
{
    player.left = arcPosX - arcRadius;
    player.right = arcPosX + arcRadius;
    player.top = arcPosY - arcRadius;
    player.bottom = arcPosY + arcRadius;
}

// 움직일 때마다 랜덤 확률
// > TODO : 클리어할 때 몬스터를 만나지 않으려면 어떻게 할까?
function meetRate() 
{   
    setPlayerPos();
    if(checkToWin()){
        return false;
    }
    meetMon = (Math.round(Math.random()*10)) < 2;
    
    if(meetMon) {
        isMoving = false;
        for(let i = 0; i < tileRow; i++)
        {
            for(let j =0; j < tileColumn; j++)
            {
                if(isCollisionRectToRect(player, tiles[i][j]))
                alert(`met ${tiles[i][j].mon}`);
            }
        }
        
        return true; //형식 맞춰주기
    };
}



// 가바보 게임 승패 결정
// 바위 0 가위 1 보 2
function isRspWin()
{   
    console.log(isMoving)
    userWeapon = this.value;
    
    monWeapon = Math.floor(Math.random()*3);
    switch((userWeapon - monWeapon + 3) % 3){
        case 0 : 
            alert("비겼으니 retry");
            return false;
        case 1 :
            alert("lose");
            hp --;
            if(hp == 0){
                location.reload();
                alert("game over")
            }
            
            break;
        case 2 :
            alert("win");
            myWallet += Math.floor(Math.random()*99)
    }
    
    isMoving = true;
    
}

function keyDownEventHandler(e) 
{   
   if(isMoving)
   {
        if(e.key === "ArrowRight" && arcPosX < canvas.width - arcRadius - tileWidth)
        {
            // 플레이어를 오른쪽으로 이동
            arcPosX+= arcMvSpd;
            meetRate();
        }
        else if(e.key === "ArrowLeft" && arcPosX - arcRadius - tileWidth > 0)
        {
            // 플레이어를 왼쪽으로 이동
            arcPosX -= arcMvSpd;
            meetRate();
        }
        else if(e.key === "ArrowUp" && arcPosY - arcRadius - tileHeight > 0)
        {
            arcPosY -= arcMvSpd;
            meetRate();
        }
        else if(e.key === "ArrowDown" && arcPosY < canvas.width - arcRadius - tileHeight)
        {
            arcPosY += arcMvSpd;
            meetRate();
        }

   }
}

function keyUpEventHandler()
{

}

function update() 
{
    // 데이터 수정 
    // 플레이어의 위치 이동, 지갑 및 hp update

    document.getElementById("wallet").innerHTML = myWallet;
    document.getElementById("hp").innerHTML = hp;

    if(!isMoving) {
        rsp.style.visibility = "visible";
    }
    else{
        rsp.style.visibility = "hidden";
    }

    // 게임 클리어 확인
    // checkToWin() -> meetRate에 조건으로 합쳐버림

}


function isCollisionRectToRect(rectA,rectB)
{
    if (rectA.left > rectB.right ||
        rectA.right < rectB.left ||
        rectA.top > rectB.bottom ||
        rectA.bottom < rectB.top)
        {
            return false;
        }
    return true;
}

function checkToWin()
{
    if(isCollisionRectToRect(player, exit)){
        location.reload();
        alert("clear");
        return true
    }
    return false
}


function draw() 
{
    // 화면 클리어
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawCanvas();

    // 다른 도형 그리기 

    drawTiles();
    drawArc();
}

function drawCanvas() 
{
    context.beginPath();

    context.rect(0, 0, 400, 400); 
    context.fillStyle = "lightgray";
    context.fill();
    
    context.closePath();
}

function drawTiles() 
{
    for(let i = 0; i < tileRow; i++)
    {
        for(let j =0; j < tileColumn; j++)
        {
            context.beginPath();
            tiles[i][j].draw()
            context.closePath();
        }
    }
}

function drawArc() 
{
    context.beginPath();

    context.arc(arcPosX, arcPosY, arcRadius, 0 , 2 * Math.PI,);
    context.fillStyle = "red";
    context.fill();

    context.closePath();
}

function setTiletype()
{
    let ranNum = Math.floor(Math.random()*4);
    switch(ranNum){
        case 0 : return {color:"lightcyan", mon:"Gogidong BigFoot"}
        case 1 : return {color:"tan", mon:"MoraeDoozi"}
        case 2 : return {color:"darkgreen", mon:"Butterfl"} 
        case 3 : return {color:"darkblue", mon:"Ggobugi"}
        default : return {color:"gold", mon:"Legend"}
    }
}

function setTiles() 
{
    tiles = [];
    for(let i = 0; i < tileRow; i++)
    {
        tiles[i] = [];
        for(let j =0; j < tileColumn; j++)
        {
            let mapInfo = setTiletype()
            tiles[i][j] = new Tile( j * (tileWidth + 1),
            i  * (tileHeight + 1),
            j * (tileWidth + 1) + tileWidth,
            i * (tileHeight + 1) + tileHeight,
            mapInfo.color,
            mapInfo.mon
            )
        }
    }
}

function setSpecialTile()
{   
    while(JSON.stringify(exitIndex) == JSON.stringify(storeIndex) || JSON.stringify(exitIndex) == "[0,0]" || JSON.stringify(storeIndex) =="[0,0]")
    {
        exitIndex = createRandomIndex();
        storeIndex = createRandomIndex();
    }
    exitIndexX = exitIndex[0]
    exitIndexY = exitIndex[1]
    storeIndexX = storeIndex[0]
    storeIndexY = storeIndex[1]

    console.log(exitIndex)
    console.log(storeIndex)

    exit = tiles[exitIndexY][exitIndexX] = new Tile( exitIndexX * (tileWidth + 1),
    exitIndexY  * (tileHeight + 1),
    exitIndexX * (tileWidth + 1) + tileWidth,
    exitIndexY * (tileHeight + 1) + tileHeight,
    "black"
    )

    store = tiles[storeIndexY][storeIndexX] = new Tile( storeIndexX * (tileWidth + 1),
    storeIndexY  * (tileHeight + 1),
    storeIndexX * (tileWidth + 1) + tileWidth,
    storeIndexY * (tileHeight + 1) + tileHeight,
    "rebeccapurple",
    )
    console.log(tiles)
}

function createRandomIndex()
{
    let randomIndex = [];
    let randomIndexX = Math.floor(Math.random()*10)
    while(randomIndexX==10)
    {
        randomIndexX = Math.floor(Math.random()*10)
    }
    let randomIndexY = Math.floor(Math.random()*10)
    while(randomIndexY==10)
    {
        randomIndexY = Math.floor(Math.random()*10)
    }
    randomIndex = [randomIndexX, randomIndexY];
    return randomIndex;
}

setTiles();
setSpecialTile();

setInterval(draw, 10);
setInterval(update, 10);