let actionId;
let actionJson = {};
//actionJson.info = {};
//actionJson.info.cameraConfig = {};
//actionJson.info.cameraConfig.driverOptions = {};

let PageStatus = { "status": 0, "boxDisplay": "none", "heatmapDisplay": "none" };
let Filter = false;
let AdminMode = false;

let PageIndexArray = [];
let ShowPageIndex = 0;
let PlayImg = false;
let PlayImgTimeoutId;
let SlideShowIntervalMs = 2000;

function createFilterJsonStr(index) {
    let chickIdValue = document.getElementById("chickIdFilterId").value;
    if (!chickIdValue) chickIdValue = 0;
    let userIdValue = document.getElementById("userIdFilterId").value;
    if (!userIdValue) userIdValue = 0;
    let scoreValue = document.getElementById("scoreFilterId").value;
    if (!scoreValue) scoreValue = 0;
    let jsonStr = "{\"trueClass\": "
        + document.getElementById("trueClassFilterId").value
        + ", \"observedClass\": "
        + document.getElementById("observedClassFilterId").value
        + ", \"predictedClass\": "
        + document.getElementById("predictedClassFilterId").value
        + ", \"score\": "
        + scoreValue
        + ", \"device\": \""
        + document.getElementById("cameraFilterId").value
        + "\", \"rating\": "
        + document.getElementById("ratingFilterId").value
        + ", \"chickId\": "
        + chickIdValue
        + ", \"userId\": "
        + userIdValue
        + ", \"breed\": \""
        + document.getElementById("breedFilterId").value
        + "\"";
    if (index) jsonStr = jsonStr + ", \"id\": " + index;
    jsonStr = jsonStr + "}";
    return jsonStr;
}

function loadDb(offset, limit) {
    document.getElementById("tableBody").innerHTML = '';
    //let chickIdValue = document.getElementById("chickIdFilterId").value;
    //if (!chickIdValue) chickIdValue = 0;
    //let userIdValue = document.getElementById("userIdFilterId").value;
    //if (!userIdValue) userIdValue = 0;
    if (Filter)
        $.ajax({
            type: "POST",
            url: '/selectImages/offset/' + offset + '/limit/' + limit,
            data: createFilterJsonStr(),
            async: false,
            success: function (json) {
                PageIndexArray = [];
                for (var i = 0; i < json.items.length; i++) {
                    addRow(json.items[i], i);
                }
                checkbox = $('table tbody input[type="checkbox"]');
            },
            error: function (json) {
                alert(json.responseJSON.message);
            }
        });
    else $.ajax({
        type: "GET",
        url: '/users/offset/' + offset + '/limit/' + limit,
        async: false,
        success: function (json) {
            PageIndexArray = [];
            for (var i = 0; i < json.items.length; i++) {
                addRow(json.items[i], i);
            }
            console.log("PageIndexArray: " + PageIndexArray);
            checkbox = $('table tbody input[type="checkbox"]');
        },
        error: function (json) {
            if (json.responseJSON)
                alert(json.responseJSON.message);
            else
                alert(json.statusText);
        }
    });
}

/*
function predictedClass(boxList) {
    let json = predictClass(boxList);
    switch (json.sex) {
        case 0: return "Female (" + json.score + "%)";
        case 1: return "Male (" + json.score + "%)";
        default: return "Unkown"
    }
}
*/

function addRow(json, i) {

    PageIndexArray.push(json.id); //added

    var tr = document.createElement("tr");
    var td = document.createElement('td');
    td.innerHTML = '<span class="custom-checkbox"><input type="checkbox" id="checkbox' + json.id + '" name="options[]" value="1"><label for="checkbox' + json.id + '"></label></span>';
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.id;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.poi_name;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.latitude;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.longtitude;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.address1;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.address2;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.address3;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.zip;
    tr.appendChild(td);
    td = document.createElement('td');
    var category;
    switch (json.category) {
        case "CAT_TRAVEL": category = "観光地";
            break;
        case "CAT_CAR": category = "車";
            break;
        case "CAT_THEATER": category = "劇場";
            break;
        case "CAT_BUSINESS": category = "仕事";
            break;
        case "CAT_TEMPLE": category = "神社、仏閣";
            break;
        case "CAT_MUSEUM": category = "美術館、博物館";
            break;
        case "CAT_HOTEL": category = "ホテル、旅館";
            break;
        case "CAT_HOSPITAL": category = "病院";
            break;
        case "CAT_GOVERMENT": category = "役所";
            break;
        case "CAT_RESTAURANT": category = "レストラン";
            break;
        case "CAT_OTHERS": category = "その他";
            break;
        default: category = "Unknown";
    }
    td.innerHTML = category;
    tr.appendChild(td);
    td = document.createElement('td');
    switch (json.icon_id) {
        case 1: className = "目的地＠";
            break;
        case 6: className = "カメラ";
            break;
        case 7: className = "ハート";
            break;
        case 11: className = "レストラン";
            break;
        case 12: className = "マップピン";
            break;
        case 13: className = "車";
            break;
        case 14: className = "ホテル";
            break;
        case 15: className = "ショッピング";
            break;
        case 19: className = "目的地";
            break;
        default: className = "Unknown";
    }
    td.innerHTML = className;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = "POI_" + json.latitude + "x" + json.longtitude + ".gpx";
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.reg_time;
    tr.appendChild(td);

    td = document.createElement('td');
    let str;
    str = '<button type="button" class="bi bi-pencil-fill" data-bs-toggle="modal" data-bs-target="#editEmployeeModal" style="margin-right: 10px; background: transparent; border: 0; font-size: 16px; color: orange"';
    str = str + ' onClick="editUser(' + json.id + ')">';
    str = str + '</button>';
    str = str + '<button type="button" class="bi bi-trash-fill" data-bs-toggle="modal" data-bs-target="#deleteEmployeeModal" style="background: transparent; border: 0; font-size: 16px; color: red"';
    str = str + ' onClick="deleteUser(' + json.id + ')">';
    str = str + '</button>';
    td.innerHTML = str;
    tr.appendChild(td);
    document.getElementById("tableBody").appendChild(tr);
}

function userDtoStr(formName) {
    let form = document.forms[formName];
    let value = form.elements["poiName"].value
    if (value) actionJson.poi_name = value;
    value = form.elements["latitude"].value
    if (value) actionJson.latitude = value;
    value = form.elements["longtitude"].value;
    if (value) actionJson.longtitude = value;
    value = form.elements["address1"].value;
    if (value) actionJson.address1 = value;
    value = form.elements["address2"].value;
    if (value) actionJson.address2 = value;
    value = form.elements["address3"].value;
    if (value) actionJson.address3 = value;
    value = form.elements["zip"].value;
    if (value) actionJson.zip = value;
    value = form.elements["zip"].value;
    if (value) actionJson.zip = value;
    value = form.elements["category"].value;
    if (value) actionJson.category = value;
    value = form.elements["iconId"].value;
    if (value) actionJson.icon_id = Number(value); 
    value = form.elements["poiFileName"].value;
    if (value) actionJson.gpx = value;
    value = form.elements["regTime"].value;
    if (value) actionJson.reg_time = value;
    let actionJsonStr = JSON.stringify(actionJson);
    alert(actionJsonStr);
    return actionJsonStr;
}

function applyFilter() {
    Filter = true;
    document.getElementById("numberOfRecordsButtonId").value = "Number of Filtered Records";
    loadDb((CurrentPage - 1) * Limit, Limit);
    document.getElementById("numEntryId").value = "-----";
    numberOfRecords();
}

function resetFilter() {
    Filter = false;
    document.getElementById("numberOfRecordsButtonId").value = "Number of Records";
    loadDb(0, Limit);
    setTimeout(pageJump, 500, 1);
    document.getElementById("userIdFilterId").value = 0;
    document.getElementById("breedFilterId").value = "";
    document.getElementById("chickIdFilterId").value = 0;
    document.getElementById("trueClassFilterId").value = 99;
    document.getElementById("observedClassFilterId").value = 99;
    document.getElementById("predictedClassFilterId").value = 99;
    document.getElementById("scoreFilterId").value = "";
    document.getElementById("cameraFilterId").value = "";
    document.getElementById("ratingFilterId").value = 0;
    //document.getElementById("numEntryId").value = "-----";
    document.getElementById("jumpInputId").value = "";

    //createColumnMenu();
    numberOfRecords();
}

function clearInputForm(formName) {
    let form = document.forms[formName];
    switch (formName) {
        case "editUserForm":
            form.elements["userName"].value = "";
            form.elements["date"].value = "";
            form.elements["breed"].value = "";
            form.elements["chickId"].value = "";
            form.elements["trueClass"].value = "";
            form.elements["image"].value = "";
            form.elements["notes"].value = "";
            form.elements["rating"].value = "";
            break;
        default:
            break;

    }

}

