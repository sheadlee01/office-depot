$('.flipcard').on('click',
  function(e){
    $(e.target)
      .closest('article')
      .toggleClass('flipped');
  }
);