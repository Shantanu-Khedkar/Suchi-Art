
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
        var button = $(event.relatedTarget) // Button that triggered the modal
        var title = button.siblings()[0].innerText
        var text = button.siblings()[1].innerText
        var modal = $(this)
        var modalContent = modal.find(".card-wrapper")[0]

        var card = button.parent().parent()
        console.log(modalContent)
        let cardClone = document.importNode(card[0], true);
        Array.from(cardClone.getElementsByTagName("a")).forEach(btn => { btn.style.display = "none"; });
        var oldPath = card.parent()[0].getAttribute("name").replaceAll("-", " ")
        cardClone.setAttribute("data-source", oldPath)

        modalContent.innerHTML = "";
        modalContent.appendChild(cardClone)


    })

});