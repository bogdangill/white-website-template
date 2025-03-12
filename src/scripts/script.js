let gamesCards = document.querySelectorAll(".explore-games-block__game");

let mobileMenu = document.querySelector(".mobile-menu");

let buttonMobileMenu = document.querySelector(".mobile-menu__button");

let buttonCloseMobileMenu = document.querySelector(".mobile-menu__close");

let formIndex = document.getElementById("form-index");

let formContact = document.getElementById("form-contact");

let buttonAccept = document.getElementById("accept");

let buttonModalClose = document.querySelector(".modal__close");

let modal = document.querySelector(".modal");

let buttonsTab = document.querySelectorAll(".tab-button");

if(buttonsTab) {
    buttonsTab.forEach(element => {
        element.addEventListener("click", (event) => {openTab(element);});
    });
}

function openTab(element) {
    let tab = element.parentElement.parentElement;
    let answer = tab.querySelector(".questions-block__hide");
   

    if(element.classList.contains('tab-button-close')) {
        answer.style.display = 'none';
        element.classList.remove('tab-button-close');
    } else {
        answer.style.display = 'block';
        element.classList.add('tab-button-close');
    }

}


function closeModal() {
    modal.style.display = "none";
}

if(buttonAccept) {
    buttonAccept.addEventListener("click", (event) => {closeModal();});
    buttonModalClose.addEventListener("click", (event) => {closeModal();});
}





function formSubmit(e) {
    e.preventDefault();
    window.location.href = "submit.html";
}
if (formIndex) {
    formIndex.addEventListener("submit", (event) => {formSubmit(event);});
}

if(formContact) {
    formContact.addEventListener("submit", (event) => {formSubmit(event);});
}

if(buttonMobileMenu) {
    buttonMobileMenu.addEventListener("click", (event) => {
        mobileMenu.style.display = "block";
        document.body.style.overflow = 'hidden';
    })
}

if(buttonCloseMobileMenu) {
    buttonCloseMobileMenu.addEventListener("click", (event) => {
        mobileMenu.style.display = "none";
        document.body.style.overflow = 'auto';
    })
}






function displayOverlay(element, state) {
    let overlay = element.querySelector(".explore-games-block__hide");
    if(state == "open") {
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
    }

}

if(gamesCards) {
    gamesCards.forEach(element => {
        element.addEventListener("mouseover", (event) => {displayOverlay(element, "open");});
    });
    
    gamesCards.forEach(element => {
        element.addEventListener("mouseout", (event) => {displayOverlay(element, "close");});
    });
    
}