function editUser(id) {
    if (id) {
        actionId = id;
        var elem = document.getElementById("tableBody");
        for (var i = 0; i < elem.childElementCount; i++) {
            if (elem.children[i].children[1].innerText == id) {
                $.ajax({
                    type: "GET",
                    url: '/images/' + id,
                    async: false,
                    success: function (json) {
                        actionJson = json;
                        var form = document.forms["editUserForm"];
                        form.elements["userId"].value = json.userId;
                        form.elements["userName"].value = json.userName;
                        form.elements["date"].value = json.date;
                        form.elements["breed"].value = json.info.breed;
                        form.elements["chickId"].value = json.info.chickId;
                        form.elements["trueClass"].value = json.trueClass;
                        form.elements["observedClass"].value = json.observedClass;
                        form.elements["width"].value = json.info.cameraConfig.width;
                        form.elements["height"].value = json.info.cameraConfig.height;
                        form.elements["device"].value = json.info.cameraConfig.driverOptions.device;
                        form.elements["image"].value = json.image;
                        form.elements["boxList"].value = JSON.stringify(json.boxList);
                        form.elements["notes"].value = json.info.notes;
                        form.elements["rating"].value = json.info.rating;
                    },
                    error: function (json) {
                        alert(json.responseJSON.message);
                    }
                });
                break;
            }
        }
    } else if (actionId)
        $.ajax({
            type: "PUT",
            url: '/images/' + actionId,
            data: userDtoStr("editUserForm"),
            async: false,
            success: function (json) {
                /*var form = document.forms["editUserForm"];
                form.elements["userName"].value = "";
                form.elements["date"].value = "";
                form.elements["breed"].value = "";
                form.elements["chickId"].value = "";
                form.elements["trueClass"].value = "";
                form.elements["image"].value = "";*/
                //loadDb((CurrentPage - 1) * Limit, Limit); //need to update the record
                var elem = document.getElementById("tableBody");
                for (var i = 0; i < elem.childElementCount; i++) {
                    if (elem.children[i].children[1].innerText == actionId) {
                        elem.children[i].children[2].innerText = json.userId;
                        elem.children[i].children[3].innerText = json.userName;
                        elem.children[i].children[4].innerText = json.date;
                        elem.children[i].children[5].innerText = json.info.breed;
                        elem.children[i].children[6].innerText = json.info.chickId;
                        switch (json.trueClass) {
                            case -1: elem.children[i].children[7].innerText = "Unkown";
                                break;
                            case 0: elem.children[i].children[7].innerText = "Female";
                                break;
                            case 1: elem.children[i].children[7].innerText = "Male";
                                break;
                        }
                        switch (json.observedClass) {
                            case -1: elem.children[i].children[8].innerText = "Unkown";
                                break;
                            case 0: elem.children[i].children[8].innerText = "Female";
                                break;
                            case 1: elem.children[i].children[8].innerText = "Male";
                                break;
                        }
                        //elem.children[i].children[9].innerText = predictedClass(json.boxList);
                        switch (json.predictedClass) {
                            case -1: elem.children[i].children[8].innerText = "Unkown";
                                break;
                            case 0: elem.children[i].children[8].innerText = "Female (" + json.score + "%)";
                                break;
                            case 1: elem.children[i].children[8].innerText = "Male (" + json.score + "%)";
                                break;
                        }
                        elem.children[i].children[10].innerText = json.info.cameraConfig.width + "x" + json.info.cameraConfig.height;
                        elem.children[i].children[11].innerText = json.info.cameraConfig.driverOptions.device;
                        //elem.children[i].children[9].innerText = json.image;
                        switch (json.info.rating) {
                            case 11:
                                elem.children[i].children[13].innerHTML = "T1";
                                break;
                            case 12:
                                elem.children[i].children[13].innerHTML = "T2";
                                break;
                            default:
                                elem.children[i].children[13].innerHTML = json.info.rating;
                        }
                        //elem.children[i].children[13].innerText = json.info.rating;
                        break;
                    }
                }
                actionId = "";
                //actionJson = "";

            },
            error: function (json) {
                alert(json.responseJSON.message);
            }
        });
    //else editCheckedUsers(0, document.getElementById("tableBody").childElementCount);
}

function replaceCameraStyle(aspectRatio) {
    let height = parseInt(700 * aspectRatio);
    let aspectRatio_100 = parseInt(aspectRatio * 100);
    const stylesheet = new CSSStyleSheet();
    stylesheet.replaceSync('.objBoxWrapperClass:before {content: ""; display: block; padding-top: ' + aspectRatio_100 + '%;} .webcamClass {position: relative; width: 700px; height: ' + height + 'px;}');
    //console.log(stylesheet.cssRules[0].cssText);
    //console.log(stylesheet.cssRules[1].cssText);
    //return stylesheet;
    document.adoptedStyleSheets = [stylesheet];
}

function textFileRead(input, outputTextArea) {
    //console.log(input);
    //console.log(input.files[0]);
    const file = input.files[0];
    //cubeFileName = file.name;
    const reader = new FileReader();
    reader.onload = () => {
        const elem = document.getElementById(outputTextArea);
        elem.value = reader.result;
    };
    reader.readAsText(file);
}

function imageFileRead(input, outputTextArea) {
    //console.log(input);
    //console.log(input.files[0]);
    const file = input.files[0];
    var fileName = file.name;

    /*
    var elements = document.forms['createUser'].elements;
    elements['notes'].value = fileName;
    switch (fileName.substring(1, 2)) {
        case "F": elements['trueClass'].value = 0;
            break;
        case "M": elements['trueClass'].value = 1;
            break;
    }
    elements['chickId'].value = Number(fileName.substring(3, 6));
    */

    const reader = new FileReader();
    //reader.addEventListener("load", setOutputTextArea);
    reader.addEventListener("load", { name: fileName, handleEvent: setOutputTextArea });
    /*
    reader.onload = (e) => {
        var data = e.target.result;
        data = data.substring(23); //trunkate Base64 header as a workaround, but should be changed to store data with the header in the future
        document.getElementById(outputTextArea).value = data;
    };
    */
    reader.readAsDataURL(file);
}
function setOutputTextArea(e) {
    var data = e.target.result;
    data = data.substring(23); //trunkate Base64 header as a workaround, but should be changed to store data with the header in the future
    document.getElementById("base64Area1").value = data;
    var fileName = this.name;
    var elements = document.forms['createUser'].elements;
    elements['notes'].value = fileName;
    switch (fileName.substring(1, 2)) {
        case "F": elements['trueClass'].value = 0;
            break;
        case "M": elements['trueClass'].value = 1;
            break;
    }
    elements['chickId'].value = Number(fileName.substring(3, 6));
    alert("ready to add an image (" + fileName + ")");
    createNewUser();
}

function imageFileRead2(input, outputTextArea) {
    for (i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        var fileName = file.name;
        const reader = new FileReader();
        reader.addEventListener("load", { name: fileName, handleEvent: setOutputTextArea });
        reader.readAsDataURL(file);
    }
}

function imageFileRead3(input) {
    //var input = document.getElementById("imageFileReadButtonId");
    var worker = new Worker("fileworkers.js");
    var numberOfFiles;
    var numberOfFilesAdded = 0;
    worker.onmessage = function (event) {
        var ret = event.data;
        if (ret.type.match('image.*')) {
            var fileName = ret.fileName;
            var formElements = document.forms['createUser'].elements;
            formElements['notes'].value = fileName;
            switch (fileName.substring(1, 2)) {
                case "F": formElements['trueClass'].value = 0;
                    break;
                case "M": formElements['trueClass'].value = 1;
                    break;
            }
            formElements['chickId'].value = Number(fileName.substring(3, 6));
            var data = ret.val;
            data = data.substring(23);
            document.getElementById("base64Area1").value = data;
            createNewUser();
            console.log(numberOfFilesAdded++);
            if (numberOfFilesAdded == numberOfFiles) {
                indicator2.hide();
                alert(numberOfFiles + " files added");
            }

        } else alert("not image file");
    }

    numberOfFiles = input.files.length;
    for (i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        worker.postMessage({ "file": file, "type": file.type });
    }
}



/*

    var elements = document.forms['createUser'].elements;
    elements['notes'].value = ImageFileList[i];
    switch (ImageFileList[i].substring(1, 2)) {
        case "F": elements['trueClass'].value = 0;
            break;
        case "M": elements['trueClass'].value = 1;
            break;
    }
    elements['chickId'].value = Number(ImageFileList[i].substring(3, 6));
}
}
    const reader = new FileReader();
    reader.onload = () => {
        const elem = document.getElementById(outputTextArea);
        var data = reader.result;
        data = data.substring(23); //trunkate Base64 header as a workaround, but should be changed to store data with the header in the future
        elem.value = data;
        console.log("ready to add a new record");
        createNewUser();
    };
    reader.readAsDataURL(file);
}
}
*/

function showImage(pageIndex) {
    ShowPageIndex = pageIndex;
    //let returnCode = 0;
    //alert(pageIndex);
    $.ajax({
        type: "GET",
        url: '/images/' + PageIndexArray[pageIndex],
        async: false,
        success: function (json) {
            //document.getElementById('classifyerImgId-0').src = json.image;
            //var boxList = json.boxList;
            //alert(boxList[0].top);
            actionId = PageIndexArray[pageIndex];
            actionJson = json;
            //returnCode = 0;
            let cameraConfig = json.info.cameraConfig;
            replaceCameraStyle(cameraConfig.height / cameraConfig.width);
            showClassifyreResult(0, json);
            autoCalc();
        },
        error: function (json) {
            //returnCode = json.status;
            alert("Index: " + PageIndexArray[ShowPageIndex] + ", " + json.status + ": " + json.responseJSON.message);
            throw new RangeError("Index: " + PageIndexArray[ShowPageIndex] + " record not existing");
            //throw new Error("404");
        }
    });
    //return returnCode;
}


/*
heatMapEle.style.top = "0%";
heatMapEle.style.left = "0%";
heatMapEle.style.height = "100%";
heatMapEle.style.width = "100%";
heatMapEle.style.opacity = "50%";
heatMapEle.style.border = 0;
*/
function showHeatMap(json, objBoxWrapper) {
    let heatMapEle = document.createElement("img");
    heatMapEle.id = "heatmapImgId-0";
    //heatMapEle.classList.add("objBox");
    heatMapEle.classList.add("heatMap");
    objBoxWrapper.appendChild(heatMapEle);
    heatMapEle.src = "data:image/jpeg;base64, " + json.info.heatMap;
    //heatMapEle.style.display = PageStatus.heatmapDisplay;
    //heatMapEle.style.display = "none";
}

