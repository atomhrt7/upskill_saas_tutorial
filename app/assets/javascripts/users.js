/* global $, Stripe */

//Document ready.
$(document).on('turbolinks:load' , function(){
  var theForm = $('#pro_form');
  var submitBtn = $('#form-submit-btn');
  
  //Set Stripe public key
  Stripe.setPublishableKey( $('meta[name="stripe-key"]').attr('content') );
  //When user clicks form submit btn,
  submitBtn.clck(function(event){
  //prevent default subission behavior.
    event.preventDefault();
    submitBtn.val("Processing").prop('disabled',true);
  //Collect the credit card fields.
  var ccNum = $('#card_number').val(), 
      cvcNum = $('card_code').val(),
      expMonth = $('card_month').val(),
      expYear  = $('card_year').val();
      
  // Use Srtripe js library to check card errors   
  var error = false;
  
  // Validat3 card number 
  (!Stripe.card.validateCardNumber(ccNum)); {
    error = true;
    alert('That credit card number appears to be invalid');
  }
  
   // Validat3 CVC number 
  (!Stripe.card.validateCVC(cvcNum)); {
    error = true;
    alert('That CVC number appears to be invalid');
  }
  
   // Validat3 exp date 
  (!Stripe.card.validateExpiry(expMonth, expYear)); {
    error = true;
    alert('The expiration date appears to be invalid');
  }
  
  if (error) {
    // If there are card errors, don't send to Stripe
    submitBtn.prop('disabled', false).val("Sign Up");
  } else {  
    //Send the card info to Stripe.
    Stripe.createToken({
      number: ccNum,
      cvc: cvcNum,
      exp_month: expMonth, 
      exp_year: expYear
    }, stripeResponseHandler);
    
  }
 
  return false;
  });
  
  
  
  //Stripe will return a card token
  function stripeResponseHandler(status, response) 
  {
   // Get token from the response
   var token = response.id;
  
  
  //Inject card token as hidden field into form.
  theForm.append( $('<input type="hidden" name="user[stripe_card_token]>').val(token) );
  //Submit form to our Rails app.
  theForm.get(0).submit(); 
  }
});