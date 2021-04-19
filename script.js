function $(selector, el) {
  if (!el) el = document;
  return el.querySelector(selector);
}

const deleteFields = [
  ":seed_url",
  ":seed",
  "randomized_settings",
  "starting_items",
  "item_pool",
  "dungeons",
  "trials",
  "entrances",
  "locations",
  ":woth_locations",
  ":barren_regions",
  "gossip_stones",
  ":playthrough",
  ":entrance_playthrough",
];

console.log("document loaded");
$("#uploadBtn").onclick = function () {
  console.log("upload button clicked");
  $("#fileUpload").click();
};

$("#fileUpload").onchange = function () {
  const file = $("#fileUpload").files[0];
  if (!file) return;
  const name = file.name;
  const type = file.type;
  if (type != "application/json") {
    error("Not a JSON file.");
    return;
  }
  const reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  reader.onload = function (evt) {
    const contents = evt.target.result;
    $("#spoilerName").innerText = name;
    $("#spoilerFile").value = contents;
    updateOutput();
  };
  reader.onerror = function (evt) {
    error("Error reading spoiler log");
  };
};

function error(txt) {
  const ret = {
    ":error": txt || true,
  };
  const json = JSON.stringify(ret, null, "  ");
  $("#settingsFile").value = json;
  $("#error").innerText = txt;
  $("#downloadBtn").disabled = true;
}

function convertFilename(input) {
  const dotIndex = input.lastIndexOf(".");
  let base = input;
  let ext = "";
  if (dotIndex >= 0) {
    base = input.substring(0, dotIndex);
    ext = input.substring(dotIndex);
  }
  if (base.toLowerCase().endsWith("_settings")) return input;
  else if (base.toLowerCase().endsWith("_spoilers"))
    // From website
    base = base.substring(0, base.length - 9);
  else if (base.toLowerCase().endsWith("_spoiler"))
    // From offline build
    base = base.substring(0, base.length - 8);
  return base + "_Settings" + ext;
}

$("#spoilerFile").oninput = function () {
  $("#spoilerName").innerText = "manual_input.json";
  updateOutput();
};

function updateOutput() {
  $("#error").innerText = "";
  $("#downloadBtn").disabled = false;
  const input = $("#spoilerFile").value;
  $("#settingsName").innerText = convertFilename($("#spoilerName").innerText);
  try {
    let json = JSON.parse(input);
    if (typeof json !== "object" || json === null) throw new Error();
    for (field of deleteFields) {
      if (field in json) delete json[field];
    }
    json = JSON.stringify(json, null, "  ");
    $("#settingsFile").value = json;
  } catch (e) {
    error("Invalid JSON.");
  }
}

$("#downloadBtn").onclick = function () {
  const file = $("#settingsFile").value;

  const link = document.createElement("a");
  link.href = "data:application/json;charset=utf-8," + escape(file);
  link.style = "display:none";
  link.download = $("#settingsName").innerText;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

$("#loadVanilla").onclick = function () {
  $("#spoilerFile").value = vanillaData;
  $("#spoilerName").innerText = "vanilla_Spoilers.json";
  updateOutput();
};

$("#loadMQ").onclick = function () {
  $("#spoilerFile").value = MQvanillaData;
  $("#spoilerName").innerText = "MQvanilla_Spoilers.json";
  updateOutput();
};