function toggleMagnifier2() {
    let BoxWrapper = document.getElementById("objBoxWrapperId-0");
    if (document.getElementById("magnifierCheckId").checked) {
        BoxWrapper.style.visibility = "hidden";
        document.getElementById("viewBBCheckId").checked = false;
        toggleBoundingBoxes();
        document.getElementById("viewBBCheckId").disabled = true;
        document.getElementById("viewHeatMapCheckId").checked = false;
        toggleHeatMap();
        document.getElementById("viewHeatMapCheckId").disabled = true;
        magnifier();
    }
    else {
        BoxWrapper.style.visibility = "visible";
        magnifier('stop');
        document.getElementById("viewBBCheckId").disabled = false;
        document.getElementById("viewHeatMapCheckId").disabled = false;
    }
}

function toggleBoundingBoxes() {
    //let BoxWrapper = document.getElementById("objBoxWrapperId-0");
    if (document.getElementById("viewBBCheckId").checked) {
        //BoxWrapper.style.display = "block";
        $('.objBox').css({ 'visibility': 'visible' });
    }
    else {
        //BoxWrapper.style.display = "none";
        $('.objBox').css({ 'visibility': 'hidden' });
    }
}

function toggleHeatMap() {
    //let BoxWrapper = document.getElementById("objBoxWrapperId-0");
    if (document.getElementById("viewHeatMapCheckId").checked) {
        //BoxWrapper.style.display = "block";
        //heatMapEle.style.display = "block";
        $('.heatMap').css({ 'visibility': 'visible' });
    }
    else {
        //BoxWrapper.style.display = "none";
        //heatMapEle.style.display = "none";
        $('.heatMap').css({ 'visibility': 'hidden' });
    }
}

function heatMapOpa(inputEle) {
    console.log(inputEle.value);
    $('.heatMap').css({ 'opacity': inputEle.value + '%' });
}

function createBoxes(json, objBoxWrapper) {
    let sex, score, top, left, height, width;
    let boxList = json.boxList;
    let isSquareBB = false;
    for (i in boxList) {
        switch (boxList[i].sex) {
            case 5:
                isSquareBB = true;
                break;
            default:
                continue;
        }
    }
    for (i in boxList) {
        if (boxList[i].sex < 0) break;
        sex = boxList[i].sex;
        score = boxList[i].score;
        top = boxList[i].top;
        left = boxList[i].left;
        height = boxList[i].height;
        width = boxList[i].width;
        var objBoxEle = document.createElement("table");
        objBoxEle.innerHTML = '<tr><td></td></tr>';
        objBoxEle.classList.add("objBox");

        switch (sex) {
            case 0: //for female by Halcon
                //document.getElementById("femaleCount").innerHTML = femaleScore[0]++;
                //femaleScore[1] = femaleScore[1] + score;
                //document.getElementById("femaleScore").innerHTML = femaleScore[1].toPrecision(4);
                objBoxEle.style.borderColor = "red";
                objBoxEle.style.color = "red";
                break;
            case 1: //for male by Halcom
                //document.getElementById("maleCount").innerHTML = maleScore[0]++;
                //maleScore[1] = maleScore[1] + score;
                //document.getElementById("maleScore").innerHTML = maleScore[1].toPrecision(4);
                objBoxEle.style.borderColor = "lime";
                objBoxEle.style.color = "lime";
                break;
            case 2: //for female by Yolo
                //document.getElementById("preFemaleCount").innerHTML = preFemaleScore[0]++;
                //preFemaleScore[1] = femaleScore[1] + score;
                //document.getElementById("preFemaleScore").innerHTML = preFemaleScore[1].toPrecision(4);
                objBoxEle.style.borderColor = "pink";
                objBoxEle.style.color = "pink";
                break;
            case 3: //for male by Yolo
                //document.getElementById("preMaleCount").innerHTML = preMaleScore[0]++;
                //preMaleScore[1] = preMaleScore[1] + score;
                //document.getElementById("preMaleScore").innerHTML = preMaleScore[1].toPrecision(4);
                objBoxEle.style.borderColor = "blue";
                objBoxEle.style.color = "blue";
                break;
            case 4: //for body by Yolo
                objBoxEle.style.borderColor = "yellow";
                objBoxEle.style.color = "yellow";
                if (!isSquareBB) {
                    if (json.info.heatMap) showHeatMap(json, objBoxEle);
                    //else alert("no heatMap data for an original BB");
                }
                break;
            case 5: //for square cropping area
                objBoxEle.style.borderColor = "orange";
                //objBoxEle.style.color = "orange";
                //objBoxEle.style.borderStyle = "none";
                objBoxEle.style.color = "transparent";
                if (json.info.heatMap) showHeatMap(json, objBoxEle);
                else alert("no heatMap data for square BB");
                break;
            case 6: //for female eminence
                objBoxEle.style.borderColor = "pink";
                objBoxEle.style.color = "pink";
                break;
            case 7: //for male eminence
                objBoxEle.style.borderColor = "blue";
                objBoxEle.style.color = "blue";
                break;
            default: //other boxes, ex. last execution
                objBoxEle.style.borderStyle = "none";
                objBoxEle.style.color = "transparent";
        }
        //showClassifyerResult(json);
        //showObjectDetectionResult();
        /*
        if (femaleScore[1] > maleScore[1]) {
            decisionEle.innerHTML = "Female";
            decisionEle.style.background = "red";
 
        } else {
            decisionEle.innerHTML = "Male";
            decisionEle.style.background = "green";
        }
        */
        objBoxEle.tBodies[0].rows[0].cells[0].innerText = score;
        objBoxEle.style.top = top + "%";
        objBoxEle.style.left = left + "%";
        objBoxEle.style.height = height + "%";
        objBoxEle.style.width = width + "%";
        //objBoxEle.style.zIndex = 1000 + i;

        //objBoxEle.style.display = "none"; ////////////

        objBoxWrapper.appendChild(objBoxEle);
    }
}

let ImageInfoJson;
function showClassifyreResult(cameraID, json) {
    ImageInfoJson = json;
    let trueClass;
    switch (json.trueClass) {
        case -1: trueClass = "Unkown";
            break;
        case 0: trueClass = "Female";
            break;
        case 1: trueClass = "Male";
            break;
    }
    let observedClass;
    switch (json.observedClass) {
        case -1: observedClass = "Unkown";
            break;
        case 0: observedClass = "Female";
            break;
        case 1: observedClass = "Male";
            break;
    }
    var boxList = json.boxList;
    var sex;
    var score;
    var top;
    var left;
    var height;
    var width;

    //var decisionEle = document.getElementById("classifyerDecision");
    //var imgEle = document.getElementById("classifyerImgId-0");
    var webcamEle = document.getElementById("webcam2-" + cameraID);
    let innerHtmlStr = '<div class="base_img_box"><img id="classifyerImgId-' + cameraID + '" class="webcamImgClass base_img"><div id="objBoxWrapperId-' + cameraID + '" class="objBoxWrapperClass"></div></div>';
    innerHtmlStr = innerHtmlStr + '<div class="lens_img_box"><img id="classifyerZoomedImgId-' + cameraID + '" class="lens_img"></div>'; //added for magnifier
    webcamEle.innerHTML = innerHtmlStr;
    var objBoxWrapper = document.getElementById('objBoxWrapperId-' + cameraID);
    //objBoxWrapper.style.display = "none";
    //objBoxWrapper.style.display = PageStatus.boxDisplay;
    document.getElementById("ratingSelectorId").value = json.info.rating;


    //
    var tr = document.createElement("tr");
    var td = document.createElement('td');
    td.innerHTML = json.id;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.userId;
    tr.appendChild(td);
    td = document.createElement('td');
    td.id = "imageInfoChickId";
    td.innerHTML = json.info.chickId;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = trueClass;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = observedClass;
    tr.appendChild(td);
    td = document.createElement('td');
    //td.innerHTML = predictedClass(boxList);
    switch (json.predictedClass) {
        case 0: td.innerHTML = "Female (" + json.score + "%)";
            break;
        case 1: td.innerHTML = "Male (" + json.score + "%)";
            break;
        default: td.innerHTML = "Unknown";
    }
    tr.appendChild(td);
    document.getElementById("tableBody2").innerHTML = "";
    document.getElementById("tableBody2").appendChild(tr);
    //

    let isSquareBB = false;
    for (i in boxList) {
        switch (boxList[i].sex) {
            case 5:
                isSquareBB = true;
                break;
            default:
                continue;
        }
    }
    createBoxes(json, objBoxWrapper);

    document.getElementById("classifyerImgId-" + cameraID).src = "data:image/jpeg;base64, " + json.image;
    //document.getElementById("classifyerImgId-" + cameraID).addEventListener('click', toggleMagnifier, false);

    document.getElementById("classifyerZoomedImgId-" + cameraID).src = "data:image/jpeg;base64, " + json.image;
    //if (json.info.heatMap) showHeatMap(json, objBoxWrapper);
    document.getElementById("chickIdSelectorId").value = json.info.chickId;
    document.getElementById("userIdSelectorId").value = json.userId;
    document.getElementById("trueClassSelectorId").value = json.trueClass;
    document.getElementById("observedClassSelectorId").value = json.observedClass;

    //magnifier(); //added for magnifier
    //isMagnifier = false;
    toggleMagnifier2();

    toggleBoundingBoxes();
    toggleHeatMap();
}

