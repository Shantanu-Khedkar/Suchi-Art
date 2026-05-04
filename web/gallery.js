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

//Function To Initialise Gallery and Admin Panel
export async function initialisePanel(p, n, g, t) { // p = projects/collections, n = number, g = gallery
    await fb.pullData()
    if (p == 1) {
        await loadProjects(projects, n, g, t);
    } else {
        await loadCollections(collections, n, g);
    }

}

//Functions To Iterate Over Projects/Collections and List
// replaceAll required as DOM tokens cant have whitespaces
export async function loadProjects(projects, length, gallery, tag) {
    console.log(tag)
    Object.keys(projects).forEach((project) => {
        if (gallery.querySelectorAll(`[name="${project.replaceAll(" ", "-")}"]`).length == 0 && length > 0 && (!Boolean(tag)|| tag.length==0 ||  projects[project].collections.some(elem => tag.includes(elem)))) {
            listProject(project, projects[project], gallery)
            length--;
        }
    })
}
export async function loadCollections(collections, length, gallery) {
    Object.keys(collections).forEach((collection) => {
        if (gallery.querySelectorAll(`[name="${collection.replaceAll(" ", "-")}"]`).length == 0 && length > 0) {
            listCollection(collection, collections[collection], gallery)
            length--;
        }
    })
}

//Functions To Clone Template HTML and Append With Values
export function listProject(project, details, gallery) {
    console.log(project, details, projects)
    let temp = document.getElementsByTagName("template")[0];
    let clon = document.importNode(temp.content, true);

    let cardTitle = clon.querySelector('.card-title');
    let cardBadge = clon.querySelector('.badge');
    let cardDesc = clon.querySelector('.card-text');
    let cardImage = clon.querySelector('.card-img-top');

    cardBadge.textContent = details.collections[0]
    cardTitle.textContent = project
    cardDesc.textContent = details.desc
    clon.firstElementChild.setAttribute("name", project.replaceAll(" ", "-"))
    cardImage.src = `https://lh3.googleusercontent.com/d/${details.images[0]}=w500?authuser=0`
    // getFile(details.images[0])
    gallery.appendChild(clon);
}
export function listCollection(collection, details, gallery) {
    //console.log(projects[project])
    let temp = document.getElementsByTagName("template")[0];
    let clon = document.importNode(temp.content, true);

    let cardTitle = clon.querySelector('.card-title');
    let cardDesc = clon.querySelector('.card-text');
    let cardImage = clon.querySelector('.card-img-top');
    let cardLink = clon.querySelector(".secondary")
    cardTitle.textContent = collection
    cardDesc.textContent = details.desc
    cardLink.setAttribute("href", `gallery.html?c=${collection}`)
    clon.firstElementChild.setAttribute("name", collection.replaceAll(" ", "-"))
    cardImage.src = `https://lh3.googleusercontent.com/d/${details.images[0]}=w500?authuser=0`
    // getFile(details.images[0])
    //console.log(clon)
    gallery.appendChild(clon);
}

export function listUpdated(oldPath, path, updated, gallery) {


    var n = oldPath.replaceAll(" ", "-");
    var nn = path.replaceAll(" ", "-");
    var updatedClone = document.importNode(updated, true);
    Array.from(updatedClone.getElementsByTagName("a")).forEach(btn => { btn.style.display = "inline"; });
    updatedClone.querySelector(".card-title").setAttribute("contenteditable", "false")
    updatedClone.querySelector(".card-text").setAttribute("contenteditable", "false")
    if (oldPath != path) {
        var card = gallery.querySelector(`[name="${n}"`)
        card.innerHTML = ""
        card.appendChild(updatedClone)
        card.setAttribute("name", nn)

    } else {
        var card = gallery.querySelector(`[name="${n}"`)
        card.innerHTML = ""
        card.appendChild(updatedClone)
    }
    fb.pullData()
}