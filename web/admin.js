
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

document.getElementById("submit-btn").addEventListener("click", async ()=>{
    await fb.startAuth()
    await gly.initalisePanel(1, 20, gallery)
})
document.getElementById("loadMore").addEventListener('click', function () {
    gly.loadProjects(projects, 20, gallery);
});


// Jquery For Modal
$(document).ready(function () {
    $('#editModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var title = button.siblings()[0].innerText
        var text = button.siblings()[1].innerText
        var modal = $(this)
        var modalContent = modal.find(".card-wrapper")[0]

        var card = button.parent().parent()
        console.log(modalContent)
        let cardClone = document.importNode(card[0], true);
        Array.from(cardClone.getElementsByTagName("a")).forEach(btn => { btn.style.display = "none"; });
        cardClone.querySelector(".card-title").setAttribute("contenteditable", "true")
        cardClone.querySelector(".card-text").setAttribute("contenteditable", "true")
        var oldPath = card.parent()[0].getAttribute("name").replaceAll("-", " ")
        cardClone.setAttribute("data-source", oldPath)

        modalContent.innerHTML = "";
        modalContent.appendChild(cardClone)


    })

    $('#uploadChanges').on('click', function (event) {
        var button = $(this) // Button that triggered the modal
        console.log(button)
        let card = button.parent().parent()[0].querySelector(".card")

        var title = card.querySelector(".card-title").innerText
        var text = card.querySelector(".card-text").innerText
        var modal = button.parent().parent().parent().parent().parent()
        var oldPath = card.getAttribute("data-source")
        console.log(oldPath)
        var c = card.querySelector(".badge").innerText
        var item = {
            "desc": text,
            "images": ["1xpiQvduZcWkt2SU2jIS4uwmQDm9BoauO"],
            "collections": [c]
        }
        fb.updateItems(`/projects/${oldPath}`, `/projects/${title}`, item)

        card.setAttribute("data-source", title)
        gly.listUpdated(oldPath, title, card, gallery)
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

    })

});