function lastImg() {
    if (PageIndexArray[ShowPageIndex] == IndexRange[0]) {
        alert("no more records");
        return;
    }
    if (ShowPageIndex > 0)
        showImage(ShowPageIndex - 1);
    else {
        clickPreviousPage();
        /*
        if (PageIndexArray.length == 0) {
            alert("no more page");
            return;
        }
        */
        showImage(PageIndexArray.length - 1);
    }
    if (PlayImg) PlayImgTimeoutId = setTimeout(lastImg, SlideShowIntervalMs);
}
/*
function lastImg2() {
    if (PageIndexArray[ShowPageIndex] == IndexRange[0]) {
        alert("This is the first record: " + PageIndexArray[ShowPageIndex]);
        return;
    }
    if (Filter) {
        //let chickIdValue = document.getElementById("chickIdFilterId").value;
        //if (!chickIdValue) chickIdValue = 0;
        //let userIdValue = document.getElementById("userIdFilterId").value;
        //if (!userIdValue) userIdValue = 0;
        $.ajax({
            type: "POST",
            url: "/selectImages/offset/0/limit/1",
            data: createFilterJsonStr(PageIndexArray[ShowPageIndex] - 1),
            //async: false,
            success: function (json) {
                try {
                    if (json.items.length > 0) {
                        document.getElementById('imageModal').style.opacity = 1;
                        addSlideShowEventListner();
                        showImage(PageIndexArray[ShowPageIndex] - 1);
                        let firstImageIdOfCurrentPage = Number(document.getElementById('tableBody').firstChild.children[1].innerHTML);
                        if (PageIndexArray[ShowPageIndex] < firstImageIdOfCurrentPage) clickPreviousPage();
                        if (PlayImg) PlayImgTimeoutId = setTimeout(lastImg, SlideShowIntervalMs);
                    }
                    else {
                        document.getElementById('imageModal').style.opacity = 0.5;
                        removeSlideShowEventListner();
                        showImage(PageIndexArray[ShowPageIndex] - 1);
                        lastImg();

                    }
                }
                catch (error) {
                    console.error(error.stack);
                    alert("may reach the first record, " + "Error message: " + error.message);
                }
            },
            error: function (json) {
                alert(json.responseJSON.message);
            }
        });
    }
    else {
        showImage(PageIndexArray[ShowPageIndex] - 1);
        let firstImageIdOfCurrentPage = Number(document.getElementById('tableBody').firstChild.children[1].innerHTML);
        if (PageIndexArray[ShowPageIndex] < firstImageIdOfCurrentPage) clickPreviousPage();
        if (PlayImg) PlayImgTimeoutId = setTimeout(lastImg, SlideShowIntervalMs);
    }
}
*/


/*
function playImg() {
    nextImg();
    if (PlayImg) setTimeout(playImg, SlideShowIntervalMs);
}

function reverseImg() {
    lastImg();
    if (PlayImg) setTimeout(reverseImg, SlideShowIntervalMs);
}
*/

function startPlayImg() {
    PlayImg = true;
    //if (document.getElementById("taskSelectorId").value == "3") sendARecord(PageIndexArray[ShowPageIndex]);
    clickNext();
    document.getElementById("reverseButtonId").removeEventListener('click', startReverseImg);
}

function startReverseImg() {
    PlayImg = true;
    clickLast();
    document.getElementById("playButtonId").removeEventListener('click', startPlayImg);
}

function stopPlayImg() {
    PlayImg = false;
    clearTimeout(PlayImgTimeoutId);
    document.getElementById("playButtonId").addEventListener('click', startPlayImg);
    document.getElementById("reverseButtonId").addEventListener('click', startReverseImg);
}

function nextImg() {
    //let isTaskMenu3 = false;
    //if (document.getElementById("taskSelectorId").value == "3") isTaskMenu3 = true;
    if (PageIndexArray[ShowPageIndex] == IndexRange[1]) {
        alert("no more records");
        return;
    }
    if (ShowPageIndex + 1 < PageIndexArray.length) {
        /*if (isTaskMenu3) {
            sendARecord(PageIndexArray[ShowPageIndex + 1]);
            setTimeout(showImage, SlideShowIntervalMs - 100, ShowPageIndex + 1);
        } else */
        showImage(ShowPageIndex + 1);
    }
    else {
        clickNextPage();
        /*
        if (PageIndexArray.length == 0) {
            alert("no more records");
            return;
        }
        */
        /*if (isTaskMenu3) {
            sendARecord(PageIndexArray[0]);
            setTimeout(showImage, SlideShowIntervalMs, 0);
        } else*/
        showImage(0);
    }
    if (PlayImg)
        //if (isTaskMenu3)
        //nextImg();
        //else
        PlayImgTimeoutId = setTimeout(nextImg, SlideShowIntervalMs);
}
/*
function nextImg2() {
    if (PageIndexArray[ShowPageIndex] == IndexRange[1]) {
        alert("This is the last record: " + PageIndexArray[ShowPageIndex]);
        return;
    }
    if (Filter) {
        //let chickIdValue = document.getElementById("chickIdFilterId").value;
        //if (!chickIdValue) chickIdValue = 0;
        //let userIdValue = document.getElementById("userIdFilterId").value;
        //if (!userIdValue) userIdValue = 0;
        $.ajax({
            type: "POST",
            url: "/selectImages/offset/0/limit/1",
            data: createFilterJsonStr(PageIndexArray[ShowPageIndex] + 1),
            //async: false,
            success: function (json) {
                try {
                    if (json.items.length > 0) {
                        document.getElementById('imageModal').style.opacity = 1;
                        addSlideShowEventListner();
                        showImage(ShowPageIndex + 1);
                        let lastImageIdOfCurrentPage = Number(document.getElementById('tableBody').lastChild.children[1].innerHTML);
                        if (PageIndexArray[ShowPageIndex] > lastImageIdOfCurrentPage) clickNextPage();
                        if (PlayImg) PlayImgTimeoutId = setTimeout(nextImg, SlideShowIntervalMs);
                    }
                    else {
                        document.getElementById('imageModal').style.opacity = 0.5;
                        removeSlideShowEventListner();
                        showImage(ShowPageIndex + 1);
                        nextImg();
                    }
                }
                catch (error) {
                    console.error(error.stack);
                    document.getElementById('imageModal').style.opacity = 1;
                    alert("may reach the last record, " + "Error message: " + error.message);
                }

            },
            error: function (json) {
                console.log(("nextimage error"));
                alert(json.responseJSON.message);
            }
        });
    }
    else {
        showImage(ShowPageIndex + 1);
        let lastImageIdOfCurrentPage = Number(document.getElementById('tableBody').lastChild.children[1].innerHTML);
        if (PageIndexArray[ShowPageIndex] > lastImageIdOfCurrentPage) clickNextPage();
        if (PlayImg) PlayImgTimeoutId = setTimeout(nextImg, SlideShowIntervalMs);
    }
}

function showBox(selectorEle) {
    let boxWrapEle = document.getElementById('objBoxWrapperId-0');
    let heatmapBox = document.getElementById('heatmapImgId-0');
    switch (selectorEle.value) {
        case "1":
            boxWrapEle.style.display = "block";
            PageStatus.boxDisplay = "block";
            if (heatmapBox) {
                heatmapBox.style.display = "none";
                PageStatus.heatmapDisplay = "none";
            }
            break;
        case "2":
            boxWrapEle.style.display = "block";
            PageStatus.boxDisplay = "block";
            if (heatmapBox) {
                heatmapBox.style.display = "block";
                PageStatus.heatmapDisplay = "block";
            } else alert("No heatmap data");
            break;
        case "0":
            boxWrapEle.style.display = "none";
            PageStatus.boxDisplay = "none";
            if (heatmapBox) {
                heatmapBox.style.display = "none";
                PageStatus.heatmapDisplay = "none";
            }
            break;
    }
}

function hideBox(button) {
    let boxWrapEle = document.getElementById('objBoxWrapperId-0');
    let heatmapBox = document.getElementById('heatmapImgId-0');
    switch (PageStatus.status) {
        case 0:
            boxWrapEle.style.display = "block";
            PageStatus.boxDisplay = "block";
            if (heatmapBox) {
                heatmapBox.style.display = "none";
                PageStatus.heatmapDisplay = "none";
                button.innerHTML = "Show Heatmap";
            } else {
                button.innerHTML = "Hide Boxes";
                PageStatus.status++;
            }
            PageStatus.status++;
            break;
        case 1:
            boxWrapEle.style.display = "block";
            PageStatus.boxDisplay = "block";
            heatmapBox.style.display = "block";
            PageStatus.heatmapDisplay = "block";
            button.innerHTML = "Hide Box/Heatmap";
            PageStatus.status++;
            break;
        case 2:
            boxWrapEle.style.display = "none";
            PageStatus.boxDisplay = "none";
            if (heatmapBox) heatmapBox.style.display = "none";
            PageStatus.heatmapDisplay = "none";
            button.innerHTML = "Show Boxes";
            PageStatus.status = 0;
            break;
    }
}
*/

function exportImages(crop) {
    let url = "/exportImages/0";
    if (crop) url = "/exportImages/1";
    document.getElementById("downloadZipId").innerHTML = "wait for a download link";
    $.ajax({
        type: "GET",
        url: url,
        success: function (fileName) {
            let elem = document.getElementById("downloadZipId");
            elem.href = "/downloadZip/" + fileName;
            elem.innerHTML = "Download " + fileName;
            elem.style = "visibility:visible";
            //alert("export done. Download " + fileName);
        },
        error: function (json) {
            alert(json.responseJSON.message);
        }
    });
}

function exportImageFiles(crop) {
    document.getElementById("downloadZipId").innerHTML = "wait for a download link";
    let url;
    if (Filter) {
        url = "/exportFilteredImageFiles2/";
        if (crop) url = url + 1;
        else url = url + 0;
        let chickIdValue = document.getElementById("chickIdFilterId").value;
        if (!chickIdValue) chickIdValue = 0;
        let userIdValue = document.getElementById("userIdFilterId").value;
        if (!userIdValue) userIdValue = 0;
        $.ajax({
            type: "POST",
            url: url,
            data: createFilterJsonStr(),
            success: function (fileName) {
                let elem = document.getElementById("downloadZipId");
                elem.href = "/downloadZip/" + fileName;
                elem.innerHTML = "Download " + fileName;
                elem.style = "visibility:visible";
            },
            error: function (json) {
                alert(json.responseJSON.message);
            }
        });
    }
    else {
        url = "/exportImageFiles/";
        if (crop) url = url + 1;
        else url = url + 0;
        $.ajax({
            type: "GET",
            url: url,
            success: function (fileName) {
                let elem = document.getElementById("downloadZipId");
                elem.href = "/downloadZip/" + fileName;
                elem.innerHTML = "Download " + fileName;
                elem.style = "visibility:visible";
            },
            error: function (json) {
                document.getElementById('imageModal').style.opacity = 1;
                alert(json.responseJSON.message);
            }
        });
    }
}

