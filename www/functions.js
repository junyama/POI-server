var checkbox;
var CurrentPage = 1;
var NumEntry = 0;
var Limit = 10;
var PageMenuLength = 10;

function createNewUser() {
    $.ajax({
        type: "POST",
        url: '/users/',
        data: userDtoStr("createUser"),
        async: false,
        success: function (json) {
            //alert(data.username);
            //addRow(data);
            //loadDbByKey((CurrentPage - 1) * Limit, Limit);
            loadDb((CurrentPage - 1) * Limit, Limit);
            checkbox = $('table tbody input[type="checkbox"]');
            document.getElementById("numEntryId").innerHTML = 'Showing <b>' + Limit + '</b> out of <b>' + (++NumEntry) + '</b> entries';
        },
        error: function (json) {
            alert(json.responseJSON.message);
        }
    });
}

function deleteUser(id) {
    if (id) {
        actionId = id;
    } else if (actionId) {
        $.ajax({
            type: "DELETE",
            url: '/users/' + actionId,
            success: function (json) {
                loadDb((CurrentPage - 1) * Limit, Limit);
                //document.getElementById("numEntryId").innerHTML = 'Showing <b>' + Limit + '</b> out of <b>' + (--NumEntry) + '</b> entries';
            },
            error: function (json) {
                alert(json.responseJSON.message);
            }
        });
        actionId = "";
    } else {
        //document.getElementById('selectAll').checked = false;
        deleteCheckedUsers(0, document.getElementById("tableBody").childElementCount);
    }
}

function deleteCheckedUsers(i, count) {
    if (i < count) {
        //var elem = document.getElementById("tableBody");
        //for (var i = 0; i < elem.childElementCount; i++) {
        if (checkbox[i].checked) {
            var id = document.getElementById("tableBody").children[i].children[1].innerText;
            $.ajax({
                type: "DELETE",
                url: '/users/' + id,
                async: false,
                success: function (json) {
                    //setTimeout(deleteCheckedUsers(++i, count), 500);
                    deleteCheckedUsers(++i, count);
                    //loadDb((CurrentPage - 1) * 5, 5);
                    checkbox = $('table tbody input[type="checkbox"]');
                    //document.getElementById("numEntryId").innerHTML = 'Showing <b>' + Limit + '</b> out of <b>' + (--NumEntry) + '</b> entries';
                },
                error: function (json) {
                    alert(json.responseJSON.message);
                }
            });
        } else deleteCheckedUsers(++i, count);

    } else {
        document.getElementById('selectAll').checked = false;
        //setTimeout(loadDbByKey((CurrentPage - 1) * Limit, Limit), 500);
        //setTimeout(loadDb((CurrentPage - 1) * Limit, Limit), 500);
        loadDb((CurrentPage - 1) * Limit, Limit);
    }
}

function createPageMenu(pageMenuLenght) {
    var pageMenuEle = document.getElementById("pageMenu");
    pageMenuEle.innerHTML = "";

    var liEle = document.createElement('li');
    liEle.classList = "page-item disabled";
    liEle.innerHTML = '<a class="page-link" id="firstPageButtonId" href="#">&#x23ee</a>';
    liEle.children[0].onclick = function () { pageJump(1) };
    pageMenuEle.appendChild(liEle);

    liEle = document.createElement('li');
    liEle.classList = "page-item disabled";
    liEle.innerHTML = '<a class="page-link" id="previousPageButtonId" href="#">&#x23f4</a>';
    liEle.children[0].onclick = function () { pageJump('p') };
    pageMenuEle.appendChild(liEle);

    for (var i = 1; i < pageMenuLenght + 1; i++) {
        var liEle = document.createElement('li');
        if (i == 1) liEle.classList = "page-item active disabled";
        else liEle.classList = "page-item";
        liEle.innerHTML = '<a class="page-link" href="#" onclick="pageJump(' + i + ')">' + i + '</a>';
        pageMenuEle.appendChild(liEle);
    }
    liEle = document.createElement('li');
    liEle.classList = "page-item";
    liEle.innerHTML = '<a class="page-link" id="nextPageButtonId" href="#">&#x23f5</a>';
    liEle.children[0].onclick = function () { pageJump('n') };
    pageMenuEle.appendChild(liEle);
    var liEle = document.createElement('li');
    liEle.classList = "page-item";
    liEle.innerHTML = '<a class="page-link" id="lastPageButtonId" href="#">&#x23ed</a>';
    liEle.children[0].onclick = function () { pageJump('l') };
    pageMenuEle.appendChild(liEle);
    liEle = document.createElement('li');
    liEle.classList = "page-item";
    liEle.innerHTML = '<a class="page-link">Jump page</a>';
    liEle.children[0].onclick = function () { pageJump('?') };
    pageMenuEle.appendChild(liEle);
    liEle = document.createElement('li');
    liEle.innerHTML = '<input type="text" id="jumpInputId" style="width: 80px;font-size: medium;"></>';
    pageMenuEle.appendChild(liEle);
    document.getElementById("jumpInputId").onchange = function () { pageJump('?') };
}

