//ブロックが落ちるスピード
let game_speed = 500;

//消したラインの数を数えるために変数lineCountを用意
let lineCount = 0;
document.getElementById('lines').innerHTML = lineCount;

//スコアを表示させるために変数scoreCountを用意
let scoreCount = 0;
document.getElementById('score').innerHTML = scoreCount;

//Nextに次のテトロミノを表示させる
let next = document.getElementById('next');


//ブロック1つのサイズ（ピクセル）
const block_size = 30;    //正方形なので値は1つ


// フィールドサイズ(テトラミノの表示可能サイズ)
const field_col = 10;   //横に10ブロック
const field_row = 20;   //縦に20ブロック

// 画面サイズ(ピクセル)
const screen_w = block_size * field_col;    //30 x 10 =300px、画面の横幅
const screen_h = block_size * field_row;    //30 x 20 =600px、画面の高さ

////////////////////////////////////////////////////////////////////////////
// next_fieldサイズ(テトラミノの表示可能サイズ)
const next_fieldsize = 4;   //横に4ブロック、正方形にするので１つだけ指定

// next_field画面サイズ(ピクセル)
const next_screen = block_size * next_fieldsize;    //30 x 4 =120px、画面サイズ
/////////////////////////////////////////////////////////////////////////////////

//テトロミノの表示範囲のサイズ
const tetro_size = 4;   //XとYで同じ値なので1つ(4マス)

//テトラミノの種類
const tetro_types = [   //三次元配列
  [],    //0.空
  [                 //1.I
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  [                 //2.L
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
  ],
  [                 //3.J
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
  ],
  [                 //4.T
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0]
  ],
  [                 //5.O
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
  ],
  [                 //6.Z
    [0, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
  ],
  [                 //7.S
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0]
  ]
];


//テトロミノのカラー
const tetro_color = [
  "#000",     //0.空
 	"#6CF",			//1.水色
	"#F92",			//2.オレンジ
	"#66F",			//3.青
	"#C5C",			//4.紫
	"#FD2",			//5.黄色
	"#F44",			//6.赤
	"#5B5"			//7.緑
];

//フィールドの真ん中からスタートする
const start_x = field_col/2 - tetro_size/2;
const start_y = 0;

//テトロミノの本体を表示する変数
let tetro;
let next_tetro;

//テトロミノの形を指定する変数
let tetro_t;
let next_tetro_t;

//テトロミノの座標（初期値は左上）を指定する変数
let tetro_x = start_x;
let tetro_y = start_y;


//1個目のテトロミノを決定
//三次元配列tetro_typesのインデックスをランダム(1~7)でもつ(配列ではなく値をもつ)
//配列名.lengthでその配列にいくつ入っているかが返ってくる
tetro_t = Math.floor(Math.random() * (tetro_types.length-1) +1);

//変数tetroに三次元配列tetro_typesからtetro_t番目(二次元配列)をtetroにコピー
//tetroは二次元配列を持つ
 tetro = tetro_types[tetro_t];


//フィールド本体
let field =[];    //配列fieldに10x20を持たせたいので二次元配列を作成する為にまず一次元配列を作成

///////////////////////////////
let next_field = [];
//////////////////////////////

let canvas = document.getElementById("canvas");   //HTMLからcanvasのidを取得
let context = canvas.getContext("2d");    //テトロミノを描画する

// canvasに備わっているプロパティを使って高さと幅を指定し、スタイルを使用して枠を表示
canvas.width = screen_w;
canvas.height = screen_h;
canvas.style.border = "4px solid #555";


////////////////////////////////////////////////////////////////////
//Nextに次のテトロミノを表示させる領域を確保
next.width = next_screen;
next.height = next_screen;
next.style.border = "4px solid #555";
let next_context = next.getContext("2d");    //テトロミノを描画する
////////////////////////////////////////////////////////////////////

// //ゲームオーバーフラグ
let over = false;


init();
creat_tetro();
drawField();
drawTetro();

