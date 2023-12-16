function doGet() {
  return HtmlService.createTemplateFromFile('index')//html file name
  .evaluate()
  .addMetaTag('viewport', 'width=device-width, initial-scale=1')
  .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


function pricepoint(amount) {
  if (amount === "") {
    return "";
  } else {
    return "Rs.: " + amount.toFixed(2) + " /-";
  }
}

function roundamount(amount) {
  if (amount === "") {
    return "";
  } else {
    return "Rs.: " + amount.toFixed(0) + " /-";
  }
}

function Pics(amount) {
  if (amount === "") {
    return "";
  } else {
    return amount.toFixed(0) + " Pics";
  }
}

function NO(amount) {
  if (amount === "") {
    return "";
  } else {
    return amount + " <br>(Long Press To call)";
  }
}

function formatPercentage(percentage) {
  if (percentage === "") {
    return "";
  } else {
    return (percentage * 100).toFixed(0) + " %"; 
  }
}

function link(LINK) {
  if (LINK === "") {
    return "";
  } else if (typeof LINK === "string" && LINK.match(/^https:\/\//i)) {
    // Check if LINK is a string and then use the match function
    return '<a href="' + LINK + '" target="_blank">View Invoice</a>';
  } else {
    // If LINK is not a string or doesn't match the pattern, use it as text
    return LINK;
  }
}



function image(IMAGE) {
  if (IMAGE === "") {
    return "";
  } else if (IMAGE.match(/^https:\/\//i)) {
    // Agar IMAGE ek valid image URL hai, to use <img> tag ke roop mein dikhao
    return '<img src="' + IMAGE + '" alt="Image" width="150" height="175">';

  } else {
    // Agar IMAGE ek text hai, to use text ke roop mein dikhao
    return IMAGE;
  }
}



function formatDate(date) {
  if (typeof date === "string") {
    // If input is a string, return as is
    return '<span style="color: grey;">' + date + '</span>';
  }

  if (Object.prototype.toString.call(date) !== "[object Date]" || isNaN(date.getTime())) {
    return ""; // Return blank if not a valid date
  }

  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  return (day < 10 ? "0" : "") + day + "/" + (month < 10 ? "0" : "") + month + "/" + year;
}


function submitData(tracking, number) {
  var ssData = SpreadsheetApp.openById("//////// Enter Your Google Sheet ID ///////");
  var ssComplete = SpreadsheetApp.openById("//////// Enter Your Google Sheet ID ///////");
  var sheetData = ssData.getSheetByName("//// Your Sheet Name//////");
  var sheetComplete = ssComplete.getSheetByName("//// Your Sheet Name//////");
  var dataRows = [];
  var completeRows = [];
  var dataFound = false;

  // Search in the Data sheet
  var lrData = sheetData.getLastRow();
  for (var i = 1; i <= lrData; i++) {
    var sheetTracking = sheetData.getRange(i, 5).getValue().toLowerCase(); // 5=Order Number (convert to lowercase)
    var sheetContact = sheetData.getRange(i, 50).getValue(); // 50=Contact Number

    if (sheetTracking === tracking.toLowerCase() && sheetContact == number) {
      dataFound = true;
      dataRows.push(i);
    }
  }

  // Search in the Complete sheet
  var lrComplete = sheetComplete.getLastRow();
  for (var j = 1; j <= lrComplete; j++) {
    var sheetTrackingComplete = sheetComplete.getRange(j, 5).getValue().toLowerCase();
    var sheetContactComplete = sheetComplete.getRange(j, 50).getValue();

    if (sheetTrackingComplete === tracking.toLowerCase() && sheetContactComplete == number) {
      dataFound = true;
      completeRows.push(j);
    }
  }

  var result = "";

  if (dataFound) {
    if (dataRows.length > 0) {
      for (var k = 0; k < dataRows.length; k++) {
        var rowNumber = dataRows[k];
        result += getFormattedData(sheetData, rowNumber);
      }
    }

    if (completeRows.length > 0) {
      if (result !== "") {
        result += "<br><br>"; // Add spacing between Data and Complete sections
      }
      result += "<b>Complete Order:</b><br>";
      for (var l = 0; l < completeRows.length; l++) {
        var rowNumberComplete = completeRows[l];
        result += getFormattedData(sheetComplete, rowNumberComplete);
      }
    }
  } else {
    result = "<b>No matching data found. Please check your details and try again.</b>";
  }

  return '<span style="color: Red;">' + result + '</span>';
}
function getFormattedData(sheet, rowNumber) {
  // Get data from the sheet based on the row number
  var colBE = sheet.getRange(rowNumber, 57).getValue(); // Bill Link
  var colA = sheet.getRange(rowNumber, 1).getValue(); // Status
  var colG = sheet.getRange(rowNumber, 7).getValue(); // Customer Name
  var colAI = sheet.getRange(rowNumber, 35).getValue(); // Approx Delivery Date
  var colI = sheet.getRange(rowNumber, 9).getValue(); // Bag Size
  var colY = sheet.getRange(rowNumber, 25).getValue(); // Payment Receive
  var colAH = sheet.getRange(rowNumber, 34).getValue(); // Delivery Pics
  var colAN = sheet.getRange(rowNumber, 40).getValue(); // Bill Rs.
  var colAP = sheet.getRange(rowNumber, 42).getValue(); // Delivery Date
  var colBI = sheet.getRange(rowNumber, 61).getValue(); // Image Link
  var colAQ = sheet.getRange(rowNumber, 43).getDisplayValue(); // Transport Name
  var colAR = sheet.getRange(rowNumber, 44).getDisplayValue(); // Transport Contact No
  var colAS = sheet.getRange(rowNumber, 45).getDisplayValue(); // Transport LR No
   var colAe = sheet.getRange(rowNumber, 1).getDisplayValue(); // Transport LR No

  // Create the formatted data here
  var formattedData =
    "<br><table><tr><tr><td>Image</td><td>" + image(colBI) + // Image Link as an <img> tag
    "</td></tr><tr><td>Customer Name</td><td>" + colG + // customer name
    "</td></tr><tr><td>Order Status</td><td>" + colA + // Status
    "</td></tr><tr><td>Bag Size</td><td>" + colI + // Bag Size
    "</td></tr><tr><td>Total Payment Receive</td><td>" + roundamount(colY) + // Payment Receive
    "</td></tr><tr><td>Bill Rs.</td><td>" + roundamount(colAN) + // Bill Rs.
    "</td></tr><tr><td>Billing Details</td><td>" + link(colBE) + // Bill Link
    "</td></tr><tr><td>Delivery Pics</td><td>" + Pics(colAH) + // Delivery Pics
    "</td></tr><tr><td>Delivery Date</td><td>" + formatDate(colAP) + // Delivery Date
    "</td></tr><tr><td>Transport Name</td><td>" + colAQ + // Transport Name
    "</td></tr><tr><td>Transport Contact No</td><td>" + NO(colAR) + // Transport Contact No
    "</td></tr><tr><td>Transport LR No</td><td>" + colAS + // Transport LR No
    "</td></tr><tr><td>Transport LR No</td><td>" + colAe + // Transport LR No
    "</td></tr></table>";

  return formattedData; //  order jode show karva mate :- return "Tracking ID: " + colE + formattedData;

}