function menuIndex(page, numberOfMenu) {
    var mod = page % numberOfMenu;
    if (mod == 0) return mod + PageMenuLength;
    else return mod;
}

function incrementPageMenu(lastPge) {
    for (var i = 1; i < PageMenuLength + 1; i++) {
        var pageNum = lastPge + i;
        document.getElementById("pageMenu").children[i + 1].innerHTML = '<a class="page-link" href="#" onclick="pageJump(' + pageNum + ')">' + pageNum + '</a>';
    }
}

function decrementPageMenu(firstPage) {
    if (firstPage != 1)
        for (var i = 1; i < PageMenuLength + 1; i++) {
            var pageNum = firstPage - PageMenuLength - 1 + i;
            document.getElementById("pageMenu").children[i + 1].innerHTML = '<a class="page-link" href="#" onclick="pageJump(' + pageNum + ')">' + pageNum + '</a>';
            //document.getElementById("pageMenu").children[i].children[0].innerHTML = firstPage - PageMenuLength - 1 + i;
        }
}

function jumpPageMenu(jumpPage) {
    for (var i = 1; i < PageMenuLength + 1; i++) {
        var pageNum = jumpPage - menuIndex(jumpPage, PageMenuLength) + i;
        document.getElementById("pageMenu").children[i + 1].innerHTML = '<a class="page-link" href="#" onclick="pageJump(' + pageNum + ')">' + pageNum + '</a>';
    }
}

function pageJump(page) {
    if (CurrentPage != page) {
        if (CurrentPage == 1) {
            document.getElementById("pageMenu").children[0].classList.remove("disabled");
            document.getElementById("pageMenu").children[1].classList.remove("disabled");
        }
        else if (page == 1) {
            document.getElementById("pageMenu").children[0].classList.add("disabled");
            document.getElementById("pageMenu").children[1].classList.add("disabled");
        }
        switch (page) {
            case "p":
                if (menuIndex(CurrentPage, PageMenuLength) == 1) {
                    decrementPageMenu(CurrentPage);
                }
                if (CurrentPage != 1) pageJump(CurrentPage - 1);
                break;
            case "n":
                if (menuIndex(CurrentPage, PageMenuLength) == PageMenuLength) {
                    incrementPageMenu(CurrentPage);
                }
                pageJump(CurrentPage + 1);
                break;
            case "?":
                let jumpPage = document.getElementById('jumpInputId').value;
                if (jumpPage) pageJump(Number(jumpPage));
                break;
            case "@":
                pageJump(Math.floor(showImageID / Limit) + 1);
                break;
            case "l":
                numberOfRecords();
                let numEntry = Number(document.getElementById("numEntryId").value);
                let lastPage = Math.floor(numEntry / Limit);
                if (numEntry % Limit != 0) lastPage++;
                pageJump(lastPage);
                break;
            default:
                //loadDbByKey((page - 1) * Limit, Limit);
                loadDb((page - 1) * Limit, Limit);
                document.getElementById("pageMenu").children[menuIndex(CurrentPage, PageMenuLength) + 1].classList.remove("active", "disabled");
                jumpPageMenu(page);
                document.getElementById("pageMenu").children[menuIndex(page, PageMenuLength) + 1].classList.add("active", "disabled");
                //event.currentTarget.parentElement.classList.add('active');
                CurrentPage = page;
        }
        document.getElementById('selectAll').checked = false;
    }
}

function numEntry(i) {
    //if (i < 10) {
    $.ajax({
        type: "GET",
        url: '/users/offset/' + (i * 10) + '/limit/10',
        success: function (json) {
            if (json.count < 10) {
                NumEntry = NumEntry + json.count;
                document.getElementById("numEntryId").innerHTML = 'Showing <b>' + Limit + '</b> out of <b>' + NumEntry + '</b> entries';
                return NumEntry;
            } else NumEntry = NumEntry + 10;
            setTimeout(numEntry(++i), 5000);
        },
        error: function (json) {
            alert(json.responseJSON.message);
        }
    });
    //}
}

function initPage() {
    loadDb((CurrentPage - 1) * Limit, Limit);
    checkbox = $('table tbody input[type="checkbox"]');
    $("#selectAll").click(function () {
        if (this.checked) {
            checkbox.each(function () {
                this.checked = true;
            });
        } else {
            checkbox.each(function () {
                this.checked = false;
            });
        }
    });
    checkbox.click(function () {
        if (!this.checked) {
            $("#selectAll").prop("checked", false);
        }
    });
    createPageMenu(PageMenuLength);
    document.getElementById("nextButtonId").addEventListener('click', nextImg);
    document.getElementById("lastButtonId").addEventListener('click', lastImg);
    document.getElementById("playButtonId").addEventListener('click', startPlayImg);
    document.getElementById("reverseButtonId").addEventListener('click', startReverseImg);
    //document.getElementById("nextChickIdButtonId").addEventListener('click', nextChickIdImg);
    //document.getElementById("lastChickIdButtonId").addEventListener('click', lastChickIdImg);
    //getConfusionMatrix();
    //numberOfRecords();
    //getUserIdChickIdList();
}