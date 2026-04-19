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
    localStorage.setItem(STORAGE_KEY_X, positionX);
    localStorage.setItem(STORAGE_KEY_Y, positionY);
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
        navigateToPage(pageNumber);
    }

    // スクロール時のイベント設定
    window.addEventListener("scroll", checkOffset, false);
});