function editRating(selector) {
    //document.forms["editUserForm"].elements["rating"].value = selector.value;
    //editUser();

    $.ajax({
        type: "GET",
        url: 'updateRating/imageId/' + PageIndexArray[ShowPageIndex] + '/rating/' + selector.value,
        async: false,
        success: function (json) {
            //UPDATE AppUser SET trueClass=:user.trueClass WHERE chickId=:user.chickId;
            loadDb((CurrentPage - 1) * Limit, Limit);
        },
        error: function (json) {
            alert(json.responseJSON.message);
        }
    });
}


function editTrueClass(elem) {
    let userId;
    let chickId;
    let trueClass;
    if (elem) {
        userId = ImageInfoJson.userId;
        chickId = ImageInfoJson.info.chickId;
        trueClass = elem.value;
    }
    else {
        let editForm = document.forms["editUserForm"];
        userId = editForm.elements["userId"].value;
        chickId = editForm.elements["chickId"].value;
        trueClass = editForm.elements["trueClass"].value;
    }
    $.ajax({
        type: "GET",
        url: 'updateTrueClass/userId/' + userId + '/chickId/' + chickId + '/trueClass/' + trueClass,
        async: false,
        success: function (json) {
            //UPDATE AppUser SET trueClass=:user.trueClass WHERE chickId=:user.chickId;
            loadDb((CurrentPage - 1) * Limit, Limit);
        },
        error: function (json) {
            alert(json.responseJSON.message);
        }
    });
}

function editObservedClass(elem) {
    let userId;
    let chickId;
    let observedClass;
    if (elem) {
        userId = ImageInfoJson.userId;
        chickId = ImageInfoJson.info.chickId;
        observedClass = elem.value;
    }
    else {
        let editForm = document.forms["editUserForm"];
        userId = editForm.elements["userId"].value;
        chickId = editForm.elements["chickId"].value;
        observedClass = editForm.elements["observedClass"].value;
    }
    $.ajax({
        type: "GET",
        url: 'updateObservedClass/userId/' + userId + '/chickId/' + chickId + '/observedClass/' + observedClass,
        async: false,
        success: function (json) {
            loadDb((CurrentPage - 1) * Limit, Limit);
        },
        error: function (json) {
            alert(json.responseJSON.message);
        }
    });
}

/*
function sendARecordServer(imageDto) {
    let boxList = imageDto.boxList;
    let userId = document.getElementById("sendUserIdId").value;
    if (!userId) userId = imageDto.userId;
    if (!userId) userId = 1;
    for (i = 0; i < boxList.length; i++) {
        switch (boxList[i].sex) {
            case 0: boxList[i].sex = 10;
                console.log("Female");
                break;
            case 1: boxList[i].sex = 11;
                console.log("Male");
                break;
        }
        let extendEdge = (boxList[i].top < 0) || (boxList[i].left < 0) || ((boxList[i].left + boxList[i].width) > 100) || ((boxList[i].top + boxList[i].height) > 100);
        if (extendEdge) {
            console.log("box extends image border");
            ++document.getElementById("indexShowBoxId").value;
            setTimeout(sendARecord, 100);
        }
    }
    let url = document.getElementById("serverUrlId").value;
    $.ajax({
        type: "POST",
        url: '/detectObject3/' + userId,
        data: JSON.stringify(imageDto),
        async: false,
        success: function (json) {
            ++document.getElementById("indexShowBoxId").value;
            setTimeout(sendARecord, 100);
        },
        error: function (json) {
            alert(json.statusText);
        }
    });
}
*/

function sendARecord() {
    //if (document.getElementById("taskSelectorId").value != "3") return;
    let index = ImageInfoJson.id;
    var userId = document.getElementById("serverUserIdSelectorId").value;
    var ip = document.getElementById("serverIpId").value;
    var port = document.getElementById("serverPortId").value;
    var IP =
        $.ajax({
            type: "POST",
            url: 'sendServer/' + index + "/userId/" + userId,
            data: '{"serverIp": "' + ip + '", "serverPort": ' + port + '}',
            async: false,
            success: function (json) {
                console.log(json);
                let objBoxWrapper = document.getElementById('objBoxWrapperId-0');
                objBoxWrapper.innerHTML = "";
                createBoxes(json, objBoxWrapper);
            },
            error: function (json) {
                alert(json.statusText);
            }
        });
}

/*
let PauseSendARecord = true;
function sendRecords() {
    PauseSendARecord = !PauseSendARecord;
    if (PauseSendARecord) document.getElementById("sendRecordButtonId").value = "Restart Sending Records to";
    else document.getElementById("sendRecordButtonId").value = "Sending Records to (Click to Pause)";
    var pageIndex =
        sendARecord(PageIndexArray.indexOf(Number(document.getElementById("indexShowBoxId").value)));
}
*/

function updateConfusionMatrix() {
    //console.log(JSON.stringify(json));
    if (ConfusionMatrix.mode) document.getElementById("predictedTableHeader").innerHTML = "Observed";
    else document.getElementById("predictedTableHeader").innerHTML = "Predicted";

    if (ConfusionMatrix.chickIdList.length) alert("missing chickIdList: " + ConfusionMatrix.chickIdList);

    document.getElementById("confusionMx-1.1").innerHTML = ConfusionMatrix.TP;
    document.getElementById("confusionMx-1.2").innerHTML = ConfusionMatrix.FP;
    document.getElementById("confusionMx-1.3").innerHTML = ConfusionMatrix.UKP;
    document.getElementById("confusionMx-1.4").innerHTML = ConfusionMatrix.TP + ConfusionMatrix.FP + ConfusionMatrix.UKP;
    document.getElementById("confusionMx-2.1").innerHTML = ConfusionMatrix.FN;
    document.getElementById("confusionMx-2.2").innerHTML = ConfusionMatrix.TN;
    document.getElementById("confusionMx-2.3").innerHTML = ConfusionMatrix.UKN;
    document.getElementById("confusionMx-2.4").innerHTML = ConfusionMatrix.FN + ConfusionMatrix.TN + ConfusionMatrix.UKN;
    document.getElementById("confusionMx-3.1").innerHTML = ConfusionMatrix.UP;
    document.getElementById("confusionMx-3.2").innerHTML = ConfusionMatrix.UN;
    document.getElementById("confusionMx-3.3").innerHTML = ConfusionMatrix.UUK;
    document.getElementById("confusionMx-3.4").innerHTML = ConfusionMatrix.UP + ConfusionMatrix.UN + ConfusionMatrix.UUK;
    document.getElementById("confusionMx-4.1").innerHTML = ConfusionMatrix.P;
    document.getElementById("confusionMx-4.2").innerHTML = ConfusionMatrix.N;
    document.getElementById("confusionMx-4.3").innerHTML = ConfusionMatrix.UK;
    document.getElementById("confusionMx-4.4").innerHTML = ConfusionMatrix.P + ConfusionMatrix.N + ConfusionMatrix.UK;

    document.getElementById("accuracyId").value = (ConfusionMatrix.TP + ConfusionMatrix.TN) / (ConfusionMatrix.P + ConfusionMatrix.N) * 100;
    document.getElementById("accuracy2Id").value = (ConfusionMatrix.TP + ConfusionMatrix.TN) / (ConfusionMatrix.P - ConfusionMatrix.UP + ConfusionMatrix.N - ConfusionMatrix.UN) * 100;
    if (ConfusionMatrix.mode == 0) document.getElementById("predictedClsButtonId").checked = true;
    else document.getElementById("observedClsButtonId").checked = true;
}
/*
let chickIdValue = document.getElementById("chickIdFilterId").value;
        if (!chickIdValue) chickIdValue = 0;
        let userIdValue = document.getElementById("userIdFilterId").value;
        if (!userIdValue) userIdValue = 0;
*/
/*
function confusionMatrix() {
if (Filter) {
    let chickIdValue = document.getElementById("chickIdFilterId").value;
    if (!chickIdValue) chickIdValue = 0;
    let userIdValue = document.getElementById("userIdFilterId").value;
    if (!userIdValue) userIdValue = 0;
    $.ajax({
        type: "POST",
        url: 'filteredConfusionMatrix/femaleScore/' + document.getElementById("femaleThresholdId").value + '/maleScore/' + document.getElementById("maleThresholdId").value,
        data: createFilterJsonStr(),
        asyc: false,
        success: function (json) {
            ConfusionMatrix = json;
            updateConfusionMatrix();

            indicator.hide();
        },
        error: function (json) {
            alert(json.responseJSON.message);
        }
    });
}
else
    $.ajax({
        type: "GET",
        url: 'confusionMatrix/femaleScore/' + document.getElementById("femaleThresholdId").value + '/maleScore/' + document.getElementById("maleThresholdId").value,
        asyc: false,
        success: function (json) {
            ConfusionMatrix = json;
            updateConfusionMatrix();

            indicator.hide();
        },
        error: function (json) {
            alert(json.responseJSON.message);
        }
    });
}
*/

