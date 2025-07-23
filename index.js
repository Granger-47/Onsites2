const canvas = document.getElementById('fgCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const c = canvas.getContext('2d');
 

let screenX = window.innerWidth;
let screenY = window.innerHeight;

const zoro = new Image();
zoro.src = './img/zoro.jpg'

let n = parseInt(prompt("Enter puzzle grid size (e.g., 3 for 3x3, 4 for 4x4):"), 10);
if (isNaN(n) || n < 2 || n > 10) {
    alert("Invalid input! Setting default to 3x3.");
    n = 3;
}

zoroArray = [];
const tileRows = n;
const tileCols = n;

const destTileWidth = screenY/n - 10;  
const destTileHeight = screenY/n - 10;

const startX = (canvas.width - destTileWidth * n) / 2;
const startY = (canvas.height - destTileHeight * n) / 2;

    let copy = [];
    for (let i = 0; i < n; i++) {
        copy.push([]);
        for (let j = 0; j < n; j++) {
            copy[i][j] = i * n + j + 1;
        }
    }
    copy[n-1][n-1] = 0;
    let numberOfShuffles = n*100;
    let pos = [n - 1, n - 1];
    
    for(i=0;i<numberOfShuffles;i+=1){
        shuffleOnce();
    }
    let random = [];
    for(i=0;i<n;i+=1){
        for(j=0;j<n;j+=1){
            random.push(copy[i][j]);
        }
    }
    console.log(copy);
let basedpos;

function shuffleOnce(){
    let x = pos[0];
    let y = pos[1];
    let possibleMoves = [[x-1,y],[x,y-1],[x+1,y],[x,y+1]];
    let finalPossibleMoves = [];
    possibleMoves.forEach((item)=>{
        let x1 = item[0]; 
        let y1 = item[1];
        if(x1<n && x1>=0 && y1<n && y1>=0){
            finalPossibleMoves.push([x1,y1]);
        }
    });
    let move = finalPossibleMoves.at(Math.random()*finalPossibleMoves.length);
    let x1 = move[0];
    let y1 = move[1];
    copy[x][y] = copy[x1][y1];
    copy[x1][y1] = 0;
    pos = [x1,y1];
}

function drawPieceOfImage(arr,index,posx,posy){
    let data = arr[index];
    let zoro = data[0];
    let sx = data[1];
    let sy = data[2];
    let dx = posx;
    let dy = posy;
    let srcTileWidth = data[3];
    let srcTileHeight = data[4];
    let destTileWidth = data[7];
    let destTileHeight = data[8];
    c.drawImage(zoro,sx, sy, srcTileWidth, srcTileHeight, dx, dy, destTileWidth, destTileHeight);
    c.strokeStyle = 'black';
    c.lineWidth = 3;
    c.strokeRect(dx, dy, destTileWidth, destTileHeight);
    c.fillStyle = 'white';
    c.font = '20px Arial';
    c.textBaseline = 'bottom';
    c.fillText(index + 1, dx + 10, dy + destTileHeight - 10); 
}
zoro.onload = function () {
    const srcTileWidth = zoro.width / tileCols;
    const srcTileHeight = zoro.height / tileRows;

    
    for (let row = 0; row < tileRows; row++) {
        for (let col = 0; col < tileCols; col++) {
            const sx = col * srcTileWidth;
            const sy = row * srcTileHeight;

            const dx = startX + col * destTileWidth;
            const dy = startY + row * destTileHeight;

            zoroArray.push([zoro,
                sx, sy, srcTileWidth, srcTileHeight, 
                dx, dy, destTileWidth, destTileHeight,row,col]);
        }
    }
    c.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const tileValue = copy[i][j]; 
            if (tileValue === 0) continue; 

            const tileIndex = tileValue - 1; 
            const dx = startX + j * destTileWidth;
            const dy = startY + i * destTileHeight;

            drawPieceOfImage(zoroArray, tileIndex, dx, dy);
        }
    }
    

};


function checkforWin(){
    if(compareArray()){
        setTimeout(()=>{
            alert('You win');
            location.reload();
          }, 20);
        
    }
}

function compareArray(){
    let ideal = [];
    for (let i = 0; i < n; i++) {
        ideal.push([]);
        for (let j = 0; j < n; j++) {
            ideal[i][j] = i * n + j + 1;
        }
    }
    ideal[n-1][n-1] = 0;
    console.log('ideai is', ideal);
    for(i=0;i<n;i+=1){
        for(j=0;j<n;j+=1){
            if(copy[i][j]!=ideal[i][j]){
                return false;
            }
        }
    }
    return true;
}



window.addEventListener('click',(e)=>{
    let distFromStartX = e.x - startX;
    let distFromStartY = e.y - startY;
    let e2 = Math.floor(distFromStartX/destTileWidth);
    let e1 = Math.floor(distFromStartY/destTileHeight);
    let x = pos[0];
    let y = pos[1];
    let valid = ((e2==y )&&(e1-x==1 || e1-x == -1))|| ((e1==x)&&(e2-y==1 || e2-y == -1))
    if(valid){
        copy[x][y] = copy[e1][e2];
        copy[e1][e2] = 0;
        pos = [e1,e2];
        c.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < n; i += 1) {
            for (let j = 0; j < n; j += 1) {
                let index = n * i + j;
                let num = copy[i][j];
                if (num !== 0) {
                    drawPieceOfImage(zoroArray, num - 1, startX + j * destTileWidth, startY + i * destTileHeight);
                }
            }
        }
        checkforWin();
    }
})


window.addEventListener('resize', () => {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
