class Tile {
    constructor(iX, iY, color, mon) {
        this.iX = iX;
        this.iY = iY;
        this.color = color;
        this.mon = mon;
        this.mapType = "normal";
        this.isSight = 0;
    }

    draw(){
        // context.beginPath();
        // context.rect(this.iX * (tileHeight + 1), this.iY  * (tileWidth + 1), tileWidth, tileHeight);
        // context.fillStyle = checkSight(this)
        // context.fill();
        // context.closePath();
        if(this.mapType != "normal")
        {
            context.beginPath();
            context.font = '48px serif';
            context.fillText('Hello world', this.iX * (tileHeight + 1), this.iY  * (tileWidth + 1));
            context.closePath();
        }
    }
}

class Player extends Tile {
    draw(){
        context.beginPath();
        context.arc((player.iX + 0.5) * (tileWidth + 1) , (player.iY + 0.5)  * (tileWidth + 1), playerRadius, 0 , 2 * Math.PI,);
        context.fillStyle = "red";
        context.fill();
        context.closePath();
    }
}

let canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

let rsp = document.getElementById("rspGame")

// 가위바위보 관련
let userWeapon = 0;
let monWeapon = 0;
let buttons = [];
buttons = [...(document.getElementsByClassName("Weapons"))];
// getElementsByClassName은 array가 아니다 => Array.from 또는 ...으로 배열로 바꾸기 가능

// 지갑 및 HP
let myWallet = 0;
let hp = 5;

// monster 관련
let meetMon = false;

// player 관련
let player = {iX : 0, iY : 0};
const playerRadius = 15;
let playerIX = 0;
let playerIY = 0;

// 맵 관련
const tileWidth = 39;
const tileHeight = 39;
const tileColumn = 10;
const tileRow = 10;
let tiles; // 벽돌 전체

let exit;
let exitIndex;
let exitIX;
let exitIY;

let store;
let storeIndex;
let storeIX;
let storeIY;


// game start여부
let isMoving = true;


// 키처리 함수 추가
document.addEventListener("keydown", keyDownEventHandler);


// 가위바위보 버튼 누를 시 // onclick 아니라 click
buttons.forEach((button)=> button.addEventListener("click", isRspWin))


function checkToWin()
{
    if(is2DIndexSame(player, exit)){
        location.reload();
        alert("clear");
        return true
    }
    return false
}

// 움직일 때마다 랜덤 확률
// > TODO : 클리어할 때 몬스터를 만나지 않으려면 어떻게 할까? ->키누를 때 클리어먼저 판별 if(checkTowin) return false
function meetRate() 
{   
    if(checkToWin()){
        return false;
    }
    if(tiles[player.iX][player.iY].mapType == "store"){
        if(myWallet<50)
        {
            alert("50G이상 필요")
        }
        else
        {
            if(confirm("50G를 소모하여 체력회복?")){
                hp++;
                myWallet -= 50;
                alert("체력회복됨")
            } 
        }
        
        return false
    }
    meetMon = (Math.round(Math.random()*10)) < 2;
    
    if(meetMon) {
        isMoving = false;
        for(let i = 0; i < tileRow; i++)
        {
            for(let j =0; j < tileColumn; j++)
            {
                if(is2DIndexSame(player, tiles[i][j]))
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
        
        if(e.key === "ArrowRight" && player.iX < 9)
        {
            // 플레이어를 오른쪽으로 이동
            player.iX ++;
            meetRate();
        }
        else if(e.key === "ArrowLeft" && player.iX >0 )
        {
            // 플레이어를 왼쪽으로 이동
            player.iX--;
            meetRate();
        }
        else if(e.key === "ArrowUp" && player.iY > 0)
        {
            player.iY--;
            meetRate();
        }
        else if(e.key === "ArrowDown" && player.iY <9)
        {
            player.iY++;
            meetRate();
        }
   }
}

function update() 
{
    // 데이터 수정 
    // 지갑 및 hp update

    document.getElementById("wallet").innerHTML = `GOLD : ${myWallet}G`;
    document.getElementById("hp").innerHTML = `HP : ${hp}`;

    if(!isMoving) {
        rsp.style.visibility = "visible";
    }
    else{
        rsp.style.visibility = "hidden";
    }

    updateSight()
}


function is2DIndexSame(tileA,tileB)
{
    if (tileA.iX == tileB.iX &&
        tileA.iY == tileB.iY)
        {
            return true;
        }
    return false;
}

function draw() 
{
    // 화면 클리어
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawCanvas();

    // 다른 도형 그리기 

    drawTiles();
    player.draw();
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
            tiles[i][j].draw()
        }
    }
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
            tiles[i][j] = new Tile( 
                i,
                j,
                mapInfo.color,
                mapInfo.mon
            )
        }
    }
}

function setPlayer()
{
    player = new Player(playerIX,playerIY,"red")
}

function setSpecialTile()
{   
    while(JSON.stringify(exitIndex) == JSON.stringify(storeIndex) || JSON.stringify(exitIndex) == "[0,0]" || JSON.stringify(storeIndex) =="[0,0]")
    {
        exitIndex = createRandomIndex();
        storeIndex = createRandomIndex();
    }
    exitIX = exitIndex[0]
    exitIY = exitIndex[1]
    storeIX = storeIndex[0]
    storeIY = storeIndex[1]

    console.log(exitIndex)
    console.log(storeIndex)

    exit = tiles[exitIX][exitIY] = new Tile( 
        exitIX,
        exitIY,
        "black"
    )

    store = tiles[storeIX][storeIY] = new Tile( 
        storeIX,
        storeIY,
        "rebeccapurple",
    )

    store.mapType = "store"
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

function checkSight(tile)
{
    if(!tile.isSight)
    {
        return "black";
    }
    else if(closeToPlayer(tile) && tile.isSight)
    {
        return tile.color;
    }
    else if(!closeToPlayer(tile) && tile.isSight)
    {
        return "gray"
    } 
}

function closeToPlayer(tile)
{
    if(Math.abs(player.iX - tile.iX) <=1 && Math.abs(player.iY - tile.iY) <=1 )
    {
        return true;
    }
    return false;
}

function updateSight()
{
    for(let i = 0; i < tileRow; i++)
    {
        for(let j =0; j < tileColumn; j++)
        {
            if(closeToPlayer(tiles[i][j]))
            {
                tiles[i][j].isSight = 1
            }
            
        }
    }
}

setTiles();
setSpecialTile();
setPlayer();
setInterval(draw, 10);
setInterval(update, 10);