////////////////////////////////////////////////////////////////////////////////
let timeArray = new Array();
timeArray.push( setInterval(dropTetro, game_speed) )  //一定間隔でdropTetroを呼び出すAPI)
//////////////////////////////////////////////////////////////////////////////////


//フィールドの初期化(すべてのマス(10x20)に0を入れる）→二次元配列fieldを作成する
function init()
{
  for (let y=0; y<field_row; y++) {   //二次元配列を作成して、フィールドを初期化
    field[y] = [];                    //配列の階層ごとに初期化しないと値を代入できない
    for (let x=0; x<field_col; x++) {
      field[y][x] = 0;      
    }
  }  
}

//////////////////////////////////////////////////////////////////////////

//2個目以降のテトロミノを用意
function creat_tetro()
{    
  //三次元配列tetro_typesの配列をランダム(1~7)で代入する
  next_tetro_t = Math.floor(Math.random() * (tetro_types.length-1) + 1);
  
  next_tetro = tetro_types[next_tetro_t];   //ランダムのテトロミノ(二次元配列)を配列tetroにコピー

  next_drawTetro();  
}

//次のテトロミノを本体にコピーする
function tetro_copy()
{
  tetro_t = next_tetro_t;
  tetro = next_tetro;   //次のテトロミノを代入

  creat_tetro();
}
//////////////////////////////////////////////////////////////////////////////////////



//ブロック１つを表示する
function drawBlock(x, y, c)
 {
  //座標を指定
  let px = x * block_size;   //px(print x)に
  let py = y * block_size;   //px(print y)に

  context.fillStyle = tetro_color[c];    //ブロックの色
  context.fillRect(px, py, block_size, block_size);//fillRect(x, y, w, h)メソッドは、塗りつぶしの四角形を描く
  context.strokeStyle = "black";    //線の色
  context.strokeRect(px, py, block_size, block_size);  //strokeRect(x, y, w, h)メソッドは、輪郭の四角形を描く
}


///////////////////////////////////////////////

//次のテトロミノのブロックを表示する
function next_drawBlock(x, y, c) 
{
  //座標を指定
  let px = x * block_size;  
  let py = y * block_size;  

  next_context.fillStyle = tetro_color[c];    //ブロックの色
  next_context.fillRect(px, py, block_size, block_size);//fillRect(x, y, w, h)メソッドは、塗りつぶしの四角形を描く
  next_context.strokeStyle = "black";    //線の色
  next_context.strokeRect(px, py, block_size, block_size);  //strokeRect(x, y, w, h)メソッドは、輪郭の四角形を描く
}
/////////////////////////////////////////////////



//フィールドにブロックを表示
function drawField() {  

  context.clearRect(0, 0, screen_w, screen_h);    //画面をクリアにして動作前のテトラミノを削除する

  for (let y=0; y<field_row; y++) {    //Y方向(縦）0～19

    for (let x=0; x<field_col; x++) {    //X方向(横）0～9

      if (field[y][x]) {    //二次元配列filedが1を返せば(条件式に==1や!=0と記入してもよい（何も記載しなくても同じ意味になるため))
       
        drawBlock(x, y, field[y][x]) ;        //フィールドにブロックを表示    
        //field[y][x]はfixTetro()でtetro_tの値を代入しているのでtetro_color[]の指定ができる    
      }
      
    }  
  }  
}


///////////////////////////////////////////////////////////////////////////////////////

//次のテトロミノを表示
function next_drawTetro()
 {  
  next_context.clearRect(0, 0, next_screen, next_screen);    //画面をクリアにして動作前のテトラミノを削除する
  for (let y=0; y<tetro_size; y++) {    

    for (let x=0; x<tetro_size; x++) {   

      if (next_tetro[y][x]) { 
      
        next_drawBlock(x, y, next_tetro_t) ;        //フィールドにブロックを表示        
      } 
    } 
  }   
}
////////////////////////////////////////////////////////////////////////////////////



