'use strict';
// 変数名,関数名: キャメルケース、関数名は動詞または、動詞+目的語とする, 定数名: 全て大文字で、単語ごとに_で区切る

const START_BUTTON = document.getElementById('start_button');               //game startボタン
const CONTINUE_BUTTON = document.getElementById('continue_button');         //continueボタン
const GAME_TABLE = document.getElementById('game_table');                   //ゲームテーブル
const DEALER_CARD_AREA = document.getElementById('dealer_card_area');       //ディーラーカードエリア
const PLAYER_CARD_AREA = document.getElementById('player_card_area');       //プレイヤーカードエリア
const DEALER_POINT_FIELD = document.getElementById('dealer_point_field');   //ディーラーのポイント表示エリア
const PLAYER_POINT_FIELD = document.getElementById('player_point_field');   //プレイヤーのポイント表示エリア
const COMMENTARY = document.getElementById('commentary');                   //解説テキスト
const HIT_BUTTON = document.getElementById('hit_button');                   //HITボタン
const STAND_BUTTON = document.getElementById('stand_button');               //STANDボタン


const DECK = [];              //カードのデッキ
const DEALER_CARDS = [];      //ディーラーの手札
const PLAYER_CARDS = [];      //プレイヤーの手札
let dealerPointSum = 0;       //ディーラのポイントの合計
let playerPointSum = 0;       //プレイヤーのポイントの合計


//カードの作成
const createCards = () => {

    //number(1~13の数字)にスートを追加する
    const addSuit = (number) => {
        for (let i = 1; i < 5; i++) {
            let card;
            if (i === 1) {
                card = `❤︎${number}`;
            } else if (i === 2) {
                card = `♦︎${number}`;
            } else if (i === 3) {
                card = `♠︎${number}`;
            } else if (i === 4) {
                card = `♣︎${number}`;
            }
            DECK.push(card);
        }
    };

    //関数addSuitを呼び出し、カードを作成
    for (let i = 1; i < 14; i++ ) {
        addSuit(i);
    };

    //カードのシャッフル
    for (let i = 1; i < 100; i++) {
        let randumNumber1 = Math.floor(Math.random() * 52);
        let randumNumber2 = Math.floor(Math.random() * 52);
        [DECK[randumNumber1], DECK[randumNumber2]] = [DECK[randumNumber2], DECK[randumNumber1]];
    };
}


//ディーラーの手札計算
const calculateDealerPoint = () => {
    dealerPointSum = 0;
    let tempDealerPointSumN = 0;    //仮の合計ポイント(数字をそのまま計算した合計)
    let tempDealerPointSumS = 0;    //仮の合計ポイント(カードの数字が1の場合を考慮して計算した合計)

    //計算をする
    DEALER_CARDS.forEach(function(value) {
        let num = Number(value.replace(/[❤♦︎♠︎♣︎]/g, ''));

        //カードの数字が10以上であれば、ポイントは全て10にする
        (num >= 10) ? num = 10 : num;

        //数字をそのまま足す計算
        tempDealerPointSumN += num;

        //カードの数字が1の場合の処理の計算
        (num === 1 && tempDealerPointSumS < 11) ? num = 11 : num;
        tempDealerPointSumS += num;
    });

    //tempDealerPointSumNかtempDealerPointSumSのどちらを最終的なポイントとするかを決める
    (tempDealerPointSumS < 22) ? dealerPointSum = tempDealerPointSumS : dealerPointSum = tempDealerPointSumN;
    
    //計算してでた結果を表示
    DEALER_POINT_FIELD.textContent = `??`;
    DEALER_POINT_FIELD.classList.add('fade-in');
}


