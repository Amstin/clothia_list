var basketProductIds = []
var basketProducts = []
var allProducts = [
	{ id: 1, name: 'Blue jacket', price: '$343', oldPrice: '$434', brandName: 'BlueCloth' },
	{ id: 2, name: 'Green jacket', price: '$545', oldPrice: '', brandName: 'GreenCloth' },
	{ id: 3, name: 'Red jacket', price: '$767', oldPrice: '$878', brandName: 'RedCloth' }
]

function addToCart(product_id) {
	var productAdded = basketProducts.find(function(e) { return e.id == product_id })
	if(productAdded) {
		productAdded.qty += 1
	} else {
		var product = allProducts.find(function(e) { return e.id == product_id })
		basketProducts.push(Object.assign(product, { qty: 1 }))
	}
  $.post("/api", {
    TYPE: "ADD_TO_CART",
    PRODUCT_ID: product_id
  })
  setBadge()
}

function removeFromCart(product_id) {
	basketProducts = basketProducts.filter(function(e) { return e.id != product_id })
  $.post("/api", {
    TYPE: "REMOVE_FROM_CART",
    PRODUCT_ID: product_id
  })
  setBadge()
}

function getQty(){
  return basketProducts.length;
}

function setBadge() {
  var qty = getQty();
  if(qty === 0) {
    $('.product-count').css('display','none')
    return
  }
  
  $('.product-count').find('i').text(qty)
  $('.product-count').css('display','inline')
}


function decQty(product_id) {
	var productAdded = basketProducts.find(function(e) { return e.id == product_id })
	if(productAdded) {
		productAdded.qty -= 1
		if(productAdded.qty <= 0) {
			removeFromCart(product_id)
		}
	}
}

function decQty(product_id) {
	var productAdded = basketProducts.find(function(e) { return e.id == product_id })
	if(productAdded) {
		productAdded.qty -= 1
	}
  
  setBadge()
}

function incrQty(product_id) {
	var productAdded = basketProducts.find(function(e) { return e.id == product_id })
	if(productAdded) {
		productAdded.qty += 1
	}
  setBadge()
}

function renderProducts() {
	var template = $('.card-template').html()

	$('.product-list').empty()
	allProducts.forEach(function(e) {
		var newProduct = $(template)
    console.log(newProduct)
		newProduct.on('click', function(event) {
			event.preventDefault()
			addToCart(e.id)
		})
    newProduct.find('div.card__image').css('background-image','url(./img/product_'+e.id+'.jpg)')
		newProduct.find('h2').text(e.name)
    newProduct.find('span.card__new-price').text(e.price)
    newProduct.find('span.card__old-price').text(e.oldPrice)
    newProduct.find('a.card__brand-name').text(e.brandName)
		$('.product-list').append(newProduct)
	})
}

function renderBasket() {
	var template = $('.basket-template').html()

	$('.basket-products').empty()
	basketProducts.forEach(function(e) {
		var newItem = $(template)
		newItem.find('.shopping-cart__description span').text(e.name)
		newItem.find('input').val(e.qty)
    newItem.attr('id', e.id)
    newItem.find('.shopping-cart__item__image').attr('src', './img/product_'+e.id+'.jpg')
    newItem.find('.shopping-cart__total-price').text(e.price)
		$('.basket-products').append(newItem)
	})
  
  // quantity
  $('.shopping-cart__minus-btn').on('click', function(e) {
      e.preventDefault();
      var $this = $(this);
      var $input = $this.closest('div').find('input');
      var value = parseInt($input.val());
      var id = $(this).closest('.shopping-cart__item').attr('id');

      if (value > 1) {
          value = value - 1;
          decQty(parseInt(id, 10))
      } else {
          value = 1;
      }
      
      $.post("/api", {
        TYPE: "CHANGE_QUANTITY",
        PRODUCT_ID: id,
        NEW_QUANTITY: value
      })

    $input.val(value);


  });

  $('.shopping-cart__plus-btn').on('click', function(e) {
      e.preventDefault();
      var $this = $(this);
      var $input = $this.closest('div').find('input');
      var value = parseInt($input.val());

      if (value < 100) {
          value = value + 1;
      } else {
          value = 100;
      }
      
      var id = $(this).closest('.shopping-cart__item').attr('id');
      incrQty(parseInt(id, 10))
      
      $.post("/api", {
        TYPE: "CHANGE_QUANTITY",
        PRODUCT_ID: id,
        NEW_QUANTITY: value
      })

      $input.val(value);
  });
  
  // delete product
  $('.shopping-cart__delete-btn').on('click', function(e) {
    e.preventDefault();
    var id = $(this).closest('.shopping-cart__item').attr('id');
    removeFromCart(parseInt(id, 10))
    $(this).closest(".shopping-cart__item").remove()
  })
}

$(document).ready(function() {
	renderProducts()

	$('[class*=popup-link]').click(function(e) {
		renderBasket()
		
		e.preventDefault();
		e.stopPropagation();

		var name = $(this).attr('class');
		var id = name[name.length - 1];
		var scrollPos = $(window).scrollTop();

		/* Show the correct popup box, show the blackout and disable scrolling */
		if ($('body').hasScrollBar()) {
      $('body').css('padding-right', '15px');
    };
    $('#popup-box').animate({height: 'show'}, 300);
		$('#blackout').show();
		$('body').addClass('modal-open');

		/* Fixes a bug in Firefox */
		$('html').scrollTop(scrollPos);
	});
	$('[class*=popup-box]').click(function(e) {
		/* Stop the link working normally on click if it's linked to a popup */
		e.stopPropagation();
	});
	$('html').click(function() {
		var scrollPos = $(window).scrollTop();
		/* Hide the popup and blackout when clicking outside the popup */
		$('body').css('padding-right', '0');
    $('body').removeClass('modal-open');
    $('#popup-box').animate({height: 'hide'}, 100);
		$('#blackout').hide();
		$('html').scrollTop(scrollPos);
	});
	$('.close').click(function() {
		var scrollPos = $(window).scrollTop();
		/* Similarly, hide the popup and blackout when the user clicks close */
    $('body').removeClass('modal-open');
    $('#popup-box').animate({height: 'hide'}, 0);
    $('body').css('padding-right', '0');
		$('#blackout').hide();
		$('html').scrollTop(scrollPos);
	});
});

(function($) {
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    }
})(jQuery);
