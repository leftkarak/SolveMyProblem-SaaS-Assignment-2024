// JavaScript για την ενημέρωση του timestamp
function updateDateTime() {
    const now = new Date();
    const datetime = now.toLocaleString();
    document.getElementById("datetime").textContent = datetime;
}

// Ανανεώνουμε το timestamp κάθε δευτερόλεπτο
updateDateTime();
setInterval(updateDateTime, 1000);