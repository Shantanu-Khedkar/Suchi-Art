
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



// Jquery For Modal
$(document).ready(function () {
    $('#editModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var title = button.siblings()[0].innerText
        var text = button.siblings()[1].innerText
        var modal = $(this)

        const options = Array.from(Object.keys(images)).reduce((options, item) => options += `<option value="${item}">${item}</option>`, '');
        $('.selectpicker').empty().append(options).selectpicker();
        $('.selectpicker').selectpicker('refresh');


        var modalContent = modal.find(".card-wrapper")[0]

        var card = button.parent().parent()

        let cardClone = document.importNode(card[0], true);

        let carouselClone = document.getElementById("largeModalCarousel").content.cloneNode(true);

        Array.from(cardClone.getElementsByTagName("a")).forEach(btn => { btn.style.display = "none"; });

        let originalSrc = cardClone.querySelector(".card-img-top").src
        carouselClone.querySelector(".card-img-top").src = originalSrc
        cardClone.querySelector(".card-img-top").remove()

        cardClone.querySelector(".card-title").setAttribute("contenteditable", "true")
        cardClone.querySelector(".card-text").setAttribute("contenteditable", "true")

        var oldPath = card.parent()[0].getAttribute("name").replaceAll("-", " ")
        if (oldPath == "New Project") {
            cardClone.querySelector(".badge").setAttribute("contenteditable", "true")
            var p = {
                "desc": "New Description",
                "images": ["12bhZ8uD5Ny-tSKaUH4ljQFECFH7v0Ng2"],
                "collections": ["We'll See"]
            }
        } else {
            var p = projects[oldPath] // Project
        }
        let imagesList = modal.find(".selected-images")[0]
        imagesList.innerHTML = ""

        p.images.forEach((i) => {
            let imageName = Object.assign(document.createElement('p'), { textContent: Object.keys(images).find(key => images[key].id === i), onclick: function () { this.remove(); } })
            if (imageName.innerText != "") {
                imagesList.appendChild(imageName);
            }
            else {
                console.log("want to rm")
            }

        })
        var pi = p.images.slice(1)
        console.log(carouselClone)

        carouselClone.querySelector('.carousel-control-prev').style.display = "block"
        carouselClone.querySelector('.carousel-control-next').style.display = "block"
        if (p.video || pi.length != 0) {

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
        } else {
            carouselClone.querySelector('.carousel-control-prev').style.display = "none"
            carouselClone.querySelector('.carousel-control-next').style.display = "none"
        }


        cardClone.setAttribute("data-source", oldPath)
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

    $('#uploadChanges').on('click', function (event) {
        var button = $(this) // Button that triggered the modal
        console.log(button)
        let card = button.parent().parent()[0].querySelector(".card")

        var title = card.querySelector(".card-title").innerText.replaceAll("-", " ")
        card.querySelector(".card-title").innerText = title;
        var text = card.querySelector(".card-text").innerText
        var modal = button.parent().parent().parent().parent().parent()
        var oldPath = card.getAttribute("data-source")
        console.log(oldPath)
        var c = card.querySelector(".badge").innerText
        let imagesList = modal.find(".selected-images")[0]
        let imgs = []
        Array.from(imagesList.children).forEach((e) => { imgs.push(images[e.innerText].id) })
        var item = {
            "desc": text,
            "images": imgs,
            "collections": [c]
        }
        console.log(item)

        fb.updateItems(`/projects/${oldPath}`, `/projects/${title}`, item).then(() => {
            fb.pullData().then(() => {
                card.setAttribute("data-source", title)
                gly.listUpdated(oldPath, title, gallery)
            })
        })


    })

    $('#deleteModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var title = button.siblings()[0].innerText
        var text = button.siblings()[1].innerText
        console.log(button)
        var card = button.parent().parent().parent()
        var oldPath = card[0].getAttribute("name").replaceAll("-", " ")
        var name = card[0].getAttribute("name")
        var modal = $(this)
        console.log(modal)
        modal.data('source', oldPath);
        modal.find('.confirm-name').text(name)
    })

    $('#deleteProject').on('click', function (event) {
        var button = $(this) // Button that triggered the modal
        // Extract info from data-* attributes
        var modal = button.parent().parent().parent().parent()
        var oldPath = modal.data('source')
        console.log(modal)
        fb.removeItems(`/projects/${oldPath}`)
        gallery.querySelector(`[name="${oldPath.replaceAll(" ", "-")}"`).remove()
        fb.pullData()

    })

    $('input[type="file"]').change(function (e) {
        var fileName = e.target.files[0].name;
        $('.custom-file-label').html(fileName);
    });

});