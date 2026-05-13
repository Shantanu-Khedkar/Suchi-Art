import * as fb from './firebase.js';

const commentSection = document.getElementById('comment-section')
const commentForm = document.getElementById('comment-form')

export function listComment(slug, comment, verification) {

    let temp = document.getElementById("comment-template")
    let commentClon = document.importNode(temp.content, true);
    let commentBody = commentClon.querySelector('.comment-body');
    let commentTitle = commentClon.querySelector('.comment-title');
    let commentName = commentClon.querySelector('.comment-name');
    let commentContent = commentClon.querySelector('.comment-content');
    commentBody.parentElement.setAttribute("data-slug", slug)
    if (verification){
    commentBody.parentElement.classList.add(verification)
    }
    commentTitle.innerText = comment.title
    commentName.innerText = comment.name
    commentContent.innerText = comment.comment
    commentSection.appendChild(commentClon);


}

export function validateField(text, maxlength) {
    if (text.length == 0) {
        throw new Error("fill-field");
    } else if (text.length > maxlength) {
        throw new Error("too-long");
    }
}
export function notifyField(error, field) {
    console.log(error, field)
    field.nextElementSibling.className = ""
    field.nextElementSibling.classList.add("feedback")
    field.nextElementSibling.classList.add(error.message)
}


export function postComment() {
    console.log("Validating Input")
    let Ftitle = commentForm.querySelector('#CT')
    let Fname = commentForm.querySelector('#CN')
    let Fmessage = commentForm.querySelector('#CM')
    let title = Ftitle.value
    let name = Fname.value
    let message = Fmessage.value
    let goodToSend = 1
    try {
        validateField(title)
        notifyField("unset", Ftitle)
    } catch (error) {
        notifyField(error, Ftitle)
        goodToSend = 0
    }
    try {
        validateField(name)
        notifyField("unset", Fname)
    } catch (error) {
        notifyField(error, Fname)
        goodToSend = 0
    }
    try {
        validateField(Fmessage.value)
        notifyField("unset", Fmessage)
    } catch (error) {
        notifyField(error, Fmessage)
        goodToSend = 0
    }

    if (goodToSend) {
        let slug = `${String(Date.now())}`


        fb.pushComment(`/unverified_comments/${slug}`, {
            "title": title,
            "name": name,
            "comment": message,
            "date": String(Date.now())
        }).then(() => {
            commentForm.parentElement.style.display = "none"
            commentForm.parentElement.nextElementSibling.style.display = "block"
        })
    }
}