//テトロミノの表示
function drawTetro()
 {     
  for (let y=0; y<tetro_size; y++) {    //Y方向(縦）0~3

    for (let x=0; x<tetro_size; x++) {    //X方向(横）0~3

      if (tetro[y][x]) {    //二次元配列tetroが1を返せば
              
        drawBlock(tetro_x + x, tetro_y + y, tetro_t) ;   //ブロックを表示
        //引数tetro_tにはランダムで返した値が入っているのでtetro_color[]の指定ができる
      }      
    }  
  }
  

  
  //ゲームオーバーのフラグが立ったらGAME OVERと表示する
  if(over)
  {
    let s = "GAME OVER";
    context.font = "40px 'MS ゴシック'";
    let w = context.measureText(s).width;
    let x = screen_w/2 - w/2;
    let y = screen_h/2 - 20;
    context.lineWidth = 4;
    context.strokeText(s,x,y);
    context.fillStyle = "white";
    context.fillText(s,x,y);
  }
}


//テトロミノが自動で落ちてくる処理
function dropTetro()
{  
  if(over) 
  {
    clearInterval(timeArray.shift());
    return;    //ゲームオーバーフラグが立ったら処理を行わない
  }

  if (checkMove(0, 1))  //ブロックが下に移動できるかどうか
  { 
    tetro_y++;   //下矢印キーを押したときと同じ処理
  } else
  {
    fixTetro(); //落ちてきたブロックを固定する関数の呼び出し
    checkLine();  //ラインがそろったら消す関数の呼び出し

    // //2個目以降のテトロミノを用意
    // //三次元配列tetro_typesの配列をランダム(1~7)で代入する
    // next_tetro_t = Math.floor(Math.random() * (tetro_types.length-1) + 1);
    
    // next_tetro = tetro_types[next_tetro_t];   //ランダムのテトロミノ(二次元配列)を配列tetroにコピー

    // tetro_t = next_tetro_t;
    // tetro = next_tetro;   //次のテトロミノを代入

    // next_drawTetro();
    
    tetro_copy();
  

    tetro_x = start_x;    //次に落ちてくるテトロミノの座標を初期化
    tetro_y = start_y;    //次に落ちてくるテトロミノの座標を初期化

    //新しいテトロミノ(座標の初期値)が動けなかったらゲームオーバーの処理をする
    if (!checkMove(0, 0)) 
    {
      over = true;
    }

  }
  drawField();
  drawTetro(); 

}

//テトロミノを固定する処理
function fixTetro()
{
   for (let y=0; y<tetro_size; y++) {    //Y方向(縦）0~3

    for (let x=0; x<tetro_size; x++) {    //X方向(横）0~3

      if (tetro[y][x]) {    //二次元配列tetroが1を返せば
         
        field[tetro_y + y][tetro_x + x] = tetro_t;    //現在の座標でブロックを表示する                
      }      
    }  
  }  
}


//ラインがそろったかチェックして消す
function checkLine()
{
  for (let y=0; y<field_row; y++)   //フィールドの高さ(0~19)
  {  
    let flag = true;  //各ラインごとに変数flagをもつ
   
    for (let x=0; x<field_col; x++)   //フィールドの幅(0~9)
    { 
      //ラインにブロックがそろっていないときに下記のif分を実行し、yのループに戻る
      if (!field[y][x])  //横から順に調べた際に0が返ってきたらラインがそろっていないので
      {
        flag = false;   //変数flagにfalseを返してxのループを抜ける
        break;
      }      
    }  

    //全部のflagがtureのとき(ラインにブロックがすべてある状態)
    if(flag)
    {   //ラインを消す処理
      lineCount++;    //変数lineCountを加算
          
      //そろったラインの上の行を一段下げる(=そろったラインを消す)
      for(let newY = y; newY > 0; newY--)
      {
        for(let newX = 0; newX < field_col; newX++)
        {
          //上の行をfield[newY][newX]に代入する
          field[newY][newX] = field[newY - 1][newX];
        }
      }
      //スピードアップ判定
      speed_Up();
    }
  }
  //ラインを消した数を表示する 
  document.getElementById('lines').innerHTML = lineCount;

  //scoreを計算、表示させる
  scores();

}


