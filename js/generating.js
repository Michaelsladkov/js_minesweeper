function createEmptyTable() {
    var table = document.getElementById("mainTable");
    for (let a = 0; a < 18; a++) {
        let row = document.createElement("tr");
        row.className = "row" + a;
        table.appendChild(row);
    }
    let rows = document.getElementsByTagName("tr");
    for (let b = 0; b < rows.length; b++) {
        for (let a = 0; a < 12; a++) {
            let cell = document.createElement("td");
            cell.id = b + ":" + a;
            rows.item(b).appendChild(cell);
        }
    }
}