function adminMode(buttonEle) {
    if (!AdminMode) {
        AdminMode = true;
        buttonEle.value = "Switch to User Mode";
        document.forms["editUserForm"].elements["userId"].disabled = false;
        document.forms["editUserForm"].elements["userName"].disabled = false;
        document.forms["editUserForm"].elements["date"].disabled = false;
        document.forms["editUserForm"].elements["breed"].disabled = false;
        document.forms["editUserForm"].elements["chickId"].disabled = false;
        document.forms["editUserForm"].elements["width"].disabled = false;
        document.forms["editUserForm"].elements["height"].disabled = false;
        document.forms["editUserForm"].elements["device"].disabled = false;
        document.forms["editUserForm"].elements["image"].disabled = false;
        document.forms["editUserForm"].elements["boxList"].disabled = false;
    } else {
        AdminMode = false;
        buttonEle.value = "Switch to Admin Mode";
        document.forms["editUserForm"].elements["userId"].disabled = true;
        document.forms["editUserForm"].elements["userName"].disabled = true;
        document.forms["editUserForm"].elements["date"].disabled = true;
        document.forms["editUserForm"].elements["breed"].disabled = true;
        document.forms["editUserForm"].elements["chickId"].disabled = true;
        document.forms["editUserForm"].elements["width"].disabled = true;
        document.forms["editUserForm"].elements["height"].disabled = true;
        document.forms["editUserForm"].elements["device"].disabled = true;
        document.forms["editUserForm"].elements["image"].disabled = true;
        document.forms["editUserForm"].elements["boxList"].disabled = true;
    }
}

function numberOfRecords() {
    document.getElementById("numEntryId").value = "wait for the number showing up";
    if (!Filter)
        $.ajax({
            type: "GET",
            url: '/getNumberOfRecords',
            async: false,
            success: function (jsonStr) {
                let count = JSON.parse(jsonStr)[0]['count(*)'];
                document.getElementById("numEntryId").value = count;
                getIndexRange();
            },
            error: function (json) {
                alert(json.responseJSON.message);
            }
        });
    else {
        let chickIdValue = document.getElementById("chickIdFilterId").value;
        if (!chickIdValue) chickIdValue = 0;
        let userIdValue = document.getElementById("userIdFilterId").value;
        if (!userIdValue) userIdValue = 0;
        $.ajax({
            type: "POST",
            url: '/getNumberOfFilteredRecords',
            data: createFilterJsonStr(),
            async: false,
            success: function (jsonStr) {
                let count = JSON.parse(jsonStr)[0]['count(*)'];
                document.getElementById("numEntryId").value = count;
                getIndexRange();
            },
            error: function (json) {
                alert(json.responseJSON.message);
            }
        });
    }
}

let IndexRange = [0, 100];
function getIndexRange() {
    if (!Filter)
        $.ajax({
            type: "GET",
            url: '/getIndexRange',
            async: false,
            success: function (jsonStr) {
                let list = JSON.parse(jsonStr);
                IndexRange[0] = list[0].id;
                IndexRange[1] = list[1].id;
                console.log("IndexRang: " + IndexRange);
            },
            error: function (json) {
                alert(json.responseJSON.message);
            }
        });
    else {
        let chickIdValue = document.getElementById("chickIdFilterId").value;
        if (!chickIdValue) chickIdValue = 0;
        let userIdValue = document.getElementById("userIdFilterId").value;
        if (!userIdValue) userIdValue = 0;
        $.ajax({
            type: "POST",
            url: '/getFilteredIndexRange',
            data: createFilterJsonStr(),
            async: false,
            success: function (jsonStr) {
                let list = JSON.parse(jsonStr);
                IndexRange[0] = list[0].id;
                IndexRange[1] = list[1].id;
                console.log("IndexRang: " + IndexRange);
            },
            error: function (json) {
                alert(json.responseJSON.message);
            }
        });
    }
}

/*
function createColumnMenu() {
    $.ajax({
        type: "GET",
        url: '/columnRange',
        success: function (jsonStr) {
            let columnListJson = JSON.parse(jsonStr);
            let columnMaxList = columnListJson.columnMaxList[0];
            let columnMinList = columnListJson.columnMinList[0];
            let selectEle = document.getElementById("userIdFilterId")
            selectEle.innerHTML = "<option value=0 disabled selected>User ID</option>";
            for (i = columnMinList.userId; i < columnMaxList.userId + 1; i++) {
                let optionEle = document.createElement("option");
                optionEle.value = i;
                optionEle.innerHTML = i;
                selectEle.appendChild(optionEle);
            }
            columnMaxList = columnListJson.columnMaxList[1];
            columnMinList = columnListJson.columnMinList[1];
            selectEle = document.getElementById("chickIdFilterId")
            selectEle.innerHTML = "<option value=0 disabled selected>Cick ID</option>";
            for (i = columnMinList.chickId; i < columnMaxList.chickId + 1; i++) {
                let optionEle = document.createElement("option");
                optionEle.value = i;
                optionEle.innerHTML = i;
                selectEle.appendChild(optionEle);
            };
            selectEle = document.getElementById("chickIdSelectorId")
            selectEle.innerHTML = "";
            for (i = columnMinList.chickId; i < columnMaxList.chickId + 1; i++) {
                let optionEle = document.createElement("option");
                optionEle.value = i;
                optionEle.innerHTML = i;
                selectEle.appendChild(optionEle);
            };
        },
        error: function (json) {
            alert(json.responseJSON.message);
        }
    });

}
*/

let ConfusionMatrix;
function getConfusionMatrix() {
    $.ajax({
        type: "GET",
        url: '/getConfusionMatrix',
        success: function (json) {
            ConfusionMatrix = json;
            updateConfusionMatrix();
            //createColumnMenu();
        },
        error: function (json) {
            alert(json.responseJSON.message);
        }
    });
}

function setConfuusionMatrixMode(buttonEle) {
    //console.log(buttonEle.id);
    document.getElementById("femaleThresholdId").disabled = true;
    document.getElementById("maleThresholdId").disabled = true;
    if (buttonEle.id == "predictedClsButtonId") {
        ConfusionMatrix.mode = 0;
        //document.getElementById("predictedTableHeader").innerHTML = "Predicted";
        document.getElementById("femaleThresholdId").disabled = false;
        document.getElementById("maleThresholdId").disabled = false;
    }
    else {
        ConfusionMatrix.mode = 1;
        //document.getElementById("predictedTableHeader").innerHTML = "Observed";
        document.getElementById("femaleThresholdId").disabled = true;
        document.getElementById("maleThresholdId").disabled = true;
    }
    $.ajax({
        type: "POST",
        url: '/setConfusionMatrix',
        data:
            JSON.stringify(ConfusionMatrix),
        success: function (json) {
            ConfusionMatrix = json;
            updateConfusionMatrix(json);
        },
        error: function (json) {
            alert(json.responseJSON.message);
        }
    });
}

function addSlideShowEventListner() {
    document.getElementById("lastButtonId").addEventListener('click', lastImg);
    document.getElementById("nextButtonId").addEventListener('click', nextImg);
    document.getElementById("nextChickIdButtonId").addEventListener('click', nextChickIdImg);
    document.getElementById("lastChickIdButtonId").addEventListener('click', lastChickIdImg);
}

function removeSlideShowEventListner() {
    document.getElementById("nextButtonId").removeEventListener('click', nextImg);
    document.getElementById("lastButtonId").removeEventListener('click', lastImg);
    document.getElementById("nextChickIdButtonId").removeEventListener('click', nextChickIdImg);
    document.getElementById("lastChickIdButtonId").removeEventListener('click', lastChickIdImg);
}

function clickNext() {
    let event = new Event("click");
    document.getElementById("nextButtonId").dispatchEvent(event);
}

function clickLast() {
    let event = new Event("click");
    document.getElementById("lastButtonId").dispatchEvent(event);
}

function clickNextPage() {
    let event = new Event("click");
    document.getElementById("nextPageButtonId").dispatchEvent(event);
}

function clickPreviousPage() {
    let event = new Event("click");
    document.getElementById("previousPageButtonId").dispatchEvent(event);
}

function selectChickId(chickId) {
    document.getElementById("chickIdSelectorId").value = chickId;
    let event = new Event("change");
    document.getElementById("chickIdSelectorId").dispatchEvent(event);
}

function clickImageFileRead() {
    let event = new Event("change");
    document.getElementById('imageFileReadButtonId').dispatchEvent(event);
}

function changeSlideShowInterval(selectionEle) {
    SlideShowIntervalMs = selectionEle.value * 1000;
}

function nextChickIdImg() {
    console.log("nextChickIdImg() called");
    var currentIndexOfChickIdList = ChickIdList.indexOf(ImageInfoJson.info.chickId);
    if (currentIndexOfChickIdList + 1 == ChickIdList.length) {
        alert("last Chick ID");
        stopPlayImg();
        return;
    } else if (currentIndexOfChickIdList == -1) {
        alert("Chick ID: " + ImageInfoJson.info.chickId + " is missing.");
        return;
    }
    document.getElementById("chickIdFilterId").value = ChickIdList[currentIndexOfChickIdList + 1];
    document.getElementById("userIdFilterId").value = ImageInfoJson.userId;
    if (showChickIdImg()) {
        ImageInfoJson.info.chickId++;
        nextChickIdImg();
    }
    if (PlayImg) PlayImgTimeoutId = setTimeout(nextChickIdImg, SlideShowIntervalMs);
}

function lastChickIdImg() {
    console.log("lastChickIdImg() called");
    var currentIndexOfChickIdList = ChickIdList.indexOf(ImageInfoJson.info.chickId);
    if (currentIndexOfChickIdList == 0) {
        alert("first Chick ID");
        stopPlayImg();
        return;
    } else if (currentIndexOfChickIdList == -1) {
        alert("Chick ID: " + ImageInfoJson.info.chickId + " is missing.");
        //ImageInfoJson.info.chickId--; //
        //lastChickIdImg();
        return;
    }
    document.getElementById("chickIdFilterId").value = ChickIdList[currentIndexOfChickIdList - 1];
    document.getElementById("userIdFilterId").value = ImageInfoJson.userId;
    if (showChickIdImg()) {
        ImageInfoJson.info.chickId--;
        lastChickIdImg();
    }
    if (PlayImg) PlayImgTimeoutId = setTimeout(lastChickIdImg, SlideShowIntervalMs);
}

