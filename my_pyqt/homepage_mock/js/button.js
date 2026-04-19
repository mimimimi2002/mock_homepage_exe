async function loadOptionData() {
  const res = await fetch('./data/judge_data/option_data.json');
  optionData = await res.json();
  return optionData;
}

async function loadOptionCount() {
  const res = await fetch('./data/judge_data/option_count.json');
  optionCount = await res.json();
  return optionCount;
}

async function buttonInit() {
    const optionData = await loadOptionData();
    const optionCounter = await loadOptionCount(optionData)
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('param');
    const background_colors = ["#0000FF","#e16112", "#2e9f259d", "#f2d65cde", "1b1b1aa0"]
    const period_param = ["P1", "P2", "P3", "P4"]
    const language_param = Array.from({ length: optionCounter["L"] }, (_, i) => `L${i + 1}`)

    const purpose_param = Array.from({ length: optionCounter["PP"] }, (_, i) => `PP${i + 1}`)
    const season_param = Array.from({ length: optionCounter["S"] }, (_, i) => `S${i + 1}`)

    const style_param = Array.from({ length: optionCounter["Style"] }, (_, i) => `Style${i + 1}`)

    const event_param = Array.from({ length: optionCounter["E"] }, (_, i) => `E${i + 1}`)

    if(myParam == null){
      alert("最初からやり直してください");
      window.location.href = "homepage.html";
    }

    window.get_period_event_buttons = function (option_name) {
      var createButton = document.getElementById("create-button");

      var rowDiv = document.createElement("div");
      rowDiv.className = "row row-cols-1 row-cols-md-3 mb-3 text-center justify-content-center pl-md-4";

      let option_param = ""
      if (option_name === "period") {
        option_param = period_param
      } else if (option_name === "event") {
        option_param = event_param
      }

      for (let i = 0; i < option_param.length; i++) {
        new_param = myParam + option_param[i];
        if(optionData[new_param]){
          var div = document.createElement("div");
          div.className = "col-4";

          var card = document.createElement("div");
          card.className = "card mb-4 rounded-3 shadow-sm h-100";
          card.style.maxHeight = "auto";

          var cardBody = document.createElement("div");
          cardBody.className = "card-body text-center d-flex flex-column justify-content-center";

          var link = document.createElement("a");
          link.href = "school.html?param=" + new_param;
          link.className = "w-100 text-center d-flex flex-column justify-content-center btn btn-lg btn-primary h-100";
          link.type = "button";
          if (optionData[new_param].split("/")[2]){
            link.innerText = optionData[new_param].split("/")[2]
          } else {
            link.innerText = optionData[new_param].split("/")[1]
          }
          link.style.backgroundColor = background_colors[i % background_colors.length];
          link.style.borderColor = background_colors[i % background_colors.length];
          link.style.color = "#ffffff";

          cardBody.appendChild(link);

          card.appendChild(cardBody);

          div.appendChild(card);

          rowDiv.appendChild(div);
        }
        createButton.appendChild(rowDiv);
      }
    }

    window.get_option_buttons = function(option_name) {
      var createButton = document.getElementById("create-button");

      var rowDiv = document.createElement("div");
      rowDiv.className = "row row-cols-1 row-cols-md-3 mb-3 text-center justify-content-center pl-md-4";

      let option_param = ""
      if (option_name === "language") {
        option_param = language_param
      } else if (option_name === "purpose") {
        option_param = purpose_param
      } else if (option_name === "season") {
        option_param = season_param
      } else if (option_name === "style") {
        option_param = style_param
      }
      for (let i = 0; i < option_param.length; i++) {
        new_param = myParam + option_param[i];
        if (Object.keys(optionData).some(key => key.includes(new_param))) {
          var div = document.createElement("div");
          div.className = "col-4";

          var card = document.createElement("div");
          card.className = "card mb-4 rounded-3 shadow-sm h-100";
          card.style.maxHeight = "auto";

          var cardBody = document.createElement("div");
          cardBody.className = "card-body text-center d-flex flex-column justify-content-center";

          var link = document.createElement("a");
          link.href = "period.html?param=" + new_param;
          link.className = "w-100 text-center d-flex flex-column justify-content-center btn btn-lg btn-primary h-100";
          link.type = "button";
          const option = Object.entries(optionData).find(([key]) => key.includes(new_param))?.[1];
          link.innerText = option.split("/")[1]
          link.style.backgroundColor = background_colors[i % background_colors.length];
          link.style.borderColor = background_colors[i % background_colors.length];
          link.style.color = "#ffffff";

          cardBody.appendChild(link);

          card.appendChild(cardBody);

          div.appendChild(card);

          rowDiv.appendChild(div);
        }
        createButton.appendChild(rowDiv);
      }
    }
}