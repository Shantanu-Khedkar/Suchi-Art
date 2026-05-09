// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getDatabase, ref, set, get, child, remove } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";


// Firebase configuration
let projects = {};
let images = {};
let collections = {};

export function getProjects() {
    return projects
}
export function getImages() {
    return images
}
export function getCollections() {
    return collections
}

let OAuth_token = ""

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
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive')
provider.addScope('https://www.googleapis.com/auth/firebase.database')

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
export async function pushItems(path, items) {
    return await putJson(`${firebaseConfig.databaseURL}${path}.json?access_token=${OAuth_token}`, items)
}

export function createItems(path, items) {
    Array.from(Object.keys(items)).forEach((i) => {
        pullItems(`${path}/${i}`).then((data) => {
            console.log("ok")
        }).catch((error) => {
            if (error == "No Data") {
                pushItems(`${path}/${i}`, items[i])
                console.log("New Collection Created")
            }
        })
    })

}

export async function updateItems(oldPath, path, items) {
    console.log(oldPath, path, items)
    if (oldPath == path) {
        await pushItems(path, items)
    } else {
        await pushItems(path, items)
        await remove(ref(database, oldPath));
    }
}
export function removeItems(path) {
    remove(ref(database, path));
    console.log("Removed", path)
}

export async function pullItems(path) {  // Originally meant to fetch from firebase using sdk, currently fetches REST API
    console.log("pullItems entered")
    var resp = await getJson(`${firebaseConfig.databaseURL}/${path}.json`)
    console.log(resp) // jsonObject with data
    return resp

}

// Pull Items with firebase: returns a promise after getting data (fb does not return requests fast)
/*
export function pullItems(path) {
    path = "/"+path
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
}*/

async function getJson(url) {
    console.log("getting json")
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return await res.json(); // parsed JSON object
}
async function putJson(url, data) {
    console.log(url, data)
    return await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(data)
    })
}

export async function pullData() {
    console.log("pullData entered")
    projects = await pullItems("projects")

    collections = await pullItems("collections")

    images = await pullItems("images")
    //console.log(projects, collections);
}


export async function startAuth() {
    let authCreds = await signInWithPopup(auth, provider)
    OAuth_token = authCreds._tokenResponse.oauthAccessToken
    
    return authCreds

}
// One Time Function To Label Collections to Projects in Firebase Based on Image Location in Google Drive
export async function indexCollections(projects, collections) {
    Object.keys(projects).forEach((p) => {
        getParents(projects[p].images[0]).then((parents) => {
            var c = Object.keys(collections).find(key => collections[key].id === parents[0]);
            console.log(parents)
            pushItems(`/projects/${p}/collections`, [c])

        })
    })
}