//プレイヤーの手札計算
const calculatePlayerPoint = () => {
    playerPointSum = 0;
    let tempPlayerPointSumN = 0;    //仮の合計ポイント(数字をそのまま計算した合計)
    let tempPlayerPointSumS = 0;    //仮の合計ポイント(カードの数字が1の場合を考慮して計算した合計)

    //計算をする
    PLAYER_CARDS.forEach(function(value) {
        let num = Number(value.replace(/[❤︎♦︎♠︎♣︎]/g, '')); 

        //カードの数字が10以上であれば、ポイントは全て10にする
        (num >= 10) ? num = 10 : num;

        //数字をそのまま足す計算
        tempPlayerPointSumN += num;

        //カードの数字が1の場合の処理の計算
        (num === 1 && tempPlayerPointSumS < 11) ? num = 11 : num;
        tempPlayerPointSumS += num; 
    });

    //tempPlayerPointSumNかtempPlayerPointSumSのどちらを最終的なポイントとするか決める
    (tempPlayerPointSumS < 22) ? playerPointSum = tempPlayerPointSumS : playerPointSum = tempPlayerPointSumN;

    //計算してでた結果を表示
    PLAYER_POINT_FIELD.textContent = playerPointSum;
    PLAYER_POINT_FIELD.classList.add('fade-in');
}


//カード2枚の配布
const distributeTwoCards = () => {

    //ディーラーにカード2枚を配布
    for (let i = 0; i < 2; i++) {
        let elem = document.createElement('div');
        elem.className = 'card fade-in';
        if (i === 0) {
            let card = DECK.pop();
            DEALER_CARDS.push(card);
            elem.textContent = card;
            DEALER_CARD_AREA.appendChild(elem);
        } else {
            DEALER_CARDS.push(DECK.pop());
            elem.classList.add('back-card');
            DEALER_CARD_AREA.appendChild(elem);
        }
    };

    //プレイヤーにカード2枚を配布
    for (let i = 0; i < 2; i++) {
        let elem = document.createElement('div');
        elem.className = 'card fade-in';
        let card = DECK.pop();
        PLAYER_CARDS.push(card);
        elem.textContent = card;
        PLAYER_CARD_AREA.appendChild(elem);
    };

    //ディーラーとプレイヤーの手札を計算
    calculateDealerPoint();
    calculatePlayerPoint();    

     //HIT, STANDボタンの有効化
    HIT_BUTTON.disabled = false;
    STAND_BUTTON.disabled = false;

    //解説の表示
    COMMENTARY.textContent = `HITまたはSTANDボタンを押してください。`;
    COMMENTARY.classList.add('fade-in');
}


//game startボタンをクリックでイベント発生
START_BUTTON.addEventListener('click', function() {

    //game startボタンを非表示
    this.disabled = true;
    this.classList.add('fade-out');

    //ゲームテーブルのopacityを1にする
    GAME_TABLE.classList.add('opacity-change');

    //関数createCardsを呼び出しデッキを作成
    createCards();  

    //2秒後に関数distributeTwoCardsを呼び出しディーラ、プレイヤーにカード2枚を配布
    setTimeout(distributeTwoCards, 2000); 

}, false);


//プレイヤーにカード1枚を配布
const distributePlayerCard = () => {
    let card = DECK.pop();
    PLAYER_CARDS.push(card);
    let elem = document.createElement('div');
    elem.className = 'card fade-in';
    elem.textContent = card;
    PLAYER_CARD_AREA.appendChild(elem);

    //プレイヤーの手札を計算
    calculatePlayerPoint();

    //プレイヤーのポイントが21を超え、バーストした場合
    if (playerPointSum > 21) {

        //HITボタン、STANDボタンを無効化
        HIT_BUTTON.disabled = true;
        STAND_BUTTON.disabled = true;

        COMMENTARY.textContent = 'BUSTEDしたためプレイヤーの負けです。'

        //4秒後にcontinueボタンを表示
        setTimeout(() => {
            let hidden = CONTINUE_BUTTON.classList.contains('hidden');
            if (hidden) {
                CONTINUE_BUTTON.classList.remove('hidden');
            }

            CONTINUE_BUTTON.classList.replace('fade-out', 'fade-in-move');
            CONTINUE_BUTTON.disabled = false;
        }, 4000);
    };
};


