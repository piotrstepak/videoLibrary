const formEl = document.querySelector(".container form");

function isEmailValid(email) {
    const emailReg = /^[0-9a-z_.-]+@[0-9a-z.-]+\.[a-z]{2,3}$/i;
    return (email.value === '' || (email.value !== '' && emailReg.test(email))) ? true : false;
}

function isUrlValid(url) {
    const urlReg = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi; 
    return (url.length > 0 && urlReg.test(url));
}

function isTagsValid(tags) {
    if (tags.length == 0) {
        return true;
    }
    let tagsArray = tags.split(/\s+/);
    const hashSymbol = '#';
    for (tag of tagsArray) {
        if (tag[0] !== hashSymbol) {
            return false;
        }
    }
    return true;
}

function isTitleValid(title) {
    return title.length >= 3;
}

function isDescriptionValid(desc) {
    return desc.length > 0;
}

function isUploadedValid(uploaded) {
    return (uploaded.length == 0) || 
           (uploaded.length >= 3)
}

formEl.addEventListener("submit", e => {
    e.preventDefault();
    const urlEl = formEl.querySelector('input[name=url]');
    const titleEl = formEl.querySelector('input[name=title]');
    const descEl = formEl.querySelector('textarea[name=description]');
    const tagsEl = formEl.querySelector('input[name=tags]');
    const uploadedEl = formEl.querySelector('input[name=uploaded]');
    const emailEl = formEl.querySelector('input[name=email]');

    if (!isUrlValid(urlEl.value)) {
        return alert('Incorrect url syntax');
    }
    if (!isTitleValid(titleEl.value)) {
        return alert('Titile: minimum length - 3 characters');
    }
    if (!isDescriptionValid(descEl.value)) {
        return alert('Description is required');
    }
    if (!isTagsValid(tagsEl.value)) {
        return alert('Incorrect tags: tags should starting with # and separated by whitelines');
    }
    if (!isUploadedValid(uploadedEl.value)) {
        return alert('Uploaded by: minimum length - 3 characters');
    }
    if (!isEmailValid(emailEl.value)) {
        return alert('Incorrect email address');
    } else  {
        const body = {
            url: urlEl.value,
            title: titleEl.value,
            description: descEl.value,
            tags: tagsEl.value,
            uploaded: uploadedEl.value,
            email: emailEl.value
        }
        console.log(body);
        const data = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            body: JSON.stringify(body)
            // body data type must match "Content-Type" header
        }
        console.log(body)
        fetch("http://localhost:3000/add", data)
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            }
        });      
    }
});