$('#about').click(function(){
    $('[role="tab"]').attr("aria-selected", "false");
    $('[role="tab"]').removeClass("active");
    $('#navbarNavAltMarkup').removeClass("show");
    $('div[role="tabpanel"]').removeClass("active", 'show');
    $('button[aria-controls="navbarNavAltMarkup"]').attr("aria-expanded", "false");


    $('a[aria-controls="resources"]').attr("aria-selected", "true");
    $('a[aria-controls="resources"]').addClass("active");

    $('#resources').addClass("active show");

 });