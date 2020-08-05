var btnUpdateCart = jQuery('.btn-addToCart')
var forEach = function (collection, callback, scope) {
	if (Object.prototype.toString.call(collection) === '[object Object]') {
		for (var prop in collection) {
			if (Object.prototype.hasOwnProperty.call(collection, prop)) {
				callback.call(scope, collection[prop], prop, collection);
			}
		}
	} else {
		for (var i = 0, len = collection.length; i < len; i++) {
			callback.call(scope, collection[i], i, collection);
		}
	}
};
btnUpdateCart.on('click', function(){
    var productId = jQuery(this).data('product');
    var action =  jQuery(this).data('action');
    if(currentUser == 'AnonymousUser'){
        console.log('currentUser', currentUser);

    }else{
        updateCart(productId, action)

    }
});
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function updateCart(productId, action){
    const csrftoken = getCookie('csrftoken');

    const url = '/update_item/';
    const data = {'productId': productId, 'action': action}
    
    jQuery.ajax({
            url: url,
            data: data,
            headers: {'X-CSRFTOKEN': csrftoken},
            datatype: "json",
            type: 'post',
            success: function (data) {
 
                getCartItems();
            }
        }
    )
    
}

function getCartItems(){
    const url = '/get-cart-items/';
    jQuery.ajax({
        url: url,
        datatype: "json",
        type: 'get',
        success: function (data) {
            // const inputUpdate = jQuery('p[data-id='+productId+']');
            if(Object.keys(data.items).length){
           
                forEach(data.items, function (value, prop, obj) {
 
                      jQuery('p[data-id='+prop+']').html(value);
                });

            }
            jQuery('#cart-total, #totalCartItems').html(data.totalItems);
            jQuery('#totalCart').html(data.total_cart);
        }
    })
}
getCartItems();