function scores()
{  
  scoreCount = lineCount * 100;
  document.getElementById('score').innerHTML = scoreCount; 
}

//////////////////////////////////////////////////////////////////////////////////

//LineCoutが10の倍数になったらスピードアップ
function speed_Up()
{
  if (lineCount > 9)  //LineCout0~9は処理を行わない
  {
    if ((lineCount % 10) == 0)  //10で割り切れたら処理を行う
    {
      clearInterval(timeArray.shift());  //配列内の繰り返し処理を止める
      game_speed = game_speed -100;
      timeArray.push( setInterval(dropTetro, game_speed) ); //再度配列に繰り返し処理を入れる
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////


//ブロックの移動(キーボードが押されたときの処理)
document.addEventListener('keydown', function(e) {

  if(over) return;    //ゲームオーバーフラグが立ったら処理を行わない

  switch(e.code) {
    case 'ArrowLeft':   //左矢印キーが押されたとき
      if (checkMove(-1, 0))     //checkMoveが真なら移動する、移動先(行きたい先)の座標を引数で渡す（左移動なのでXはマイナス、Yはそのまま（checkMove(-1, 0)としてもよい)）
      tetro_x--;        //座標を左方向へ移動
      break;

    case 'ArrowUp':   //上矢印キーが押されたとき
    if (checkMove(0, -1)) 
      tetro_y--;      //座標を上方向へ移動
      break;

    case 'ArrowRight':    //右矢印キーが押されたとき
    if (checkMove(1, 0)) 
      tetro_x++;          //座標を右方向へ移動
      break;

    case 'ArrowDown':   //下矢印キーが押されたとき    
    if (checkMove(0, 1)) 
    tetro_y++;        //座標を下方向へ移動
      break;
    

    case 'Space':       //スペースキーが押されたとき
      let ntetro = rotate();  //ratate()で帰ってきた座標を代入
      if (checkMove(0, 0, ntetro))   
      tetro = ntetro;   //ブロックを回転
      break;
  }

  drawField();
  drawTetro();    //移動したら改めてブロックを表示する
})


// テトロミノの回転
function rotate()
{  
  let ntetro = [];  //回転後のテトロミノの配列

  for (let y=0; y<tetro_size; y++)
  {
    ntetro[y] = [];
    for (let x=0; x<tetro_size; x++)
    {
      ntetro[y][x] = tetro[tetro_size - x - 1][y];
      // 二次元配列tetroが右に90度回転した時の座標をntetroに代入
    }   
  }  
  return ntetro;
  
}

 //テトロミノの4x4範囲にブロックがあるかどうかまたは
 //フィールドの範囲からはみ出ないように判定する
function checkMove( mx,my,ntetro )  
{   //mx(move x)とmy(move y)は移動する分のマスの数を受け取る(キーボード入力からの処理)
    //ntetroは回転後のテトロミノの配列

 if (ntetro == undefined) ntetro = tetro;    //引数のntetroがなかったら現在の座標を代入

	for(let y=0; y<tetro_size ; y++ )
	{
   		for(let x=0; x<tetro_size ; x++ )
		{           
      if(  ntetro[y][x]  )   //テトロミノ表示領域(4x4)にブロックがあるとき(テトロミノ描画)
			{
        let nx = tetro_x + x + mx;    //tetro_x+xは現在の座標 +mxは新しい座標を表す
        let ny = tetro_y + y + my;    //tetro_y+yは現在の座標 +myは新しい座標を表す
        
        
        //衝突判定
				if( ny < 0 ||           //枠の上に飛び出ないように
					nx < 0 ||             //枠の左に飛び出ないように
					ny >= field_row ||    //枠の下に飛び出ないように
					nx >= field_col ||    //枠の右に飛び出ないように
					field[ny][nx] )       //フィールドの新しい位置(?)にブロックがあれば
				{         
					return false;   //テトロミノを動かせない
				}
			}
		}
	}
	return true;
}

