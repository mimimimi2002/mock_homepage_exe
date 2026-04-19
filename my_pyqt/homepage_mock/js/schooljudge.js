const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('param');
console.log(myParam)

if(myParam == null){
  alert("最初からやり直してください");
  window.location.href = "homepage.html";
}

async function loadJudgeData() {
  const res = await fetch('./data/judge_data/judge_data.json');
  console.log(res)
  const judgeData = await res.json();
  return judgeData;
}

async function showData() {
  console.log("schooljudge.js DOM ready");
  // your logic here

  const judgeData = await loadJudgeData();

  console.log(judgeData)

  let maxHeight = 0;

  function getTextHeight(element, totalChars) {
    const fontSize = 16;
    const lineHeight = fontSize * 1.5; // 24px
    const charWidth = fontSize;        // 16px for full-width chars

    const containerWidth = element.offsetWidth;
    const charsPerLine = Math.floor(containerWidth / charWidth);
    const linesNeeded = Math.ceil(totalChars / charsPerLine);

    return linesNeeded * lineHeight;
  }

  // if there is nothing in the option that is chosen (this will not happen)
  if(judgeData[myParam].length == 0){
    var div = document.createElement('div');
    div.classList.add('col');

    // 新しいdiv要素を作成
    var cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'mb-4', 'rounded-3', 'shadow-sm', 'h-100');
    cardDiv.style.maxHeight = 'auto';

    // 新しいdiv要素を作成
    var cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('card-body', 'text-center', 'd-flex', 'flex-column', 'justify-content-center');

    // 新しいa要素を作成
    var link = document.createElement('a');
    link.href = 'homepage.html';
    link.classList.add('w-100', 'text-center', 'd-flex', 'flex-column', 'justify-content-center', 'btn', 'btn-lg', 'btn-primary', 'h-100');
    link.setAttribute('type', 'button');
    link.style.fontSize = 'small';
    link.textContent = 'ホームに戻る';

    cardBodyDiv.appendChild(link);
    cardDiv.appendChild(cardBodyDiv);
    div.appendChild(cardDiv);
    document.body.appendChild(div);
  }
  else{
    var messageDiv = document.createElement("div");
    messageDiv.classList.add("message-div");
    messageDiv.textContent = "あなたにおすすめの留学は・・・"

    var backDiv = document.createElement("a");
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('param');
    const preParam = myParam[myParam.length-2];

    var hscrollElement = document.createElement("div");
    hscrollElement.classList.add("hscroll");

    var ulElement = document.createElement("ul");

    var schoolinfoDiv = document.createElement("div");
    schoolinfoDiv.id = "schoolinfo";

    ulElement.appendChild(schoolinfoDiv);

    var dotsContainerDiv = document.createElement("div");
    dotsContainerDiv.classList.add("dots-container");

    var arrowLeft = document.createElement("span");
    arrowLeft.classList.add("arrow", "left");

    var arrowRight = document.createElement("span");
    arrowRight.classList.add("arrow", "right");

    hscrollElement.appendChild(dotsContainerDiv);
    hscrollElement.appendChild(ulElement);
    hscrollElement.appendChild(arrowLeft);
    hscrollElement.appendChild(arrowRight);

    document.body.appendChild(messageDiv);

    document.body.appendChild(hscrollElement);

    const schoolinfo = document.getElementById('schoolinfo');
    for (let i = 0; i < judgeData[myParam].length; i++) {
        // 新しいli要素を作成

      var liElement = document.createElement("li");

      // div要素を作成してスタイルを設定
      var divElement = document.createElement("div");
      divElement.classList.add("container-fluid","text-center");
      divElement.style.position = "relative";

      // a要素を作成してhref属性を設定
      var aElement = document.createElement("a");
      if(judgeData[myParam][i].url != "nan"){
        aElement.href = judgeData[myParam][i].url;
      }

      // img要素を作成してsrc属性とスタイルを設定
      var imgElement = document.createElement("img");
      imgElement.src = "./data/image/" + judgeData[myParam][i]["image_name"] + ".png";

      // img要素をa要素の子要素に追加
      aElement.appendChild(imgElement);

      /*
      // テキストを表示するdiv要素を作成してスタイルを設定
      var textDiv = document.createElement("div");
      textDiv.style.position = "absolute";
      textDiv.style.top = "0";
      textDiv.style.left = "0";
      textDiv.style.width = "100%";
      textDiv.style.textAlign = "center";
      textDiv.style.backgroundColor = "rgba(255, 255, 255, 0.7)";

      textDiv.innerHTML = judgeData[myParam][i].name;
      */

      var nameElement = document.createElement("div");
      nameElement.classList.add("word-container");
      nameElement.classList.add("card")
      nameElement.innerHTML = "<プログラム名>"
      var nameContentElement = document.createElement("div");
      nameContentElement.classList.add("card-body")
      nameContentElement.classList.add("word-container");
      nameContentElement.innerHTML = judgeData[myParam][i]["program_name"];
      nameElement.appendChild(nameContentElement);


      var outlineElement = document.createElement("div");
      outlineElement.classList.add("word-container-program");
      outlineElement.classList.add("card")
      outlineElement.innerHTML = "<プログラムの概要>"
      var outlineContentElement = document.createElement("div");
      outlineContentElement.classList.add("card-body")
      outlineContentElement.classList.add("word-container");
      outlineContentElement.innerHTML = judgeData[myParam][i]["outline"]
      outlineElement.appendChild(outlineContentElement);

      var periodElement = document.createElement("div");
      periodElement.classList.add("word-container");
      periodElement.classList.add("card");
      periodElement.innerHTML = "<実施時期>"
      var periodContentElement = document.createElement("div");
      periodContentElement.classList.add("card-body");
      periodContentElement.classList.add("word-container");
      periodContentElement.innerHTML = judgeData[myParam][i]["period"]
      periodElement.appendChild(periodContentElement);


      var scheduleElement = document.createElement("div");
      scheduleElement.classList.add("word-container");
      scheduleElement.classList.add("card")
      scheduleElement.innerHTML = "<募集スケジュール>"
      var scheduleContentElement = document.createElement("div");
      scheduleContentElement.classList.add("card-body")
      scheduleContentElement.classList.add("word-container");
      scheduleContentElement.innerHTML = judgeData[myParam][i]["schedule"]
      scheduleElement.appendChild(scheduleContentElement);


      var costElement = document.createElement("div");
      costElement.classList.add("word-container");
      costElement.classList.add("card")
      costElement.innerHTML = "<かかる費用>"
      var costContentElement = document.createElement("div");
      costContentElement.classList.add("card-body")
      costContentElement.classList.add("word-container");
      costContentElement.innerHTML = judgeData[myParam][i]["cost"]
      costElement.appendChild(costContentElement);

      var gradeElement = document.createElement("div");
      gradeElement.classList.add("word-container-grade");
      gradeElement.classList.add("card")
      gradeElement.innerHTML = "<対象>"
      var gradeContentElement = document.createElement("div");
      gradeContentElement.classList.add("card-body")
      gradeContentElement.classList.add("word-container");
      gradeContentElement.innerHTML = judgeData[myParam][i]["application_grade"]
      gradeElement.appendChild(gradeContentElement);

      var detailElement = document.createElement("div");
      detailElement.classList.add("word-container");
      detailElement.classList.add("card")
      detailElement.style.height = 100 + "px"
      var detailContentElement = document.createElement("div");
      var link = document.createElement('a');
      if(judgeData[myParam][i].url != "nan"){
        link.href = judgeData[myParam][i].url;
        link.classList.add('w-100', 'text-center', 'd-flex', 'flex-column', 'justify-content-center', 'btn', 'btn-lg', 'btn-primary', 'h-100');
        link.setAttribute('type', 'button');
        link.setAttribute('style', 'background-color: #e16112; border-color: #e16112; color: #ffffff;');
        link.textContent = '詳細を見る';
      }
      else{
        link.classList.add('w-100', 'text-center', 'd-flex', 'flex-column', 'justify-content-center', 'btn', 'btn-lg', 'btn-primary', 'h-100');
        link.setAttribute('type', 'button');
        link.setAttribute('style', 'background-color: #e16112; border-color: #e16112; color: #ffffff;');
        link.textContent = judgeData[myParam][i]["contact"];
      }
      detailContentElement.appendChild(link);
      detailElement.appendChild(detailContentElement);

      // テキストを表示するdiv要素をdiv要素の子要素に追加
      divElement.appendChild(aElement);
      //divElement.appendChild(textDiv);
      divElement.appendChild(nameElement);
      divElement.appendChild(outlineElement);
      divElement.appendChild(periodElement);
      divElement.appendChild(scheduleElement);
      divElement.appendChild(costElement);
      divElement.appendChild(gradeElement);
      divElement.appendChild(detailElement);

      // div要素をli要素の子要素に追加
      liElement.appendChild(divElement);

      // schoolinfo要素にli要素を追加
      document.getElementById("schoolinfo").appendChild(liElement);

      let height = getTextHeight(outlineContentElement, judgeData[myParam][i]["outline"].length);

      if (maxHeight < height) {
        maxHeight = height;
      }

    }

    // adjust the height for outline
    let programContainers = document.querySelectorAll(".word-container-program");
    for (let i = 0; i < programContainers.length; i++) {
      programContainers[i].style.height = (maxHeight + 120) + "px";
    }
  }

  const ul = document.querySelector('.hscroll ul');
  const dotsContainer = document.querySelector('.dots-container');
  const school = document.getElementById("schoolinfo");
  // Create dots for each image
  for (let i = 0; i < school.children.length; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      dot.setAttribute('data-index', i);
      dotsContainer.appendChild(dot);

      if (i === 0) {
          dot.classList.add('active');
      }
  }

  // Event listener for dot clicks
  dotsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('dot')) {
          const index = parseInt(e.target.getAttribute('data-index'));
          ul.scrollLeft = school.children[index].offsetLeft;
      }
  });
  // Update active dot based on scroll position
  ul.addEventListener('scroll', () => {
      const scrollPosition = ul.scrollLeft;
      for (let i = 0; i < school.children.length; i++) {
          const child = school.children[i];
          const scrollCenter = scrollPosition + child.offsetWidth / 2
          if (scrollCenter  >= child.offsetLeft && scrollCenter < child.offsetLeft + child.offsetWidth) {
              document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
              dotsContainer.children[i].classList.add('active');
              break;
          }
      }
  });
  document.querySelectorAll('.left').forEach(elm => {
      elm.onclick = function () {
          let ul = elm.parentNode.querySelector('ul');
          ul.scrollLeft -= ul.clientWidth;
      };
  });
  document.querySelectorAll('.right').forEach(elm => {
      elm.onclick = function () {
          let ul = elm.parentNode.querySelector('ul');
          ul.scrollLeft += ul.clientWidth;
      };
  });

  document.querySelectorAll('.left').forEach(elm => {
      elm.onclick = function () {
          let ul = elm.parentNode.querySelector('ul');
          ul.scrollLeft -= ul.clientWidth;
      };
  });
  document.querySelectorAll('.right').forEach(elm => {
      elm.onclick = function () {
          let ul = elm.parentNode.querySelector('ul');
          ul.scrollLeft += ul.clientWidth;
      };
  });

  function getCurrentPageNumber() {
      const scrollPosition = ul.scrollLeft;
      const itemWidth = ul.children[0].offsetWidth; // Assuming all items have the same width
      const currentPage = Math.floor(scrollPosition / itemWidth) + 1; // Adding 1 to make it 1-indexed
      return currentPage;
  }
  function navigateToPage(pageNumber) {
      const itemWidth = ul.children[0].offsetWidth; // Assuming all items have the same width
      const targetScrollPosition = (pageNumber - 1) * itemWidth; // Calculate target scroll position
      // Set the scroll position directly without scrolling
      ul.scrollLeft = targetScrollPosition;

      // Update active dot based on the target page number
      document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
      dotsContainer.children[pageNumber - 1].classList.add('active');
  }

  var positionX;                  /* スクロール位置のX座標 */
  var positionY;                  /* スクロール位置のY座標 */
  var pageNumber;                 /* スライドのページ番号 */
  var STORAGE_KEY_X = "scrollX"; /* X座標のローカルストレージキー */
  var STORAGE_KEY_Y = "scrollY"; /* Y座標のローカルストレージキー */
  var STORAGE_KEY_PAGE = "pageNumber"; /* スライドのページ番号のローカルストレージキー */

  /*
  * checkOffset関数: 現在のスクロール量とページ番号をチェックしてストレージに保存
  */
  function checkOffset(){
      positionX = window.pageXOffset;
      positionY = window.pageYOffset;
      pageNumber = getCurrentPageNumber(); // Assume you have a function to get the current page number
      localStorage.setItem(STORAGE_KEY_X, 0);
      localStorage.setItem(STORAGE_KEY_Y, 0);
      localStorage.setItem(STORAGE_KEY_PAGE, pageNumber);
  }

  /*
  * 起動時の処理
  *
  *		ローカルストレージをチェックして前回のスクロール位置とページ番号に戻す
  */

  window.addEventListener("load", function(){
      // ストレージチェック
      positionX = localStorage.getItem(STORAGE_KEY_X);
      positionY = localStorage.getItem(STORAGE_KEY_Y);
      pageNumber = localStorage.getItem(STORAGE_KEY_PAGE);


      // 前回の保存データがあればスクロールする
      if(positionX !== null && positionY !== null && pageNumber !== null){
          scrollTo(positionX, positionY);
          // Assume you have a function to navigate to the saved page number
          if(pageNumber != "1"){
              navigateToPage("1");
          }
      }

      // スクロール時のイベント設定
      window.addEventListener("scroll", checkOffset, false);
  });

};