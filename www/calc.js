function predictClass(boxList) {
    let json = { sex: -1, score: 0 };
    for (i = 0; i < boxList.length; i++) {
        switch (boxList[i].sex) {
            case 0:
                json.sex = 0;
                json.score = boxList[i].score;
                return json;
            case 1:
                json.sex = 1;
                json.score = boxList[i].score;
                return json;
            default: continue;
        }
    }
    return json;
}

function adjustRating() {
    if (ImageInfoJson.info.rating == 5) return;
    let boxList = ImageInfoJson.boxList;
    let yoloScoreThreshold = Number(document.getElementById("yoloThresholdId").value);
    let yoloScoreThreshold2 = Number(document.getElementById("yoloThreshold2Id").value);
    let widthThreshold = Number(document.getElementById("widthThresholdId").value);
    let heightThreshold = Number(document.getElementById("heightThresholdId").value);
    let widthHeightDiff = 10;
    for (i = 0; i < boxList.length; i++) {
        if (boxList[i].sex == 4) {
            if (boxList[i].score > yoloScoreThreshold) {
                ++ImageInfoJson.info.rating;
                if (boxList[i].score > yoloScoreThreshold2) ++ImageInfoJson.info.rating;
                //
                if (heightThreshold < boxList[i].height && boxList[i].height < heightThreshold) ++ImageInfoJson.info.rating;
                if (Math.abs(boxList[i].height - boxList[i].width) < widthHeightDiff) ++ImageInfoJson.info.rating;
                //
            }
            //break;
        } else if (boxList[i].sex == 5) {
            ++ImageInfoJson.info.rating;
        } else continue;
    }
    if (ImageInfoJson.info.rating > 5) ImageInfoJson.info.rating = 5;
    document.getElementById("ratingSelectorId").value = ImageInfoJson.info.rating;
    editRating(document.getElementById("ratingSelectorId"));
}

function calcPredictedClass() {
    let predClassObj = predictClass(ImageInfoJson.boxList);
    document.getElementById("predictedClassSelectorId").value = predClassObj.sex;
    $.ajax({
        type: "GET",
        url: '/updatePredictedClass/' + ImageInfoJson.id + '/' + predClassObj.sex + '/' + predClassObj.score,
        async: false,
        success: function (data) {
            console.log(data);
        },
        error: function (json) {
            alert(json.responseJSON.message);
        }
    });
}

function calcObservedClass() {
    //alert("set calc ObservedClass: " + createFilterJsonStr());
    var filterDto = createFilterJsonStr();
    filterDto = JSON.parse(filterDto);
    filterDto.infoStr = '["id", "predictedClass", "boxListStr"]';
    filterDto = JSON.stringify(filterDto);
    const limit = 100;
    var offset = 0;
    let recordCount = 0;
    let maleCount = 0;
    let femaleCount = 0;
    let stopLoop = false;
    do {
        $.ajax({
            type: "POST",
            url: '/selectUsers/offset/' + offset + '/limit/' + limit,
            data: filterDto,
            async: false,
            success: function (json) {
                var predClass;
                for (var i = 0; i < json.items.length; i++) {
                    predClass = json.items[i].predictedClass;
                    console.log(predClass);
                    recordCount++;
                    switch (predClass) {
                        case 0: femaleCount++
                            break;
                        case 1: maleCount++
                            break;
                    }
                }
                if (json.count < limit) {
                    stopLoop = true;
                }
            },
            error: function (json) {
                alert(json.responseJSON.message);
            }
        });
        offset = offset + limit;
    } while (!stopLoop)
    let observedClass = -1;
    let maleThreshold = document.getElementById("observedClassMaleThresholdId").value / 100;
    let femaleThreshold = document.getElementById("observedClassFemaleThresholdId").value / 100;
    if (maleCount / recordCount > maleThreshold) observedClass = 1;
    else if (femaleCount / recordCount > femaleThreshold) observedClass = 0;
    console.log("chickId: " + document.getElementById("imageInfoChickId").innerHTML + ", observedClass: " + observedClass);
    document.getElementById("observedClassSelectorId").value = observedClass;
    editObservedClass(document.getElementById("observedClassSelectorId"));
}

