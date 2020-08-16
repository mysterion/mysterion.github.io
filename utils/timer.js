function nc(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

function nn(c) {
    return (Number(c) + 1).toString();
}

function nw(c) {
    if (c.toLowerCase() != c.toUpperCase()) {
        return nc(c);
    } else {
        return nn(c);
    }
}

var naming = null;
var valInput = document.getElementById("input");
var nameView = document.getElementById("nameView");
var totalTime = document.getElementById("totalTime");
var totalTimeHandler;
var currentTime = document.getElementById("currentTime");
var currentTimeHandler;

// returns object if ok , else not ok
// [incrementor, name]
function verify() {
    var tmp = valInput.value;
    if (!tmp.includes(" ")) {
        nameView.innerHTML = "No incrementor provided";
        return false;
    }

    var seps = [tmp[0], tmp.slice(2)];

    if (tmp[1] != " ") {
        nameView.innerHTML = "Incrementor length should be 1 character long";
        return false;
    }

    if (!seps[1].includes("*")) {
        nameView.innerHTML = "Name has no wildcard";
        return false;
    }

    return seps;
}

function change() {
    var ok = verify();
    if (ok === false) {
        naming = null;
        return;
    }
    naming = ok;
    nameView.innerHTML = "[ " + naming[1].replace("*", naming[0]) + ", " + naming[1].replace("*", nw(naming[0])) + ", ... ]";
}

var start = 1;
var sbutton = document.getElementById("sButton");
var ebutton = document.getElementById("eButton");
var startts;
var ts;
var data = [["Question", "Start", "End", "Total Time"]];

function pad(c) {
    if (c <= 9) {
        return "0" + c.toString();
    } else {
        return c.toString();
    }
}

function inTime(ts) {
    var totalSeconds = Math.floor(ts / 1000);
    var hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
}

var table = document.getElementsByTagName("table")[0];

function crunch() {
    var nextts = Date.now();
    var Q = naming[1].replace("*", naming[0]),
        S = inTime(ts - startts),
        E = inTime(nextts - startts),
        T = inTime(nextts - ts);

    var trds = [Q, S, E, T];

    data.push(trds);

    var row = document.createElement("tr");

    for (var i = 0; i < 4; i++) {
        var td = document.createElement("td");
        td.appendChild(document.createTextNode(trds[i]));
        row.appendChild(td);
    }

    table.appendChild(row);

    ts = nextts;
    naming[0] = nw(naming[0]);
}

var tf = 0, ctf = 0;

function sWatchTot() {
    if (tf == 1) return;
    totalTimeHandler = setInterval(
        function () {
            totalTime.innerHTML = inTime(Date.now() - startts);
        },
        1000
    );
    tf = 1;
}

function sWatchCT() {
    if (ctf == 1) return;
    currentTimeHandler = setInterval(
        function () {
            currentTime.innerHTML = inTime(Date.now() - ts);
        },
        1000
    );
    ctf = 1;
}

function lbutton() {
    if (naming == null) {
        alert("Set up naming first");
        return;
    }
    if (start == 1) {
        sbutton.innerHTML = "Finish";
        ebutton.innerHTML = "Finish & End";
        ebutton.style.display = "block";
        ts = Date.now();
        startts = ts;
        sWatchTot();
        sWatchCT();
        start = 0;
    } else {
        sWatchCT();
        crunch();
    }
}

var end = 0;

function rbutton() {
    if (end == 1) {
        exportToCsv("contest.csv", data);
    } else {
        crunch();
        sbutton.style.display = "none";
        ebutton.innerHTML = "Export";
        clearTimeout(totalTimeHandler);
        clearTimeout(currentTimeHandler);
        end = 1;
    }
}