function jumpUserIdImg() {
    let userId = document.getElementById("userIdSelectorId").value;
    document.getElementById("userIdFilterId").value = userId;
    updateChickIdSelectorOptions(userId);
    document.getElementById("chickIdFilterId").value = document.getElementById("chickIdSelectorId").value;
    showChickIdImg();
}
function jumpChickIdImg() {
    document.getElementById("userIdFilterId").value = document.getElementById("userIdSelectorId").value;
    document.getElementById("chickIdFilterId").value = document.getElementById("chickIdSelectorId").value;
    showChickIdImg();
}

let UserIdChickIdList = [{ "userId": 1, "chickIdList": [1, 2, 3, 5, 7] }, { "userId": 2, "chickIdList": [1, 2, 4, 5] }];
function updateUserIdChickIdList(json) {
    UserIdChickIdList = [];
    var jsonEle = null;
    var userIdArr = [];
    //var userIdValue = 0;
    //var chickIdValue = 0;
    for (i = 0; i < json.length; i++) {
        if (!userIdArr.includes(json[i].userId)) {
            userIdArr.push(json[i].userId);
            if (jsonEle) UserIdChickIdList.push(jsonEle);
            jsonEle = {};
            jsonEle.userId = json[i].userId;
            jsonEle.chickIdList = [];
            //chickIdValue = json[i].chickId;
            jsonEle.chickIdList.push(json[i].chickId);
            //UserIdChickIdList.push(json[i]);
            //userIdValue = json[i].userId;
        } else if (!jsonEle.chickIdList.includes(json[i].chickId)) {
            jsonEle.chickIdList.push(json[i].chickId);
            //chickIdValue = json[i].chickId;
        }
    }
    UserIdChickIdList.push(jsonEle);
    updateUserIdSelectorOptions(userIdArr);
    console.log(UserIdChickIdList);
}

function getUserIdChickIdList() {
    //if (!Filter)
    $.ajax({
        type: "GET",
        url: '/getUserIdChickIdList',
        async: false,
        success: function (jsonStr) {
            updateUserIdChickIdList(JSON.parse(jsonStr));
        },
        error: function (json) {
            alert(json.responseJSON.message);
        }
    });
    /*
    else 
    $.ajax({
        type: "POST",
        url: '/getUserIdChickIdListFiltered',
        data: createFilterJsonStr(),
        success: function (jsonStr) {
            updateUserIdChickIdList(JSON.parse(jsonStr));
        },
        error: function (json) {
            alert(json.responseJSON.message);
        }
    });
    */
}

function updateUserIdSelectorOptions(userIdArr) {
    var selectorEle = document.getElementById("userIdFilterId");
    selectorEle.innerHTML = "<option value=0 disabled selected>User ID</option>";
    for (i = 0; i < userIdArr.length; i++) {
        var optionEle = document.createElement("option");
        optionEle.value = userIdArr[i];
        optionEle.innerHTML = userIdArr[i];
        selectorEle.appendChild(optionEle);
    }
    selectorEle = document.getElementById("userIdSelectorId");
    selectorEle.innerHTML = "";
    for (i = 0; i < userIdArr.length; i++) {
        var optionEle = document.createElement("option");
        optionEle.value = userIdArr[i];
        optionEle.innerHTML = userIdArr[i];
        selectorEle.appendChild(optionEle);
    }
    updateChickIdSelectorOptions(document.getElementById("userIdSelectorId"));
}

let ChickIdList;
function updateChickIdSelectorOptions(userIdSelectorEle) {
    var userId = userIdSelectorEle.value;
    if (!userId) return;
    for (i = 0; i < UserIdChickIdList.length; i++) {
        if (UserIdChickIdList[i].userId == userId) {
            ChickIdList = UserIdChickIdList[i].chickIdList;
            break;
        }
    }
    var selectorEle = document.getElementById("chickIdFilterId");
    selectorEle.innerHTML = "<option value=0 disabled selected>Cick ID</option><option value=0>All</option>";
    let optionEle;
    for (i = 0; i < ChickIdList.length; i++) {
        optionEle = document.createElement("option");
        optionEle.value = ChickIdList[i];
        optionEle.innerHTML = ChickIdList[i];
        selectorEle.appendChild(optionEle);
    }
    selectorEle = document.getElementById("chickIdSelectorId");
    selectorEle.innerHTML = "";
    for (i = 0; i < ChickIdList.length; i++) {
        optionEle = document.createElement("option");
        optionEle.value = ChickIdList[i];
        optionEle.innerHTML = ChickIdList[i];
        selectorEle.appendChild(optionEle);
    }
}

function autoCalc(elem) {
    if (document.getElementById("autoCalcCheckId").checked)
        switch (document.getElementById("taskSelectorId").value) {
            case "1":
                adjustRating();
                break;
            case "3":
                if (elem) {
                    document.getElementById("userIdFilterId").value = ImageInfoJson.userId;
                    document.getElementById("chickIdFilterId").value = ImageInfoJson.info.chickId;
                }
                calcPredictedClass();
                break;
            case "4":
                if (elem) {
                    document.getElementById("userIdFilterId").value = ImageInfoJson.userId;
                    document.getElementById("chickIdFilterId").value = ImageInfoJson.info.chickId;
                }
                calcObservedClass();
                break;
            case "5":
                sendARecord();
                break;
        }
}

function adjustRating() {

}

function showChickIdImg() {
    applyFilter();
    pageJump(1);
    console.log("showChickId");
    if (PageIndexArray.length == 0) {
        console.log("no record with userId:" + document.getElementById("userIdFilterId").value + ", chickId: " + document.getElementById("chickIdFilterId").value);
        return 1;
    }
    showImage(0);
    //autoCalc();
    return 0;
}

