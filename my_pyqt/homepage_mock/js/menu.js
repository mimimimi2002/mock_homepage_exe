async function loadOptionData() {
  const res = await fetch('./data/judge_data/option_data.json');
  optionData = await res.json();
  return optionData;
}
async function menuInit() {
    const optionData = await loadOptionData();
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('param');
    window.get_menu = function () {
      let option;
      console.log(myParam)
      if (optionData[myParam]) {
        option = Object.entries(optionData)
        .find(([key]) => key.includes(myParam))?.[1]
        .split("/")
      } else {
        option = Object.entries(optionData)
        .find(([key]) => key.includes(myParam))?.[1]
        .split("/")
        .slice(0, -2)
      }
      return option
    };

    // periodとeventはプログラムを表示するまでの選択肢の選択回数が1回
    window.get_period_event_menu = function () {
      let option;
      if (optionData[myParam]) {
        option = Object.entries(optionData)
        .find(([key]) => key.includes(myParam))?.[1]
        .split("/")
      } else {
        option = Object.entries(optionData)
        .find(([key]) => key.includes(myParam))?.[1]
        .split("/")
        .slice(0, -1)
      }
      return option
    };

}