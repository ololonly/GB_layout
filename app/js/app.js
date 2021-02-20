const $menu = $('.brandMenu');
const $menuButton = $('.barsIcon');
const $menuClose = $('.menuClose');


var GbLayout = {
    onLoad: () => {
        $menuButton.on('click', GbLayout.menuToggler);
        $menuClose.on('click', GbLayout.menuToggler);
    },

    menuToggler: () => {
        $menu.toggleClass('menu-open');
    },


}

$(GbLayout.onLoad);