//ディーラーにカードを1枚配布
const distributeDealerCard = () => {

    //HITボタン、STANDボタンを無効化
    HIT_BUTTON.disabled = true;
    STAND_BUTTON.disabled = true;

    let hitNum = 0;     //ディーラーが何回HITしたかを数える変数

    //ディーラーのポイントが17より小さければHITを繰り返し、17以上であればSTANDを実行
    for (let i = 0; i < 1; i++) {
        if (dealerPointSum < 17) {
            DEALER_CARDS.push(DECK.pop());
            let elem = document.createElement('div');
            elem.className = 'card back-card fade-in';
            DEALER_CARD_AREA.appendChild(elem);

            //ディーラーの手札を計算
            calculateDealerPoint();
            hitNum++;
            i--;
        } else {};      //ディーラーのポイントが17以上であればHITせず、for文を終了
    };

    COMMENTARY.innerText = `ディーラーはカードを${hitNum}枚引き
                            STANDしました。`;
}


//最終判定
const judgePoint = () => {

    //伏せてあるディーラーのカードを表にする
    const BACK_CARD = document.querySelectorAll('.back-card');

    for (let i = 0, j = 1; i < BACK_CARD.length; i++, j++) {
        BACK_CARD[i].addEventListener('webkitTransitionEnd', () => {
            BACK_CARD[i].classList.remove('back-card');
            BACK_CARD[i].textContent = DEALER_CARDS[j];
            BACK_CARD[i].classList.remove('rotate90');
        }, false);

        BACK_CARD[i].classList.add('rotate90');
    };

    //判定
    DEALER_POINT_FIELD.textContent = dealerPointSum;
    if (dealerPointSum > 21) {
        COMMENTARY.innerText = `ディーラーはBUSTEDしたため
                                プレイヤーの勝利です。`;
    } else if (playerPointSum > dealerPointSum) {
        COMMENTARY.textContent = `プレイヤーの勝利です。`;
    } else if (dealerPointSum > playerPointSum) {
        COMMENTARY.textContent = `プレイヤーの負けです。`;
    } else if (dealerPointSum === playerPointSum) {
        COMMENTARY.textContent = `引き分けです。`;
    };

    //5秒後にcontinueボタンを表示
    setTimeout(() => {
        let hidden = CONTINUE_BUTTON.classList.contains('hidden');
        if (hidden) {
            CONTINUE_BUTTON.classList.remove('hidden');
        }

        CONTINUE_BUTTON.classList.replace('fade-out', 'fade-in-move');
        CONTINUE_BUTTON.disabled = false;
    }, 5000);
}


//HITボタンをクリックでイベント発生
//関数distributePlayerCardを呼び出す
HIT_BUTTON.addEventListener('click', distributePlayerCard, false);  


//STANDボタンをクリックでイベント発生
STAND_BUTTON.addEventListener('click', () => {

    //関数distributeDealerCardを呼び出す
    distributeDealerCard();     

    //4秒後に関数judgePointを呼び出す
    setTimeout(judgePoint, 4000);   
}, false);


//continueボタンをクリックでイベント発生
CONTINUE_BUTTON.addEventListener('click', function() {

    //ゲームテーブルのopacityを0.2に戻す
    GAME_TABLE.classList.remove('opacity-change');

     //continueボタンを非表示
    this.disabled = true;
    this.classList.replace('fade-in-move', 'fade-out');

    //解説テキストを非表示
    COMMENTARY.classList.remove('fade-in');

    //ディーラーとプレイヤーのポイントを非表示
    DEALER_POINT_FIELD.classList.remove('fade-in');
    PLAYER_POINT_FIELD.classList.remove('fade-in');

    //データの初期化
    DECK.length = 0;
    DEALER_CARDS.length = 0;
    PLAYER_CARDS.length = 0;
    
    //ディーラーの表示されているカードを削除
    while(DEALER_CARD_AREA.firstElementChild) {
        DEALER_CARD_AREA.removeChild(DEALER_CARD_AREA.firstElementChild);
    }

    //プレイヤーの表示されているカードを削除
    while(PLAYER_CARD_AREA.firstElementChild) {
        PLAYER_CARD_AREA.removeChild(PLAYER_CARD_AREA.firstElementChild);
    }

    //2秒後にゲームを再開する
    setTimeout(() => {
        //ゲームテーブルのopacityを1にする
        GAME_TABLE.classList.add('opacity-change');

        //関数createCardsを呼び出しデッキを作成
        createCards();

        //関数distributeTwoCardsを呼び出しディーラー、プレイヤーにカードを2枚配布
        distributeTwoCards();
    }, 2000)

}, false);