function changeTask(selectorEle) {
    document.getElementById("autoCalcCheckId").checked = false;
    switch (selectorEle.value) {
        case "0":
            document.getElementById("modalFooter2Id").style.display = "none";

            document.getElementById("nextButtonId").addEventListener('click', nextImg);
            document.getElementById("nextButtonId").removeEventListener('click', nextChickIdImg);
            document.getElementById("lastButtonId").addEventListener('click', lastImg);
            document.getElementById("lastButtonId").removeEventListener('click', lastChickIdImg);

            break;
        case "1":
            document.getElementById("modalFooter2Id").style.display = "block";

            document.getElementById("userIdSelectorColumnId").style.display = "block";
            document.getElementById("chickIdSelectorColumnId").style.display = "block";

            document.getElementById("ratingColumnId").style.display = "block";
            document.getElementById("trueClassColumnId").style.display = "none";
            document.getElementById("predictedClassColumnId").style.display = "none";
            document.getElementById("observedClassColumnId").style.display = "none";

            document.getElementById("serverIpColumnId").style.display = "none";
            document.getElementById("serverPortColumnId").style.display = "none";
            document.getElementById("serverUserIdSelecColumnId").style.display = "none";

            document.getElementById("yoloThresholdColumnId").style.display = "block";
            document.getElementById("yoloThreshold2ColumnId").style.display = "block";
            document.getElementById("widthThresholdColumnId").style.display = "block";
            document.getElementById("heightThresholdColumnId").style.display = "block";
            document.getElementById("observedClassMaleThresholdColumnId").style.display = "none";
            document.getElementById("observedClassFemaleThresholdColumnId").style.display = "none";

            document.getElementById("autoCalcColumnId").style.display = "block";

            document.getElementById("nextButtonId").addEventListener('click', nextImg);
            document.getElementById("nextButtonId").removeEventListener('click', nextChickIdImg);
            document.getElementById("lastButtonId").addEventListener('click', lastImg);
            document.getElementById("lastButtonId").removeEventListener('click', lastChickIdImg);
            break;
        case "2":
            document.getElementById("modalFooter2Id").style.display = "block";

            document.getElementById("userIdSelectorColumnId").style.display = "block";
            document.getElementById("chickIdSelectorColumnId").style.display = "block";

            document.getElementById("ratingColumnId").style.display = "none";
            document.getElementById("trueClassColumnId").style.display = "block";
            document.getElementById("predictedClassColumnId").style.display = "none";
            document.getElementById("observedClassColumnId").style.display = "none";

            document.getElementById("serverIpColumnId").style.display = "none";
            document.getElementById("serverPortColumnId").style.display = "none";
            document.getElementById("serverUserIdSelecColumnId").style.display = "none";

            document.getElementById("yoloThresholdColumnId").style.display = "none";
            document.getElementById("yoloThreshold2ColumnId").style.display = "none";
            document.getElementById("widthThresholdColumnId").style.display = "none";
            document.getElementById("heightThresholdColumnId").style.display = "none";
            document.getElementById("observedClassMaleThresholdColumnId").style.display = "none";
            document.getElementById("observedClassFemaleThresholdColumnId").style.display = "none";
            document.getElementById("autoCalcColumnId").style.display = "none";

            document.getElementById("nextButtonId").removeEventListener('click', nextImg);
            document.getElementById("nextButtonId").addEventListener('click', nextChickIdImg);
            document.getElementById("lastButtonId").removeEventListener('click', lastImg);
            document.getElementById("lastButtonId").addEventListener('click', lastChickIdImg);
            break;
        case "3":
            document.getElementById("modalFooter2Id").style.display = "block";

            document.getElementById("userIdSelectorColumnId").style.display = "block";
            document.getElementById("chickIdSelectorColumnId").style.display = "block";

            document.getElementById("ratingColumnId").style.display = "none";
            document.getElementById("trueClassColumnId").style.display = "none";
            document.getElementById("predictedClassColumnId").style.display = "block";
            document.getElementById("observedClassColumnId").style.display = "none";

            document.getElementById("serverIpColumnId").style.display = "none";
            document.getElementById("serverPortColumnId").style.display = "none";
            document.getElementById("serverUserIdSelecColumnId").style.display = "none";

            document.getElementById("yoloThresholdColumnId").style.display = "none";
            document.getElementById("yoloThreshold2ColumnId").style.display = "none";
            document.getElementById("widthThresholdColumnId").style.display = "none";
            document.getElementById("heightThresholdColumnId").style.display = "none";
            document.getElementById("observedClassMaleThresholdColumnId").style.display = "none";
            document.getElementById("observedClassFemaleThresholdColumnId").style.display = "none";

            document.getElementById("autoCalcColumnId").style.display = "block";

            document.getElementById("nextButtonId").addEventListener('click', nextImg);
            document.getElementById("nextButtonId").removeEventListener('click', nextChickIdImg);
            document.getElementById("lastButtonId").addEventListener('click', lastImg);
            document.getElementById("lastButtonId").removeEventListener('click', lastChickIdImg);
            break;
        case "4":
            document.getElementById("modalFooter2Id").style.display = "block";

            document.getElementById("userIdSelectorColumnId").style.display = "block";
            document.getElementById("chickIdSelectorColumnId").style.display = "block";

            document.getElementById("userIdSelectorColumnId").style.display = "block";
            document.getElementById("chickIdSelectorColumnId").style.display = "block";

            document.getElementById("ratingColumnId").style.display = "none";
            document.getElementById("trueClassColumnId").style.display = "none";
            document.getElementById("predictedClassColumnId").style.display = "none";
            document.getElementById("observedClassColumnId").style.display = "block";

            document.getElementById("yoloThresholdColumnId").style.display = "none";
            document.getElementById("yoloThreshold2ColumnId").style.display = "none";
            document.getElementById("widthThresholdColumnId").style.display = "none";
            document.getElementById("heightThresholdColumnId").style.display = "none";
            document.getElementById("serverIpColumnId").style.display = "none";
            document.getElementById("serverPortColumnId").style.display = "none";
            document.getElementById("serverUserIdSelecColumnId").style.display = "none";

            document.getElementById("autoCalcColumnId").style.display = "block";

            document.getElementById("observedClassMaleThresholdColumnId").style.display = "block";
            document.getElementById("observedClassFemaleThresholdColumnId").style.display = "block";

            document.getElementById("nextButtonId").removeEventListener('click', nextImg);
            document.getElementById("nextButtonId").addEventListener('click', nextChickIdImg);
            document.getElementById("lastButtonId").removeEventListener('click', lastImg);
            document.getElementById("lastButtonId").addEventListener('click', lastChickIdImg);
            break;
        case "5":
            document.getElementById("modalFooter2Id").style.display = "block";

            document.getElementById("userIdSelectorColumnId").style.display = "none";
            document.getElementById("chickIdSelectorColumnId").style.display = "none";

            document.getElementById("ratingColumnId").style.display = "none";
            document.getElementById("trueClassColumnId").style.display = "none";
            document.getElementById("predictedClassColumnId").style.display = "none";
            document.getElementById("observedClassColumnId").style.display = "none";

            document.getElementById("serverIpColumnId").style.display = "block";
            document.getElementById("serverPortColumnId").style.display = "block";
            document.getElementById("serverUserIdSelecColumnId").style.display = "block";

            document.getElementById("autoCalcColumnId").style.display = "block";

            document.getElementById("yoloThresholdColumnId").style.display = "none";
            document.getElementById("yoloThreshold2ColumnId").style.display = "none";
            document.getElementById("widthThresholdColumnId").style.display = "none";
            document.getElementById("heightThresholdColumnId").style.display = "none";
            document.getElementById("observedClassMaleThresholdColumnId").style.display = "none";
            document.getElementById("observedClassFemaleThresholdColumnId").style.display = "none";

            document.getElementById("nextButtonId").addEventListener('click', nextImg);
            document.getElementById("nextButtonId").removeEventListener('click', nextChickIdImg);
            document.getElementById("lastButtonId").addEventListener('click', lastImg);
            document.getElementById("lastButtonId").removeEventListener('click', lastChickIdImg);
            break;
    }


}

/*
class FileReaderEx extends FileReader {
    constructor() {
        super();
    }

    #readAs(blob, ctx) {
        return new Promise((res, rej) => {
            super.addEventListener("load", ({ target }) => res(target.result));
            super.addEventListener("error", ({ target }) => rej(target.error));
            super[ctx](blob);
        });
    }

    readAsArrayBuffer(blob) {
        return this.#readAs(blob, "readAsArrayBuffer");
    }

    readAsDataURL(blob) {
        return this.#readAs(blob, "readAsDataURL");
    }

    readAsText(blob) {
        return this.#readAs(blob, "readAsText");
    }
}
*/

function setFilter(trueClass, calcClass) {
    if (trueClass == 99 && calcClass == 99) resetFilter();
    else {
        //console.log("setFilter(" + trueClass + ", " + calcClass + ")");
        document.getElementById("trueClassFilterId").value = trueClass;
        if (document.getElementById("predictedClsButtonId").checked)
            document.getElementById("predictedClassFilterId").value = calcClass;
        else document.getElementById("observedClassFilterId").value = calcClass;
    }
    applyFilter();
}

function resetRating() {
    console.log("resetRating() called");
    $.ajax({
        type: "GET",
        url: '/resetRating/1',
        //async: false,
        success: function (json) {
            loadDb(0, Limit);
        },
        error: function (json) {
            alert(json.responseJSON.message);
        }
    });
}

(function ($) {
    var indicatorController = {
        __name: 'indicatorController',

        '#confusionMatrixButtonId click': function () {
            //show indicator
            var indicator = this.indicator({
                message: 'caluculating'
            }).show();
            {
                if (Filter) {
                    let chickIdValue = document.getElementById("chickIdFilterId").value;
                    if (!chickIdValue) chickIdValue = 0;
                    let userIdValue = document.getElementById("userIdFilterId").value;
                    if (!userIdValue) userIdValue = 0;
                    $.ajax({
                        type: "POST",
                        url: 'filteredConfusionMatrix/femaleScore/' + document.getElementById("femaleThresholdId").value + '/maleScore/' + document.getElementById("maleThresholdId").value,
                        data: createFilterJsonStr(),
                        asyc: false,
                        success: function (json) {
                            ConfusionMatrix = json;
                            updateConfusionMatrix();

                            //hide indicator
                            indicator.hide();
                        },
                        error: function (json) {
                            alert(json.responseJSON.message);
                        }
                    });
                }
                else
                    $.ajax({
                        type: "GET",
                        url: 'confusionMatrix/femaleScore/' + document.getElementById("femaleThresholdId").value + '/maleScore/' + document.getElementById("maleThresholdId").value,
                        asyc: false,
                        success: function (json) {
                            ConfusionMatrix = json;
                            updateConfusionMatrix();

                            //hide indicator
                            indicator.hide();
                        },
                        error: function (json) {
                            alert(json.responseJSON.message);
                        }
                    });
            }
        },
    };

    $(function () {
        h5.core.controller('#indicator-target', indicatorController);
    });

    //

    //
})(jQuery);

(function ($) {
    var indicatorController3 = {
        __name: 'indicatorController3',
        '#resetRatingButtonId click': function () {
            //show indicator
            var indicator3 = this.indicator({
                message: 'resetting rating'
            }).show();
            {
                $.ajax({
                    type: "GET",
                    url: '/resetRating/1',
                    async: false,
                    success: function (json) {
                        loadDb(0, Limit);
                        indicator3.hide();
                    },
                    error: function (json) {
                        alert(json.responseJSON.message);
                    }
                });
            }
        },
    };

    $(function () {
        h5.core.controller('#indicator-target3', indicatorController3);
    });

    //

    //
})(jQuery);



//var indicator2;
var indicatorController2 = {
    __name: 'indicatorController2',

    '#imageFileReadButtonId change': function () {
        //show indicator
        let indicator2 = this.indicator({
            message: 'adding records'
        }).show();
        {
            var input = document.getElementById("imageFileReadButtonId");
            //console.log("show indicator2: " + input.value);
            //imageFileRead3(input);
            var worker = new Worker("fileworkers.js");
            var numberOfFiles;
            var numberOfFilesAdded = 0;
            var chickIdAddedList = [];
            worker.onmessage = function (event) {
                var ret = event.data;
                if (ret.type.match('image.*')) {
                    var fileName = ret.fileName;
                    var formElements = document.forms['createUser'].elements;
                    formElements['notes'].value = fileName;
                    switch (fileName.substring(1, 2)) {
                        case "F": formElements['trueClass'].value = 0;
                            break;
                        case "M": formElements['trueClass'].value = 1;
                            break;
                        default: formElements['trueClass'].value = -1;
                    }
                    var chickId = Number(fileName.substring(3, 6));
                    if (!isNaN(chickId)) formElements['chickId'].value = chickId;
                    chickIdAddedList.push(chickId);
                    var data = ret.val;
                    data = data.substring(23);
                    document.getElementById("base64Area1").value = data;
                    createNewUser();
                    console.log(numberOfFilesAdded++);
                    if (numberOfFilesAdded == numberOfFiles) {
                        indicator2.hide();
                        alert(numberOfFiles + " files added [" + chickIdAddedList + "]");
                    }

                } else alert("not image file");
            }

            numberOfFiles = input.files.length;
            for (i = 0; i < input.files.length; i++) {
                const file = input.files[i];
                worker.postMessage({ "file": file, "type": file.type });
            }
        }
    },
};

$(function () {
    h5.core.controller('#indicator-target2', indicatorController2);
});

