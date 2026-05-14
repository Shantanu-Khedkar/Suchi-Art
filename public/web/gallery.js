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
export async function initialisePanel(p, n, g, t) {
    console.log("hey") // p = projects/collections, n = number, g = gallery
    await fb.pullData()
    if (p == 1) {
        let m = await loadProjects(projects, n, g, t)
        //console.log(m)
        return m
    } else {
        await loadCollections(collections, n, g);
    }

}

//Functions To Iterate Over Projects/Collections and List
// replaceAll required as DOM tokens cant have whitespaces
export async function loadProjects(projects, length, gallery, tag) {
    var moreProjects = 0
    //console.log(tag)
    Object.keys(projects).forEach((project) => {
        if (gallery.querySelectorAll(`[name="${project.replaceAll(" ", "-")}"]`).length == 0 && (!Boolean(tag) || tag.length == 0 || projects[project].collections.some(elem => tag.includes(elem)))) {
            if (length > 0) {
                listProject(project, projects[project], gallery)
                length--;
            } else if (length == 0) {
                moreProjects++
            }
        }
    })
    return moreProjects

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
export function listProject(project, details, gallery, list = 1) {
    //console.log(project, details, projects)
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
    if (list == 1) {
        gallery.appendChild(clon);
    } else {
        return clon
    }
}
export function listCollection(collection, details, gallery) {
    //console.log(projects[project])
    let temp = document.getElementById("collection-template");
    let temp2 = document.getElementById("carousel-template");

    let clon = document.importNode(temp.content, true);
    let carouselClone = document.importNode(temp2.content, true);
    carouselClone.querySelector(".carousel").setAttribute("id", `cc-${collection.replaceAll(" ", "-")}`)
    Array.from(carouselClone.querySelector(".carousel").getElementsByTagName("a")).forEach((btn)=>{
        btn.setAttribute('href', `#cc-${collection.replaceAll(" ", "-")}`)
    })
    let cardTitle = clon.querySelector('.card-title');
    let cardDesc = clon.querySelector('.card-text');
    let cardCarouselWrap = clon.querySelector('.carousel-wrapper');
    let cardLink = clon.querySelector(".secondary")
    cardTitle.textContent = collection
    cardDesc.textContent = details.desc
    cardLink.setAttribute("href", `gallery.html?c=${collection}`)
    clon.firstElementChild.setAttribute("name", collection.replaceAll(" ", "-"))



    carouselClone.querySelector(".card-img-top").src = `https://lh3.googleusercontent.com/d/${details.images[0]}=w500?authuser=0`
    carouselClone.querySelector('.carousel-control-prev').style.display = "block"
    carouselClone.querySelector('.carousel-control-next').style.display = "block"
    let pi = details.images.slice(1)

    pi.forEach((i) => {
            let carouselImage = document.getElementById("carouselImage").content.cloneNode(true); // Carousel images
            carouselImage.querySelector('.card-img-top').src = `https://lh3.googleusercontent.com/d/${i}=w500?authuser=0`
            carouselClone.querySelector('.carousel-inner').appendChild(carouselImage)
        })
    
    cardCarouselWrap.appendChild(carouselClone)


    // getFile(details.images[0])
    //console.log(clon)
    gallery.appendChild(clon);
    
    }

export async function listUpdated(oldPath, path, gallery) {



    var n = oldPath.replaceAll(" ", "-");
    var nn = path.replaceAll(" ", "-");
    var updatedClone = listProject(path, projects[path], gallery, 0)

    if (oldPath != path) { // Title Changes

        var card = gallery.querySelector(`[name="${n}"`)

        if (card == null) {
            // Assume New Project
            gallery.appendChild(updatedClone)

        } else {
            card.innerHTML = ""
            card.appendChild(updatedClone)
            card.setAttribute("name", nn)

        }

    } else { // Title Stayed Same

        var card = gallery.querySelector(`[name="${n}"`)

        if (card == null) {
            // Assume New Project
            gallery.appendChild(updatedClone)

        } else {
            card.innerHTML = ""
            card.appendChild(updatedClone)
        }
    }
}