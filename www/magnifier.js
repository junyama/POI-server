/* 
refer to https://qiita.com/mark_posts_stocker/items/345776f14131439a304c
*/

function magnifier(mode) {
    let baseImg = document.querySelector(".base_img");
    let lensImgBox = document.querySelector(".lens_img_box");

    //let ratio = 3;
    if (mode) {
        lensImgBox.style.opacity = 0;
        baseImg.removeEventListener("mousemove", mousemoveLense, false);
        baseImg.removeEventListener("mousemove", mouseoutLense, false);
    } else {
        baseImg.addEventListener("mousemove", mousemoveLense, false);
        baseImg.addEventListener("mouseout", mouseoutLense, false);
    }
}

function mousemoveLense(event) {
    //let baseImg = document.querySelector(".base_img");
    let lensImgBox = document.querySelector(".lens_img_box");
    let lensImg = document.querySelector(".lens_img");
    let ratio = 2;

    lensImgBox.style.opacity = 1;
    lensImgBox.style.top = (event.offsetY - 100) + "px";
    lensImgBox.style.left = (event.offsetX - 100) + "px";

    let newLensOffsetY = event.offsetY * ratio * -1 + 100;
    let newLensOffsetX = event.offsetX * ratio * -1 + 100;

    lensImg.style.top = (newLensOffsetY) + "px";
    lensImg.style.left = (newLensOffsetX) + "px";
}

function mouseoutLense() {
    let lensImgBox = document.querySelector(".lens_img_box");
    lensImgBox.style.opacity = 0;
}