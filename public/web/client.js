
import * as gly from './gallery.js';
import * as fb from './firebase.js';

const gallery = document.getElementById('gallery')

Object.defineProperty(window, 'projects', {
    get: function () {
        return fb.getProjects();
    },
    configurable: true
});

Object.defineProperty(window, 'images', {
    get: function () {
        return fb.getImages();
    },
    configurable: true
});

Object.defineProperty(window, 'collections', {
    get: function () {
        return fb.getCollections();
    },
    configurable: true
});
//gly.initalisePanel()
// Jquery For Modal
$(document).ready(function () {

    $('#viewModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Image that triggered the modal

        var card = button.parent()
        var title = card.find(".card-title")
        var text = card.find(".card-text")

        var modal = $(this)
        var modalContent = modal.find(".card-wrapper")[0] // Where this mess will finally be appended to

        let cardClone = document.importNode(card[0], true); // Original Card

        let carouselClone = document.getElementById("largeModalCarousel").content.cloneNode(true); // Carousel to replace image

        let originalSrc = cardClone.querySelector(".card-img-top").src // Source of orginal card image
        carouselClone.querySelector(".card-img-top").src = originalSrc
        cardClone.querySelector(".card-img-top").remove() // Original image not needed anymore
        cardClone.querySelector(".card-body").style="display: block !important"

        var oldPath = card.parent()[0].getAttribute("name").replaceAll("-", " ")
        var p = projects[oldPath] // Project
        var pi = p.images.slice(1)
        carouselClone.querySelector('.carousel-control-prev').style.display = "block"
        carouselClone.querySelector('.carousel-control-next').style.display = "block"
        console.log(pi.video)
        if(p.video || pi.length!=0){

        pi.forEach((i) => {
            let carouselImage = document.getElementById("carouselImage").content.cloneNode(true); // Carousel images
            carouselImage.querySelector('.card-img-top').src = `https://lh3.googleusercontent.com/d/${i}=w500?authuser=0`
            carouselClone.querySelector('.carousel-inner').appendChild(carouselImage)
        })
        if (p.video) {
            var pv = p.video;
            let carouselVideo = document.getElementById("carouselVideo").content.cloneNode(true); // Carousel video
            carouselVideo.querySelector('.card-img-top').src = pv
            carouselClone.querySelector('.carousel-inner').appendChild(carouselVideo)

        }
    }else{
        console.log("test")
        carouselClone.querySelector('.carousel-control-prev').style = "display: none !important"
        carouselClone.querySelector('.carousel-control-next').style = "display: none !important"
    }




        cardClone.insertBefore(carouselClone, cardClone.querySelector('.card-body'));

        modalContent.innerHTML = "";
        modalContent.appendChild(cardClone)
        $('#carouselControls').on('slid.bs.carousel', function () {
            try {
                $(this).find('video')[0].pause()
                if ($(this).find('video').parent()[0].classList.contains('active')) {
                    $(this).find('video')[0].play()
                }
            } catch (error) {
                console.log(error)
            }
        })

    })

});