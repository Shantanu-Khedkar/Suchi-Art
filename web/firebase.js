// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getDatabase, ref, set, get, child, remove } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";


// Firebase configuration
let projects = {};
let images = {};
let collections = {};

export function getProjects(){
return projects
}
export function getImages(){
return images
}
export function getCollections(){
return collections
}

const firebaseConfig = {
    apiKey: "AIzaSyAcTwe6bEPnhd1EBBAP99HGRJNFSFXNoQ4", // To anyone reading the code: Please do not get excited, the api key is not designed to be a secret (source: Firebase Docs) and there are additional checks like email and password provided by Firebase Security Rules...
    authDomain: "suchi-art.firebaseapp.com",
    databaseURL: "https://suchi-art-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "suchi-art",
    storageBucket: "suchi-art.firebasestorage.app",
    messagingSenderId: "188405063636",
    appId: "1:188405063636:web:91bf35c72e45ef8b250041"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);


/*
function writeUserData(uid, userId, name, email) {
    console.log(uid)
    set(ref(database, 'users/' + userId), {

        username: name,
        email: email
    }).then(() => {
        console.log('User data written successfully.');
    }).catch((error) => {
        console.error('Error writing user data: ', error);
    });
}*/
export function createFileIndex(f) {
    var name = f.name.split(".")[0];
    set(ref(database, 'images/' + name), {
        id: f.id,
        description: "",
        tags: "",
        date: ""
    }).then(() => {
        console.log(`${name} Index Created`);
    }).catch((error) => {
        console.error('Error Creating File Index: ', error);
    });
}
export function createTagIndex(f) {
    var name = f.name.split(".")[0];
    set(ref(database, 'tags/' + f.name), {
        id: f.id,
        description: "",
        date: ""
    }).then(() => {
        console.log(`${name} Index Created`);
    }).catch((error) => {
        console.error('Error Creating Tag Index: ', error);
    });
}
export function pushItems(path, items) {
    set(ref(database, path), items).then(() => {
        console.log(`${path} Nodes Created`);
    }).catch((error) => {
        console.error('Error Creating Nodes: ', error);
    });
}
export function updateItems(oldPath, path, items) {
    console.log(oldPath, path, items)
    if (oldPath == path) {
        pushItems(path, items)
    } else {
        pushItems(path, items)
        remove(ref(database, oldPath));
    }
}
export function removeItems(path) {
    remove(ref(database, path));
    console.log("Removed", path)
}
export function pullItems(path) {
    return new Promise((resolve, reject) => {
        get(child(ref(database), `${path}`)).then((snapshot) => {
            if (snapshot.exists()) {
                //console.log(snapshot.val());
                resolve(snapshot.val());
            } else {
                console.log("No data available");
                reject("No Data")
            }
        }).catch((error) => {
            console.error(error);
            reject(error)
        });
    })
}

export async function pullData() {
    //await driveUpdate()
    projects = await pullItems("/projects")
    console.log(getProjects())
    collections = await pullItems("/collections")
    //await indexCollections(projects, collections)
    images = await pullItems("/images")
    //console.log(projects, collections);
}

export function startAuth(userEmail, userPassword) {
    userEmail = document.getElementById('login-form').children[0].value
    userPassword = document.getElementById('login-form').children[2].value
    console.log(userEmail, userPassword)
    signInWithEmailAndPassword(auth, userEmail, userPassword)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log("User signed in:", user.uid);

            //driveUpdate() // Initialise rtdb with skeleton drive data
            //loadProjects()
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error signing in:", errorCode, errorMessage);
        });
}
// One Time Function To Create Skeleton Firebase RTDB
export async function driveUpdate() {
    var files = await listAllFiles("root")
    var count = 0
    var prjcts = {}
    var images = {}
    var collections = {}
    console.log(files)
    files.forEach((f) => {
        var name = f.name.split(".")[0];
        if (f.mimeType.includes("image")) {
            prjcts[name] = { "images": [f.id], "desc": "", "collections": [] }
            images[name] = { "id": f.id }
        } else if (f.mimeType == "application/vnd.google-apps.folder") {
            collections[name] = { "images": ["NO_IMAGE"], "id": f.id, "desc": "" }
        }
    })
    console.log(images, collections)
    //pushItems("projects", prjcts)
    pushItems("images", images)
    //pushItems("collections", collections)

}

// One Time Function To Label Collections to Projects in Firebase Based on Image Location in Google Drive
export async function indexCollections(projects, collections) {
    Object.keys(projects).forEach((p) => {
        getParents(projects[p].images[0]).then((parents) => {
            var c = Object.keys(collections).find(key => collections[key].id === parents[0]);
            pushItems(`/projects/${p}/collections`, [c])
        })
    })
}


