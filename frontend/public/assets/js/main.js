// client/src/main.js
(function () {
  /* ====================
  Preloader
  ======================= */
  window.onload = function () {
    window.setTimeout(fadeout, 300);
  };

  function fadeout() {
    const preloader = document.querySelector(".preloader");
    if (preloader) {
      preloader.style.opacity = "0";
      setTimeout(() => {
        preloader.style.display = "none";
      }, 300); // Correspond au temps de transition
    }
  }

  // =========== sticky menu
  window.onscroll = function () {
    var header_navbar = document.querySelector(".hero-section-wrapper-5 .header");
    var sticky = header_navbar ? header_navbar.offsetTop : 0;

    if (window.pageYOffset > sticky) {
      header_navbar?.classList.add("sticky");
    } else {
      header_navbar?.classList.remove("sticky");
    }

    var backToTo = document.querySelector(".scroll-top");
    if (backToTo && (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50)) {
      backToTo.style.display = "flex";
    } else if (backToTo) {
      backToTo.style.display = "none";
    }
  };

  // header-6 toggler-icon
  let navbarToggler6 = document.querySelector(".header-6 .navbar-toggler");
  var navbarCollapse6 = document.querySelector(".header-6 .navbar-collapse");

  if (navbarToggler6 && navbarCollapse6) {
    document.querySelectorAll(".header-6 .page-scroll").forEach((e) =>
      e.addEventListener("click", () => {
        navbarToggler6.classList.remove("active");
        navbarCollapse6.classList.remove("show");
      })
    );
    navbarToggler6.addEventListener("click", function () {
      navbarToggler6.classList.toggle("active");
      navbarCollapse6.classList.toggle("show");
    });
  }

  // ===== pricing-style-4 slider (si utilisé dans votre projet)
  if (typeof tns !== 'undefined') {
    tns({
      container: ".pricing-active",
      autoplay: false,
      mouseDrag: true,
      gutter: 0,
      nav: false,
      controls: true,
      controlsText: [
        '<i class="lni lni-chevron-left prev"></i>',
        '<i class="lni lni-chevron-right next"></i>',
      ],
      responsive: {
        0: { items: 1 },
        768: { items: 2 },
        992: { items: 1.2 },
        1200: { items: 2 },
      },
    });
  }

  // WOW active (si utilisé dans votre projet)
  if (typeof WOW !== 'undefined') {
    new WOW().init();
  }

  // Contact Form with jQuery (version simplifiée et sécurisée)
  if (typeof jQuery !== 'undefined') {
    jQuery(function ($) {
      'use strict';

      var contactForm = function () {
        if ($('#contactForm').length > 0) {
          $("#contactForm").validate({
            rules: {
              name: "required",
              email: {
                required: true,
                email: true,
              },
              message: {
                required: true,
                minlength: 5,
              },
            },
            messages: {
              name: "Veuillez entrer votre nom",
              email: "Veuillez entrer une adresse email valide",
              message: "Veuillez entrer un message d’au moins 5 caractères",
            },
            submitHandler: function (form) {
              var $submit = $('.submitting'),
                waitText = 'Envoi en cours...';

              $.ajax({
                type: "POST",
                url: "http://localhost:5000/api/contact",
                data: $(form).serialize(),
                beforeSend: function () {
                  $submit.css('display', 'block').text(waitText);
                },
                success: function (msg) {
                  if (msg.message === 'Message envoyé avec succès !') {
                    $('#form-message-warning').hide();
                    setTimeout(function () {
                      $('#contactForm').fadeOut();
                    }, 1000);
                    setTimeout(function () {
                      $('#form-message-success').fadeIn();
                    }, 1400);
                  } else {
                    $('#form-message-warning').html(msg.message || 'Erreur inattendue.');
                    $('#form-message-warning').fadeIn();
                    $submit.css('display', 'none');
                  }
                },
                error: function () {
                  $('#form-message-warning').html("Une erreur s’est produite. Veuillez réessayer.");
                  $('#form-message-warning').fadeIn();
                  $submit.css('display', 'none');
                },
              });
            },
          });
        }
      };
      contactForm();
    });
  }
})();