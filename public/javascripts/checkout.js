Stripe.setPublishableKey('pk_test_QPaEnpmtREKiQe4xInEDxMet003WsMGXnO');

var $form=$('#checkout-form');

$form.submit(function(event){
    $('#charge-error').addClass('hidden');
    $form.find('button').prop('disabled',true);
    Stripe.card.createToken({
    number: $('#card-number').val(),
    cvc: $('#card-cvc').val(),
    exp_month: $('#card-expiry-month').val(),
    exp_year: $('#card-expiry-year').val(),
    name: $('#card-name').val()
  },StripeResponseHandler);    // Handle result.error or result.token
 return false;
});

function stripeResponseHandler(status, response) {
    if (response.error) { 
      $('#charge-error').text(response.error.message);
      $('#charge-error').removeClass('hidden');
      $form.find('button').prop('disabled', false); // Re-enable submission
  
    } else { 
  
      // Get the token ID:
      var token = response.id;
  
      
      $form.append($('<input type="hidden" name="stripeToken" />').val("token"));
  
      // Submit the form:
      $form.get(0).submit();
  
    }
  }